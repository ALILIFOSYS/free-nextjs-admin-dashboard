import React, { Suspense } from 'react'
import ShowStudents from '@/components/students/ShowStudents'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
const page = () => {
  return (
    <div>
       <PageBreadcrumb pageTitle="Students" />
       <Suspense fallback={<div>Loading instructors...</div>}>
      <ShowStudents/>
       </Suspense>
    </div>
  )
}

export default page