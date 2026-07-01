"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F1E8] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-lg bg-[#1F2A37] flex items-center justify-center">
                    <Image src="/logo.jpg" alt="Logo" width={64} height={64} />
                </div>
            </div>
            <h1 className="text-3xl font-bold text-center text-[#1F2A37]">
                Welcome Back!
            </h1>
            <p className="text-center text-gray-500 mt-2 mb-8">
                Sign in to your account to continue
            </p>
            <form className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="bg-gray-50 border border-gray-300 text-gray-900 placeholder:text-gray-500 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="Enter your email"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            className="bg-gray-50 border border-gray-300 text-gray-900 placeholder:text-gray-500 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-12"
                            placeholder="Enter your password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((currentValue) => !currentValue)}
                            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"/>
                        Remember me
                    </label>

                    <a href="#" className="text-[#F59E42] hover:underline">
                        Forgot your password?
                    </a>
                </div>
                <button
                    className="w-full bg-[#F59E42] hover:bg-[#E98B25] text-white font-semibold py-3 rounded-lg transition duration-300"
                >
                 Login
                </button>
            </form>
            <p className="text-center text-sm text-gray-500 mt-8">
                Don't have an account?{" "}
                <a href="#" className="text-[#F59E42] font-semibold">
                    Sign Up
                </a>
            </p>

        </div>
    </div>
  )
}

export default LoginForm
