import React, { useEffect, useState } from "react";
import { Plus, Search, ChevronDown, EllipsisVertical } from "lucide-react";
import axiosInstance from "../configure/axios";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/loadeSlic";
import { useNavigate }  from "react-router-dom";
import {useDebounce} from 'use-debounce'
import { 
  FiTrash2,
  FiEdit,
  FiEye,
  FiChevronRight,
  FiChevronLeft,
} from "react-icons/fi";
import Dialoge from "../component/Dialoge";

const Product = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [productOwnershipFilter, setProductOwnershipFilter] = useState('all');
  

  const [page, setPage] = useState(1);
  const [totalpage, setTotalpage] = useState();
  const [totalproducts, setTotalProducts] = useState();

  const [searchTerm, setSearchTerm] = useState("");
  const [datefilter, setDateFilter] = useState("");
  const [price, setPrice] = useState("");
  const [categoryfilter, setCategoryfilter] = useState("");
  const [debounceSearch]=useDebounce(searchTerm,600)

  useEffect(() => {
    getproducts();
  }, [page, datefilter,debounceSearch, price, categoryfilter,productOwnershipFilter]);
  useEffect(() => {
    getcategories();
  }, []);

  const getcategories = async () => {
    console.log("inside the category");
    try {
      const response = await axiosInstance.get("/admin/getcategories");
      // console.log("")
      setCategory(response.data.category);
    } catch (error) {
      console.log("error in get Categories");
    }
  };

  const getproducts = async () => {
    let url = `/admin/getproducts/${page}`;
    let params = [];
    if (searchTerm) {
      params.push(`search=${searchTerm}`);
    }
    if (datefilter) {
      params.push(`datefilter=${datefilter}`);
    }
    if (price) {
      params.push(`price=${price}`);
    }

    if (categoryfilter) {
      params.push(`category=${categoryfilter}`);
    }
    if(productOwnershipFilter){
      params.push(`show=${productOwnershipFilter}`)
    }

    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }
    console.log(url);
    console.log("inside the product =",productOwnershipFilter)
    try {
      dispatch(showLoading());
      const response = await axiosInstance.get(url);
      console.log("products=", response);
      setProducts(response.data.products);
      setTotalpage(response?.data?.totalPages);
      setTotalProducts(response?.data?.totalProducts);
    } catch (error) {
      console.log("error in getting pe=roducts=", error);
    } finally {
      dispatch(hideLoading());
    }
  };
  console.log("category=", category);
  console.log("categoryfilter=", categoryfilter);

  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const closeDropdown = () => {
    setOpenDropdownId(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => closeDropdown();
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // change status of the product
  const change_status = async (id, oldst, newsts) => {
    console.log("inside the status");

    if (oldst === newsts) return null;

    try {
      dispatch(showLoading());
      const response = await axiosInstance.put(
        `/admin/product/change_status/${id}/${newsts}`
      );
      getproducts();
      console.log("response=", response);
    } catch (error) {
      console.log("change status=", error);
    } finally {
      closeDropdown();
      dispatch(hideLoading());
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axiosInstance.delete(
        `/admin/product/delete/${id}`
      );
      getproducts();
    } catch (error) {
      console.log("error in delte user", error);
    }
  };

  //  const handledatefilter=()=>{
  //   console.log("date filter=",datefilter)
  //   if(datefilter==="") return null
  //   getproducts()
  //  }

  const getPageNumbers = () => {
    const pages = [];
    if (!totalpage) return pages;
    console.log("pages-1=", pages);
    if (totalpage <= 5) {
      for (let i = 1; i <= totalpage; i++) pages.push(i);
      console.log("pages=2=", pages);
    } else {
      if (page > 2) {
        pages.push(1);
        if (page > 3) pages.push("...");
        console.log("pages-3=", pages);
      }
      for (
        let i = Math.max(1, page - 1);
        i <= Math.min(totalpage, page + 1);
        i++
      ) {
        if ((i) => 1 && i < totalpage) pages.push(i);
        console.log("pages-4=", pages);
      }
      console.log("pages-5=", pages);
      if (page < totalpage - 1) {
        if (page < totalpage - 2) pages.push("...");
        pages.push(totalpage);
      }
      console.log("pages-4=", pages);
    }
    console.log("pagination array=", pages);
    return pages;
  };
  const gotopage = (newPage) => {
    console.log("new page =", newPage);
    if (newPage < 1 || newPage > totalpage) return;
    setPage(newPage);
  };

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-sm">
      <div className="flex flex-col gap-4">
        {/* Title and Add Button */}
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-semibold text-gray-800">Products</h1>
          <button
            onClick={() => navigate("/Admin/addproduct")}
            className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors text-sm"
          >
            Add Products
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Box */}
          <div className="flex items-center border border-gray-200 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200">
            <input
              type="text"
              placeholder="Search by product name..."
              className="w-full h-full outline-none mr-10 pl-4 py-2 text-sm text-gray-700"
              // Add these for functionality:
              // value={searchQuery}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {/* <button
              className="bg-gray-100 hover:bg-gray-200 ml-20 px-3 h-full flex justify-center items-center transition-colors duration-200"
              // Add this for functionality:
              // onClick={getproducts}
            > */}
              <Search className="w-6 h-6 mx-3 text-gray-500" />
            {/* </button> */}
          </div>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {/* Category Filter */}
            {category.length > 0 && (
              <div className="relative">
                <select
                  onChange={(e) => {
                    setCategoryfilter(e.target.value);
                    getproducts();
                  }}
                  className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">All category</option>
                  {category.map((val, index) => (
                    <option key={index} value={val._id}>
                      {val.category}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            )}

            {/* Date Filter */}
            <div className="relative">
              <select
                onChange={(e) => {
                  setDateFilter(e.target.value);
                  getproducts();
                }}
                className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="Newest">Date: Newest</option>
                <option value="Oldest">Date: Oldest</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Price Filter */}
            <div className="relative">
              <select
                onChange={(e) => {
                  setPrice(e.target.value);
                  getproducts();
                }}
                className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">Price: Default</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <div className="flex items-center gap-2">
  {/* Simple Toggle Button */}
  <div className="flex items-center">
   
    <button
      onClick={() => {
        setProductOwnershipFilter('all');
        // getproducts();
      }}
      
      className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-l-md border ${
        productOwnershipFilter === 'all'
          ? 'bg-blue-500 text-white border-blue-500'
          : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
      }`}
    >
      All products
    </button>
    <button
      onClick={() => {
        setProductOwnershipFilter('my');
        // getproducts();
      }}
     
      className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-r-md border ${
        productOwnershipFilter === 'my'
          ? 'bg-blue-500 text-white border-blue-500'
          : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
      }`}
    >
      my products
    </button>
  </div>
</div>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th></th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products?.map((val, index) => (
                <tr key={index}>
                  <th>{index + 1}</th>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 min-w-[200px]">
                      {/* Product Image with Error Handling */}
                      <div className="relative flex-shrink-0">
                        <img
                          src={val.images?.[0] || "/placeholder-product.png"}
                          alt={val.name}
                          className="object-cover w-10 h-10 rounded border border-gray-200"
                          onError={(e) => {
                            e.target.src = "/placeholder-product.png";
                            e.target.classList.add("object-contain", "p-1");
                          }}
                        />
                        {/* Status Indicator Dot */}
                        {val.status === "active" && (
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-white"></span>
                        )}
                      </div>

                      {/* Product Name with Responsive Truncation */}
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900 truncate max-w-[160px]">
                          {val.name}
                        </span>
                        {/* {val.name && (
                  <span className="text-xs text-gray-500">SKU: {val.name}</span>
                           )} */}
                      </div>
                    </div>
                  </td>

                  <td>{val.category.category}</td>
                  <td>{val.discountprice}</td>
                  <td>{val.stock}</td>
                  <td>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        val.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : val.status === "Inactive"
                          ? "bg-gray-400 text-white"
                          : val.status === "suspend"
                          ? "bg-orange-300 text-white font-medium"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {/* {val.status > 0 ? "In Stock" : "Out of Stock"} */}
                      {val.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex justify-center gap-1">
                      {/* <button
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md"
                       title="Edit"
                      // onClick={() => {
                       //   // Handle edit action
                    //   console.log("Edit product", val._id);
                     // }}
                   >
                 <FiEdit size={18} />
                      </button> */}

                      <button
                        className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-md"
                        title="View"
                        onClick={() => navigate(`/Admin/ProductDetailPage/${val._id}`)}
                      >
                        <FiEye size={18} />
                      </button>
                      
                      <button
                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-md"
                        title="View"
                        onClick={() =>
                          navigate(`/Admin/editproduct/${val._id}`)
                        }
                      >
                        <FiEdit size={18} />
                      </button>

                      <button
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-md"
                        title="Delete"
                        onClick={() => {
                          handleDelete(val._id);
                        }}
                        // onClick={() => {
                        //   // Handle delete action
                        //   console.log("Delete product", val._id);
                        // }}
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                  <td className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDropdown(val._id);
                      }}
                      className="p-1 hover:bg-gray-100 rounded-md"
                    >
                      <EllipsisVertical className="w-5 h-5" />
                    </button>

                    {openDropdownId === val._id && (
                      <div
                        className={`absolute right-0 ${index >= products.length -2 ? 'bottom-full mt-0': ''} mt-2 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-200`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="py-1">
                          {/* Active Option */}
                          <button
                            className={`flex items-center px-4 py-2 text-sm w-full text-left ${
                              val.status === "active"
                                ? "bg-blue-50 text-blue-600"
                                : "hover:bg-gray-100 text-gray-700"
                            }`}
                            onClick={(e) => {
                              change_status(val._id, val.status, "Active");
                              // Handle status change to active
                              console.log("Set to active", val._id);
                              closeDropdown();
                            }}
                          >
                            <span
                              className={`w-2 h-2 rounded-full mr-2 ${
                                val.status === "Active"
                                  ? "bg-blue-500"
                                  : "bg-gray-300"
                              }`}
                            ></span>
                            Active
                          </button>

                          {/* Suspend Option */}
                          <button
                            onClick={() => {
                              change_status(val._id, val.status, "suspend");
                            }}
                            className={`flex items-center px-4 py-2 text-sm w-full text-left ${
                              val.status === "suspend"
                                ? "bg-red-50 text-red-600"
                                : "hover:bg-gray-100 text-gray-700"
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full mr-2 ${
                                val.status === "Suspend"
                                  ? "bg-red-500"
                                  : "bg-gray-300"
                              }`}
                            ></span>
                            Suspend
                          </button>
                          <button
                            className={`flex items-center px-4 py-2 text-sm w-full text-left ${
                              val.status === "Inactive"
                                ? "bg-red-50 text-red-600"
                                : "hover:bg-gray-100 text-gray-700"
                            }`}
                            onClick={() => {
                              change_status(val._id, val.status, "Inactive");
                            }}
                          >
                            <span
                              className={`w-2 h-2 rounded-full mr-2 ${
                                val.status === "Inactvie"
                                  ? "bg-red-500"
                                  : "bg-gray-300"
                              }`}
                            ></span>
                            InActive
                          </button>

                          {/* Divider */}
                          <div className="border-t border-gray-200 my-1"></div>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr key={1}>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-gray-200">
        {/* Showing X to Y of Z items */}
        <div className="mb-4 sm:mb-0">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to{" "}
            <span className="font-medium">10</span> of{" "}
            <span className="font-medium">{totalproducts}</span> users
          </p>
        </div>

        {/* Pagination controls */}
        {totalpage > 1 && (
          <div className="flex items-center space-x-1">
            {/* Previous button (disabled) */}
            <button
              onClick={() => gotopage(page - 1)}
              disabled={page === 1}
              className={`px-3 py-1 border rounded-md text-sm font-medium ${
                page === 1
                  ? "border-gray-400 text-gray-400 cursor-not-allowed"
                  : "border-gray-700 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FiChevronLeft className="h-5 w-5" />
            </button>
            {/* <button className="px-3 py-1 border rounded-md text-sm font-medium bg-blue-50 border-red-500 text-blue-600">
                          {page}
                        </button> */}

            {getPageNumbers().map((p, idx) =>
              p === "..." ? (
                <span key={idx} className="px-2 text-gray-500">
                  ...
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => gotopage(p)}
                  className={`px-3 py-1 border rounded-md text-sm font-medium ${
                    page === p
                      ? "bg-blue-50 border-blue-500 text-blue-600"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {p}
                </button>
              )
            )}

            {/* Next button */}
            <button
              onClick={() => gotopage(page + 1)}
              disabled={page === totalpage}
              className={`px-3 py-1 border rounded-md text-sm font-medium ${
                page === totalpage
                  ? "border-gray-400 text-gray-400 cursor-not-allowed"
                  : "border-gray-700 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FiChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;
