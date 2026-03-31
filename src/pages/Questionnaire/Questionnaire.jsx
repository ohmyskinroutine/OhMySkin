import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { questions } from "../../assets/question";
import Question from "../../components/Question/Question";

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
    <Question question={currentQuestion} onAnswer={handleAnswer} />
  ) : (
    navigate("/routine", { state: answers })
  );
};

export default Questionnaire;
