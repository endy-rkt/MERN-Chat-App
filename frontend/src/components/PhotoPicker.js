import React, { useState } from 'react'
import { setPic } from '../utils/APIROUTES';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import avatarImage from "../images/avatarImage.jpg"

const PhotoPicker = (email) => {
    const navigate=useNavigate()
    const [selectedPhoto,setSelectedPhoto]=useState(avatarImage)
    
    const handleImageClick=()=>{
        const fileInput=document.querySelector("#myFiles")
  
        fileInput.click()
    }

    const handlePhotoChange=e=>{
        const file=e.target.files[0];

        if (file){
            setSelectedPhoto(URL.createObjectURL(file))
        }
    }

    const sendPic=async e=>{
        e.preventDefault();
        
        const myFiles=document.getElementById("myFiles").files

        const formData=new FormData()

        Object.keys(myFiles).forEach(key=>{
            formData.append(myFiles.item(key).name,myFiles.item(key))
        })

        formData.append("email",email.email)

        axios.post(setPic,formData)
                    .then(res=>{
                      console.log(res.data.message)
                      navigate("/")
                    })
                    .catch(err=>{
                        alert(err.response.data.message)

                    }) 
    }

  return (
    <div>
        <form id="uploadForm" encType='multipart/form-data' onSubmit={sendPic}>
            <h1 className='setPic-text'>Pick your profile picture</h1>
            <img src={selectedPhoto} className="avatarImage" alt="Select avatar"  title="select our profile" onClick={handleImageClick}/>
            <input type="file" id="myFiles" accept='image/*' onChange={handlePhotoChange}/>
            <button
            className='saveImage-button'
            type='submit'
            >
            Save your profile picture
            </button>
        </form>
    </div>
  )
}

export default PhotoPicker