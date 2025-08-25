import { useState, useEffect } from 'react';
import axiosInstance from '../configure/axios';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../redux/loadeSlic';
import Cropper from 'react-easy-crop';
import { toast } from 'react-toastify';
import { FaEdit, FaPlus, FaTimes, FaEye, FaCheck, FaBan } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { CiMenuKebab } from "react-icons/ci";

const Banner = () => {
  const dispatch = useDispatch();
  const [banners, setBanners] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newBanner, setNewBanner] = useState({
    image: null,
    link: '',
    isActive: true,
  });
  const [edit, setEdit] = useState(null);
  const [image, setImage] = useState(null);
  const [imageFile,setImageFIle]=useState(null)
  const [showCropModal, setShowCropModal] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [viewBanner, setViewBanner] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'active', 'inactive', 'pending'
  const [dropdown,setDropdown]=useState(null)
  const [product,setProduct]=useState()

  // Fetch existing banners
  useEffect(() => {
    fetchBanners();
  }, []);

  // Filter banners based on active tab
  const filteredBanners = banners.filter(banner => {
    if (activeTab === 'all') return true;
    return banner.status === activeTab.charAt(0).toUpperCase() + activeTab.slice(1);
  });

  // ... (keep all the existing functions like handleFileChange, onCropComplete, etc.)

  // Add this new function for viewing banner
  const handleView = (banner) => {
    setViewBanner(banner);
  };

  // Add this function for status update
  const updateBannerStatus = async (id, status) => {
    try {
      dispatch(showLoading());
      const response = await axiosInstance.put(`/admin/update_banner_status/${id}`, { status });
      toast.success(response.data.message);
      fetchBanners();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update banner status');
    } finally {
      dispatch(hideLoading());
    }
  };
  const fetchBanners = async () => {
    try {
      dispatch(showLoading());
      const response = await axiosInstance.get('/admin/existingbanners');
      setBanners(response.data.banner || []);
    } catch (err) {
      console.log(err);
      setError('Failed to fetch banners');
    } finally {
      getproducts()
      dispatch(hideLoading());
    }
  };

  const getproducts=async(req,res)=>{
    try {
      const response=await axiosInstance.get('/admin/banner/getproduct')
      console.log("banner",response)
      setProduct(response?.data?.product)
    } catch (error) {
      console.log(error)
      
    }
  }

  const handleFileChange = (e) => {
    let size=2*1024*1024 //2mb
    if(e.target.files[0].size > size){
      toast.warning('file should be less than  2mb')   
      return null

    }
     let typeFormat=['image/png','image/jpeg','image/jpg']
      if(!typeFormat.includes(e.target.files[0].type)){
        toast.warning('file format should be png or jpg')
        return null
      }
    setImageFIle(e.target.files[0])
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setImage(reader.result));
      setShowCropModal(true);
      reader.readAsDataURL(e.target.files[0]);
    }
  };
    const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const applyCrop = async () => {
    if (!image || !croppedAreaPixels) return;

    const croppedImg = await getCroppedImg(image, croppedAreaPixels);
    setNewBanner((prev) => ({
      ...prev,
      image: croppedImg,
    }));

    setShowCropModal(false);
  };
    const getCroppedImg = (imageSrc, crop) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext("2d");

        ctx.drawImage(
          image,
          crop.x,
          crop.y,
          crop.width,
          crop.height,
          0,
          0,
          crop.width,
          crop.height
        );

        resolve(canvas.toDataURL("image/png"));
      };

      image.onerror = (error) => reject(error);
    });
  };

  
  const handleDelete = async (id,image) => {
    console.log("id=",id)
    console.log("image=",image)
   
    // if (!window.confirm('Are you sure you want to delete this banner?')) return;

    try {
      dispatch(showLoading());
      const response = await axiosInstance.delete(`/admin/delete_banner/${id}?image=${encodeURIComponent(image)}`);
      toast.success(response?.data?.message);
      fetchBanners();
    } catch (err) {
      console.log(err);
      toast.error('Failed to delete banner');
    } finally {
      dispatch(hideLoading());
    }
  };
    const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newBanner.image) {
      toast.error('Image is required');
      return;
    }
    try {
      dispatch(showLoading());
      const formData= new FormData()
      console.log("image file",imageFile) 
      //  return null
      formData.append('image',imageFile )   
      formData.append('link',newBanner.link)
      formData.append('isActive',newBanner.isActive)
      const response = await axiosInstance.post('/admin/add_banner', formData,{
        headers:{'Content-Type':'multipart/form-data'}
      });
      toast.success(response?.data?.message);
      setShowForm(false);
      setNewBanner({ image: null, link: '', isActive: true });
      setImageFIle(null)
      fetchBanners();
    } catch (error) {
      console.log(error);
      toast.error('Failed to add banner');
    } finally {
      // setImageFIle(null)
      dispatch(hideLoading());
    }
  };

    const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewBanner({
      ...newBanner,
      [name]: type === 'checkbox' ? checked : value
    });
  };

    const resetForm = () => {
    setShowForm(false);
    setNewBanner({ image: null, link: '', isActive: true });
    setEdit(null);
    setImageFIle(null)
  };

    const editval = () => {
    return Object.keys(newBanner).some((val) => {
      return edit[val] !== newBanner[val];
    });
  };

  const handleEdit = (val) => {
    // console.log(")
    setNewBanner({ image: val.image, isActive: val.isActive, link: val.link });
    console.log("before editing=",val)
    console.log("new banner=",newBanner)
    setEdit(val);
    setShowForm(true);
  };

  const handleEditSubmit = async (e) => {
    console.log("new",newBanner)
    e.preventDefault();
    if (!editval()) {

      toast.warning('No changes detected');
      return;
    }
    // console.log(editval())
    const formdata=new FormData()
    if(newBanner.image !==edit.image){
    formdata.append('image',imageFile)
    console.log("inside the if condition")
    formdata.append('deleteImage',edit.image)
    }
   formdata.append('link',newBanner.link)
   formdata.append('isActive',newBanner.isActive)
    
    // return null
    try {
      dispatch(showLoading());
      const response = await axiosInstance.put(`/admin/update_banner/${edit._id}`, formdata,{
        headers:{'Content-Type':'multipart/form-data'}
      });
      toast.success(response?.data?.message);
      setShowForm(false);
      setNewBanner({ image: null, link: '', isActive: true });
      setEdit(null);
      setImageFIle(null)
      fetchBanners();
    } catch (error) {
      console.log("Error in edit banner:", error);
      toast.error('Failed to update banner');
    } finally {
      dispatch(hideLoading());
    }
  };

  const handleStatus=async(id,oldstatus,newstatus)=>{
    if(oldstatus === newstatus){
      setDropdown(null)
      return null
    }
    try {
       dispatch(showLoading());
      const response=await axiosInstance.put(`/admin/update/bannerstatus/${id}/${newstatus}`)
      console.log(response)
      toast.success(response?.data?.message)
      fetchBanners()
    } catch (error) {
      console.log(error)
    }finally{
       dispatch(hideLoading());
    }
  }


  return (
    <div className="container mx-auto px-4 py-8">
      {/* View Banner Modal */}
      {viewBanner && (
        <div className="fixed inset-0  backdrop-blur-lg flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Banner Preview</h2>
              <button
                onClick={() => setViewBanner(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/2">
                <img
                  src={viewBanner.image}
                  alt="Banner Preview"
                  className="w-full h-auto max-h-96 object-contain rounded-md"
                />
              </div>
              <div className="w-full md:w-1/2">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                    <p className="mt-1 text-sm text-gray-900 capitalize">{viewBanner.status.toLowerCase()}</p>
                  </div>
                  {viewBanner.link && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Link</h3>
                      <a 
                        href={viewBanner.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="mt-1 text-sm text-indigo-600 hover:underline block truncate"
                      >
                        {viewBanner.link}
                      </a>
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Created At</h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(viewBanner.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Crop Modal */}
      {showCropModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Crop Image</h2>
              <button
                onClick={() => setShowCropModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>

            <div className="relative w-full h-[400px] bg-gray-800 rounded-md overflow-hidden">
              {image && (
                <Cropper
                  image={image}
                  crop={crop}
                  zoom={zoom}
                  aspect={16 / 9}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              )}
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">Zoom:</span>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  onChange={(e) => setZoom(e.target.value)}
                  className="w-24"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCropModal(false);
                    setNewBanner((prev) => ({ ...prev, image: null }));
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={applyCrop}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                >
                  Apply Crop
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Banner Management</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            if (showForm) resetForm();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          {showForm ? (
            <>
              <FaTimes /> Cancel
            </>
          ) : (
            <>
              <FaPlus /> Add New Banner
            </>
          )}
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['all', 'active', 'inactive', 'pending'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} ({tab === 'all' ? banners.length : banners.filter(b => b.status.toLowerCase() === tab).length})
            </button>
          ))}
        </nav>
      </div>

      {/* ... (keep the add/edit form) */}
       {/* Add Banner Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {edit ? 'Edit Banner' : 'Add New Banner'}
          </h2>
          <form onSubmit={edit ? handleEditSubmit : handleSubmit}>
            <div className="grid grid-cols-1 gap-6">
              {/* Image Upload with Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Image *
                </label>
                <div className="flex flex-col items-start gap-4">
                  {newBanner.image ? (
                    <div className="relative group">
                      <img
                        src={newBanner.image}
                        alt="Banner Preview"
                        className="max-w-full h-48 object-contain border rounded-md shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setNewBanner(prev => ({
                          ...prev,
                          image: null
                        }))}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition"
                      >
                        <FaTimes className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center bg-gray-50">
                      <span className="text-gray-500">No image selected</span>
                    </div>
                  )}
                  <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md text-sm font-medium text-gray-700 transition">
                    Choose Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <div>
                     <p className="text-xs text-gray-500">
                    Recommended size: 1200x400px (will be cropped to 16:9 ratio)
                  </p>
                     <p className="text-xs text-gray-500">
                    only png and jpg formats are allowed
                  </p>
                  <p className='text-xs text-warning'>the imags size should be less than 2mb</p>

                  </div>
                 
                </div>
              </div>

              {/* Link */}
            <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Link (optional)
  </label>

  <select
    id="link"
    name="link"
    value={newBanner.link}
    onChange={(e) => setNewBanner({ ...newBanner, link: e.target.value })}
    className="mt-1 block w-full border pl-3 pr-10 py-2 text-base border-gray-300 
               focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 
               sm:text-sm rounded-md"
  >
    <option value="">
      {product?.length > 0 ? "Select a product" : "No products available"}
    </option>
    {product?.map((product) => (
      <option key={product._id} value={product._id}>
        {product?.name}
      </option>
    ))}
  </select>
</div>


              {/* Active Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={newBanner.isActive}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Active
                </label>
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <button
                type="submit"
                disabled={!newBanner.image}
                className={`px-4 py-2 text-white rounded-md transition ${
                  newBanner.image
                    ? 'bg-indigo-600 hover:bg-indigo-700'
                    : 'bg-indigo-400 cursor-not-allowed'
                }`}
              >
                {edit ? 'Update Banner' : 'Add Banner'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>

          {/* {error && <p className="mt-4 text-red-500">{error}</p>} */}
        </div>
      )}

      {/* Banners Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preview
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Link
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBanners.length > 0 ? (
                filteredBanners.map((banner,index) => (
                  <tr key={banner._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-16">
                          <img
                            className="h-10 w-16 object-cover rounded"
                            src={banner.image}
                            alt="Banner thumbnail"
                            onClick={() => handleView(banner)}
                            style={{ cursor: 'pointer' }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        banner.status === 'Active' ? 'bg-green-100 text-green-800' :
                        banner.status === 'Inactive' ?' bg-gray-200 text-gray-800':
                        banner.status === 'Reject' ? 'bg-red-200 text-red-800':
                        banner.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {banner.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {banner.link ? (
                        <a 
                          href={banner.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:underline truncate max-w-xs block"
                        >
                          {banner.link}
                        </a>
                      ) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(banner.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleView(banner)}
                          className="text-indigo-600 hover:text-indigo-900 p-1"
                          title="View"
                        >
                          <FaEye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(banner)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Edit"
                        >
                          <FaEdit className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={() => handleDelete(banner._id,banner.image)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete"
                        >
                          <MdDelete className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() =>{
                            setDropdown(dropdown === index ?null :index)
                          }}
                          className="text-gray-600 relative hover:text-red-900 p-1"
                          title="Delete"
                        >
                           <CiMenuKebab className="h-6 w-6" />
                          {
                           dropdown === index &&(
                            <div className={` bg-white absolute z-30 ${index > banners.length-2 ? 'bottom-full' :''} right-2 w-24 shadow-lg flex flex-col  rounded-md border border-gray-300`}>
                            <button 
                            className='border-b border-gray-300 px-1 py-1 hover:bg-gray-100'
                             onClick={()=>
                              handleStatus(banner._id,banner.status,"Active")

                             }
                            type="button">
                              Active
                            </button>
                            <button 
                             className='border-b border-gray-300 py-1 px-1 hover:bg-gray-100'
                             onClick={()=>handleStatus(banner._id,banner.status,"Inactive")}
                            type="button">
                              INACTIVE
                            </button>
                            <button 
                             className='border-b border-gray-300 py-1 px-1 hover:bg-gray-100'
                            onClick={()=>handleStatus(banner._id,banner.status,"Reject")}
                            type="button text-red-700 ">
                              REJECT
                            </button>

                          </div>
                           )
                        }
                         
                          
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    No banners found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Banner;