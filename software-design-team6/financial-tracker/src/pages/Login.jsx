import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn } from "lucide-react";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {

    e.preventDefault();

    // simple demo authentication
    if (email === "admin@email.com" && password === "admin123") {

      navigate("/app");

    } else {

      alert("Invalid email or password");

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-[#ECDFC7]">

      <div className="bg-[#F4E9DA] w-full max-w-md p-8 rounded-2xl shadow-lg">

        {/* LOGO */}
        <div className="flex flex-col items-center mb-6">

          <div className="w-14 h-14 bg-[#2C2F45] rounded-xl flex items-center justify-center mb-3">
            <span className="text-white text-xl font-bold">₱</span>
          </div>

          <h1 className="text-xl font-semibold text-[#050725]">
            Financial Tracker
          </h1>

          <p className="text-sm text-[#84848A]">
            Login to your account
          </p>

        </div>

        {/* FORM */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">

          {/* EMAIL */}
          <div>

            <label className="text-sm text-[#84848A]">Email</label>

            <input
              type="email"
              placeholder="admin@email.com"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-2 rounded-xl border border-gray-300 bg-white focus:outline-none"
            />

          </div>

          {/* PASSWORD */}
          <div>

            <label className="text-sm text-[#84848A]">Password</label>

            <div className="relative mt-1">

              <input
                type={showPassword ? "text" : "password"}
                placeholder="admin123"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-white focus:outline-none"
              />

              <button
                type="button"
                onClick={()=>setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500"
              >
                {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>

            </div>

          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className="flex items-center justify-center gap-2 mt-3 bg-[#2C2F45] hover:bg-[#050725] text-white py-2 rounded-xl transition"
          >
            <LogIn size={18}/>
            Login
          </button>

        </form>

      </div>

    </div>

  );
}

export default Login;