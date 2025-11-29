'use client'
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import { TrashBinIcon } from "@/icons";
import ProgressBar from "../ui/progress/ProgressBar";
import axios from "axios";
import { BaseUrl } from "@/constents/serverBaseUrl";
import { API_KEY } from '@/constents/apiKey';
import ConfirmModal from '@/components/ui/modal/Confirmation'
import Pagination from "./Pagination";
export default function StudentTable({ EnrollmentData, onPageChange, handleAction }) {

  const [openModal, setOpenModal] = useState(false)
  const [selectedId, setSelectedId] = useState();
  const [actionType, setActionType] = useState('');

  const handleDelete = async (id) => {
    setSelectedId(id)
    setActionType('delete')
    setOpenModal(true)
  }

  const handleBlock = async (id) => {
    setSelectedId(id)
    setActionType('block')
    setOpenModal(true)
  }
  const handleRestore = async (id) => {
    try {
      const response = await axios.put(
        `${BaseUrl}/enrollments/${id}/restore`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY
          }
        }
      );

      if (response.data.status) {
        // Handle successful restoration
        handleAction(); // Refresh the list
      }
    } catch (error) {
      console.error('Error restoring enrollment:', error);
    }
  };
  const handleYes = async () => {
    try {
      // console.log(selectedId, "sdfs");

      let endpoint = actionType === 'delete'
        ? `${BaseUrl}/enrollments/block-enrollment/${selectedId}`
        : `${BaseUrl}/enrollments/block-enrollment/${selectedId}`;

      const response = await axios.delete(endpoint,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY
          }
        }
      );

      if (response.status === 200) {
        setOpenModal(false)
        handleAction()
      } else {
        console.error("Error:", response.data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const handleNo = () => {
    setOpenModal(false)
  }


  // console.log(EnrollmentData);

  return (
    <>
      {openModal && <ConfirmModal handleYes={handleYes} handleNo={handleNo} />}


      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w ">
          <div className="">
            <Table>
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    #
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Enroll ID
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Student Name
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Course Name
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Progress
                  </TableCell>



                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {EnrollmentData.status && EnrollmentData.data.length > 0 && EnrollmentData.data.map((value, index) => (
                  <TableRow key={index}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {index + 1}
                      </span>

                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {value.id}
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">

                      <div className="flex items-center">

                        <div>
                          <span className="block  text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            {value.user_name}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="flex -space-x-2">
                        {value.course_title}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="w-32 sm:w-48">
                        <ProgressBar progress={value.course_progress} />
                      </div>
                    </TableCell>


                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {value && !value.deleted_at ? (
                        <div className="flex items-center gap-2">
                          <button
                            className="p-2 text-red-700 hover:text-red-400 dark:hover:text-white/90 transition-colors"
                            onClick={() => handleDelete(value.id)}
                            title="Delete Enrollment"
                          >
                            <TrashBinIcon />
                          </button>
                          <button
                            className={`p-2 ${value.is_blocked ? 'text-green-600' : 'text-yellow-600'} hover:text-gray-900 dark:hover:text-white/90 transition-colors`}
                            onClick={() => handleBlock(value.id)}
                            title={value.is_blocked ? "Unblock Enrollment" : "Block Enrollment"}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-5 h-5"
                            >
                              {value.is_blocked ? (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                              ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                              )}
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <button
                          className="p-2 text-blue-600 hover:text-blue-400 dark:text-blue-500 dark:hover:text-blue-300 transition-colors rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          onClick={() => handleRestore(value.id)}
                          title="Restore"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                            />
                          </svg>
                        </button>
                      )}
                    </TableCell>
                  </TableRow>

                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="m-5 justify-items-end">
          {EnrollmentData.status && EnrollmentData.pagination &&
            <Pagination totalPages={EnrollmentData.pagination.totalPages} currentPage={EnrollmentData.pagination.currentPage} onPageChange={onPageChange} />
          }
        </div>
      </div>


    </>
  );
}
