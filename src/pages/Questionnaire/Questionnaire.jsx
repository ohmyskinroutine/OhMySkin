import "./Questionnaire.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { questions } from "../../assets/question";
// import { IoArrowUpOutline } from "react-icons/io5";
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

  // Fonction qui permet de revenir en arrière et le Math.max permet de ne pas avoir de step négatif
  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const currentQuestion = questions[step];
  const navigate = useNavigate();
  const progress = ((step + 1) / questions.length) * 100;

  return currentQuestion ? (
    <main className="question-page">
      <div className="container">
        <section className="question-page-blocs">
          {/* Condition qui permet l'affichage du bouton retour seulement si on est pas à la 1ère question */}
          {step > 0 && (
            <button onClick={handleBack}>
              {/* <IoArrowUpOutline />*/} ← Retour
            </button>
          )}
          <Question question={currentQuestion} onAnswer={handleAnswer} />
          <div className="progress-bar-wrapper">
            <div className="progress-bar">
              <div
                className="progress-bar__fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  ) : (
    navigate("/routine", { state: answers })
  );
};

export default Questionnaire;
