import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../configure/axios';
import { useDispatch } from 'react-redux';
import { showLoading,hideLoading } from '../redux/loadeSlic';
const Viewseller = () => {
    const {id}=useParams()
    const [data,setData]=useState(null)
    const [products,setProducts]=useState([])
    const dispatch=useDispatch()

  const [activeTab, setActiveTab] = useState('details');
  const navigate = useNavigate();
  
  useEffect(()=>{
    fectDetails()
  },[])

   const fectDetails=async()=>{
    try {dispatch(showLoading())
        const response=await axiosInstance.get(`/admin/view_seller_details/${id}`)
        let value=response?.data
        setData(value.seller)
        setProducts(value.product)
        console.log(response)
    } catch (error) {
        console.log(error)
    }finally{
        dispatch(hideLoading())
    }
   }
  // Seller data
//   const seller = {
//     logo: 'https://via.placeholder.com/120',
//     businessName: 'TechGadgets Pro',
//     sellerName: 'Alex Johnson',
//     email: 'alex@techgadgets.com',
//     phone: '+1 (555) 987-6543',
//     businessType: 'Electronics Wholesaler',
//     address: '456 Innovation Blvd, Tech City, TC 90210',
//     banking: {
//       bankName: 'Digital First Bank',
//       accountNumber: '•••• •••• •••• 5678',
//       routing: '987654321'
//     }
//   };

  // Products data
//   const products = [
//     {
//       id: 1,
//       name: 'Bluetooth Noise-Canceling Headphones',
//       category: 'Audio',
//       price: 129.99,
//       stock: 42,
//       image: 'https://via.placeholder.com/60'
//     },
//     {
//       id: 2,
//       name: '4K Action Camera',
//       category: 'Photography',
//       price: 249.99,
//       stock: 8,
//       image: 'https://via.placeholder.com/60'
//     },
//     {
//       id: 3,
//       name: 'Wireless Charging Pad',
//       category: 'Accessories',
//       price: 34.99,
//       stock: 0,
//       image: 'https://via.placeholder.com/60'
//     }
//   ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div className="flex items-center mb-4 sm:mb-0">
            <img 
              src={data?.logo} 
              alt={data?.businessName} 
              className="w-16 h-16 rounded-lg object-cover mr-4 border border-gray-200"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{data?.businessName}</h1>
              <p className="text-gray-600">{data?.businessType}</p>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'details' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
            >
              Business Details
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'products' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
            >
              Products ({products?.length})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Business Details Tab */}
          {activeTab === 'details' && (
            <div className="p-6 md:p-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Business Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Seller Name</h3>
                    <p className="text-gray-900">{data?.name}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Contact Email</h3>
                    <p className="text-gray-900">{data?.email}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Phone Number</h3>
                    <p className="text-gray-900">{data?.phone}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Business Address</h3>
                    <p className="text-gray-900">
  {data?.address?.street}, {data?.address?.city} <br />
  {data?.address?.district}, {data?.address?.state} <br />
  {data?.address?.country} <br />
  {data?.address?.pin}
</p>

                  </div>
                </div>
                
                {/* Right Column - Banking */}
                <div className="border border-gray-100 rounded-lg p-6 bg-gray-50">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Banking Information</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Bank Name</h4>
                      <p className="text-gray-900">{data?.bankDetails?.bankName}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Account Number</h4>
                      <p className="text-gray-900">{data?.bankDetails?.accountNumber}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">IFSC Code</h4>
                      <p className="text-gray-900">{data?.bankDetails?.ifscCode}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="p-0">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        stock
                      </th>
                     
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img className="h-10 w-10 rounded-md object-cover" src={product?.images[0]} alt={product?.name} />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{product?.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{product?.category?.category}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">${product?.discountprice.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            product?.stock === 0 
                              ? 'bg-red-100 text-red-800'
                              : product?.stock < 10
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {product?.stock === 0 ? 'Out of stock' : `${product?.stock} available`}
                          </span>
                        </td>
                        {/* <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => navigate(`/products/${product.id}`)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </button>
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Empty state */}
              {products.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-2">No products listed yet</div>
                  <button className="text-blue-600 hover:text-blue-800 font-medium">
                    Add your first product
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Viewseller;