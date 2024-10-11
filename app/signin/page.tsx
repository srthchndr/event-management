"use client";

import { signIn } from "next-auth/react"
import Link from "next/link";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, PersonIcon, ReloadIcon } from "@radix-ui/react-icons";
import { Path } from "@/enums/path_enum";
import { Label } from "@radix-ui/react-label";
import { GoogleSignin } from "@/actions/google-signin";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3).max(50),
})


export default function SignIn() {
  const router = useRouter()
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("")
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  })

  const signInUser = async (credentials: z.infer<typeof formSchema>) => {
    console.log(credentials);
    setLoading(true);
    
    try {
      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      })

      if (result!.error) {
        setError("Invalid credentials")
      } else {
        const res = await fetch('/api/user')
        const userData = await res.json()

        if (!userData.emailVerified) {
          setError("Please verify your email before logging in.")
          setLoading(false)
          return
        }
        router.push("/")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false);
    }
  }

  const googleSignin = async () => {
    await signIn('google', {callbackUrl: '/'});
  }

  return (
    <div className="h-screen w-full flex justify-center items-center">
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
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
