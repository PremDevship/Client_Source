import React,{useState} from 'react'
import '../styles/userReg.css';
import {PostApiusers} from '../service.js';
import { withRouter, useHistory, Link } from 'react-router-dom';
export default function UserRegister() {
    const history = useHistory();
    const [Registeruser, setRegisteruser] = useState({
        firstname: '',
        lastname: '',
        email: '',
        Password: '',
        role: 0,
        status: 0,
    })

    function RegisterUser(data){
        console.log(data)
        switch(data.target.id){
            case 'firstname':
                setRegisteruser(prev => ({
                    ...prev,
                    firstname: data.target.value
                }))
                break;
                case 'lastname':
                    
                setRegisteruser(prev => ({
                    ...prev,
                    lastname: data.target.value
                }))
                
                break;
                case 'email':
                    setRegisteruser(prev => ({
                        ...prev,
                        email: data.target.value
                    }))
                    break;
                    case 'Password':
                        setRegisteruser(prev => ({
                            ...prev,
                            Password: data.target.value
                        }))
                        break;
        }
    }
    function handleRegisteruser(){
        let item = {Registeruser}
        console.log(item);
        PostApiusers(`user/Adduser`,item.Registeruser).then((res) => {
            console.log(res);
            if(res && !res.error){
                alert(res.message);
                history.push({
                    pathname: (`/Login`)
                })
            }else{
                alert(res ? res.message : 'someting went wrong in backend')
            }
        })
    }
    
    return (
        <div>
            <nav class="navbar navbar-light bg-info">
                <a class="navbar-brand" href="#">
                    <img src="https://w7.pngwing.com/pngs/419/473/png-transparent-computer-icons-user-profile-login-user-heroes-sphere-black-thumbnail.png" width="30" height="30" class="d-inline-block align-top" alt="" />
                    User Register here!
                </a>
            </nav>
            <h1>Register user</h1>
            <div className='container'>
                <div className='row'>
                    <div class="card text-center col-md-12 col-md-offset-6">
                        <div class="card-body ">

                            <form className='form-control form1'>
                                <div class="form-group">
                                    <label for="exampleInputEmail1">First name</label>
                                    <input type="email" class="form-control" id="firstname" onChange={(e) => RegisterUser(e)} aria-describedby="emailHelp" placeholder="First name" />

                                </div>
                                <div class="form-group">
                                    <label for="exampleInputEmail1">Last name</label>
                                    <input type="email" class="form-control" id="lastname" onChange={(e) => RegisterUser(e)} aria-describedby="emailHelp" placeholder="Last name" />

                                </div>
                                <div class="form-group">
                                    <label for="exampleInputEmail1">Email address</label>
                                    <input type="email" class="form-control" id="email" onChange={(e) => RegisterUser(e)} aria-describedby="emailHelp" placeholder="Enter email" />

                                </div>
                                <div class="form-group">
                                    <label for="exampleInputPassword1">Password</label>
                                    <input type="password" class="form-control" id="Password" onChange={(e) => RegisterUser(e)} placeholder="Password" />
                                </div>
                                <br />
                                <button type="button" class="btn btn-success" onClick={handleRegisteruser}>Register</button>
                                <p class="text-center text-muted mt-5 mb-0">Have already an account? <Link class="fw-bold text-body" to="/Login"><u>Login here</u></Link></p>
                            </form>


                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
