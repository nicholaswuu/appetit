import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from './firebaseConfig';

function SignInButton() {
  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('User signed in:', result.user);
    } catch (error) {
      console.error('Error during sign-in:', error.message);
    }
  };

  return (
    <button class = "hover:text-white border border-green-800 hover:bg-green-900 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:border-green-600 dark:text-green-600 dark:hover:text-white dark:hover:bg-green-600" 
    onClick={handleSignIn}>Sign in with Google</button>
  );
}

export default SignInButton;
