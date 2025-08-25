

const authorizrole=(role)=>{
  return(req,res,next)=>{
    if (!req.user || !req.user.role) {
      console.log("inside the role")
        return res.status(401).json({ message: "Unauthorized: No token or role" });
      }
      if(!req.user.role.includes(role)){
        res.status(401).json({message:"it is not an appropraite role"})
      }
      next()
  }

}
module.exports=authorizrole