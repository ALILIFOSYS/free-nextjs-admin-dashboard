import React, { Suspense } from 'react'
import ResetPasswordForm from '@/components/auth/ResetPassword'
const page = () => {
 
  
  return (
    <div>
       <Suspense fallback={<div>Loading URL parameters...</div>}>
      <ResetPasswordForm/>
       </Suspense>
    </div>
  )
}

export default page