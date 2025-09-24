import React from 'react'
import EditCourse from '@/components/courses/EditCourses'
import axios from 'axios';
import { BaseUrl } from '@/constents/serverBaseUrl';
const EditCourseById = async ({ params }) => {
  const { id } =await params

let courseData=[]
let instructorData=[]
let categoryData=[]

  const getCourse = async () => {

      const response = await axios.get(`${BaseUrl}/courses/get-course/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'QWlpbGFicyBhcGkga2V5IGF0IGN5YmVyIHBhcmsgNHRoIGZsb29y'
        }
      })
        return response.data;
  };

  const getInstructor = async () => {
    const res = await axios.get(`${BaseUrl}/instructors/get-instructors`, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'QWlpbGFicyBhcGkga2V5IGF0IGN5YmVyIHBhcmsgNHRoIGZsb29y'
      }
    });
    return res.data
  }
  const getCategory = async () => {
    const res = await axios.get(`${BaseUrl}/courses/get-category`, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'QWlpbGFicyBhcGkga2V5IGF0IGN5YmVyIHBhcmsgNHRoIGZsb29y'
      }
    });
    return res.data
  }

  [categoryData, instructorData, courseData] = await Promise.all([getCategory(), getInstructor(), getCourse()]);

  return (
    <div>
     
      <EditCourse courseData={courseData} categoryData={categoryData} instructorData={instructorData.data}/>

    </div>
  )
}

export default EditCourseById