import React, { Suspense } from 'react'
import ShowInstructors from '@/components/instructors/ShowInstructors'
const page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading instructors...</div>}>
        <ShowInstructors />
      </Suspense>
    </div>
  )
}

export default page