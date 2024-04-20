import { Schema, model } from "mongoose";

const courseSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

export const Course = model('Course', courseSchema);

