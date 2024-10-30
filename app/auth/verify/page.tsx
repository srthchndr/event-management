'use client';
import { newVerification } from "@/actions/verification";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, useTransition } from "react";

function ShowMessage() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Verify Your Email</h1>
      <p className="text-center max-w-md">
        {`We've sent a verification email to your inbox. Please click on the link in the email to verify your account.`}
      </p>
    </>
  )
}

function VerifyToken(token: string) {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');

  useEffect(() => {
      newVerification(token).then((data) => {
        console.log("Token", token, "Data", data);
        
        setSuccess(data?.success);
        setError(data?.error);
      }).catch(() => {
        setError("Something went wrong");
      })
  },[]);
  return (
    <div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && <p className="text-sm text-green-500">{success}</p>}
    </div>
  )
}

function EmailVerification() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  return (
  <div className="flex flex-col items-center justify-center min-h-screen bg-background">
    {token ? VerifyToken(token) : ShowMessage()}
  </div>)
}

export default function EmailVerificationPage() {
  return (
    <Suspense>
      <EmailVerification/>
    </Suspense>
  )
}