import { useState } from "react";
import { questions } from "../../assets/question";
import { useNavigate } from "react-router-dom";

const Questionnaire = () => {
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(0);

  const handleAnswer = (questionId, answer) => {
    // save responses
    setAnswers((prev) => ({
      // copy previous responses
      ...prev,
      // dynamic key to add a new response
      [questionId]: answer,
    }));
    setStep((prev) => prev + 1);
  };

  const currentQuestion = questions[step];
  const navigate = useNavigate();

  return currentQuestion ? (
    <div>
      <h2>{currentQuestion.question}</h2>
      {currentQuestion.options.map((option) => (
        <button key={option} onClick={() => handleAnswer(questions.id, option)}>
          {option}
        </button>
      ))}
    </div>
  ) : (
    navigate("/routine", { state: answers })
  );
};

export default Questionnaire;
