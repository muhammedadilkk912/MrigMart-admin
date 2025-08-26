import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../configure/axios";
import {useDispatch} from 'react-redux'
import { showLoading,hideLoading } from "../redux/loadeSlic";
import { useNavigate, useParams } from "react-router-dom";
const Seller_reg = () => {
  const {id}=useParams()
  let navigate=useNavigate()
  const dispatch=useDispatch()
  const [activeTab, setActiveTab] = useState("Personal");
  const [data, setData] = useState({
    businessName: "",
    businessType: "",
    address: {
      street: "",
      city: "",
      district: "",
      state: "",
      country: "",
      pin: "",
    },
    banking: {
      accountHolderName: "",
      accountNumber: "",
      bankName: "",
      branch: "",
      ifscCode: "",
    },

    name: "",
    email: "",
    phone: "",
  });
   const [logo, setLogo] = useState();
  const [preview, setPreview] = useState();
  const [errors, setErrors] = useState({});
  const [edit,setEdit]=useState(null)

  useEffect(()=>{
       if(id) getseller()
  },[id])

  const getseller=async()=>{
    try {
      dispatch(showLoading())
      const response=await axiosInstance.get(`/admin/getseller/${id}`)
      console.log(response.data.seller)
      let data1=response?.data?.seller
      console.log("data=",data1)
      setEdit(data1)
      setData({banking:data1?.bankDetails,address:data1?.address,
        name:data1?.name,email:data1?.email,phone:data1?.phone,
        businessName:data1?.businessName,businessType:data1?.businessType
      })
      setLogo(data1.logo)
      setPreview(data1.logo)
    } catch (error) { 
     
      console.log("error in getseller id",error)
    }finally{
       dispatch(hideLoading())
    }
     
  }
    console.log("edit data=",edit)
    console.log("original data=",data)


  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    console.log(file)
    let maxsize = 3 * 1024 * 1024;
    const imagetype = ["image/jpg", "image/png", "image/jpeg"];

    if (!imagetype.includes(file?.type)) {
      toast.warning("This file type is not accepted");
      return null;
    }
    if (file.size > maxsize) {
      toast.warning("Maximum upload size is 3MB");
      return null;
    }
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setLogo(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const scrollAndFocus = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.focus();
    }
  };

  const validateSection = (section) => {
    console.log('inside the valida section')
    
    let isValid = true;
    // const newErrors = {};
    setErrors({});

    if (section === "business") {
     
      if (!data.businessName.trim()) {
        setErrors({ businessName: true });

        toast.error("business name is required");
        return (isValid = false);
      }
      if (!data.businessType) {
        setErrors({ businessType: true });
        toast.error("business type is required");
        return (isValid = false);
      }
    } else if (section === "address") {
      if (!data.address.street.trim()) {
        setErrors({ street: true });
        toast.error("street name is required");
        return (isValid = false);
      }
      if (!data.address.city.trim()) {
        setErrors({ city: true });
        toast.error("city name is required");
        return (isValid = false);
      }
      if (!data.address.district.trim()) {
        setErrors({ district: true });
        toast.error("district name is required");
        return (isValid = false);
      }
      if (!data.address.state.trim()) {
        setErrors({ state: true });
        toast.error("state name is required");
        return (isValid = false);
      }
      if (!data.address.country.trim()) {
        setErrors({ country: true });
        toast.error("country name is required");
        return (isValid = false);
      }
      if (!data.address.pin.trim()) {
        setErrors({ pin: true });
        toast.error("pin number is required");
        return (isValid = false);
      }
    } else if (section === "banking") {
      if (!data.banking.accountHolderName.trim()) {
        setErrors({ accountName: true });
        toast.error("account holder name is required");
        return (isValid = false);
      }
      if (!data.banking.accountNumber.trim()) {
        setErrors({ accountNumber: true });
        toast.error("account number  is required");
        return (isValid = false);
      }
      if (!data.banking.bankName.trim()) {
        setErrors({ bankName: true });
        toast.error("bank name is required");
        return (isValid = false);
      }
      if (!data.banking.branch.trim()) {
        setErrors({ branch: true });
        toast.error("branch name  is required");
        return (isValid = false);
      }
      if (!data.banking.ifscCode.trim()) {
        setErrors({ ifscCode: true });
        toast.error("IFSC code is required");
        return (isValid = false);
      }
    } else if (section === "Personal") {
      let mobileregex=/^[6-9]\d{9}$/
      console.log("name",data.name)
      if (!data.name.trim()) {
        setErrors({ name: true });
        toast.error("name is required");
        return (isValid = false);
      }
      if (!data.email.trim()) {
        setErrors({ email: true });
        toast.error("email is required");
        return (isValid = false);
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        setErrors({ email: true });
        toast.error("enter valid  email");
        return (isValid = false);
      } 
      if (!data.phone.trim()) {
        setErrors({ mobile: true });
        toast.error("mobile number is required");
        return (isValid = false);
      }else if (isNaN(data.phone)) {
      
      setErrors({ mobile: true });
      toast.error("mobile number must be number");
      return (isValid = false);
    }
     if(!mobileregex.test(data.phone)) {
     setErrors({ mobile: true });
      toast.error("invalid mobile format");
      return (isValid = false);}
   }
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all sections before submitting
    // const isBusinessValid = validateSection("business");
    // const isAddressValid = validateSection("address");
    // const isBankingValid = validateSection("banking");

    // if(!isBusinessValid) {
    //   toast.error('Please fill all required business details');
    //   setActiveTab('business');
    //   return;
    // }
    // if(!isAddressValid) {
    //   toast.error('Please fill all required address details');
    //   setActiveTab('address');
    //   return;
    // }
    // if(!isBankingValid) {
    //   toast.error('Please fill all required banking details');
    //   setActiveTab('banking');
    //   return;
    // }
    console.log('validate=',validateSection())
    if(validateSection('banking')){

   
    const formdata = new FormData();
    formdata.append("data", JSON.stringify(data));
    if (logo) {
      formdata.append("image", logo);
    }

    try {
      dispatch(showLoading())
      const response = await axiosInstance.post(
        "/admin/add_seller",
        formdata,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success(response?.data?.message);
      navigate(-1)
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }finally{
      dispatch(hideLoading())
    }
     }
  };
  const anychangCheck=()=>{
    let obj={}
    let key=['name','email','phone','businessName','businessType']
    const change=key.some((val)=>edit[val] !== data[val])
    //  console.log("console=",change)
    obj.normal=change
    const bankchange=Object.keys(edit?.bankDetails).some((val)=>edit.bankDetails[val]!== data.banking[val])
    // console.log("bank change=",bankchange)
    obj.bank=bankchange
    const addresschange=Object.keys(edit?.address).some((val)=>edit.address[val]!== data.address[val])
    // console.log("bank change=",addresschange)
    obj.address=addresschange

    return obj

   
  }
 const  handleEditSubmit=async(e)=>{
  e.preventDefault()
  let change=anychangCheck()

  if(!change.normal && !change.bank && !change.address && logo == edit.logo){
    toast.warning("no changes are maded")
  }
  const formData=new FormData

  if(logo !== edit.logo){
    console.log(edit)  
    console.log("inside the uploading image ###",logo)       
    if(edit.log){
      console.log("delete=",edit.logo)
      formData.append('del_img',JSON.stringify(edit.logo))
    }
    
     formData.append('image',logo)
    

  }
  if(change.normal){
    let obj={name:data.name,email:data.email,phone:data.phone,businessName:data.businessName,businessType:data.businessType}
    formData.append('data',JSON.stringify(obj))
  }
  if(change.bank){
    console.log(data.banking)
    formData.append('bankDetails',JSON.stringify(data.banking))
  }
  if(change.address){
    formData.append("address",JSON.stringify(data.address))
  }
  try {
    dispatch(showLoading())
    const response=await axiosInstance.put(`/admin/updateseller/${id}`,formData,{
    headers:{"Content-Type":'multipart/form-data'}
    })
    console.log(response)
    toast.success(response?.data?.message)
    navigate('/Admin/sellers')
  } catch (error) {
    console.log(error)
  }finally{
    dispatch(hideLoading())
  }

  console.log(anychangCheck())
   
 }
  console.log("error =", errors);

  const nextSection=(section)=>{
  const sectionOrder = ["Personal", "business", "address", "banking"];
  const currentIndex = sectionOrder.indexOf(activeTab);
  const sectionIndex=sectionOrder.indexOf(section);
  console.log("currentIndex=",currentIndex)
  console.log("sectionIndex=",sectionIndex)
  
    console.log('inside the next section')
    console.log("section=",section,)
    console.log("Active=",activeTab,)
    console.log()
    if(sectionIndex <= currentIndex){
      setActiveTab(section)
      return null
    } 
             if(validateSection(activeTab)){
      setActiveTab(section)
    
    }
   

  }
  useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleNext(); // same logic as button click
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [activeTab]);
         
  const handleNext = () => {
  if (validateSection(activeTab)) {
    if (activeTab === 'Personal') {
      setActiveTab('business');
    } else if (activeTab === 'business') {
      setActiveTab('address');
    } else if (activeTab === 'address') {
      setActiveTab('banking');
    }
  }
};


  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800">
              Seller Registration
            </h2>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex divide-x divide-gray-200">
              <button
                onClick={()=>nextSection('Personal')}
                className={`flex-1 py-4 px-4 text-center text-sm font-medium ${
                  activeTab === "Personal"
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                Personal Info
              </button>
              <button
                onClick={()=>nextSection('business')}
                className={`flex-1 py-4 px-4 text-center text-sm font-medium ${
                  activeTab === "business"
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                Business Info
              </button>
              <button
                onClick={()=>nextSection('address')}
                className={`flex-1 py-4 px-4 text-center text-sm font-medium ${
                  activeTab === "address"
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                Address
              </button>
              <button
                onClick={()=>nextSection("banking")}
                className={`flex-1 py-4 px-4 text-center text-sm font-medium ${
                  activeTab === "banking"
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                Banking
              </button>
            </nav>
          </div>

          <form onSubmit={id? handleEditSubmit: handleSubmit} className="p-6">
            {/* Business Information Section */}
            {activeTab === "Personal" && (
              <div className="space-y-6">
                <div className="grid-cols-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                     value={data.name}
                      onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3
                             ${
                               errors?.name
                                 ? "border-2 border-red-500 focus:border-red-500 focus:ring-red-500"
                                 : "border border-gray-300"
                             }
                             focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="email"
                      onChange={handleChange}
                      value={data.email}
                      className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3
                             ${
                               errors?.email
                                 ? "border-2 border-red-500 focus:border-red-500 focus:ring-red-500"
                                 : "border border-gray-300"
                             }
                             focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone no<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="phone"
                      onChange={handleChange}
                      value={data.phone}
                      className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3
                             ${
                               errors?.mobile
                                 ? "border-2 border-red-500 focus:border-red-500 focus:ring-red-500"
                                 : "border border-gray-300"
                             }
                             focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                  </div>
                </div>
              </div>
            )}
            {activeTab === "business" && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-700">
                  Business Information
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="businessName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Business Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="businessName"
                      name="businessName"
                      value={data.businessName}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 ${
                        errors?.businessName
                          ? "border-2 border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border border-gray-300"
                      } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="businessType"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Business Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="businessType"
                      name="businessType"
                      value={data.businessType}
                      onChange={handleChange}
                      className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 ${
                        errors.businessType
                          ? "border-2 border-red-500 focus:border-red-500 focus:ring-red-500"
                          : ""
                      } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    >
                      <option value="">Select business type</option>
                      <option value="Sole Proprietorship">
                        Sole Proprietorship
                      </option>
                      <option value="Partnership">Partnership</option>
                      <option value="LLC">LLC</option>
                      <option value="Corporation">Corporation</option>
                      <option value="Nonprofit">Nonprofit</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Business Logo
                  </label>
                  <div className="mt-1 flex items-center">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Business logo preview"
                        className="h-16 w-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-xs">No logo</span>
                      </div>
                    )}
                    <label
                      htmlFor="logo"
                      className="ml-4 cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <span>Upload Logo</span>
                      <input
                        id="logo"
                        name="logo"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="sr-only"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Address Section */}
            {activeTab === "address" && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-700">
                  Business Address
                </h3>

                <div>
                  <label
                    htmlFor="address.street"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="street"
                    name="address.street"
                    value={data.address.street}
                    onChange={handleChange}
                    className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                      errors.street
                        ? "border-2 border-red-500 focus:border-red-500 focus:ring-red-500"
                        : ""
                    }`}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label
                      htmlFor="address.city"
                      className="block text-sm font-medium text-gray-700"
                    >
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="address.city"
                      value={data.address.city}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                        errors.city
                          ? "border-2 border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border border-gray-300"
                      }`}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="address.district"
                      className="block text-sm font-medium text-gray-700"
                    >
                      District
                    </label>
                    <input
                      type="text"
                      id="district"
                      name="address.district"
                      value={data.address.district}
                      onChange={handleChange}
                      className={`mt-1 block w-full ${
                        errors.district
                          ? "border-2 border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border border-gray-300"
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="address.state"
                      className="block text-sm font-medium text-gray-700"
                    >
                      State/Province <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="address.state"
                      value={data.address.state}
                      onChange={handleChange}
                      className={`mt-1 block w-full ${
                        errors.state
                          ? "border-2 border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border border-gray-300"
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="address.country"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Country <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="country"
                      name="address.country"
                      value={data.address.country}
                      onChange={handleChange}
                      className={`mt-1 block w-full ${
                        errors.country
                          ? "border-2 border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border border-gray-300"
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="address.pin"
                      className="block text-sm font-medium text-gray-700"
                    >
                      PIN Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="pin"
                      name="address.pin"
                      value={data.address.pin}
                      onChange={handleChange}
                      className={`mt-1 block w-full ${
                        errors.pin
                          ? "border-2 border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border border-gray-300"
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Banking Details Section */}
            {activeTab === "banking" && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-700">
                  Banking Details
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="banking.accountName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Account Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="accountName"
                      name="banking.accountHolderName"
                      value={data.banking.accountHolderName}
                      onChange={handleChange}
                      className={`mt-1 block w-full ${
                        errors.accountName
                          ? "border-2 border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border border-gray-300"
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="banking.accountNumber"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Account Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="accountNumber"
                      name="banking.accountNumber"
                      value={data.banking.accountNumber}
                      onChange={handleChange}
                      className={`mt-1 block w-full ${
                        errors.accountNumber
                          ? "border-2 border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border border-gray-300"
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="banking.bankName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Bank Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="bankName"
                      name="banking.bankName"
                      value={data.banking.bankName}
                      onChange={handleChange}
                      className={`mt-1 block w-full ${
                        errors.bankName
                          ? "border-2 border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border border-gray-300"
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="banking.branch"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Branch
                    </label>
                    <input
                      type="text"
                      id="branch"
                      name="banking.branch"
                      value={data.banking.branch}
                      onChange={handleChange}
                      className={`mt-1 block w-full ${
                        errors.branch
                          ? "border-2 border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border border-gray-300"
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="banking.ifscCode"
                    className="block text-sm font-medium text-gray-700"
                  >
                    IFSC/SWIFT Code
                  </label>
                  <input
                    type="text"
                    id="ifscCode"
                    name="banking.ifscCode"
                    value={data.banking.ifscCode}
                    onChange={handleChange}
                    className={`mt-1 block w-full ${
                      errors.ifscCode
                        ? "border-2 border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border border-gray-300"
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8">
              {activeTab !== "Personal" && ( 
                <button
                  type="button"
                  onClick={() =>{
                    if(activeTab==='banking'){
                      setActiveTab('address')
                    }else if(activeTab==='address'){
                      setActiveTab('business')
                    }else{
                      setActiveTab('Personal')  
                    }
                  }}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Previous
                </button>
              )}

              {activeTab !== "banking" && (
                <button
                  type="button"
                  // onClick={() => {
                  //   if (validateSection(activeTab)) {
                  //     console.log(validateSection(activeTab))
                  //     console.log(activeTab)
                  //    if(activeTab === 'Personal'){
                  //     console.log("inside the activeTab")
                  //     setActiveTab('business')
                  //    } else if(activeTab === 'business'){
                  //     setActiveTab('address')
                  //    }else if(activeTab==='address'){
                  //     setActiveTab('banking')
                  //    }
                  //   }
                  // }}
                   onClick={handleNext}
                  className="ml-auto inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Next
                </button>   
              ) }
              {
                activeTab==='banking' &&
               (
                <button
                  type="submit"
                  className="ml-auto inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                 {id?"Update":" Submit Registration"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Seller_reg;
