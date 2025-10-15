import React, { Suspense } from 'react'
import ShowEnrollments from '@/components/Enorllments/ShowEnrollment'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'

const page = () => {
  return (
    <div>
       <PageBreadcrumb pageTitle="Enrollments" />
        <Suspense fallback={<div>Loading instructors...</div>}>
      <ShowEnrollments/>
        </Suspense>
    </div>
  )
}

export default page    