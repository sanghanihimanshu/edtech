import { Schema, model } from "mongoose";

const userCourseSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    courseId: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    watched: {
        type: [{
            id: {
                type: Schema.Types.ObjectId,
                required: true
            },
            marks: {
                type: Number,
                required: true,
                default: 0
            }
        }]
    },
    purchased_at: {
        type: Date,
        default: Date.now
    }
});

export const UserCourse = model('UserCourse', userCourseSchema);