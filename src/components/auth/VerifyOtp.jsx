// /app/verify-otp/page.jsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { BaseUrl } from "@/constents/serverBaseUrl";
import { API_KEY } from '@/constents/apiKey';
import { useRouter } from "next/navigation";
// Reusable logo component for consistency
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

const VerifyOtpPage = ({ email }) => {
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [timer, setTimer] = useState(115); // 2 minutes in seconds
    const [isTimerActive, setIsTimerActive] = useState(true);
    const [error, setError] = useState('')
      const [isLoading, setIsLoading] = useState(false);
    
    const inputRefs = useRef([]);

    // useEffect to handle the countdown timer

    const router = useRouter()
    useEffect(() => {
        let interval;
        if (isTimerActive && timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else if (timer === 0) {
            setIsTimerActive(false);
            clearInterval(interval);
        }
        // Cleanup function to clear the interval when the component unmounts
        return () => clearInterval(interval);
    }, [isTimerActive, timer]);

    const handleChange = (e, index) => {
        const { value } = e.target;
        if (/^[0-9]$/.test(value) || value === "") {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            if (value !== "" && index < 5) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && otp[index] === "" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleResend = async () => {
        const sendOtp = await axios.post(`${BaseUrl}/dashboard/forgot-password`, { email }, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY,

            }
        })
        if (sendOtp.data.status) {
            setError('')
            setOtp(new Array(6).fill(""))
            // Add your OTP resend logic here (e.g., API call)
            setTimer(120); // Reset timer to 2 minutes
            setIsTimerActive(true); // Start the countdown
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const enteredOtp = otp.join('');
        if (enteredOtp.length === 6) {
            const VerifyOtp = await axios.post(`${BaseUrl}/dashboard/verify-otp`, { email, otp: enteredOtp }, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY,

                }
            })
            if (VerifyOtp.data.status) {
                setIsLoading(false);
                router.push(`/reset-password?email=${email}`)
            } else {
                setIsLoading(false);
                setError(VerifyOtp.data.message)
            }



        } else {
            setError('Please enter the 6-digit OTP.');
        }
    };

    // Helper function to format the time into MM:SS
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl flex bg-white rounded-2xl shadow-xl overflow-hidden">

                <div className="w-full md:w-1/2 p-8 sm:p-12">
                    <div className="mb-10">
                        <ReadyLmsLogo />
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-3">
                        Check your email
                    </h1>
                    <p className="text-gray-600 mb-8">
                        We've sent a 6-digit code to your email {email}. Please enter it below.
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="flex justify-center space-x-2 mb-6">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(e, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            ))}
                        </div>

                        <button
                            type="submit"
                            className="w-full justify-center bg-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-300"
                        >
                            {isLoading ?
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                :
                                'Verify OTP'
                            }

                        </button>

                        <div className="text-center mt-6 h-5 my-2">
                            {error && <p className="text-red-700 my-2">{error}</p>}
                            {isTimerActive ? (
                                <p className="text-sm text-gray-500">
                                    Resend code in {formatTime(timer)}
                                </p>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    className="text-sm text-purple-600 hover:underline focus:outline-none"
                                >
                                    Didn't receive the code? Resend
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="hidden md:block md:w-1/2 relative flex justify-center mx-6">
                    <Image
                        src="./images/logo/aiilab-dark.svg"
                        alt="Logo"
                        layout="fill"
                        priority
                    />
                </div>
            </div>
        </div>
    );
};

export default VerifyOtpPage;
