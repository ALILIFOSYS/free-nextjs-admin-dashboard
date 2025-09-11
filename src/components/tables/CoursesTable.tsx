'use client'
import React, { useEffect, useState } from "react";
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
import { Modal } from "../ui/modal";
import { useModal } from "@/hooks/useModal";


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
  const [isVisible, setIsVisible] = useState(false);

  const [createCategory, setCreateCategory] = useState(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [editIndex, setEditIndex] = useState<number | null>(0);
  const [openModal, setOpenModal] = useState<boolean>(false)
  const infoModal = useModal();
  const router = useRouter()
  console.log(data, "dfsd");

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };
  const handleCreate = () => {
    console.log("hello");

    router.push('/courses/new');
  }

  const CloseModal = () => {
    setCreateCategory(false);
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  const handleEdit = (id: number) => {
    setEdit(true);
    setCreateCategory(false);
    setEditIndex(id);
    // Logic to handle category editing
    console.log("Edit Category button clicked for ID:", id);
    // You can redirect to an edit category page or open a modal here
    router.push(`/courses/edit/${id}`);
  }
  const handleDelete = async (id: number) => {
    try {
      console.log(id,"id");
      
      // Logic to handle category deletion
      const deleteCategory = await axios.delete(`${BaseUrl}/courses/delete-course/${id}`, {
        // You can show a confirmation dialog or perform the deletion here
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'QWlpbGFicyBhcGkga2V5IGF0IGN5YmVyIHBhcmsgNHRoIGZsb29y'
        }
      });
      console.log(deleteCategory,"delete");
      
      if (deleteCategory.data.status) {
        alert(deleteCategory.data.message);
        router.refresh()
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  }

  const handlePublish = (e: any) => {
    const checked = (e.target as HTMLInputElement).checked;

    console.log(checked);
    if (checked == true) {
      setOpenModal(true)
      infoModal.openModal()
    } else {
      setOpenModal(true)
    }
  }
const handleFree = () =>{

}
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);
  return (
    <>
      {/* {openModal &&
        <Modal
          isOpen={infoModal.isOpen}
          onClose={infoModal.closeModal}
          className="max-w-[600px] p-5 lg:p-10"
        >
          <div className="text-center">
            <div className="relative flex items-center justify-center z-1 mb-7">
              <svg
                className="fill-blue-light-50 dark:fill-blue-light-500/15"
                width="90"
                height="90"
                viewBox="0 0 90 90"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M34.364 6.85053C38.6205 -2.28351 51.3795 -2.28351 55.636 6.85053C58.0129 11.951 63.5594 14.6722 68.9556 13.3853C78.6192 11.0807 86.5743 21.2433 82.2185 30.3287C79.7862 35.402 81.1561 41.5165 85.5082 45.0122C93.3019 51.2725 90.4628 63.9451 80.7747 66.1403C75.3648 67.3661 71.5265 72.2695 71.5572 77.9156C71.6123 88.0265 60.1169 93.6664 52.3918 87.3184C48.0781 83.7737 41.9219 83.7737 37.6082 87.3184C29.8831 93.6664 18.3877 88.0266 18.4428 77.9156C18.4735 72.2695 14.6352 67.3661 9.22531 66.1403C-0.462787 63.9451 -3.30193 51.2725 4.49185 45.0122C8.84391 41.5165 10.2138 35.402 7.78151 30.3287C3.42572 21.2433 11.3808 11.0807 21.0444 13.3853C26.4406 14.6722 31.9871 11.951 34.364 6.85053Z"
                  fill=""
                  fillOpacity=""
                />
              </svg>

              <span className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
                <svg
                  className="fill-blue-light-500 dark:fill-blue-light-500"
                  width="38"
                  height="38"
                  viewBox="0 0 38 38"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.85547 18.9998C5.85547 11.7396 11.7411 5.854 19.0013 5.854C26.2615 5.854 32.1471 11.7396 32.1471 18.9998C32.1471 26.2601 26.2615 32.1457 19.0013 32.1457C11.7411 32.1457 5.85547 26.2601 5.85547 18.9998ZM19.0013 2.854C10.0842 2.854 2.85547 10.0827 2.85547 18.9998C2.85547 27.9169 10.0842 35.1457 19.0013 35.1457C27.9184 35.1457 35.1471 27.9169 35.1471 18.9998C35.1471 10.0827 27.9184 2.854 19.0013 2.854ZM16.9999 11.9145C16.9999 13.0191 17.8953 13.9145 18.9999 13.9145H19.0015C20.106 13.9145 21.0015 13.0191 21.0015 11.9145C21.0015 10.81 20.106 9.91454 19.0015 9.91454H18.9999C17.8953 9.91454 16.9999 10.81 16.9999 11.9145ZM19.0014 27.8171C18.173 27.8171 17.5014 27.1455 17.5014 26.3171V17.3293C17.5014 16.5008 18.173 15.8293 19.0014 15.8293C19.8299 15.8293 20.5014 16.5008 20.5014 17.3293L20.5014 26.3171C20.5014 27.1455 19.8299 27.8171 19.0014 27.8171Z"
                    fill=""
                  />
                </svg>
              </span>
            </div>

            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90 sm:text-title-sm">
              Information Alert!
            </h4>
            <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
           Please confirm that you understand this course will be offered free of charge
            </p>

            <div className="flex items-center justify-center w-full gap-3 mt-7">
              <button
                type="button"
                className="flex justify-center w-full px-4 py-3 text-sm font-medium text-white rounded-lg bg-blue-light-500 shadow-theme-xs hover:bg-blue-light-600 sm:w-auto"
                onClick={handleFree}
              >
                Confirm
              </button>
              <button onClick={infoModal.closeModal}
                type="button"
                className="flex justify-center w-full px-4 py-3 text-sm font-medium text-white rounded-lg bg-gray-900 shadow-theme-xs hover:bg-gray-800 sm:w-auto"
              >
                Cancel
              </button>

            </div>
          </div>
        </Modal>
      } */}
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
