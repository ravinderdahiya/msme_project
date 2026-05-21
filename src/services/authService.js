import http from "../api/axios"


export const sendOtpApi = async  (mobile) =>{
    const res = await http.post("/otp/send-otp",{mobile});
    return res.data
}

export const verifyOtpApi = async (mobile, otp , latitude, longitude) => {
    const res = await http.post("/otp/verify-otp",{mobile, otp, latitude, longitude});
    return res.data
}

export const adminLoginApi = async (adminId, password) => {
    const res = await http.post("/user/admin-login", { adminId, password })
    return res.data
}

export const googleLoginApi = async (idToken) => {
    const res = await http.post("/user/google-login", { idToken })
    return res.data
}

export const logoutApi = async () => {
    const res = await http.post("/user/logout")
    return res.data
}
