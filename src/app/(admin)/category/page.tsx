
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import CategoryTable from '@/components/tables/categoryTable'
import axios from 'axios'
import React from 'react'
import { BaseUrl } from '@/constents/serverBaseUrl'
const page = async () => {
  const getCategory = async () => {
    const response = await axios.get(`${BaseUrl}/courses/get-category`, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'QWlpbGFicyBhcGkga2V5IGF0IGN5YmVyIHBhcmsgNHRoIGZsb29y'
      }
    })
    return response.data
  }
    
  const getCategoryData = await getCategory()

  return (
    <div>
      <PageBreadcrumb pageTitle="Category" />
      <div className="space-y-6">
 
        <CategoryTable getCategoryData={getCategoryData} />
      </div>
    </div>
  )
}

export default page