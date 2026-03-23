import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Cookies from "universal-cookie"
import Layout from "../../components/common/Layout"
import AdminMessageFormat from "../../components/common/AdminMessageFormat"
import { myProfile, getCryptoWallet, getTransactionHistory, getCryptoPrices } from "../../services/api"
import DepositModal from "../../components/banking/DepositModal"
import WithdrawModal from "../../components/banking/WithdrawModal"
import SendMoneyModal from "../../components/banking/SendMoneyModal"
import SellCryptoModal from "../../components/crypto/SellCryptoModal"

const primary = "#0F3D2E"
const primaryMid = "#124734"
const primaryLight = "#0B5D3B"
const accent = "#E6A800"
const accentBright = "#F4B400"

const getTimeOfDay = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "morning"
    if (hour < 17) return "afternoon"
    return "evening"
}

const getLastThreeMonths = () => {
    const months = []
    for (let i = 2; i >= 0; i--) {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        months.push({
            label: date.toLocaleString("en-NG", { month: "short" }),
            year: date.getFullYear(),
            month: date.getMonth(),
        })
    }
    return months
}

const calcMonthlyFlow = (transactions, userId, month, year) => {
    const filtered = transactions.filter(tx => {
        const txDate = new Date(tx.createdAt)
        return (
            txDate.getMonth() === month &&
            txDate.getFullYear() === year &&
            tx.status === "success"
        )
    })

    const moneyIn = filtered
        .filter(tx => tx.recipient?._id?.toString() === userId?.toString())
        .reduce((sum, tx) => sum + tx.amount, 0)

    const moneyOut = filtered
        .filter(tx => tx.sender?._id?.toString() === userId?.toString())
        .reduce((sum, tx) => sum + tx.amount, 0)

    return { moneyIn, moneyOut }
}

const Dashboard = () => {
    const navigate = useNavigate()
    const cookies = new Cookies()
    const user = cookies.get("user")

    const token = cookies.get("token")
    const decoded = JSON.parse(atob(token.split(".")[1]))
    const userId = decoded.id

    const [profile, setProfile] = useState(null)
    const [wallet, setWallet] = useState(null)
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const [balanceVisible, setBalanceVisible] = useState(true)
    const [activeModal, setActiveModal] = useState(null)
    const [prices, setPrices] = useState(null)

    const fetchData = async () => {
        try {
            const [profileRes, walletRes, txRes, pricesRes] = await Promise.all([
                myProfile(),
                getCryptoWallet(),
                getTransactionHistory(),
                getCryptoPrices()
            ])
            setProfile(profileRes.data.data)
            setWallet(walletRes.data.data)
            setTransactions(txRes.data.data || [])
            setPrices(pricesRes.data.prices)


        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }



    useEffect(() => {
        fetchData()

        const interval = setInterval(() => {
            fetchData()
        }, 30000)

        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        const handleFocus = () => fetchData()
        window.addEventListener("focus", handleFocus)
        return () => window.removeEventListener("focus", handleFocus)
    }, [])

    const quickActions = [
        { icon: "💸", label: "Send Money", modal: "transfer", color: primary },
        { icon: "⬇️", label: "Deposit", modal: "deposit", color: "#2196F3" },
        { icon: "⬆️", label: "Withdraw", modal: "withdraw", color: "#9C27B0" },
        { icon: "₿", label: "Sell Crypto", modal: "sell", color: accent },
    ]

    const months = getLastThreeMonths()
    const monthlyData = months.map(m => ({
        label: m.label,
        ...calcMonthlyFlow(transactions, user?._id || userId, m.month, m.year)
    }))

    const maxValue = Math.max(
        ...monthlyData.map(m => Math.max(m.moneyIn, m.moneyOut)),
        1
    )

    if (loading) {
        return (
            <Layout pageTitle="Dashboard">
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
                    <div style={{ textAlign: "center" }}>
                        <div className="spinner-border" style={{ color: primary }} role="status" />
                        <p style={{ color: "#888", marginTop: 12, fontFamily: "'Inter', sans-serif" }}>
                            Loading your dashboard...
                        </p>
                    </div>
                </div>
            </Layout>
        )
    }

    return (
        <Layout pageTitle="Dashboard">

            <AdminMessageFormat context="general" />

            <div className="mb-4">
                <h5 style={{
                    color: primary, fontWeight: "bold",
                    fontFamily: "'Inter', sans-serif", marginBottom: 4
                }}>
                    Good {getTimeOfDay()}, {profile?.firstName || user?.firstName}.
                </h5>
                <p style={{ color: "#888", fontSize: 13, margin: 0 }}>
                    Here's an overview of your account today.
                </p>
            </div>

            <div className="row g-4 mb-4">

                <div className="col-12 col-lg-6">
                    <div style={{
                        background: `linear-gradient(135deg, ${primary} 0%, ${primaryMid} 50%, ${primaryLight} 100%)`,
                        borderRadius: "16px",
                        padding: "28px",
                        color: "#FFFFFF",
                        position: "relative",
                        overflow: "hidden",
                        minHeight: "200px",
                    }}>
                        <div style={{
                            position: "absolute", top: "-40px", right: "-40px",
                            width: "180px", height: "180px", borderRadius: "50%",
                            background: "rgba(255,255,255,0.04)", pointerEvents: "none"
                        }} />

                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, letterSpacing: "2px", marginBottom: 4 }}>
                                    BANK BALANCE
                                </p>
                                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginBottom: 0 }}>
                                    Acc: {profile?.accountNumber || user?.accountNumber || "—"}
                                </p>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                <span
                                    onClick={() => setBalanceVisible(!balanceVisible)}
                                    style={{ cursor: "pointer", fontSize: 18, color: "rgba(255,255,255,0.6)", userSelect: "none" }}
                                >
                                    {balanceVisible ? "👁️‍🗨️" : "🚫"}
                                </span>
                                <div style={{
                                    background: "rgba(230,168,0,0.2)", border: "1px solid rgba(230,168,0,0.3)",
                                    borderRadius: "6px", padding: "4px 10px",
                                    fontSize: 11, color: accent, letterSpacing: "1px"
                                }}>
                                    SECURED 🔒
                                </div>
                            </div>
                        </div>

                        <h2 style={{
                            color: "#FFFFFF", fontWeight: "bold",
                            fontSize: "clamp(24px, 4vw, 36px)",
                            fontFamily: "'Inter', sans-serif",
                            marginBottom: 0, letterSpacing: "1px"
                        }}>
                            {balanceVisible
                                ? `₦${parseFloat(profile?.bankBalance || 0).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                : "₦ ••••••"
                            }
                        </h2>
                    </div>
                </div>

                <div className="col-12 col-lg-6">
                    <div style={{
                        background: "#FFFFFF", border: "1px solid #e8ede9",
                        borderRadius: "16px", padding: "28px",
                        minHeight: "180px",
                        boxShadow: "0 4px 20px rgba(15,61,46,0.06)",
                        position: "relative", overflow: "hidden",
                    }}>
                        <div style={{
                            position: "absolute", top: "-40px", right: "-40px",
                            width: "160px", height: "160px", borderRadius: "50%",
                            background: `${accent}08`, pointerEvents: "none"
                        }} />

                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                                <p style={{ color: "#888", fontSize: 11, letterSpacing: "2px", marginBottom: 4 }}>
                                    CRYPTO PORTFOLIO
                                </p>
                                <p style={{ color: "#aaa", fontSize: 12, marginBottom: 0 }}>
                                    Total value in USD
                                </p>
                            </div>
                            <div style={{
                                background: `${accent}15`, borderRadius: "6px",
                                padding: "4px 10px", fontSize: 11,
                                color: accent, fontWeight: "bold", letterSpacing: "1px"
                            }}>
                                LIVE ₿
                            </div>
                        </div>

                        <h2 style={{
                            color: primary, fontWeight: "bold",
                            fontSize: "clamp(24px, 4vw, 36px)",
                            fontFamily: "'Inter', sans-serif",
                            marginBottom: 20, letterSpacing: "1px"
                        }}>
                            ${parseFloat(wallet?.totalUsdValue || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </h2>

                        <div className="d-flex gap-2 flex-wrap">
                            <button
                                onClick={() => navigate("/crypto")}
                                style={{
                                    background: primary, color: "#FFFFFF",
                                    border: "none", borderRadius: "6px",
                                    padding: "8px 16px", fontSize: 12,
                                    fontFamily: "'Inter', sans-serif",
                                    fontWeight: "bold", cursor: "pointer",
                                    letterSpacing: "0.5px", transition: "background 0.2s"
                                }}
                                onMouseOver={e => e.target.style.background = primaryLight}
                                onMouseOut={e => e.target.style.background = primary}
                            >
                                View Balances
                            </button>
                            <button
                                onClick={() => navigate("/crypto")}
                                style={{
                                    background: accent, color: primary,
                                    border: "none", borderRadius: "6px",
                                    padding: "8px 16px", fontSize: 12,
                                    fontFamily: "'Inter', sans-serif",
                                    fontWeight: "bold", cursor: "pointer",
                                    letterSpacing: "0.5px", transition: "background 0.2s"
                                }}
                                onMouseOver={e => e.target.style.background = accentBright}
                                onMouseOut={e => e.target.style.background = accent}
                            >
                                Sell / Deposit Crypto ₿
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            <p style={{ color: "#888", fontSize: 11, letterSpacing: "2px", fontWeight: "bold", marginBottom: 16 }}>
                QUICK ACTIONS
            </p>

            <div className="row g-3 mb-4">
                {quickActions.map((action, i) => (
                    <div key={i} className="col-6 col-sm-3">
                        <div
                            onClick={() => setActiveModal(action.modal)}
                            style={{
                                background: "#FFFFFF", border: "1px solid #e8ede9",
                                borderRadius: "12px", padding: "20px 16px",
                                textAlign: "center", cursor: "pointer",
                                transition: "all 0.2s",
                                boxShadow: "0 2px 8px rgba(15,61,46,0.04)"
                            }}
                            onMouseOver={e => {
                                e.currentTarget.style.transform = "translateY(-3px)"
                                e.currentTarget.style.boxShadow = "0 8px 20px rgba(15,61,46,0.10)"
                                e.currentTarget.style.borderColor = action.color
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.transform = "translateY(0)"
                                e.currentTarget.style.boxShadow = "0 2px 8px rgba(15,61,46,0.04)"
                                e.currentTarget.style.borderColor = "#e8ede9"
                            }}
                        >
                            <div style={{
                                width: 44, height: 44,
                                background: `${action.color}15`,
                                borderRadius: "10px",
                                display: "flex", alignItems: "center",
                                justifyContent: "center",
                                fontSize: 22, margin: "0 auto 12px",
                            }}>
                                {action.icon}
                            </div>
                            <p style={{
                                color: primary, fontWeight: "bold",
                                fontSize: 13, margin: 0,
                                fontFamily: "'Inter', sans-serif",
                            }}>
                                {action.label}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{
                background: "#FFFFFF", border: "1px solid #e8ede9",
                borderRadius: "16px", padding: "24px 28px",
                boxShadow: "0 2px 12px rgba(15,61,46,0.04)"
            }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <p style={{ color: "#888", fontSize: 11, letterSpacing: "2px", fontWeight: "bold", marginBottom: 4 }}>
                            MONTHLY FLOW
                        </p>
                        <p style={{ color: primary, fontWeight: "bold", fontSize: 15, margin: 0, fontFamily: "'Inter', sans-serif" }}>
                            Money In vs Money Out
                        </p>
                    </div>
                    <div className="d-flex gap-3">
                        <div className="d-flex align-items-center gap-1">
                            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#4CAF50" }} />
                            <span style={{ fontSize: 12, color: "#888" }}>In</span>
                        </div>
                        <div className="d-flex align-items-center gap-1">
                            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef5350" }} />
                            <span style={{ fontSize: 12, color: "#888" }}>Out</span>
                        </div>
                    </div>
                </div>

                <div className="d-flex justify-content-around align-items-end" style={{ height: 160, gap: 16 }}>
                    {monthlyData.map((month, i) => (
                        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%" }}>
                            <div className="d-flex align-items-end gap-1 w-100 justify-content-center" style={{ flex: 1 }}>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                                    <span style={{ fontSize: 10, color: "#4CAF50", fontWeight: "bold" }}>
                                        {month.moneyIn > 0 ? `₦${(month.moneyIn / 1000).toFixed(0)}k` : ""}
                                    </span>
                                    <div style={{
                                        width: 28,
                                        height: Math.max((month.moneyIn / maxValue) * 120, month.moneyIn > 0 ? 8 : 0),
                                        background: "linear-gradient(180deg, #66BB6A, #4CAF50)",
                                        borderRadius: "4px 4px 0 0",
                                        transition: "height 0.5s ease",
                                        minHeight: month.moneyIn > 0 ? 8 : 0
                                    }} />
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                                    <span style={{ fontSize: 10, color: "#ef5350", fontWeight: "bold" }}>
                                        {month.moneyOut > 0 ? `₦${(month.moneyOut / 1000).toFixed(0)}k` : ""}
                                    </span>
                                    <div style={{
                                        width: 28,
                                        height: Math.max((month.moneyOut / maxValue) * 120, month.moneyOut > 0 ? 8 : 0),
                                        background: "linear-gradient(180deg, #EF9A9A, #ef5350)",
                                        borderRadius: "4px 4px 0 0",
                                        transition: "height 0.5s ease",
                                        minHeight: month.moneyOut > 0 ? 8 : 0
                                    }} />
                                </div>
                            </div>

                            <div style={{
                                borderTop: "1px solid #e8ede9",
                                paddingTop: 8, marginTop: 8,
                                width: "100%", textAlign: "center"
                            }}>
                                <span style={{ fontSize: 12, color: "#888", fontFamily: "'Inter', sans-serif" }}>
                                    {month.label}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="d-flex gap-4 mt-4 pt-3" style={{ borderTop: "1px solid #f0f0f0" }}>
                    <div>
                        <p style={{ color: "#888", fontSize: 11, letterSpacing: "1px", marginBottom: 2 }}>
                            THIS MONTH IN
                        </p>
                        <p style={{ color: "#4CAF50", fontWeight: "bold", fontSize: 15, margin: 0, fontFamily: "'Inter', sans-serif" }}>
                            +₦{parseFloat(monthlyData[2]?.moneyIn || 0).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    </div>
                    <div style={{ width: "1px", background: "#f0f0f0" }} />
                    <div>
                        <p style={{ color: "#888", fontSize: 11, letterSpacing: "1px", marginBottom: 2 }}>
                            THIS MONTH OUT
                        </p>
                        <p style={{ color: "#ef5350", fontWeight: "bold", fontSize: 15, margin: 0, fontFamily: "'Inter', sans-serif" }}>
                            -₦{parseFloat(monthlyData[2]?.moneyOut || 0).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    </div>
                </div>

            </div>

            <SendMoneyModal
                show={activeModal === "transfer"}
                onClose={() => { setActiveModal(null); fetchData() }}
            />
            <DepositModal
                show={activeModal === "deposit"}
                onClose={() => { setActiveModal(null); fetchData() }}
            />
            <WithdrawModal
                show={activeModal === "withdraw"}
                onClose={() => { setActiveModal(null); fetchData() }}
            />
            <SellCryptoModal
                show={activeModal === "sell"}
                onClose={() => { setActiveModal(null); fetchData() }}
                wallet={wallet?.cryptoWallet}
                prices={prices}
            />
            
        </Layout>
    )
}

export default Dashboard;