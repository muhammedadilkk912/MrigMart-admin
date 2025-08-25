import { FaUser, FaSearch, FaFilter, FaTrash, FaEye, FaChevronDown, FaStar } from 'react-icons/fa';
import axiosInstance from '../configure/axios';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {showLoading,hideLoading} from '../redux/loadeSlic'
import {toast} from 'react-hot-toast'
import { useDebounce } from 'use-debounce';




const AdminReviewsPage = () => {
  const dispatch=useDispatch()
  const [reviews, setReviews] = useState([]);
  const [productSearch, setProductSearch] = useState('');   
  const [ratingFilter, setRatingFilter] = useState('all');
  const [selectedReview, setSelectedReview] = useState(null);
  const [page,setPage]=useState(1)
  const [totalPage,setTotalPage]=useState()

   const [searchDebounce]=useDebounce(productSearch,500)



  useEffect(()=>{
    getReviews()        
  },[ratingFilter,page,searchDebounce])
                 
  const getReviews = async () => {
    let url = `/admin/getreviews/${page}`;
    let params=[]
     if(ratingFilter){
      params.push(`rating=${ratingFilter}`)
     }
       if (productSearch) {
    //     console.log("search debounce=",searchDebounce)
      params.push(`search=${productSearch}`);
    }
     if (params.length > 0) {
      url += `?${params.join("&")}`;
    }
    try {
      dispatch(showLoading())
      const response = await axiosInstance.get(url);
      console.log(response)
       setReviews(response.data.reviews);
       setTotalPage(response.data.totalPages)
    } catch (error) {
      console.log(error);
    }finally{  
      dispatch(hideLoading())
    }
  };

  

  const handleStatusChange = async(reviewId, newStatus) => {
    try {
      dispatch(showLoading())
      const response=await axiosInstance.put(`/admin/changereviewstatus/${reviewId}/${newStatus}`)
      console.log(response)
      getReviews()
    } catch (error) {
      console.log(error)
      
    }finally{
      dispatch(hideLoading())
    }
   
    // setReviews(updatedReviews);
    setSelectedReview(null); // Close dropdown
  };

  const handleDeleteReview = async(reviewId) => {
   try {
    dispatch(showLoading())
    const response=await axiosInstance.delete(`/admin/deletereview/${reviewId}`)
    console.log(response)
    toast.success(response?.data?.message)
    getReviews()
   } catch (error) {
    console.log(error)
   }finally{
    dispatch(hideLoading())
   }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'show':
        return 'bg-green-100 text-green-800';
      case 'hide':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Render star rating
  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <FaStar 
            key={i} 
            className={i < rating ? "text-yellow-400" : "text-gray-300"} 
            size={14}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full  mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Reviews Management</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by product name..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <select
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto ">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  index
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comment
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y  divide-gray-200">
              {reviews.map((review,index) => (
                <tr key={review.id} className={review.reported ? 'bg-red-50' : 'hover:bg-gray-50'}>
                  <td className="px-2 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{index+1}  
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap">
                    <div className="flex items-center">
                      {/* <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <FaUser className="text-gray-500" />
                      </div> */}
                      <div className="ml-2">
                        <div className="text-sm font-medium text-gray-900">{review.user.username}</div>
                        <div className="text-sm text-gray-500">{review.user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{review.product.name}</div>
                    <div className="text-sm text-gray-500"> {review.category.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderStars(review.rating)}
                  </td>
                  <td className="px-4 py-2">
                    <div className="text-sm text-gray-900 ">{review.comment }</div>
                  </td>
                  <td className="px-4 whitespace-nowrap ">
  <div className="inline-block relative text-left">
    <div>
      <button 
        type="button" 
        className={`inline-flex justify-center px-3 py-1 rounded-full text-xs leading-5 font-semibold ${getStatusColor(review.status)}`}
        onClick={() => setSelectedReview(selectedReview === review._id ? null : review._id)}
      >
        {review.status}
        <FaChevronDown className="ml-1 mt-0.5" size={10} />
      </button>
    </div>
    
    {selectedReview === review._id && ( 
      <div className="absolute left-0  w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
        <div className="py-1">
          <button 
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            onClick={() => handleStatusChange(review._id, 'visible')}
          >
            visible
          </button>
          <button 
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            onClick={() => handleStatusChange(review._id, 'visible')}
          >
            visible
          </button>
          {/* <button 
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            onClick={() => handleStatusChange(review.id, 'rejected')}
          >
            Reject
          </button> */}
        </div>
      </div>
    )}
  </div>
</td>
                  <td className=" px-4 py-2 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => {/* Add view functionality */}}
                        title='view review'
                      >
                        <FaEye className="inline mr-1" /> 
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDeleteReview(review._id)}
                        title='delete'
                      >
                        <FaTrash className="inline mr-1" /> 
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination placeholder */}
      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing 1 to {reviews.length} of {reviews.length} entries
        </div>
        {
          totalPage !== 1 &&(
            <div className="flex space-x-2">
          <button 
          disabled={page===1}
          onClick={()=>setPage(page-1)} 
          
          className={`px-3 py-1 border rounded-md ${page===1 ? ' cursor-not-allowed':'' } bg-gray-100 text-gray-700`}>
            Previous
          </button>
          <button className="px-3 py-1 border rounded-md bg-blue-500 text-white">
            {page}
          </button>
         
          <button    
          disabled={page===totalPage} 
           onClick={()=>setPage(page+1)}    
          className={`px-3 py-1 border ${totalPage === page ? 'cursor-not-allowed' : ''} rounded-md bg-gray-100 text-gray-700`}>
            Next
          </button>
        </div>

          )
        }
        
      </div>
    </div>
  );
};

export default AdminReviewsPage;