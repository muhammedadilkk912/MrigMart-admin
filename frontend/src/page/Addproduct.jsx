import { useState, useEffect } from "react";
import axiosInstance from "../configure/axios";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/loadeSlic";
import { toast } from "react-toastify";
import {useNavigate, useParams} from 'react-router-dom'
const Addproduct = () => {
  const {id}=useParams()
  const navigate=useNavigate()
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    category: "",
    // images: [],
    status: "",
    price: "",
    discount: "",
    stock: "",
  });
  const [editproduct,setEditproduct]=useState()
  const [category, setCategory] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedcategory, setSelectedCategory] = useState();
  const [dynamicfields, setDynamicfields] = useState({});
  const [deleteimage,setDeleteImage]=useState([])
  console.log("edit id",id)   

  console.log("images=", images);

  useEffect(() => {
    getcategory();
    if(id){
      getproducts()
    }

  }, []);

  const getproducts=async()=>{
    try {
      dispatch(showLoading())
      console.log("inside the getproducts")
      const response=await axiosInstance.get(`/admin/getproduct/${id}`)
            console.log("respone in get product=",response)

      let data=response.data.product
      setEditproduct(data)
     setProduct({
      name:data.name,
      description:data.description,
      price:data.price,     
      discount:data.discount,
      category:data.category,
      status:data.status,
      stock:data.stock
     });

      setImages(data.images)
      setPreviewImages(data.images)
      setSelectedCategory(data.core_details)
      
    } catch (error) {
      console.log("error in getting product=",error)
      
    }finally{
      dispatch(hideLoading())
    }
  }





  const getcategory = async () => {
    try {
      dispatch(showLoading());
      const response = await axiosInstance.get("/admin/getcategory");
      console.log(response);
      setCategory(response.data.category);
    } catch (error) {
      console.log("error in getting category", error);
    } finally {
      console.log(category);
      dispatch(hideLoading());
    }
  };

  const dynamic_change = (name, value) => {
    // const {name,value}=e.target
    // console.log(name,value)
    setDynamicfields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  console.log("dynamic fields=", dynamicfields);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log("category=",value)
    setProduct({ ...product, [name]: value });
  };
  const handleImageUpload = (e) => {
  const files = Array.from(e.target.files);
  const existingImages = images;

  // Max image limit check
  if (files.length + existingImages.length > 5) {
    toast.warning("You can upload a maximum of 5 images.");
    return;
  }

  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const imageSizeLimit = 2 * 1024 * 1024; // 2MB

  const validNewFiles = files.filter((newFile) => {
    const isDuplicate = images.some(
      (existing) =>
        existing.name === newFile.name && existing.size === newFile.size
    );
    const isValidType = allowedTypes.includes(newFile.type);
    const isValidSize = newFile.size <= imageSizeLimit;

    if (!isValidType) {
      toast.error(`Invalid file type: ${newFile.name}`);
      return false;
    }

    if (!isValidSize) {
      toast.error(`File too large (max 2MB): ${newFile.name}`);
      return false;
    }

    return !isDuplicate;
  });

  if (validNewFiles.length === 0) {
    toast.warning("No valid images to upload (check type, size, or duplicates).", {
      position: "top-center",
      autoClose: 3000,
    });
    return;
  }

  const newImages = [...existingImages, ...validNewFiles];
  const newPreviews = [
    ...previewImages,
    ...validNewFiles.map((file) => URL.createObjectURL(file)),
  ];

  setImages(newImages);
  setPreviewImages(newPreviews);
};

  const removeImage = (img,index) => {
    // const newImages = [...images];
    // const newPreviews = [...previewImages];
    let newImages=images.filter(val=>val!==img)
    console.log("new images=",newImages)

    // newImages.splice(index, 1);
    // newPreviews.splice(index, 1);


    setImages(newImages);
    setPreviewImages(newImages);
    setDeleteImage([...deleteimage,img])
  };

  // const handleSubmitFirstSection = (e) => {
  //   e.preventDefault();

  //   // Simulate fetching related products based on category
  //   const related = sampleRelatedProducts[product.category] || [];
  //   setRelatedProducts(related);
  // };

  const handleNext = () => {
    const validate = validation();
    console.log("validate=",validate)
    console.log(product)
    console.log(editproduct)

    
    if (validate) {
      const selected = category.find(
        (val) => val._id === product.category
      );
      
      console.log("se;ect=", selected);
      setSelectedCategory(selected);
      console.log(editproduct?.category,"=",product?.category)
      if(id&&editproduct?.category==product.category){
        setDynamicfields(editproduct?.core_details)
      }else{
       setDynamicfields({});
      }
          

      setStep(step + 1);
    }
  };
  console.log("selecced category",selectedcategory)

  const validation = () => {
        const priceRegex = /^\d+$/;

    console.log(product)
    let isValid = true;

    if (!product.name.trim()) {
      toast.error("Name is required");
      return (isValid = false);
    }

    if (!product.description.trim()) {
      toast.error("Description is required");
      return (isValid = false);
    }

    if (!product.category.trim()) {
      toast.error("Category is required");
      return (isValid = false);
    }
    if (typeof(product.stock)=='string'&&!product.stock.trim()) {
        toast.error("stock is required");
        return (isValid = false);
      } else if (!priceRegex.test(product.stock)) {
        toast.error("stock must be number");
        return (isValid = fasle);
      }

    if (product.price === "" || typeof(product.price)=='string'&&!product.price.trim()) {
    console.log("inside ")
      toast.error("Price is required");
      return (isValid = false);
    } else {
      const priceRegex = /^\d+$/;
      if (!priceRegex.test(product.price)) {
        toast.error("Price must be numbers");
        return (isValid = false);
      }
    }

    // if (typeof(product.discount)=='string'&&!product.discount?.trim()) {
    //      toast.error("discount is required")
    //      return isValid=false
        
    //     }

      if (!priceRegex.test(product.discount)) {
        toast.error("Discount must be a number");
        return (isValid = false);
      } else if (
        parseInt(product.discount) < 0 ||
        parseInt(product.discount) > 99
      ) {
        toast.error("Discount must be between 1 and 99");
        return (isValid = false);
      }

      
      if (!product.status.trim()) {
        toast.error("Status is required");
        return (isValid = false);
      }
   
    if (images.length < 3) {
      toast.error("image atleast 3 is needed ");
      return (isValid = false);
    } else if (images.length > 5) {
      toast.error("maximum 5 is allowed");
      return (isValid = false);
    }

    return isValid;
  };

  const dynamicvalidation = () => {
    let isValid = true;

    if (Object.keys(dynamicfields).length === 0) {
      toast.error("all field is required");
      return (isValid = false);
    }
    for (let key in dynamicfields) {
      console.log(key,"=",dynamicfields[key])
      if (!dynamicfields[key].trim()) {
        toast.error("every field is reauired");
        return (isValid = false);
      }
    }
    return isValid;
  };

  const handlesubmit = async (e) => {
    e.preventDefault();

    const dynamicvalidate = dynamicvalidation();
    console.log("check=", dynamicvalidate);

    

    console.log("Final product data:", dynamicfields);
    if (dynamicvalidate) {
      const formData = new FormData();
      formData.append("product", JSON.stringify(product));
      formData.append("dynamicfields", JSON.stringify(dynamicfields));
      images.forEach((image, index) => {
        formData.append(`images`, image);
      });
      console.log("produt=", product);
      console.log("iamges=", images);
      console.log(dynamicfields);
      console.log("images", formData);

      try {
        dispatch(showLoading())
        // const respone=await axiosInstance.post('/admin/addproduct',product)
        const response = await axiosInstance.post(
          "/admin/addproduct",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );  
        console.log("respone in add product=", response);
        navigate('/Admin/products')
         toast.success('product added successfully')

      } catch (error) {
        console.log("error in handle submit=", error);
      }finally{
         dispatch(hideLoading())
      }

    }
    // Here you would typically send the data to your backend
  };

  // hanlde edit submit
  const handleEditSubmit=async(e)=>{
    e.preventDefault()
    const dynamicvalidate=dynamicvalidation()
    console.log("dynamic validation=",dynamicvalidate)

    const changes= changeschecking()
    console.log("any chnages",changes)
    console.log("images=",images)
    console.log("already images=",editproduct?.images)

    const imageschanges=img_changes()  
    console.log("changed images=",imageschanges)
    console.log("deleteiamge=",deleteimage)
    if(!changes&&imageschanges.length===0){
     return  toast.warning("no changes are made")
    }
    let uploadimage=images.filter((val)=>typeof(val)!=='string')
    console.log("uploadimage=",uploadimage)  
    const formData=new FormData() 
    if(changes){
      console.log("insidee teh changes",product,"=",dynamicfields)  
     formData.append('product', JSON.stringify(product));
formData.append('dynamicfields', JSON.stringify(dynamicfields));


    }
    if(uploadimage.length>0){
      uploadimage.forEach((image,index)=>{
        formData.append('images',image)
      })
    }

    console.log("image",formData.images)
    if(deleteimage.length>0){
     deleteimage.forEach((id) => {
  formData.append('deleteimage[]', id); // note the `[]` hinting at array
});
    }

   

    try {
     
      dispatch(showLoading())
      const response=await axiosInstance.put(`/admin/updatedproduct/${id}`,formData,{
        headers:{'Content-Type':'multipart/form-data'}
      })
      console.log(response)
      navigate('/Admin/products')  
        
    } catch (error) {
      console.log("updating product=",error)
      
    }finally{
      dispatch(hideLoading())
    }


    // console.log(product,"=",editproduct)
     console.log(editproduct)

    
  }
  const changeschecking=()=>{
    const basicFields = ['name', 'description', 'price', 'discount', 'category', 'status', 'stock'];
     const basicChanges = basicFields.some(field => {
    // Handle number/string comparison
    console.log(product[field],"=",editproduct[field])
    return String(product[field]) !==String(editproduct[field]);   
  });

  // Compare dynamic fields (if in edit mode)
  const dynamicChanges = editproduct.core_details && 
    Object.keys(dynamicfields).some(key => {
      return String(editproduct.core_details[key]) !== String(dynamicfields[key]);
    });


  return basicChanges ||  dynamicChanges 
  }
  const img_changes = () => {
  const check = images.filter((val, ind) => val !== editproduct.images[ind]);
  return check;
};

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

      <div className="mb-8 flex justify-center">
        <div className="flex items-center relative w-full max-w-xs">
          {" "}
          {/* Container with defined max-width */}
          {/* Step 1 */}
          <div className="flex flex-col items-center z-10 ">
            <div
              className={`w-12 h-12 flex justify-center items-center rounded-full  ${
                step === 1 ? "border-blue-600" : " border-gray-500"
              } ${
                step > 1 ? "bg-green-500 border-none " : "bg-white border-2"
              } `}
            >
              {step > 1 ? (
                <svg
                  className="w-7 h-7  text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="4"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <span>1</span>
              )}
            </div>
            <span className="text-sm mt-1">Basic info</span>
          </div>
          {/* Connecting line - positioned absolutely */}
          <div className="absolute top-0 left-1/2 right-1/2 mx-auto w-[200px] md:w-[300px]   -translate-x-1/2">
            <div
              className={`h-1 ${
                step > 1 ? "bg-green-500" : "bg-gray-400"
              } relative top-6`}
            ></div>
          </div>
          {/* Step 2 */}
          <div className="flex flex-col items-center z-10 ml-auto ">
            <div
              className={`w-12 h-12 flex justify-center  items-center rounded-full ${
                step === 2 ? "border-blue-600" : " border-gray-500"
              }  ${
                step > 2 ? "bg-green-500 border-none " : "bg-white border-2"
              } `}
            >
              {step > 2 ? (
                <svg
                  className="w-7 h-7 font-extrabold text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="4"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <span>2</span>
              )}
            </div>
            <span className="text-sm mt-1">Details</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Product Details</h2>
        <form onSubmit={id?handleEditSubmit:handlesubmit}>
          {step === 1 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={product.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Description */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={product.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Category */}
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={product.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a category</option>
                  {category?.map((cat, index) => (
                    <option key={index} value={cat._id}>{cat.category}</option>
                  ))}
                </select>
              </div>

              {/* stock */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="stock"
                  value={product.stock}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="price"
                  value={product.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Discount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount (%)
                </label>
                <input
                  type="text"
                  name="discount"
                  value={product.discount}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* status */}
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="Active"
                      checked={product.status === "Active"}
                      onChange={handleInputChange}
                      className="text-blue-500"
                    />
                    <span className="ml-2">Active</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="Inactive"
                      checked={product.status === "Inactive"}
                      onChange={handleInputChange}
                      className="text-blue-500"
                    />
                    <span className="ml-2">Inactive</span>
                  </label>
                </div>
              </div>

              {/* Image Upload */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Images (3-5) <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-4 mb-4">
                  {previewImages.map((img, index) => (
                    <div key={index} className="relative">
                      <img
                        src={img}
                        alt={`Preview ${img}`}
                        className="h-24 w-24 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(img,index)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <input
                  type="file"  
                   accept="image/png, image/jpeg,image/jpg,image/webp"
                  // accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-gray-500
             file:mr-4 file:py-2 file:px-4
             file:rounded-md file:border-0
             file:text-sm file:font-semibold
           file:bg-blue-50 file:text-blue-700
           hover:file:bg-blue-100"
                />

                <p className="mt-1 text-sm text-gray-500">
                  Upload at least 3 images (max 5)
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selectedcategory?.specific_fields?.map((val) => {
                if (val.type === "select") {
                  return (
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {val.name} <span className="text-red-500">*</span>
                      </label>
                      <select
                        // name={dynamicfields[val.name] }
                        value={dynamicfields[val.name]}
                        onChange={(e) =>
                          dynamic_change(val.name, e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">
                          {val?.placeholder || "kndkfnadj"}
                        </option>
                        {val.Options?.map((opt, index) => (
                          <option key={index}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  );
                }

                // <input type={val.type} />

                return (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {val.name  || 'with'}
                    </label>
                    <input
                      type={val.type}
                      // name={val.type}
                      value={dynamicfields[val.name] || ""}
                      placeholder="dkjfnkjas"
                      onChange={(e) => dynamic_change(val.name, e.target.value)}
                      min="0"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                );
              })}
            </div>
          )}

          {step === 1 ? (
            <div className="flex mt-6  justify-end">
              <button
                onClick={handleNext}
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Continue
              </button>
            </div>
          ) : (
            <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-400 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
               {id?"Update":" Submit"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Addproduct;
