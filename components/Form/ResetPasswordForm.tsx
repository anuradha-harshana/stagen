"use client";
import Link from "next/link";
import { ArrowLeft, Mail, KeyRound } from "lucide-react";

export default function ResetPasswordForm() {
  return (
    <div className="min-h-screen bg-[#F5F1E8] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 rounded-xl bg-orange-50 flex items-center justify-center">
            <KeyRound className="h-8 w-8 text-[#F59E42]" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-[#1F2A37]">
          Recover Password
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Enter your email address and we’ll send you a secure reset link.
        </p>

        <form className="space-y-6">
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="email"
            >
              Registered Email
            </label>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                id="email"
                name="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 placeholder:text-gray-500 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pl-11"
                placeholder="your-email@example.com"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#F59E42] hover:bg-[#E98B25] text-white font-semibold py-3 rounded-lg transition duration-300"
          >
            Send Secure Reset Link
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-[#F59E42]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Client Portal
          </Link>
        </div>
      </div>
    </div>
  );
}