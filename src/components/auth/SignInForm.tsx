"use client";
// import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import axios from "axios";

import { useRouter } from "next/navigation";
import React, {  useRef, useState } from "react";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  // const [isChecked, setIsChecked] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
const router = useRouter();
  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    console.log("Email:", email);
    console.log("Password:", password);

    // Basic valeidation
    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }
    const Logindata = { email, password }
    const {data} = await axios.post('http://localhost:3001/admin/api/dashboard/login', Logindata, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'QWlpbGFicyBhcGkga2V5IGF0IGN5YmVyIHBhcmsgNHRoIGZsb29y'
      }
    })

    console.log(data, "login response");
    if(data.token){
      localStorage.setItem("AuthToken", data.token);
      localStorage.setItem("userEmail", data.email);
      localStorage.setItem("userName", data.name);  
      localStorage.setItem("userRole", data.role);
      router.push('/')
    }
  } 

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      {/* <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          Back to dashboard
        </Link>
      </div> */}
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>
          <div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input placeholder="info@gmail.com" type="email" ref={emailRef} />
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      ref={passwordRef}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>

                <div>
                  <Button className="w-full" size="sm">
                    Sign in
                  </Button>
                </div>
              </div>
            </form>


          </div>
        </div>
      </div>
    </div>
  );
}
