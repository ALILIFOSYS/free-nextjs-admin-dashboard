"use client"
import React, { useEffect, useState } from 'react'
import EnrollmentsTable from '@/components/tables/EnrollmentTable'
import axios from 'axios';
import { BaseUrl } from '@/constents/serverBaseUrl';
import { API_KEY } from '@/constents/apiKey';
import { useSearchParams } from 'next/navigation';
const ShowEnrollments = () => {

  const [enrollment, setEnrollment] = useState([])
  const [pagination, setPagination] = useState(false)
  const [page, setPage] = useState(1)
  const [action, setAction] = useState(false)
  const searchParams = useSearchParams();
  // Correct way to access the 'q' parameter
  const searchQuery = searchParams.get('q');


  const getEnrollmentData = async () => {

    const data = await axios.get(`${BaseUrl}/enrollments/get-all-enrollments`, {
      headers: {
        'Cache-Control': 'no-store',
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      }
    })

    return data.data
  }
  const onPageChange = async (page) => {
    setPagination(true)  
    setPage(page)


  }
  const handlePagination = async () => {
     

    const data = await axios.get(`${BaseUrl}/enrollments/get-all-enrollments?page=${page}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      }
    })
    setPagination(false)
    return data.data
   
  }
  const handleSearch = async (query) => {

    const data = await axios.get(`${BaseUrl}/enrollments/get-all-enrollments?search=${query}`, {
      headers: {
        'Cache-Control': 'no-store',
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      }
    })

    if (data.status) {
      return data.data
    }
  }

  const handlePage = async () => {
    if (searchQuery) {
      const data = await handleSearch(searchQuery)
      setEnrollment(data)
    } else if (pagination && page > 1) {
      const data = await handlePagination()
      setEnrollment(data)
      setPagination(false)
    } else {
      const data = await getEnrollmentData()
      
      setEnrollment(data)
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
      <EnrollmentsTable EnrollmentData={enrollment} onPageChange={onPageChange} handleAction={handleAction} />
    </div>
  )
}

export default ShowEnrollments
