


import React from 'react'

const Spinner = () => {
  console.log("inside the spinner")
  return (
  
      <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Semi-transparent backdrop with slight blur */}
      <div className="absolute inset-0  backdrop-blur-sm"></div>
      
      {/* Spinner */}
      <div className="relative z-10">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
      
    
  )
}

export default Spinner


