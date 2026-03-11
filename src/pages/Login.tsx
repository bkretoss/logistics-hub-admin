import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const validate = () => {
    const errs: typeof errors = {};
    if (!email) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Enter a valid email";
    if (!password) errs.password = "Password is required";
    else if (password.length < 6) errs.password = "Password must be at least 6 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const success = await login(email, password, remember);
      if (success) navigate("/dashboard");
    } catch {
      setErrors({ general: "Login failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative p-4">
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("/images/logistics.jpg")' }}>
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center">
            <img src="/relay-logo.svg" alt="Relay Logistics" className="w-auto max-h-24" />
          </div>
          <h1 className="text-2xl font-bold text-white">Streamline Your Supply Chain</h1>
          <p className="text-gray-400 text-sm mt-1">Efficient Logistics Management Platform</p>
        </div>

        {/* Login Card - Dark Theme */}
        <div className="bg-gray-900/95 backdrop-blur-sm rounded-2xl shadow-[0_0_50px_rgba(234,179,8,0.3)] border border-yellow-500/20 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
            <p className="text-gray-400 text-sm">Enter your credentials to access your account</p>
          </div>

          {errors.general && (
            <div className="flex items-center gap-2 p-3 mb-6 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((p) => ({ ...p, email: undefined }));
                }}
                className={`h-11 rounded-lg bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-yellow-500 focus:ring-yellow-500 ${errors.email ? "border-red-500" : ""}`}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-300">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((p) => ({ ...p, password: undefined }));
                  }}
                  className={`h-11 rounded-lg pr-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-yellow-500 focus:ring-yellow-500 ${errors.password ? "border-red-500" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={remember}
                  onCheckedChange={(checked) => setRemember(checked === true)}
                  className="border-gray-600 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500"
                />
                <Label htmlFor="remember" className="text-sm text-gray-300 cursor-pointer font-normal">
                  Remember me
                </Label>
              </div>
              <a href="/forgot-password" className="text-sm text-yellow-500 hover:text-yellow-400 font-medium transition-colors">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full h-11 text-base bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-lg shadow-[0_4px_20px_rgba(234,179,8,0.4)] hover:shadow-[0_6px_30px_rgba(234,179,8,0.5)] transition-all mt-6" 
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{" "}
              <a href="#" className="text-yellow-500 hover:text-yellow-400 font-semibold transition-colors">
                Sign up
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">
            By signing in, you agree to our{" "}
            <a href="#" className="text-yellow-500 hover:underline">Terms</a>
            {" "}and{" "}
            <a href="#" className="text-yellow-500 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
