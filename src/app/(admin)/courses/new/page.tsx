import CreateCourse from '@/components/courses/CreateCourse'
import { BaseUrl } from '@/constents/serverBaseUrl'
import { API_KEY } from '@/constents/apiKey';
import axios from 'axios'
const page = async () => {

  let categoryData = [];
  let instructorData = [];

  const getInstructor = async () => {
    const res = await axios.get(`${BaseUrl}/instructors/get-instructors`, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      }
    });
    return res.data.data
  }
  const getCategory = async () => {
    const res = await axios.get(`${BaseUrl}/courses/get-category`, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      }
    });
    return res.data
  }   

[categoryData, instructorData] = await Promise.all([getCategory(), getInstructor()]);
  return (
    <>
      <CreateCourse categoryData= {categoryData}  instructorData = {instructorData} />
    </>

  )
}

export default page