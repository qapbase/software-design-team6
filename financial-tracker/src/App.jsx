import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import Assistant from "./pages/Assistant";
import Profile from "./pages/Profile";

function App() {
  return (
    <Router>
      <Routes>

        {/* LOGIN PAGE */}
        <Route path="/login" element={<Login />} />

        {/* MAIN APP */}
        <Route
          path="/*"
          element={
            <div className="flex min-h-screen w-full bg-[#ECDFC7]">

              {/* Sidebar */}
              <Sidebar />

              {/* Main Content */}
              <main className="flex-1 p-8 overflow-y-auto">

                <Routes>

                  <Route path="/" element={<Navigate to="/dashboard" />} />

                  <Route path="/dashboard" element={<Dashboard />} />

                  <Route path="/calendar" element={<Calendar />} />

                  <Route path="/assistant" element={<Assistant />} />

                  <Route path="/profile" element={<Profile />} />

                </Routes>

              </main>

            </div>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;