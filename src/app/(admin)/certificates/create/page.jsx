import React from 'react'
import CertificateConfigurator from '@/components/certificate/create'
import axios from 'axios'
import { BaseUrl } from '@/constents/serverBaseUrl'
const page = async () => {

    const {data} = await axios.get(`${BaseUrl}/courses/get-courses`, {
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'QWlpbGFicyBhcGkga2V5IGF0IGN5YmVyIHBhcmsgNHRoIGZsb29y'
        }
    })
    console.log(data, "get Coures");

    return (
        <div>
            <CertificateConfigurator courses={data.data}/>
        </div>
    )
}

export default page