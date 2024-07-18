import React, { useState, useEffect, useCallback } from "react";

const QuizApp = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [timer, setTimer] = useState(10);
    const [quizEnded, setQuizEnded] = useState(false);

    const handleNextQuestion = useCallback(() => {

        if (currentQuestionIndex < questions.length - 1) {

            setCurrentQuestionIndex(currentQuestionIndex + 1);

            setTimer(10);
        } else {

            setQuizEnded(true);
        }
    }, [currentQuestionIndex, questions]);


    useEffect(() => {
        async function fetchQuestions() {
            try {
                const response = await fetch(
                    "https://opentdb.com/api.php?amount=10&type=multiple"
                );
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


    const handleAnswerClick = (isCorrect) => {
        if (isCorrect) {

            setScore(score + 1);
        }

        handleNextQuestion();
    };


    if (quizEnded) {
        return (
            <div className="quiz-container">
                <h2>Quiz Ended</h2>
                <p>Your score: {score}/{questions.length}</p>
            </div>
        );
    }


    const currentQuestion = questions[currentQuestionIndex];


    if (!currentQuestion) {
        return <div className="loading__main">Loading...</div>;
    }


    const incorrectAnswers = currentQuestion.incorrect_answers || [];

    return (
        <div className="quiz-container">
            <h1>Quiz App</h1>
            <div>
                <h2>Question {currentQuestionIndex + 1}</h2>
                <p>{currentQuestion.question}</p>
                <ul>

                    {incorrectAnswers.map((answer, index) => (
                        <li key={index}>
                            <button onClick={() => handleAnswerClick(false)}>{answer}</button>
                        </li>
                    ))}

                    <li>
                        <button onClick={() => handleAnswerClick(true)}>
                            {currentQuestion.correct_answer}
                        </button>
                    </li>
                </ul>

                <p>Time left: {timer} seconds</p>

                <button onClick={skipQuestion}>Skip Question</button>
            </div>
        </div>
    );
};

export default QuizApp;