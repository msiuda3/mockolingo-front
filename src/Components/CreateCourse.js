import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateCourse = () => {
    const [coursename, setCoursename] = useState('');
    const [questions, setQuestions] = useState([{ question: '', a: '', b: '', c: '', correctAnswer: '' }]);
    const navigate = useNavigate();

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
        const newCourse = {
            coursename,
            questions
        };

        try {
            const response = await fetch('http://localhost:8080/api/courses/save', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem('token')).token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newCourse)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log('Course created successfully:', result);

            navigate('/');
        } catch (error) {
            console.error('Error creating course:', error);
        }
    };

    return (
        <div>
            <h1>Create New Course</h1>
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

export default CreateCourse;
