import { useFormik } from "formik"
import * as yup from "yup"
import { useNavigate, Link, useLocation } from "react-router-dom"
import Cookies from "universal-cookie"
import { useState } from "react"
import { loginUser } from "../../services/api"
import ShieldLogo from "../../components/common/ShieldLogo"
import Wordmark from "../../components/common/Wordmark"

const primary = "#0F3D2E"
const primaryMid = "#124734"
const primaryLight = "#0B5D3B"
const accent = "#E6A800"
const accentBright = "#F4B400"

const WHATSAPP_NUMBER = "2347039404024"

const Login = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const cookies = new Cookies()

    const [showPassword, setShowPassword] = useState(false)
    const [isSuspended, setIsSuspended] = useState(false)
    const successMessage = location.state?.message

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },

        onSubmit: async (values, { setSubmitting, setStatus }) => {
            setIsSuspended(false)
            try {
                const response = await loginUser(values)

                cookies.set("token", response.data.token, {
                    path: "/",
                    secure: true,
                    sameSite: "strict"
                })
                cookies.set("user", response.data.data, {
                    path: "/",
                    secure: true,
                    sameSite: "strict"
                })

                setTimeout(() => {
                    if (response.data.data.roles === "admin") {
                        window.location.href = "/admin/dashboard"
                    } else {
                        window.location.href = "/dashboard"
                    }
                }, 100)

            } catch (error) {
                const msg = error.response?.data?.message || "Something went wrong"
                setStatus(msg)
                if (error.response?.status === 403) {
                    setIsSuspended(true)
                }
            } finally {
                setSubmitting(false)
            }
        },

        validationSchema: yup.object({
            email: yup
                .string()
                .required("Email is required")
                .email("Enter a valid email address"),
            password: yup
                .string()
                .required("Password is required"),
        }),
    })

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", minHeight: "100vh", display: "flex" }}>

            <div
                className="col-12 col-md-6 d-flex flex-column justify-content-center"
                style={{
                    padding: "60px 5%",
                    background: "#FFFFFF",
                    minHeight: "100vh",
                }}
            >
                <div style={{ maxWidth: "400px", width: "100%" }}>

                    <div
                        className="d-flex align-items-center gap-2 mb-5"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate("/")}
                    >
                        <ShieldLogo size={34} />
                        <Wordmark size={17} />
                    </div>

                    <h2 style={{
                        color: primary,
                        fontWeight: "bold",
                        fontSize: "32px",
                        marginBottom: "8px",
                    }}>
                        Welcome back
                    </h2>
                    <p style={{ color: "#888", fontSize: "14px", marginBottom: "36px" }}>
                        Sign in to access your Hunt2Cash account
                    </p>

                    {successMessage && (
                        <div className="mb-4 p-3" style={{
                            background: "rgba(15,61,46,0.06)",
                            border: `1px solid rgba(15,61,46,0.15)`,
                            borderRadius: "8px",
                            color: primary,
                            fontSize: "13px"
                        }}>
                            {successMessage}
                        </div>
                    )}

                    {formik.status && (
                        <div className="mb-4 p-3" style={{
                            background: "rgba(220,53,69,0.06)",
                            border: "1px solid rgba(220,53,69,0.15)",
                            borderRadius: "8px",
                            color: "#dc3545",
                            fontSize: "13px"
                        }}>
                            <p style={{ margin: isSuspended ? "0 0 12px" : 0 }}>
                                {formik.status}
                            </p>

                            {isSuspended && (
                                <a
                                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hello%2C%20my%20Hunt2Cash%20account%20has%20been%20suspended.%20Please%20help%20me%20resolve%20this.`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        background: "#25D366",
                                        color: "#FFFFFF",
                                        padding: "8px 16px",
                                        borderRadius: "8px",
                                        fontSize: "13px",
                                        fontWeight: "bold",
                                        textDecoration: "none",
                                        transition: "background 0.2s"
                                    }}
                                    onMouseOver={e => e.currentTarget.style.background = "#1ebe57"}
                                    onMouseOut={e => e.currentTarget.style.background = "#25D366"}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                    WhatsApp
                                </a>
                            )}
                        </div>
                    )}

                    <div className="mb-4">
                        <label
                            htmlFor="email"
                            style={{
                                display: "block",
                                color: "#555",
                                fontSize: "11px",
                                letterSpacing: "1.5px",
                                fontWeight: "bold",
                                marginBottom: "8px",
                            }}
                        >
                            EMAIL ADDRESS
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            onChange={formik.handleChange}
                            value={formik.values.email}
                            style={{
                                width: "100%",
                                padding: "13px 16px",
                                borderRadius: "8px",
                                border: `1.5px solid ${formik.touched.email && formik.errors.email ? "#dc3545" : "#ddd"}`,
                                fontSize: "14px",
                                fontFamily: "'Inter', sans-serif",
                                outline: "none",
                                transition: "border 0.2s",
                                background: "#fafafa",
                            }}
                            onFocus={e => e.target.style.border = `1.5px solid ${primary}`}
                            onBlur={e => {
                                formik.handleBlur(e)
                                e.target.style.border = `1.5px solid ${formik.errors.email ? "#dc3545" : "#ddd"}`
                            }}
                        />
                        {formik.touched.email && formik.errors.email && (
                            <small className="text-danger">{formik.errors.email}</small>
                        )}
                    </div>

                    <div className="mb-3">
                        <label
                            htmlFor="password"
                            style={{
                                display: "block",
                                color: "#555",
                                fontSize: "11px",
                                letterSpacing: "1.5px",
                                fontWeight: "bold",
                                marginBottom: "8px",
                            }}
                        >
                            PASSWORD
                        </label>
                        <div style={{ position: "relative" }}>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter your password"
                                onChange={formik.handleChange}
                                value={formik.values.password}
                                style={{
                                    width: "100%",
                                    padding: "13px 44px 13px 16px",
                                    borderRadius: "8px",
                                    border: `1.5px solid ${formik.touched.password && formik.errors.password ? "#dc3545" : "#ddd"}`,
                                    fontSize: "14px",
                                    fontFamily: "'Inter', sans-serif",
                                    outline: "none",
                                    transition: "border 0.2s",
                                    background: "#fafafa",
                                }}
                                onFocus={e => e.target.style.border = `1.5px solid ${primary}`}
                                onBlur={e => {
                                    formik.handleBlur(e)
                                    e.target.style.border = `1.5px solid ${formik.errors.password ? "#dc3545" : "#ddd"}`
                                }}
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: "absolute",
                                    right: "14px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer",
                                    fontSize: "16px",
                                    color: "#aaa",
                                    userSelect: "none",
                                }}
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </span>
                        </div>
                        {formik.touched.password && formik.errors.password && (
                            <small className="text-danger">{formik.errors.password}</small>
                        )}
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px", color: "#555" }}>
                            <input type="checkbox" style={{ accentColor: primary, width: 15, height: 15 }} />
                            Remember me
                        </label>
                        <span
                            onClick={() => navigate("/forgot-password")}
                            style={{ color: accent, fontSize: "14px", cursor: "pointer", fontWeight: "bold" }}
                            onMouseOver={e => e.target.style.color = accentBright}
                            onMouseOut={e => e.target.style.color = accent}
                        >
                            Forgot password?
                        </span>
                    </div>

                    <button
                        type="submit"
                        onClick={formik.handleSubmit}
                        disabled={formik.isSubmitting}
                        style={{
                            width: "100%",
                            padding: "14px",
                            background: formik.isSubmitting ? "#aaa" : accent,
                            color: primary,
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "15px",
                            fontWeight: "bold",
                            fontFamily: "'Inter', sans-serif",
                            letterSpacing: "2px",
                            cursor: formik.isSubmitting ? "not-allowed" : "pointer",
                            transition: "background 0.2s",
                            marginBottom: "24px",
                        }}
                        onMouseOver={e => { if (!formik.isSubmitting) e.target.style.background = accentBright }}
                        onMouseOut={e => { if (!formik.isSubmitting) e.target.style.background = accent }}
                    >
                        {formik.isSubmitting ? "SIGNING IN..." : "SIGN IN"}
                    </button>

                    <div className="d-flex align-items-center gap-3 mb-4">
                        <div style={{ flex: 1, height: "1px", background: "#e8e8e8" }} />
                        <span style={{ color: "#aaa", fontSize: "13px" }}>or</span>
                        <div style={{ flex: 1, height: "1px", background: "#e8e8e8" }} />
                    </div>

                    <p style={{ textAlign: "center", color: "#888", fontSize: "14px", margin: 0 }}>
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            style={{ color: primary, fontWeight: "bold", textDecoration: "none" }}
                            onMouseOver={e => e.target.style.color = accent}
                            onMouseOut={e => e.target.style.color = primary}
                        >
                            Create one free
                        </Link>
                    </p>

                </div>
            </div>

            <div
                className="d-none d-md-flex flex-column justify-content-center align-items-center"
                style={{
                    flex: 1,
                    background: `linear-gradient(160deg, ${primary} 0%, ${primaryMid} 50%, ${primaryLight} 100%)`,
                    padding: "60px 40px",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <div style={{
                    position: "absolute", top: "-80px", right: "-80px",
                    width: "300px", height: "300px", borderRadius: "50%",
                    background: "rgba(255,255,255,0.03)", pointerEvents: "none"
                }} />
                <div style={{
                    position: "absolute", bottom: "-60px", left: "-60px",
                    width: "250px", height: "250px", borderRadius: "50%",
                    background: "rgba(255,255,255,0.03)", pointerEvents: "none"
                }} />

                <div style={{ textAlign: "center", position: "relative", zIndex: 1, maxWidth: "360px" }}>

                    <div style={{ marginBottom: "28px" }}>
                        <ShieldLogo size={72} bgColor="#FFFFFF" letterColor={primary} accentColor={accent} />
                    </div>

                    <h2 style={{
                        color: "#FFFFFF",
                        fontSize: "clamp(32px, 4vw, 48px)",
                        fontWeight: "bold",
                        lineHeight: 1.2,
                        marginBottom: "20px",
                    }}>
                        Secure.<br />Simple.<br />Smart.
                    </h2>

                    <p style={{
                        color: "rgba(255,255,255,0.7)",
                        fontSize: "15px",
                        lineHeight: 1.8,
                        marginBottom: "40px",
                    }}>
                        Everything you need to manage your<br />money with confidence.
                    </p>

                    {[
                        { icon: "🔒", title: "PIN Protected Transfers", sub: "Every transaction secured" },
                        { icon: "⚡", title: "Instant Fund Transfers", sub: "Send money in seconds" },
                        { icon: "₿", title: "Sell Crypto to Naira", sub: "BTC, ETH & USDT supported" },
                        { icon: "📋", title: "Full Transaction History", sub: "Track every naira" },
                    ].map((item, i) => (
                        <div
                            key={i}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "14px",
                                padding: "14px 18px",
                                marginBottom: "10px",
                                background: "rgba(255,255,255,0.07)",
                                borderRadius: "10px",
                                border: "1px solid rgba(255,255,255,0.1)",
                                textAlign: "left",
                                transition: "background 0.2s",
                            }}
                            onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
                            onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
                        >
                            <div style={{
                                width: "38px", height: "38px",
                                background: `${accent}25`,
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "18px",
                                flexShrink: 0,
                            }}>
                                {item.icon}
                            </div>
                            <div>
                                <div style={{ color: "#FFFFFF", fontWeight: "bold", fontSize: "13px" }}>
                                    {item.title}
                                </div>
                                <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "12px", marginTop: "2px" }}>
                                    {item.sub}
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            </div>

        </div>
    )
}

export default Login;