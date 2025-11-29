import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { BaseUrl } from '@/constents/serverBaseUrl';
import { API_KEY } from '@/constents/apiKey';
import CreateChapters from '@/components/chapters/CreateChapter'
import axios from 'axios';
const page = async ({ params, searchParams }) => {
    let course_id = await params
    course_id = course_id.create

    const getLastSerialNumber = async () => {
        const LastNumber = await axios.get(`${BaseUrl}/chapters/get-lastserialnumber-by-course-id/${course_id}`, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY
            }
        })
        if (LastNumber.data.status) {
            if (LastNumber.data.data.length > 0) {
                const ress = {
                    last_number: LastNumber.data.data[0].serial_number + 1,
                    course_title: LastNumber.data.data[0].title
                }

                return ress

            } else {
                // To get a query parameter like 'test-course' from '?test-course=value', 
                // you can use searchParams['test-course'].
                const { title } = await searchParams


                const ress = {
                    last_number: 1,
                    course_title: title
                }

                return ress
            }
        }
    }
    const data = await getLastSerialNumber()

    return (
        <div>
            <PageBreadcrumb pageTitle="Chapters" />
            <div className="space-y-6">
                <CreateChapters course_id={course_id} data={data} />
            </div>
        </div>
    )
}

export default page