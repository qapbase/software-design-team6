import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./services/firebase";

import Sidebar from "./components/Sidebar";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import Assistant from "./pages/Assistant";
import Profile from "./pages/Profile";
import AboutSection from "./pages/AboutSection";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          fullName: firebaseUser.displayName || "User",
          email: firebaseUser.email || "",
          photoURL: firebaseUser.photoURL || null,
          provider: firebaseUser.providerData[0]?.providerId || "email",
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDemoLogin = (demoUser) => {
    setUser({
      uid: "demo",
      fullName: demoUser?.fullName || "Keneth Campo",
      email: demoUser?.email || "admin@email.com",
      photoURL: null,
      provider: "demo",
    });
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      // ignore
    }
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#ECDFC7]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#2C2F45] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[#84848A]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>

        {/* LOGIN PAGE */}
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login onDemoLogin={handleDemoLogin} />
            )
          }
        />

        {/* MAIN APP — Protected: redirect to login if not authenticated */}
        <Route
          path="/*"
          element={
            !user ? (
              <Navigate to="/login" />
            ) : (
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

                    <Route
                      path="/profile"
                      element={
                        <Profile user={user} onLogout={handleLogout} />
                      }
                    />

                    <Route path="/about" element={<AboutSection />} />

                  </Routes>

                </main>

              </div>
            )
          }
        />

      </Routes>
    </Router>
  );
}

export default App;