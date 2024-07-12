import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditCourse = () => {
    const { id } = useParams();
    const [coursename, setCoursename] = useState('');
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/courses/edit/${id}`, {
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
                setCoursename(data.coursename);
                setQuestions(data.questions);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseData();
    }, [id]);

    const handleCourseNameChange = (event) => {
        setCoursename(event.target.value);
    };

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = value;
        setQuestions(newQuestions);
    };

    const handleAddQuestion = () => {
        setQuestions([...questions, { question: '', a: '', b: '', c: '', correctAnswer: '' }]);
    };

    const handleRemoveQuestion = (index) => {
        const newQuestions = questions.filter((_, i) => i !== index);
        setQuestions(newQuestions);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const updatedCourse = {
            id,
            coursename,
            questions
        };

        try {
            const response = await fetch(`http://localhost:8080/api/courses/save`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem('token')).token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedCourse)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log('Course updated successfully:', result);

            navigate('/');
        } catch (error) {
            console.error('Error updating course:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Edit Course</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Course Name:
                        <input type="text" value={coursename} onChange={handleCourseNameChange} required />
                    </label>
                </div>
                {questions.map((question, index) => (
                    <div key={index}>
                        <h3>Question {index + 1}</h3>
                        <label>
                            Question:
                            <input
                                type="text"
                                value={question.question}
                                onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                                required
                            />
                        </label>
                        <label>
                            Answer A:
                            <input
                                type="text"
                                value={question.a}
                                onChange={(e) => handleQuestionChange(index, 'a', e.target.value)}
                                required
                            />
                        </label>
                        <label>
                            Answer B:
                            <input
                                type="text"
                                value={question.b}
                                onChange={(e) => handleQuestionChange(index, 'b', e.target.value)}
                                required
                            />
                        </label>
                        <label>
                            Answer C:
                            <input
                                type="text"
                                value={question.c}
                                onChange={(e) => handleQuestionChange(index, 'c', e.target.value)}
                                required
                            />
                        </label>
                        <label>
                            Correct Answer:
                            <select
                                value={question.correctAnswer}
                                onChange={(e) => handleQuestionChange(index, 'correctAnswer', e.target.value)}
                                required
                            >
                                <option value="">Select correct answer</option>
                                <option value="a">A</option>
                                <option value="b">B</option>
                                <option value="c">C</option>
                            </select>
                        </label>
                        <button type="button" onClick={() => handleRemoveQuestion(index)}>Remove Question</button>
                    </div>
                ))}
                <button type="button" onClick={handleAddQuestion}>Add Question</button>
                <button type="submit">Save</button>
            </form>
        </div>
    );
};

export default EditCourse;
