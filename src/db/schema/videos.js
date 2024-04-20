import { Schema, model } from 'mongoose';

const videoSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    coursesId: {
        type: Schema.Types.ObjectId,
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

export const Video = model('Video', videoSchema);

