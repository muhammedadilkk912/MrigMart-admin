import { useEffect, useState } from "react";
import {
  FiSearch,
  FiTrash2,
  FiUserX,
  FiUserCheck,
  FiFilter,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { FaRegEdit,FaRegEye  } from "react-icons/fa";

import axiosInstance from "../configure/axios";
import {useDispatch}  from 'react-redux'
import {showLoading,hideLoading} from '../redux/loadeSlic'
import { Link, useNavigate } from "react-router-dom";

const UserListTable = () => {
  // Sample user data
  const [users, setUsers] = useState([]);
  const dispatch=useDispatch()
  const navigate=useNavigate()
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState();
  const [roleFilter, setRoleFilter] = useState("all");

  const [page, setPage] = useState(1);    
  const [userperpage] = useState(10); 
  const [totalpage, setTotalpage] = useState(); 
  const [totalusers, setTotalusers] = useState();

  useEffect(() => {
    getusers();
  }, [statusFilter,page]);
  console.log("totalpage=", totalpage);

  const getusers = async () => {
    console.log("inside the get user");
    try {
      dispatch(showLoading())
      let url = `/admin/getusers/${page}`;
      console.log("page=", page);
      console.log(`Fetching: /admin/getusers/${page}`);
      const params = [];
      if (searchTerm) params.push(`search=${searchTerm}`);
      if (statusFilter) params.push(`status=${statusFilter}`);
      console.log("params=", params);

      console.log("url=", url);
      if (params.length > 0) {
        url += `?${params.join("&")}`; // Append query parameters
      }

       const response = await axiosInstance.get(url);

      setUsers(response.data.users);
      setTotalpage(response.data.totalPages);
      setTotalusers(response.data.totalusers);
      // setPage(response.data.page);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
    finally{
      dispatch(hideLoading())
    }
  };
const gotopage = (newPage) => {
  console.log("new page =",newPage)
  if (newPage < 1 || newPage > totalpage) return;
  setPage(newPage);
};

    // try {
    //   //  const response=await axiosInstance.get(`/admin/newusers/${page}`)
    //   //  console.log("page=",response);

    // if(response){
    //    setUsers(response.data.users)
    //     setPage(page)
    //    setTotalpage(response.data.totalPages)
    //          console.log("total pages=",totalpage,"total users=",totalusers,"current page=",page);

    // }
    // } catch (error) {
    //   console.log(" error in gotpage ",error)

    // }
  

  console.log("users array=", users);

  // // Filter users
  // const filteredUsers = users?.filter(user => {

  //   const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
  //   const matchesRole = roleFilter === 'all' || user.role === roleFilter;
  //   return  users;
  // });
  // console.log("fitered array",filteredUsers[0]?.status[0])

  const handleserch = async () => {
    if (!searchTerm) {
      console.log("inside ");

      return null;
    }

    // try {
    getusers();
    //    const response = await axiosInstance.get('/admin/searchusers', {
    //   params: {
    //     search: searchTerm,
    //     status: statusFilter !== 'all' ? statusFilter : undefined,
    //     role: roleFilter !== 'all' ? roleFilter : undefined,
    //     page
    //   }
    // });
    //   console.log(response);
    //   setUsers(response.data.users)
    //   setTotalpage(response.data.totalpages)
    //   setPage(response.data.page)
    //   setTotalusers(response.data.totalusers)

    // } catch (error) {
    //   console.log(error);

    // }
  };

  // Action handlers
  const handleDelete = async (id) => {
    try {
      const response = await axiosInstance.delete(`/admin/user/delete/${id}`);
      getusers();
    } catch (error) {
      console.log("error in delte user", error);
    }
  };

  const handleSuspend = async (id, status) => {
    console.log(status);

    let currentstatus = status[0] === "Active" ? "Suspend" : "Active";
    console.log(currentstatus);

    try {
      const response = await axiosInstance.put(
        `/admin/user/change_status/${id}/${currentstatus}`
      );
      console.log(response);

      getusers();
    } catch (error) {
      console.log("error handle suspend", error);
    }

    // setUsers(users.map(user =>
    //   user.id === id ? { ...user, status: user.status === 'suspend' ? 'active' : 'suspended' } : user
    // ));
  };

  const handlestatus = async () => {
    console.log("status filter=", statusFilter);
    // if(!statusFilter || statusFilter===''){
    //   console.log("status filter is empty");

    //   return null;
    // }
    getusers();
    // try {
    //   getusers()
    //   // const response=await axiosInstance.get(`/admin/user/status/${statusFilter}`)
    //   // console.log("status response=",response);

    // } catch (error) {
    //   console.log("error in handle status",error);

    // }
  };
  const nextPages = [page + 1, page + 2].filter((p) => p <= totalpage);
  console.log("next=", nextPages);

  //  this helper function for pagination control in forontend

const getPageNumbers = () => {
  const pages = [];
  if (!totalpage) return pages;
  console.log("pages-1=",pages)
  if (totalpage <= 5) {
    for (let i = 1; i <= totalpage; i++) pages.push(i);
    console.log("pages=2=",pages);
    
  } else {
    if (page > 2) {
      pages.push(1);
      if (page > 3) pages.push("...");
      console.log("pages-3=",pages);
      
    }
    for (let i = Math.max(1, page - 1); i <= Math.min(totalpage, page + 1); i++) {
      if (i => 1 && i < totalpage) pages.push(i);
      console.log("pages-4=",pages);
      
    }
     console.log("pages-5=",pages);
    if (page < totalpage - 1) {
      if (page < totalpage - 2) pages.push("...");
      pages.push(totalpage);
    }
     console.log("pages-4=",pages);
  }
  return pages;
};

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-sm">
      <div className="flex flex-col items-center my-5  gap-4">
        <div className="w-full flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">User Management</h2>

          <Link
          to='/Admin/adduser'>
          <button className="bg-green-300  text-white rounded font-bold sm:px-2 sm:py-1 hover:bg-green-500" type="button">+ Add User</button>
          </Link>

        </div>
        <div className=" flex flex-col sm:flex-row items-center gap-5 w-full">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-10 py-2 w-full sm:w-[400px] border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleserch();
                }
              }}
            />
            <div
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer hover:bg-gray-200 rounded-r-lg"
              onClick={handleserch}
            >
              <FiSearch className="text-gray-600" size={18} />
            </div>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiFilter className="text-gray-400" />
            </div>
            <select
              className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                handlestatus(); // Call function only when selection changes
              }}
            >
              <option value="">All status</option>
              <option value="Active">Active</option>
              <option value="Suspend">Suspended</option>

              <option value="inactive">Inactive</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
              <FiChevronDown className="text-gray-400" />
            </div>
          </div>

        </div>
       
        

        {/* <div className="flex flex-col sm:flex-row gap-3"> */}
          {/* Search Input */}
          {/* <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-10 py-2 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleserch();
                }
              }}
            />
            <div
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer hover:bg-gray-200 rounded-r-lg"
              onClick={handleserch}
            >
              <FiSearch className="text-gray-600" size={18} />
            </div>
          </div> */}

          {/* Status Filter */}
          {/* <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiFilter className="text-gray-400" />
            </div>
            <select
              className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                handlestatus(); // Call function only when selection changes
              }}
            >
              <option value="">All status</option>
              <option value="Active">Active</option>
              <option value="Suspend">Suspended</option>

              {/* <option value="inactive">Inactive</option> */}
            {/* </select>
            <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
              <FiChevronDown className="text-gray-400" />
            </div>
          </div> */}
          

          
        {/* </div> */}
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th> */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users?.length > 0 ? (
              users?.map((user) => (
                <tr key={user?.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {user?.username || "kjcskd"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {user?.email || "khsiahia"}
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {user?.role?.slice(0, 2).join() || "kfkjjd"}
                  </td> */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user?.status[0] === "Active"
                          ? "bg-green-100 text-green-800"
                          : user?.status[0] === "Suspend"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user?.status}
                      {/* {user?.status?.charAt(0)?.toUpperCase() + user?.status?.slice(1)} */}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleSuspend(user._id, user.status)}
                        className={`p-1.5 rounded-md ${
                          user.status === "Suspend"
                            ? "text-green-600 hover:bg-green-50"
                            : "text-yellow-600 hover:bg-yellow-50"
                        }`}
                        title={
                          user.status === "Suspend" ? "Activate" : "Suspend"
                        }
                      >
                        {user.status === "Suspend" ? (
                          <FiUserCheck size={18} />
                        ) : (
                          <FiUserX size={18} />
                        )}
                      </button>
                      <button title="View" 
                      onClick={()=>navigate(`/Admin/viewuser/${user._id}`)} 
                      className="p-1.5 text-gray-700 hover:bg-gray-50">
                        <FaRegEye size={18}/>

                      </button>
                      
                      <button title="Edit" type="button" onClick={()=>navigate(`/Admin/edituser/${user._id}`)} className="p-1.5 text-blue-600 hover:bg-blue-50">  <FaRegEdit size={18}/></button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-md"
                        title="Delete"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr key={1}>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No users found matching your criteria
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
          <span key={idx} className="px-2 text-gray-500">...</span>
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

export default UserListTable;
