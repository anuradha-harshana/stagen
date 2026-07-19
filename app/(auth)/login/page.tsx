"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { AuthLogo } from "@/components/Auth/logo"
import { BrandPanel } from "@/components/Auth/brand-panel"
import { useForm } from "react-hook-form"
import { LoginFormData, loginSchema } from "@/lib/login/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { getRedirectPath } from "@/hooks/Auth/redirection"
import { toast } from "sonner"

export default function LoginPage() {
  
    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema)
    });

    const router = useRouter();

    const onSubmit = async (data: LoginFormData) => {
        const res = await fetch(`/api/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const result = await res.json();

        if(!res.ok){
            toast(result.message , {position: "top-right"});
            return;
        }

        toast(`Login Successful!`, {position: "top-right"})
        router.replace(getRedirectPath(result.user.role));
    };



  return (
    <div className="flex h-screen w-full items-center justify-center bg-abyssal-blue p-6">
      <div className="font-cream grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-2xl shadow-2xl md:grid-cols-2">
        <div className="flex flex-col justify-center gap-5 bg-oatmeal px-10 py-10">
          <AuthLogo />

          <div>
            <h1 className="text-2xl font-semibold text-blue-fantastic text-center">Sign in</h1>
            <p className="text-center mt-1 text-sm text-blue-fantastic/60">
              Welcome back, enter your details to continue.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button variant="outline" className="justify-center gap-2">
              Sign in with Google
            </Button>
            <Button variant="outline" className="justify-center gap-2">
              Sign in with Apple
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-oatmeal" />
            <span className="text-xs uppercase text-blue-fantastic/50">or</span>
            <div className="h-px flex-1 bg-oatmeal" />
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input type="email" placeholder="you@company.com" {...register("email")}/>
            </Field>
            <Field>
              <FieldLabel>Password</FieldLabel>
              <Input type="password" placeholder="Your password" {...register("password")}/>
            </Field>

            <Button
              type="submit"
              className="mt-2 bg-truffle-trouble text-palladian hover:bg-truffle-trouble/90"
            >
              Sign in
            </Button>
          </form>

          <p className="text-center text-sm text-blue-fantastic/60">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium text-truffle-trouble">
              Sign up
            </Link>
          </p>
        </div>

        <BrandPanel />
      </div>
    </div>
  )
}