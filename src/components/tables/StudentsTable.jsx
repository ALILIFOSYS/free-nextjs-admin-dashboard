'use client'
import  { useState } from "react";
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
import ConfirmModal from '@/components/ui/modal/Confirmation'
import Pagination from "./Pagination";
export default function StudentTable({ studentData,onPageChange,handleAction }) {

  const [openModal, setOpenModal] = useState(false)
  const [deleteId, setDeleteId] = useState();


  const router = useRouter()


  const handleCreate = () => {
    router.push('/students/new');
  }



 
  const handleEdit = (id) => {
    router.push(`/students/edit/${id}`);
  }
  const handleDelete = async (id) => {
      setDeleteId(id)
      setOpenModal(true)
   
  }



  const handleYes = async () => {
    const deleteChapter = await axios.delete(`${BaseUrl}/students/block-student/${deleteId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'QWlpbGFicyBhcGkga2V5IGF0IGN5YmVyIHBhcmsgNHRoIGZsb29y'
        }
      }
    )
    if (deleteChapter.status === 200) {
      setOpenModal(false)
      handleAction()
    } else {
      console.log("error");
    }
  }

  const handleNo = () => {
    setOpenModal(false)
  }


 
  return (
    <>
      {openModal && <ConfirmModal handleYes={handleYes} handleNo={handleNo} />}

      <div className="max-w my-5 ">
        <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" onClick={handleCreate}>Create Student</button>
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
                    Name
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Email
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Phone
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
                {studentData.status && studentData.data.length>0&& studentData.data.map((value, index) => (
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

                              {value.name}
                            </div>
                          </span>

                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="flex -space-x-2">
                        {value.email}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {value.phone}
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
                      {value && !value.deleted_at ?

                        <>
                          <button className="p-2 text-red-700 hover:text-red-400 dark:hover:text-white/90" onClick={() => handleDelete(value.id)}>
                            <TrashBinIcon />
                          </button>
                          <button className="p-2 text-yellow-600 hover:text-gray-900 dark:hover:text-white/90" onClick={() => handleEdit(value.id)}>
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
        <div className="m-5 justify-items-end">
          {studentData.status && studentData.pagination &&
            <Pagination totalPages={studentData.pagination.totalPages} currentPage={studentData.pagination.currentPage} onPageChange={onPageChange} />
          }
        </div>
      </div>


    </>
  );
}
