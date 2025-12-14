import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50/50 via-white to-white px-4 py-12">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="w-full space-y-6 p-8 rounded-2xl bg-white shadow-xl border border-gray-100"
        >
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 via-orange-400 to-pink-500 flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <rect x="6" y="6" width="12" height="12" rx="2" fill="white" fillOpacity="0.2"/>
                <path d="M6 6l12 12M18 6L6 18" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center space-y-2 mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
            <p className="text-sm text-gray-600">Sign in to your ShreeRamMithai account</p>
          </div>

          {/* Form Fields */}
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900 block">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900 block">Password</label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="h-10"
              />
            </div>
          </div>

          {/* Sign In Button */}
          <Button 
            type="submit"
            className="w-full h-11 text-base font-semibold bg-orange-600 hover:bg-orange-700 text-white shadow-md hover:shadow-lg transition-all"
          >
            Sign in
          </Button>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-orange-600 font-medium hover:text-orange-700 hover:underline">
              Register
            </Link>
          </p>

          {/* Demo Credentials */}
          <div className="bg-orange-50 border border-orange-200 text-left rounded-lg p-4 text-sm">
            <div className="font-semibold text-orange-700 mb-1">Demo Credentials:</div>
            <div className="text-orange-700">
              Admin: <span className="font-medium">admin@shreeramMithai.com</span> / <span className="font-medium">admin123</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
