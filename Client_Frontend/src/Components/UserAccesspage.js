import React, { useState, useContext, useEffect } from 'react'
import '../styles/userAccess.css';
import Button from '@mui/material/Button';
import Modal from 'react-modal';
import { withRouter, useHistory } from 'react-router-dom';
import AOS from 'aos';
import { GetApiusers, putAPI } from '../service';
import { loginpassData } from '../App'

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        width: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'antiquewhite',
        border: 'solid 2px brown'
    },
};
export default function UserAccesspage() {
    const { loginUser, setLoginUser } = useContext(loginpassData)
    const [userUpdateModelisopen, setuserUpdateModelisopen] = useState(false);
    const [getuserinfo, setUserinfo] = useState()
    var [updateuser, setupdateUser] = useState({
        Firstname: '',
        Lastname: '',
        Email: '',
    });
    const [selectedid, setselectid] = useState('')
    
   console.log(updateuser);

    AOS.init()

    const history = useHistory();

    useEffect(() => {
        if (!getuserinfo) {
            GetUserAccess()
        }
    }, [])
    function GetUserAccess() {
        GetApiusers('user/getUserDetails').then(res => {
            if (res && !res.error) {
                setUserinfo(res.data)
                setselectid(res.data.id)
            }
            else {
                alert('something wrong')
            }
        })
    }
    function userLogout() {
        localStorage.clear();
        history.push({
            pathname: (`/Login`)
        })
    }

    function userUpdate() {
        setuserUpdateModelisopen(true)
    }
    function userAccessUpdate(data) {
        switch (data.target.id) {
            case 'firstname':
                setupdateUser(previous => ({
                    ...previous,
                    Firstname: data.target.value
                }))
                break;



            case 'lastname':
                setupdateUser(previous => ({
                    ...previous,
                    Lastname: data.target.value
                }))
                break;

            case 'email':
                setupdateUser(previous => ({
                    ...previous,
                    Email: data.target.value
                }))
                break;


        }
    }
    function Updateuser(id) {
        let updateitem = { updateuser }
        console.log(updateitem)
        putAPI(`user/Edituser/${id}`, updateitem.updateuser).then((res) => {
            if (res && !res.error) {
                alert(res.message)
                setuserUpdateModelisopen(false)
                GetUserAccess()
            } else {
                alert(res ? res.message : 'Something went wrong')
            }
        })
    }
    return (
        <div>
            <h1>user page</h1>
            <Button variant="outlined" color="error" onClick={() => userLogout()}>
                Logout
            </Button>
            <div data-aos="zoom-in-up" data-aos-duration="1000">

                <section class="vh-100 sectionStyle">
                    <div class="container py-5 h-100">
                        <div class="row d-flex justify-content-center align-items-center h-100">
                            <div class="col col-lg-6 mb-4 mb-lg-0">
                                <div class="card mb-3 style1">
                                    <div class="row g-0">
                                        <div class="col-md-4 gradient-custom text-center text-white style2">
                                            <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                                                alt="Avatar" class="img-fluid my-5 style3" />
                                            <h5 style={{ color: 'black' }}>{getuserinfo?.Firstname +' '+ getuserinfo?.Lastname}</h5>
                                            <p style={{ color: 'black' }}>Web Designer</p>
                                            {/* <i class="far fa-edit mb-5"></i> */}
                                            <Button color="secondary" onClick={() => userUpdate()}>Update user</Button>
                                        </div>
                                        <div class="col-md-8">
                                            <div class="card-body p-4">
                                                <h6>Information</h6>
                                                <hr class="mt-0 mb-4" />
                                                <div class="row pt-1">
                                                    <div class="col-6 mb-3">
                                                        <h6>Email</h6>
                                                        <p class="text-muted">{getuserinfo?.Email}</p>
                                                    </div>
                                                    <div class="col-6 mb-3">
                                                        <h6>Phone</h6>
                                                        <p class="text-muted">123 456 789</p>
                                                    </div>
                                                </div>
                                                <h6>Projects</h6>
                                                <hr class="mt-0 mb-4" />
                                                <div class="row pt-1">
                                                    <div class="col-6 mb-3">
                                                        <h6>Recent</h6>
                                                        <p class="text-muted">Lorem ipsum</p>
                                                    </div>
                                                    <div class="col-6 mb-3">
                                                        <h6>Most Viewed</h6>
                                                        <p class="text-muted">Dolor sit amet</p>
                                                    </div>
                                                </div>
                                                <div class="d-flex justify-content-start">
                                                    <a href="#!"><i class="fab fa-facebook-f fa-lg me-3"></i></a>
                                                    <a href="#!"><i class="fab fa-twitter fa-lg me-3"></i></a>
                                                    <a href="#!"><i class="fab fa-instagram fa-lg"></i></a>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Modal
                isOpen={userUpdateModelisopen}
                style={customStyles}
                ariaHideApp={false}
            >
                <form>
                    <h1>Update user data</h1>
                    <div class="form-group">
                        <label for="exampleInputEmail1">Firstname</label>
                        <input type="text" class="form-control" value={updateuser?.Firstname} onChange={(e) => userAccessUpdate(e)} id="firstname" aria-describedby="emailHelp" placeholder="Firstname" />
                    </div>

                    <div class="form-group">
                        <label for="exampleInputPassword1">Lastname</label>
                        <input type="text" class="form-control" value={updateuser?.Lastname} onChange={(e) => userAccessUpdate(e)} id="lastname" placeholder="Lastname" />
                    </div>

                    <div class="form-group">
                        <label for="exampleInputPassword1">email</label>
                        <input type="email" class="form-control" value={updateuser?.Email} onChange={(e) => userAccessUpdate(e)} id="email" placeholder="email" />
                    </div>



                    <Button color='success' onClick={() => { Updateuser(selectedid) }}>update</Button>



                </form>


                <Button variant="outlined" onClick={() => { setuserUpdateModelisopen(false) }} >
                    Cancel
                </Button>
            </Modal>
        </div>
    )
}
