import React, { useRef } from "react";
import { useEffect, useState } from "react";
import axiosInstance from "../configure/axios";
import { IoEyeOutline } from "react-icons/io5";

import {
  FiCalendar,
  FiChevronDown,
  FiChevronRight,
  FiSearch,
  FiTrash2, 
} from "react-icons/fi";
import { FaRegEdit,FaRegEye } from "react-icons/fa";  


import { EllipsisVertical } from "lucide-react";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/loadeSlic";
import { Link, useNavigate } from "react-router-dom";
const Sellers = () => {
  const dispatch = useDispatch();
  const navigate=useNavigate()
  const [sellers, setSellers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const [page, setPage] = useState(1);
  const [totalpage, setTotalpage] = useState();
  const [totalusers, setTotalusers] = useState();
  const [dropdown,setDropdown]=useState(null)
  const dropdownRef = useRef(null);

  useEffect(() => {
    getsellers();
  }, [page, dateFilter, statusFilter]);

  // Close when clicking outside
  useEffect(() => {
    console.log("inside the close dropdown")  
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdown(null);
      }
    };
    
    
    if(dropdown)
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);   

  const getsellers = async () => {
    let url = `/admin/getsellers/${page}`;
    let params = [];
    if (searchTerm) {
      params.push(`search=${searchTerm}`);
    }
    if (statusFilter) {
      params.push(`status=${statusFilter}`);
    }
    if (dateFilter) {
      params.push(`date=${dateFilter}`);
    }

    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }
    console.log("url=", url);

    try {
      dispatch(showLoading());
      const response = await axiosInstance.get(url);
      console.log(response);

      setSellers(response.data.sellers);
    } catch (error) {
      console.log("error in getting sellers", error);
    } finally {
      dispatch(hideLoading());
    }
  };

  const handleSearch = () => {
    if (searchTerm === "") {
      return null;
    }
    getsellers();
  };

  //  this helper function for pagination control in forontend

  const getPageNumbers = () => {
    const pages = [];
    if (!totalpage) return pages;
    console.log("pages-1=", pages);
    if (totalpage <= 5) {
      for (let i = 1; i <= totalpage; i++) pages.push(i);
      console.log("pages=2=", pages);
    } else {
      if (page > 2) {
        pages.push(1);
        if (page > 3) pages.push("...");
        console.log("pages-3=", pages);
      }
      for (
        let i = Math.max(1, page - 1);
        i <= Math.min(totalpage, page + 1);
        i++
      ) {
        if ((i) => 1 && i < totalpage) pages.push(i);
        console.log("pages-4=", pages);
      }
      console.log("pages-5=", pages);
      if (page < totalpage - 1) {
        if (page < totalpage - 2) pages.push("...");
        pages.push(totalpage);
      }
      console.log("pages-4=", pages);
    }
    return pages;
  };

  

  const handledate = () => {
    if (dateFilter === "") {
      return null;
    }
    getsellers();
  };

  const handlestatus = () => {
    console.log("inside handle status=", statusFilter);

    getsellers();
  };

  const changestatus = async (st, id, oldst) => {
    console.log(st, id, oldst);
    if (st === oldst) {
      return null;
    }

    try {
      const response = await axiosInstance.put(
        `/admin/seller/changestatus/${id}/${st} `
      );
      console.log(response);
      getsellers();
      setDropdown(null)
    } catch (error) {
      console.log("error in seller change status =", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axiosInstance.delete(`/admin/seller/delete/${id}`);
      getsellers();
    } catch (error) {
      console.log("error in delte user", error);
    }
  };

 

  const gotopage = (newPage) => {
  console.log("new page =",newPage)
  if (newPage < 1 || newPage > totalpage) return;
  setPage(newPage);
};

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-sm">
      <div className="flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center justify-between" >
               <h1 className="text-xl font-semibold text-gray-800">Sellers</h1>
               <Link
               to='/Admin/seller_reg'
               >        
        <button title="create seller"
       
         className="bg-green-400 px-2 py-1 rounded font-medium text-white hover:bg-green-600">
           + Create</button></Link>
       

        </div>
       
        <div className="w-full my-3 flex flex-col sm:flex-row gap-3">
          {/* Status Filter */}
          <div className="relative w-full sm:w-40 min-w-[150px]">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                handlestatus();
              }}
              className="w-full h-10 pl-3 pr-8 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg 
                        appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
                        hover:border-gray-400 transition-colors duration-200"
            >
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="pending">Pending</option>
              <option value="SUSPEND">Suspended</option>
              <option value="INACTIVE">Inactive</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <FiChevronDown className="text-gray-500" size={18} />
            </div>
          </div>

          {/* Registration Date Filter */}
          <div className="relative w-full sm:w-48 min-w-[150px]">
            <select
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                handledate();
              }}
              className="w-full h-10 pl-3 pr-8 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg 
                        appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
                        hover:border-gray-400 transition-colors duration-200"
            >
              <option value="">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <FiCalendar className="text-gray-500" size={18} />
            </div>
          </div>

          {/* Search Bar */}
          <div className="w-full flex-1 min-w-[150px]">
            <div className="relative flex items-center">
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                // onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg 
                focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Search..."
              />
              <button
                onClick={handleSearch}
                className="absolute right-0 p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <FiSearch size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* table of sellers */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* head */}
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sl.no
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Business name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Business type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sellername
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sellers?.length > 0 ? (
              sellers.map((val, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {val?.businessName || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {val?.businessType || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {val?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        val?.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : val?.status === "SUSPEND"
                          ? "bg-yellow-100 text-yellow-800"
                          :val?.status === 'rejected'?"bg-red-500 text-white"
                          :"bg-orange-400 text-white"
                      }`}
                    >
                      {val.status || "N/A"}
                    </span>
                  </td>
                  <td  ref={dropdownRef} className="px-6 py-4 relative whitespace-nowrap text-right text-sm font-medium flex gap-2">
                     <button onClick={()=>navigate(`/Admin/Viewseller/${val._id}`)} title="Edit" className="p-1.5 text-gray-800 hover:bg-gray-50 rounded-md">
                        <FaRegEye size={18} />
                    </button>  
                    <button  
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-md"
                      title="Delete"
                      onClick={()=>handleDelete(val._id)}
                    >
                      <FiTrash2 size={18} />
                    </button>
                    <button onClick={()=>navigate(`/Admin/edit_seller_reg/${val._id}`)} title="Edit" className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md">
                        <FaRegEdit size={18} />
                    </button>
                     <button  
                     onClick={()=>{
                      if(dropdown === index){
                        setDropdown(null)
                      }else{
                        setDropdown(index)
                      }
                     }}
                     className="hover:bg-gray-200 rounded  m-1" type="button">
                        <EllipsisVertical />
                      </button>
                      {
                        dropdown === index &&(
                          <div className={`py-2 absolute ${index> sellers.length-2 ? ' left-15 bottom-3':' right-20 top-10' } bg-white border z-50 border-gray-200 shadow-md rounded-lg`}>
                             <ul 
                                 >
                        <li className="px-3 py-1 border-b-2 border-gray-200 text-center hover:bg-gray-300">
                          <button
                            onClick={() =>
                              changestatus("approved", val._id, val.status)
                            }
                          >
                            Approved
                          </button>
                        </li> 
                        <li className="px-3 text-center py-1 border-b-2 border-gray-200  hover:bg-gray-300"><button onClick={()=>changestatus('INACTIVE',val._id,val.status)}>INACTIVE</button></li>
                        <li className="px-3 text-center py-1 border-b-2 border-gray-200  hover:bg-gray-300">
                          <button
                            onClick={() =>
                              changestatus("suspend", val._id, val.status)
                            }
                          >
                            Suspend
                          </button>
                        </li>
                        <li className="px-3 text-center hover:bg-gray-300">
                          <button
                            onClick={() =>
                              changestatus("rejected", val._id, val.status)
                            }
                          >
                            Reject
                          </button>
                        </li>
                      </ul>

                          </div>
                        )

                      }
                    
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No sellers found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-gray-200">
        {/* Showing X to Y of Z items */}
        <div className="mb-4 sm:mb-0">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to{" "}
            <span className="font-medium">10</span> of{" "}
            <span className="font-medium">{totalusers}</span> users
          </p>
        </div>

        {/* Pagination controls */}
        {totalpage > 1 && (
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
              disabled={page === totalpage}
              className={`px-3 py-1 border rounded-md text-sm font-medium ${
                page === totalpage
                  ? "border-gray-400 text-gray-400 cursor-not-allowed"
                  : "border-gray-700 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FiChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sellers;
