import React, { useCallback } from 'react'
import AuthHook from './AuthHook';

const finoUserRoles=["USER","ADMIN","MANAGER","CLIENT"];


const HasAuthority = () => {
const{jwtToken,userName,error,userRoles,fullName}=AuthHook()

const userAuthority= useCallback(()=>{
let authority={isAdmin:false,isManager:false,isClient:false,isUser:false}  
  if( Array.isArray(userRoles) && userRoles.length>0){
    authority.isAdmin=userRoles?.includes("ADMIN")
    authority.isManager=userRoles?.includes("MANAGER")
    authority.isUser=userRoles?.includes("USER")
    authority.isClient=userRoles?.includes("CLIENT")
    return authority;
  }
  else{return authority}
    },[userRoles])


  return userAuthority()
}

export default HasAuthority