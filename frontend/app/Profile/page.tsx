'use client';
import { useState, useEffect } from 'react';
import { IconShoppingCart, IconUser, IconMail } from '@tabler/icons-react';
import EditProfile from './EditProfile/page';

function Profile() {
  const [user, setUser] = useState<any>(null);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Here you would typically fetch order count from your API
    // For now using mock data
    setOrderCount(5); // Example order count
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto min-h-screen py-16">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-3xl mx-auto">
        <div className="flex flex-col items-center space-y-8">
          {/* Profile Header */}
          <div className="w-32 h-32 bg-green-500 text-white rounded-full flex items-center justify-center text-3xl font-bold">
            {user.prenom?.[0]}{user.nom?.[0]}
          </div>

          {/* User Info */}
          <div className="space-y-6 text-center">
            <h1 className="text-2xl font-bold">
              {user.prenom} {user.nom}
            </h1>

            <div className="border p-4 rounded-lg bg-gray-50 space-y-4">
              <div className="flex items-center space-x-4">
                <IconUser size={20} className="text-gray-500" />
                <p className="font-medium">Full Name:</p>
                <p>{user.prenom} {user.nom}</p>
              </div>

              <div className="flex items-center space-x-4">
                <IconMail size={20} className="text-gray-500" />
                <p className="font-medium">Email:</p>
                <p>{user.email}</p>
              </div>
              <button onClick={() => window.location.href = "Profile/EditProfile"} className="bg-green-500 text-white py-2 px-4 rounded-lg">Edit Profile</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
