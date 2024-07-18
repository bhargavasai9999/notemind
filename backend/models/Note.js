import mongoose from "mongoose";

const noteSchema = mongoose.Schema({
    title: { type: String, required: true },

    content: { type: String, required: true },

    tags: {
       type: [String],
       default: [],
       validate: [tags => tags.length <= 9, 'You can only have up to 9 tags'] 
      },

    archived: { type: Boolean, default: false },

    trashed: { type: Boolean, default: false },

    backgroundColor: { type: String, default: '#ffffff' },

    reminder: { type: Date, default: null },

    user: { type: mongoose.SchemaTypes.ObjectId, ref: 'User', required: true },

  }, { timestamps: true });


export const Note=mongoose.model('Note',noteSchema)
