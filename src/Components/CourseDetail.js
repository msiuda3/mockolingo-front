import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';


async function fetchCourseDetail(id) {
    const response = await fetch(`http://localhost:8080/api/courses/details/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem('token')).token,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}

const CourseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [answers, setAnswers] = useState({});

    useEffect(() => {
        const fetchCourseDetailData = async () => {
            try {
                const data = await fetchCourseDetail(id);
                setCourse(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseDetailData();
    }, [id]);

    const handleAnswerChange = (questionId, answer) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionId]: answer
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formattedAnswers = Object.keys(answers).map(questionId => ({
            id: questionId,
            answer: answers[questionId]
        }));

        const responseBody = {
            id: course.id,
            coursename: course.coursename,
            questions: formattedAnswers
        };

        try {
            const response = await fetch('http://localhost:8080/api/courses/submit', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem('token')).token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(responseBody)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log('Submit successful:', result);

            navigate('/result/' + result.id, { state: result });
        } catch (error) {
            console.error('Submit error:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!course) {
        return <div>No course found</div>;
    }

    return (
        <div>
            <h1>{course.coursename}</h1>
            <form onSubmit={handleSubmit}>
                {course.questions.map(question => (
                    <div key={question.id}>
                        <p>{question.question}</p>
                        <label>
                            <input
                                type="radio"
                                name={question.id}
                                value="a"
                                checked={answers[question.id] === 'a'}
                                onChange={() => handleAnswerChange(question.id, 'a')}
                            />
                            {question.a}
                        </label>
                        <label>
                            <input
                                type="radio"
                                name={question.id}
                                value="b"
                                checked={answers[question.id] === 'b'}
                                onChange={() => handleAnswerChange(question.id, 'b')}
                            />
                            {question.b}
                        </label>
                        <label>
                            <input
                                type="radio"
                                name={question.id}
                                value="c"
                                checked={answers[question.id] === 'c'}
                                onChange={() => handleAnswerChange(question.id, 'c')}
                            />
                            {question.c}
                        </label>
                    </div>
                ))}
                <button type="submit">Submit Answers</button>
            </form>
        </div>
    );
};

export default CourseDetail;
