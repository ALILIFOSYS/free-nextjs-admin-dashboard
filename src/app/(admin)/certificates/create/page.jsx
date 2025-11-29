import React from 'react'
import CertificateConfigurator from '@/components/certificate/create'
import axios from 'axios'
import { BaseUrl } from '@/constents/serverBaseUrl'
import { API_KEY } from '@/constents/apiKey';
const page = async () => {

    const {data} = await axios.get(`${BaseUrl}/courses/get-courses`, {
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY
        }
    })
    return (
        <div>
            <CertificateConfigurator courses={data.data}/>
        </div>
    )
}

export default page