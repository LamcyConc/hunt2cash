import { useFormik } from "formik"
import * as yup from "yup"
import { useNavigate, Link } from "react-router-dom"
import { useState } from "react"
import { requestOtpApi, forgotPasswordAPI } from "../../services/api"
import ShieldLogo from "../../components/common/ShieldLogo"
import Wordmark from "../../components/common/Wordmark"

const primary      = "#0F3D2E"
const primaryMid   = "#124734"
const primaryLight = "#0B5D3B"
const accent       = "#E6A800"
const accentBright = "#F4B400"

const ForgotPassword = () => {
    const navigate = useNavigate()

    const [step,            setStep]            = useState(1)
    const [email,           setEmail]           = useState("")
    const [showPassword,    setShowPassword]    = useState(false)
    const [showConfirm,     setShowConfirm]     = useState(false)

    // ─── STEP 1 — Request OTP ───────────────────────────────────────────────
    const step1Formik = useFormik({
        initialValues: { email: "" },

        onSubmit: async (values, { setSubmitting, setStatus }) => {
            try {
                await requestOtpApi({ email: values.email })
                setEmail(values.email)
                setStep(2)
            } catch (error) {
                setStatus(error.response?.data?.message || "Failed to send OTP")
            } finally {
                setSubmitting(false)
            }
        },

        validationSchema: yup.object({
            email: yup.string().required("Email is required").email("Enter a valid email address")
        })
    })

    // ─── STEP 2 & 3 — Verify OTP + Reset Password ───────────────────────────
    const step2Formik = useFormik({
        initialValues: { 
            otp: "", 
            newPassword: "", 
            confirmPassword: "" 
        },

        onSubmit: async (values, { setSubmitting, setStatus }) => {
            try {
                await forgotPasswordAPI({
                    email,
                    otp:         values.otp,
                    newPassword: values.newPassword
                })
                navigate("/login", { state: { message: "Password reset successful! You can now log in with your new password." } })
            } catch (error) {
                setStatus(error.response?.data?.message || "Failed to reset password")
            } finally {
                setSubmitting(false)
            }
        },

        validationSchema: yup.object({
            otp: yup.string()
                .required("OTP is required")
                .length(4, "OTP must be 4 digits")
                .matches(/^\d{4}$/, "OTP must be digits only"),
            newPassword: yup.string()
                .required("New password is required")
                .min(6, "Password must be at least 6 characters"),
            confirmPassword: yup.string()
                .required("Please confirm your password")
                .oneOf([yup.ref("newPassword")], "Passwords do not match")
        })
    })

    const inputBase = (hasError) => ({
        width:        "100%",
        padding:      "13px 16px",
        borderRadius: "8px",
        border:       `1.5px solid ${hasError ? "#dc3545" : "#ddd"}`,
        fontSize:     "14px",
        fontFamily:   "'Inter', sans-serif",
        outline:      "none",
        transition:   "border 0.2s",
        background:   "#fafafa",
    })

    const labelStyle = {
        display:       "block",
        color:         "#555",
        fontSize:      "11px",
        letterSpacing: "1.5px",
        fontWeight:    "bold",
        marginBottom:  "8px",
    }

    const StepIndicator = () => (
        <div className="d-flex align-items-center gap-2 mb-5">
            {[1, 2].map((s) => (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{
                        width:          "28px",
                        height:         "28px",
                        borderRadius:   "50%",
                        background:     step >= s ? primary : "#e8e8e8",
                        color:          step >= s ? "#FFFFFF" : "#aaa",
                        display:        "flex",
                        alignItems:     "center",
                        justifyContent: "center",
                        fontSize:       "12px",
                        fontWeight:     "bold",
                        transition:     "all 0.3s"
                    }}>
                        {step > s ? "✓" : s}
                    </div>
                    <span style={{
                        fontSize:   "12px",
                        color:      step >= s ? primary : "#aaa",
                        fontWeight: step >= s ? "bold" : "normal"
                    }}>
                        {s === 1 ? "Request OTP" : "Reset Password"}
                    </span>
                    {s < 2 && (
                        <div style={{
                            width:      "32px",
                            height:     "1px",
                            background: step > s ? primary : "#e8e8e8",
                            margin:     "0 4px"
                        }} />
                    )}
                </div>
            ))}
        </div>
    )

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", minHeight: "100vh", display: "flex" }}>

            <div
                className="col-12 col-md-6 d-flex flex-column justify-content-center"
                style={{ padding: "60px 5%", background: "#FFFFFF", minHeight: "100vh" }}
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

                    <StepIndicator />

                    {step === 1 && (
                        <>
                            <h2 style={{ color: primary, fontWeight: "bold", fontSize: "32px", marginBottom: "8px" }}>
                                Forgot password?
                            </h2>
                            <p style={{ color: "#888", fontSize: "14px", marginBottom: "36px" }}>
                                Enter your email and we'll send you a reset OTP.
                            </p>

                            {step1Formik.status && (
                                <div className="mb-4 p-3" style={{
                                    background:   "rgba(220,53,69,0.06)",
                                    border:       "1px solid rgba(220,53,69,0.15)",
                                    borderRadius: "8px",
                                    color:        "#dc3545",
                                    fontSize:     "13px"
                                }}>
                                    {step1Formik.status}
                                </div>
                            )}

                            <div className="mb-4">
                                <label style={labelStyle}>EMAIL ADDRESS</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    onChange={step1Formik.handleChange}
                                    value={step1Formik.values.email}
                                    style={inputBase(step1Formik.touched.email && step1Formik.errors.email)}
                                    onFocus={e  => e.target.style.border = `1.5px solid ${primary}`}
                                    onBlur={e => {
                                        step1Formik.handleBlur(e)
                                        e.target.style.border = `1.5px solid ${step1Formik.errors.email ? "#dc3545" : "#ddd"}`
                                    }}
                                />
                                {step1Formik.touched.email && step1Formik.errors.email && (
                                    <small className="text-danger">{step1Formik.errors.email}</small>
                                )}
                            </div>

                            <button
                            type="button"
                                onClick={step1Formik.handleSubmit}
                                disabled={step1Formik.isSubmitting}
                                style={{
                                    width:         "100%",
                                    padding:       "14px",
                                    background:    step1Formik.isSubmitting ? "#aaa" : accent,
                                    color:         primary,
                                    border:        "none",
                                    borderRadius:  "8px",
                                    fontSize:      "15px",
                                    fontWeight:    "bold",
                                    fontFamily:    "'Inter', sans-serif",
                                    letterSpacing: "2px",
                                    cursor:        step1Formik.isSubmitting ? "not-allowed" : "pointer",
                                    transition:    "background 0.2s",
                                    marginBottom:  "24px",
                                }}
                                onMouseOver={e => { if (!step1Formik.isSubmitting) e.target.style.background = accentBright }}
                                onMouseOut={e  => { if (!step1Formik.isSubmitting) e.target.style.background = accent }}
                            >
                                {step1Formik.isSubmitting ? "SENDING OTP..." : "SEND OTP"}
                            </button>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <h2 style={{ color: primary, fontWeight: "bold", fontSize: "32px", marginBottom: "8px" }}>
                                Reset password
                            </h2>
                            <p style={{ color: "#888", fontSize: "14px", marginBottom: "8px" }}>
                                Enter the OTP sent to{" "}
                                <strong style={{ color: primary }}>{email}</strong>{" "}
                                and choose a new password.
                            </p>
                            <p
                                onClick={() => setStep(1)}
                                style={{
                                    color:        accent,
                                    fontSize:     "13px",
                                    cursor:       "pointer",
                                    marginBottom: "28px",
                                    fontWeight:   "bold"
                                }}
                                onMouseOver={e => e.target.style.color = accentBright}
                                onMouseOut={e  => e.target.style.color = accent}
                            >
                                ← Change email
                            </p>

                            {step2Formik.status && (
                                <div className="mb-4 p-3" style={{
                                    background:   "rgba(220,53,69,0.06)",
                                    border:       "1px solid rgba(220,53,69,0.15)",
                                    borderRadius: "8px",
                                    color:        "#dc3545",
                                    fontSize:     "13px"
                                }}>
                                    {step2Formik.status}
                                </div>
                            )}

                            <div className="mb-3">
                                <label style={labelStyle}>OTP CODE</label>
                                <input
                                    type="text"
                                    name="otp"
                                    placeholder="Enter 4-digit OTP"
                                    maxLength={4}
                                    onChange={step2Formik.handleChange}
                                    value={step2Formik.values.otp}
                                    style={{
                                        ...inputBase(step2Formik.touched.otp && step2Formik.errors.otp),
                                        letterSpacing: "8px",
                                        fontSize:      "20px",
                                        textAlign:     "center",
                                        fontWeight:    "bold"
                                    }}
                                    onFocus={e  => e.target.style.border = `1.5px solid ${primary}`}
                                    onBlur={e => {
                                        step2Formik.handleBlur(e)
                                        e.target.style.border = `1.5px solid ${step2Formik.errors.otp ? "#dc3545" : "#ddd"}`
                                    }}
                                />
                                {step2Formik.touched.otp && step2Formik.errors.otp && (
                                    <small className="text-danger">{step2Formik.errors.otp}</small>
                                )}
                            </div>

                            <div className="mb-3">
                                <label style={labelStyle}>NEW PASSWORD</label>
                                <div style={{ position: "relative" }}>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="newPassword"
                                        placeholder="Enter new password"
                                        onChange={step2Formik.handleChange}
                                        value={step2Formik.values.newPassword}
                                        style={{
                                            ...inputBase(step2Formik.touched.newPassword && step2Formik.errors.newPassword),
                                            padding: "13px 44px 13px 16px"
                                        }}
                                        onFocus={e  => e.target.style.border = `1.5px solid ${primary}`}
                                        onBlur={e => {
                                            step2Formik.handleBlur(e)
                                            e.target.style.border = `1.5px solid ${step2Formik.errors.newPassword ? "#dc3545" : "#ddd"}`
                                        }}
                                    />
                                    <span
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: "absolute", right: "14px", top: "50%",
                                            transform: "translateY(-50%)", cursor: "pointer",
                                            fontSize: "16px", color: "#aaa", userSelect: "none"
                                        }}
                                    >
                                        {showPassword ? "🙈" : "👁️"}
                                    </span>
                                </div>
                                {step2Formik.touched.newPassword && step2Formik.errors.newPassword && (
                                    <small className="text-danger">{step2Formik.errors.newPassword}</small>
                                )}
                            </div>

                            <div className="mb-4">
                                <label style={labelStyle}>CONFIRM PASSWORD</label>
                                <div style={{ position: "relative" }}>
                                    <input
                                        type={showConfirm ? "text" : "password"}
                                        name="confirmPassword"
                                        placeholder="Repeat new password"
                                        onChange={step2Formik.handleChange}
                                        value={step2Formik.values.confirmPassword}
                                        style={{
                                            ...inputBase(step2Formik.touched.confirmPassword && step2Formik.errors.confirmPassword),
                                            padding: "13px 44px 13px 16px"
                                        }}
                                        onFocus={e  => e.target.style.border = `1.5px solid ${primary}`}
                                        onBlur={e => {
                                            step2Formik.handleBlur(e)
                                            e.target.style.border = `1.5px solid ${step2Formik.errors.confirmPassword ? "#dc3545" : "#ddd"}`
                                        }}
                                    />
                                    <span
                                        onClick={() => setShowConfirm(!showConfirm)}
                                        style={{
                                            position: "absolute", right: "14px", top: "50%",
                                            transform: "translateY(-50%)", cursor: "pointer",
                                            fontSize: "16px", color: "#aaa", userSelect: "none"
                                        }}
                                    >
                                        {showConfirm ? "🙈" : "👁️"}
                                    </span>
                                </div>
                                {step2Formik.touched.confirmPassword && step2Formik.errors.confirmPassword && (
                                    <small className="text-danger">{step2Formik.errors.confirmPassword}</small>
                                )}
                            </div>

                            <button
                            type="button"
                                onClick={step2Formik.handleSubmit}
                                disabled={step2Formik.isSubmitting}
                                style={{
                                    width:         "100%",
                                    padding:       "14px",
                                    background:    step2Formik.isSubmitting ? "#aaa" : accent,
                                    color:         primary,
                                    border:        "none",
                                    borderRadius:  "8px",
                                    fontSize:      "15px",
                                    fontWeight:    "bold",
                                    fontFamily:    "'Inter', sans-serif",
                                    letterSpacing: "2px",
                                    cursor:        step2Formik.isSubmitting ? "not-allowed" : "pointer",
                                    transition:    "background 0.2s",
                                    marginBottom:  "24px",
                                }}
                                onMouseOver={e => { if (!step2Formik.isSubmitting) e.target.style.background = accentBright }}
                                onMouseOut={e  => { if (!step2Formik.isSubmitting) e.target.style.background = accent }}
                            >
                                {step2Formik.isSubmitting ? "RESETTING..." : "RESET PASSWORD"}
                            </button>
                        </>
                    )}

                    <div className="d-flex align-items-center gap-3 mb-4">
                        <div style={{ flex: 1, height: "1px", background: "#e8e8e8" }} />
                        <span style={{ color: "#aaa", fontSize: "13px" }}>or</span>
                        <div style={{ flex: 1, height: "1px", background: "#e8e8e8" }} />
                    </div>

                    <p style={{ textAlign: "center", color: "#888", fontSize: "14px", margin: 0 }}>
                        Remember your password?{" "}
                        <Link
                            to="/login"
                            style={{ color: primary, fontWeight: "bold", textDecoration: "none" }}
                            onMouseOver={e => e.target.style.color = accent}
                            onMouseOut={e  => e.target.style.color = primary}
                        >
                            Back to login
                        </Link>
                    </p>

                </div>
            </div>

            {/* ─── RIGHT PANEL ────────────────────────────────────────────── */}
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
                        color:        "#FFFFFF",
                        fontSize:     "clamp(28px, 4vw, 42px)",
                        fontWeight:   "bold",
                        lineHeight:   1.2,
                        marginBottom: "20px",
                    }}>
                        Account<br />Recovery
                    </h2>

                    <p style={{
                        color:        "rgba(255,255,255,0.7)",
                        fontSize:     "15px",
                        lineHeight:   1.8,
                        marginBottom: "40px",
                    }}>
                        Follow the steps to securely<br />regain access to your account.
                    </p>

                    {[
                        { icon: "📧", title: "Enter your email",       sub: "We'll send a one-time code"        },
                        { icon: "🔢", title: "Verify your OTP",        sub: "4-digit code from your email"      },
                        { icon: "🔑", title: "Set a new password",     sub: "Choose a strong new password"      },
                        { icon: "✅", title: "You're back in!",        sub: "Log in with your new credentials"  },
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
                                fontSize:       "18px",
                                flexShrink:     0,
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

export default ForgotPassword