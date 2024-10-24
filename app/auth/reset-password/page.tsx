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
import { useRouter } from "next/navigation";
import { PasswordResetSchema } from "@/schemas";
import { sendResetLink } from "@/actions/resetPassword";

export default function ResetPassword() {
  const router = useRouter()
  const [loading, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  const form = useForm<z.infer<typeof PasswordResetSchema>>({
    resolver: zodResolver(PasswordResetSchema),
    defaultValues: {
      email: ""
    },
  })

  const sendResetMail = async (email: z.infer<typeof PasswordResetSchema>) => {
    setError("");
    startTransition(() => {
      sendResetLink(email).then((data) => {
        setError(data.error);
        setSuccess(data.success);
      })
    })
  }

  return (
    <div className="h-full w-full flex justify-center items-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>
            Enter your email to send password reset link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(sendResetMail)}>
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
                {error && <p className="text-sm grid gap-2 my-2 text-red-500">{error}</p>}
                <div className="grid gap-4 mt-4">
                  {!success &&
                  <Button disabled={loading} type="submit">
                    {loading
                    ? 
                    <>
                      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> Sending Email
                    </>
                    : 
                    <>
                      <EnvelopeClosedIcon className="mr-2 h-4 w-4" /> Send reset mail
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
