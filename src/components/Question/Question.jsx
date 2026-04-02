import "./Question.css";

const Question = ({ question, onAnswer }) => {
  return (
    <div className="question-block">
      <h2>{question.question}</h2>
      <div>
        {question.options.map((option) => (
          <button key={option} onClick={() => onAnswer(question.id, option)}>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Question;
