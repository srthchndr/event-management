"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardHeader } from "@/components/ui/card";
import { ReloadIcon } from "@radix-ui/react-icons";
import { signIn } from "@/auth";
 
const formSchema = z.object({
    firstName: z.string().min(3).max(50),
    lastName: z.string().min(3).max(50),
    email: z.string().email(),
    password: z.string().min(3).max(50),
    confirmPassword: z.string().min(3).max(50),
})

export default function SignUp() {
    const router = useRouter();
    let [loading, setLoading] = useState(false);
    const [error, setError] = useState("")
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
        },
      })

    const signupUser = async (details: z.infer<typeof formSchema>) => {
        setLoading(true);
        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(details),
            });
            
            if (res.ok) {
                // If registration successful, log in
                router.push("/signin")
              } else {
                const data = await res.json()
                setError(data.message || "Registration failed")
              }
            
        } catch (error) {
            setError("An error occurred. Please try again.")
            console.log(error);
            
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="h-screen w-full flex justify-center items-center">
            <Card className="p-4 w-[350px] h-fit">
                <CardHeader className="text-2xl mx-auto w-fit">Signup</CardHeader>
                <Form {...form}>
                    <form className="flex flex-col gap-2" onSubmit={form.handleSubmit(signupUser)}>
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
                        {!loading 
                        ? 
                            <Button type="submit">Signup</Button> 
                        : 
                            <Button disabled type="submit">
                                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                Saving details
                            </Button>}
                    </form>
                </Form>
            </Card>
        </div>
    );
}