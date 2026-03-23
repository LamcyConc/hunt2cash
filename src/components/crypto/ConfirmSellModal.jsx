import ModalShell from "../common/ModalShell"

const primary      = "#0F3D2E"
const primaryLight = "#0B5D3B"

const COIN_COLORS = { btc: "#F7931A", eth: "#627EEA", usdt: "#26A17B" }
const COIN_ICONS  = { btc: "₿", eth: "Ξ", usdt: "₮" }

const ConfirmSellModal = ({ show, onClose, onConfirm, isSubmitting, values, prices }) => {
    const { cryptoType, amount } = values

    const coinColor      = COIN_COLORS[cryptoType]
    const coinIcon       = COIN_ICONS[cryptoType]
    const coinNairaPrice = prices?.[cryptoType]?.nairaPrice || 0
    const coinUsdPrice   = prices?.[cryptoType]?.usdPrice   || 0
    const estimatedNaira = parseFloat(amount) * coinNairaPrice

    return (
        <ModalShell show={show} onClose={onClose} title="⚠️ Confirm Swap">

            <div style={{
                background:   "#f7faf8",
                border:       "1px solid #e5efea",
                borderRadius: "12px",
                padding:      "20px",
                marginBottom: "16px",
                textAlign:    "center"
            }}>
                <div style={{
                    width:          "52px", height: "52px",
                    borderRadius:   "50%",
                    background:     `${coinColor}15`,
                    border:         `2px solid ${coinColor}40`,
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "center",
                    fontSize:       "22px",
                    color:          coinColor,
                    fontWeight:     "bold",
                    margin:         "0 auto 12px"
                }}>
                    {coinIcon}
                </div>

                <p style={{ color: "#aaa", fontSize: "11px", letterSpacing: "1.5px", marginBottom: "4px" }}>
                    YOU ARE SELLING
                </p>
                <h4 style={{ color: coinColor, fontWeight: "bold", fontSize: "24px", margin: "0 0 4px" }}>
                    {amount} {cryptoType.toUpperCase()}
                </h4>
                <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>
                    at ₦{coinNairaPrice.toLocaleString("en-NG")} / ${coinUsdPrice.toLocaleString("en-US")}
                </p>
            </div>

            <div style={{ textAlign: "center", fontSize: "20px", marginBottom: "12px", color: "#ccc" }}>
                ↓
            </div>

            <div style={{
                background:   `${primary}08`,
                border:       `1px solid ${primary}20`,
                borderRadius: "12px",
                padding:      "20px",
                marginBottom: "20px",
                textAlign:    "center"
            }}>
                <p style={{ color: "#aaa", fontSize: "11px", letterSpacing: "1.5px", marginBottom: "4px" }}>
                    YOU WILL RECEIVE
                </p>
                <h4 style={{ color: "#4CAF50", fontWeight: "bold", fontSize: "24px", margin: "0 0 10px" }}>
                    ₦{estimatedNaira.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                </h4>
                <div style={{
                    display:        "inline-flex",
                    alignItems:     "center",
                    gap:            "6px",
                    background:     "#fff",
                    border:         "1px solid #e5efea",
                    borderRadius:   "50px",
                    padding:        "4px 12px",
                    fontSize:       "11px",
                    color:          primary,
                    fontWeight:     "500"
                }}>
                    🏦 Credited to your bank balance
                </div>
            </div>

            <div className="d-flex gap-2">
                <button
                    onClick={onClose}
                    disabled={isSubmitting}
                    style={{
                        flex:         1,
                        padding:      "12px",
                        background:   "#fff",
                        color:        "#888",
                        border:       "1.5px solid #ddd",
                        borderRadius: "8px",
                        fontSize:     "13px",
                        fontWeight:   "bold",
                        fontFamily:   "'Inter', sans-serif",
                        cursor:       isSubmitting ? "not-allowed" : "pointer"
                    }}
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    disabled={isSubmitting}
                    style={{
                        flex:          2,
                        padding:       "12px",
                        background:    isSubmitting ? "#aaa" : primary,
                        color:         "#fff",
                        border:        "none",
                        borderRadius:  "8px",
                        fontSize:      "13px",
                        fontWeight:    "bold",
                        fontFamily:    "'Inter', sans-serif",
                        letterSpacing: "0.5px",
                        cursor:        isSubmitting ? "not-allowed" : "pointer",
                        transition:    "background 0.2s"
                    }}
                    onMouseOver={e => { if (!isSubmitting) e.currentTarget.style.background = primaryLight }}
                    onMouseOut={e  => { if (!isSubmitting) e.currentTarget.style.background = primary }}
                >
                    {isSubmitting ? "PROCESSING..." : "✅ Yes, Sell Now"}
                </button>
            </div>

        </ModalShell>
    )
}

export default ConfirmSellModal