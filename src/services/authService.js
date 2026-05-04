import axios from 'axios';

const http = axios.create({
    baseURL:import.meta.env.VITE_SERVER_URL || 'http://localhost:8080',
    withCredentials: true,
})


export const sendOtpApi = async  (mobile) =>{
    const res = await http.post("/otp/send-otp",{mobile});
    return res.data
}

export const verifyOtpApi = async (mobile, otp) => {
    const res = await http.post("/otp/verify-otp",{mobile, otp});
    return res.data
}