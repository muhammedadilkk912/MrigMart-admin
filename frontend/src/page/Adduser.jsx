import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {toast} from 'react-hot-toast'
import axiosInstance from '../configure/axios';
import { useDispatch } from 'react-redux';
import { showLoading,hideLoading } from '../redux/loadeSlic';
import { useEffect } from 'react';

const Adduser = () => {
  const {id}=useParams()
  const navigate=useNavigate()
  const dispatch=useDispatch()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [edit,setEdit]=useState(null)

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  useEffect(()=>{
    if(id) getuser()
   
  },[id])
  const getuser=async()=>{
    try {
      dispatch(showLoading())
      const response=await axiosInstance.get(`/admin/getuser/${id}`)
      let user=response?.data?.user
      console.log(user)
      setEdit(user)
      setFormData({...formData,username:user.username,email:user.email})
      
      console.log(response)
    } catch (error) {
      
      toast.error(error?.response?.data?.message)
      console.log(error)
      
    }finally{
      dispatch(hideLoading())
    }
  }

  const validateForm = () => {
    let valid = true;
    // setErrors({})
   setErrors({})

    // Username validation
    if (!formData.username.trim()) {
      setErrors({username:'username'})
      toast.error('Username is required')
    
     return valid = false;
    } 

    // Email validation
    if (!formData.email.trim()) {
      setErrors({email:'email'})
      toast.error('Email is required')
     return  valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrors({username:'email'})
      toast.error('enter valid  email')
     return valid = false;
    } 
    // Password validation
    if (!formData.password) {
      setErrors({password:'password'})
      toast.error('Password is required')
      return valid = false;
    } else if (formData.password.length < 6) {
      setErrors({password:'password'})
      toast.error('Password must be at least 6 characters')
      return valid = false;
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      setErrors({confirmPassword:'confirmPassword'})
      toast.error('Passwords do not match')
     return valid = false;
    } 

   
    return valid;
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    
    if (validateForm()) {
     try {
      dispatch(showLoading())
      const response=await axiosInstance.post('/admin/add_user',formData) 
      toast.success(response?.data?.message)
      navigate(-1)
     } catch (error) {
      toast.error(error?.response?.data?.message)
      console.log(error)
     }finally{
      dispatch(hideLoading())
     }
    }
    console.log(errors)
  };
  const handleEditSubmit=async(e)=>{
    console.log('inside the halde edit ')
    console.log(formData)
    e.preventDefault()
    setErrors({})
    if(!formData.username.trim()){
      toast.error("username is required")
      setErrors({username:"username"})
      return null
    }
    if(!formData.email.trim()){
      toast.error("email is required")
      setErrors({email:"email"})
      return null
    }else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)){
      toast.error('email is required')
      setErrors({email:"invalid email format "})
      return null
    }
    let array = ['username', 'email']


const obj = array.reduce((acc, val) => {
  if (edit[val] !== formData[val]) {
    acc[val] = formData[val]
  }
  return acc
}, {})


    // console.log('check=',check)
    console.log( "faris",obj)
    if(Object.keys(obj).length > 0){
      console.log('true')
      try {
        const response=await axiosInstance.put(`/admin/updateuser/${id}`,obj)
        toast.success(response?.data?.message)
      } catch (error) {
        console.log(error)
        toast.error(error?.response?.data?.message)
      }
    }
   
  }

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-sm sm:w-4/5 mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New User</h2>
      
      <form onSubmit={id? handleEditSubmit  : handleSubmit} className="space-y-4">
        {/* Username Field */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter username"
          />
          {/* {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>} */}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter email"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        {/* Password Field */}{
          !id&&(
            <>
            <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter password"
          />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
        </div>
         {/* Confirm Password Field */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Confirm password"
          />
          {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
        </div>
            </>
          )
        }
        

       

        {/* Submit Button */}
        <div className="flex justify-between items-center">
          
          <button
          type='button'
          onClick={()=>navigate(-1)}
          className='border sm:border-2 py-2 px-4 font-medium text-gray-500 hover:bg-white hover:border-blue-600 hover:text-blue-500  border-gray-500 rounded-md'
          >
            Cancel

          </button>
          <button
            type="submit"
            className=" bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Adduser;     