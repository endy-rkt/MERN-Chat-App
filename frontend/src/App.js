import { Route,Routes } from "react-router-dom";
import SetAvatar from "./pages/SetAvatar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Page404 from "./pages/Page404";

function App() {
  return (
   <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/setAvatar" element={<SetAvatar/>}/>
        <Route path="*" element={<Page404/>}/>
   </Routes>
  );
}

export default App;
