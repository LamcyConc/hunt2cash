import { useState } from "react"
import { useFormik } from "formik"
import * as yup from "yup"
import ModalShell from "../common/ModalShell"
import FieldLabel from "../common/FieldLabel"
import inputStyle from "../common/inputStyle"
import AdminMessageFormat from "../common/AdminMessageFormat"
import Toast from "../common/Toast"
import ConfirmSellModal from "./ConfirmSellModal"
import { sellCrypto } from "../../services/api"

const primary      = "#0F3D2E"
const primaryLight = "#0B5D3B"

const COINS = [
    { value: "btc",  label: "Bitcoin (BTC)"  },
    { value: "eth",  label: "Ethereum (ETH)" },
    { value: "usdt", label: "Tether (USDT)"  },
]

const SellCryptoModal = ({ show, onClose, wallet, prices }) => {
    const [toast,        setToast]        = useState({ show: false, type: "success", message: "" })
    const [confirming,   setConfirming]   = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleClose = () => {
        setConfirming(false)
        formik.resetForm()
        onClose()
    }

    const formik = useFormik({
        initialValues: {
            cryptoType: "btc",
            amount:     "",
            pin:        ""
        },

        onSubmit: () => {
            setConfirming(true)
        },

        validationSchema: yup.object({
            cryptoType: yup.string().required("Select a coin"),
            amount:     yup.number()
                .required("Amount is required")
                .positive("Amount must be positive"),
            pin:        yup.string()
                .required("PIN is required")
                .length(4, "PIN must be 4 digits")
        })
    })

    const handleConfirm = async () => {
        const values = formik.values
        setIsSubmitting(true)
        try {
            await sellCrypto({
                cryptoType: values.cryptoType,
                amount:     parseFloat(values.amount),
                pin:        values.pin
            })
            const nairaValue = parseFloat(values.amount) *
                (prices?.[values.cryptoType]?.nairaPrice || 0)

            setToast({
                show:    true,
                type:    "success",
                message: `${values.amount} ${values.cryptoType.toUpperCase()} sold! ₦${nairaValue.toLocaleString("en-NG", { minimumFractionDigits: 2 })} has been credited to your bank balance 🎉`
            })
            formik.resetForm()
            handleClose()
        } catch (error) {
            setConfirming(false)
            setToast({
                show:    true,
                type:    "error",
                message: error.response?.data?.message || "Sale failed. Please try again."
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const selectedCoin   = formik.values.cryptoType
    const coinBalance    = wallet?.[selectedCoin]?.balance || 0
    const coinNairaPrice = prices?.[selectedCoin]?.nairaPrice || 0
    const coinUsdPrice   = prices?.[selectedCoin]?.usdPrice   || 0
    const parsedAmount   = parseFloat(formik.values.amount)
    const estimatedNaira = parsedAmount * coinNairaPrice

    return (
        <>
            <Toast
                show={toast.show}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast({ ...toast, show: false })}
            />

            <ConfirmSellModal
                show={confirming}
                onClose={() => setConfirming(false)}
                onConfirm={handleConfirm}
                isSubmitting={isSubmitting}
                values={formik.values}
                prices={prices}
            />

            <ModalShell show={show && !confirming} onClose={handleClose} title="💱 Sell Crypto">
                <form onSubmit={formik.handleSubmit}>

                    <AdminMessageFormat context="sell" />

                    <div className="mb-3">
                        <FieldLabel text="SELECT COIN TO SELL" />
                        <select
                            name="cryptoType"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.cryptoType}
                            style={{
                                ...inputStyle(formik.touched.cryptoType && formik.errors.cryptoType),
                                cursor: "pointer"
                            }}
                        >
                            {COINS.map(c => (
                                <option key={c.value} value={c.value}>{c.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-3 p-3" style={{
                        background:   "#fafafa",
                        border:       "1px solid #e8ede9",
                        borderRadius: "8px"
                    }}>
                        <div className="d-flex justify-content-between mb-1">
                            <span style={{ color: "#aaa", fontSize: "12px" }}>Your Balance</span>
                            <span style={{ color: primary, fontWeight: "bold", fontSize: "12px" }}>
                                {coinBalance} {selectedCoin.toUpperCase()}
                            </span>
                        </div>
                        <div className="d-flex justify-content-between mb-1">
                            <span style={{ color: "#aaa", fontSize: "12px" }}>Current Price</span>
                            <span style={{ color: primary, fontWeight: "bold", fontSize: "12px" }}>
                                ₦{coinNairaPrice.toLocaleString("en-NG")} / ${coinUsdPrice.toLocaleString("en-US")}
                            </span>
                        </div>
                        {!isNaN(parsedAmount) && parsedAmount > 0 && (
                            <div className="d-flex justify-content-between" style={{
                                borderTop: "1px solid #e8ede9", paddingTop: "8px", marginTop: "8px"
                            }}>
                                <span style={{ color: "#aaa", fontSize: "12px" }}>You will receive</span>
                                <span style={{ color: "#4CAF50", fontWeight: "bold", fontSize: "12px" }}>
                                    ≈ ₦{estimatedNaira.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="mb-3">
                        <FieldLabel text={`AMOUNT TO SELL (${selectedCoin.toUpperCase()})`} />
                        <input
                            type="number"
                            name="amount"
                            placeholder="Enter crypto amount"
                            step="any"
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
                            background:    primary,
                            color:         "#FFFFFF",
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
                        onMouseOver={e => e.currentTarget.style.background = primaryLight}
                        onMouseOut={e  => e.currentTarget.style.background = primary}
                    >
                        SELL NOW
                    </button>

                </form>
            </ModalShell>
        </>
    )
}

export default SellCryptoModal;