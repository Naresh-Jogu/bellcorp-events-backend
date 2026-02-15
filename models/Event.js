const mongoose = require("mongoose")

const eventSchema = new mongoose.Schema({
    name:{type:String, required: true},
    organizer: {type: String, required: true},
    location: {type:String, required: true},
    datetime: {type: Date, required: true},
    description: {type: String},
    capacity: {type: Number, required: true},
    registeredCount: {type: Number, default: 0},
    category: {type: String}

}, {timestamps: true})

module.exports = mongoose.model("Event", eventSchema)