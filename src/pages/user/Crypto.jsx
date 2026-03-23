import { useState, useEffect } from "react"
import Layout from "../../components/common/Layout"
import AdminMessageFormat from "../../components/common/AdminMessageFormat"
import DepositCryptoModal from "../../components/crypto/DepositCryptoModal"
import SellCryptoModal from "../../components/crypto/SellCryptoModal"
import { getCryptoPrices, getCryptoWallet } from "../../services/api"
import { useNavigate } from "react-router-dom"


const primary = "#0F3D2E"
const primaryLight = "#0B5D3B"
const accent = "#E6A800"

const COIN_ICONS = { btc: "₿", eth: "E", usdt: "Ŧ" }
const COIN_NAMES = { btc: "Bitcoin", eth: "Ethereum", usdt: "Tether" }
const COIN_COLORS = { btc: "#F7931A", eth: "#627EEA", usdt: "#26A17B" }

const Crypto = () => {
    const navigate = useNavigate()
    const [wallet, setWallet] = useState(null)
    const [prices, setPrices] = useState(null)
    const [loading, setLoading] = useState(true)
    const [activeModal, setActiveModal] = useState(null)

    const fetchData = async () => {
        try {
            const [walletRes, pricesRes] = await Promise.all([
                getCryptoWallet(),
                getCryptoPrices()
            ])
            setWallet(walletRes.data.data)
            setPrices(pricesRes.data.prices)

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    // useEffect(() => { fetchData() }, [])
    useEffect(() => {
    fetchData()
    const interval = setInterval(() => {
        fetchData()
    }, 30000) 
    return () => clearInterval(interval)
}, [])

    const coins = ["btc", "eth", "usdt"]

    if (loading) {
        return (
            <Layout pageTitle="Crypto">
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
                    <div style={{ textAlign: "center" }}>
                        <div className="spinner-border" style={{ color: primary }} role="status" />
                        <p style={{ color: "#888", marginTop: 12, fontFamily: "'Inter', sans-serif" }}>
                            Loading crypto wallet...
                        </p>
                    </div>
                </div>
            </Layout>
        )
    }

    return (
        <Layout pageTitle="Crypto">

            {/* Heading */}
            <div className="mb-4">
                <h5 style={{
                    color: primary,
                    fontWeight: "bold",
                    fontFamily: "'Inter', sans-serif",
                    marginBottom: 4
                }}>
                    Crypto Wallet
                </h5>
                <p style={{ color: "#888", fontSize: 13, margin: 0 }}>
                    Manage your crypto portfolio.
                </p>
            </div>

            <div
                className="mb-4 p-4"
                style={{
                    background: `linear-gradient(135deg, ${primary} 0%, ${primaryLight} 100%)`,
                    borderRadius: "16px",
                    color: "#FFFFFF",
                    position: "relative",
                    overflow: "hidden"
                }}
            >
                <div style={{
                    position: "absolute", top: "-40px", right: "-40px",
                    width: "180px", height: "180px", borderRadius: "50%",
                    background: "rgba(255,255,255,0.04)", pointerEvents: "none"
                }} />

                <p style={{
                    color: "rgba(255,255,255,0.6)",
                    fontSize: 11,
                    letterSpacing: "2px",
                    marginBottom: 4
                }}>
                    TOTAL PORTFOLIO VALUE
                </p>
                <h2 style={{
                    color: "#FFFFFF",
                    fontWeight: "bold",
                    fontSize: "clamp(24px, 4vw, 36px)",
                    fontFamily: "'Inter', sans-serif",
                    marginBottom: 4,
                    letterSpacing: "1px"
                }}>
                    ${parseFloat(wallet?.totalUsdValue || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h2>

                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, margin: 0 }}>
                    ≈ ₦{parseFloat(wallet?.totalNgnValue || 0).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>

{/* <div style={{
    position: "absolute", top: "-40px", right: "-40px",
    width: "180px", height: "180px", borderRadius: "50%",
    background: "rgba(255,255,255,0.04)", pointerEvents: "none"
}} /> */}
    
</div>


<div className="mb-4 d-flex align-items-center gap-2" style={{
    background: "#fff",
    border: "1px solid #e8ede9",
    borderRadius: "8px",
    padding: "10px 16px",
    fontSize: "12px",
}}>
    <span style={{ color: "#888" }}>Live Exchange Rate</span>
    <span style={{
        background: "#0F3D2E15",
        color: "#0F3D2E",
        fontWeight: "bold",
        padding: "2px 10px",
        borderRadius: "20px",
        fontSize: "12px"
    }}>
        $1 = ₦{prices?.dollarToNGN?.toLocaleString("en-US")}
    </span>
    <span style={{
        marginLeft: "auto",
        color: "#f80707",
        fontSize: "11px"
    }}>
        ● Live
    </span>
</div>

            <p style={{
                color: "#888",
                fontSize: 11,
                letterSpacing: "2px",
                fontWeight: "bold",
                marginBottom: 16
            }}>
                YOUR BALANCES
            </p>

            <div className="row g-3 mb-4">
                {coins.map(coin => {
                    const coinData = wallet?.cryptoWallet?.[coin]
                    const priceData = prices?.[coin]
                    const balance = coinData?.balance || 0
                    const usdValue = coinData?.usdValue || 0
                    const ngnValue = coinData?.ngnValue || 0
                    const usdPrice = priceData?.usdPrice || 0
                    const ngnPrice = priceData?.nairaPrice || 0

                    return (
                        <div key={coin} className="col-12 col-md-4">
                            <div style={{
                                background: "#FFFFFF",
                                border: "1px solid #e8ede9",
                                borderRadius: "14px",
                                padding: "20px",
                                boxShadow: "0 2px 8px rgba(15,61,46,0.04)"
                            }}>
                                <div className="d-flex align-items-center gap-3 mb-3">
                                    <div style={{
                                        width: "40px", height: "40px",
                                        borderRadius: "10px",
                                        background: `${COIN_COLORS[coin]}15`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "18px",
                                        color: COIN_COLORS[coin],
                                        fontWeight: "bold"
                                    }}>
                                        {COIN_ICONS[coin]}
                                    </div>
                                    <div>
                                        <p style={{
                                            color: primary,
                                            fontWeight: "bold",
                                            fontSize: "14px",
                                            fontFamily: "'Inter', sans-serif",
                                            margin: 0
                                        }}>
                                            {COIN_NAMES[coin]}
                                        </p>
                                        <p style={{ color: "#aaa", fontSize: "11px", margin: 0 }}>
                                            {coin.toUpperCase()}
                                        </p>
                                    </div>
                                </div>

                                <p style={{
                                    color: primary,
                                    fontWeight: "bold",
                                    fontSize: "18px",
                                    fontFamily: "'Inter', sans-serif",
                                    margin: "0 0 2px"
                                }}>
                                    {balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 5 })} {coin.toUpperCase()}
                                </p>
                                <p style={{ color: "#4CAF50", fontSize: "12px", fontWeight: "bold", margin: "0 0 2px" }}>
                                    ${usdValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                                <p style={{ color: "#aaa", fontSize: "11px", margin: "0 0 12px" }}>
                                    ₦{ngnValue.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>

                                <div style={{
                                    background: "#fafafa",
                                    borderRadius: "6px",
                                    padding: "6px 10px",
                                    fontSize: "11px",
                                    color: "#888"
                                }}>
                                    1 {coin.toUpperCase()} = ${usdPrice.toLocaleString("en-US")} / ₦{ngnPrice.toLocaleString("en-NG")}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>


            <p style={{
                color: "#888",
                fontSize: 11,
                letterSpacing: "2px",
                fontWeight: "bold",
                marginBottom: 16
            }}>
                ACTIONS
            </p>

            <div className="row g-3 mb-4">
                {[
                    {
                        id: "deposit",
                        icon: "⬇️",
                        title: "Deposit Crypto",
                        sub: "Add BTC, ETH or USDT to your wallet",
                        color: "#2196F3",
                        btnLabel: "Deposit Crypto"
                    },
                    {
                        id: "sell",
                        icon: "💱",
                        title: "Sell Crypto",
                        sub: "Convert your crypto to Naira instantly",
                        color: accent,
                        btnLabel: "Sell Crypto"
                    },
                ].map(card => (
                    <div key={card.id} className="col-12 col-md-6">
                        <div style={{
                            background: "#FFFFFF",
                            border: "1px solid #e8ede9",
                            borderRadius: "16px",
                            padding: "24px",
                            boxShadow: "0 2px 12px rgba(15,61,46,0.04)",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            gap: "16px"
                        }}>
                            <div style={{
                                width: "52px", height: "52px",
                                background: `${card.color}12`,
                                borderRadius: "12px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "26px"
                            }}>
                                {card.icon}
                            </div>

                            <div style={{ flex: 1 }}>
                                <h6 style={{
                                    color: primary,
                                    fontWeight: "bold",
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: "16px",
                                    marginBottom: 6
                                }}>
                                    {card.title}
                                </h6>
                                <p style={{ color: "#888", fontSize: "13px", margin: 0, lineHeight: 1.6 }}>
                                    {card.sub}
                                </p>
                            </div>

                            <button
                                onClick={() => setActiveModal(card.id)}
                                style={{
                                    width: "100%",
                                    padding: "11px",
                                    background: card.color,
                                    color: card.id === "sell" ? primary : "#FFFFFF",
                                    border: "none",
                                    borderRadius: "8px",
                                    fontSize: "13px",
                                    fontWeight: "bold",
                                    fontFamily: "'Inter', sans-serif",
                                    letterSpacing: "1px",
                                    cursor: "pointer",
                                    transition: "opacity 0.2s"
                                }}
                                onMouseOver={e => e.currentTarget.style.opacity = "0.85"}
                                onMouseOut={e => e.currentTarget.style.opacity = "1"}
                            >
                                {card.btnLabel}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div
                onClick={() => navigate("/transactions", { state: { activeType: "crypto" } })}
                style={{
                    textAlign: "center",
                    marginTop: "8px",
                    cursor: "pointer",
                    color: "#888",
                    fontSize: "13px",
                    fontFamily: "'Inter', sans-serif"
                }}
            >
                View full crypto history →{" "}
                <span style={{ color: primary, fontWeight: "bold" }}>
                    Transactions
                </span>
            </div>

            <DepositCryptoModal
                show={activeModal === "deposit"}
                onClose={() => { setActiveModal(null); fetchData() }}
                wallet={wallet?.cryptoWallet}
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

export default Crypto;