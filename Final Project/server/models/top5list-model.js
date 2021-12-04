const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Top5ListSchema = new Schema(
    {
        name: { type: String, required: true },
        items: { type: [String], required: true },
        ownerEmail: { type: String, required: true },
        ownerFirstName: { type: String, required: true },
        ownerLastName: { type: String, required: true },
        numLikes: { type: Number, required: true },
        numDislikes: { type: Number, required: true },
        numViews: { type: Number, required: true }, 
        isPublished: { type: Boolean, required: true },
        comments: { type: [String], required: true }
    },
    { timestamps: true },
)

module.exports = mongoose.model('Top5List', Top5ListSchema)
