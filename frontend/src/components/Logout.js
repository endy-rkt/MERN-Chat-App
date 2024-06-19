import React from 'react'
import { logout } from '../utils/APIROUTES';
import axios from 'axios';
import styled from "styled-components";
import {BiPowerOff} from "react-icons/bi"
import { useNavigate } from 'react-router-dom';
const Logout = () => {
    const navigate=useNavigate()
    const handleLogoutClick=(e)=>{
        e.preventDefault();
    
        axios.get(logout,{withCredentials:true})
          .then(res=>{
            if (res.data.status) navigate("/login")
          })
          .catch(err=>{
            console.log(err)
          })
      }
  return (
    <Button className="logout-btn" onClick={handleLogoutClick}>
        <BiPowerOff className='btn'/>
    </Button>
  )
}

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #9a86f3;
  border: none;
  cursor: pointer;
  
  svg {
    font-size: 1.3rem;
    color: #ebe7ff;
  }
  .btn:hover{
   
  }
`;
export default Logout