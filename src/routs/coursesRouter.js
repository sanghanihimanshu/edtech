import { Router } from 'express';
import {Course} from '../db/schema/courses.js';
import { User } from '../db/schema/user.js';
const courseRouter = Router();


const isTutor = async (req, res, next) => {
    const user = await User.findOne({username:req.body.username}); 
    if (!user || !user.isTutor) {
        return res.status(403).json({ message: 'You are not authorized to create a course' });
    }
    next();
};

courseRouter.post('/new', isTutor, async (req, res) => {
    try {
        const newCourse = await Course.create(req.body);
        res.status(201).json(newCourse);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

courseRouter.get('/get', async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
courseRouter.get('/get/:username', async (req, res) => {
    try {
        const course = await Course.find({username:req.params.username});
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

courseRouter.patch('/update/:id', async (req, res) => {
    try {
        const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.json(updatedCourse);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

courseRouter.delete('/delete/:id', async (req, res) => {
    try {
        const courseId = req.params.id;
        const username = req.body.username;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        if (course.username !== username) {
            return res.status(403).json({ message: 'You are not authorized to delete this course' });
        }

        const deletedCourse = await Course.findByIdAndDelete(courseId);
        if (!deletedCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default courseRouter;
