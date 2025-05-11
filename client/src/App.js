// client/src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import ExpenseAnalysis from './components/Pages/ExpenseAnalysis';
import LegalUpload from './components/Pages/LegalAnalysis';
import RiskAnalysis from './components/Pages/RiskAnalysis';
import Support from './components/Pages/Support';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/expense-analysis" element={<ExpenseAnalysis />} />
        <Route path="/legal" element={<LegalUpload />} /> {/* Redirect to LandingPage for any unknown routes */}
        <Route path="/risk" element={<RiskAnalysis />} />
        <Route path="/help-support" element={<Support />} />
      </Routes>
    </Router>
  );
}

export default App;