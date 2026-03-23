import { useState } from "react"
import { useFormik } from "formik"
import * as yup from "yup"
import ModalShell from "../common/ModalShell"
import FieldLabel from "../common/FieldLabel"
import InputStyle from "../common/InputStyle"
import AdminMessageFormat from "../common/AdminMessageFormat"
import { depositCrypto } from "../../services/api"

const primary      = "#0F3D2E"
const accent       = "#E6A800"
const accentBright = "#F4B400"

const COINS = [
    { value: "btc",  label: "Bitcoin (BTC)"  },
    { value: "eth",  label: "Ethereum (ETH)" },
    { value: "usdt", label: "Tether (USDT)"  },
]

const DepositCryptoModal = ({ show, onClose, wallet }) => {
    const [successMsg, setSuccessMsg] = useState("")
    const [errorMsg,   setErrorMsg]   = useState("")

    const handleClose = () => {
        setSuccessMsg("")
        setErrorMsg("")
        formik.resetForm()
        onClose()
    }

    const formik = useFormik({
        initialValues: {
            cryptoType: "btc",
            amount:     ""
        },

        onSubmit: async (values, { setSubmitting, resetForm }) => {
            setSuccessMsg("")
            setErrorMsg("")
            try {
                await depositCrypto({
                    cryptoType: values.cryptoType,
                    amount:     parseFloat(values.amount)
                })
                setSuccessMsg(`${values.amount} ${values.cryptoType.toUpperCase()} deposited successfully! 🎉`)
                resetForm()
            } catch (error) {
                setErrorMsg(error.response?.data?.message || "Deposit failed")
            } finally {
                setSubmitting(false)
            }
        },

        validationSchema: yup.object({
            cryptoType: yup.string().required("Select a coin"),
            amount:     yup.number()
                .required("Amount is required")
                .positive("Amount must be positive")
        })
    })

    const selectedAddress = wallet?.[formik.values.cryptoType]?.address || "—"

    return (
        <ModalShell show={show} onClose={handleClose} title="⬇️ Deposit Crypto">
            <form onSubmit={formik.handleSubmit}>

                <AdminMessageFormat context="deposit" />

                {successMsg && (
                    <div className="mb-3 p-3" style={{
                        background: "rgba(76,175,80,0.08)", border: "1px solid rgba(76,175,80,0.2)",
                        borderRadius: "8px", color: "#4CAF50", fontSize: "13px"
                    }}>
                        {successMsg}
                    </div>
                )}
                {errorMsg && (
                    <div className="mb-3 p-3" style={{
                        background: "rgba(220,53,69,0.06)", border: "1px solid rgba(220,53,69,0.15)",
                        borderRadius: "8px", color: "#dc3545", fontSize: "13px"
                    }}>
                        {errorMsg}
                    </div>
                )}

                <div className="mb-3">
                    <FieldLabel text="SELECT COIN" />
                    <select
                        name="cryptoType"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.cryptoType}
                        style={{
                            ...InputStyle(formik.touched.cryptoType && formik.errors.cryptoType),
                            cursor: "pointer"
                        }}
                    >
                        {COINS.map(c => (
                            <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                    </select>
                    {formik.touched.cryptoType && formik.errors.cryptoType && (
                        <small className="text-danger">{formik.errors.cryptoType}</small>
                    )}
                </div>

                <div className="mb-3 p-3" style={{
                    background:   `${accent}08`,
                    border:       `1px solid ${accent}30`,
                    borderRadius: "8px"
                }}>
                    <p style={{
                        color:         "#888",
                        fontSize:      "10px",
                        letterSpacing: "1.5px",
                        marginBottom:  "6px",
                        fontWeight:    "bold"
                    }}>
                        YOUR {formik.values.cryptoType.toUpperCase()} DEPOSIT ADDRESS
                    </p>
                    <p style={{
                        color:        primary,
                        fontWeight:   "bold",
                        fontSize:     "12px",
                        margin:       0,
                        wordBreak:    "break-all",
                        fontFamily:   "monospace"
                    }}>
                        {selectedAddress}
                    </p>
                    <p style={{ color: "#aaa", fontSize: "11px", margin: "6px 0 0" }}>
                        ⚠️ Only send {formik.values.cryptoType.toUpperCase()} to this address
                    </p>
                </div>

                <div className="mb-4">
                    <FieldLabel text={`AMOUNT (${formik.values.cryptoType.toUpperCase()})`} />
                    <input
                        type="number"
                        name="amount"
                        placeholder="Enter crypto amount"
                        step="any"
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
                    disabled={formik.isSubmitting}
                    style={{
                        width:         "100%",
                        padding:       "13px",
                        background:    formik.isSubmitting ? "#aaa" : accent,
                        color:         primary,
                        border:        "none",
                        borderRadius:  "8px",
                        fontSize:      "14px",
                        fontWeight:    "bold",
                        fontFamily:    "'Inter', sans-serif",
                        letterSpacing: "1px",
                        cursor:        formik.isSubmitting ? "not-allowed" : "pointer",
                        transition:    "background 0.2s",
                        marginTop:     "8px"
                    }}
                    onMouseOver={e => { if (!formik.isSubmitting) e.currentTarget.style.background = accentBright }}
                    onMouseOut={e  => { if (!formik.isSubmitting) e.currentTarget.style.background = accent }}
                >
                    {formik.isSubmitting ? "DEPOSITING..." : "CONFIRM DEPOSIT"}
                </button>

            </form>
        </ModalShell>
    )
}

export default DepositCryptoModal;