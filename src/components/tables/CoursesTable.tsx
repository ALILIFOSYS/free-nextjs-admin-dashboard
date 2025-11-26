'use client'
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
  
import Badge from "../ui/badge/Badge";
import Image from "next/image";
import { PencilIcon, TrashBinIcon } from "@/icons";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BaseUrl } from "@/constents/serverBaseUrl";
import { AWS_STUDENT_BASE_URL } from "@/constents/URLs";
// import { useModal } from "@/hooks/useModal";


interface Course { 
  id: number;
  title: string;
  description: string;
  category_id: number;
  media_id: number;
  price: number;
  is_active: number;
  is_free: number;
  deleted_at: Date | null;
  user_id: number;
  category_title: string;
  instructor_name: string;
  media_src: string
}

export default function CoursesTable({ data }: { data: Course[] }) {

  const router = useRouter()

  const handleCreate = () => {
    router.push('/courses/new');
  }

  const handleEdit = (id: number) => {
    router.push(`/courses/edit/${id}`);
  }
  const handleRestore = async (id: number) => {
    try {
      const response = await axios.put(
        `${BaseUrl}/courses/course/${id}/restore`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'QWlpbGFicyBhcGkga2V5IGF0IGN5YmVyIHBhcmsgNHRoIGZsb29y'
          }
        }
      );

      if (response.data.status) {
        // Handle successful restoration
        // Refresh your category list
        router.refresh()
      }
    } catch (error) {
      console.error('Error restoring category:', error);
    }
  };
  const handleDelete = async (id: number) => {
    try {

      // Logic to handle category deletion
      const deleteCategory = await axios.delete(`${BaseUrl}/courses/delete-course/${id}`, {
        // You can show a confirmation dialog or perform the deletion here
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'QWlpbGFicyBhcGkga2V5IGF0IGN5YmVyIHBhcmsgNHRoIGZsb29y'
        }
      });

      if (deleteCategory.data.status) {
        alert(deleteCategory.data.message);
        router.refresh()
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  }



  return (
    <>

      <div className="max-w ">
        <button className='px-3 py-1  border border-blue-500 text-blue-500 rounded hover:bg-blue-500 hover:text-white transition' onClick={handleCreate}>Create Courses +</button>
      </div>
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
                    Course Name
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Free
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Price
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Instructor
                  </TableCell>

                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Status
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
                {data.map((value, index) => (
                  <TableRow key={index}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {index + 1}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">

                      <div className="flex items-center">
                        <div className=" overflow-hidden rounded">
                          <Image
                            width={50}
                            height={50}
                            src={value.media_src ?`${AWS_STUDENT_BASE_URL}${value.media_src}`: '/images/logo/auth-logo.svg'}
                            alt="fds"
                          />
                        </div>
                        <div>
                          <span className=" mx-3 block font-medium text-gray-800 text-theme-sm dark:text-white/90">


                            {value.title}

                          </span>

                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      <div>

                        <label className="flex items-center">
                          {/* <input
                            type="checkbox"
                            name="is_active"
                            checked={value.is_free == 1 ? true : false}
                            onChange={handlePublish}
                            className="mx-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          /> */}
                          {value.is_free ? <Badge variant="solid" color="success">free</Badge> : <Badge variant="solid" color="error">Premium</Badge>}
                          {/* <span className="ml-2 text-sm font-medium text-gray-700"> Approve and Publish</span> */}
                        </label>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="flex -space-x-2">
                        {value.price ? value.price : 0}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {value.instructor_name}
                    </TableCell>

                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {!value.deleted_at ? <Badge variant="solid" color="success">
                        Active
                      </Badge> : (
                        // {value.deleted_at ?  "": ""}
                        <Badge variant="solid" color="error">
                          Deleted
                        </Badge>)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {value && value.is_active ?

                        <>
                          <button className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white/90" onClick={() => handleDelete(value.id)}>
                            <TrashBinIcon />
                          </button>
                          <button className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white/90" onClick={() => handleEdit(value.id)}>
                            <PencilIcon />
                          </button>
                        </>
                        :
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
                      }
                    </TableCell>
                  </TableRow>

                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}    
