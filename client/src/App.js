import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import BuildForm from "./pages/BuildForm";
import BuildList from "./pages/BuildList";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 p-6">
        <nav className="mb-6 space-x-4">
          <Link to="/" className="text-blue-600 underline">Create Build</Link>
          <Link to="/builds" className="text-blue-600 underline">View Builds</Link>
        </nav>

        <Routes>
          <Route path="/" element={<BuildForm />} />
          <Route path="/builds" element={<BuildList />} />
          <Route path="/edit/:id" element={<BuildForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

