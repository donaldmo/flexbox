const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    imageUrl: String,
    imageName: String
  },
  subjects: [{
    subjectName: {
      type: String,
      required: true
    },
    subjectId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  }],
  students: [{
    name: {
      type: String,
      required: true
    },
    studentId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  }],
  teachers: [{
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

const Grade = mongoose.model('Grade', schema);
module.exports = Grade
