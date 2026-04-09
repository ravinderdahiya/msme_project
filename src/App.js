import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import ProtectedRoute from "./routes/ProtectedRoute";
import HomePage from "./pages/HomePage";
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
         <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            // <ProtectedRoute>
              <Dashboard />
            // </ProtectedRoute>

          }
        />
         <Route
          path="/HomePage"
          element={
            // <ProtectedRoute>
              <HomePage />
            // </ProtectedRoute>

          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
