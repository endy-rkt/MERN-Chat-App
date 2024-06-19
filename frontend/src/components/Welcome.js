import React,{useContext} from 'react'
import { MyContext } from '../pages/Home'
import robot from "../images/robot.gif"
import styled from "styled-components";

const Welcome = () => {
  const user=useContext(MyContext)
  
  return (
    <Container>
      <img className='robot' src={robot} alt="Hello bot"/>
      <h1>Welcome, <span>{user?.username}!</span> </h1><br/>
      <h3>Please select a chat to Start messaging.</h3>
    </Container>
  )
}
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
  img {
    height: 20rem;
  }
  span {
    color: #4e0eff;
  }
  h1{
    font-size:25px;
  }
  h3{
    font-size:15px;
  }
`;
export default Welcome