import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Cookies from "universal-cookie"
import Layout from "../../components/common/Layout"
import AdminMessageFormat from "../../components/common/AdminMessageFormat"
import SendMoneyModal from "../../components/banking/SendMoneyModal"
import DepositModal from "../../components/banking/DepositModal"
import WithdrawModal from "../../components/banking/WithdrawModal"
import SellCryptoModal from "../../components/crypto/SellCryptoModal"
import { getAllUsers, getExchangeDetails, myProfile, getCryptoWallet, getCryptoPrices } from "../../services/api"

const primary      = "#0F3D2E"
const primaryMid   = "#124734"
const primaryLight = "#0B5D3B"
const accent       = "#E6A800"

const AdminDashboard = () => {
    const navigate = useNavigate()
    const cookies  = new Cookies()
    const token    = cookies.get("token")
    const userId   = token ? JSON.parse(atob(token.split(".")[1])).id : null

    const [users,          setUsers]          = useState([])
    const [exchange,       setExchange]       = useState(null)
    const [profile,        setProfile]        = useState(null)
    const [wallet,         setWallet]         = useState(null)
    const [prices,         setPrices]         = useState(null)
    const [loading,        setLoading]        = useState(true)
    const [balanceVisible, setBalanceVisible] = useState(true)
    const [activeModal,    setActiveModal]    = useState(null)

    const fetchData = async () => {
        try {
            const [usersRes, exchangeRes, profileRes, walletRes, pricesRes] = await Promise.all([
                getAllUsers(),
                getExchangeDetails(),
                myProfile(),
                getCryptoWallet(),
                getCryptoPrices()
            ])
            setUsers(usersRes.data.data       || [])
            setExchange(exchangeRes.data.data || null)
            setProfile(profileRes.data.data)
            setWallet(walletRes.data.data)
            setPrices(pricesRes.data.prices)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchData() }, [])

    useEffect(() => {
        const handleFocus = () => fetchData()
        window.addEventListener("focus", handleFocus)
        return () => window.removeEventListener("focus", handleFocus)
    }, [])

    const totalUsers     = users.length
    const activeUsers    = users.filter(u => u.isActive).length
    const suspendedUsers = users.filter(u => !u.isActive).length
    const recentUsers    = [...users]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)

    const getTimeOfDay = () => {
        const hour = new Date().getHours()
        if (hour < 12) return "morning"
        if (hour < 17) return "afternoon"
        return "evening"
    }

    const quickActions = [
        { id: "send",     icon: "💸", label: "Send Money",  color: primary    },
        { id: "deposit",  icon: "⬇️", label: "Deposit",     color: "#2196F3"  },
        { id: "withdraw", icon: "⬆️", label: "Withdraw",    color: "#9C27B0"  },
        { id: "sell",     icon: "₿",  label: "Sell Crypto", color: accent     },
    ]

    if (loading) {
        return (
            <Layout pageTitle="Admin Dashboard">
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
                    <div style={{ textAlign: "center" }}>
                        <div className="spinner-border" style={{ color: primary }} role="status" />
                        <p style={{ color: "#888", marginTop: 12, fontFamily: "'Inter', sans-serif" }}>
                            Loading dashboard...
                        </p>
                    </div>
                </div>
            </Layout>
        )
    }

    return (
        <Layout pageTitle="Admin Dashboard">

            <AdminMessageFormat context="general" />

            <div className="mb-4">
                <h5 style={{
                    color:        primary,
                    fontWeight:   "bold",
                    fontFamily:   "'Inter', sans-serif",
                    marginBottom: 4
                }}>
                    Good {getTimeOfDay()}, Admin.
                </h5>
                <p style={{ color: "#888", fontSize: 13, margin: 0 }}>
                    Here's your platform overview.
                </p>
            </div>

            <p style={{ color: "#888", fontSize: 11, letterSpacing: "2px", fontWeight: "bold", marginBottom: 16 }}>
                PLATFORM STATS
            </p>
            <div className="row g-3 mb-4">
                {[
                    { label: "TOTAL USERS",     value: totalUsers,     icon: "👥", color: primary   },
                    { label: "ACTIVE USERS",    value: activeUsers,    icon: "✅", color: "#4CAF50" },
                    { label: "SUSPENDED",       value: suspendedUsers, icon: "🚫", color: "#ef5350" },
                    { label: "NAIRA LIQUIDITY", value: `₦${parseFloat(exchange?.nairaLiquidity || 0).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: "💰", color: accent },
                ].map((stat, i) => (
                    <div key={i} className="col-6 col-md-3">
                        <div style={{
                            background:   "#FFFFFF",
                            border:       "1px solid #e8ede9",
                            borderRadius: "14px",
                            padding:      "20px",
                            boxShadow:    "0 2px 8px rgba(15,61,46,0.04)"
                        }}>
                            <div style={{
                                width:          "40px", height: "40px",
                                background:     `${stat.color}12`,
                                borderRadius:   "10px",
                                display:        "flex",
                                alignItems:     "center",
                                justifyContent: "center",
                                fontSize:       "18px",
                                marginBottom:   "12px"
                            }}>
                                {stat.icon}
                            </div>
                            <p style={{ color: "#aaa", fontSize: "10px", letterSpacing: "1.5px", margin: "0 0 4px" }}>
                                {stat.label}
                            </p>
                            <p style={{
                                color:      stat.color,
                                fontWeight: "bold",
                                fontSize:   "20px",
                                fontFamily: "'Inter', sans-serif",
                                margin:     0
                            }}>
                                {stat.value}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <p style={{ color: "#888", fontSize: 11, letterSpacing: "2px", fontWeight: "bold", marginBottom: 16 }}>
                YOUR ACCOUNTS
            </p>
            <div className="row g-4 mb-4">

                <div className="col-12 col-lg-6">
                    <div style={{
                        background:   `linear-gradient(135deg, ${primary} 0%, ${primaryMid} 50%, ${primaryLight} 100%)`,
                        borderRadius: "16px",
                        padding:      "28px",
                        color:        "#FFFFFF",
                        position:     "relative",
                        overflow:     "hidden",
                        minHeight:    "160px"
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
                                    Acc: {profile?.accountNumber || "—"}
                                </p>
                            </div>
                            <span
                                onClick={() => setBalanceVisible(!balanceVisible)}
                                style={{ cursor: "pointer", fontSize: 18, color: "rgba(255,255,255,0.6)", userSelect: "none" }}
                            >
                                {balanceVisible ? "👁️" : "🙈"}
                            </span>
                        </div>
                        <h2 style={{
                            color:        "#FFFFFF",
                            fontWeight:   "bold",
                            fontSize:     "clamp(24px, 4vw, 32px)",
                            fontFamily:   "'Inter', sans-serif",
                            marginBottom: 0,
                            letterSpacing: "1px"
                        }}>
                            {balanceVisible
                                ? `₦${parseFloat(profile?.bankBalance || 0).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                : "₦ ••••••"
                            }
                        </h2>
                    </div>
                </div>

                {/* Crypto Portfolio */}
                <div className="col-12 col-lg-6">
                    <div style={{
                        background:   "#FFFFFF",
                        border:       "1px solid #e8ede9",
                        borderRadius: "16px",
                        padding:      "28px",
                        minHeight:    "160px",
                        boxShadow:    "0 4px 20px rgba(15,61,46,0.06)",
                        position:     "relative",
                        overflow:     "hidden"
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
                                <p style={{ color: "#aaa", fontSize: 12, marginBottom: 0 }}>Total in USD</p>
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
                            color:        primary,
                            fontWeight:   "bold",
                            fontSize:     "clamp(24px, 4vw, 32px)",
                            fontFamily:   "'Inter', sans-serif",
                            marginBottom: 0,
                            letterSpacing: "1px"
                        }}>
                            ${parseFloat(wallet?.totalUsdValue || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </h2>
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
                            onClick={() => setActiveModal(action.id)}
                            style={{
                                background:   "#FFFFFF",
                                border:       "1px solid #e8ede9",
                                borderRadius: "12px",
                                padding:      "20px 16px",
                                textAlign:    "center",
                                cursor:       "pointer",
                                transition:   "all 0.2s",
                                boxShadow:    "0 2px 8px rgba(15,61,46,0.04)"
                            }}
                            onMouseOver={e => {
                                e.currentTarget.style.transform   = "translateY(-3px)"
                                e.currentTarget.style.boxShadow   = "0 8px 20px rgba(15,61,46,0.10)"
                                e.currentTarget.style.borderColor = action.color
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.transform   = "translateY(0)"
                                e.currentTarget.style.boxShadow   = "0 2px 8px rgba(15,61,46,0.04)"
                                e.currentTarget.style.borderColor = "#e8ede9"
                            }}
                        >
                            <div style={{
                                width:          44, height: 44,
                                background:     `${action.color}15`,
                                borderRadius:   "10px",
                                display:        "flex",
                                alignItems:     "center",
                                justifyContent: "center",
                                fontSize:       22,
                                margin:         "0 auto 12px"
                            }}>
                                {action.icon}
                            </div>
                            <p style={{
                                color:      primary,
                                fontWeight: "bold",
                                fontSize:   13,
                                margin:     0,
                                fontFamily: "'Inter', sans-serif"
                            }}>
                                {action.label}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{
                background:   "#FFFFFF",
                border:       "1px solid #e8ede9",
                borderRadius: "16px",
                overflow:     "hidden",
                boxShadow:    "0 2px 8px rgba(15,61,46,0.04)"
            }}>
                <div className="d-flex justify-content-between align-items-center p-3" style={{ borderBottom: "1px solid #f0f0f0" }}>
                    <p style={{ color: "#888", fontSize: "11px", letterSpacing: "2px", fontWeight: "bold", margin: 0 }}>
                        RECENT USERS
                    </p>
                    <button
                        onClick={() => navigate("/admin/users")}
                        style={{
                            background:   "transparent",
                            border:       `1px solid ${primary}`,
                            borderRadius: "6px",
                            padding:      "4px 12px",
                            fontSize:     "11px",
                            color:        primary,
                            fontWeight:   "bold",
                            cursor:       "pointer",
                            fontFamily:   "'Inter', sans-serif"
                        }}
                    >
                        View All →
                    </button>
                </div>

                {recentUsers.length === 0 ? (
                    <div style={{ padding: "40px 24px", textAlign: "center" }}>
                        <p style={{ color: "#aaa", fontFamily: "'Inter', sans-serif", margin: 0 }}>
                            No users yet
                        </p>
                    </div>
                ) : recentUsers.map((user, i) => (
                    <div
                        key={user._id}
                        className="d-flex align-items-center gap-3"
                        style={{
                            padding:      "14px 20px",
                            borderBottom: i < recentUsers.length - 1 ? "1px solid #f8f8f8" : "none"
                        }}
                    >
                        <div style={{
                            width:          "36px", height: "36px",
                            borderRadius:   "50%",
                            background:     primary,
                            display:        "flex",
                            alignItems:     "center",
                            justifyContent: "center",
                            color:          accent,
                            fontWeight:     "bold",
                            fontSize:       "13px",
                            fontFamily:     "'Inter', sans-serif",
                            flexShrink:     0
                        }}>
                            {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{
                                color:        primary,
                                fontWeight:   "bold",
                                fontSize:     "13px",
                                fontFamily:   "'Inter', sans-serif",
                                margin:       "0 0 2px",
                                whiteSpace:   "nowrap",
                                overflow:     "hidden",
                                textOverflow: "ellipsis"
                            }}>
                                {user.firstName} {user.lastName}
                            </p>
                            <p style={{ color: "#aaa", fontSize: "11px", margin: 0 }}>
                                {user.email} · {user.accountNumber}
                            </p>
                        </div>
                        <span style={{
                            background:    user.isActive ? "rgba(76,175,80,0.1)" : "rgba(239,83,80,0.1)",
                            color:         user.isActive ? "#4CAF50" : "#ef5350",
                            fontSize:      "10px",
                            fontWeight:    "bold",
                            padding:       "3px 10px",
                            borderRadius:  "50px",
                            letterSpacing: "0.5px",
                            flexShrink:    0
                        }}>
                            {user.isActive ? "ACTIVE" : "SUSPENDED"}
                        </span>
                    </div>
                ))}
            </div>

            <SendMoneyModal
                show={activeModal === "send"}
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

export default AdminDashboard;