const express = require('express');
const router = express.Router();
const workspaceCtrl = require('../controllers/workspace.controller')
const { verifyAccessToken, verifyInviteToken, verifyConfirmToken } = require('../helpers/jwt_helper')

router.get('/', verifyAccessToken, workspaceCtrl.getWorkspace)
router.get('/get/:id', verifyAccessToken, workspaceCtrl.getSingleWorkspace)

router.post('/add', verifyAccessToken, workspaceCtrl.addWorkspace)
router.post('/invite-member', verifyAccessToken, workspaceCtrl.addWorkspaceMember)

router.post('/add-student/:id', verifyAccessToken, workspaceCtrl.addWorkspaceStudent)

/* verifyConrirmTokent to get email
 * Post route don't require auth
 */
router.get('/join-student', verifyConfirmToken, workspaceCtrl.studentJoinWorkspace)
router.post('/join-student', workspaceCtrl.postStudentJoinWorkspace)

router.get('/join-workspace', verifyInviteToken, workspaceCtrl.joinWorkspace)
router.post('/join-workspace', verifyInviteToken, workspaceCtrl.postJoinWorkspace)

router.post('/add-grade', verifyAccessToken, workspaceCtrl.addGrade)
router.get('/grades', verifyAccessToken, workspaceCtrl.getGrades)

/* @param: id: gradeId
 */
router.get('/grade/:id', verifyAccessToken, workspaceCtrl.getSingleGrade)

router.get('/members/:id', verifyAccessToken, workspaceCtrl.getMembers)
// router.get('/member/:id', verifyAccessToken, workspaceCtrl.getSingleGrade)

/* 
 * @param: id: gradeId
 */
router.post('/grade/add-teacher/:id', verifyAccessToken, workspaceCtrl.addTeachers)

/* 
 * GET workspace students 
 * @param: workspace id
 * @query: gradeId
 * only students who have not joined a grade
 */
router.get('/grade/add-learner/:id', verifyAccessToken, workspaceCtrl.getAddLearner)

/* POST workspace learner to grade 
 * @param: workspace id
 */
router.post('/grade/add-learner/:id', verifyAccessToken, workspaceCtrl.postAddLearner)

module.exports = router