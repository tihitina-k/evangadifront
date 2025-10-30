import express from "express";
import { summarizeQuestion } from "../utility/gemini.js";
import Question from "../models/Question.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { userid, title, description } = req.body;

    // Use Gemini AI to auto-summarize question
    let summarizedTitle = title;
    let summarizedDescription = description;

    try {
      const aiContent = await summarizeQuestion(title, description);
      if (aiContent) {
        const splitContent = aiContent.split("\n");
        summarizedTitle = splitContent[0] || title;
        summarizedDescription = splitContent[1] || description;
      }
    } catch (aiError) {
      console.error(
        "AI summarization failed, using original content:",
        aiError
      );
    }

    // Create the question without tag
    const newQuestion = await Question.create({
      userid,
      title: summarizedTitle,
      description: summarizedDescription,
    });

    res.status(201).json({
      message: "Question created successfully",
      question: newQuestion,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create question" });
  }
});

export default router;
