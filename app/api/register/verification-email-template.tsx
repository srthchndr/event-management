'use server'
import * as React from 'react';

interface EmailTemplateProps {
  name: string;
  verificationLink: string;
}

export const VerificationEmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  name, verificationLink
}) => (
  <div>
    <h1>Welcome, {name}!</h1>
    <p>Please click on the following link to verify your email address: <a href={verificationLink}>Verify</a></p>
  </div>
);