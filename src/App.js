import React from 'react'
import Dashboard from './Components/dashboard'
import CourseDetail from './Components/CourseDetail';
import ResultPage from './Components/ResultPage';
import CreateCourse from './Components/CreateCourse';
import History from './Components/History';
import AdminView from './Components/AdminView';
import EditCourse from './Components/EditCourse';
import {BrowserRouter, Routes,Route } from "react-router-dom"
const App = () => {
  
  return (
    <div>
      <h1 className="text-3xl text-white font-bold">Mockolingo</h1>
      <BrowserRouter> 
      <Routes>
        <Route path="/" element={<Dashboard/>} />
        <Route path="/course/:id" element={<CourseDetail/>} />
        <Route path="/result/:id" element={<ResultPage/>} />
        <Route path="/edit/:id" element={<EditCourse/>} />
        <Route path="/create" element={<CreateCourse/>} />
        <Route path="/history" element={<History/>} />
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App