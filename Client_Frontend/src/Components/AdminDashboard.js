import React, { useState, useEffect } from 'react'
import { GetApiusers } from '../service';



export default function AdminDashboard() {
    const [getusers, setGetusers] = useState();
    const [userCount, setUsercount] = useState();
    console.log(getusers);

    console.log(userCount);

    useEffect(() => {
        if (!getusers) {
            Getuser()
        }
    }, [])

    function Getuser() {
        GetApiusers('user/Getuser').then(res => {
            if (res && !res.error) {
                setGetusers(res.data.users)
                setUsercount(res.data.userlength)
            }
            else {
                alert('something wrong')
            }
        })
    }
    return (
        <div>
            <nav class="navbar navbar-light bg-info">
                <a class="navbar-brand" href="#">
                    <img src="https://w7.pngwing.com/pngs/419/473/png-transparent-computer-icons-user-profile-login-user-heroes-sphere-black-thumbnail.png" width="30" height="30" class="d-inline-block align-top" alt="" />
                    Admin panel
                </a>
            </nav>
            <br />

            <div class="card text-white bg-info mb-3" style={{ width: '400px' }}>
                <div class="card-header">
                    <a class="navbar-brand" href="#">
                        <img src="https://w7.pngwing.com/pngs/419/473/png-transparent-computer-icons-user-profile-login-user-heroes-sphere-black-thumbnail.png" width="30" height="30" class="d-inline-block align-top" alt="" />
                        Total users
                    </a>
                </div>
                <div class="card-body bg-dark">
                    <h5 class="card-title">{userCount}</h5>
                </div>
            </div>

            <table class="table table-dark">
                <thead>
                    <tr>
                        <th>s.no</th>
                        <th>user name</th>
                        <th>User mail</th>
                    </tr>
                </thead>
                <tbody>
                    {getusers?.map((users, index) => {


                        return (
                            <tr class="table-active">
                                <th scope="row">{index + 1}</th>
                                <td class="table-active">{users.Firstname}</td>
                                <td>{users.Email}</td>
                            </tr>
                        )
                    })

                    }
                </tbody>
            </table>


        </div>
    )
}
