'use client'
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";

import Image from "next/image";
import { useRouter } from "next/navigation";





export default function ChapterCoursesTable({ data }) {
    
    const router = useRouter()

    const handleChapter = (course_id) => {
       router.push(`/chapters/${course_id}`);
    }

    return (
        <>
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
                                        Price
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Catergory
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

                                                            { value.title}
                                                        </div>
                                                    </span>

                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <div className="flex -space-x-2">
                                                {value.price ? value.price : 0}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {value.category_title}
                                        </TableCell>


                                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                            <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                                            onClick={()=>handleChapter(value.id)}
                                            >
                                                View Chapters
                                            </button>
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
