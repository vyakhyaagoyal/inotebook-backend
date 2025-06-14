import { Schema, model } from 'mongoose';

const NotesSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref:'User'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  tag: {
    type: String,
    default: "General"
  },
  date: {
    type: Date,
    default: Date.now
  }
});

export default model('Notes', NotesSchema)