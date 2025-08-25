import { Plus, Search, Trash2, Pencil } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import axiosInstance from '../configure/axios'
import {useDispatch} from 'react-redux'
import {showLoading,hideLoading} from '../redux/loadeSlic'
import { useNavigate } from 'react-router-dom'
import {toast } from 'react-toastify'
import {useDebounce}   from 'use-debounce'

const Category = () => {
    const navigate=useNavigate()
  const dispatch=useDispatch()

  const [categories, setCategories] = useState([])
  
  const [newCategory, setNewCategory] = useState({ name: '' })

  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState('asc')
  

   const [page, setPage] = useState(1);
    const [totalpage, setTotalpage] = useState();
    const [totalusers, setTotalusers] = useState();
    const [debounceSearch]=useDebounce(searchTerm,500)
  
  useEffect(()=>{
    getcategories()
  },[sortOrder,page,debounceSearch])

  const getcategories=async()=>{
    let url=`/admin/categories/${page}`
    let params=[]
    if(searchTerm){
        params.push(`search=${searchTerm}`)
    }
    if(sortOrder){
        params.push(`sort=${sortOrder}`)
    }
    if(params.length>0){
        url += `?${params.join("&")}`;
    }
    try {
        dispatch(showLoading())
        const response=await axiosInstance.get(url)
        console.log(response)
        setCategories(response.data.category)
    } catch (error) {
        console.log("error in getting categories=",error)
        
    }finally{
        dispatch(hideLoading())
    }
  }

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

   const gotopage = (newPage) => {
  console.log("new page =",newPage)
  if (newPage < 1 || newPage > totalpage) return;
  setPage(newPage);
};

const handlesearch=()=>{
     if (searchTerm === "") {
      return null;
    }
    getcategories();

}

const handleDelete=async(id)=>{

  try {
    dispatch(showLoading())
    const respone=await axiosInstance.delete(`/admin/deletecategory/${id}`)
  console.log(respone)
  toast.success("category deleted successfully")
  getcategories()
  

    
  } catch (error) {
    console.log("error in delete category ",error)
    
  }finally{
    dispatch(hideLoading())
  }

  
}

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-sm">
      <div className='flex flex-col gap-6'>
        {/* Header */}
        <div className='flex justify-between items-center'>
          <h1 className='text-xl font-medium text-gray-800'>Categories</h1>
          <button 
            onClick={() => navigate('/Admin/addCategory')}
            className="px-3 py-2 gap-2 rounded text-sm font-medium flex items-center justify-center text-white bg-green-500 hover:bg-green-600 transition-colors"
          >
            Add category
            <Plus size={16} />
          </button>
        </div>

        {/* Search and filter */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="border border-gray-200 flex items-center rounded-lg w-full max-w-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
            <input 
              type="text" 
              placeholder="Search categories..." 
              className="h-full pl-4 py-2 outline-none flex-grow"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="h-10 px-4 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center">
              <Search className="text-gray-500 w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <select 
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="asc">A → Z</option>
              <option value="desc">Z → A</option>
            </select>
          </div>
        </div>

       

        {/* Table */}
        <div className="overflow-hidden overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category Name</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.length > 0 ? (
                categories.map((val, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {val.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      <div className="flex justify-end gap-3">
                        <button onClick={()=>navigate(`/Admin/editcategory/${val._id}`)} className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-50">
                          <Pencil size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(val._id)}
                          className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                    No categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Category