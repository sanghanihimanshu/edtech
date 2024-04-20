import { Router } from "express";
import { UserCourse } from "../db/schema/usercourses.js";

const userCourseRouter = Router();

userCourseRouter.post("/new", async (req, res) => {
  try {
    const newUserCourse = new UserCourse(req.body);
    const savedUserCourse = await newUserCourse.save();
    res.status(201).json(savedUserCourse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

userCourseRouter.get("/get", async (req, res) => {
  try {
    const userCourses = await UserCourse.find({
      courseId: req.query.courseId,
      userId: req.query.courseId,
    });
    res.json(userCourses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

userCourseRouter.patch("/update", async (req, res) => {
  try {
    const { courseId, userId, watched } = req.body;

    const userCourse = await UserCourse.findOne({
      courseId: courseId,
      userId: userId,
      watched: { $elemMatch: { id: watched[0].id } }
    });

    if (userCourse) {
      return res.status(400).json({ message: "Video already watched" });
    }

    const updatedUserCourse = await UserCourse.findOneAndUpdate(
      {
        courseId: courseId,
        userId: userId,
      },
      {
        $addToSet: {
          watched: watched,
        },
      },
      { new: true }
    );

    res.json(updatedUserCourse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


export default userCourseRouter;
