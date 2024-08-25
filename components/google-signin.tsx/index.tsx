import { signIn } from '@/auth';
import React from 'react'
import { Button } from '../ui/button';

function GoogleSignin() {
    return (
        <Button onClick={GoogleSignin}>Signin with Google</Button>
    )
}

export default GoogleSignin