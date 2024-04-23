import { Router } from "express";
import { UserCourse } from "../db/schema/usercourses.js";

const userCourseRouter = Router();

userCourseRouter.post("/new", async (req, res) => {
  console.log(req.body);
  try {
    const alreadyEnrolled =await UserCourse.find(req.body);
    if(alreadyEnrolled.length>0 ){
      return res.status(300).json({ message: "Video already enrolled" });
    }
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
      userId: req.query.userId,
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
