import React from 'react'
import EditStudent from '@/components/students/EditStudent'
import { BaseUrl } from '@/constents/serverBaseUrl'
import { API_KEY } from '@/constents/apiKey';
import axios from 'axios'
const page =async ({params}) => {
const {id} = await params
    const getStudentData = async () => {
      const res = await axios.get(`${BaseUrl}/students/get-student-by-id/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY
        }
      });
      return res.data
    }
    const studentData = await getStudentData()
    
    
  return (
    <div>
      <EditStudent  studentData={studentData} />
    </div>
  )
}

export default page