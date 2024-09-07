import React from 'react';
import { useAuth } from '../AuthContext';
import { signInWithPopup, getIdToken } from 'firebase/auth';
import { auth, provider } from '../firebaseConfig';

function UserProfile() {
  const { user, handleSignOut } = useAuth();

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error during sign-in:', error.message);
    }
  };

  const saveVisits = async (visitsData) => {
    if (user) {
      const token = await getIdToken(user);
      try {
        const response = await fetch('http://localhost:5001/api/visits', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ visits: visitsData }),
        });
        if (response.ok) {
          console.log('Visits saved successfully');
        } else {
          console.error('Error saving visits:', response.statusText);
        }
      } catch (error) {
        console.error('Error saving visits:', error);
      }
    }
  };

  return (
    <div className="flex flex-nowrap items-center justify-self-end">
      {user ? (
        <>
          <p className="px-4">{user.displayName || user.email}</p>
          <button
            className="hover:text-white border border-red-800 hover:bg-red-900 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:border-red-600 dark:text-red-600 dark:hover:text-white dark:hover:bg-red-600"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </>
      ) : (
        <button
          className="hover:text-white border border-green-800 hover:bg-green-900 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:border-green-600 dark:text-green-600 dark:hover:text-white dark:hover:bg-green-600"
          onClick={handleSignIn}
        >
          Sign in with Google
        </button>
      )}
    </div>
  );
}

export default UserProfile;