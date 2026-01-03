const mongoose = require("mongoose");
const { Schema } = mongoose;

const articles_schema = new Schema({
    title: {
        type: String,
        require: true
    },
    slug: {
        type: String,
        required: true
    },
        category: {
        type: mongoose.ObjectId,
        ref: "Categories",
        required: true
    },
    img: {
        type: String,
        required: true
    },
    abstract: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    createdAtFormat: {
        type: String,
        required: true
    }
})

const Articles = mongoose.model("Articles", articles_schema);

module.exports = Articles;