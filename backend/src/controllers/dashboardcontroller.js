const orderModel = require("../models/order.model");
const sellerModel = require("../models/seller.model");
const userModel=require('../models/user')
const productModel=require('../models/product.model')

const getcards=async(req,res)=>{
  console.log("inside the getcards");
  // Today
  const now = new Date();
  console.log(now);

  // This month
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1); // e.g., Aug 1, 2025
  const endOfThisMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  ); // Aug 31, 2025

  // Last month
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1); // July 1, 2025
  const endOfLastMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    0,
    23,
    59,
    59,
    999
  ); // July 31, 2025

  console.log("Start of This Month:", startOfThisMonth);
  console.log("End of This Month:", endOfThisMonth);
  console.log("Start of Last Month:", startOfLastMonth);
  console.log("End of Last Month:", endOfLastMonth);
  // return null

  try {
    
const result = await orderModel.aggregate([
  {
    $facet: {
      thisMonthrevenue: [
        { $unwind: "$items" },
        { $unwind: "$items.products" },
        {
          $match: {
            createdAt: { $gte: startOfThisMonth, $lte: endOfThisMonth },
            "items.products.status": "delivered",
          },
        },
        {
          $group: {
            _id: null,
            revenue: { $sum: "$items.products.price" }, // adjust this if totalamount is at root level
          },
        },
      ],
      lastMonthRevenue: [
        { $unwind: "$items" },
        { $unwind: "$items.products" },
        {
          $match: {
            createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
            "items.products.status": "delivered",
          },
        },
        {
          $group: {
            _id: null,
            revenue: { $sum: "$items.products.price" },
          },
        },
      ],
      totalRevenue:[
         { $unwind: "$items" },
        { $unwind: "$items.products" },
        {
          $match:{
            "items.products.status":'delivered'
          }
        },{
          $group:{
            _id:null,
            revenue:{$sum:'$items.products.price'}
          }
        }
      ],
      totalOrder:[
        { $unwind: "$items" },
        { $unwind: "$items.products" },
        {
          $count:'order'
        }

      ],
      thisMOnthorder:[
        {
          $match:{createdAt:{$gte:startOfThisMonth,$lte:endOfThisMonth}}
        },
        {$unwind:'$items'},
        {$unwind:'$items.products'}
        ,
        {
           
            $count:'order'

        }
        
       
      ],
      lastMonthorder:[
        {
          $match:{createdAt:{$gte:startOfLastMonth,$lte:endOfLastMonth}}
        },
        {$unwind:'$items'},
        {$unwind:'$items.products'}
        ,
        {
           
            $count:'order'

        }
        
       
      ]
    }
    
  },
]);
const customers = await userModel.aggregate([
  {
    $match: {
      role: 'user'
    }
  },
  {
    $facet: {
      totalusers: [
        {
          $count: 'user'
        }
      ],
      thisMonthusers: [
        {
          $match: {
            createdAt: { $gte: startOfThisMonth, $lte: endOfThisMonth }
          }
        },
        {
          $count: 'user'
        }
      ],
      LastMonthusers: [
        {
          $match: {
            createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
          }
        },
        {
          $count: 'user'
        }
      ]
    }
  }
]);

const sellers=await sellerModel.aggregate([
  {
    $facet:{
    totalseller:[
      {
        $count:'seller'
      }
    ],
    thisMonthsellers:[
      { 
        $match:{
          createdAt:{$gte:startOfThisMonth,$lte:endOfThisMonth}
        }
      },{
        $count:'seller'
      }
    ],
    LastMonthsellers:[
      {
        $match:{
          createdAt:{$gte:startOfLastMonth,$lte:endOfLastMonth}
        }
      },{
        $count:'seller'
      }
    ]
  }

  }
  
])

// function checkdiference(thismonth,lastmonth){
//   if(thismonth === 0)

// }
const revenue={
  total:result[0].totalRevenue[0]?.revenue,
  lastMonth:result[0].lastMonthRevenue[0]?.revenue,
  thisMonth:result[0].thisMonthrevenue[0]?.revenue

}
const order={
  total:result[0].totalOrder[0]?.order,
  lastMonth:result[0].lastMonthorder[0]?.order,
  thisMonth:result[0].thisMOnthorder[0]?.order
}
const customer={
  total:customers[0].totalusers[0]?.user,
  last:customers[0].LastMonthusers[0]?.user,
  this:customers[0].thisMonthusers[0]?.user
}
const seller={
  total:sellers[0].totalseller[0]?.seller,
  last:sellers[0].LastMonthsellers[0]?.seller,
  this:sellers[0].thisMonthsellers[0]?.seller
}
console.log("chekc differe",result[0]?.thisMonthrevenue[0]?.revenue)
console.log("chekc differe",sellers?.LastMonthsellers)
console.log("chekc differe",result?.thisMonthrevenue)



// const revenue={
//   total:result.Revenue.revenue,
//   difference:result.thisMonthrevenue.revenue
  
// }


    console.log("result=",result);
    res.status(200).json({message:"got it ",revenue,seller,customer,order})

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
}

const topProducts=async(req,res)=>{
  console.log("inside the top products")
  try {
    const products=await productModel.aggregate([
      {
      $project:{
        name:1,
        images:1,
        sold:1
        
      }
    },
    {$sort:{sold:-1}},
    {$limit:5}
      
    ])
    console.log("top products",products)
    res.status(200).json({message:'top products got it',products})
    
  } catch (error) {
    console.log(error)
    res.status(500).json({message:'intrenal server error'})
  }
}
const getdash_orders=async(req,res)=>{
  
  try {
    const orders=await orderModel.aggregate([
      {$unwind:'$items'},
      {$unwind:'$items.products'},
      {
        $lookup:{
          from:'users',
          localField:'user',
          foreignField:'_id',
          as:'user'
        }
      },
      {
        $unwind:'$user'
      },
      {
        $lookup:{
          from:'products',
          localField:'items.products.productId',
          foreignField:'_id',
          as:'product'
        }
      },{
        $unwind:'$product'
      },
        {
         $lookup:{
          from:'categories',
          localField:'product.category',
          foreignField:'_id',
          as:'category'
        }
      },{
        $unwind:'$category'

      },
      {
        $project:{
          _id:'$_id',
          // id:'_id',
          sellerId:'$items.sellerid',
          customerId:'$user.username',
          product:'$product',
          category:'$category.category',
          quantity:'$items.products.quantity',
          price:'$items.products.price',
          status:'$items.products.status',
          createdAt:1,
          deliveryDate:'$items.products.deliveryDate'
        }
      },
      {
        $sort:{
          createdAt:-1
        }

      },{
        $limit:8
      }
      

    ])
    console.log(orders.length)
    res.status(200).json({message:'got new orders',orders})
  } catch (error) {
    console.log(error),
    res.status(500).json({message:'internal server error'})
  }
}

const getchartDetails=async(req,res)=>{
  const {filter}=req.params
  console.log("filter=",filter)
 const matchstage = [];
   const date = new Date();
  if(filter==='6months'){
    
   let sixMonthsAgo = new Date(date);
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
   matchstage.push({
    $match: {
      createdAt: { $gte: sixMonthsAgo }
    }
  });
    
  
  }else{
    console.log("inside the elese")
let startOfYear = new Date(date.getFullYear(), 0, 1);    
console.log(startOfYear)
 matchstage.push({
    $match: {
      createdAt: { $gte: startOfYear, $lte: date }
    }
  });
  }
  console.log("matchstage=",matchstage)
    // return null

   

  // console.log("sixmonthago=",sixMonthsAgo)
  try {
    const report=await orderModel.aggregate([
      {
        $unwind:'$items'
      },{
        $unwind:'$items.products'
      },{
        $match:{
          'items.products.status':'delivered'
        }
      },
      ...matchstage,{
        $group:{
          _id: { month: { $month: '$createdAt' } },
          totalRevenue:{$sum:'$items.products.price'}
        }
      }
    ])
    res.status(200).json({message:'got chart data',report})
  } catch (error) {
    console.log(error)
    res.status(500).json({message:'internal server error'})
  }

}

module.exports={getcards,topProducts,getdash_orders,getchartDetails}