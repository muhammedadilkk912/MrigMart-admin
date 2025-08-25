import { createSlice } from "@reduxjs/toolkit";


const  authSlice=createSlice({
    name:'auth',
    initialState:{
        authentication:false
    },    
    reducers:{
        login(state) {
      state.authentication = true;
    },
    logout(state) {
      console.log("inside redux handle logout ")
      state.authentication = false;
    },
    setAuthentication(state, action) {
  state.authentication = action.payload;
}
        
    },
});

export const {login,logout,setAuthentication}=authSlice.actions
export default authSlice.reducer