import { Router } from 'express';
import { Video } from '../db/schema/videos.js';
import { Queue } from 'bullmq';
import { PutObjectCommand, S3Client} from '@aws-sdk/client-s3';
import { config } from 'dotenv';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
const videoRouter = Router();
config()
const queue = new Queue('process', {
    connection: {
        host: "localhost",
        port: 6379
    }
});
export const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY
    },
});
async function generatePreSignedUrl(bucketName, objectKey, expirationInSeconds) {
    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: objectKey,
    });

    try {
        const url = await getSignedUrl(s3Client,command, { expiresIn: expirationInSeconds });
        return url;
    } catch (error) {
        console.error("Error generating pre-signed URL:", error);
        return null;
    }
}


videoRouter.post('/new', async (req, res) => {
    try {
        const { name, description, coursesId, tags } = req.body;
        if (!name || !description || !coursesId || !tags) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const newVideo = new Video({
            name,
            description,
            coursesId,
            tags,
        });
        generatePreSignedUrl(process.env.AWS_BUCKET_NAME,newVideo._id+'.mp4', 3600)
        .then(async (url) => {
                await newVideo.save();
                res.status(201).json({ message: 'Video created successfully', video: {id:newVideo._id,url} });
            })
            .catch((error) => {
                res.status(201).json({ message: 'Video created failed :'+ error.message });

            });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create video' });
    }
});

videoRouter.post('/get', async (req, res) => {
    console.log(req.body);
    try {
        const videos = await Video.find(req.body)
        console.log(videos);
        res.status(200).json(videos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch videos' });
    }
});
videoRouter.post('/process', async (req, res) => {
    try {
        queue.add('process', { "key": req.body.videoId })
        res.status(200).json({ message: 'Process Started' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch videos' });
    }
});

export default videoRouter