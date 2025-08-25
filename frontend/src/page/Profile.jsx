import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { showLoading,hideLoading } from '../redux/loadeSlic';
import axiosInstance from '../configure/axios';
import {toast} from 'react-toastify'

const ProfilePage = () => {
    const dispatch=useDispatch()
  const [isEditing, setIsEditing] = useState(false);
  
   const [formdata, setFormdata] = useState({
    name:"",
    email:"",
    //  password:"",   
    profile:""
  });
  const [data,setData]=useState({...formdata})
  const [confirmPassword, setConfirmPassword] = useState("");
    const [avatarPreview, setAvatarPreview] = useState(data?.profile);

    console.log("avatar=",avatarPreview)

  
//   const [profile,setProfile]=useState({images:''})

  useEffect(()=>{
    getprofile()
  },[])

const getprofile = async () => {
  dispatch(showLoading());

  try {
    const response = await axiosInstance.get('/admin/profile');
    const profileData = response.data.profile;

    const formattedData = {
      name: profileData.username, // Use .name if that's actually returned
      email: profileData.email,
      //  password: profileData.password,
      profile:profileData.profile
    };
    

    setFormdata(formattedData);   
    setData(formattedData); // Keep in sync
    setAvatarPreview(formattedData.profile)
    
    // setProfile({
    //    image: profileData.profile
    // })

  } catch (error) {
    console.log("error in profile", error);
  } finally {
    dispatch(hideLoading());
  }
};

  console.log(formdata)


 
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    console.log(name,"=",value)     
    setData({
      ...data,
      [name]: value
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    console.log("files=",file)
    let imagesize=2*1024*1024
    if(file.size>imagesize){
      toast.warning("maximum image size is 2MB")
      return null
    }


    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setData({
          ...data,
          profile: reader.result
        });

      };
      reader.readAsDataURL(file);
    }
    // setData({
    //   ...data,profile:file
    // })
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async(e) => {
    console.log(data)
    e.preventDefault();

  

    const isEqual =
  Object.keys(data).length === Object.keys(formdata).length &&
  Object.keys(data).every(key => data[key] === formdata[key]);

  if(!isEqual){
      console.log("the value=",isEqual)
        const validate=validation()
        if(validate){
          console.log("validate=",validate)
          try {
            const form=new FormData()
            form.append("name",data.name)
            form.append("email",data.email)
            if(data.profile!==formdata.profile){
              form.append("profile",data.profile)

            }

             dispatch(showLoading())
             const response=await axiosInstance.put('/admin/updateprofile',form)
             console.log(response)
             setIsEditing(!isEditing)
             getprofile()
          } catch (error) {
            console.log("error updationg profile",error)
            
          }finally{
            dispatch(hideLoading())
          }
          
        }


  }else{
            e.preventDefault();

    return toast.warning("no changes made")
  }
  };

  const validation=()=>{

    let isValid=true
    if(!data.name.trim()){
      toast.error("name is required")
      return isValid=false
    }
    if(!data.email.trim()){
      toast.error("email is required")
      return isValid=false
    }
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(data.email)) {
  toast.error("Wrong email format");
  return isValid = false;
  
}

//      if(!data.password.trim()){
//       toast.error("password is required")
//       return isValid=false
//      }else if(data.password.length<6 ){
// toast.error("Please enter a password with at least 6 characters");
// return isValid=false
//      }else if(data.password.length>10){
//       toast.error("password cannot excessed 10 characters")
//       return isValid=false
//      }
     
//      if(!confirmPassword.trim()){
//       toast.error("confirmPassword is required")
//       return isValid=false

//      }
//     else if(confirmPassword!==data.password){
//       toast.error("confirmPassword not equal to password")
//       return isValid=false
//      }
    
  return isValid
  }

  const handleCancel = () => {
    // setFormData({ );
    setData(formdata)
    // setProfile({images:formData.images})  
    setAvatarPreview(formdata.profile);  
    setConfirmPassword("")

    setIsEditing(false);
  };
  // console.log("after iage=",data.profile)
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-2 sm:px-4 md:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-indigo-700 px-6 py-8  sm:py-12 relative">
            <div className="flex items-center sm:space-x-6">
              <div className="relative group">
                <img 
                  className=" h-14 w-14 sm:h-24 sm:w-24 rounded-full border-2 sm:border-4 border-white object-cover" 
                  src={isEditing ? avatarPreview?avatarPreview:"/user.png" : data?.profile ?data?.profile:"/user.png"} 
                  alt={data.name} 
                />
                {isEditing && (
                  <>
                    <div 
                      className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={triggerFileInput}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleAvatarChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </>
                )}
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-white">{data.name}</h1>
                <p className="text-indigo-200">{data.email}</p>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="px-3 py-8 sm:px-10">
            {!isEditing ? (
              <>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="sm:px-4 sm:py-2 xs:text-small  bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-200"
                  >
                    Edit Profile
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                    <p className="mt-1 text-gray-900">{data.name}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                    <p className="mt-1 text-gray-900">{data.email}</p>
                  </div>

                  {/* <div>
                    <h3 className="text-sm font-medium text-gray-500">Password</h3>
                    <p className="mt-1 text-gray-900">{data.password}</p>
                  </div> */}

                 
                </div>
              </>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-semibold text-gray-800">Edit Profile</h2>
                  <div className="space-x-3">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"

                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-200"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      
                      name="name"
                      value={data.name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"                
                      name="email"
                      value={data.email}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  {/* <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={data.password}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                   {data.password!==formData.password &&(
                    <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Confirm password
                    </label>
                    <input
                      type="password"
                      // id="password"
                      name="confirmPassword"
                      value={confirmPassword}  
                      onChange={(e)=>setConfirmPassword(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>


                  )}  */}
                  
                  
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 