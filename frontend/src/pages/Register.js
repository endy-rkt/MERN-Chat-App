import React, { useState,useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { jwtRoutes } from '../utils/APIROUTES';
import { verifyAuth } from '../utils/APIROUTES';
import axios from "axios";
import "./login-register.css"
import { registerRoutes } from '../utils/APIROUTES';
import { loginRoutes } from '../utils/APIROUTES';
import logo from "../images/logo.png"

const Register = () => {
    const [username,setUsername]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [confirmPwd,setconfirmPwd]=useState("");
    const [currentUser,setCurrentUser]=useState(null)

    const navigate=useNavigate();

    //check authorization
    useEffect(()=>{
        axios.get(jwtRoutes,{withCredentials:true})
          .then(
            res=>{
              const token=res.data.accessToken

              setCurrentUser(res.data.user)
              
              axios.post(verifyAuth,{withCredentials:true,headers:{"Authorization":`Bearer ${token}`}})
                      .catch(err=>console.log(err))
            }
          ).catch(
            err=>{
              console.log(err.response.statusText)  
            }
          )
      },[])

      useEffect(()=>{
        if (currentUser?.username){
          navigate("/")
      }else{
          if(currentUser?.isAvatarSet===true) navigate("/")
      }
      },[currentUser])

    const handleForm=async e=>{
        e.preventDefault()

        const user={username,password,email}

        await axios.post(registerRoutes,user)
                            .then(async res=>{
                                const user={username,password}

                                await axios.post(loginRoutes,user,{withCredentials:true})
                                                    .then(res=>{
                                                        navigate("/setAvatar")
                                                    })
                                                    .catch(err=>{
                                                        alert(err.response.data.message)
                                                    })
                                                        setTimeout(()=>{alert(res.data.message)},100)
                                                    })
                            .catch(err=>{
                                alert(err.response.data.message)
                            })
        
    }
  return (
    <div className='login'>
        <header>
            <h1><img src={logo}/><span> MI-TSATY</span></h1>
        </header>
        <form className='form-style username'>
            <input
                className='form-input'
                name='username'
                type='text'
                placeholder='Username'
                value={username}
                onChange={e=>setUsername(e.target.value)}
            />
            <input
                className='form-input email'
                name='email'
                type='email'
                placeholder='Email'
                value={email}
                onChange={e=>setEmail(e.target.value)}
            />
            <input
                className='form-input password'
                name='password'
                type='password'
                placeholder='Password'
                value={password}
                onChange={e=>setPassword(e.target.value)}
            />
            <input
                className='form-input confirmPwd'
                name='confirmPwd'
                type='password'
                placeholder='Confirm password'
                value={confirmPwd}
                onChange={e=>setconfirmPwd(e.target.value)}
            />
            <button
                className='form-button'
                type='button'
                onClick={(e)=>{handleForm(e)}}
            >
                Create new user
            </button>
        </form>
        <div className='form-buttom-text'>
            <span>Already have an account ?</span><Link  to="/login" className='form-buttom-link'> Login</Link>
        </div>
    </div>
  )
}

export default Register