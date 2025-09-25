import React from "react";

import{ DashboardData } from "@/components/dashboard/DashboardData";
import axios from "axios";
import ComponentCard from "@/components/common/ComponentCard";
import { ToppCoursesTable } from "@/components/tables/ToppCoursesTable";
import { TopStudentsTable } from "@/components/tables/TopStudentsTable";
import { TopInstructorsTable } from "@/components/tables/TopInstructorsTable";
import { BaseUrl } from "@/constents/serverBaseUrl";
// export const metadata: Metadata = {
//   icons:{
//     icon: '/icon.png',
//   },
//   title: "AI Innovation Lab - Leading AI Development Center in the Region",
//   description: "AI Innovation Lab is the region's biggest AI development center. We create cutting-edge AI solutions for digital health, business automation, and chatbots. Join our industry internship program.",
// };

    
export default async function Ecommerce() {
  const getDashboardData = async () => {
      const data = await axios.get(`${BaseUrl}/dashboard/get-all-dashboard-data`, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'QWlpbGFicyBhcGkga2V5IGF0IGN5YmVyIHBhcmsgNHRoIGZsb29y'
        }
      });
  
      return data.data;
    }
    const dashboardData =await getDashboardData();
   
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 ">
       

        <DashboardData  dashboardData = {dashboardData} />
       
      </div>
      <div className="col-span-12 ">
    
      <div className="">
        <ComponentCard title="Top Selling Course">
          <ToppCoursesTable  courses={dashboardData.topCourses} />
        </ComponentCard>
      </div>

    </div>
   <div className="col-span-6 ">
      <div className="">
        <ComponentCard title="Top Students">
          <TopStudentsTable students={dashboardData.topStudents} />
        </ComponentCard>
      </div>
    </div>
      <div className="col-span-6 ">
      <div className="">
        <ComponentCard title="Top Students">
          <TopInstructorsTable instructors={dashboardData.topInstructors} />
        </ComponentCard>
      </div>
    </div>
     </div>
  );
}



