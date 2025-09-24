import React, { Suspense } from 'react'
import ShowStudents from '@/components/students/ShowStudents'
const page = () => {
  return (
    <div>
       <Suspense fallback={<div>Loading instructors...</div>}>
      <ShowStudents/>
       </Suspense>
    </div>
  )
}

export default page