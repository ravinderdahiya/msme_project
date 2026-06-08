import http from "../api/axios"

let publicIpPromise = null

const getPublicIp = async () => {
    if (!publicIpPromise) {
        const lookupUrl = import.meta.env.VITE_PUBLIC_IP_LOOKUP_URL || "https://api.ipify.org?format=json"
        publicIpPromise = fetch(lookupUrl)
            .then((response) => response.ok ? response.json() : null)
            .then((data) => data?.ip || data?.query || data?.address || null)
            .catch(() => null)
    }
    return publicIpPromise
}

const withPublicIp = async (payload) => {
    const clientIp = await getPublicIp()
    return clientIp ? { ...payload, clientIp } : payload
}


export const sendOtpApi = async  (mobile) =>{
    const res = await http.post("/otp/send-otp",{mobile});
    return res.data
}

export const verifyOtpApi = async (mobile, otp, latitude, longitude, accuracy) => {
    const res = await http.post("/otp/verify-otp", await withPublicIp({ mobile, otp, latitude, longitude, accuracy }));
    return res.data
}

export const adminLoginApi = async (adminId, password) => {
    const res = await http.post("/user/admin-login", await withPublicIp({ adminId, password }))
    return res.data
}

export const googleLoginApi = async (idToken) => {
    const res = await http.post("/user/google-login", await withPublicIp({ idToken }))
    return res.data
}

export const logoutApi = async () => {
    const res = await http.post("/user/logout")
    return res.data
}
