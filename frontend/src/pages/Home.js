import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAllAvatars,getAllUsers, host, jwtRoutes, verifyAuth } from '../utils/APIROUTES';
import Contact from '../components/Contact';
import {io} from "socket.io-client";
import styled from "styled-components";

export const MyContext=React.createContext()
export const MyOtherContext=React.createContext()
export const Context0=React.createContext()

const Home = () => {
  const socket=useRef()
  const navigate = useNavigate();
  const [usersList, setUsersList] = useState([]);
  const [currentUser,setCurrentUser]=useState(null)
  const [contacts,setContacts]=useState([])
  const [avatars,setAvatars]=useState([])
  const [users,setUsers]=useState([])
  const [userAvatar,setUserAvatar]=useState(null)
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [isAvatarOn, SetIsAvatarOn] = useState(false);


  useEffect(() => {
    axios
      .get(jwtRoutes, { withCredentials: true })
      .then((res) => {
        const token = res.data.accessToken;

        setCurrentUser(res.data.user)
        axios
          .post(verifyAuth, {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(async (res) => {
            axios.get(getAllAvatars)
                    .then(res=>{
                      setAvatars(res.data)
                      SetIsAvatarOn(true)      
                    })
                    .catch(err=>{
                      console.log(err)
                    })
            
            axios
              .get(getAllUsers)
              .then((res) => {
                setUsersList(res.data);
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => {
        console.log(err.response.statusText);
        alert(err.message.statusText)
        navigate('/login');
      });
  }, []);

  useEffect(()=>{
    if(isAvatarOn){setUsers(usersList?.map(user=>{
      const email=user.email;
      const avatarObject=avatars.find(avatar=>avatar.filename===`${email}.jpg`)
      const avatar=avatarObject?avatarObject:null
      return {user,avatar}
    }))}
    
  },[usersList,avatars])

  useEffect(()=>{
    setContacts(users?.filter(user=>user.user.username!==currentUser?.username))
  },[users])

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser?._id)
      // Set the socket connection status to true
      setIsSocketConnected(true);
    }
  }, [currentUser]);
  

  useEffect(()=>{
    if (avatars){
      const data=avatars?.find(item=>item.filename===`${currentUser?.email}.jpg`)
      setUserAvatar(data)
    }

  },[avatars])

  return (
    
      <Context0.Provider value={isSocketConnected}>
         <MyOtherContext.Provider value={socket}>
         <MyContext.Provider value={currentUser}>
         <Container>
            <div className='container'>
              <Contact contacts={contacts} currentUser={currentUser} userAvatar={userAvatar}/>
            </div>
         </Container>
        </MyContext.Provider>
       </MyOtherContext.Provider>
      </Context0.Provider>
    );
};
const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    
  }
`;

export default Home;