import React, { useContext, useEffect, useState } from 'react';
import { MyOtherContext } from '../pages/Home';
import Chat from './Chat';
import styled from 'styled-components';
import Welcome from './Welcome';
import logo from '../images/logo.png';
import Logout from './Logout';

const Contact = ({ contacts, currentUser, userAvatar }) => {
  const [target, setTarget] = useState(null);
  const [currentChat, setCurrentChat] = useState(<Welcome />);
  const socket = useContext(MyOtherContext);

  let handleContactClick = (contact) => {
    if (contact) {
      if (contact) setCurrentChat(contact?.user.email);
      setTarget(contact);
    }
  };

  return (
    <Container>
      <div className="container-1">
        <header className="brand">
          <h3>
            <img src={logo} />
            <span> MI-TSATY</span>
          </h3>
        </header>
        <div className="contacts">
          {contacts.map((contact) => {
            return (
              <div
                key={contact.user._id}
                className={`contact ${target === contact ? 'selected' : ''}`}
                onClick={() => handleContactClick(contact)}
              >
                <div className="avatar">
                  <img src={`data:image/*;base64,${contact?.avatar.data}`} alt="" />
                </div>
                <div className="username">
                  <h3>{contact.user.username}</h3>
                </div>
              </div>
            );
          })}
        </div>
        <div className="current-user">
          <div className="avatar">
            <img src={`data:image/*;base64,${userAvatar?.data}`} alt={userAvatar?.filename} />
          </div>
          <div className="username">
            <h2>{currentUser?.username}</h2>
          </div>
          <Logout className=".logout-btn"/>
        </div>
      </div>
      <div className="container-2">
        <ChatContainer>
          {target === null ? (
            <Welcome />
          ) : (
            <ChatInputContainer>
                 <Chat currentChat={currentChat} target={target} socket={socket} />
            </ChatInputContainer>
          )}
        </ChatContainer>
      </div>
    </Container>
  );
};

const Container = styled.div`
  height: 85vh;
  width: 85vw;
  background-color: #00000076;
  display: grid;
  grid-template-columns: 25% 75%;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-columns: 35% 65%;
  }
  .container-1 {
    display: grid;
    grid-template-rows: 10% 75% 15%;
    overflow: hidden;
    background-color: #080420;
    .brand {
      display: flex;
      align-items: center;
      gap: 1rem;
      justify-content: center;
      img {
        height: 2.7rem;
      }
      h3 {
        color: white;
        text-transform: uppercase;
        font-size:20px;
      }
    }
    .contacts {
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow: auto;
      gap: 0.8rem;
      &::-webkit-scrollbar {
        width: 0.2rem;
        &-thumb {
          background-color: #ffffff39;
          width: 0.1rem;
          border-radius: 1rem;
        }
      }
      .contact {
        background-color: #ffffff34;
        min-height: 5rem;
        cursor: pointer;
        width: 90%;
        border-radius: 0.2rem;
        padding: 0.4rem;
        display: flex;
        gap: 1rem;
        align-items: center;
        transition: 0.5s ease-in-out;
        .avatar {
          img {
            height: 3rem;
            border-radius:50%;
            
          }
        }
        .username {
          h3 {
            color: white;
            font-size:13px;
          }
        }
      }
      .selected {
        background-color: #9a86f3;
      }
    }
    .current-user {
      height:50px;
      margin-top:2rem;
      background-color: #0d0d30;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 2rem;
      .logout-btn{
        margin-left:10%;
      }
      .avatar {
        img {
          height: 4.1rem;
          max-inline-size: 100%;
          border-radius:50%;
          padding:2px 2px;
        }
      }
      .username {
        h2 {
          color: white;
          font-size:17px;
        }
      }
      @media screen and (min-width: 720px) and (max-width: 1080px) {
        gap: 0.5rem;
        .username {
          h2 {
            font-size: 1rem;
          }
        }
      }
    }
  }
`;

const ChatContainer = styled.div`
height: calc(100% - 50px); /* Adjust the height as needed */
overflow-y: auto;
padding: 10px;
`;

const ChatInputContainer = styled.div`
  height: 30px; 
  flex-grow: 1;
`;

export default Contact;
