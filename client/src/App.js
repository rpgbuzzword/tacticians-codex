import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import axios from 'axios';
import AuthForm from "./pages/AuthForm";
import BuildForm from "./pages/BuildForm";
import BuildList from "./pages/BuildList";

function App() {
  const [user, setUser] = useState(null);

 // Check localStorage for token on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:5000/api/verify-token', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setUser(res.data.user))
      .catch(() => localStorage.removeItem('token'));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };
 
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 p-6">
        <nav className="mb-6 space-x-4 flex items-center justify-between">
          <div className="flex w-[25%] gap-4">
          <Link to="/" className="text-blue-600 hover:underline h-[30px]">Create Build</Link>
          <Link to="/builds" className="text-blue-600 hover:underline h-[30px]">View Builds</Link>
          </div>

          <div className="left-1/2">
            <Link to="/" className="text-xl">Tactician's Codex</Link>
          </div>
          
          <div className='flex w-[25%] justify-end'>
            {user ? (
              <>
                <span className="mr-4">Welcome, {user.username}</span>
                <button onClick={handleLogout} className="bg-red-600 px-1 rounded hover:bg-red-700">
                  Log Out
                </button>
              </>
            ) : (
              <a href="/auth" className="underline">Log In</a>
            )}
          </div>
        </nav>

        <Routes>
          <Route path="/" element={user ? <BuildForm /> : <Navigate to="/auth" />} />
          <Route path="/auth" element={<AuthForm setUser={setUser} />} />
          <Route path="/builds" element={<BuildList />} />
          <Route path="/edit/:id" element={<BuildForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

