import React from 'react';

export default function About() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div>
            <a href="/">⬅Home</a>
        </div>
      <h1 className="text-3xl font-bold mt-4 mb-4 text-gray-800">About Us</h1>
      <p className="text-lg text-gray-600 max-w-xl text-center">
        Welcome to our platform. Our mission is to connect people who want to practice English speaking skills in a friendly and interactive environment.
      </p>
    </div>
  );
}
