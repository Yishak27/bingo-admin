import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Branches from './pages/Branches';
import Commissions from './pages/Commissions';
import Login from './pages/Login';
import Layout from './components/Layout';
import Users from './pages/Users';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/branches" element={<Branches />} />
          <Route path="/commissions" element={<Commissions />} />
          <Route path="/users" element={<Users />} />
        </Route>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}
