import React from 'react'

const EditCourseById = ({ params }) => {
  const { id } = params
  console.log(id, "iddddd");
  
  return (
    <div>[id]</div>
  )
}

export default EditCourseById