import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


async function fetchCourses() {
    const response = await fetch('http://localhost:8080/api/courses/available', {
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


const CoursesList = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getCourses = async () => {
            try {
                const data = await fetchCourses();
                setCourses(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        getCourses();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <Link to={`/history`}>
                            <button>Historia</button>
                        </Link>
            <h1>Dostępne quizy:</h1>
            <ul>
                {courses.map(course => (
                    <li key={course.id}>
                        {course.coursename}
                        <Link to={`/course/${course.id}`}>
                            <button>View Details</button>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CoursesList;
