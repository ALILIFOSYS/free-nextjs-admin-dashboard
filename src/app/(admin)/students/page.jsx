"use client"
import React, { useEffect, useState } from 'react'
import StudentTable from '../../../components/tables/StudentsTable'
import axios from 'axios';
import { BaseUrl } from '@/constents/serverBaseUrl';
import { useSearchParams } from 'next/navigation';
const page = () => {

  const [students, setStudents] = useState([])
  const [pagination, setPagination] = useState(false)
  const [page, setPage] = useState(1)
  const [action, setAction] = useState(false)
  const searchParams = useSearchParams();
  // Correct way to access the 'q' parameter
  const searchQuery = searchParams.get('q');


  const getStudentData = async () => {

    const data = await axios.get(`${BaseUrl}/students/get-all-students`, {
      headers: {
        'Cache-Control': 'no-store',
        'Content-Type': 'application/json',
        'x-api-key': 'QWlpbGFicyBhcGkga2V5IGF0IGN5YmVyIHBhcmsgNHRoIGZsb29y'
      }
    })

    return data.data
  }
  const onPageChange = async (page) => {
    setPagination(true)
    setPage(page)


  }
  const handlePagination = async () => {


    const data = await axios.get(`${BaseUrl}/students/get-all-students?page=${page}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'QWlpbGFicyBhcGkga2V5IGF0IGN5YmVyIHBhcmsgNHRoIGZsb29y'
      }
    })
    setPagination(false)
    return data.data

  }
  const handleSearch = async (query) => {

    const data = await axios.get(`${BaseUrl}/students/get-student-by-search?name=${query}`, {
      headers: {
        'Cache-Control': 'no-store',
        'Content-Type': 'application/json',
        'x-api-key': 'QWlpbGFicyBhcGkga2V5IGF0IGN5YmVyIHBhcmsgNHRoIGZsb29y'
      }
    })

    if (data.status) {
      return data.data
    }
  }

  const handlePage = async () => {
    if (searchQuery) {
      const data = await handleSearch(searchQuery)
      setStudents(data)
    } else if (pagination && page > 1) {
      const data = await handlePagination()
      setStudents(data)
      setPagination(false)
    } else {
      const data = await getStudentData()
      setStudents(data)
    }
  }
  const handleAction = () => {
    setAction(!action)
  }
  
  useEffect(() => {
    handlePage()
  }, [searchQuery, page,action])
  return (
    <div>
      <StudentTable studentData={students} onPageChange={onPageChange} handleAction={handleAction} />
    </div>
  )
}

export default page