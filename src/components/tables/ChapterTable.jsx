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
import ConfirmModal from '@/components/ui/modal/Confirmation'
import { useSearchParams } from 'next/navigation';


export default function ChapterTable({ data, course_id }) {
    const [isVisible, setIsVisible] = useState(false);

    const [createCategory, setCreateCategory] = useState(false);
    const [edit, setEdit] = useState(false);
    const [editIndex, setEditIndex] = useState(0);
    const [openModal, setOpenModal] = useState(false)
    const [deleteId, setDeleteId] = useState();
    const infoModal = useModal();
    const router = useRouter()

  const searchParams = useSearchParams();
//   const title = searchParams.get('title');
 
//   console.log(title,"title");
  
    const handleCreate = () => {
        router.push(`/chapters/create/${course_id}`)
    }

    const handleDelete = (value) => {
        setDeleteId(value)
        setOpenModal(true)

    }
    const handleYes = async () => {
        const deleteChapter = await axios.delete(`${BaseUrl}/chapters/delete-chapter/${deleteId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'QWlpbGFicyBhcGkga2V5IGF0IGN5YmVyIHBhcmsgNHRoIGZsb29y'
                }
            }
        )
        if (deleteChapter.status === 200) {
            setOpenModal(false)
            router.push(`/chapters/${course_id}`)
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
            <div className="grid md:grid-cols-4 ">
                <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" onClick={handleCreate}>Create Chapter</button>
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
                                        Chapter Title
                                    </TableCell>

                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Sequence
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
                                            <div className="flex items-center gap-3">

                                                <div>
                                                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                        {index + 1}
                                                    </span>

                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-5 py-4 sm:px-6 text-start">

                                            <div className="flex items-center">

                                                <div>
                                                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                        <div style={{ cursor: "pointer" }}>

                                                            {value.title}
                                                        </div>
                                                    </span>

                                                </div>
                                            </div>
                                        </TableCell>


                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {value.serial_number}
                                        </TableCell>


                                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                            <button className="p-2 text-red-700 hover:text-gray-900 dark:hover:text-white/90" onClick={() => handleDelete(value.id)}>
                                                <TrashBinIcon />
                                            </button>
                                            <button className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white/90" onClick={() => handleEdit(value.id)}>
                                                <PencilIcon />
                                            </button>
                                        </TableCell>
                                    </TableRow>

                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    {data.length == 0 && <div className="my-5 text-center text-gray-500 text-theme-sm dark:text-gray-400">No data found</div>}
                </div>
            </div>
        </>
    );
}
