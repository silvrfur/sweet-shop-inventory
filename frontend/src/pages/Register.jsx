import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      navigate("/login");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-white px-2">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 p-8 rounded-2xl bg-white/90 shadow-lg border"
      >
        <div className="flex flex-col items-center gap-2 mb-2">
          <img src="/vite.svg" alt="logo" className="w-14 h-14 mb-2 rounded-full" />
          <h1 className="text-3xl font-bold text-center mb-0">Create an account</h1>
          <div className="text-zinc-500 text-center -mt-2 mb-2">Join ShreeRamMithai today</div>
        </div>

        <Input
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <Input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <Input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <Button className="w-full h-11 text-lg bg-orange-600 hover:bg-orange-700 mt-2">Create account</Button>

        <p className="text-center text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-orange-600 font-medium">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
