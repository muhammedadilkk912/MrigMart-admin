import React, { useState } from 'react';
import { Search, ChevronDown, Calendar, Filter, Download, MoreVertical } from 'lucide-react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useEffect } from 'react';
import axiosInstace from '../configure/axios'
import{useDispatch} from 'react-redux'
import {showLoading,hideLoading} from '../redux/loadeSlic'
import {toast} from 'react-hot-toast'
import { useDebounce } from 'use-debounce';

const Order = () => {
  const dispatch=useDispatch()
  

  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    dateRange: 'all-time',
  });
  const [orders,setOrders]=useState([])
  const [totalOrder,setTotalOrder]=useState()
  const [page,setPage]=useState(1)
  const [totalPage,setTotalPage]=useState()
  const [dropdown,setDropdown]=useState(null)
  console.log(dropdown)
  const [searchDebounce]=useDebounce(filters.search,500)


  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'delivered', label: 'devlivered' },
    { value: 'pending', label: 'pending' },
    { value: 'shipped', label: 'shipped' },
   
   
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const dateOptions = [
    { value: 'all-time', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'this-month', label: 'This Month' },
    // { value: 'custom', label: 'Custom Range' }
  ];

  // const paymentOptions = [
  //   { value: 'all', label: 'All Methods' },
  //   { value: 'credit-card', label: 'Credit Card' },
  //   { value: 'paypal', label: 'PayPal' },
  //   { value: 'bank-transfer', label: 'Bank Transfer' },
  //   { value: 'cash', label: 'Cash on Delivery' }
  // ];
  useEffect(()=>{
    getorders()
  },[filters.status,searchDebounce,filters.dateRange,page])

  const getorders=async()=>{
     
      let url=`/admin/getorders/${page}`
      let params=[]
     if (filters.search) {
      params.push(`search=${filters.search}`);
    }
     if (filters.dateRange) {
      params.push(`date=${filters.dateRange}`);
    }
    if(filters.status){
      console.log("staus",filters.status)
      params.push(`status=${filters.status}`);
    }
    console.log(params)
    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }
    console.log(url)
      try {
        dispatch(showLoading())
      const response=await axiosInstace.get(url)
      console.log(response)
       setOrders(response.data.orders)
       setTotalPage(response?.data?.totalPages)
    } catch (error) {
      console.log("error in get orders=",error)
    }finally{
        dispatch(hideLoading())
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // const filteredOrders = orders.filter(order => {
  //   return (
  //     (filters.search === '' || 
  //      order.id.toLowerCase().includes(filters.search.toLowerCase()) ||
  //      order.customer.toLowerCase().includes(filters.search.toLowerCase()) ||
  //      order.product.toLowerCase().includes(filters.search.toLowerCase())) &&
  //     (filters.status === 'all' || order.status === filters.status) &&
  //     (filters.payment === 'all' || order.payment.toLowerCase().replace(' ', '-') === filters.payment)
  //   );
  // });
  function getDateOnly(isoString) {
  const date = new Date(isoString);
  return date.toISOString().split("T")[0]; // Returns "2025-07-27"
}
  const getPageNumbers = () => {
    const pages = [];
    if (!totalPage) return pages;
    console.log("pages-1=", pages);
    if (totalPage <= 5) {
      for (let i = 1; i <= totalPage; i++) pages.push(i);
      console.log("pages=2=", pages);
    } else {
      if (page > 2) {
        pages.push(1);
        if (page > 3) pages.push("...");
        console.log("pages-3=", pages);
      }
      for (
        let i = Math.max(1, page - 1);
        i <= Math.min(totalPage, page + 1);
        i++
      ) {
        if ((i) => 1 && i < totalPage) pages.push(i);
        console.log("pages-4=", pages);
      }
      console.log("pages-5=", pages);
      if (page < totalPage - 1) {
        if (page < totalPage - 2) pages.push("...");
        pages.push(totalPage);
      }
      console.log("pages-4=", pages);
    }
    console.log("pagination array=",pages)
    return pages;
  };
  const gotopage = (newPage) => {
    console.log("new page =", newPage);
    
    if (newPage < 1 || newPage > totalPage) return;
    setPage(newPage);
  };

  const changestatusr=async(orderId,productId,status,oldst)=>{
    console.log(oldst)
    // console.log(orderId,productId,status,oldstatus)
    if(oldst === status){
      console.log("inside if")
      return null
    }
    


    try {
      dispatch(showLoading())
      const response =await axiosInstace.put(`/admin/changeorderstatus`,{orderId,productId,status})
      console.log(response)
      toast.success(response?.data?.message)
      getorders()
    } catch (error) {
      console.log(error)
    }finally{
      dispatch(hideLoading())
    }
  }


  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-sm">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-xl font-semibold text-gray-800">Order Management</h1>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm">
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {/* Search */}
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              name="search"
              placeholder="Search orders..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              value={filters.search}
              onChange={handleFilterChange}
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              name="status"
              className="w-full pl-3 pr-8 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
              value={filters.status}
              onChange={handleFilterChange}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Date Filter */}
          <div className="relative">
            <select
              name="dateRange"
              className="w-full pl-3 pr-8 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
              value={filters.dateRange}
              onChange={handleFilterChange}
            >
              {dateOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Payment Filter */}
          {/* <div className="relative">
            <select
              name="payment"
              className="w-full pl-3 pr-8 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
              value={filters.payment}
              onChange={handleFilterChange}
            >
              {paymentOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div> */}
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {
                orders.length > 0 ? (
                  (
                    orders?.flatMap((order)=>
                    order?.items.flatMap((item)=>
                    item.products.map((product)=>(
                      <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{order?._id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item?.sellerId?.businessName || 'customes'}</td>
                    {/* {console.log(product)} */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product?.product?.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product?.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product?.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"> { getDateOnly(order?.createdAt)  || 'name'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        product.status == 'delivered' ? 'bg-green-100 text-green-800' :
                        product.status === 'pending' ? 'bg-yellow-600 text-yellow-800' :
                        product.status === 'shipped' ? 'bg-blue-100 text-blue-800' :

                        'bg-red-100 text-red-800'
                      }`}>
                        {console.log(product.status)}
                        {product.status || 'status'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${product.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
  <div className="relative">
    <button onClick={() => setDropdown(dropdown === product._id ? null :product._id )} className="text-gray-400 rounded-md  hover:bg-gray-200">
      <MoreVertical  size={20} />
    </button>

    {dropdown === product._id && (
      <div className="absolute right-0 z-20 w-38 mt-2 bg-white border border-gray-200 rounded-md shadow-lg">
        <div className="py-2">
         
          <button onClick={()=>{
            changestatusr(order._id,product?.product?._id,'cancel',product?.status)
             setDropdown(null)
          }} className="block px-2 py-1 border-b border-gray-200 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">Cancel</button>
          <button 
          onClick={()=>{
            changestatusr(order._id,product?.product?._id,'delivered',product?.status)
            setDropdown(null)
          }} className="block px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">Delivered</button>
          <button 
          onClick={()=>{
            changestatusr(order._id,product?.product?._id,'shipped',product?.status)
            setDropdown(null)
          }} className="block px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">shipped</button>
        </div>
      </div>
    )}
  </div>
</td>

                  </tr>

                    ))))
                  )
                    
                ):(
                    <tr>
                  <td colSpan="9" className="px-6 py-4 text-center text-sm text-gray-500">
                    No orders found matching your criteria
                  </td>
                </tr>
                )
              }
              
                  
              
               
             
            </tbody>
          </table>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center pt-4 border-t border-gray-200">
                {/* Showing X to Y of Z items
                <div className="mb-4 sm:mb-0">
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to{" "}
                    <span className="font-medium">10</span> of{" "}
                    <span className="font-medium">{totalproducts}</span> users
                  </p>
                </div> */}
        
                {/* Pagination controls */}
                {totalPage > 1 && (
                  <div className="flex items-center space-x-1">
                    {/* Previous button (disabled) */}
                    <button
                      onClick={() => gotopage(page - 1)}
                      disabled={page === 1}
                      className={`px-3 py-1 border rounded-md text-sm font-medium ${
                        page === 1
                          ? "border-gray-400 text-gray-400 cursor-not-allowed"
                          : "border-gray-700 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <FiChevronLeft className="h-5 w-5" />
                    </button>
                    {/* <button className="px-3 py-1 border rounded-md text-sm font-medium bg-blue-50 border-red-500 text-blue-600">
                                  {page}
                                </button> */}
        
                    {getPageNumbers().map((p, idx) =>
                      p === "..." ? (
                        <span key={idx} className="px-2 text-gray-500">
                          ...
                        </span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => gotopage(p)}
                          className={`px-3 py-1 border rounded-md text-sm font-medium ${
                            page === p
                              ? "bg-blue-50 border-blue-500 text-blue-600"
                              : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {p}
                        </button>
                      )
                    )}
        
                    {/* Next button */}
                    <button
                      onClick={() => gotopage(page + 1)}
                      disabled={page === totalPage}
                      className={`px-3 py-1 border rounded-md text-sm font-medium ${
totalPage                          ? "border-gray-400 text-gray-400 cursor-not-allowed"
                          : "border-gray-700 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <FiChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
      </div>
    </div>
  );
};

export default Order;