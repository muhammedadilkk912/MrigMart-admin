import { useState } from 'react';
import { FiEye, FiX } from 'react-icons/fi';

import React from 'react'
import { Key } from 'lucide-react';

const Dialoge = ({ product, onClose }) => {
    console.log(product)
  return (
    <div className="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Dialog Header */}
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-semibold">Product Details</h3>
          <button 
             onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <FiX size={20} />
          </button>
        </div>
        
        {/* Dialog Content */}
        <div className="p-4 space-y-4">
          <div className="flex">
            <span className="font-medium w-32">Name:</span>
            <span>{product.name}</span>
          </div>
          <div className="flex">
            <span className="font-medium w-32">Category:</span>
            <span>{product.category?.category || 'N/A'}</span>
          </div>
          <div className="flex">
            <span className="font-medium w-32">Orignal price:</span>
            <span>${product.price}</span>
          </div>
          <div className="flex">
            <span className="font-medium w-32">Discount</span>
            <span>${product.discount} <span className='text-red-500 font-bold'>%</span></span>
          </div>
          {/* <div className="flex">
            <span className="font-medium w-32">Discount price:</span>
            <span>${product.discountprice}</span>
          </div> */}
          <div className="flex">
            <span className="font-medium w-32">Stock:</span>
            <span>{product.stock}</span>
          </div>
          <div className="flex">
            <span className="font-medium w-32">Status:</span>
            <span className={`capitalize ${product.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
              {product.status}
            </span>
          </div>
          {
            product?.core_details&&(
                Object.entries(product?.core_details).map(([Key,value],index)=>(
                  <div key={index} className="flex">
            <span className="font-medium w-32">{Key}</span>
            <span>{value}</span>
          </div>
                    
                ))
            )
          }


        </div>
        
        {/* Dialog Footer */}
        <div className="border-t p-4 flex justify-end">
          <button
             onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dialoge


// const ProductViewDialog = () => {
//   return (
    
//   );
// };

// In your product listing component:
// const ProductRow = ({ val }) => {
//   const [showDialog, setShowDialog] = useState(false);

//   return (
//     <tr key={val._id}>
//       {/* ... other table cells ... */}
//       <td>
//         <button
//           className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-md"
//           title="View"
//           onClick={() => setShowDialog(true)}
//         >
//           <FiEye size={18} />
//         </button>
        
//         {showDialog && (
//           <ProductViewDialog 
//             product={val} 
//             onClose={() => setShowDialog(false)} 
//           />
//         )}
//       </td>
//     </tr>
//   );
// };