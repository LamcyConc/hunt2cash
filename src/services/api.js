import axios from "axios"
import Cookies from "universal-cookie"

const cookies = new Cookies()

const api = axios.create({
    baseURL: "http://localhost:5020/api/v1",
})

// Automatically attach token to every request
api.interceptors.request.use((config) => {
    const token = cookies.get("token")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Auth
export const loginUser    = (data) => api.post("/login", data)
export const registerUser = (data) => api.post("/register", data)
export const myProfile    = ()     => api.get("/account")
export const logOut       = ()     => api.post("/logout")
export const deleteUserAccount = (id)  => api.delete(`/deleteprofile/${id}`)
export const requestOtpApi      = (data) => api.post("/request-otp", data)
export const forgotPasswordAPI  = (data) => api.post("/forgot-password", data)
export const changeUserPassword = (data) => api.post("/change-password", data)

// Banking
export const transferFunds      = (data) => api.post("/transfer", data)
export const depositFunds       = (data) => api.post("/deposit", data)
export const withdrawFunds      = (data) => api.post("/withdraw", data)
export const getTransactionHistory = (data) => api.post("/history", data)
export const findAccountName    = (data) => api.post("/lookup", data)

// Crypto
export const getCryptoPrices           = ()     => api.get("/prices")
export const getCryptoWallet           = ()     => api.get("/wallet")
export const depositCrypto             = (data) => api.post("/depositcrypto", data)
export const sellCrypto                = (data) => api.post("/sellcrypto", data)
export const getCryptoTransactionHistory = ()   => api.get("/cryptotransactions")

export const getExchangeDetails    = ()     => api.get("/exchange/exchange-details")
export const topUpLiquidity        = (data) => api.post("/exchange/topup", data)
export const updateWalletAddresses = (data) => api.patch("/exchange/wallets", data)

// PIN
export const setPin    = (data) => api.post("/setpin", data)
export const changePin = (data) => api.patch("/changepin", data)
export const resetPin  = (data) => api.patch("/reset", data)

// Admin
export const getAllUsers        = ()     => api.get("/admin/allusers")
export const toggleUserStatus  = (id)   => api.patch(`/admin/user/${id}/toggle-status`)
export const deleteUser        = (id)   => api.delete(`/admin/deleteuser/${id}`)
export const sendAdminMessage  = (data) => api.post("/admin/message", data)
export const getAdminMessage  = (context = "general") => api.get(`/admin/message?context=${context}`)

export default api;