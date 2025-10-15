import React, { Suspense } from 'react'
import ShowInstructors from '@/components/instructors/ShowInstructors'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
const page = () => {
  return (
    <div>
       <PageBreadcrumb pageTitle="Instructors" />
      <Suspense fallback={<div>Loading instructors...</div>}>
        <ShowInstructors />
      </Suspense>
    </div>
  )
}

export default page