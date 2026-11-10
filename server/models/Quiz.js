import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true,
    },
    questions: [
      {
        question: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctAnswer: { type: String, required: true },
        explanation: { type: String, default: "" },
      },
    ],
    totalQuestions: {
      type: Number,
      default: 0,
    },
    userAnswers: [
      {
        questionIndex: { type: Number, required: true },
        selectedAnswer: { type: String, required: true },
        isCorrect: { type: Boolean, required: true },
        answeredAt: { type: Date, default: Date.now },
      },
    ],
    score: {
      type: Number,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    attempts: [
      {
        score: { type: Number, required: true },
        totalQuestions: { type: Number, required: true },
        completedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

quizSchema.index({ userId: 1, documentId: 1 });
const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;