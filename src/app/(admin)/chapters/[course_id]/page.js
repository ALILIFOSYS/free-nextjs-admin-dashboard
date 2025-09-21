import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { BaseUrl } from '@/constents/serverBaseUrl';
import axios from 'axios';
import ChapterTable from '@/components/tables/ChapterTable'
const course_id =async ({params}) => {
   const { course_id } =await params
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
  
  return (
      <div>
        <PageBreadcrumb pageTitle="Chapters" />
        <div className="space-y-6">
         <ChapterTable  data={chaptersData} course_id={course_id} />
        </div>
      </div>
  )
}

export default course_id