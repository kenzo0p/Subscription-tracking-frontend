

import { Route, Routes } from "react-router-dom";
import { SignupForm } from "./auth/signup";
import { LoginForm } from "./auth/login";
import {  SidebarLayout } from "./sidebar/SideBarLayout";
import SubscriptionTrackingTable from "./components/TrackTable/SubTracker";

function App() {
  

  return (
    <Routes>
      <Route path="/login" element={<LoginForm/>}/>
      <Route path="/signup" element={<SignupForm/>}/>
      <Route path="/" element={<SidebarLayout/>}>
      
        <Route path="sub-track" element={<SubscriptionTrackingTable/>}  />
      
      </Route>
    </Routes>
  );
}

export default App;
