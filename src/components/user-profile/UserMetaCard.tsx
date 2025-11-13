"use client";
import React, { useEffect, useState } from "react";

import Image from "next/image";
import axios from "axios";
import { BaseUrl } from "@/constents/serverBaseUrl";
import { AWS_STUDENT_BASE_URL } from "@/constents/URLs";


interface Admin {
  src: string;
  name: string;
  about: string;
  email: string;
  phone: string;
}

export default function UserMetaCard() {
  const [admin, setAdmin] = useState<Admin>()
  const getAdmin = async (email:string) => {
    const data = await axios.post(`${BaseUrl}/admin/get-admin`, { email }, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'QWlpbGFicyBhcGkga2V5IGF0IGN5YmVyIHBhcmsgNHRoIGZsb29y'
      }
    })
    // console.log(data, "aa");
    if (data.status) {
      // console.log(data.data.data[0]);

      setAdmin(data.data.data[0])
    }
  }

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {

      getAdmin(userEmail);
    }
  }, [])
  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <Image
                width={80}
                height={80}
                src={admin ? `${AWS_STUDENT_BASE_URL}${admin.src}` : "/images/user/owner.jpg"}
                alt="user"
              />
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {admin && admin.name}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {admin && admin.about}
                </p>

              </div>
            </div>

          </div>

        </div>
      </div>

      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Personal Information
            </h4>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  First Name
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {admin && admin.name}

                </p>
              </div>

              {/* <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Last Name
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  Chowdhury
                </p>
              </div> */}

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Email address
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {admin && admin.email}

                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Phone
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {admin && admin.phone}

                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Bio
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                 {admin&&admin.about}

                </p>
              </div>
            </div>
          </div>


        </div>


      </div>
    </>
  );
}
