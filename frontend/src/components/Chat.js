import React, { useContext,useEffect, useRef, useState} from 'react'
import { Context0, MyContext, MyOtherContext } from '../pages/Home'
import ChatInput from './ChatInput'
import styled from "styled-components";
import axios from "axios"
import { getAllMessageRoutes, sendMessageRoutes } from '../utils/APIROUTES'
import {v4 as uuidv4} from "uuid"
import Logout from './Logout'

const Chat = ({currentChat,target}) => {
  const [messages,setMessages]=useState([])
  const [arrivalMessages,setArrivalMessages]=useState(null)
  const user=useContext(MyContext)
  const socket=useContext(MyOtherContext)
  const isSocketConnected=useContext(Context0)
  const scrollRef=useRef() 
  
  useEffect( ()=>{
    axios.post(getAllMessageRoutes,{
      from:user?._id,
      to:target?.user._id
    }).then(res=>{
      setMessages(res.data)
    })
  },[currentChat])

  const handleSendMsg=async (msg)=>{
  
   
    if (target && user){
      socket.current.emit("send-msg",{
        from:user?._id,
        to:target?.user._id,
        message:msg,
      })

      await axios.post(sendMessageRoutes,{
        from:user?._id,
        to:target?.user._id,
        message:msg,
      }).then(res=>{
        //console.log(res)
      }).catch(err=>{
        console.log(err)
      })
      

      const msgs=[...messages]
      msgs.push({fromSelf:true,message:msg})
      setMessages(msgs)
    }
  }

  useEffect(() => {
    console.log("dkfkfa", socket.current);
    console.log("ddd");
    if (isSocketConnected) {
      socket.current.on("msg-receive", (message) => {
        console.log("dude");
        console.log({ message });
        setArrivalMessages({ fromSelf: false, message: message });
      });
    }
  }, [isSocketConnected]);
  

  useEffect(()=>{
    arrivalMessages && setMessages((prev)=>[...prev,arrivalMessages])
  },[arrivalMessages])

  useEffect(()=>{
    scrollRef.current?.scrollIntoView({behavior:"smooth"})
  },[messages])


  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
           <img
              src={`data:image/*;base64,${target?.avatar.data}`}
              alt={target?.avatar.filename}/>
          </div>
          <div className="username">
            <h3>{target?.user.username}</h3>
          </div>
        </div>
        {/*<Logout />*/}
      </div>
      <div className="chat-messages">
        {messages?.map((message) => {
          return (
            <div ref={scrollRef} key={uuidv4()}>
              <div
                className={`message ${
                  message.fromSelf ? "sended" : "recieved"
                }`}
              >
                <div className="content ">
                  <p>{message.message}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  )
}
const Container = styled.div`
  display: grid;
  gap: 0.1rem;
  overflow: hidden;
  
  .chat-header {
    
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
    height:50px;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
          border-radius:50%;
        }
      }
      .username {
        h3 {
          color: white;
          font-size:15px;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;

export default Chat;