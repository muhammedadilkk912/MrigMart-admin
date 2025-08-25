import React from 'react'
import { FaDollarSign, FaUsers, FaStore, FaShoppingCart } from 'react-icons/fa';
import axiosInstance from '../configure/axios';

const Dashcard = ({revenue,order,seller,user}) => {
    // console.log("data",revenue)
    // console.log("seller",seller)
    // console.log("user=",user)
    // console.log("order",order)


    const checkpercentage=(thism,last)=>{
        // console.log("inside the check percentage")
        // console.log(thism,last)
        let percentageChange
        
           percentageChange = last  === 0 || !last
  ? thism === 0 ? 0 : 100 // or some fallback logic
  : ((thism - last) / last) * 100;
        
    if(!percentageChange){
        percentageChange=0
    }
        
        // let difference=(thism-last)/last *100
        // console.log("difference",difference)
       // Round to 2 decimal places and convert to number
  const rounded =  parseFloat(percentageChange.toFixed());
  // console.log("rounded=",rounded)

  return {
    percentageChange: rounded,
    ispositive: rounded >= 0
  };

    }

  

    
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Revenue Card */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg shadow-lg text-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Total Revenue</p>
                  <p className="text-3xl font-bold mt-2">₹{revenue?.total}</p>
                </div>
                <div className="bg-blue-400 p-3 rounded-full">
                  <FaDollarSign className="text-2xl" />
                </div>
              </div>
              {
                (()=>{
                        const { percentageChange, ispositive } = checkpercentage(revenue?.thisMonth, revenue?.lastMonth);
                        // console.log("insdie the pertceage tahe checking")
                    return(
                          <p className="text-xs mt-4 opacity-80">
        {`${ispositive ? '+' : ''}${percentageChange}% from last month`}
      </p>

                    )
                })()
              }
            
                       

                      


               
             
            </div>
    
            {/* Total Customers Card */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg shadow-lg text-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Total Customers</p>
                  <p className="text-3xl font-bold mt-2">{user?.total}</p>
                </div>
                <div className="bg-green-400 p-3 rounded-full">
                  <FaUsers className="text-2xl" />
                </div>
              </div>
              {
                (()=>{
                    // console.log("this month=",user.lastMonth)
                        const { percentageChange, ispositive } = checkpercentage(user?.this, user?.last);
                        // console.log("insdie the pertceage tahe checking")
                    return(
                          <p className="text-xs mt-4 opacity-80">
        {`${ispositive ? '+' : ''}${percentageChange}% from last month`}
      </p>

                    )
                })()
              }
            </div>
    
            {/* Total Sellers Card */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg shadow-lg text-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Total Sellers</p>
                  <p className="text-3xl font-bold mt-2">{seller?.total}</p>
                </div>
                <div className="bg-purple-400 p-3 rounded-full">
                  <FaStore className="text-2xl" />
                </div>
              </div>
 {
                (()=>{
                        const { percentageChange, ispositive } = checkpercentage(seller?.this, seller?.last);
                        // console.log("insdie the pertceage tahe checking")
                    return(
                          <p className="text-xs mt-4 opacity-80">
        {`${ispositive ? '+' : ''}${percentageChange}% from last month`}
      </p>

                    )
                })()
              }
            </div>
    
            {/* Total Orders Card */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-lg shadow-lg text-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Total Orders</p>
                  <p className="text-3xl font-bold mt-2">{order?.total}</p>
                </div>
                <div className="bg-orange-400 p-3 rounded-full">
                  <FaShoppingCart className="text-2xl" />
                </div>
              </div>
              {
                (()=>{
                        const { percentageChange, ispositive } = checkpercentage(order?.thisMonth, order?.lastMonth );
                        console.log("insdie the pertceage tahe checking")
                    return(
                          <p className="text-xs mt-4 opacity-80">
        {`${ispositive ? '+' : ''}${percentageChange}% from last month`}
      </p>

                    )
                })()
              }
            </div>
          </div>
  )
}

export default Dashcard
