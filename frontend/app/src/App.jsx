import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import ProtectedRoute from './components/protectedRoute';
import HomePage from './pages/home';

function LogOut() {
  localStorage.clear();
  window.location.href = "/login";
}

function App() {
  return (
    <div className="app-container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/logout" element={<LogOut />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
