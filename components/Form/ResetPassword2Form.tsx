"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Eye, EyeOff, ArrowLeft, Check, ShieldCheck } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "user@example.com";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [revokeSessions, setRevokeSessions] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Password criteria states
  const [hasMinLength, setHasMinLength] = useState(false);
  const [hasUppercase, setHasUppercase] = useState(false);
  const [hasLowercase, setHasLowercase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasSpecial, setHasSpecial] = useState(false);
  const [strengthScore, setStrengthScore] = useState(0);

  useEffect(() => {
    setHasMinLength(password.length >= 8);
    setHasUppercase(/[A-Z]/.test(password));
    setHasLowercase(/[a-z]/.test(password));
    setHasNumber(/[0-9]/.test(password));
    setHasSpecial(/[^A-Za-z0-9]/.test(password));
  }, [password]);

  useEffect(() => {
    let score = 0;
    if (hasMinLength) score += 20;
    if (hasUppercase) score += 20;
    if (hasLowercase) score += 20;
    if (hasNumber) score += 20;
    if (hasSpecial) score += 20;
    setStrengthScore(score);
  }, [hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecial]);

  const getStrengthLabel = () => {
    if (strengthScore === 0) return "None";
    if (strengthScore <= 40) return "Weak";
    if (strengthScore <= 80) return "Medium";
    return "Strong";
  };

  const getStrengthColorClass = () => {
    if (strengthScore <= 40) return "bg-rose-500";
    if (strengthScore <= 80) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (strengthScore < 80) {
      setError("Please ensure your password meets the security requirements.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setMessage("Password successfully reset! Redirecting...");
      setTimeout(() => {
        router.push("/login");
      }, 1200);
    }, 900);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-center gap-2.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#F59E42"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 shrink-0"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <h1 className="text-3xl font-bold text-[#1F2A37]">Reset Password</h1>
        </div>

        <p className="text-sm text-gray-500 mt-1 text-center">
          Provide a new high-security password for {email}.
        </p>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 p-3 border border-red-200 text-xs font-semibold text-red-800">
          {error}
        </div>
      )}

      {message && (
        <div className="rounded-xl bg-emerald-50 p-3 border border-emerald-200 text-xs font-semibold text-emerald-800">
          {message}
        </div>
      )}

      {/* Password */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">New Password</label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            className="bg-gray-50 border border-gray-300 text-gray-900 placeholder:text-gray-500 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pl-11 pr-12 rounded-lg"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Strength card (compact) */}
      <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
        <div className="flex justify-between items-center text-xs mb-2">
          <span className="font-medium text-gray-600">Security Strength</span>
          <span className={`font-semibold ${strengthScore <= 40 ? "text-rose-600" : strengthScore <= 80 ? "text-amber-600" : "text-emerald-600"}`}>
            {getStrengthLabel()}
          </span>
        </div>
        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden mb-2">
          <div className={`h-full ${getStrengthColorClass()}`} style={{ width: `${strengthScore}%` }} />
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <Check className={`h-4 w-4 ${hasMinLength ? "text-emerald-500" : "text-gray-300"}`} />
            <span>8+ chars</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className={`h-4 w-4 ${hasUppercase ? "text-emerald-500" : "text-gray-300"}`} />
            <span>Uppercase</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className={`h-4 w-4 ${hasLowercase ? "text-emerald-500" : "text-gray-300"}`} />
            <span>Lowercase</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className={`h-4 w-4 ${hasNumber ? "text-emerald-500" : "text-gray-300"}`} />
            <span>Number</span>
          </div>
          <div className="flex items-center gap-2 col-span-2">
            <Check className={`h-4 w-4 ${hasSpecial ? "text-emerald-500" : "text-gray-300"}`} />
            <span>Special (@, $, !, %, etc.)</span>
          </div>
        </div>
      </div>

      {/* Confirm */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            className="bg-gray-50 border border-gray-300 text-gray-900 placeholder:text-gray-500 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pl-11 pr-12 rounded-lg"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((s) => !s)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
            aria-label={showConfirmPassword ? "Hide confirm" : "Show confirm"}
          >
            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Revoke sessions */}
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          id="revokeSessions"
          type="checkbox"
          checked={revokeSessions}
          onChange={(e) => setRevokeSessions(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-[#F59E42] focus:ring-[#F59E42]"
        />
        Revoke other active sessions
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#F59E42] hover:bg-[#E98B25] text-white font-semibold py-3 rounded-lg transition duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <ShieldCheck className="h-5 w-5" />
        <span>Reset Password & Secure Account</span>
      </button>

      <div className="mt-4 text-center text-sm">
        <Link href="/login" className="text-gray-700 hover:text-[#F59E42]">
          Back to Sign in
        </Link>
      </div>
    </form>
  );
}

export default function ResetPasswordPage() {
  // Use the login-page card container so reset matches login visuals
  return (
    <div className="min-h-screen bg-[#F5F1E8] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-center mb-4">
          {/* optional small logo or left empty to match login */}
        </div>
        <Suspense fallback={<div className="text-center py-6 text-sm text-gray-500">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
        <div className="mt-6 text-center text-xs text-gray-500">
          Need help? Contact support.
        </div>
      </div>
    </div>
  );
}