import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";
import ProtectedRoute from "./components/protectedRoute";
import HomePage from "./pages/home";
import SearchBar from "./components/serachBar";
import CreatePost from "./components/createPost";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import AppLayout from "./pages/appLayout";
import "./App.css";

function LogOut() {
  localStorage.clear();
  window.location.href = "/login";
}


function App() {
  const [popUp, setPopUp] = useState(false);
  const [newPostCreated, setNewPostCreated] = useState(false);

  return (
    <div className="app-container">
      <BrowserRouter>
        <AppLayout popUp={() => setPopUp(true)} />

        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage
                  newPostCreated={newPostCreated}
                  setNewPostCreated={setNewPostCreated}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile/:id"
            element={
              <ProtectedRoute>
                <HomePage
                  newPostCreated={newPostCreated}
                  setNewPostCreated={setNewPostCreated}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <SearchBar />
              </ProtectedRoute>
            }
          />

          <Route path="/logout" element={<LogOut />} />
        </Routes>

        {popUp && (
          <div className="modal-overlay" onMouseDown={() => setPopUp(false)}>
            <div
              className="modal-content"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <CreatePost
                popUp={() => setPopUp(false)}
                newPost={() => setNewPostCreated(true)}
              />
            </div>
          </div>
        )}
      </BrowserRouter>
    </div>
  );
}

export default App;
