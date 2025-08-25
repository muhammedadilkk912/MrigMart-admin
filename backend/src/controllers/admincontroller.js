const express = require("express");
const sellerModel = require("../models/seller.model");
const userModel = require("../models/user");
const mongoose = require("mongoose");
const categoryModel = require("../models/category.model");
const getDateRange = require("../utils/datefilte");
const productModel = require("../models/product.model");
const bcrypt = require("bcrypt");
const Cloudinary = require("../config/Cloudinaryconfig");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/nodemailer");
const uploadClodinary = require("../middleware/cloudinary");
const generateRandomFourDigit = require("../middleware/otpgenerator");
const getPublicIdFromUrl = require("../utils/ExtractPublicid");
const bannerModel =require('../models/banner.model')
const orderModel =require('../models/order.model')
const reviewModel =require( '../models/review.model')
const  calculateDeliveryDate =require('../utils/deliveryDate')



const dashboard = (req, res) => {
  res.status(200).json({ message: "access successfull" });
};

const getsellers = async (req, res) => {
  console.log("inide");
  const { page } = req.params;
  const skip = (page - 1) * 10;
  const { search, status, date } = req.query;
  console.log("inside the sellers=", req.query, req.params);
  let query = {};

  try {
    if (search) {
      query.$or = [
        { businessName: { $regex: search, $options: "i" } },
        { businessType: { $regex: search, $options: "i" } },
      ];
    }
    if (status) {
      console.log("inside the sellers");

      query.status = status;
    }
    if (date) {
      let dataranges = getDateRange(date);
      console.log("date ranges=", dataranges);

      query.createdAt = { $gte: dataranges.startDate, $lt: dataranges.endDate };
    }
    const sellers = await sellerModel.find(query).skip(skip).limit(10);
    // console.log("seller details=",sellers);
    res
      .status(200)
      .json({ message: "sellers details got successfully", sellers });
  } catch (error) {
    console.log("error in get sellers", error);
  }
};

const getcustomers = async (req, res) => {
  console.log("Received page:", req.params.page);
  const { page } = req.params;
  const { search, status } = req.query;
  console.log("query=", req.query);

  let query = { _id: { $ne: req.user.id } };

  if (search) {
    query.$or = [
      { username: { $regex: search, $options: "i" } }, // Case-insensitive username search
      { email: { $regex: search, $options: "i" } },
    ];
  }
  if (status) {
    query.status = status;
  }
  const skip = (page - 1) * 10;
  console.log("page=", page, "skip=", skip);

  // console.log(req.params)
  console.log(req.user);
  try {
    const users = await userModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(10);
    console.log("users=", users);

    const totalusers = await userModel.countDocuments(query);

    console.log(totalusers);
    if (!users) {
      return res.status(400).json({ message: "users not found" });
    }
    let totalPages = Math.ceil(totalusers / 10);
    console.log(totalPages);
    res
      .status(200)
      .json({ message: "users got it", users, totalPages, totalusers, page });
  } catch (error) {
    console.log("internal server error=", error);  
    return res.status(500).json({ message: "internal server error" });
  }
};
const getproducts = async (req, res) => {
 
  // console.log(req.query);
  const {page}=req.params
  const { search, datefilter, category, price,show } = req.query;
  console.log(show)
   console.log("page",page)
  const limit=10
  const skip=(page-1)*limit
  console.log("the paskip",skip)

  try {
    let query = {};
    if(show === 'my'){
      query.addedBY=new mongoose.Types.ObjectId(req.user.id)
    }
    let sortOption = {};
    if (search) {
      query.name = {
        $regex: search,
        $options: "i",
      };
    }
    if (price) {
      if (price === "low") {
        sortOption.discountprice = 1;
      } else {
        sortOption.discountprice = -1;
      }
    }
    if (datefilter) {
      if (datefilter === "Oldest") {
        sortOption.createdAt = 1;
      } else {
        sortOption.createdAt = -1;
      }
    }
    if (category) {
      query.category = category;
    }

    console.log(sortOption);
    console.log(query)

    // if(datefilter){
    //     query.sort()
    // }
    const products = await productModel
      .find(query)
      .populate("category", "category")
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    if (!products) {
      return res.status(400).json({ message: "product no found" });
    }
    console.log("product length=",products.length)
     const totalProducts = await productModel.countDocuments(query);
     const totalPages= Math.ceil(totalProducts / limit);
    // const category=await categoryModel.find()
    // if(!category){
    //     res.status(400).json({message:"category not found"})
    // }

    res.status(200).json({ message: "product got it", products,totalPages,totalProducts });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};
const logout = (req, res) => {
  console.log("inside");

  res.clearCookie("admin_token", {
    httpOnly: true,
      secure:process.env.NODE_ENV === 'production' , 
             sameSite:process.env.NODE_ENV === 'production' ? 'none' :'',  // must match cookie options from login
    // must match
    path: "/", // must match
  });
  res.status(200).json({ message: "logout successfully completed" });
};

const change_status = async (req, res) => {
  const { id, status } = req.params;
  console.log("inside the change status=", status, id);

  try {
    const seller = await sellerModel.findOne({ _id: id });
    if (!seller) {
      return res.status(404).json({ message: "seller not found" });
    }

    seller.status = status;
    await seller.save();
    let roles = ["INACTIVE", "SUSPEND"];
    // if(roles.includes(status)){
    // await userModel.updateOne({_id:seller.user},{rol})

    // remove seller role in user model
    await userModel.updateOne(
      { _id: seller.user },
      { $pull: { role: "seller" } }
    );
    // }

    return res.status(200).json({ message: "status updated successfully" });
  } catch (error) {
    console.log("errror status change=", error);
    return res.status(500).json({ message: "internal server error" });
  }
};

const add_category = async (req, res) => {
  const { categoryName, newfields } = req.body;
  console.log("category fields=", req.body);
  if (!categoryName || !newfields) {
    return res.status(400).json({ message: "please provide all the fields" });
  }
  try {
    const category = await categoryModel.findOne({ category: categoryName });
    if (category) {
      return res.status(400).json({ message: "category already exists" });
    }
    const newcategory = new categoryModel({
      category: categoryName,
      specific_fields: newfields.map((val, index) => {
        // console.log("val name=",val.Option);

        return {
          name: val.name,
          placeholder: val.placeholder,
          type: val.type,
          Options: val.Options,
        };
      }),
    });
    console.log("new category=", newcategory);

    await newcategory.save();
    return res.status(200).json({ message: "category added successfully" });
  } catch (error) {
    console.log("error in adding category", error);

    res.status(500).json({ message: "internal server error" });
  }
};

const get_category = async (req, res) => {
  const { page } = req.params;
  const skip = (page - 1) * 10;
  const { search, sort } = req.query;
  console.log(req.params, req.query);

  let query = {};
  if (search) {
    query.category = {
      $regex: search,
      $options: "i",
    };
  }
  const sortOrder = sort === "asc" ? 1 : -1;

  try {
    const category = await categoryModel
      .find(query)
      .skip(skip)
      .limit(10)
      .sort({ category: sortOrder });
    // logso

    if (!category) {
      return res.status(404).json({ message: "categroy not found " });
    }
    res.status(200).json({ message: "category added successfully", category });
  } catch (error) {
    console.log("error in getting category", error);
    res.status(500).json({ message: "internal server error" });
  }
};

const delete_category = async (req, res) => {
  // const {id}=req.body
  const { id } = req.params;
  console.log("id=", id);
  if (!id) {
    return res.status(400).json({ message: "id not found" });
  }
  try {
    const category = await categoryModel.deleteOne({ _id: id });
    console.log("deleted=", category);
    res.status(200).json({ message: "category deleted successfully" });
  } catch (error) {
    console.log("error in deleting category", error);
    res.status(500).json({ message: "internal server error" });
  }
};
const getcategory_withid = async (req, res) => {
  // console.log("inside the id");

  const { id } = req.params;
  console.log("id=", id);
  try {
    const category = await categoryModel.findOne({ _id: id });
    if (!category) {
      return res.status(400).json({ message: "not found category" });
    }
    res.status(200).json({ message: "got successfully", category });
  } catch (error) {
    console.log("error catergory with id=", error);
    res.status(500).json({ message: "internal server error" });
  }
};
const update_category = async (req, res) => {
  console.log("update_category");

  let { id } = req.params;
  const { categoryName, newfields } = req.body;
  // console.log("category fields=",corefields);
  // console.log("category name=",category_name);
  console.log(id, categoryName, newfields);

  // console.log("category fields=",category_name,corefields,"id=",id);
  if (!categoryName) {
    return res.status(400).json({ message: "please enter category name" });
  }
  if (!newfields) {
    return res.status(400).json({ message: "please provide  fields" });
  }
  if (!id) {
    return res.status(400).json({ message: "id not found" });
  }
  //   const objectId = new mongoose.Types.ObjectId(id);
  //   console.log(objectId)
  try {
    // const category=await categoryModel.find({_id:new new mongoose.Types.ObjectId(id)})

    const category = await categoryModel.findByIdAndUpdate(id, {
      $set: {
        category: categoryName,
        specific_fields: newfields.map((val, index) => ({
          name: val.name,
          placeholder: val.placeholder,
          type: val.type,
          Options: val.Options,
        })),
      },
    });
    console.log("category=", category);

    res.status(200).json({ message: "catgory updated successfully" });
  } catch (error) {
    console.log("error in update category", error);

    res.status(500).json({ message: "internal server error" });
  }
};

const nextusers = async (req, res) => {
  console.log(req.params);
  const { page } = req.params;
  const skip = (page - 1) * 10;
  console.log("page=", page, "skip=", skip);

  try {
    const users = await userModel
      .find({ _id: { $ne: req.user.id } })
      .skip(skip)
      .limit(10);
    const totalusers = await userModel.countDocuments({
      _id: { $ne: req.user.id },
    });
    console.log(totalusers);
    if (!users) {
      return res.status(400).json({ message: "users not found" });
    }
    let totalPages = Math.ceil(totalusers / 10);
    res
      .status(200)
      .json({ message: "new users got it", users, totalPages, page });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

const searchusers = async (req, res) => {
  console.log("search user");

  console.log(req.query);
  const { search, status, role, page } = req.query;
  const skip = (page - 1) * 10;
  const limit = 10; // Number of results per page

  const query = search
    ? {
        $and: [
          { _id: { $ne: req.user.id } }, // Exclude the current user
          {
            $or: [
              { username: { $regex: search, $options: "i" } }, // Case-insensitive username search
              { email: { $regex: search, $options: "i" } }, // Case-insensitive email search
            ],
          },
        ],
      }
    : {};

  if (status) {
    query.status = status;
  }
  if (role) {
    query.role = role;
  }

  const users = await userModel.find(query).skip(skip).limit(limit);
  console.log(users);

  const totalpages = Math.ceil(users.length / limit);
  const totalusers = users.length;

  res
    .status(200)
    .json({
      message: "search result got it",
      users,
      page,
      totalpages,
      totalusers,
    });

  console.log(users);
};

const change_statusbyuser = async (req, res) => {
  console.log(req.params);

  const { id, status } = req.params;

  try {
    if (!id && !status) {
      return res.status(400).json({
        message: "id or status not found",
      });
    }

    const users = await userModel.findByIdAndUpdate(id, {
      status: status,
    });

    res.status(200).json({ message: "status updated" });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};
const delete_user = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "internal server error" });
  }
  try {
    const users = await userModel.deleteOne({ _id: id });
    console.log(users);
    res.status(200).json({ message: "updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
};

const user_byfilter = async (req, res) => {
  const { status } = req.params;
  console.log(req.params);
  if (!status) {
    return res.status(400).json({ message: "status not found" });
  }

  try {
    const users = await userModel.find({
      $and: [{ _id: { $ne: req.user.id } }, { status: status }],
    });
    console.log(users);
  } catch (error) {
    console.log("error in filter", error);
  }
};

const changestatus_bypr = async (req, res) => {
  const { id, status } = req.params;

  if (!id || !status) {
    return res.status(400).json({ message: "id or status not found" });
  }

  try {
    const product = await productModel.findByIdAndUpdate(id, {
      status: status,
    });
    res.status(200).json({ message: "updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

const deleteproduct = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "internal server error" });
  }
  try {
    const products = await productModel.deleteOne({ _id: id });
    console.log(products);
    res.status(200).json({ message: "deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
};

const deleteseller = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "internal server error" });
  }
  try {
    const seller = await sellerModel.deleteOne({ _id: id });
    console.log(seller);
    res.status(200).json({ message: "deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
};

const category = async (req, res) => {
  console.log("inside the category model");
  try {
    const category = await categoryModel.find();
    res.status(200).json({ message: "category got it", category });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

const profile = async (req, res) => {
  try {
    const profile = await userModel.findById(req.user.id);
    res.status(200).json({ message: "profile got it", profile });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};
const update_profile = async (req, res) => {
  console.log("Inside the update profile");
  console.log(req.body);

  const { name, email, profile } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "All fields are required" });
  }

  let updateFields = {
    username: name,
    email,
  };

  try {
    // If a new profile image is uploaded
    if (profile) {
      const uploaded = await Cloudinary.uploader.upload(profile, {
        folder: "profile-image",
      });

      console.log("Uploaded Image:", uploaded);
      updateFields.profile = uploaded.secure_url;
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true }
    );

    console.log("Updated User:", updatedUser);

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const Addproduct = async (req, res) => {
  console.log("inside the add product");   
  console.log(req.files);
  console.log(req.body);
  const { product, dynamicfields } = req.body;
  const newproduct = JSON.parse(product);
  const corefields = JSON.parse(dynamicfields);
  const imagearray = req.files.map((val) => val.path);
  console.log("imagesarray=", imagearray);
  console.log("neww product=", newproduct);
  console.log("core fields=", corefields);
  // res.status(400).json({message:"added"})
  if (!newproduct || !corefields) {
    res.status(400).json({ message: "product details is required" });
  }
  if (imagearray.length === 0) {
    res.status(400).json({ message: "images are required" });
  }
  let discountprice = Math.round(
    newproduct.price - (newproduct.price * newproduct.discount) / 100
  );

  try {
    const products = new productModel({
      name: newproduct.name,
      description: newproduct.description,
      price: newproduct.price,
      discount: newproduct.discount,
      discountprice: discountprice,
      stock: newproduct.stock,
      status: newproduct.status,
      images: imagearray,
      core_details: corefields,
      category: newproduct.category,
      addedBY: req.user.id,
      isAdmin:true
    });

    await products.save();
    console.log("product=", products);
    res.status(200).json({ message: "product added successfull" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ messsage: "internal server error " });
  }
};

const getproductwith_id = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "id not founded" });
  }
  try {
    const product = await productModel.findById(id);
    res.status(200).json({ message: "product got it", product });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

const updatedproduct = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  let { product, dynamicfields, deleteimage } = req.body;
  // console.log(name)
  console.log(deleteimage);
  // console.log(dynamicfields)
  console.log(req?.files);
  // console.log(req.body)
  const updateQuery = {};
  let image;                     
  // Handle image uploads              
  if (req.files && req.files.length > 0) {
    const newImages = req.files.map((val) => val.path);
    updateQuery.$push = { images: { $each: newImages } };
  }
  // Parse and update product & dynamic fields
  if (product && dynamicfields) {
    product = JSON.parse(product);
    dynamicfields = JSON.parse(dynamicfields);

    const discountprice = Math.round(
      product.price - (product.price * product.discount) / 100
    );

    updateQuery.$set = {
      name: product.name,
      description: product.description,
      price: product.price,
      discount: product.discount,
      stock: product.stock,
      discountprice,
      status: product.status,
      category: product.category,
      core_details: dynamicfields,
    };
  }

  try {
    // Delete specific images from array
    if (deleteimage && Array.isArray(deleteimage)) {
      if (!updateQuery.$pull) updateQuery.$pull = {};
      updateQuery.$pull.images = { $in: deleteimage };
    }
    // console.log("update query=",updateQ)

    if (Object.keys(updateQuery).length > 0) {
      const result = await productModel.updateOne({ _id: id }, updateQuery);
      console.log("Update result:", result);

      return res.status(200).json({
        message: "Product updated successfully",
        update: updateQuery,
      });
    } else {
      return res.status(400).json({ message: "No update parameters provided" });
    }
  } catch (error) {
    console.log("error in update product=", error);
    return res.status(200).json({ message: "internal server error" });
  }
};
const adduser = async (req, res) => {
  console.log("inside add users");
  const { username, email, password, confirmPassword } = req.body;
  console.log(req.body);
  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "all fields are required" });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "password do not macth" });
  }
  try {
    const hashedpassword = await bcrypt.hash(password, 10);
    const existinguser = await userModel.findOne({ email: email });
    console.log(existinguser);
    // if(existinguser){
    //     return res.status(400).json({message:"already have account on this email"})
    // }
    const user = new userModel({
      username,
      email,
      password: hashedpassword,
      role: "user",
    });   
    console.log(user);
    const message = `<strong>Hello sir</strong>,\n You have been added to our petcare application . 
   Here are your login details:\n <strong>Email:</strong> ${email} \n <strong>Password:</strong> ${password} \n Petcare Team`;

    await sendMail(email, "Login details", message);
    await user.save();
    // res.status(200).json({message:})
    res.status(200).json({ message: "user added successfylly" });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
};
const getuser_id = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "id not found" });
  }

  try {
    const user = await userModel.findById(id);
    console.log(user);
    if (!user) {
      return res
        .status(400)
        .json({ message: "user data not available in database" });
    }
    res.status(200).json({ message: "user got it", user });
  } catch (error) {
    console.log(error);
    return res.status(500).josn({ message: "internal server error" });
  }
};
const update_user = async (req, res) => {
  const { id } = req.params;
  const { username, email } = req.body;
  console.log(req.body, id);

  if (!id) {
    return res.status(400).json({ message: "id not found" });
  }

  let obj = {};
  if (username) {
    obj.username = username;
  }

  try {
    if (email) {
      const message = `<strong>Hello sir</strong>,<br/>
        You have been added to our Petcare application.<br/>
        Here are your login details:<br/>
        <strong>Email:</strong> ${email}<br/>
        <br/>Petcare Team`;

      await sendMail(email, "Login details", message);
      obj.email = email;     
    }

    console.log("Updated fields:", obj);

    if (Object.keys(obj).length > 0) {
      const user = await userModel.findOneAndUpdate(
        { _id: id },
        { $set: obj },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res
        .status(200)
        .json({ message: "User updated successfully", user });
    } else {
      return res.status(400).json({ message: "No valid fields to update" });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const add_seller = async (req, res) => {
  // console.log("files=",req?.files)
  console.log("file2=", req.file);

  let { data } = req.body;

  data = JSON.parse(data);
  let { banking, address } = data;
  delete data.banking;
  delete data.address;

  console.log(data.email);
  try {        
    const existing_seller = await sellerModel.findOne({ email: data?.email });
    console.log(existing_seller);
    if (existing_seller) {
      return res
        .status(500)
        .json({
          message: "this email has already account,try another email!..",
        });
    }
    let password = generateRandomFourDigit(900000);
    password = String(password);

    console.log(password);
    let hashedpassword = await bcrypt.hash(password, 10);
    console.log(hashedpassword);

    const seller = new sellerModel({
      address,
      bankDetails: banking,
      ...data,
      status: "approved",
      isVerified: true,
      password: hashedpassword,
    });
    console.log(seller);
    let result;
    if (req.file) {
      let filename = `${seller._id}`;
      let folder = "business-logo";
      result = await uploadClodinary([req.file], folder, filename);
      console.log(result);
      seller.logo = result?.[0]?.secure_url || "";
    }

    console.log("seller=", seller);
    let text = `
  Dear sir,<br>
  You have been added to the Ore Seller Platform.<br>
  <strong>Login credentials:</strong><br>
  Email: ${seller.email}<br>
  Password: ${password}
`;

    await sendMail(seller.email, "Login credential", text);
    await seller.save();

    return res.status(200).json({ message: "added seller successfull" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
  // console.log(JSON.parse(data))
  // if()
};
const getSeller_id = async (req, res) => {
  const { id } = req.params;
  console.log("insdie the get seller id=", id);
  if (!id) {
    return res.status(400).json({ message: "id not found" });
  }
  try {
    const seller = await sellerModel.findById(id);
    if (!seller) {
      return res.status(400).json({ message: "seller details not found" });
    }
    res.status(200).json({ message: "seller detail got it", seller });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};

const update_seller = async (req, res) => { 
    console.log("req.files===",req.file)         
  const { id } = req.params;
  let { data, bankDetails, address, del_img } = req.body;
  console.log(id);
  console.log(data, bankDetails, address);
  let query = {};
  if (address) {
    address = JSON.parse(address);   
    console.log("address=", address);
    query.address = address;
  }
  if (bankDetails) {
    // console.log("inside bank details",bank)
    bankDetails = JSON.parse(bankDetails);
    console.log("bank=", bankDetails);
    query.bankDetails = bankDetails;
  }      

  try {
    const existingseller = await sellerModel.findById(id);
    // console.log(existingseller);
    if (!existingseller) {
      return res.status(400).json({ message: "seller data found" });
    }
    if (data) {
      data = JSON.parse(data);
      console.log("data..", data);
      (query.name = data.name), (query.businessName = data.businessName);
      query.businessType = data.businessType;
      query.phone = data.phone;
      if (data.email !== existingseller.email) {
        let password = generateRandomFourDigit(900000);
        password = String(password);

        console.log(password);
        let hashedpassword = await bcrypt.hash(password, 10);
        query.password = hashedpassword;
        query.email = data.email;
        let text = `
       Dear sir,<br>
      You account have been updated on  Seller Platform.<br>
      <strong>new Login credentials:</strong><br>
      Email: ${data.email}<br>
      Password: ${password}`;

        await sendMail(data.email, "Login credential", text);
      } else {
        query.email = data.email;
      }
    }

    if (del_img) {
      try {
        let publicid = getPublicIdFromUrl(del_img);
        console.log("public id", publicid);

        const result = await Cloudinary.uploader.destroy(del_img);
        console.log("Deleted from Cloudinary:", result);
        console.log("result=", result);
      } catch (error) {
        console.error("Cloudinary deletion failed:", error);
      }
    }
    if (req.file) {
        console.log("inside the req.file")
      console.log(req.file);
      let filename = `${existingseller._id}`;
      let folder = "business-logo";
      result = await uploadClodinary([req.file], folder, filename);
      console.log(result);
      query.logo = result?.[0]?.secure_url || "";
    }
    console.log("new query=", query);
    
    if(Object.keys(query).length > 0){
        console.log("updation start")  
    const updateseller = await sellerModel.findByIdAndUpdate(
      id,
      {
        $set: query,
      },
      { new: true }
    );
    console.log("udated seller",updateseller);
    res.status(200).json({ message: "seller updated successsfully" });

    } 
   
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
};

const View_seller=async(req,res)=>{
    const{id}=req.params
    if(!id){
        return res.status(400).json({message:"id not found"})
    }
    try {
        const seller=await sellerModel.findById(id)
        const product=await productModel.find({addedBY:id}).populate('category','category')
        return res.status(200).json({message:"details got it",seller,product})
    } catch (error) {
        console.log("error in adding product",error)
        res.status(500).json({message:"internal server error"})
    }
}

const getbanners=async(req,res)=>{
  try {
    const banner=await bannerModel.find()
    if(banner.length === 0){
      return res.status(400).json({message:"banner not found"})
    }

    return res.status(200).json({message:"banner got it",banner})
  } catch (error) {
    console.log("banner=",error)
    res.status(500).json({message:"internal server error"})
  }
}

const getorders = async (req, res) => {
  try {
    const { page = 1 } = req.params;    
    const limit = 10;
    const skip = (page - 1) * limit;

    const { date, status, search } = req.query;
    console.log("query",req.query)
    
    console.log(status)
    const now = new Date();
    const query = {};

    // Filter by status
    // if (status && status !== 'all') {
    //   query.status = status;
    // }

    // Filter by date
    if (date && date !== 'all-time') {
      if (date === 'today') {
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        query.createdAt = { $gte: start, $lte: end };
      } else if (date === 'week') {
        const start = new Date(now.setDate(now.getDate() - now.getDay()));
        start.setHours(0, 0, 0, 0);
        const end = new Date(now.setDate(start.getDate() + 6));
        end.setHours(23, 59, 59, 999);
        console.log("end=",end,"start=",start)
        
        query.createdAt = { $gte: start, $lte: end };
      } else if (date === 'month') {
        const year = now.getFullYear();  
        const month = now.getMonth();
        const start = new Date(year, month, 1);
        const end = new Date(year, month + 1, 0);
        end.setHours(23, 59, 59, 999);
        query.createdAt = { $gte: start, $lte: end };
      }
    }

    // Build aggregation pipeline
    const pipeline = [
  // Filter orders by base query (e.g. userId, date)
  { $match: query },

  // Join user data
  {
    $lookup: {
      from: 'users',
      localField: 'user',
      foreignField: '_id',
      as: 'user'
    }
  },
  { $unwind: '$user' },

  // Unwind items and products
  { $unwind: '$items' },
   { $unwind: '$items.products' },

  // Lookup product details
  {
    $lookup: {
      from: 'products',
      localField: 'items.products.productId',
      foreignField: '_id',
      as: 'productDetails'
    }
  },
  { $unwind: { path: '$productDetails', preserveNullAndEmptyArrays: true } },

  // 🔍 Optional match by product name (search)
  ...(search
    ? [
        {
          $match: {
            'productDetails.name': { $regex: search, $options: 'i' }
          }
        }
      ]
    : []),
    

  // ✅ Optional match by items.products.status
  ...(status !== 'all' && status !==undefined
    ? [
        {
          $match: {
            'items.products.status': status
          }
        }
      ]
    : []),

  // Rebuild the product object with details + quantity/price/status
  {
    $addFields: {
       'items.products.product': '$productDetails',
      'items.products.quantity': '$items.products.quantity',
      'items.products.price': '$items.products.price',
      'items.products.status': '$items.products.status'
    }
  },

  // Group products back into array under items
  {
    $group: {
      _id: {
        orderId: '$_id',
        itemId: '$items._id',
        sellerId: '$items.sellerId',
        sellerModel: '$items.sellerModel'
      },
      products: { $push: '$items.products' },
      otherFields: { $first: '$$ROOT' }
    }
  },

  // Rebuild items array per order
  {
    $group: {
      _id: '$_id.orderId',
      user: { $first: '$otherFields.user' },
      status: { $first: '$otherFields.status' },
      createdAt: { $first: '$otherFields.createdAt' },
      items: {
        $push: {
          _id: '$_id.itemId',
          sellerId: '$_id.sellerId',
          sellerModel: '$_id.sellerModel',
          products: '$products'
        }
      }
    }
  },

  // Sort and Paginate
  { $sort: { createdAt: -1 } },
  { $skip: skip },
  { $limit: limit }
]

    const orders = await orderModel.aggregate(pipeline);
    const totalDocuments = await orderModel.countDocuments(query);
    console.log("order=",orders)
    // return null

    res.status(200).json({
      message: 'Orders fetched successfully',
      orders,
      total: totalDocuments,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalDocuments / limit)
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const order_status_change = async (req, res) => {
  console.log(req.body);
  const { orderId, productId, status } = req.body;

  if (!orderId || !productId || !status) {
    return res.status(400).json({ message: 'all fields are required' });
  }
   let updateValue = status.toLowerCase();
  const update = {
  $set: {
    'items.$[].products.$[product].status': updateValue
  }
};
console.log("status=",update)
if (status === 'shipped') {
  
      let date=new Date()
    let  del_date=calculateDeliveryDate(date,4)
      console.log("delivery date=",del_date)
      update.$set['items.$[].products.$[product].deliveryDate'] = del_date;
   
}

if (status === 'cancelled') {
  update.$set ['items.$[].products.$[product].deliveryDate']= null ;
}

  try {
   

    const order =await  orderModel.updateOne({_id:orderId},
      
      update,

      {
        arrayFilters:[{"product.productId":productId}]
      },{
        new:true
      }
    );

    console.log('order =', order);
    
    return res.status(200).json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getReviews=async(req,res)=>{
  const {page}=req.params;
  const skip=(page-1)*10;
  const{search,rating}=req.query;
  console.log("query=",req.query)
  console.log(page)
  const pipeline = [
  {
    $lookup: {
      from: 'users',
      localField: 'user',
      foreignField: '_id',
      as: 'user'
    }
  },
  { $unwind: '$user' },

  {
    $lookup: {
      from: 'products',
      localField: 'product',
      foreignField: '_id',
      as: 'product'
    }
  },
  { $unwind: '$product' },

  {
    $lookup: {
      from: 'categories',
      localField: 'product.category',
      foreignField: '_id',
      as: 'category'
    }
  },
  { $unwind: '$category' },

  ...(search
    ? [{ $match: { 'product.name': { $regex: search, $options: 'i' } } }]
    : []
  ),

  ...(rating !== 'all'
    ? [{ $match: { rating: { $eq: Number(rating) } } }]
    : []
  ),

  {
    $project: {
      _id: 1,
      createdAt: 1,
      updatedAt: 1,
      comment: 1,
      rating: 1,
      status:1,
      user: '$user',
      product: '$product',
      category: {
        _id: '$category._id',
        category: '$category.category'
      }
    }
  },
  { $sort: { createdAt: -1 } },
  {$skip:skip},
  { $limit: 10 }
];
const countPipeline = [
  {
    $lookup: {
      from: 'products',
      localField: 'product',
      foreignField: '_id',
      as: 'product'
    }
  },
  { $unwind: '$product' },

  ...(search
    ? [{ $match: { 'product.name': { $regex: search, $options: 'i' } } }]
    : []),

  ...(rating !== 'all'
    ? [{ $match: { rating: { $eq: Number(rating) } } }]
    : []),

  {
    $count: 'totalCount'
  }
];
 
  try {
    const reviews=await reviewModel.aggregate(pipeline)
    const result=await reviewModel.aggregate(countPipeline)
    const totalCount = result[0]?.totalCount || 0;
    //  const pageSize = 10;
    const totalPages = Math.ceil(totalCount / 10);
    console.log(reviews)
    res.status(200).json({message:'review got it',reviews,totalPages,totalCount})
  } catch (error) {
    console.log("error in getting reviews",error)
    res.status(500).json({message:"internal server error"})
  }
}
const deletereview =async(req,res)=>{
  const {id}=req.params
  if(!id){
    return res.status(400).json({message:'it not found'})
  }

  try {
    const reviews=await reviewModel.deleteOne({_id:id})
    console.log(reviews)
    res.status(200).json({message:"review deleted successfully"})
  } catch (error) {
    console.log(error)
    return res.status(500).json({message:"internal server error"})
  }
}

const change_reviewstatus=async(req,res)=>{
  const {id,status}=req.params
  console.log(id,status)
  try {
    const reviews=await reviewModel.updateOne({_id:id},{
      $set:{status:status}
    })
    res.status(200).json({message:"status updated"  })
  } catch (error) {
    console.log(error)
    res.status(500).json({message:'internal server error'})
  }
}

const deleteBanner=async(req,res)=>{
  const {id}=req.params
  const {image}=req.query
  console.log("id=",image)
  if(!id){
    return res.status(400).json({message:'id not found'})
  }
  if(!image){
    return res.status(400).json({message:'images not found'})
  }

  let newurl = image.split('/banner')[1]?.split('.')[0];

  newurl = newurl ? 'banner' + newurl : null;
   console.log("image=",newurl)

  try {
    const deletebanner=await Cloudinary.uploader.destroy(newurl)
    console.log("delete response ",deletebanner)
    // return null
    const banner=await bannerModel.deleteOne({_id:id})
    res.status(200).json({message:'banner deleted successfully'})
  } catch (error) {
    console.log(error)
    res.status(500).json({message:'internal server error'})
  }
}

const addBanner = async (req, res) => {
  console.log('banner', req.file || req.files);
  console.log(req.body);

  const { isActive, link } = req.body;
  let status
  if(isActive){
    status='Active'
  }else{
    status='Inactive'
  }

  if (!req.file) {
    return res.status(400).json({ message: 'Image not received' });
  }

  const folder = 'banner';
  const filename = `${req.user.id}_${Date.now()}`;

  try {
    const result = await uploadClodinary([req.file], folder, filename);
    const imageUrl = result?.secure_url || result[0]?.secure_url;

    if (!imageUrl) {
      return res.status(500).json({ message: 'Cloudinary upload failed' });
    }

    const newBanner = new bannerModel({
      image: imageUrl,
      isActive,
      link: link && link.trim() ? link.trim() : undefined,
      addedby: req.user.id,
      addedbymodel: 'admin',
      status
    });

    await newBanner.save();

    res.status(200).json({ message: 'Banner added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateBanner = async (req, res) => {
  const { id } = req.params;
  let adminId = new mongoose.Types.ObjectId(req.user.id);
  console.log("admin id=", adminId);
  console.log(req.file);
  console.log("id", id);
  const { link, isActive, deleteImage } = req.body;
  console.log("is active=",isActive)
  console.log(link, isActive, deleteImage);
  let obj = {
    link: link,
    isActive: isActive ,
    status: isActive ? "Active" : "Inactive"
  };
  console.log("")

  try {
    if (deleteImage && req.file) {
      const banner = await bannerModel.findOne({ _id: id });
      console.log("banner =", banner);
      if (!banner) {
        return res.status(400).json({ message: "banner not found " });
      }

      if (!banner.addedby.equals(adminId)) {
        console.log("not an admin");
        let folder = "banner";
        let filename = `${banner.addedby}_${Date.now()}`;
        const result = await uploadClodinary([req.file], folder, filename);
        console.log("result of added image", result);
        //   if(deleteImage && req.file){
        //        const result = await uploadClodinary([req.file], folder, filename);
        //  console.log("result of added image",result)
        //  const deleteimage=await bannerModel.updateOne({_id:id},{
        //   $set:{
        //     image:null
        //   }

        //  })
        //  console.log("delete image=",deleteimage)
        obj.image = result[0].secure_url;
      } else {
        console.log("admin s banner");

        let folder = "banner";
        let filename = `${banner.addedby}_${Date.now()}`;
        const result = await uploadClodinary([req.file], folder, filename);

        console.log("admin update result", result);
        // if(deleteImage){
        //    const deleteimage=await bannerModel.updateOne({_id:id},{
        // $set:{
        //   image:null
        // }})
        // console.log("delete image =",deleteimage)
        // }
        obj.image = result[0].secure_url;
      }
    }

    console.log(obj);
    //  return null
    const updatebanner = await bannerModel.updateOne(
      { _id: id },
      {
        $set:  obj 
      }
    );
    console.log("update banner", updatebanner);

    res.status(200).json({ message: "updated banner successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};

const update_bannerStatus=async(req,res)=>{
  const {id,status}=req.params
  if(!id){
   return  res.status(400).json({message:'id not found'})
  }
  if(!status){
   return  res.status(400).json({message:'status not found'})
  }
  try {
    const banner=await bannerModel.updateOne({_id:id},{
      $set:{
        status:status
      }
      
    })
    console.log("update response=",banner)  
    res.status(200).json({message:'banner updated successfull'})
  } catch (error) {
    console.log(error)
    res.status(500).json({message:'internal server error'})
  }
}

const allproduct_details=async(req,res)=>{
  const {id}=req.params
  console.log("id=",id)
  if(!id){
    return res.status(400).json({message:'id not found'})
  }

  try {
   const product = await productModel.aggregate([
  {
    $match: { _id: new mongoose.Types.ObjectId(id) } // pick the product you want
  },
  {
    $lookup: {
      from: "orders",
      let: { pid: "$_id" },
      pipeline: [
        { $unwind: "$items" },
        { $unwind: "$items.products" },
        { $match: { $expr: { $eq: ["$items.products.productId", "$$pid"] } } },
        {
          $group: {
            _id: "$items.products.productId",
            totalSales: { $sum: "$items.products.price" },
            totalsold:{$sum:'$items.products.quantity'}
          }
        }
      ],
      as: "orderData"
    }
  },
  {
    $lookup: {
      from: "categories",
      localField: "category",
      foreignField: "_id",
      as: "category"
    }
  },
  { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
  {
    $lookup: {
      from: "reviews",
      localField: "_id",
      foreignField: "product",
      as: "review"
    }
  },
  {
    $addFields: {
      totalSales: { $ifNull: [{ $arrayElemAt: ["$orderData.totalSales", 0] }, 0] },
      totalSold:{$ifNull:[{$arrayElemAt:['$orderData.totalsold',0]},0]},
      totalReviews: { $size: "$review" },
      averageRating: {
        $cond: [
          { $gt: [{ $size: "$review" }, 0] },
          { $avg: "$review.rating" },
          null
        ]
      }
    }
  },
  {
    $project: {
      _id: 1,
      name: 1,
      price: 1,
      description: 1,
      discountprice:1,
      discount:1,
      status:1,
      core_details:1,
      images: 1,
      stock: 1,
      category: "$category.category",
      totalSales: 1,
      totalReviews: 1,
      averageRating: 1,
      createdAt:1,
      totalSold:1
    }
  }
]);





  


    console.log(product)
    res.status(200).json({message:'product got it ',product})
  } catch (error) {
    console.log(error)
    res.status(500).json({message:'internal server error'})
  }
}

const getProductsForBanners=async(req,res)=>{
  try {
const product=await productModel.find({addedBY:req.user.id})
res.status(200).json({message:'products got',product})
  } catch (error) {
    res.status(500).json({message:'internal server error'})
  }
}



module.exports = {
  dashboard,
  getproducts,
  getsellers,
  getcustomers,
  logout,
  change_status,
  add_category,
  get_category,
  delete_category,
  nextusers,
  getcategory_withid,
  update_category,
  searchusers,
  change_statusbyuser,
  delete_user,
  user_byfilter,
  changestatus_bypr,
  deleteproduct,
  deleteseller,
  category,
  profile,
  update_profile,
  Addproduct,
  getproductwith_id,
  updatedproduct,
  adduser,
  getuser_id,
  update_user,
  add_seller,
  getSeller_id,
  update_seller,
  View_seller,
  getbanners,
  getorders,
  order_status_change,
  getReviews,
  deletereview,
  change_reviewstatus,
  deleteBanner,
  addBanner,
  updateBanner,
  update_bannerStatus,allproduct_details,
  getProductsForBanners
};
