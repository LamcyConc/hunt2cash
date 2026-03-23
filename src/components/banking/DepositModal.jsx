import { useState } from "react"
import { useFormik } from "formik"
import * as yup from "yup"
import { useNavigate } from "react-router-dom"
import ModalShell           from "../common/ModalShell"
import FieldLabel           from "../common/FieldLabel"
import InputStyle           from "../common/InputStyle"
import Toast                from "../common/Toast"
import ConfirmDepositModal  from "./ConfirmDepositModal"
import { depositFunds } from "../../services/api"

const primary      = "#0F3D2E"
const primaryLight = "#0B5D3B"
const accent       = "#E6A800"
const accentBright = "#F4B400"

const DepositModal = ({ show, onClose }) => {
    const navigate = useNavigate()

    const [view,         setView]         = useState("form")
    const [successData,  setSuccessData]  = useState(null)
    const [confirming,   setConfirming]   = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [toast,        setToast]        = useState({ show: false, type: "success", message: "" })

    const showToast = (type, message) => setToast({ show: true, type, message })
    const hideToast = () => setToast({ show: false, type: "success", message: "" })

    const handleClose = () => {
        setView("form")
        setSuccessData(null)
        setConfirming(false)
        formik.resetForm()
        hideToast()
        onClose()
    }

    const formik = useFormik({
        initialValues: { amount: "" },

        onSubmit: () => {
            setConfirming(true)
        },

        validationSchema: yup.object({
            amount: yup.number().required("Amount is required").min(1, "Minimum deposit is ₦1")
        })
    })

    const handleConfirm = async () => {
        setIsSubmitting(true)
        try {
            const response = await depositFunds({ amount: parseFloat(formik.values.amount) })
            setSuccessData({ amount: formik.values.amount, ...response.data.data })
            setConfirming(false)
            showToast("success", "Deposit successful!")
            setView("success")
            formik.resetForm()
        } catch (error) {
            setConfirming(false)
            showToast("error", error.response?.data?.message || "Deposit failed")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <Toast
                show={toast.show}
                type={toast.type}
                message={toast.message}
                onClose={hideToast}
            />

            <ConfirmDepositModal
                show={confirming}
                onClose={() => setConfirming(false)}
                onConfirm={handleConfirm}
                isSubmitting={isSubmitting}
                amount={formik.values.amount}
            />

            <ModalShell
                show={show && !confirming}
                onClose={handleClose}
                title={view === "success" ? "✅ Deposit Complete" : "⬇️ Deposit Funds"}
            >

                {view === "success" && successData && (
                    <div style={{ textAlign: "center" }}>

                        <div style={{
                            width:          "64px", height: "64px",
                            background:     "rgba(76,175,80,0.1)",
                            borderRadius:   "50%",
                            display:        "flex",
                            alignItems:     "center",
                            justifyContent: "center",
                            fontSize:       "32px",
                            margin:         "0 auto 20px"
                        }}>
                            ✅
                        </div>

                        <h6 style={{
                            color:        primary,
                            fontWeight:   "bold",
                            fontFamily:   "'Inter', sans-serif",
                            fontSize:     "16px",
                            marginBottom: "6px"
                        }}>
                            Deposit Successful!
                        </h6>

                        <p style={{ color: "#888", fontSize: "13px", marginBottom: "24px" }}>
                            Your account has been credited
                        </p>

                        <div style={{
                            background:   "rgba(15,61,46,0.04)",
                            border:       "1px solid rgba(15,61,46,0.1)",
                            borderRadius: "12px",
                            padding:      "20px",
                            marginBottom: "24px"
                        }}>
                            <p style={{
                                color:      primary,
                                fontWeight: "bold",
                                fontSize:   "28px",
                                fontFamily: "'Inter', sans-serif",
                                margin:     "0 0 4px"
                            }}>
                                ₦{parseFloat(successData.amount).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                            </p>
                            <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>
                                added to your balance
                            </p>
                        </div>

                        <div className="d-flex gap-3">
                            <button
                                onClick={() => { setView("form"); setSuccessData(null) }}
                                style={{
                                    flex:         1,
                                    padding:      "12px",
                                    background:   "transparent",
                                    color:        primary,
                                    border:       `1.5px solid ${primary}`,
                                    borderRadius: "8px",
                                    fontSize:     "12px",
                                    fontWeight:   "bold",
                                    fontFamily:   "'Inter', sans-serif",
                                    cursor:       "pointer",
                                    transition:   "all 0.2s"
                                }}
                                onMouseOver={e => { e.currentTarget.style.background = primary; e.currentTarget.style.color = "#FFFFFF" }}
                                onMouseOut={e  => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = primary }}
                            >
                                Deposit Again
                            </button>
                            <button
                                onClick={() => { handleClose(); navigate("/dashboard") }}
                                style={{
                                    flex:         1,
                                    padding:      "12px",
                                    background:   accent,
                                    color:        primary,
                                    border:       "none",
                                    borderRadius: "8px",
                                    fontSize:     "12px",
                                    fontWeight:   "bold",
                                    fontFamily:   "'Inter', sans-serif",
                                    cursor:       "pointer",
                                    transition:   "background 0.2s"
                                }}
                                onMouseOver={e => e.currentTarget.style.background = accentBright}
                                onMouseOut={e  => e.currentTarget.style.background = accent}
                            >
                                Go to Dashboard
                            </button>
                        </div>

                    </div>
                )}

                {view === "form" && (
                    <form onSubmit={formik.handleSubmit}>

                        <div className="mb-4">
                            <FieldLabel text="AMOUNT TO DEPOSIT (₦)" />
                            <input
                                type="number"
                                name="amount"
                                placeholder="Enter amount"
                                onChange={formik.handleChange}
                                value={formik.values.amount}
                                style={InputStyle(formik.touched.amount && formik.errors.amount)}
                                onFocus={e => e.target.style.border = `1.5px solid ${primary}`}
                                onBlur={e => {
                                    formik.handleBlur(e)
                                    e.target.style.border = `1.5px solid ${formik.errors.amount ? "#dc3545" : "#ddd"}`
                                }}
                            />
                            {formik.touched.amount && formik.errors.amount && (
                                <small className="text-danger">{formik.errors.amount}</small>
                            )}
                        </div>

                        <button
                            type="submit"
                            style={{
                                width:         "100%",
                                padding:       "13px",
                                background:    accent,
                                color:         primary,
                                border:        "none",
                                borderRadius:  "8px",
                                fontSize:      "14px",
                                fontWeight:    "bold",
                                fontFamily:    "'Inter', sans-serif",
                                letterSpacing: "1px",
                                cursor:        "pointer",
                                transition:    "background 0.2s",
                                marginTop:     "8px"
                            }}
                            onMouseOver={e => e.currentTarget.style.background = accentBright}
                            onMouseOut={e  => e.currentTarget.style.background = accent}
                        >
                            DEPOSIT FUNDS
                        </button>

                    </form>
                )}

            </ModalShell>
        </>
    )
}

export default DepositModal;