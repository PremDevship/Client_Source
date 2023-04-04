import axios from 'axios'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const base_url = "http://localhost:3006/api/"

export async function PostApiusers(url,data){
    return axios.post(`${base_url}${url}`,data).then((res) => {
      return  res.data
    }).catch((error) => {
        console.log(error);
        displaytoast(error)
        return null;
    });
}

export async function Loginuser(url,data){
    return axios.post(`${base_url}${url}`,data).then((res) => {
      return  res.data
    }).catch((error) => {
        console.log(error);
        
        return null;
    });
}



export async function putAPI(url,data) {
    return axios({url:`${base_url}${url}`,method:'put',headers:{
        authorization: 'Bearer ' + localStorage.getItem('jwtoken')
    },data:data}).then((res) => {
        return res.data
    }).catch((error) => {
        console.log(error);
        displaytoast(error)
        return null
    });
}

export async function GetApiusers(url){
    return axios({url:`${base_url}${url}`,method:'get',headers:{
        authorization: 'Bearer ' + localStorage.getItem('jwtoken')
    }}).then((res) => {
      return  res.data
    }).catch((error) => {
        console.log(error);
        displaytoast(error)
        return null;
    });
}

function displaytoast(err){
    var message = err.response.data.message
      if(typeof message == 'object'){
          message.forEach(element => {
              if(element.msg){
                  console.log(element.msg);
                  toast.error(element.msg)
                  
              }
          });
      }
      else if(typeof message == 'string'){
                   toast.error(message)
      }
  }