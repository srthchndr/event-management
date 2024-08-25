"use server"

import { signIn } from "@/auth";

export async function GoogleSignin() {
    console.log("Calling sigin");
    
    await signIn("google")
}