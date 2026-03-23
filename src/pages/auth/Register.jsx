import { useFormik } from "formik"
import * as yup from "yup"
import { useNavigate, Link } from "react-router-dom"
import ShieldLogo from "../../components/common/ShieldLogo"
import Wordmark from "../../components/common/Wordmark"
import { registerUser } from "../../services/api"
import { useState } from "react"

const primary      = "#0F3D2E"
const primaryMid   = "#124734"
const primaryLight = "#0B5D3B"
const accent       = "#E6A800"
const accentBright = "#F4B400"

const Register = () => {
    const navigate = useNavigate()

    const [showPassword, setShowPassword]               = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const formik = useFormik({
        initialValues: {
            firstName:       "",
            lastName:        "",
            email:           "",
            password:        "",
            confirmPassword: "",
        },

        onSubmit: async (values, { setSubmitting, setStatus }) => {
            try {
                await registerUser({
                    firstName: values.firstName,
                    lastName:  values.lastName,
                    email:     values.email,
                    password:  values.password,
                })

                navigate("/login", {
                    state: { message: "Account created successfully! Please sign in." }
                })

            } catch (error) {
                setStatus(error.response?.data?.message || "Something went wrong")
            } finally {
                setSubmitting(false)
            }
        },

        validationSchema: yup.object({
            firstName: yup
                .string()
                .required("First name is required"),
            lastName: yup
                .string()
                .required("Last name is required"),
            email: yup
                .string()
                .required("Email is required")
                .email("Enter a valid email address"),
            password: yup
                .string()
                .required("Password is required")
                .min(6, "Password must be at least 6 characters"),
            confirmPassword: yup
                .string()
                .required("Please confirm your password")
                .oneOf([yup.ref("password")], "Passwords do not match"),
        }),
    })

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", minHeight: "100vh", display: "flex" }}>
            <div
                className="col-12 col-md-6 d-flex flex-column justify-content-center"
                style={{
                    padding:   "60px 5%",
                    background: "#FFFFFF",
                    minHeight: "100vh",
                }}
            >
                <div style={{ maxWidth: "400px", width: "100%" }}>
                    <div
                        className="d-flex align-items-center gap-2 mb-4"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate("/")}
                    >
                        <ShieldLogo size={34} />
                        <Wordmark size={17} />
                    </div>
                    
                    <h2 style={{
                        color:        primary,
                        fontWeight:   "bold",
                        fontSize:     "28px",
                        marginBottom: "8px",
                    }}>
                        Create your account
                    </h2>
                    <p style={{ color: "#888", fontSize: "14px", marginBottom: "28px" }}>
                        Join Hunt2Cash today — it's free
                    </p>

                    {/* Server error */}
                    {formik.status && (
                        <div className="mb-4 p-3" style={{
                            background:   "rgba(220,53,69,0.06)",
                            border:       "1px solid rgba(220,53,69,0.15)",
                            borderRadius: "8px",
                            color:        "#dc3545",
                            fontSize:     "13px"
                        }}>
                            {formik.status}
                        </div>
                    )}

                    {/* First name + Last name row */}
                    <div className="row g-3 mb-3">
                        <div className="col-6">
                            <label style={{
                                display:       "block",
                                color:         "#555",
                                fontSize:      "11px",
                                letterSpacing: "1.5px",
                                fontWeight:    "bold",
                                marginBottom:  "8px",
                            }}>
                                FIRST NAME
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                placeholder="John"
                                onChange={formik.handleChange}
                                value={formik.values.firstName}
                                style={{
                                    width:        "100%",
                                    padding:      "12px 14px",
                                    borderRadius: "8px",
                                    border:       `1.5px solid ${formik.touched.firstName && formik.errors.firstName ? "#dc3545" : "#ddd"}`,
                                    fontSize:     "14px",
                                    fontFamily:   "'Inter', sans-serif",
                                    outline:      "none",
                                    background:   "#fafafa",
                                    transition:   "border 0.2s",
                                }}
                                onFocus={e => e.target.style.border = `1.5px solid ${primary}`}
                                onBlur={e => {
                                    formik.handleBlur(e)
                                    e.target.style.border = `1.5px solid ${formik.errors.firstName ? "#dc3545" : "#ddd"}`
                                }}
                            />
                            {formik.touched.firstName && formik.errors.firstName && (
                                <small className="text-danger">{formik.errors.firstName}</small>
                            )}
                        </div>
                        <div className="col-6">
                            <label style={{
                                display:       "block",
                                color:         "#555",
                                fontSize:      "11px",
                                letterSpacing: "1.5px",
                                fontWeight:    "bold",
                                marginBottom:  "8px",
                            }}>
                                LAST NAME
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Doe"
                                onChange={formik.handleChange}
                                value={formik.values.lastName}
                                style={{
                                    width:        "100%",
                                    padding:      "12px 14px",
                                    borderRadius: "8px",
                                    border:       `1.5px solid ${formik.touched.lastName && formik.errors.lastName ? "#dc3545" : "#ddd"}`,
                                    fontSize:     "14px",
                                    fontFamily:   "'Inter', sans-serif",
                                    outline:      "none",
                                    background:   "#fafafa",
                                    transition:   "border 0.2s",
                                }}
                                onFocus={e => e.target.style.border = `1.5px solid ${primary}`}
                                onBlur={e => {
                                    formik.handleBlur(e)
                                    e.target.style.border = `1.5px solid ${formik.errors.lastName ? "#dc3545" : "#ddd"}`
                                }}
                            />
                            {formik.touched.lastName && formik.errors.lastName && (
                                <small className="text-danger">{formik.errors.lastName}</small>
                            )}
                        </div>
                    </div>

                    {/* Email */}
                    <div className="mb-3">
                        <label style={{
                            display:       "block",
                            color:         "#555",
                            fontSize:      "11px",
                            letterSpacing: "1.5px",
                            fontWeight:    "bold",
                            marginBottom:  "8px",
                        }}>
                            EMAIL ADDRESS
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            onChange={formik.handleChange}
                            value={formik.values.email}
                            style={{
                                width:        "100%",
                                padding:      "12px 16px",
                                borderRadius: "8px",
                                border:       `1.5px solid ${formik.touched.email && formik.errors.email ? "#dc3545" : "#ddd"}`,
                                fontSize:     "14px",
                                fontFamily:   "'Inter', sans-serif",
                                outline:      "none",
                                background:   "#fafafa",
                                transition:   "border 0.2s",
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

                    {/* Password */}
                    <div className="mb-3">
                        <label style={{
                            display:       "block",
                            color:         "#555",
                            fontSize:      "11px",
                            letterSpacing: "1.5px",
                            fontWeight:    "bold",
                            marginBottom:  "8px",
                        }}>
                            PASSWORD
                        </label>
                        <div style={{ position: "relative" }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Min. 6 characters"
                                onChange={formik.handleChange}
                                value={formik.values.password}
                                style={{
                                    width:        "100%",
                                    padding:      "12px 44px 12px 16px",
                                    borderRadius: "8px",
                                    border:       `1.5px solid ${formik.touched.password && formik.errors.password ? "#dc3545" : "#ddd"}`,
                                    fontSize:     "14px",
                                    fontFamily:   "'Inter', sans-serif",
                                    outline:      "none",
                                    background:   "#fafafa",
                                    transition:   "border 0.2s",
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
                                    position:   "absolute",
                                    right:      "14px",
                                    top:        "50%",
                                    transform:  "translateY(-50%)",
                                    cursor:     "pointer",
                                    fontSize:   "16px",
                                    color:      "#aaa",
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

                    {/* Confirm Password */}
                    <div className="mb-4">
                        <label style={{
                            display:       "block",
                            color:         "#555",
                            fontSize:      "11px",
                            letterSpacing: "1.5px",
                            fontWeight:    "bold",
                            marginBottom:  "8px",
                        }}>
                            CONFIRM PASSWORD
                        </label>
                        <div style={{ position: "relative" }}>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Repeat your password"
                                onChange={formik.handleChange}
                                value={formik.values.confirmPassword}
                                style={{
                                    width:        "100%",
                                    padding:      "12px 44px 12px 16px",
                                    borderRadius: "8px",
                                    border:       `1.5px solid ${formik.touched.confirmPassword && formik.errors.confirmPassword ? "#dc3545" : "#ddd"}`,
                                    fontSize:     "14px",
                                    fontFamily:   "'Inter', sans-serif",
                                    outline:      "none",
                                    background:   "#fafafa",
                                    transition:   "border 0.2s",
                                }}
                                onFocus={e => e.target.style.border = `1.5px solid ${primary}`}
                                onBlur={e => {
                                    formik.handleBlur(e)
                                    e.target.style.border = `1.5px solid ${formik.errors.confirmPassword ? "#dc3545" : "#ddd"}`
                                }}
                            />
                            <span
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={{
                                    position:   "absolute",
                                    right:      "14px",
                                    top:        "50%",
                                    transform:  "translateY(-50%)",
                                    cursor:     "pointer",
                                    fontSize:   "16px",
                                    color:      "#aaa",
                                    userSelect: "none",
                                }}
                            >
                                {showConfirmPassword ? "🙈" : "👁️"}
                            </span>
                        </div>
                        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                            <small className="text-danger">{formik.errors.confirmPassword}</small>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        onClick={formik.handleSubmit}
                        disabled={formik.isSubmitting}
                        style={{
                            width:         "100%",
                            padding:       "14px",
                            background:    formik.isSubmitting ? "#aaa" : accent,
                            color:         primary,
                            border:        "none",
                            borderRadius:  "8px",
                            fontSize:      "15px",
                            fontWeight:    "bold",
                            fontFamily:    "'Inter', sans-serif",
                            letterSpacing: "2px",
                            cursor:        formik.isSubmitting ? "not-allowed" : "pointer",
                            transition:    "background 0.2s",
                            marginBottom:  "24px",
                        }}
                        onMouseOver={e => { if (!formik.isSubmitting) e.target.style.background = accentBright }}
                        onMouseOut={e  => { if (!formik.isSubmitting) e.target.style.background = accent }}
                    >
                        {formik.isSubmitting ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
                    </button>

                    {/* Divider */}
                    <div className="d-flex align-items-center gap-3 mb-4">
                        <div style={{ flex: 1, height: "1px", background: "#e8e8e8" }} />
                        <span style={{ color: "#aaa", fontSize: "13px" }}>or</span>
                        <div style={{ flex: 1, height: "1px", background: "#e8e8e8" }} />
                    </div>

                    {/* Login link */}
                    <p style={{ textAlign: "center", color: "#888", fontSize: "14px", margin: 0 }}>
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            style={{ color: primary, fontWeight: "bold", textDecoration: "none" }}
                            onMouseOver={e => e.target.style.color = accent}
                            onMouseOut={e  => e.target.style.color = primary}
                        >
                            Sign in
                        </Link>
                    </p>

                </div>
            </div>

            
            <div
                className="d-none d-md-flex flex-column justify-content-center align-items-center"
                style={{
                    flex:       1,
                    background: `linear-gradient(160deg, ${primary} 0%, ${primaryMid} 50%, ${primaryLight} 100%)`,
                    padding:    "60px 40px",
                    position:   "relative",
                    overflow:   "hidden",
                }}
            >
                {/* Background decorations */}
                <div style={{
                    position:   "absolute", top: "-80px", right: "-80px",
                    width:      "300px", height: "300px", borderRadius: "50%",
                    background: "rgba(255,255,255,0.03)", pointerEvents: "none"
                }} />
                <div style={{
                    position:   "absolute", bottom: "-60px", left: "-60px",
                    width:      "250px", height: "250px", borderRadius: "50%",
                    background: "rgba(255,255,255,0.03)", pointerEvents: "none"
                }} />

                <div style={{ textAlign: "center", position: "relative", zIndex: 1, maxWidth: "360px" }}>

                    {/* Shield */}
                    <div style={{ marginBottom: "28px" }}>
                        <ShieldLogo size={72} bgColor="#FFFFFF" letterColor={primary} accentColor={accent} />
                    </div>

                    {/* Tagline */}
                    <h2 style={{
                        color:        "#FFFFFF",
                        fontSize:     "clamp(28px, 4vw, 44px)",
                        fontWeight:   "bold",
                        lineHeight:   1.2,
                        marginBottom: "20px",
                    }}>
                        Join Thousands<br />
                        <span style={{ color: accent }}>Already Trading.</span>
                    </h2>

                    <p style={{
                        color:        "rgba(255,255,255,0.7)",
                        fontSize:     "15px",
                        lineHeight:   1.8,
                        marginBottom: "40px",
                    }}>
                        Create your free account and start
                        banking and trading crypto in minutes.
                    </p>

                    {/* Steps */}
                    {[
                        { step: "01", title: "Create Your Account",  sub: "Register in minutes — it's free" },
                        { step: "02", title: "Set Your PIN",         sub: "Secure every transaction" },
                        { step: "03", title: "Start Transacting",    sub: "Send, receive and sell crypto" },
                    ].map((item, i) => (
                        <div
                            key={i}
                            style={{
                                display:      "flex",
                                alignItems:   "center",
                                gap:          "14px",
                                padding:      "14px 18px",
                                marginBottom: "10px",
                                background:   "rgba(255,255,255,0.07)",
                                borderRadius: "10px",
                                border:       "1px solid rgba(255,255,255,0.1)",
                                textAlign:    "left",
                                transition:   "background 0.2s",
                            }}
                            onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
                            onMouseOut={e  => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
                        >
                            <div style={{
                                width:          "38px", height: "38px",
                                background:     `${accent}25`,
                                borderRadius:   "8px",
                                display:        "flex",
                                alignItems:     "center",
                                justifyContent: "center",
                                color:          accent,
                                fontWeight:     "bold",
                                fontSize:       "13px",
                                flexShrink:     0,
                            }}>
                                {item.step}
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

export default Register