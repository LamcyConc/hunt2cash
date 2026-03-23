import { useState } from "react"
import { useFormik } from "formik"
import * as yup from "yup"
import { useNavigate } from "react-router-dom"
import ModalShell        from "../common/ModalShell"
import FieldLabel        from "../common/FieldLabel"
import inputStyle        from "../common/inputStyle"
import Toast             from "../common/Toast"
import ConfirmSendModal  from "./ConfirmSendModal"
import { transferFunds, findAccountName } from "../../services/api"

const primary      = "#0F3D2E"
const primaryLight = "#0B5D3B"
const accent       = "#E6A800"
const accentBright = "#F4B400"

const SendMoneyModal = ({ show, onClose }) => {
    const navigate = useNavigate()

    const [resolvedName, setResolvedName] = useState("")
    const [lookingUp,    setLookingUp]    = useState(false)
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
        setResolvedName("")
        setConfirming(false)
        formik.resetForm()
        hideToast()
        onClose()
    }

    const formik = useFormik({
        initialValues: {
            accountNumber: "",
            amount:        "",
            pin:           "",
            description:   ""
        },

        onSubmit: () => {
            setConfirming(true)
        },

        validationSchema: yup.object({
            accountNumber: yup.string().required("Account number is required").length(10, "Must be 10 digits"),
            amount:        yup.number().required("Amount is required").min(1, "Minimum is ₦1"),
            pin:           yup.string().required("PIN is required").length(4, "PIN must be 4 digits"),
            description:   yup.string()
        })
    })

    const handleConfirm = async () => {
        const values = formik.values
        setIsSubmitting(true)
        try {
            const response = await transferFunds({
                recipientAccountNumber: values.accountNumber,
                amount:                 parseFloat(values.amount),
                pin:                    values.pin,
                description:            values.description
            })
            setSuccessData(response.data.data)
            setConfirming(false)
            showToast("success", "Transfer completed successfully!")
            setView("success")
            formik.resetForm()
            setResolvedName("")
        } catch (error) {
            setConfirming(false)
            showToast("error", error.response?.data?.message || "Transfer failed")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleAccountChange = async (e) => {
        formik.handleChange(e)
        const val = e.target.value
        if (val.length === 10) {
            setLookingUp(true)
            setResolvedName("")
            try {
                const res = await findAccountName({ accountNumber: val })
                setResolvedName(
                    `${res.data.data?.accountName || ""}`.trim() || "Account found"
                )
            } catch {
                setResolvedName("❌ Account not found")
            } finally {
                setLookingUp(false)
            }
        } else {
            setResolvedName("")
        }
    }

    const isAccountNotFound = resolvedName.startsWith("❌")

    return (
        <>
            <Toast
                show={toast.show}
                type={toast.type}
                message={toast.message}
                onClose={hideToast}
            />

            <ConfirmSendModal
                show={confirming}
                onClose={() => setConfirming(false)}
                onConfirm={handleConfirm}
                isSubmitting={isSubmitting}
                values={formik.values}
                resolvedName={resolvedName}
            />

            <ModalShell
                show={show && !confirming}
                onClose={handleClose}
                title={view === "success" ? "✅ Transfer Complete" : " Send Money"}
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
                            Transfer Successful!
                        </h6>

                        <p style={{ color: "#888", fontSize: "13px", marginBottom: "24px" }}>
                            You have successfully transferred
                        </p>

                        <div style={{
                            background:   "rgba(15,61,46,0.04)",
                            border:       "1px solid rgba(15,61,46,0.1)",
                            borderRadius: "12px",
                            padding:      "20px",
                            marginBottom: "20px"
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
                                to{" "}
                                <strong style={{ color: primary }}>
                                    {successData.recipient?.firstName} {successData.recipient?.lastName}
                                </strong>
                            </p>
                        </div>

                        <div style={{
                            background:   "#fafafa",
                            borderRadius: "10px",
                            padding:      "16px",
                            marginBottom: "24px",
                            textAlign:    "left"
                        }}>
                            {[
                                { label: "Reference",     value: successData.reference },
                                { label: "Description",   value: successData.description },
                                { label: "Date",          value: new Date(successData.date).toLocaleString("en-NG") },
                                { label: "Balance After", value: `₦${parseFloat(successData.balanceAfter).toLocaleString("en-NG", { minimumFractionDigits: 2 })}` }
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="d-flex justify-content-between"
                                    style={{ padding: "6px 0", borderBottom: i < 3 ? "1px solid #f0f0f0" : "none" }}
                                >
                                    <span style={{ color: "#aaa", fontSize: "12px" }}>{item.label}</span>
                                    <span style={{ color: primary, fontSize: "12px", fontWeight: "bold" }}>{item.value}</span>
                                </div>
                            ))}
                        </div>

                        <div className="d-flex gap-3">
                            <button
                                onClick={() => { setView("form"); setSuccessData(null) }}
                                style={{
                                    flex:          1,
                                    padding:       "12px",
                                    background:    "transparent",
                                    color:         primary,
                                    border:        `1.5px solid ${primary}`,
                                    borderRadius:  "8px",
                                    fontSize:      "12px",
                                    fontWeight:    "bold",
                                    fontFamily:    "'Inter', sans-serif",
                                    cursor:        "pointer",
                                    letterSpacing: "0.5px",
                                    transition:    "all 0.2s"
                                }}
                                onMouseOver={e => { e.currentTarget.style.background = primary; e.currentTarget.style.color = "#FFFFFF" }}
                                onMouseOut={e  => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = primary }}
                            >
                                Send Another
                            </button>
                            <button
                                onClick={() => { handleClose(); navigate("/dashboard") }}
                                style={{
                                    flex:          1,
                                    padding:       "12px",
                                    background:    accent,
                                    color:         primary,
                                    border:        "none",
                                    borderRadius:  "8px",
                                    fontSize:      "12px",
                                    fontWeight:    "bold",
                                    fontFamily:    "'Inter', sans-serif",
                                    cursor:        "pointer",
                                    letterSpacing: "0.5px",
                                    transition:    "background 0.2s"
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

                        <div className="mb-3">
                            <FieldLabel text="ACCOUNT NUMBER" />
                            <input
                                type="number"
                                name="accountNumber"
                                placeholder="10-digit account number"
                                onChange={handleAccountChange}
                                value={formik.values.accountNumber}
                                style={inputStyle(formik.touched.accountNumber && formik.errors.accountNumber)}
                                onFocus={e => e.target.style.border = `1.5px solid ${primary}`}
                                onBlur={e => {
                                    formik.handleBlur(e)
                                    e.target.style.border = `1.5px solid ${formik.errors.accountNumber ? "#dc3545" : "#ddd"}`
                                }}
                            />
                            {lookingUp && <small style={{ color: "#aaa" }}>Looking up account...</small>}
                            {formik.touched.accountNumber && formik.errors.accountNumber && (
                                <small className="text-danger d-block">{formik.errors.accountNumber}</small>
                            )}
                        </div>

                        <div className="mb-3">
                            <FieldLabel text="" />
                            <input
                                type="text"
                                readOnly
                                placeholder="Beneficiary name"
                                value={resolvedName.toUpperCase()}
                                style={{
                                    ...inputStyle(false),
                                    background: resolvedName && !isAccountNotFound ? "#f0f8f3" : "#fafafa",
                                    color:      isAccountNotFound ? "#dc3545" : primary,
                                    fontWeight: resolvedName && !isAccountNotFound ? "bold" : "normal",
                                    cursor:     "default",
                                    border:     `1.5px solid ${
                                        isAccountNotFound
                                            ? "#dc3545"
                                            : resolvedName
                                            ? "rgba(76,175,80,0.4)"
                                            : "#ddd"
                                    }`
                                }}
                            />
                        </div>

                        <div className="mb-3">
                            <FieldLabel text="AMOUNT (₦)" />
                            <input
                                type="number"
                                name="amount"
                                placeholder="₦ Enter amount"
                                onChange={formik.handleChange}
                                value={formik.values.amount}
                                style={inputStyle(formik.touched.amount && formik.errors.amount)}
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

                        <div className="mb-3">
                            <FieldLabel text="DESCRIPTION (OPTIONAL)" />
                            <input
                                type="text"
                                name="description"
                                placeholder="What's this for?"
                                onChange={formik.handleChange}
                                value={formik.values.description}
                                style={inputStyle(false)}
                                onFocus={e => e.target.style.border = `1.5px solid ${primary}`}
                                onBlur={e => {
                                    formik.handleBlur(e)
                                    e.target.style.border = "1.5px solid #ddd"
                                }}
                            />
                        </div>

                        <div className="mb-4">
                            <FieldLabel text="TRANSACTION PIN" />
                            <input
                                type="password"
                                name="pin"
                                placeholder="4-digit PIN"
                                maxLength={4}
                                onChange={formik.handleChange}
                                value={formik.values.pin}
                                style={inputStyle(formik.touched.pin && formik.errors.pin)}
                                onFocus={e => e.target.style.border = `1.5px solid ${primary}`}
                                onBlur={e => {
                                    formik.handleBlur(e)
                                    e.target.style.border = `1.5px solid ${formik.errors.pin ? "#dc3545" : "#ddd"}`
                                }}
                            />
                            {formik.touched.pin && formik.errors.pin && (
                                <small className="text-danger">{formik.errors.pin}</small>
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
                            SEND MONEY
                        </button>

                    </form>
                )}

            </ModalShell>
        </>
    )
}

export default SendMoneyModal