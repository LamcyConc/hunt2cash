import { useState, useEffect } from "react"
import { useFormik } from "formik"
import * as yup from "yup"
import Layout from "../../components/common/Layout"
import FieldLabel from "../../components/common/FieldLabel"
import InputStyle from "../../components/common/InputStyle"
import { getExchangeDetails, topUpLiquidity, updateWalletAddresses } from "../../services/api"

const primary      = "#0F3D2E"
const primaryLight = "#0B5D3B"
const accent       = "#E6A800"
const accentBright = "#F4B400"

const AdminExchange = () => {
    const [exchange,    setExchange]    = useState(null)
    const [loading,     setLoading]     = useState(true)
    const [liquidityMsg, setLiquidityMsg] = useState({ success: "", error: "" })
    const [walletsMsg,   setWalletsMsg]   = useState({ success: "", error: "" })

    const fetchExchange = async () => {
        try {
            const res = await getExchangeDetails()
            setExchange(res.data.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchExchange() }, [])

    const liquidityFormik = useFormik({
        initialValues: { amount: "" },

        onSubmit: async (values, { setSubmitting, resetForm }) => {
            setLiquidityMsg({ success: "", error: "" })
            try {
                await topUpLiquidity({ amount: parseFloat(values.amount) })
                setLiquidityMsg({
                    success: `₦${parseFloat(values.amount).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 } )} added to liquidity! 🎉`,
                    error:   ""
                })
                resetForm()
                fetchExchange()
            } catch (error) {
                setLiquidityMsg({
                    success: "",
                    error:   error.response?.data?.message || "Failed to top up liquidity"
                })
            } finally {
                setSubmitting(false)
            }
        },

        validationSchema: yup.object({
            amount: yup.number()
                .required("Amount is required")
                .min(1, "Minimum is ₦1")
        })
    })

    // ── Update Wallet Addresses Form ─────────────────────
    const walletsFormik = useFormik({
        initialValues: {
            btc:  exchange?.cryptoWallets?.btc  || "",
            eth:  exchange?.cryptoWallets?.eth  || "",
            usdt: exchange?.cryptoWallets?.usdt || ""
        },
        enableReinitialize: true,

        onSubmit: async (values, { setSubmitting }) => {
            setWalletsMsg({ success: "", error: "" })
            try {
                await updateWalletAddresses({
                    btc:  values.btc,
                    eth:  values.eth,
                    usdt: values.usdt
                })
                setWalletsMsg({ success: "Wallet addresses updated! 🎉", error: "" })
                fetchExchange()
            } catch (error) {
                setWalletsMsg({
                    success: "",
                    error:   error.response?.data?.message || "Failed to update wallets"
                })
            } finally {
                setSubmitting(false)
            }
        },

        validationSchema: yup.object({
            btc:  yup.string().required("BTC address is required"),
            eth:  yup.string().required("ETH address is required"),
            usdt: yup.string().required("USDT address is required")
        })
    })

    if (loading) {
        return (
            <Layout pageTitle="Exchange">
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
                    <div style={{ textAlign: "center" }}>
                        <div className="spinner-border" style={{ color: primary }} role="status" />
                        <p style={{ color: "#888", marginTop: 12, fontFamily: "'Inter', sans-serif" }}>
                            Loading exchange...
                        </p>
                    </div>
                </div>
            </Layout>
        )
    }

    return (
        <Layout pageTitle="Exchange">

            <div className="mb-4">
                <h5 style={{
                    color:        primary,
                    fontWeight:   "bold",
                    fontFamily:   "'Inter', sans-serif",
                    marginBottom: 4
                }}>
                    Exchange Management
                </h5>
                <p style={{ color: "#888", fontSize: 13, margin: 0 }}>
                    Manage liquidity and wallet addresses.
                </p>
            </div>

            {/* Liquidity Summary */}
            <div
                className="mb-4 p-4"
                style={{
                    background:   `linear-gradient(135deg, ${primary} 0%, ${primaryLight} 100%)`,
                    borderRadius: "16px",
                    color:        "#FFFFFF"
                }}
            >
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, letterSpacing: "2px", marginBottom: 4 }}>
                    CURRENT NAIRA LIQUIDITY
                </p>
                <h2 style={{
                    color:        "#FFFFFF",
                    fontWeight:   "bold",
                    fontSize:     "clamp(24px, 4vw, 36px)",
                    fontFamily:   "'Inter', sans-serif",
                    marginBottom: 16,
                    letterSpacing: "1px"
                }}>
                    ₦{parseFloat(exchange?.nairaLiquidity || 0).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h2>

                {/* Crypto received stats */}
                <div className="d-flex gap-4 flex-wrap">
                    {[
                        { label: "BTC RECEIVED",  value: exchange?.totalBtcReceived  || 0, unit: "BTC"  },
                        { label: "ETH RECEIVED",  value: exchange?.totalEthReceived  || 0, unit: "ETH"  },
                        { label: "USDT RECEIVED", value: exchange?.totalUsdtReceived || 0, unit: "USDT" },
                    ].map((item, i) => (
                        <div key={i}>
                            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, letterSpacing: "1px", marginBottom: 2 }}>
                                {item.label}
                            </p>
                            <p style={{ color: accent, fontWeight: "bold", fontSize: 14, margin: 0, fontFamily: "'Inter', sans-serif" }}>
                                {item.value} {item.unit}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Up Liquidity */}
            <div className="mb-4" style={{
                background:   "#FFFFFF",
                border:       "1px solid #e8ede9",
                borderRadius: "16px",
                padding:      "24px",
                boxShadow:    "0 2px 8px rgba(15,61,46,0.04)",
                maxWidth:     "480px"
            }}>
                <p style={{
                    color:         "#888",
                    fontSize:      "11px",
                    letterSpacing: "2px",
                    fontWeight:    "bold",
                    marginBottom:  "16px"
                }}>
                    TOP UP NAIRA LIQUIDITY
                </p>

                {liquidityMsg.success && (
                    <div className="mb-3 p-3" style={{
                        background: "rgba(76,175,80,0.08)", border: "1px solid rgba(76,175,80,0.2)",
                        borderRadius: "8px", color: "#4CAF50", fontSize: "13px"
                    }}>
                        {liquidityMsg.success}
                    </div>
                )}
                {liquidityMsg.error && (
                    <div className="mb-3 p-3" style={{
                        background: "rgba(220,53,69,0.06)", border: "1px solid rgba(220,53,69,0.15)",
                        borderRadius: "8px", color: "#dc3545", fontSize: "13px"
                    }}>
                        {liquidityMsg.error}
                    </div>
                )}

                <form onSubmit={liquidityFormik.handleSubmit}>
                    <div className="mb-4">
                        <FieldLabel text="AMOUNT TO ADD (₦)" />
                        <input
                            type="number"
                            name="amount"
                            placeholder="Enter naira amount"
                            onChange={liquidityFormik.handleChange}
                            value={liquidityFormik.values.amount}
                            style={InputStyle(liquidityFormik.touched.amount && liquidityFormik.errors.amount)}
                            onFocus={e => e.target.style.border = `1.5px solid ${primary}`}
                            onBlur={e => {
                                liquidityFormik.handleBlur(e)
                                e.target.style.border = `1.5px solid ${liquidityFormik.errors.amount ? "#dc3545" : "#ddd"}`
                            }}
                        />
                        {liquidityFormik.touched.amount && liquidityFormik.errors.amount && (
                            <small className="text-danger">{liquidityFormik.errors.amount}</small>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={liquidityFormik.isSubmitting}
                        style={{
                            padding:       "12px 32px",
                            background:    liquidityFormik.isSubmitting ? "#aaa" : accent,
                            color:         primary,
                            border:        "none",
                            borderRadius:  "8px",
                            fontSize:      "14px",
                            fontWeight:    "bold",
                            fontFamily:    "'Inter', sans-serif",
                            letterSpacing: "1px",
                            cursor:        liquidityFormik.isSubmitting ? "not-allowed" : "pointer",
                            transition:    "background 0.2s"
                        }}
                        onMouseOver={e => { if (!liquidityFormik.isSubmitting) e.currentTarget.style.background = accentBright }}
                        onMouseOut={e  => { if (!liquidityFormik.isSubmitting) e.currentTarget.style.background = accent }}
                    >
                        {liquidityFormik.isSubmitting ? "ADDING..." : "ADD LIQUIDITY"}
                    </button>
                </form>
            </div>

            {/* Update Wallet Addresses */}
            <div style={{
                background:   "#FFFFFF",
                border:       "1px solid #e8ede9",
                borderRadius: "16px",
                padding:      "24px",
                boxShadow:    "0 2px 8px rgba(15,61,46,0.04)",
                maxWidth:     "480px"
            }}>
                <p style={{
                    color:         "#888",
                    fontSize:      "11px",
                    letterSpacing: "2px",
                    fontWeight:    "bold",
                    marginBottom:  "16px"
                }}>
                    EXCHANGE WALLET ADDRESSES
                </p>

                {walletsMsg.success && (
                    <div className="mb-3 p-3" style={{
                        background: "rgba(76,175,80,0.08)", border: "1px solid rgba(76,175,80,0.2)",
                        borderRadius: "8px", color: "#4CAF50", fontSize: "13px"
                    }}>
                        {walletsMsg.success}
                    </div>
                )}
                {walletsMsg.error && (
                    <div className="mb-3 p-3" style={{
                        background: "rgba(220,53,69,0.06)", border: "1px solid rgba(220,53,69,0.15)",
                        borderRadius: "8px", color: "#dc3545", fontSize: "13px"
                    }}>
                        {walletsMsg.error}
                    </div>
                )}

                <form onSubmit={walletsFormik.handleSubmit}>
                    {["btc", "eth", "usdt"].map(coin => (
                        <div key={coin} className="mb-3">
                            <FieldLabel text={`${coin.toUpperCase()} WALLET ADDRESS`} />
                            <input
                                type="text"
                                name={coin}
                                placeholder={`Enter ${coin.toUpperCase()} address`}
                                onChange={walletsFormik.handleChange}
                                value={walletsFormik.values[coin]}
                                style={InputStyle(walletsFormik.touched[coin] && walletsFormik.errors[coin])}
                                onFocus={e => e.target.style.border = `1.5px solid ${primary}`}
                                onBlur={e => {
                                    walletsFormik.handleBlur(e)
                                    e.target.style.border = `1.5px solid ${walletsFormik.errors[coin] ? "#dc3545" : "#ddd"}`
                                }}
                            />
                            {walletsFormik.touched[coin] && walletsFormik.errors[coin] && (
                                <small className="text-danger">{walletsFormik.errors[coin]}</small>
                            )}
                        </div>
                    ))}

                    <button
                        type="submit"
                        disabled={walletsFormik.isSubmitting}
                        style={{
                            padding:       "12px 32px",
                            background:    walletsFormik.isSubmitting ? "#aaa" : primary,
                            color:         "#FFFFFF",
                            border:        "none",
                            borderRadius:  "8px",
                            fontSize:      "14px",
                            fontWeight:    "bold",
                            fontFamily:    "'Inter', sans-serif",
                            letterSpacing: "1px",
                            cursor:        walletsFormik.isSubmitting ? "not-allowed" : "pointer",
                            transition:    "background 0.2s"
                        }}
                        onMouseOver={e => { if (!walletsFormik.isSubmitting) e.currentTarget.style.background = primaryLight }}
                        onMouseOut={e  => { if (!walletsFormik.isSubmitting) e.currentTarget.style.background = primary }}
                    >
                        {walletsFormik.isSubmitting ? "SAVING..." : "UPDATE ADDRESSES"}
                    </button>
                </form>
            </div>

        </Layout>
    )
}

export default AdminExchange;