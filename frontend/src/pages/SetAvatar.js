import React, { useEffect,useState} from 'react'
import {useNavigate } from 'react-router-dom';
import axios from "axios";
import "./setAvatar.css"
import { jwtRoutes,verifyAuth } from '../utils/APIROUTES';
import PhotoPicker from '../components/PhotoPicker';

const SetAvatar = () => {
  const navigate=useNavigate(); 

 const [currentUser,setCurrentUser]=useState(null)

  useEffect(()=>{
    axios.get(jwtRoutes,{withCredentials:true})
        .then(
          res=>{
            const token=res.data.accessToken

            setCurrentUser(res.data.user)
            
            axios.post(verifyAuth,{withCredentials:true,headers:{"Authorization":`Bearer ${token}`}})
                    .catch(err=>{console.log(err)
                     navigate("/login")
                    })
          }
        ).catch(
          err=>{
            alert(err.response.statusText)
           navigate("/login")
          }
        )
  },[])

  useEffect(()=>{
   if (currentUser?.isAvatarSet) navigate("/")
  },[currentUser])
  
  return (
    <>
      <PhotoPicker email={currentUser?.email}/>
    </>
  )
}

export default SetAvatar