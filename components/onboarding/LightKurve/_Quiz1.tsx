import { useSession } from "@supabase/auth-helpers-react";
import React, { useState } from "react";
import Login from "../../../pages/login";

enum QuizStatus {
  NotStarted,
  InProgress,
  Completed,
}

interface QuizQuestion {
  questionText: string;
  imageUrl: string;
  isCorrect: boolean;
}

const quizQuestions: QuizQuestion[] = [
  {
    questionText:
      "❓ - This light curve shows the brightness of a star monitored by NASA's TESS mission. \n Do you notice any dips that could indicate a transiting exoplanet?",
    imageUrl:
      "https://qwbufbmxkjfaikoloudl.supabase.co/storage/v1/object/public/media/quiz/Capture2.PNG.png",
    isCorrect: false,
  },
  {
    questionText:
      "❓ - Do you see a potential exoplanet transit in this light curve? Which parts indicate the transit?",
    imageUrl:
      "https://qwbufbmxkjfaikoloudl.supabase.co/storage/v1/object/public/media/quiz/Capture3.PNG.png",
    isCorrect: true,
  },
  {
    questionText:
      "❓ - This one is a bit tricky. Does it have a clear exoplanet transit or not?",
    imageUrl:
      "https://qwbufbmxkjfaikoloudl.supabase.co/storage/v1/object/public/media/quiz/Capture4.PNG.png",
    isCorrect: false,
  },
  {
    questionText:
      "❓ - What's your classification? Exoplanet or false positive?",
    imageUrl:
      "https://qwbufbmxkjfaikoloudl.supabase.co/storage/v1/object/public/media/quiz/Capture5.PNG.png",
    isCorrect: true,
  },
];

/* const quizImages: QuizImage[] = [
     {
         // imageUrl: 'Quiz/image1.png',
         imageUrl: 'https://file.notion.so/f/s/5044406f-a71e-4b3c-83ce-4b78886b113b/Capture2.png?id=d0586e06-1251-4906-90d6-160b85603a0e&table=block&spaceId=215717d6-87ba-4724-a957-c84891dfbb82&expirationTimestamp=1692259200000&signature=sPtXmNUXFgRSCyC7klA0MhWgtXkrI2nDENjW0rs5ITU&downloadName=Capture2.PNG.png',
         isCorrect: false,
     }, */

const LightkurveQuiz: React.FC = () => {
  const session = useSession();

  const [quizStatus, setQuizStatus] = useState(QuizStatus.NotStarted);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [userAnswer, setUserAnswer] = useState<boolean | null>(null);

  const startQuiz = () => {
    setQuizStatus(QuizStatus.InProgress);
  };

  const handleAnswer = () => {
    const currentQuestionObj = quizQuestions[currentQuestion];
    if (userAnswer === currentQuestionObj.isCorrect) {
      setCorrectAnswers(correctAnswers + 1);
    }

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizStatus(QuizStatus.Completed);
    }

    setUserAnswer(null);
  };

  if (quizStatus === QuizStatus.NotStarted) {
    return (
      <div className="flex justify-center items-center h-screen">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={startQuiz}
        >
          Start Quiz
        </button>
      </div>
    );
  }

  if (quizStatus === QuizStatus.InProgress) {
    const currentQuestionObj = quizQuestions[currentQuestion];

    return (
      <div className="flex flex-col justify-center items-center">
        <p className="text-lg mb-4">{currentQuestionObj.questionText}</p>
        <img
          src={currentQuestionObj.imageUrl}
          alt="Quiz"
          className="max-w-4xl max-h-200 mb-4"
        />
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={userAnswer === true}
              onChange={() => setUserAnswer(true)}
            />
            <span className="ml-2">YES</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={userAnswer === false}
              onChange={() => setUserAnswer(false)}
            />
            <span className="ml-2">NO</span>
          </label>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleAnswer}
          >
            Submit
          </button>
        </div>
      </div>
    );
  }

  if (quizStatus === QuizStatus.Completed) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-2xl">
          Congratulations! You got {correctAnswers} out of{" "}
          {quizQuestions.length} correct.
        </p>
      </div>
    );
  }

  return null;
};

export default LightkurveQuiz;