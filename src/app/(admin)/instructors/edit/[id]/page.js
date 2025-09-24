import React from 'react'
import EditInstructor from '@/components/instructors/EditInstructor'
import { BaseUrl } from '@/constents/serverBaseUrl'
import axios from 'axios'
const Page =async ({params}) => {
const {id} = await params
    const getStudentData = async () => {
      const res = await axios.get(`${BaseUrl}/instructors/get-instructor/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'QWlpbGFicyBhcGkga2V5IGF0IGN5YmVyIHBhcmsgNHRoIGZsb29y'
        }
      });
      return res.data
    }
    const InstructorData = await getStudentData()
    
  return (
    <div>
      <EditInstructor  InstructorData={InstructorData} />
    </div>
  )
}

export default Page