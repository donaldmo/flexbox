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
      gradeName: {
        type: String,
        required: true
      },
      gradeId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Grade'
      }
    }
  ],
  students: [
    {
      userName: {
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
  }
},
  { timestamps: true });

const Workspace = mongoose.model('Workspace', schema);
module.exports = Workspace
