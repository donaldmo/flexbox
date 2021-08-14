const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    imageName: {
      type: String,
      default: 'Default'
    },
    imageUrl: {
      type: String,
      default: 'https://source.unsplash.com/random?student'
    }
  },
  members: [{
    userName: {
      type: String,
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  }],
  grades: [
    {
      name: {
        type: String,
        required: true
      },
      description: {
        type: String,
      },
      teachers: [
        {
          name: {
            type: String,
            required: true
          },
          userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
          }
        }
      ],
      students: [
        {
          studentName: {
            type: String,
            required: true
          },
          studentId: {
            type: Schema.Types.ObjectId,
            required: true,
          }
        }
      ],
      author: {
        name: {
          type: String,
          required: true
        },
        userId: {
          type: Schema.Types.ObjectId,
          required: true,
        }
      },
    }
  ],
  author: {
    name: {
      type: String,
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  },
  students: [
    {
      firstName: {
        type: String,
        required: true
      },
      lastName: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true
      },
      password: {
        type: String,
        required: true
      },
      confirmJoin: {
        type: Boolean,
        default: false
      },
      gradeJoined: [
        {
          gradeName: {
            type: String,
            required: true
          },
          gradeId: {
            type: Schema.Types.ObjectId,
            required: true,
          },
          workspaceId: {
            type: Schema.Types.ObjectId,
            required: true,
          }
        }
      ],
    }
  ]
},
  { timestamps: true });

const WorkSpace = mongoose.model('WorkSpace', schema);
module.exports = WorkSpace
