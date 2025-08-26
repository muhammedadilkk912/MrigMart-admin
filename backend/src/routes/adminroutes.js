const express=require('express')
const protectroute=require('../middleware/protectroute')
const upload=require('../middleware/multer')
const upload2 =require('../middleware/Multer2')
const authorizerole=require('../middleware/rolemiddlewarre')
const {getproducts,getcustomers,getsellers,dashboard,logout,change_status,add_category,get_category,nextusers,searchusers,
    delete_category,getcategory_withid,update_category,change_statusbyuser,delete_user,user_byfilter,changestatus_bypr,
    deleteproduct,deleteseller,category,profile,update_profile,Addproduct,getproductwith_id,updatedproduct,adduser,
    getuser_id,update_user,add_seller,getSeller_id,update_seller,View_seller,getbanners,getorders,order_status_change,getReviews,
    deletereview,change_reviewstatus,deleteBanner,addBanner,updateBanner,update_bannerStatus,allproduct_details,getProductsForBanners,getuserAllDetails,
    getUserPurchaseHistory
}=require('../controllers/admincontroller')
const {getcards, topProducts,getdash_orders,getchartDetails}=require('../controllers/dashboardcontroller')
const router=express.Router()

 
  router.post('/logout',logout)
  router.get('/profile',protectroute,authorizerole('admin'),profile)  
  router.put('/updateprofile',protectroute,authorizerole('admin'),update_profile)



 router.get('/dasboard',protectroute,authorizerole('admin'),dashboard)
 router.get('/getproducts/:page',protectroute,authorizerole('admin'),getproducts)
 router.put('/updatedproduct/:id',protectroute,authorizerole('admin'),upload.array('images',5),updatedproduct)
 router.put('/product/change_status/:id/:status',protectroute,authorizerole('admin'),changestatus_bypr)
 router.delete('/product/delete/:id',protectroute,authorizerole('admin'),deleteproduct)
 router.get('/getcategory',protectroute,authorizerole('admin'),category)
  router.post('/addproduct',protectroute,upload.array('images',5),authorizerole('admin'),Addproduct)
 router.get('/getproduct/:id',protectroute,authorizerole('admin'),getproductwith_id)
 router.get('/ProductDetailPage/:id',protectroute,authorizerole('admin'),allproduct_details)

   


router.post('/addcategory',protectroute,authorizerole('admin'),add_category)
router.get('/categories/:page',protectroute,authorizerole('admin'),get_category)
router.delete('/deletecategory/:id',protectroute,authorizerole('admin'),delete_category)
router.get('/category/:id',protectroute,authorizerole('admin'),getcategory_withid) 
router.put('/updatecategory/:id',protectroute,authorizerole('admin'),update_category)


 router.get('/getsellers/:page',protectroute,authorizerole('admin'),getsellers)
 router.put('/seller/changestatus/:id/:status',protectroute,authorizerole('admin'),change_status)
 router.delete('/seller/delete/:id',protectroute,authorizerole('admin'),deleteseller)
 router.post('/add_seller',upload2.single('image'),protectroute,authorizerole('admin'),add_seller)
 router.get('/getseller/:id',protectroute,authorizerole('admin'),getSeller_id)
 router.put('/updateseller/:id',upload2.single('image'),protectroute,authorizerole('admin'),update_seller)
 router.get('/view_seller_details/:id',protectroute,authorizerole('admin'),View_seller)            

router.get('/getusers/:page',protectroute,authorizerole('admin'),getcustomers)  
router.post('/add_user',protectroute,authorizerole('admin'),adduser)
router.get('/getuser/:id',protectroute,authorizerole('admin'),getuser_id)
router.put('/updateuser/:id',protectroute,authorizerole('admin'),update_user)
router.get('/newusers/:page',protectroute,authorizerole('admin'),nextusers)
router.get('/searchusers',protectroute,authorizerole('admin'),searchusers)
router.put('/user/change_status/:id/:status',protectroute,authorizerole('admin'),change_statusbyuser)
router.delete('/user/delete/:id',protectroute,authorizerole('admin'),delete_user)
router.get('/user/status/:status',protectroute,authorizerole('admin'),user_byfilter)
router.get('/useralldetails/:id',protectroute,authorizerole('admin'),getuserAllDetails)
router.get('/user/purchasrhistory/:id',protectroute,authorizerole('admin'),getUserPurchaseHistory)

router.get('/existingbanners',protectroute,authorizerole('admin'),getbanners)
router.delete('/delete_banner/:id',protectroute,authorizerole('admin'),deleteBanner)  
router.post('/add_banner',protectroute,upload2.single('image'),authorizerole('admin'), addBanner)
router.put('/update_banner/:id',protectroute,upload2.single('image'),authorizerole('admin'),updateBanner)
router.put('/update/bannerstatus/:id/:status',protectroute,authorizerole('admin'),update_bannerStatus)
router.get('/banner/getproduct',protectroute,authorizerole('admin'),getProductsForBanners)


router.get('/getorders/:page',protectroute,authorizerole('admin'),getorders)
router.get('/getreviews/:page',protectroute,authorizerole('admin'),getReviews)   
router.delete('/deletereview/:id',protectroute,authorizerole('admin'),deletereview)

router.put('/changeorderstatus',protectroute,authorizerole('admin'),order_status_change)
router.put('/changereviewstatus/:id/:status',protectroute,authorizerole('admin'),change_reviewstatus)


//dash board routes

router.get('/dashboard/getcards',protectroute,authorizerole('admin'),getcards)
router.get('/dashboard/top_products',protectroute,authorizerole('admin'),topProducts)
router.get('/dashboard/getorders',protectroute,authorizerole('admin'),getdash_orders)
router.get('/dashboard/getchartdata/:filter',protectroute,authorizerole('admin'),getchartDetails)


module.exports=router