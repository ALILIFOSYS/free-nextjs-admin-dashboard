"use client"
import React, { useEffect, useState } from 'react'
import InstructorTable from '@/components/tables/InstructorTable'
import axios from 'axios';
import { BaseUrl } from '@/constents/serverBaseUrl';
import { useSearchParams } from 'next/navigation';
const ShowInstructors = () => {

  const [instructor, setInstructor] = useState([])
  const [pagination, setPagination] = useState(false)
  const [page, setPage] = useState(1)
  const [action, setAction] = useState(false)
  const searchParams = useSearchParams();
  // Correct way to access the 'q' parameter
  const searchQuery = searchParams.get('q');


  const getInstructorData = async () => {

    const data = await axios.get(`${BaseUrl}/instructors/get-instructors`, {
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

    const data = await axios.get(`${BaseUrl}/instructors/get-instructor-by-search?title=${query}`, {
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
      setInstructor(data)
    } else if (pagination && page > 1) {
      const data = await handlePagination()
      setInstructor(data)
      setPagination(false)
    } else {
      const data = await getInstructorData()
      
      setInstructor(data)
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
      <InstructorTable InstructorData={instructor} onPageChange={onPageChange} handleAction={handleAction} />
    </div>
  )
}

export default ShowInstructors