import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ChapterCoursesTable from '@/components/tables/ChapterCourse';
import { BaseUrl } from '@/constents/serverBaseUrl';
import axios from 'axios';
import React from 'react'

const page =async () => {
const getCourseDetails = async () => {
      const data = await axios.get(`${BaseUrl}/courses/get-courses`, {
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
      <PageBreadcrumb pageTitle="Select course" />
      <div className="space-y-6">
       <ChapterCoursesTable  data={CourseData} />
      </div>
    </div>
 
  )
}

export default page