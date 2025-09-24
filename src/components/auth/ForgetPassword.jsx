// /app/forgot-password/page.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import VerifyOtp from '@/components/auth/VerifyOtp'
import { BaseUrl } from "@/constents/serverBaseUrl";
import axios from "axios";
// A simple placeholder for the logo component
const ReadyLmsLogo = () => (
  <div className="flex items-center space-x-2">
    <div className="bg-purple-600 p-2 rounded-lg">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </div>
    <span className="text-2xl font-bold text-gray-800">Aiilab</span>
  </div>
);

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [verifyOtp, setVerifyOtp] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
const [error,setError] = useState('')
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('')
    const sendOtp = await axios.post(`${BaseUrl}/dashboard/forgot-password`, { email }, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'QWlpbGFicyBhcGkga2V5IGF0IGN5YmVyIHBhcmsgNHRoIGZsb29y',

      }
    })
    // Handle the password recovery logic here
    console.log(sendOtp, "sent");
    if (sendOtp.data.status) {
      setVerifyOtp(true)
    } else {
      setError(sendOtp.data.message)
      setIsLoading(false);
    }

  };

  return (
    <>
      {!verifyOtp && <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl flex bg-white rounded-2xl shadow-xl overflow-hidden">

          {/* Left Side: Form */}
          <div className="w-full md:w-1/2 p-8 sm:p-12">
            <div className="mb-10">
              <ReadyLmsLogo />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Recover Password
            </h1>
            <p className="text-gray-600 mb-8">
              We will send you a OTP code to recover your password
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) =>{
                     setEmail(e.target.value)
                     setError('')
                    }
                  }
                  placeholder="Email address"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 text-center">
                  {error}
                </div>
              )}
              <button
                type="submit"
                className={`w-full flex justify-center bg-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ?
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  :
                  ' Proceed Next'
                }
              </button>
            </form>
          </div>

          {/* Right Side: Image */}
          <div className="hidden md:block md:w-1/2 relative flex justify-center mx-6">
            <Image
              // width={731}
              // height={148}
              src="./images/logo/aiilab-dark.svg"
              alt="Logo"
              layout="fill"
              priority
            />
          </div>
        </div>
      </div>}
      {verifyOtp && <VerifyOtp email={email} />}
    </>
  );
};

export default ForgotPasswordPage;