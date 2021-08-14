const createError = require('http-errors');
const User = require('../models/user.model')
const Student = require('../models/student.model')
const Workspace = require('../models/workspace.model')
const Grade = require('../models/grade.model')
const passwordGenerator = require('password-generator')

const {
  workspaceSchema, emailSchema, registerSchema,
  gradeSchema
} = require('../helpers/validation_schema')

const {
  generatePassword,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  generateConfirmToken,
  generateResetToken,
  generateInviteToken
} = require('../helpers/jwt_helper');

const { pagenate } = require('../helpers/pagenate');

const sendEmail = require('../helpers/send_email');

exports.addWorkspace = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.payload.aud })
    if (!user) throw createError.Unauthorized()

    const result = await workspaceSchema.validateAsync({
      ...req.body,
      author: {
        name: user.firstName + ' ' + user.lastName,
        userId: user._id
      }
    })

    const new_workspace = new Workspace(result);
    const save_workspace = await new_workspace.save()

    res.send(save_workspace)
  }
  catch (error) {
    console.log(error)
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
}

exports.getWorkspace = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.payload.aud })
    if (!user) throw createError.Unauthorized()

    const workspace = await Workspace.find({
      'author.userId': req.payload.aud
    })

    res.send(workspace)
  }
  catch (error) {
    console.log(error)
    if (error.isJoi === true) error.status = 422;
    next(error)
  }
}

exports.getSingleWorkspace = async (req, res, next) => {
  try {
    console.log(req.params)
    if (!req.params.id) throw createError.BadRequest(
      'Provide Worspace id on your request!'
    )

    const user = await User.findOne({ _id: req.payload.aud })
    if (!user) throw createError.Unauthorized();

    const workspace = await Workspace.findOne({
      'author.userId': req.payload.aud,
      _id: req.params.id
    })
    console.log(workspace)

    res.send(workspace)
  }
  catch (error) {
    console.log(error)
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
}

exports.addWorkspaceMember = async (req, res, next) => {
  try {
    console.log(req.body)
    if (!req.body.workspaceId) createError.BadRequest('Provide Workspace id')

    const user = await User.findOne({ _id: req.payload.aud });
    const result = await emailSchema.validateAsync({ email: req.body.email, })

    const workspace = await Workspace.findOne({ _id: req.body.workspaceId });
    console.log('workspace: ', workspace)
    if (!workspace) throw createError.BadRequest('Workspace not found')

    const visitor = await User.findOne({ email: result.email });

    const inviteToken = await generateInviteToken(req.body.workspaceId);
    console.log('inviteToken: ', inviteToken)

    sendEmail.inviteMember({
      username: user.firstName + ' ' + user.lastName,
      workspaceId: workspace._id,
      workspaceName: workspace.name,
      inviteToken: inviteToken,
      email: req.body.email
    });

    res.send({ inviteToken });
  }
  catch (error) {
    console.log(error)
    if (error.isJoi === true) error.status = 422;
    next(error);
    // console.log(error);
  }
}

exports.joinWorkspace = async (req, res, next) => {
  try {
    console.log('email: ', req.query.email)
    const workspace = await Workspace.findOne({ _id: req.payload.aud });

    if (!req.query.email) throw createError.BadRequest('Invalid Request')
    await emailSchema.validateAsync({ email: req.query.email })
    const user = await User.findOne({ email: req.query.email });
    if (!user) throw createError.NotFound('Not Found')
    console.log('user: ', user)

    if (!workspace) createError.BadRequest('Workspace not found')

    res.send(user);
  }
  catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
    console.log(error);
  }
}

exports.postJoinWorkspace = async (req, res, next) => {
  try {
    console.log('postJoinWorkspace:: body: ', req.body)
    if (!req.body.email) throw createError.BadRequest('Email is Required')
    if (!req.body.password) throw createError.BadRequest('Password is Required')

    const result = await emailSchema.validateAsync({ email: req.body.email, })
    let visitor = await User.findOne({ email: result.email });
    // console.log('visitor: ', visitor)

    if (!visitor) {
      console.log('user not register, so register a user')

      const input = await registerSchema.validateAsync({
        password: req.body.password,
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName
      })

      const register_visitor = new User({ ...input, confirmedEmail: true });
      visitor = await register_visitor.save();
    }

    /* ! req.payload.aud is the _id of the workspace decoded from jwt
     *-----------------------------------------------------------------*/
    const workspace = await Workspace.findOne({ _id: req.payload.aud });
    if (!workspace) throw createError.NotFound('Workspace Not Found!')

    const check_member = workspace.members.filter(member => (
      toString(member.userId) === toString(visitor._id)
    ))
    if (check_member.length) throw createError.BadRequest('Already joined!')

    if (workspace.members) workspace.members.push({
      userName: visitor.firstName + ' ' + visitor.lastName,
      userId: visitor._id
    })

    let join_workspace
    let save_join = await workspace.save()

    /* save workspace on user.workspaces array on db
     *----------------------------------------------*/
    if (save_join) {
      visitor.workspaces.push({
        workspaceId: workspace._id,
        workspaceName: workspace.name
      })
      join_workspace = await visitor.save()
    }

    res.send(workspace);
  }
  catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
    console.log(error);
  }
}

exports.addGrade = async (req, res, next) => {
  try {
    console.log('body: ', req.body)
    if (!req.body.workspaceId) throw createError.BadRequest(
      'Workspace Id is Required'
    )

    const user = await User.findOne({ _id: req.payload.aud })
    if (!user) throw createError.Unauthorized()

    const workspace = await Workspace.findOne({ _id: req.body.workspaceId });
    if (!workspace) throw createError.NotFound('Workspace is Not Found')
    console.log('workspace: ', workspace)

    const author = {
      name: user.firstName + ' ' + user.lastName,
      userId: user._id
    }
    console.log('author: ', author)
    const result = await gradeSchema.validateAsync({
      name: req.body.name,
      description: req.body.description,
      author: author
    })

    /* Save grade to workspace
    ------------------------------------------ */
    workspace.grades.push({ ...result, author })
    const save_grade = await workspace.save()
    console.log('save_grade: ', save_grade)

    res.send(save_grade)
  }
  catch (error) {
    console.log(error)
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
}

exports.getGrades = async (req, res, next) => {
  try {
    console.log(req.query)
    console.log(req.params)

    console.log('aud: ', req.payload.aud)
    const grades = await Grade.find()
    res.send(grades)
  }
  catch (error) {
    console.log(error)
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
}

exports.getSingleGrade = async (req, res, next) => {
  try {
    /* grade _id: (req.params.id)
    ------------------------------------------ */
    let gradeId = ''
    gradeId = req.params.id
    /* workspaceId: (req.query.workspaceId)
    ------------------------------------------ */
    let workspaceId = req.query.workspaceId
    if (!workspaceId) createError.BadRequest('Please Provide Workspace Id!')

    const workspace = await Workspace.findOne({ _id: workspaceId }).select('grades')
    if (!workspace.grades) throw createError.NotFound('Failed to load Grades')
    // console.log(workspace)

    const grade = workspace.grades.filter(grade => {
      return grade._id.toString() === (gradeId)
    })

    if (!grade.length) throw createError.NotFound()
    // console.log('grade: ', grade[0])
    res.send(grade[0])
  }
  catch (error) {
    console.log(error)
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
}

exports.getMembers = async (req, res, next) => {
  try {
    if (!req.params.id) throw createError.BadRequest('Provide workspace Id')
    let workspaceId = req.params.id

    const members = await Workspace.findOne({
      _id: workspaceId,
      "author.userId": req.payload.aud
    }).select('members')

    res.send(members)
  }
  catch (error) {
    console.log(error)
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
}

exports.addTeachers = async (req, res, next) => {
  try {
    let gradeId = req.params
    if (!gradeId) throw createError.BadRequest('Provie grade Id!')

    if (!req.body.teachers) throw createError.BadRequest('Provide a Teacher')
    let new_teachers = req.body.teachers

    const grade = await Grade.findOne({ _id: (gradeId) })
    console.log('grade: ', grade)

    if (!grade) throw createError.NotFound('Grade is Not Found')
    let { teachers } = grade

    if (teachers) grade.teachers = [...teachers, ...new_teachers]
    const add_teachers = await grade.save()

    res.send(add_teachers.teachers)
  }
  catch (error) {
    console.log(error)
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
}

// exports.addStudents = async (req, res, next) => {
//   try {
//     console.log(req.params)
//     console.log(req.body)

//     if (!req.body.teachers) throw createError.BadRequest('Provide a Teacher')
//     let new_teachers = req.body.teachers

//     const grade = await Grade.findOne({ _id: (req.params.id) })
//     console.log('grade: ', grade)

//     if (!grade) throw createError.NotFound('Grade is Not Found')
//     let { teachers } = grade

//     if (teachers) grade.teachers = [...teachers, ...new_teachers]
//     const add_teachers = await grade.save()

//     res.send(add_teachers.teachers)
//   }
//   catch (error) {
//     console.log(error)
//     if (error.isJoi === true) error.status = 422;
//     next(error);
//   }
// }

exports.addWorkspaceStudent = async (req, res, next) => {
  try {
    console.log('body: ', req.body)
    // console.log(req.params)
    if (!req.body.id) createError.BadRequest('Provide Workspace id')

    const workspace = await Workspace.findOne({ _id: req.params.id }).select('students name')
    if (!workspace) throw createError.BadRequest('Workspace not found')
    if (!workspace.students) throw createError.NotFound('Error getting students from Workspace')

    const gen_password = passwordGenerator()
    const hashedPassword = await generatePassword(gen_password);
    const confirmToken = await generateConfirmToken(req.body.email);

    const check_student = workspace.students.filter(student => (
      student.email === req.body.email
    ))

    if (check_student.length) throw createError.BadRequest('Already joined!')

    workspace.students.push({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword
    })

    save_student = await workspace.save()
    console.log('save_student: ', save_student)

    sendEmail.inviteStudent({
      workspaceName: workspace.name,
      confirmToken: confirmToken,
      workspaceId: workspace._id,
      email: req.body.email
    });

    return res.send(workspace.students)
  }
  catch (error) {
    console.log(error)
    if (error.isJoi === true) error.status = 422;
    next(error);
    // console.log(error);
  }
}

exports.studentJoinWorkspace = async (req, res, next) => {
  try {

    /* req.payload.aud is the student email decoded from jww
     */
    const email = req.payload.aud

    const workspaceId = req.query.workspaceId
    if (!workspaceId) throw createError.BadRequest('Workspace Id is Required!')
    if (!email) throw createError.Unauthorized('')

    console.log('email: ', email)
    const workspace = await Workspace.findOne({ _id: workspaceId }).select('students')
    if (!workspace.students) throw createError.NotFound('Students Are Not Found')

    const check_student = workspace.students.filter(student => (
      toString(student.email) === toString(email)
    ))

    if (!check_student) throw createError.NotFound('This Student is Not Found')

    res.send(check_student[0]);
  }
  catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
    console.log(error);
  }
}

exports.postStudentJoinWorkspace = async (req, res, next) => {
  try {
    const email = req.body.email
    const workspaceId = req.params.id
    console.log('workspaceId: ', workspaceId)
    if (!workspaceId) throw createError.BadRequest('Workspace Id is Required!')
    if (!email) throw createError.Unauthorized()

    const workspace = await Workspace.findOne({ _id: workspaceId }).select('students')
    if (!workspace.students) throw createError.NotFound('Students Are Not Found')

    const check_student = workspace.students.filter(student => (
      toString(student.email) === toString(email)
    ))

    if (!check_student) throw createError.NotFound('This Student is Not Found')
    if (check_student[0].confirmJoin === true) {
      throw createError.NotFound("You have already joined!")
    }

    console.log('check_student: ', check_student[0])
    const hashedPassword = await generatePassword(req.body.password);
    check_student[0].password = hashedPassword
    check_student[0].confirmJoin = true

    const students = workspace.students.filter(student => (
      toString(student.email) !== toString(email)
    ))

    students.push(check_student[0])
    workspace.students = students
    await workspace.save()

    res.send(check_student[0]);
  }
  catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
    console.log(error);
  }
}

exports.getAddLearner = async (req, res, next) => {
  try {
    // console.log(req.query)
    const { gradeId } = req.query
    if (!gradeId) throw createError.BadRequest('Grade Id is Required!')

    if (!req.params.id) throw createError.BadRequest('Workspace Id is Required!')
    let workspaceId = req.params.id

    const workspace = await Workspace.findOne({
      _id: workspaceId,
      "author.userId": req.payload.aud
    }).select('students grades name')

    const this_grade = workspace.grades.filter(grade => (
      grade._id.toString() === gradeId
    ))
console.log('gradeId: ', gradeId)
    // console.log(this_grade[0])

    const students = []

     workspace.students.map((student) => {
      if (student.gradeJoined && student.gradeJoined.length) {
        // this student joined some grade
        console.log( student.gradeJoined)
      }
      else {
        // this student has not joined any grade
        students.push(student)
      }

    })

    // console.log('student: ', students)

    // const this_grade = workspace.grades.filter(grade => {
    //   if (grade._id.toString() === gradeId) {

    //     return true
    //   }
    // })



    // this_grade.map(grade => {
    //   if (grade.students.length) {
    //     // grade.students

    //     const notJoined = workspace.students.filter((student, index) => {
    //       if (student.gradeJoined.length < 1) return true

    //       if (workspace.grades[index] && workspace.grades[index].students && workspace.grades[index].students.length) {
    //         workspace.grades[index].students.filter(st => {
    //           if(st.studentId.toString() === student._id.toString()) {
    //             console.log(gradeId)
    //             console.log('this student joined: ', student._id)
    //           }
    //         })
    //       }

    //       if (student.gradeJoined.length && student.gradeJoined[index]) {
    //         // console.log('student: ', student.gradeJoined[index])
    //         // console.log('student gradeId: ', student.gradeJoined[index].gradeId)
    //         // console.log('this gradeId: ', gradeId)
    //         if (student.gradeJoined[index].gradeId !== gradeId) return true
    //       }
    //       else return true
    //     })

    //     // console.log('notJoined: ', notJoined)
    //     /* return students not joined
    //      */
    //     if (notJoined.length) students = notJoined
    //     // continue here...
    //     // console.log('gradeJoinedz: ', gradeJoined)
    //   }
    //   else {
    //     students = workspace.students
    //   }
    // })

    // workspace.students.map(student => {
    //   if (!student.gradeJoined.length) {
    //     students.push(student)
    //   }

    //   else {
    //     student.gradeJoined.map(grade => {
    //       if (toString(grade.gradeId) !== toString(gradeId)) 
    //         students.push(student)
    //     })
    //   }
    // })

    // if (!students.length) throw createError.NotFound(
    //   'Could not find Student who have not joind this Grade!'
    // )

    // let not_joined = workspace.students.filter(student => student.gradeJoined === false)
    // console.log(not_joined)

    res.send({ students })
  }
  catch (error) {
    console.log(error)
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
}

exports.postAddLearner = async (req, res, next) => {
  try {
    /*  req.params.id: workspaceId
     ------------------------------------*/
    const workspaceId = req.params.id
    const { gradeId, learners } = req.body
    if (!workspaceId) throw create.BadRequest('Provide a workspace Id')
    if (!learners) throw createError.BadRequest('Learners are required!')

    const workspace = await Workspace.findOne({ _id: workspaceId })
      .select('students name grades')
    let { grades, students } = workspace

    if (!students) throw createError.NotFound('Failed to load Students')
    if (!grades) throw createError.NotFound('Failed to load Grades')

    let get_grade = grades.filter(grade => (
      toString(grade._id) === toString(gradeId)
    ))

    if (!get_grade.length) throw createError.NotFound('This Grade is Found')

    learners.map(learner => {
      console.log('learner: ', learner)
      students.map(student => {
        if (toString(student._id) === toString(learner._id)) {
          student.gradeJoined.push({
            gradeName: get_grade[0].name,
            gradeId: get_grade[0]._id,
            workspaceId: workspaceId
          })
        }
      })

      grades.map(grade => {
        if (toString(grade._id) === toString(gradeId)) {
          grade.students.push({
            studentName: learner.firstName + " " + learner.lastName,
            studentId: learner._id
          })
        }
      })
    })

    let join_grade = await workspace.save()

    res.send({ data: 'Student Added to Grade' })
  }
  catch (error) {
    console.log(error)
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
}