import React from 'react';
import { useAuth } from './AuthContext';
import SignInButton from './SignInButton';

function UserProfile() {
  const { user, handleSignOut } = useAuth();

  return (
    <div class = "flex flex-nowrap items-center justify-self-end">
      {user ? (
        <>
          <p class = "px-4" >{user.displayName || user.email}</p>
          <button class = "hover:text-white border border-red-800 hover:bg-red-900 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:border-red-600 dark:text-red-600 dark:hover:text-white dark:hover:bg-red-600"
          onClick={handleSignOut}>Sign Out</button>
        </>
      ) : (
        <SignInButton />
      )}
    </div>
  );
}

export default UserProfile;
