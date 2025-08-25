import { ArrowLeft, Edit, Trash2, Star, ShoppingCart, DollarSign } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../configure/axios';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { hideLoading, showLoading } from '../redux/loadeSlic';

const ProductDetailPage = () => {
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const [product,setProduct]=useState(null)
  const [selectImg,setSelectImg]=useState(null)
  const {id}=useParams()
  console.log("id",id)

  useEffect(()=>{
    getProducts()
  },[id])

  const getProducts=async(req,res)=>{
    try {
      dispatch(showLoading())
      const response=await axiosInstance.get(`/admin/ProductDetailPage/${id}`)
      console.log("res=",response)
      setProduct(response?.data?.product)
      console.log("inmage=",response?.data[0]?.image[0])
      setSelectImg(response?.data?.product[0]?.images[0])
    } catch (error) {
      console.log(error)
         
    }finally{
      dispatch(hideLoading())
    }

  }
  console.log("select the image=",selectImg)
  console.log("product",product?.[0]._id)   
  return (
    
    <div className="p-6 max-w-6xl mx-auto">
      {
        product && product?.length > 0 ? (
         
         
         
            product.map((product,index)=>(
               <>
               {/* Header with back button and actions */}
      <div className="flex justify-end items-center mb-6">
        {/* <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
          <ArrowLeft size={18} />
          Back to Products
        </button> */}
        
        <div className="flex gap-3">
          <button 
           onClick={()=>navigate(`/Admin/editproduct/${product?._id}`)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            <Edit size={16} 
            
            />
            Edit
          </button>
          {/* <button className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
            <Trash2 size={16} />
            Delete
          </button> */}
        </div>
      </div>
      {/* Product Details */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="md:flex">
          {/* Product Images */}
          <div className="md:w-1/2 p-6">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
              <div className="w-full h-full flex items-center justify-center text-gray-400">
               <img src={selectImg} alt="" srcset="" className='object-cover w-full h-full ' />
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto">
  {product?.images?.map((item) => (
    <div key={item} 
    onClick={()=>setSelectImg(item)}
    className={`w-16 h-16 ${selectImg === item && 'border-2 border-blue-500'} bg-gray-200 rounded-md overflow-hidden`}>
      <img
        src={item}
        alt=""
        className="object-cover w-full h-full"
      />
    </div>
  ))}
</div>

          </div>

          {/* Product Info */}
          <div className="md:w-1/2 p-6 border-t md:border-t-0 md:border-l border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{product?.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
               {product?.status}
              </span>
              {/* <span className="text-gray-500">SKU: PRD-001</span> */}
            </div>

            {/* Sales Metrics */}
            <div className="grid grid-cols-3 gap-3 mb-6 bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                  <ShoppingCart size={16} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Sold</p>
                  <p className="font-semibold"> {product?.totalSold} </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-100 rounded-full text-green-600">
                  <DollarSign size={16} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Sales</p>
                  <p className="font-semibold">{product?.totalSales}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-yellow-100 rounded-full text-yellow-600">
                  <Star size={16} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Reviews</p>
                  <p className="font-semibold flex ">{product?.totalReviews} ({product?.averageRating} <span className='text-yellow-500'>★</span>)</p>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-sm text-gray-500">Price</h3>
                <p className="font-medium">{product?.discountprice}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500">Stock</h3>
                <p className="font-medium">{product?.stock} units</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500">Category</h3>
                <p className="font-medium">{product?.category}</p>
              </div>
              <div>
               {/* {const date=product?.createdAt.getMonth()} */}
                <h3 className="text-sm text-gray-500">Created</h3>
                <p className="font-medium">{product?.createdAt.split('T')[0]}</p>
                
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm text-gray-500 mb-2">Description</h3>
              <p className="text-gray-700">
               {
                product?.description
               }
              </p>
            </div>

            {/* Additional Details */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Additional Information</h3>
              <div className="grid grid-cols-2 gap-4">
                {
                  Object.keys(product?.core_details).map((val,index)=>(
                    <div key={index}>
                  <h4 className="text-xs text-gray-500">{val}</h4>
                  <p>{product?.core_details[val]}</p>
                </div>

                  ))
                }
                {/* <div>
                  <h4 className="text-xs text-gray-500">Weight</h4>
                  <p>1.2 kg</p>
                </div>
                <div>
                  <h4 className="text-xs text-gray-500">Dimensions</h4>
                  <p>10 x 5 x 8 cm</p>
                </div>
                <div>
                  <h4 className="text-xs text-gray-500">Brand</h4>
                  <p>AudioMaster</p>
                </div>
                <div>
                  <h4 className="text-xs text-gray-500">Vendor</h4>
                  <p>Supplier Co.</p>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
       </>
            
          ))

        
           
         
         

        ):(
          <div className='flex justify-center items-center'>
            <p>products not found</p>

          </div>

        )
      }
      

      
    </div>
  );
};

export default ProductDetailPage;