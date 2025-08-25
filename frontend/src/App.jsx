import React, { useEffect, useState } from 'react'
import { Routes, Route, useNavigate, Navigate, useLocation } from "react-router-dom";
import  {Toaster} from 'react-hot-toast'
import Forgetpassword from './page/Forgetpassword';
import AdminLayout from './component/Adminlayout';
import Dashboard from './page/Dashboard';
import Users from './page/Users';
import Sellers from './page/Sellers';  
import Product from './page/Product';
import Order from './page/Order';
import { useSelector,useDispatch } from 'react-redux';
import {setAuthentication} from './redux/authSlice'
import Category from './page/category';
import AddCategory from './page/addcategory';
import Addproduct from './page/Addproduct';
import Banner from './page/Banner';
import Adduser from './page/Adduser';
import Viewuser from './page/Viewuser';
import Seller_reg from './page/Seller_reg';
import Reviews from './page/Reviews'
import ProductDetailPage from './page/ProductDetailPage';

import Profile from './page/Profile';
import Login from './page/login'
import axiosInstance from './configure/axios';
import { hideLoading, showLoading } from './redux/loadeSlic';
import { ToastContainer } from 'react-toastify';
import Viewseller from './page/Viewseller';
import ProtectedRoute from './component/ProtectedRoute';



const App = () => {
    const location = useLocation();
    const [initialCheckDone, setInitialCheckDone] = useState(false);   


  const navigate=useNavigate()
  const authentication=useSelector((state)=>state.auth.authentication)
  console.log("isauthentication=",authentication)
  const dispatch=useDispatch()
  useEffect(()=>{
    if(!authentication  && !initialCheckDone){
      checkauthentication()
      setInitialCheckDone(true);   
    }
  },[authentication])

  const checkauthentication=async()=>{
  try {
      console.log("run again")
      dispatch(showLoading())
      const response=await axiosInstance.get('/auth/authcheck')
      console.log("auth kk response=",response)
      console.log("inside check authetication ")
      dispatch(setAuthentication(true))
      

  } catch (error) {
   
    console.log("error in check authetiction")
    console.log("error in authentication=",error)
    
  }
  finally{
     dispatch(hideLoading())
  }

}



  return (
    <div >
       <ToastContainer position='top-center' autoClose='3000'/>
       <Toaster />  
      
      <Routes>
   <Route path='/' element={authentication ? <Navigate to="/Admin" /> : <Login />} />        
   <Route path="/forgetpassword" element={<Forgetpassword/>}/>

        <Route path='/Admin' element={
          <ProtectedRoute authentication={authentication}>
            <AdminLayout/>

          </ProtectedRoute>
             
          
          }>
             <Route index element={<Dashboard />} />
             <Route path='users' element={<Users/>}/>
             <Route path='sellers' element={<Sellers/>}/>
             <Route path='products' element={<Product/>}/>
             <Route path='addproduct' element={<Addproduct/>}/>
             <Route path='editproduct/:id' element={<Addproduct/>}/>
             <Route path='orders' element={<Order/>}/>
             <Route path='category' element={<Category/>}/>
             <Route path='addCategory' element={<AddCategory/>}/>
             <Route path='editcategory/:id' element={<AddCategory/>}/>
             <Route path='profile' element={<Profile/>}/>
             <Route path='banner' element={<Banner/>} />
             <Route path='adduser' element={<Adduser/>}/>
             <Route path='edituser/:id' element={<Adduser/>}/>
             <Route path='viewuser/:id' element={ <Viewuser/> }/>
             <Route path='seller_reg' element={<Seller_reg/>} />
             <Route path='edit_seller_reg/:id' element={<Seller_reg/>} />
             <Route path='viewseller/:id' element={<Viewseller/>}/>
             <Route path='reivews' element={<Reviews/>}/>
             <Route path='ProductDetailPage/:id' element={<ProductDetailPage/>}/>


        </Route>
      </Routes>  
    
      
    </div>
  )
}

export default App
