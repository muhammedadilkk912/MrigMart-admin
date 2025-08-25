import React from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../configure/axios'
import { useDispatch } from 'react-redux';
import { setAuthentication } from '../redux/authSlice';
const Alert = ({ 
  isOpen=true, 
  onConfirm, 
  title = "Logout Confirmation",
  message = "Are you sure you want to logout?",
  confirmText = "Logout",
  cancelText = "Cancel"
}) => {   
  const dispatch=useDispatch() 
  const navigate=useNavigate()
  if (!isOpen) return null;
  const naviagate=useNavigate()
  const onCancel=()=>{
    onConfirm(false)
    
  }    
   onConfirm=async()=>{
    try {
      
       const response=await axiosInstance.post('/Admin/logout')
       console.log("response in logout",response)
       navigate('/')
       dispatch(setAuthentication(false))
      

      // console.log(response)
    } catch (error) {
      console.log("error in logout ",error);
      
      
    }
  }

  return (
    <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

// LogoutAlert.propTypes = {
//   isOpen: PropTypes.bool.isRequired,
//   onConfirm: PropTypes.func.isRequired,
//   onCancel: PropTypes.func.isRequired,
//   title: PropTypes.string,
//   message: PropTypes.string,
//   confirmText: PropTypes.string,
//   cancelText: PropTypes.string
// };   

export default Alert;