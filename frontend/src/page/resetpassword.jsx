import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axiosInstance from '../configure/axios';


const resetpassword = ({email}) => {
    const location=useLocation()

    // const { email } = location.state || "invalid";
    // if(email){
    //     setUseremail(email)
    // }
    // const [useremail,setUseremail]=useState('')

    console.log("reset  email=",email);


    const navigate=useNavigate()
     // Destructure safely to avoid error
    const [data, setData] = useState({
        password: '',
        confirmpassword: ''
    });
    const validate = () => {
        if (!data.password.trim()) {
            toast.error("Password is required");
            return false;  // Stop further checks
        }
    
        if (!data.confirmpassword.trim()) {
            toast.error("Confirm password is required");
            return false;  // Stop further checks
        }
    
        if (data.confirmpassword !== data.password) {
            toast.error('Passwords do not match');
            return false;  // Stop further checks
        }
    
        return true; // Only returns true if all conditions pass
    };
    
    
    
    const handlechange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    
    const handlesubmit = async (e) => {
        console.log("email===",email);
        console.log("hi");
        
        e.preventDefault();
        const validation=validate()
        console.log("validate=",validation);
        
        if (validation) {
            try {
                const response = await axiosInstance.put('/auth/reset',{data,email} );
                if(response){
                    navigate('/')
                }
                toast.success(response.data.message);
            } catch (error) {
                console.error('Reset password error:', error.message);
                toast.error(error.response?.data?.message || 'Something went wrong');
            }
        }
    };



  return (
    <div className='h-screen w-screen flex justify-center items-center bg-gradient-to-r from-[#483FF3] to-[#7667FF]'>
        <div className="bg-white max-w-[95%] sm:max-w-[80%] md:max-w-[60%] lg:max-w-[40%] h-auto md:min-h-60 flex flex-col justify-center items-center px-5 py-4 gap-4 border border-gray-500 rounded-2xl">
                   <form className="w-full" onSubmit={handlesubmit}>
                       <label className="text-gray-700 inline-block mb-2">New password</label>
                 <input
                            value={data.password}
                            type="password"
                            name="password"
                            className="bg-blue-50 border border-gray-600 rounded h-10 w-full px-3 my-2"
                            onChange={handlechange}
                        />
                        <label className="text-gray-700 inline-block mb-2">Confirm password</label>
                        <input
                            onChange={handlechange}
                            value={data.confirmpassword}
                            type="password"
                            name="confirmpassword"
                            className="bg-blue-50 border border-gray-600 rounded h-10 w-full px-3 my-2"
                        />
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 w-full rounded-md my-4 hover:bg-blue-600 transition"
                        >
                            Submit
                        </button>
                     </form>
                 </div> 
      
    </div>
  )
}

export default resetpassword
