"use client";

import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";

import Badge from "../ui/badge/Badge";
import { PencilIcon, TrashBinIcon } from "@/icons";
import CreateCategory from "../courses/CreateCatergory";
import axios from "axios";
import { BaseUrl } from "@/constents/serverBaseUrl";
import EditCategory from "./EditCategory";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Category {
    id: number;
    display_order: number;
    title: string;
    media_id: number;
    is_featured: number;
    deleted_at: string | null,
    media_src: string | null;
}
const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};


// Show button when page is scrolled down


export default function CategoryTable({ getCategoryData }: { getCategoryData: Category[] }) {
    // const [isVisible, setIsVisible] = useState(false);

    const [createCategory, setCreateCategory] = useState(false);
    const [edit, setEdit] = useState<boolean>(false);
    const [editIndex, setEditIndex] = useState<number | null>(0);


    const router = useRouter()   

    // const toggleVisibility = () => {
    //     if (window.pageYOffset > 300) {
    //         setIsVisible(true);
    //     } else {
    //         setIsVisible(false);
    //     }
    // };
    const handleCreate = () => {

        setCreateCategory(true);
        setEdit(false)
    }

    const CloseModal = () => {
        setCreateCategory(false);
    }
    const handleEdit = (id: number) => {
        setCreateCategory(false);
        scrollToTop()
        setEdit(true);
        setEditIndex(id);

    }
    const handleRestore = async (id: number) => {
        try {
            const response = await axios.put(
                `${BaseUrl}/courses/${id}/restore`,
                {},
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': 'QWlpbGFicyBhcGkga2V5IGF0IGN5YmVyIHBhcmsgNHRoIGZsb29y'
                    }
                }
            );

            if (response.data.status) {
                router.refresh()
            }
        } catch (error) {
            console.error('Error restoring enrollment:', error);
        }
    };
    const handleDelete = async (id: number) => {
        try {
            // Logic to handle category deletion
            const deleteCategory = await axios.delete(`${BaseUrl}/courses/delete-category/${id}`, {
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
    // useEffect(() => {
    //     window.addEventListener('scroll', toggleVisibility);
    //     return () => window.removeEventListener('scroll', toggleVisibility);
    // }, []);

    return (
        <>
            {createCategory && <CreateCategory CloseModal={CloseModal} />}
            {edit && editIndex !== null && <EditCategory category={getCategoryData[editIndex]} CloseModal={() => setEdit(false)} />}
            <div className="">
                <button className='px-3 py-1  border border-blue-500 text-blue-500 rounded hover:bg-blue-500 hover:text-white transition' onClick={handleCreate}>Create Category +</button>
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
                                        Thumbnail
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Title
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Featured
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
                                {getCategoryData.map((value, index) => (
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
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <div className="w-20 h-20 overflow-hidden rounded">
                                                <Image
                                                    width={100}
                                                    height={100}
                                                    src={value.media_src ?? "/images/logo/aiilab-dark.svg"}
                                                    alt='Thumbnail'
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400" >
                                            {value.title}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                            {value.is_featured ? <Badge variant="solid" color="success">Yes</Badge> : <Badge variant="solid" color="error">No</Badge>}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">

                                            {!value.deleted_at ? <Badge variant="solid" color="success">
                                                Success
                                            </Badge> :
                                                <Badge variant="solid" color="error">
                                                    Deleted
                                                </Badge>}

                                        </TableCell>
      
                                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                            {value && value.deleted_at ?

                                                <button
                                                    className="p-2 text-blue-600 hover:text-blue-400 dark:text-blue-500 dark:hover:text-blue-300 transition-colors rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                    onClick={() => handleRestore(value.id)}
                                                    title="Restore Enrollment"
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
                                                :
                                                <>
                                                    <button className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white/90" onClick={() => handleDelete(value.id)}>
                                                        <TrashBinIcon />
                                                    </button>
                                                    <button className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white/90" onClick={() => handleEdit(index)}>
                                                        <PencilIcon />
                                                    </button>
                                                </>       
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
