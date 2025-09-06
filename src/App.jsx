import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage';
import StudentHome from './pages/StudentHome';
import RegisterLayout from './layout/RegisterLayout';
import RegisterApplication from './pages/RegisterApplication';

function App() {

	return (
		<Router>
			<Routes>
				<Route path='/' element={<LandingPage />} />
				<Route path='/student' element={<StudentHome />} />
				<Route path='/student/register/*' element={<RegisterLayout />}>
					<Route path='application' element={<RegisterApplication />} />
				</Route>
			</Routes>
		</Router>
	)
}

export default App