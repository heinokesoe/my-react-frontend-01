import { useRef, useState } from "react";
import { useUser } from "../contexts/UserProvider";
import { Navigate } from "react-router-dom";

export default function Login() {
  const [controlState, setControlState] = useState({
    isLoggingIn: false,
    isLoginError: false,
    isLoginOk: false,
  });

  const emailRef = useRef();
  const passRef = useRef();
  const { user, login } = useUser();

  async function onLogin() {
    setControlState((prev) => {
      return {
        ...prev,
        isLoggingIn: true,
      };
    });

    const email = emailRef.current.value;
    const pass = passRef.current.value;
    const result = await login(email, pass);

    setControlState(() => {
      return {
        isLoggingIn: false,
        isLoginError: !result,
        isLoginOk: result,
      };
    });
  }

  if (!user.isLoggedIn)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-100">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Welcome Back
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="text"
                name="email"
                id="email"
                ref={emailRef}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                ref={passRef}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter your password"
              />
            </div>

            <button
              onClick={onLogin}
              disabled={controlState.isLoggingIn}
              className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
                controlState.isLoggingIn
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg"
              }`}
            >
              {controlState.isLoggingIn ? "Logging in..." : "Login"}
            </button>

            {controlState.isLoginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
                Login incorrect. Please check your credentials.
              </div>
            )}

            {user.isLoggedIn && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-center">
                Login Success! Redirecting...
              </div>
            )}
          </div>
        </div>
      </div>
    );
  else return <Navigate to="/profile" replace />;
}
