import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import CoursesTable from '@/components/tables/CoursesTable'
import axios from 'axios';
import React from 'react'

const Page =async () => {
  const getCourseDetails = async () => {
      const data = await axios.get('http://localhost:3001/admin/api/courses/get-courses', {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'QWlpbGFicyBhcGkga2V5IGF0IGN5YmVyIHBhcmsgNHRoIGZsb29y'
        }
      });
  
      return data.data.data;
    }
    const CourseData =await getCourseDetails();
  
  return (
      <div>
      <PageBreadcrumb pageTitle="Courses" />
      <div className="space-y-6">
       <CoursesTable  data={CourseData} />
      </div>
    </div>
 
  )
}

export default Page