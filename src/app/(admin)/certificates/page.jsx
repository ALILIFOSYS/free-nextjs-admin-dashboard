import React from 'react'
import ShowCertificate from '@/components/certificate/ShowCertificate'
import axios from 'axios'
import { BaseUrl } from '@/constents/serverBaseUrl'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
const page = async () => {

    const {data} = await axios.get(`${BaseUrl}/courses/get-courses`, {
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'QWlpbGFicyBhcGkga2V5IGF0IGN5YmVyIHBhcmsgNHRoIGZsb29y'
        }
    })

    return (
        <div>
             <PageBreadcrumb pageTitle="Manage Certificate" />
            <ShowCertificate courses={data.data}/>
        </div>
    )
}

export default page