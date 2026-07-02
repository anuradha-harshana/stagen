"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormData, registerSchema } from "@/lib/validation"; 
import Link from "next/link";

export default function RegistrationForm() {
  const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<RegisterFormData>({
  resolver: zodResolver(registerSchema),
});

  const onSubmit = (data: RegisterFormData) => {
  console.log(data);
};

  return (
    <div className="flex justify-center h-screen top-0 px-20 py-15 lg:px-30 ">
      <div className=" w-full h-full max-w-md">

        <h1 className="text-4xl font-bold text-slate-900">
          Create Your Account
        </h1>

        <p className="mt-2 text-gray-500">
          Join BuildTrack and start managing your construction journey.
        </p>

        

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="h-full space-y-4"
          >

          {/* Username */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Username
            </label>

            <input
              type="text"
              placeholder="Enter your username"
              {...register("username")}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-500">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter password"
              {...register("password")}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Confirm Password
            </label>

            <input
              type="password"
              placeholder="Confirm password"
              {...register("confirmPassword")}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"  
            /> 
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          {/* rounded-lg */}

          {/* Role */}
          <div>
            <label className="mb-3 block text-sm font-medium">
              Select Role
            </label>

          <div className="grid grid-cols-2 gap-4">

            <label className="text-sm border rounded-2xl border-gray-300 p-4 hover:border-orange-500 hover:bg-orange-50 flex items-center gap-2">  
              <input
                type="radio"
                {...register("role")}
                value="customer"
              />
              Customer
            </label>

            <label className="text-sm border rounded-2xl border-gray-300 p-4 hover:border-orange-500 hover:bg-orange-50 flex items-center gap-2"
                      >
              <input
                type="radio"
                {...register("role")}
                value="company"
              />
              Company
            </label>

            {/* rounded-xl */}

            {errors.role && (
              <p className="mt-1 text-sm text-red-500">
                {errors.role.message}
              </p>
            )}

          </div>
        </div>

      {/* Submit */}
          <button
            type="submit"
            className="w-full rounded-xl cursor-pointer bg-orange-500 py-3 font-semibold text-white transition hover:bg-orange-600"
          >
            Create Account
          </button>
            <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-orange-500 hover:text-orange-600 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </form>

      </div>
    </div>
  );
}