"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardHeader } from "@/components/ui/card";
import { ReloadIcon } from "@radix-ui/react-icons";
import { RegisterSchema } from "@/schemas";
import { register } from "@/actions/register";
import Link from "next/link";
 
export default function SignUp() {
    const router = useRouter();
    const [loading, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")
    
    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
        },
      })

    const registerUser = async (details: z.infer<typeof RegisterSchema>) => {
        setSuccess('');
        setError('');
        startTransition(() => {
            register(details).then((data) => {
                if(!data?.error) router.push('/auth/verify');
                setError(data?.error);
            })
        })
    }

    return (
        <div className="h-screen w-full flex justify-center items-center">
            <Card className="p-4 w-[350px] h-fit">
                <CardHeader className="text-2xl mx-auto w-fit">Signup</CardHeader>
                <Form {...form}>
                    <form className="flex flex-col gap-2" onSubmit={form.handleSubmit(registerUser)}>
                        <div className="flex gap-2">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel className="text-muted-foreground">First Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="steven" autoFocus {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel className="text-muted-foreground">Last Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="turn" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className="text-muted-foreground">Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="steven.turn@company.com" {...field} />
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
                                    <Input type="password" {...field} />
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
                                    <Input type="password" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This should match with your password
                                </FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        {error && <p className="text-sm grid gap-2 my-2 text-red-500">{error}</p>}
                        {success && <p className="text-sm grid gap-2 my-2 text-green-500">{success}</p>}
                        {!loading 
                        ? 
                            <Button type="submit">Register</Button> 
                        : 
                            <Button disabled type="submit">
                                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                Saving details
                            </Button>}
                    </form>
                </Form>
                <div className="mt-4 text-center text-xs">
                    <Link href="/auth/signin" className="hover:underline">
                        Have an account? Login here
                    </Link>
                </div>
            </Card>
        </div>
    );
}