import React, { useEffect, useState } from 'react'
import "./login-register.css"
import logo from "../images/logo.png"
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { jwtRoutes, loginRoutes, verifyAuth } from '../utils/APIROUTES';

const Login = () => {
    const [username,setUsername]=useState("");
    const [password,setPassword]=useState("");

    const navigate=useNavigate();

    useEffect(()=>{
      axios.get(jwtRoutes,{withCredentials:true})
        .then(
          res=>{
            const token=res.data.accessToken
            
            axios.post(verifyAuth,{withCredentials:true,headers:{"Authorization":`Bearer ${token}`}})
                    .then(res=>{
                      navigate("/")
                    })
                    .catch(err=>console.log(err))
          }
        ).catch(
          err=>{
            console.log(err.response.statusText)
          }
        )
    },[])

    const handleForm=async e=>{
        e.preventDefault()

        const user={username,password}
        console.log(user)
        await axios.post(loginRoutes,user,{withCredentials:true})
                            .then(res=>{
                                navigate("/")
                            })
                            .catch(err=>{
                                console.log(err.response.data.message)
                                alert(err.response.data.message)
                            })
        
    }
  return (
      <div className='login'>
        <header>
            <h1><img src={logo}/><span> MI-TSATY</span></h1>
        </header>
          <form className='form-style'>
              <input
                  className='form-input username'
                  name='username'
                  type='text'
                  placeholder='Username'
                  value={username}
                  onChange={e=>setUsername(e.target.value)}
              />
              <input
                  className='form-input password'
                  name='password'
                  type='password'
                  placeholder='Password'
                  value={password}
                  onChange={e=>setPassword(e.target.value)}
              />
              <button
                  className='form-button'
                  type='button'
                  onClick={(e)=>{handleForm(e)}}
              >
                  Login in 
              </button>
          </form>
          <div className='form-buttom-text'>
              <span>Don't have an account ?</span><Link  to="/register" className='form-buttom-link'> Register</Link>
          </div>
    </div>
  )
}

export default Login