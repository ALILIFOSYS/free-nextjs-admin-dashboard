import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { BaseUrl } from '@/constents/serverBaseUrl';
import axios from 'axios';
import React from 'react'
import ChapterTable from '@/components/tables/ChapterTable'
const course_id =async ({params}) => {
   const { course_id } =await params
   console.log(course_id);
 const getChapter = async () => {
    const res = await axios.get(`${BaseUrl}/chapters/get-chapters-by-course_id/${course_id}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'QWlpbGFicyBhcGkga2V5IGF0IGN5YmVyIHBhcmsgNHRoIGZsb29y'
      }
    });
    return res.data
  }
  const chaptersData =await getChapter() 
  console.log(chaptersData,"sdfs");
  
  return (
      <div>
        <PageBreadcrumb pageTitle="Chapters" />
        <div className="space-y-6">
         <ChapterTable  data={chaptersData} />
        </div>
      </div>
  )
}

export default course_id