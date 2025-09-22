import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import LandingPage from "./pages/LandingPage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import FoodScanner from "./pages/FoodScanner";

function App() {
  return (
    // The <Router> must wrap everything that needs access to routing.
    <Router>
      {/* AuthProvider now lives inside Router, so it can use useNavigate(). */}
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/scanner" element={<FoodScanner />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;