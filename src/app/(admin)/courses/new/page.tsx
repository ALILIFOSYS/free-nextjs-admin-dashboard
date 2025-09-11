import CreateCourse from '@/components/courses/CreateCourse'
import Tiptap from '@/components/Text-Editor/Editor'
import { BaseUrl } from '@/constents/serverBaseUrl'
import axios from 'axios'
const page = async () => {

  let categoryData = [];
  let instructorData = [];

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

[categoryData, instructorData] = await Promise.all([getCategory(), getInstructor()]);

console.log(categoryData, instructorData);

  return (
    <>
      <CreateCourse categoryData= {categoryData}  instructorData = {instructorData} />
    </>

  )
}

export default page