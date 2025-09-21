import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { BaseUrl } from '@/constents/serverBaseUrl';
import CreateChapters from '@/components/chapters/CreateChapter'
import axios from 'axios';
const page = async ({ params }) => {
    let course_id = await params
    course_id = course_id.create



    const getLastSerialNumber = async () => {
        const LastNumber = await axios.get(`${BaseUrl}/chapters/get-lastserialnumber-by-course-id/${course_id}`, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': 'QWlpbGFicyBhcGkga2V5IGF0IGN5YmVyIHBhcmsgNHRoIGZsb29y'
            }
        })
        const ress = {
            last_number: LastNumber.data[0].serial_number + 1,
            course_title: LastNumber.data[0].title
        }

        return ress
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