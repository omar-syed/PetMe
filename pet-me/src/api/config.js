import axios from 'axios';
import Cookies from 'js-cookie';
axios.defaults.withCredentials = true;

export const axiosInstance = axios.create({
    baseURL: 'https://petme.pythonanywhere.com/'
    // baseURL: 'http://localhost:8000/'
    
})

axiosInstance.interceptors.request.use(function (config) {
    let access = Cookies.get('access')
    let refresh = Cookies.get('refresh')
    
    if (access) {
        config.headers['Authorization']="Bearer " + access

      } else if ((refresh) && !(config.url === '/accounts/jwt/refresh/')) {
        axiosInstance.post('/accounts/jwt/refresh/', {'refresh':refresh}).then((res)=>{
          Cookies.set('access', res.data.access, { expires: 1})
          config.headers['Authorization']="Bearer " + access
  
      }).catch(err => {console.log(err)})
      }
    
    return config;

}, function (error) {
    return Promise.reject(error);
});


axiosInstance.interceptors.response.use(function (response) {   
    return response;

}, function (error) {
    console.log(error)
    if ((error.response.status < 500) && !(error.config.url.includes('accounts'))) {
        let alert = document.getElementById("fail")
        alert.hidden = false;
        alert.lastChild.innerText = error.response.data
        setTimeout(() => {
            document.getElementById("fail").hidden = true;
        }, 3000);
    }
    return Promise.reject(error);
});
