import { useState } from 'react';
import toast from 'react-hot-toast';
import axiosInstance from '../configure/axios';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {login,setProfile} from '../redux/authSlice'


const CenteredLoginPage = () => {
  const dispatch=useDispatch()
  const navigate=useNavigate()
   const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

   const handlechange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

   const validate = () => {
             console.log("the data=",data)


    console.log("inside the validation");
    
    let flag=true;
    if (!data.email.trim()) {
     
    
      
       toast.error("email is required");
       return flag = false;

      
    } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
      

       toast.error("invalid email format");
     return  flag = false;
    }
    if (!data.password.trim()) {
     

       toast.error("password is required");
       return flag = false;
    }

    return flag;
  };

    const handlesubmit = async (e) => {
   console.log("jkdshjhf");
   

    e.preventDefault();
    const validation = validate();
     console.log("inside=",validation);
    try {
      if (validation) {
         setLoading(true)
         console.log("the data=",data)
         const response = await axiosInstance.post("/auth/signin", data);
           console.log("login res",response);
           let photo=response?.data?.userdata?.profile 
           if(photo){
                 dispatch(setProfile(photo))
           }
         
          
          dispatch(login())
          
       
       
        // dispatch(setLoading(true))
        toast.success(response.data.message);
        // if(response.data.){
         
        // }
        // if(response.status===200){
        //   dispatch(loginsuccess({
        //     user:response.data.userdata
        //   })
        // )
        
      
      console.log("after response=", response.data.userdata);
    }
      }
       catch (error) {
      console.log("full error=",error);
      
      const errorMessage = error.response?.data?.message || "An unexpected error occurred";
      console.error("Login error:", errorMessage);
      toast.error(errorMessage);
    }finally {
        setLoading(false)
      // dispatch(setLoading(false));
    }
    }
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Image Section - Hidden on mobile */}
        

        {/* Login Form Section */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handlesubmit} className="space-y-6">
            <div>
              <label  className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={(e) => handlechange(e)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="your@email.com"
                
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={data.password}
                onChange={(e) => handlechange(e)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
               
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

            <Link to="/forgetpassword" className="text-sm text-indigo-600 hover:text-indigo-500">
  Forgot password?
</Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </div>
        {/* left iamge section  */}
        <div className="hidden md:block md:w-1/2 mix-blend-hard-normal bg-gray-200">
          <div className="h-full flex items-center justify-center p-8">
            <img 
              src="/2149167099.jpg" 
              alt="Workspace" 
              className="object-cover mix-blend-hard-normal h-full w-full rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CenteredLoginPage;