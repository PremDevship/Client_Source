import React from "react";
import {Route, BrowserRouter} from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import UserAccesspage from "./UserAccesspage";
import UserLogin from "./UserLogin";
import UserRegister from "./UserRegister";



function Router(){
    return(
        <div>
            <BrowserRouter>
            <Route exact path="/" component={UserRegister} />
            <Route path="/AdminDashboard" component={AdminDashboard} />
            <Route path="/Login" component={UserLogin} />
            <Route path="/Userpage" component={UserAccesspage} />
            </BrowserRouter>
        </div>
    )
}
export default Router;