import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import ProtectedRoute from "./routes/ProtectedRoute";
import "./App.css";

const HaryanaDemoMap = lazy(() => import("./pages/HaryanaDemoMap"));

function App() {
  return (
    <BrowserRouter
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true,
      }}
    >
      <Suspense fallback={<div className="app-loading-state">Loading map workspace...</div>}>
        <Routes>
          <Route path="/login" element={<AuthPage/>} />
          <Route path="/signup" element={<AuthPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/demo-map"
            element={
              <ProtectedRoute>
                <HaryanaDemoMap />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
