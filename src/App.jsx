import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage';
import StudentHome from './pages/StudentHome';
import RegisterLayout from './layout/RegisterLayout';

function App() {

	return (
		<Router>
			<Routes>
				<Route path='/' element={<LandingPage />} />
				<Route path='/student' element={<StudentHome />} />
				<Route path='/student/fresher' element={<RegisterLayout />} />
			</Routes>
		</Router>
	)
}

export default App