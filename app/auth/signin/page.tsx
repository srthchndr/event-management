"use client";

import { signIn } from "next-auth/react"
import Link from "next/link";
import React, { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, PersonIcon, ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { LoginSchema } from "@/schemas";
import { login } from "@/actions/login";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export default function SignIn() {
  const router = useRouter()
  const [loading, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("")
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  })

  const signInUser = async (credentials: z.infer<typeof LoginSchema>) => {
    setError("");
    startTransition(() => {
      login(credentials).then((data) => {
        if(!data?.error) router.push(DEFAULT_LOGIN_REDIRECT);
        setError(data?.error);
      });
    })
  }

  const googleSignin = async () => {
    await signIn('google', {callbackUrl: DEFAULT_LOGIN_REDIRECT});
  }

  return (
    <div className="h-full w-full flex justify-center items-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(signInUser)}>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground">Email</FormLabel>
                        <FormControl>
                            <Input placeholder="steven.turn@company.com" autoFocus {...field} data-testid='email-input' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground">Password</FormLabel>
                        <FormControl>
                            <Input type="password" {...field} data-testid='password-input' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                  )}
                />
                <div className="mt-2 mb-4 text-xs text-end">
                  <Link href={'/auth/reset-password'} className="hover:underline">Forgot Password?</Link>
                </div>
                {error && <p className="text-sm grid gap-2 my-2 text-red-500">{error}</p>}
                <div className="grid gap-4 mt-4">
                  <Button disabled={loading} type="submit">
                    {loading
                    ? 
                    <>
                      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> SigningIn
                    </>
                    : 
                    <>
                      <PersonIcon className="mr-2 h-4 w-4" /> SignIn
                    </>
                    }
                  </Button> 
                </div>
              </form>
            </Form>
            <Button onClick={googleSignin} variant={"outline"} disabled={loading} className="w-full">
              Login with Google
            </Button>
          </div>
          <div className="mt-4 text-center text-xs">
            <Link href="/auth/register" className="hover:underline">
              {`Don't have an account? Register here`}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
