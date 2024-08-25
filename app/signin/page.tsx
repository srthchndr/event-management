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

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3).max(50),
})


export default function SignIn() {
  const [loading, setLoading] = useState(false);
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
    await signIn('credentials', {
      email: credentials.email,
      password: credentials.password,
      redirect: true,
      callbackUrl: '/'
    })
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
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link href="#" className="ml-auto inline-block text-sm underline">
                      Forgot your password?
                    </Link>
                  </div>
                  <Input id="password" type="password" required />
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </form>
            </Form>
            <Button onClick={googleSignin} variant="outline" className="w-full">
              Login with Google
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="#" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
