import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

const ResultPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams(); // Pobranie id z URL, jeśli jest dostępne
    const [result, setResult] = useState(location.state || null);
    const [loading, setLoading] = useState(!result);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!result && id) {
            const fetchResultData = async () => {
                try {
                    const response = await fetch(`http://localhost:8080/api/courses/result/${id}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem('token')).token,
                            'Content-Type': 'application/json'
                        }
                    });
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await response.json();
                    setResult(data);
                } catch (error) {
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchResultData();
        }
    }, [result, id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!result) {
        return <div>No result data available.</div>;
    }

    const handleRetakeTest = () => {
        navigate(`/course/${result.id}`);
    };

    return (
        <div>
            <h1>Test Result for {result.coursename}</h1>
            <ul>
                {result.questions.map(question => (
                    <li key={question.id}>
                        {question.question} - Your answer: {question.answer} ({question.correct ? 'Correct' : `Incorrect, correct answer: ${question.correctAnswer}`})
                    </li>
                ))}
            </ul>
            <p>Score: {result.score}</p>
            <div>
                <Link to="/">
                    <button>Back to Courses</button>
                </Link>
                <button onClick={handleRetakeTest}>Retake Test</button>
            </div>
        </div>
    );
};

export default ResultPage;
