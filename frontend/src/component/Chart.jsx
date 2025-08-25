import React, { useEffect, useState } from 'react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import axiosInstance from '../configure/axios';

const Chart = () => {
  const data = [
    { name: 'Jan', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Feb', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Mar', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Apr', uv: 2780, pv: 3908, amt: 2000 },
    { name: 'May', uv: 1890, pv: 4800, amt: 2181 },
    { name: 'Jun', uv: 2390, pv: 3800, amt: 2500 },
    { name: 'Jul', uv: 3490, pv: 4300, amt: 2100 },
    { name: 'Apr', uv: 2780, pv: 3908, amt: 2000 },
    { name: 'May', uv: 1890, pv: 4800, amt: 2181 },
    { name: 'Jun', uv: 2390, pv: 3800, amt: 2500 },
    { name: 'Jul', uv: 3490, pv: 4300, amt: 2100 },
  ];
  const MONTH=['Jan','Feb','Mar','Apr','May',"Jun",'Jul','Aug','Sep','Oct','Nov','Dec']
  const [chartData,setChartData]=useState()
  const currentMonth = new Date().getMonth();
  const [filter,setFilter]=useState('6months')

  useEffect(()=>{
    getchartDetails()
  },[filter])
   console.log(`/admin/dashboard/getchartdata/${filter}`)
  const getchartDetails=async()=>{
    try {
      const response=await axiosInstance.get(`/admin/dashboard/getchartdata/${filter}`)
      let data=response?.data?.report
      let report={}
      data.forEach((val)=>{
        let ind=MONTH[val._id.month-1]
        
        report[ind]=val.totalRevenue
      })
      console.log("report=",report)
      console.log(MONTH[currentMonth])
      let months
          if(filter==='6months'){
                 months = MONTH.slice(currentMonth - 5, currentMonth+1 );
          }else{
              months = MONTH.slice(0, currentMonth+1 );
          }
          
           console.log(months)
    let formatted=months.map((val,index)=>(
      {
          month:val,
          revenue:report[val] || 0
      }
     
    ))
    setChartData(formatted)
    console.log("updated data=",formatted)
      
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="w-full flex  shadow-md bg-white rounded-md flex-col">
      
     
        <div className="flex justify-between items-center">
          <h1 className="font-medium text-xl mb-4 m-5">Revenue Report</h1>

    <select
    value={filter}
    onChange={(e) => setFilter(e.target.value)}
    className="border text-sm h-8 outline-blue-500 mr-3 border-gray-300 rounded "
   >
    {/* <option value=""></option> */}
    <option value="6months">Last 6 Months</option>
    <option value="year">This Year</option>
  </select>
</div>

    

      {/* Fixed height container */}
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis  dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Chart;
