import React, { useState, useEffect, useCallback } from "react";

const QuizApp = () => {

    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [timer, setTimer] = useState(10);
    const [quizEnded, setQuizEnded] = useState(false);
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [resp, setResp] = useState([]);

    const handleNextQuestion = useCallback(() => {

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setTimer(10);
            setCorrectAnswer("")
        } else {
            setQuizEnded(true);
        }
    }, [currentQuestionIndex, questions]);

    useEffect(() => {
        async function fetchQuestions() {
            try {
                const response = await fetch("https://opentdb.com/api.php?amount=10&type=multiple");
                const data = await response.json();
                if (data.results) {
                    setQuestions(data.results);
                } else {
                    console.error("Error: No results found in API response");
                }
            } catch (error) {
                console.error("Error fetching questions:", error);
            }
        }
        fetchQuestions();
    }, []);

    useEffect(() => {
        const timerId = setInterval(() => {
            if (timer > 0) {
                setTimer(timer - 1);
            } else {
                handleNextQuestion();
            }
        }, 1000);

        return () => clearInterval(timerId);
    }, [timer, handleNextQuestion]);

    const skipQuestion = () => {
        handleNextQuestion();
    };

    const handleAnswerClick = (isCorrect, correctAnswer) => {
        if (isCorrect) {
            setScore(score + 1);
        }
        const response = {
            question: questions[currentQuestionIndex].question,
            userAnswer: isCorrect ? correctAnswer : "Incorrect",
            correctAnswer: correctAnswer
        };
        setResp([...resp, response]);
        setCorrectAnswer(`Correct Answer :-  ${correctAnswer}`);
        setTimeout(handleNextQuestion, 1900);
    };

    if (quizEnded) {
        return (
            <div className="quiz-container">
                <h1>Quiz Ended</h1>
                <p>Your score: {score}/{questions.length}</p>
                <h2>Attempted Questions:</h2>
                {resp.map((response, index) => (
                    <div key={index}>
                        <p><strong>Question:</strong> {response.question}</p>
                        <p><strong>Your Answer:</strong> {response.userAnswer}</p>
                        <p><strong>Correct Answer:</strong> {response.correctAnswer}</p>
                        <hr />
                    </div>
                ))}
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];

    if (!currentQuestion) {
        return <div className="container"><div className="loading__main"></div></div>;
    }

    const incorrectAnswers = currentQuestion.incorrect_answers || [];

    return (
        <div className="quiz-container">
            <h1>Quiz App</h1>
            <p>Current score:- {score}/{questions.length}</p>
            <div>
                <p>Q.{currentQuestionIndex + 1} :- {currentQuestion.question}</p>
                <ul>
                    <li>
                        <button onClick={() => handleAnswerClick(true, currentQuestion.correct_answer)}>
                            {currentQuestion.correct_answer}
                        </button>
                    </li>
                    {incorrectAnswers.map((answer, index) => (
                        <li key={index}>
                            <button onClick={() => handleAnswerClick(false, currentQuestion.correct_answer)}>{answer}</button>
                        </li>
                    ))}
                </ul>

                <p style={{ backgroundColor: "green", margin: "0 100px" }}> {correctAnswer}</p>

                <p>Time left: {timer} seconds</p>

                <button onClick={skipQuestion} style={{ backgroundColor: "red" }}>Skip Question</button>
            </div>
        </div>
    );
};

export default QuizApp;