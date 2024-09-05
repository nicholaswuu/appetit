import React from 'react';
import { useAuth } from '../AuthContext';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebaseConfig';

function UserProfile() {
  const { user, handleSignOut } = useAuth();

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('User signed in:', result.user);
    } catch (error) {
      console.error('Error during sign-in:', error.message);
    }
  };

  return (
    <div class = "flex flex-nowrap items-center justify-self-end">
      {user ? (
        <>
          <p class = "px-4" >{user.displayName || user.email}</p>
          <button class = "hover:text-white border border-red-800 hover:bg-red-900 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:border-red-600 dark:text-red-600 dark:hover:text-white dark:hover:bg-red-600"
          onClick={handleSignOut}>Sign Out</button>
        </>
      ) : (
        <button class = "hover:text-white border border-green-800 hover:bg-green-900 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:border-green-600 dark:text-green-600 dark:hover:text-white dark:hover:bg-green-600" 
        onClick={handleSignIn}>Sign in with Google</button>
      )}
    </div>
  );
}

export default UserProfile;
