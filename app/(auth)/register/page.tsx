"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { AuthLogo } from "@/components/auth/logo"
import { RegisterPanel } from "@/components/auth/register-panel"
import { useForm } from "react-hook-form"
import { RegisterFormData, registerSchema } from "@/lib/register/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "company" }
  })

  const router = useRouter()

  const onSubmit = async (data: RegisterFormData) => {
    const res = await fetch(`/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    const result = await res.json()

    if (!res.ok) {
      toast(result.message ?? "Registration failed. Please try again.", { position: "top-right" })
      return
    }

    toast("Registration Successful!", { position: "top-right" })
    router.push("/login");
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-abyssal-blue p-6">
      <div className="font-cream grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-2xl shadow-2xl md:grid-cols-2">
        <div className="flex flex-col justify-center gap-4 bg-oatmeal px-10 py-8">
          <AuthLogo />

          <div>
            <h1 className="text-center text-2xl font-semibold text-blue-fantastic">
              Sign up
            </h1>
            <p className="text-center mt-1 text-sm text-blue-fantastic/60">
              Set up your builder account and start tracking projects.
            </p>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} >
            <Field>
              <FieldLabel>Company name</FieldLabel>
              <Input
                placeholder="Build & Co Pty Ltd"
                {...register("username")}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.username.message}
                </p>
              )}
            </Field>

            <Field>
              <FieldLabel>Work email</FieldLabel>
              <Input
                type="email"
                placeholder="you@company.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Password</FieldLabel>
                <Input
                  type="password"
                  placeholder="Create password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </Field>
              <Field>
                <FieldLabel>Confirm password</FieldLabel>
                <Input
                  type="password"
                  placeholder="Repeat password"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </Field>
            </div>

            <Button
              type="submit"
              className="mt-2 bg-truffle-trouble text-palladian hover:bg-truffle-trouble/90 disabled:opacity-60"
            >Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-blue-fantastic/60">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-truffle-trouble">
              Sign in
            </Link>
          </p>
        </div>

        <RegisterPanel />
      </div>
    </div>
  )
}