"use client";

import Link from "next/link";
import React, { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, EnvelopeClosedIcon, ReloadIcon } from "@radix-ui/react-icons";
import { useRouter, useSearchParams } from "next/navigation";
import { sendResetLink } from "@/actions/resetPassword";
import { NewPasswordSchema } from "@/schemas";
import { newPassword } from "@/actions/newPassword";

export default function ResetPassword() {
  const router = useRouter()
  const [loading, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    },
  })

  const updatePassword = async (values: z.infer<typeof NewPasswordSchema>) => {
    setError("");
    startTransition(() => {
      newPassword(values, token).then((data) => {
        setError(data.error);
        setSuccess(data.success);
      })
    })
  }

  return (
    <div className="h-full w-full flex justify-center items-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Update Password</CardTitle>
          <CardDescription>
            Fill in the fields to update password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(updatePassword)}>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground">Password</FormLabel>
                        <FormControl>
                            <Input type="password" placeholder="******" autoFocus {...field} data-testid='email-input' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground">Confirm Password</FormLabel>
                        <FormControl>
                            <Input type="password" autoFocus {...field} data-testid='email-input' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                  )}
                />
                {error && <p className="text-sm grid gap-2 my-2 text-red-500">{error}</p>}
                <div className="grid gap-4 mt-4">
                  {!success &&
                  <Button disabled={loading} type="submit">
                    {loading
                    ? 
                    <>
                      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> Updating Password
                    </>
                    : 
                    <>
                      Update Password
                    </>
                    }
                  </Button>} 
                  { success && <p className="text-sm grid gap-2 my-2 text-green-500">{success}</p>}
                </div>
              </form>
            </Form>
          </div>
          <div className="mt-4 text-left text-xs">
            <Link href="/auth/signin" className="hover:underline flex justify-center items-center gap-2">
              <ArrowLeftIcon></ArrowLeftIcon>
              {`Go back to login`}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
