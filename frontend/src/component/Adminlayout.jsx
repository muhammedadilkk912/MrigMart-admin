import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu,Store } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import Spinner from './Spinner'
import { useSelector } from 'react-redux';
import Alert from './alert'


const AdminLayout = () => {
  const navigate=useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openalert,setOpenalert]=useState(false)
  const [dropdown,setDropdown]=useState(false)
  const loading=useSelector((state)=>state.loading.isLoading)
  console.log("laoding state=",loading)
                  console.log("inside the button",openalert)


  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Updated with standard dark color */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-800 text-white transition-all duration-300 ease-in-out`}>
        <div className="p-4 flex items-center justify-between border-b border-gray-700">
          {sidebarOpen && (
            <h1 className="text-xl font-bold">Admin Panel</h1>
          ) }
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-lg hover:bg-gray-700"
          >
            <Menu className='h-6 w-6'/>
            {/* {sidebarOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )} */}
          </button>
        </div>
        
        <nav className="mt-4">
          <NavItem icon="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
                text="Dashboard" exact
                 path=''  sidebarOpen={sidebarOpen} />
          <NavItem icon="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" 
                text="Users"   sidebarOpen={sidebarOpen} path='/users'/>
          <NavItem icon= "m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7 M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8 M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4 M2 7h 20 M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7"
                text="sellers" sidebarOpen={sidebarOpen} path='/sellers' />
          <NavItem icon="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z M12 22V12 M3.29 7 12 12 20.71 7 M7.5 4.27l9 5.15"
 
                text="Products" sidebarOpen={sidebarOpen} path='/products' />
          <NavItem icon= "M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-.5 M16 4h2a2 2 0 0 1 1.73 1 M8 18h1 M21.378 12.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"
 
                text="orders" sidebarOpen={sidebarOpen} path='/orders' />
          <NavItem icon= "M15.536 11.293a1 1 0 0 0 0 1.414l2.376 2.377a1 1 0 0 0 1.414 0l2.377-2.377a1 1 0 0 0 0-1.414l-2.377-2.377a1 1 0 0 0-1.414 0z M2.297 11.293a1 1 0 0 0 0 1.414l2.377 2.377a1 1 0 0 0 1.414 0l2.377-2.377a1 1 0 0 0 0-1.414L6.088 8.916a1 1 0 0 0-1.414 0z M8.916 17.912a1 1 0 0 0 0 1.415l2.377 2.376a1 1 0 0 0 1.414 0l2.377-2.376a1 1 0 0 0 0-1.415l-2.377-2.376a1 1 0 0 0-1.414 0z M8.916 4.674a1 1 0 0 0 0 1.414l2.377 2.376a1 1 0 0 0 1.414 0l2.377-2.376a1 1 0 0 0 0-1.414l-2.377-2.377a1 1 0 0 0-1.414 0z"
 
                text="category" sidebarOpen={sidebarOpen} path='/category' />
          <NavItem icon="M11.5 15H7a4 4 0 0 0-4 4v2 M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z M10 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"
 
                text="Profile" sidebarOpen={sidebarOpen} path='/profile' />
          <NavItem icon="M6 3h12l4 6-10 13L2 9Z M11 3 8 9l4 13 4-13-3-6 M2 9h20"
 
                text="Banner" sidebarOpen={sidebarOpen} path='/banner' />
          <NavItem icon="M21 6h-2v9H6v2h12l3 3V6zm-4 5V3H3v14l4-4h10z"
 
                text="Reviews" sidebarOpen={sidebarOpen} path='/reivews' />
        </nav>
         {/* "M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z M12 22V12"/><polyline points="3.29 7 12 12 20.71 7"/><path d="m7.5 4.27 9 5.15"/></svg> */}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              {/* <div className="flex items-center">
                <img 
                  src="https://randomuser.me/api/portraits/women/44.jpg" 
                  alt="User" 
                  className="h-8 w-8 rounded-full object-cover"
                  onClick={()=>setDropdown(!dropdown)}
                />
                <span className="ml-2 text-sm font-medium text-gray-700" >Admin User</span>
                </div>
                {
                  dropdown&&(
                     <div className='w-10 py-3'>
                  <ol>
                    <li className='red'>Logout</li>
                    <li >profile</li>

                  </ol>

                </div>

                  )
                } */}
                <div className="relative" >
      <div 
        className="flex items-center cursor-pointer"
        onClick={() => setDropdown(!dropdown)}
      >
        <img 
          src="https://randomuser.me/api/portraits/women/44.jpg" 
          alt="User" 
          className="h-8 w-8 rounded-full object-cover"
        />
        {/* <span className="ml-2 text-sm font-medium text-gray-700">Admin User</span> */}
      </div>

      {dropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100">
          <ol>
            <li>
              <button
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                onClick={() =>{ navigate('/admin/profile')
                  setDropdown(false)}
                }
              >
                Profile
              </button>
            </li>
            <li>
              <button
                className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                 onClick={()=>{setOpenalert(true)
                  setDropdown(false)
                 }}
              >
                Logout
              </button>
            </li>
          </ol>
        </div>
      )}
    </div>
               
              
            </div>
          </div>
        </header>

        {/* Content */}
       
        <main className="flex-1 overflow-y-auto p-4 bg-gray-100 ">
         
          <Outlet />
        </main>
         {loading&&<Spinner/>}
         {
          loading&&console.log("outside the spinner")
         }

         {
          openalert&&(
            <Alert onConfirm={setOpenalert}/>

          )
         }
        
      </div>
    </div>
  );
};

const NavItem = ({ icon, text,path, sidebarOpen,closeSidebar,exact }) => {


  return (
   <NavLink
      to={`/admin${path}`}
      onClick={closeSidebar}
       end={exact}
      className={({ isActive }) =>
        `flex gap-3 items-center  mx-2 my-1 py-5 rounded-lg cursor-pointer transition-colors duration-200 
        ${isActive ? 'bg-gray-700 text-white' : 'hover:bg-gray-700'}`
      }
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
      </svg>
      {sidebarOpen && <span className="ml-3">{text}</span>}
    </NavLink>

  );
};

export default AdminLayout;    