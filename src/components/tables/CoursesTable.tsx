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
import { PencilIcon, ResetIcon, TrashBinIcon } from "@/icons";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BaseUrl } from "@/constents/serverBaseUrl";
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

}

export default function CoursesTable({ data }: { data: Course[] }) {
  
  const router = useRouter()

  const handleCreate = () => {
    router.push('/courses/new');
  }

  const handleEdit = (id: number) => {
    router.push(`/courses/edit/${id}`);
  }
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
                    Insctructor
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

                      {index + 1}
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">

                      <div className="flex items-center">
                        <div className=" overflow-hidden rounded-full">
                          <Image
                            width={80}
                            height={80}
                            src='/images/logo/auth-logo.svg'
                            alt="fds"
                          />
                        </div>
                        <div>
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            <div style={{ cursor: "pointer" }}>

                              {value.title}
                            </div>
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
                          <button className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white/90" onClick={()=>handleDelete(value.id)}>
                            <TrashBinIcon />
                          </button>
                          <button className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white/90" onClick={() => handleEdit(value.id)}>
                            <PencilIcon />
                          </button>
                        </>
                        :
                        <Image src={ResetIcon} width={20} height={20} alt="sf" style={{ cursor: "pointer" }} />
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
