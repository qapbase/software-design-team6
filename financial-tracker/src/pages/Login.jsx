import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn, UserPlus, X } from "lucide-react";
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, googleProvider } from "../services/firebase";

function Login({ onDemoLogin }) {
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const getErrorMessage = (code) => {
    switch (code) {
      case "auth/user-not-found":
        return "No account found with this email.";
      case "auth/wrong-password":
        return "Incorrect password. Please try again.";
      case "auth/invalid-credential":
        return "Invalid email or password.";
      case "auth/email-already-in-use":
        return "This email is already registered. Try logging in.";
      case "auth/weak-password":
        return "Password must be at least 6 characters.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/too-many-requests":
        return "Too many attempts. Please try again later.";
      case "auth/popup-closed-by-user":
        return "Google sign-in was cancelled.";
      case "auth/network-request-failed":
        return "Network error. Please check your connection.";
      default:
        return "An error occurred. Please try again.";
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/app");
    } catch (firebaseError) {
      if (email === "admin@email.com" && password === "admin123") {
        if (onDemoLogin) {
          onDemoLogin({ fullName: "Keneth Campo", email: "admin@email.com" });
        }
        navigate("/app");
      } else {
        setError(getErrorMessage(firebaseError.code));
      }
    }
    setLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    if (!fullName.trim()) {
      setError("Please enter your full name");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setIsSignUp(false);
      setSuccess("Account created successfully! Please login.");
      setPassword("");
      setConfirmPassword("");
      setFullName("");
    } catch (firebaseError) {
      setError(getErrorMessage(firebaseError.code));
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);

    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/app");
    } catch (firebaseError) {
      setError(getErrorMessage(firebaseError.code));
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (!resetEmail.trim()) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setShowForgotModal(false);
      setSuccess("Password reset email sent! Check your inbox.");
      setResetEmail("");
    } catch (firebaseError) {
      setError(getErrorMessage(firebaseError.code));
    }
    setLoading(false);
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError("");
    setSuccess("");
    setPassword("");
    setConfirmPassword("");
    setFullName("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ECDFC7]">
      <div className="bg-[#F4E9DA] w-full max-w-md p-8 rounded-2xl shadow-lg relative">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 bg-[#2C2F45] rounded-xl flex items-center justify-center mb-3">
            <span className="text-white text-xl font-bold">₱</span>
          </div>
          <h1 className="text-xl font-semibold text-[#050725]">Financial Tracker</h1>
          <p className="text-sm text-[#84848A]">
            {isSignUp ? "Create your account" : "Login to your account"}
          </p>
        </div>

        {success && (
          <div className="mb-4 px-4 py-2.5 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between">
            <p className="text-sm text-[#2E6F4E]">{success}</p>
            <button onClick={() => setSuccess("")} className="text-[#2E6F4E]"><X size={14} /></button>
          </div>
        )}

        {error && !showForgotModal && (
          <div className="mb-4 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between">
            <p className="text-sm text-red-600">{error}</p>
            <button onClick={() => setError("")} className="text-red-600"><X size={14} /></button>
          </div>
        )}

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 transition-colors text-sm font-medium text-[#050725] disabled:opacity-50 mb-5"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
            <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332Z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.166 6.656 3.58 9 3.58Z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-xs text-[#84848A]">or continue with email</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="flex flex-col gap-4">
          {isSignUp && (
            <div>
              <label className="text-sm text-[#84848A]">Full Name</label>
              <input type="text" placeholder="Keneth Campo" value={fullName} onChange={(e) => setFullName(e.target.value)}
                className="w-full mt-1 px-4 py-2.5 rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-[#F9B672] transition-colors text-sm" />
            </div>
          )}

          <div>
            <label className="text-sm text-[#84848A]">Email</label>
            <input type="email" placeholder="admin@email.com" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-2.5 rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-[#F9B672] transition-colors text-sm" />
          </div>

          <div>
            <label className="text-sm text-[#84848A]">Password</label>
            <div className="relative mt-1">
              <input type={showPassword ? "text" : "password"} placeholder={isSignUp ? "Min. 6 characters" : "••••••••"} value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-[#F9B672] transition-colors text-sm" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-gray-500 hover:text-[#050725] transition-colors">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {isSignUp && (
            <div>
              <label className="text-sm text-[#84848A]">Confirm Password</label>
              <div className="relative mt-1">
                <input type={showConfirm ? "text" : "password"} placeholder="Re-enter password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-[#F9B672] transition-colors text-sm" />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-2.5 text-gray-500 hover:text-[#050725] transition-colors">
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}

          {!isSignUp && (
            <div className="flex justify-end">
              <button type="button" onClick={() => { setShowForgotModal(true); setError(""); }}
                className="text-xs text-[#F9B672] hover:text-[#e5a25e] font-medium transition-colors">
                Forgot password?
              </button>
            </div>
          )}

          <button type="submit" disabled={loading}
            className="flex items-center justify-center gap-2 bg-[#2C2F45] hover:bg-[#050725] text-white py-2.5 rounded-xl transition-colors font-medium text-sm disabled:opacity-50">
            {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : isSignUp ? <UserPlus size={18} /> : <LogIn size={18} />}
            {loading ? "Please wait..." : isSignUp ? "Create Account" : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-[#84848A] mt-5">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button onClick={toggleMode} className="text-[#F9B672] hover:text-[#e5a25e] font-semibold transition-colors">
            {isSignUp ? "Login" : "Sign Up"}
          </button>
        </p>
      </div>

      {showForgotModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-[#F4E9DA] w-full max-w-sm p-6 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#050725]">Reset Password</h3>
              <button onClick={() => { setShowForgotModal(false); setResetEmail(""); setError(""); }}
                className="text-[#84848A] hover:text-[#050725] transition-colors"><X size={20} /></button>
            </div>
            <p className="text-sm text-[#84848A] mb-4">Enter your email and we'll send you a reset link.</p>
            {error && showForgotModal && (
              <div className="mb-3 px-3 py-2 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-xs text-red-600">{error}</p>
              </div>
            )}
            <form onSubmit={handleForgotPassword} className="flex flex-col gap-3">
              <input type="email" placeholder="Enter your email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-[#F9B672] transition-colors text-sm" />
              <button type="submit" disabled={loading}
                className="flex items-center justify-center gap-2 bg-[#F9B672] hover:bg-[#e5a25e] text-[#050725] py-2.5 rounded-xl transition-colors font-medium text-sm disabled:opacity-50">
                {loading ? <span className="w-5 h-5 border-2 border-[#050725] border-t-transparent rounded-full animate-spin" /> : "Send Reset Link"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;