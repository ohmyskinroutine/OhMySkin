const Question = ({ question, onAnswer }) => {
  return (
    <div>
      <h2>{question.question}</h2>

      {question.options.map((option) => (
        <button key={option} onClick={() => onAnswer(question.id, option)}>
          {option}
        </button>
      ))}
    </div>
  );
};

export default Question;
