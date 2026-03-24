import { useState, useEffect } from "react"
import Cookies from "universal-cookie"
import Layout from "../../components/common/Layout"
import ModalShell from "../../components/common/ModalShell"
import { getTransactionHistory, getCryptoTransactionHistory } from "../../services/api"
import { useLocation } from "react-router-dom"

const primary      = "#0F3D2E"
const primaryLight = "#0B5D3B"
const accent       = "#E6A800"


const Transactions = () => {
    const cookies = new Cookies()
    const token   = cookies.get("token")
    const userId  = token ? JSON.parse(atob(token.split(".")[1])).id : null
    const location = useLocation()




    const [bankTxs,      setBankTxs]      = useState([])
    const [cryptoTxs,    setCryptoTxs]    = useState([])
    const [loading,      setLoading]      = useState(true)
    const [activeTab,    setActiveTab]    = useState("all")
    const [activeType,   setActiveType]   = useState(location.state?.activeType || "banking")
    const [search,       setSearch]       = useState("")
    const [selectedTx,   setSelectedTx]   = useState(null)

    const fetchData = async () => {
        try {
            const [bankRes, cryptoRes] = await Promise.all([
                getTransactionHistory(),
                getCryptoTransactionHistory()
            ])            
            setBankTxs(bankRes.data.data   || [])            
            setCryptoTxs(cryptoRes.data.transactions || [])
            console.log(cryptoRes.data.transactions);
            
            

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchData() }, [])

    const isMoneyIn = (tx) => tx.recipient?._id?.toString() === userId?.toString()

    const filteredBankTxs = bankTxs
        .filter(tx => {
            if (activeTab === "in")  return isMoneyIn(tx)
            if (activeTab === "out") return !isMoneyIn(tx)
            return true
        })
        .filter(tx => {
            if (!search) return true
            const name = isMoneyIn(tx)
                ? `${tx.sender?.firstName} ${tx.sender?.lastName}`
                : `${tx.recipient?.firstName} ${tx.recipient?.lastName}`
            return (
                name.toLowerCase().includes(search.toLowerCase()) ||
                tx.reference?.toLowerCase().includes(search.toLowerCase())
            )
        })

    const filteredCryptoTxs = cryptoTxs.filter(tx => {
        if (!search) return true
        return (
            tx.cryptoType?.toLowerCase().includes(search.toLowerCase()) ||
            tx.reference?.toLowerCase().includes(search.toLowerCase())
        )
    })

    const activeTxs = activeType === "banking" ? filteredBankTxs : filteredCryptoTxs

    const formatDate = (date) => new Date(date).toLocaleDateString("en-NG", {
        day:    "numeric",
        month:  "short",
        year:   "numeric",
        hour:   "2-digit",
        minute: "2-digit"
    })

    const statusColor = (status) => {
        if (status === "success") return { bg: "rgba(76,175,80,0.1)",  color: "#4CAF50" }
        if (status === "failed")  return { bg: "rgba(239,83,80,0.1)",  color: "#ef5350" }
        return                           { bg: "rgba(255,193,7,0.1)",  color: "#4CAF50" }
    }

    if (loading) {
        return (
            <Layout pageTitle="Transactions">
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
                    <div style={{ textAlign: "center" }}>
                        <div className="spinner-border" style={{ color: primary }} role="status" />
                        <p style={{ color: "#888", marginTop: 12, fontFamily: "'Inter', sans-serif" }}>
                            Loading transactions...
                        </p>
                    </div>
                </div>
            </Layout>
        )
    }

    return (
        <Layout pageTitle="Transactions">

            <div className="mb-4">
                <h5 style={{
                    color:        primary,
                    fontWeight:   "bold",
                    fontFamily:   "'Inter', sans-serif",
                    marginBottom: 4
                }}>
                    Transaction History
                </h5>
                <p style={{ color: "#888", fontSize: 13, margin: 0 }}>
                    All your banking and crypto transactions.
                </p>
            </div>

            <div className="d-flex gap-2 mb-4">
                {[
                    { id: "banking", label: "🏦 Banking"  },
                    { id: "crypto",  label: "₿ Crypto"    },
                ].map(t => (
                    <button
                        key={t.id}
                        onClick={() => setActiveType(t.id)}
                        style={{
                            padding:      "8px 20px",
                            borderRadius: "8px",
                            border:       `1.5px solid ${activeType === t.id ? primary : "#ddd"}`,
                            background:   activeType === t.id ? primary : "#FFFFFF",
                            color:        activeType === t.id ? "#FFFFFF" : "#888",
                            fontWeight:   activeType === t.id ? "bold" : "normal",
                            fontFamily:   "'Inter', sans-serif",
                            fontSize:     "13px",
                            cursor:       "pointer",
                            transition:   "all 0.2s"
                        }}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            <div className="mb-3" style={{ maxWidth: "400px" }}>
                <input
                    type="text"
                    placeholder={activeType === "banking" ? "Search by name or reference..." : "Search by coin or reference..."}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{
                        width:        "100%",
                        padding:      "10px 14px",
                        borderRadius: "8px",
                        border:       "1.5px solid #ddd",
                        fontSize:     "13px",
                        fontFamily:   "'Inter', sans-serif",
                        outline:      "none",
                        background:   "#FFFFFF"
                    }}
                    onFocus={e => e.target.style.border = `1.5px solid ${primary}`}
                    onBlur={e  => e.target.style.border = "1.5px solid #ddd"}
                />
            </div>

            {activeType === "banking" && (
                <div
                    className="d-flex gap-2 mb-4"
                    style={{
                        background:   "#FFFFFF",
                        border:       "1px solid #e8ede9",
                        borderRadius: "10px",
                        padding:      "5px",
                        display:      "inline-flex"
                    }}
                >
                    {[
                        { id: "all", label: "All"       },
                        { id: "in",  label: "Money In"  },
                        { id: "out", label: "Money Out" },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                padding:      "8px 16px",
                                borderRadius: "7px",
                                border:       "none",
                                background:   activeTab === tab.id ? primary : "transparent",
                                color:        activeTab === tab.id ? "#FFFFFF" : "#888",
                                fontWeight:   activeTab === tab.id ? "bold" : "normal",
                                fontFamily:   "'Inter', sans-serif",
                                fontSize:     "12px",
                                cursor:       "pointer",
                                transition:   "all 0.2s"
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            )}

            <div style={{
                background:   "#FFFFFF",
                border:       "1px solid #e8ede9",
                borderRadius: "16px",
                overflow:     "hidden",
                boxShadow:    "0 2px 12px rgba(15,61,46,0.04)"
            }}>
                {activeTxs.length === 0 ? (
                    <div style={{ padding: "60px 24px", textAlign: "center" }}>
                        <p style={{ fontSize: "32px", marginBottom: 8 }}>📭</p>
                        <p style={{ color: "#aaa", fontFamily: "'Inter', sans-serif", margin: 0 }}>
                            No transactions found
                        </p>
                    </div>
                ) : (
                    activeTxs.map((tx, i) => {
                        const isBanking  = activeType === "banking"
                        // const moneyIn    = isBanking ? isMoneyIn(tx) : tx.type === "deposit"
                        const moneyIn = isBanking ? tx.type === "deposit"? true: tx.type === "withdrawal"? false : isMoneyIn(tx) : tx.type === "deposit"
                        const otherParty = isBanking
                            ? moneyIn
                                ? `${tx.sender?.firstName || ""} ${tx.sender?.lastName || ""}`
                                : `${tx.recipient?.firstName || ""} ${tx.recipient?.lastName || ""}`
                            : tx.cryptoType?.toUpperCase()

                        const txIcon = isBanking
                            ? tx.type === "deposit"    ? "⬇️"
                            : tx.type === "withdrawal" ? "⬆️"
                            : moneyIn                  ? "📥" : "💸"
                            : tx.type === "deposit"    ? "⬇️" : "💱"

                        const amount = isBanking
                            ? `${moneyIn ? "+" : "-"}₦${parseFloat(tx.amount).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 5 })}`
                            : `${tx.type === "deposit" ? "+" : "-"}${tx.cryptoAmount} ${tx.cryptoType?.toUpperCase()}`

                        const badge = statusColor(tx.status)

                        return (
                            <div
                                key={tx._id || i}
                                onClick={() => setSelectedTx(tx)}
                                style={{
                                    display:       "flex",
                                    alignItems:    "center",
                                    gap:           "14px",
                                    padding:       "16px 20px",
                                    borderBottom:  i < activeTxs.length - 1 ? "1px solid #f0f0f0" : "none",
                                    cursor:        "pointer",
                                    transition:    "background 0.15s"
                                }}
                                onMouseOver={e => e.currentTarget.style.background = "#fafafa"}
                                onMouseOut={e  => e.currentTarget.style.background = "transparent"}
                            >
                                <div style={{
                                    width:          "42px", height: "42px",
                                    background:     moneyIn ? "rgba(76,175,80,0.1)" : "rgba(239,83,80,0.08)",
                                    borderRadius:   "10px",
                                    display:        "flex",
                                    alignItems:     "center",
                                    justifyContent: "center",
                                    fontSize:       "18px",
                                    flexShrink:     0
                                }}>
                                    {txIcon}
                                </div>

                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{
                                        color:        primary,
                                        fontWeight:   "bold",
                                        fontSize:     "14px",
                                        fontFamily:   "'Inter', sans-serif",
                                        margin:       "0 0 2px",
                                        whiteSpace:   "nowrap",
                                        overflow:     "hidden",
                                        textOverflow: "ellipsis"
                                    }}>
                                        {otherParty || tx.type}
                                    </p>
                                    <p style={{ color: "#aaa", fontSize: "12px", margin: 0 }}>
                                        {formatDate(tx.createdAt)}
                                    </p>
                                </div>

                                <div style={{ textAlign: "right", flexShrink: 0 }}>
                                    <p style={{
                                        color:      moneyIn ? "#4CAF50" : "#ef5350",
                                        fontWeight: "bold",
                                        fontSize:   "14px",
                                        fontFamily: "'Inter', sans-serif",
                                        margin:     "0 0 4px"
                                    }}>
                                        {amount}
                                    </p>
                                    <span style={{
                                        background:   badge.bg,
                                        color:        badge.color,
                                        fontSize:     "10px",
                                        fontWeight:   "bold",
                                        padding:      "2px 8px",
                                        borderRadius: "50px",
                                        letterSpacing: "0.5px"
                                    }}>
                                        {tx.status?.toUpperCase()}
                                    </span>
                                </div>

                            </div>
                        )
                    })
                )}
            </div>

            {selectedTx && (
                <ModalShell
                    show={!!selectedTx}
                    onClose={() => setSelectedTx(null)}
                    title="Transaction Details"
                >
                    {(() => {
                        const isBanking = activeType === "banking"
                        // const moneyIn   = isBanking ? isMoneyIn(selectedTx) : selectedTx.type === "deposit"
                        const moneyIn = isBanking ?selectedTx.type === "deposit"? true: selectedTx.type === "withdrawal"? false : isMoneyIn(selectedTx) : selectedTx.type === "deposit"
                        
                        const badge     = statusColor(selectedTx.status)

                        return (
                            <div>
                                <div style={{
                                    textAlign:    "center",
                                    padding:      "20px 0",
                                    borderBottom: "1px solid #f0f0f0",
                                    marginBottom: "20px"
                                }}>
                                    <p style={{ color: "#888", fontSize: 12, letterSpacing: "1px", marginBottom: 4 }}>
                                        AMOUNT
                                    </p>
                                    <h3 style={{
                                        color:      moneyIn ? "#4CAF50" : "#ef5350",
                                        fontWeight: "bold",
                                        fontFamily: "'Inter', sans-serif",
                                        margin:     0
                                    }}>
                                        {isBanking
                                            ? `${moneyIn ? "+" : "-"}₦${parseFloat(selectedTx.amount).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                            : `${selectedTx.type === "deposit" ? "+" : "-"}${selectedTx.cryptoAmount.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${selectedTx.cryptoType?.toUpperCase()}`
                                        }
                                    </h3>
                                    <span style={{
                                        background:   badge.bg,
                                        color:        badge.color,
                                        fontSize:     "11px",
                                        fontWeight:   "bold",
                                        padding:      "3px 12px",
                                        borderRadius: "50px",
                                        marginTop:    "8px",
                                        display:      "inline-block"
                                    }}>
                                        {selectedTx.status?.toUpperCase()}
                                    </span>
                                </div>

                                {[
                                    isBanking && { label: "TYPE",        value: selectedTx.type?.toUpperCase() },
                                    isBanking && moneyIn && {
                                        label: "FROM",
                                        value: `${selectedTx.sender?.firstName} ${selectedTx.sender?.lastName} (${selectedTx.sender?.accountNumber})`
                                    },
                                    isBanking && !moneyIn && {
                                        label: "TO",
                                        value: `${selectedTx.recipient?.firstName} ${selectedTx.recipient?.lastName} (${selectedTx.recipient?.accountNumber})`
                                    },
                                    isBanking && { label: "DESCRIPTION", value: selectedTx.description || "—" },
                                    { label: "REFERENCE",   value: selectedTx.reference || "—" },
                                    { label: "DATE",        value: new Date(selectedTx.createdAt).toLocaleString("en-NG") },
                                    !isBanking && { label: "COIN",       value: selectedTx.cryptoType?.toUpperCase() },
                                    !isBanking && { label: "NAIRA VALUE", value: `₦${parseFloat(selectedTx.nairaAmount || 0).toLocaleString("en-NG", { minimumFractionDigits: 2 })}` },
                                ].filter(Boolean).map((row, i) => (
                                    <div
                                        key={i}
                                        className="d-flex justify-content-between align-items-center"
                                        style={{
                                            padding:      "10px 0",
                                            borderBottom: "1px solid #f8f8f8"
                                        }}
                                    >
                                        <span style={{ color: "#aaa", fontSize: "11px", letterSpacing: "1px" }}>
                                            {row.label}
                                        </span>
                                        <span style={{
                                            color:      primary,
                                            fontSize:   "13px",
                                            fontWeight: "bold",
                                            fontFamily: "'Inter', sans-serif",
                                            maxWidth:   "60%",
                                            textAlign:  "right"
                                        }}>
                                            {row.value}
                                        </span>
                                    </div>
                                ))}

                                <button
                                    onClick={() => setSelectedTx(null)}
                                    style={{
                                        width:         "100%",
                                        padding:       "12px",
                                        background:    primary,
                                        color:         "#FFFFFF",
                                        border:        "none",
                                        borderRadius:  "8px",
                                        fontSize:      "13px",
                                        fontWeight:    "bold",
                                        fontFamily:    "'Inter', sans-serif",
                                        cursor:        "pointer",
                                        marginTop:     "20px",
                                        letterSpacing: "1px"
                                    }}
                                >
                                    CLOSE
                                </button>
                            </div>
                        )
                    })()}
                </ModalShell>
            )}

        </Layout>
    )
}

export default Transactions;