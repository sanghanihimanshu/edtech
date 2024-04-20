import { Router } from 'express';
import { Video } from '../db/schema/videos.js';
const videoRouter = Router();


videoRouter.post('/new', async (req, res) => {
    try {
        const { name, description, coursesId, tags } = req.body;
        const newVideo = new Video({
            name,
            description,
            coursesId,
            tags,
        });
        await newVideo.save();
        res.status(201).json({ message: 'Video created successfully', video: newVideo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create video' });
    }
});

videoRouter.get('/get', async (req, res) => {
    try {
        const videos = await Video.find({coursesId:req.body.coursesId,});
        res.status(200).json({ videos });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch videos' });
    }
});

export default videoRouter