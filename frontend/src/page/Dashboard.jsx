import { useEffect } from 'react';
import axiosInstance from '../configure/axios'
import {useDispatch} from 'react-redux'
import {showLoading,hideLoading} from '../redux/loadeSlic'
import Dashcard from '../component/Dashcard';
import { useState } from 'react';
  import { IoEllipsisVertical } from "react-icons/io5";

import Chart from '../component/Chart';

const Dashboard = () => {
  const [order,setOrder]=useState(null)
  const [seller,setSeller]=useState(null)
  const [user,setUser]=useState(null)
  const [revenue,setRevenue]=useState(null)
  const [top_products,setTop_products]=useState(null)
  const [orderData,setOrderData]=useState([])
  const dispatch=useDispatch()
  const [dropdown,setDropdown]=useState(null)



  useEffect(()=>{
   getcards()
  },[])
  const getcards=async()=>{
    try {
      dispatch(showLoading())
      const response=await axiosInstance.get('/admin/dashboard/getcards')
      console.log(response)
      setOrder(response?.data?.order)
      setUser(response?.data?.customer)
      setSeller(response?.data?.seller)
      setRevenue(response?.data?.revenue)
      topProducts()
      orders()
    } catch (error) {
      console.log(error)
    }finally{
      dispatch(hideLoading())
    }
  }
    const topProducts=async()=>{
      try {
        const response=await axiosInstance.get('/admin/dashboard/top_products')
        console.log("top products=",response)
        setTop_products(response?.data?.products)
      } catch (error) {
        console.log("error in top products",error)
      }
    }

    const orders=async()=>{
      try {
        const response=await axiosInstance.get('/admin/dashboard/getorders')
        console.log("order response",response)
        setOrderData(response?.data?.orders)
      } catch (error) {
        console.log(error)
      }
    }
     function getDateOnly(isoString) {
  const date = new Date(isoString);
  // console.log(date)
  // console.log(date)
  return date?.toISOString().split("T")[0]; // Returns "2025-07-27"
  // return date
}

const changestatus=async(orderId,productId,newStatus,oldStatus)=>{
  if(oldStatus === newStatus){
    return null
  }
  let url=`/admin/changeorderstatus`
  // url+=`?orderId=${orderId}&productId=${productId}&status=${newStatus}`
  try {
    const response=await axiosInstance.put(url,{orderId,productId,status:newStatus})
    console.log(response)
    setDropdown(null)
    orders()

  } catch (error) {
    console.log("error in change order status",error)
  }
}


  return (
    <div className="sm:p-6">
      <h1 className="text-2xl font-bold mb-6">Welcome to Dashboard</h1>
      <Dashcard
      revenue={revenue}
      order={order}
      seller={seller}
      user={user}


      />
      <div className='flex flex-col sm:flex-row  gap-2'>
        <div className='w-full sm:w-2/3 '>
        <Chart/>

        </div>
        <div className=' w-full  sm:w-1/3 flex flex-col gap-2 bg-white shadow-md'>
        <h1 className='m-3 text-xl rounded-md font-medium'>Top products </h1>
        {
          top_products?.length > 0 ?
          top_products?.map ((product)=>(

            <div className='ms-3 flex gap-3'>
              {/* {console.log("inside the top p products")} */}
              <img src={product.images[0] || '/user.png'} className='w-10 h-10 object-cover rounded-full ' alt="" srcset="" />
              <p className='text-gray-400'>{product.name || 'prodict name'}</p> 

            </div>
          ))
          :(
            <div className='flex  bg-white  justify-center items-center'>
              <p className='font-medium text-gray-400'>not found</p>

            </div>
         )
        }

        </div>


      </div>
      <div className='w-full my-5 bg-white rounded-md   flex flex-col gap-3'>
        <h1 className='font-medium px-3 text-xl'>Orders</h1>
        <div className=" dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-gray-200 dark:divide-gray-700">
         <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
             product Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
             category
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Customer
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Delivery date
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Amount
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
         <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        {

        orderData?.length > 0 ? orderData?.map((order,index)=>(

       
           <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
           
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
              {order.product.name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
              {order.category}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
              {order.customerId}
            </td>
            
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
              {order?.deliveryDate ?getDateOnly(order?.deliveryDate) :'not shipped'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                ${order.status === 'delivered' ?'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200':
                  order.status === 'shipped'?'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200':
                  order.status === 'pending' ? 'bg-yellow-100 text-orange-800 dark:bg-orange-900 dark:text-orage-200':
                  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                } `}>
                {order.status}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
              {order.price}
            </td>
            <td className="px-6  relative py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
              <IoEllipsisVertical
              onClick={()=>{
                dropdown === index ? setDropdown(null)
                :setDropdown(index)
              }}
               size={18}/>
              {
                dropdown===index &&(
                   <div className='absolute right-5 w-28 border z-50 rounded-md border-gray-300 bg-white'>
                <ul>
                  <li onClick={()=>changestatus(order._id,order.product._id,'shipped',order.status)} className='px-2 py-2 border-b hover:bg-gray-100 hover:font-medium border-gray-200'>Shipped</li>
                  <li onClick={()=>changestatus(order._id,order.product._id,'delivered',order.status)}  className='px-2 py-2 border-b hover:bg-gray-100 hover:font-medium border-gray-200'>Delivered</li>
                  <li onClick={()=>changestatus(order._id,order.product._id,'cancelled',order.status)}  className='px-2 py-2 border-b hover:bg-gray-100 hover:font-medium border-gray-200'>cancelled</li>
                </ul>

              </div>

                )
              }

             
            </td>
          </tr>

         )):(
         
          <tr key={1}  className=' '>
            <td colSpan="5" className=' py-10 text-center font-medium text-gray-500'>no orders found</td>
          </tr>
        )


}
       
       
          {/* Sample rows - replace with your data */}
         
          
          
        </tbody>
      </table>
    </div>
  </div>

      </div>
      
      </div>
  );
};

export default Dashboard;