import ModalShell from "../common/ModalShell"

const primary      = "#0F3D2E"
const primaryLight = "#0B5D3B"
const accent       = "#E6A800"
const accentBright = "#F4B400"

const ConfirmWithdrawModal = ({ show, onClose, onConfirm, isSubmitting, amount }) => {
    return (
        <ModalShell show={show} onClose={onClose} title="⚠️ Confirm Withdrawal">

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
                    background:     "rgba(156,39,176,0.08)",
                    border:         "2px solid rgba(156,39,176,0.2)",
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "center",
                    fontSize:       "22px",
                    margin:         "0 auto 12px"
                }}>
                    ⬆️
                </div>
                <p style={{ color: "#aaa", fontSize: "11px", letterSpacing: "1.5px", marginBottom: "4px" }}>
                    YOU ARE WITHDRAWING
                </p>
                <h4 style={{ color: primary, fontWeight: "bold", fontSize: "24px", margin: 0 }}>
                    ₦{parseFloat(amount).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                </h4>
            </div>

            <div style={{ textAlign: "center", fontSize: "20px", marginBottom: "12px", color: "#ccc" }}>↓</div>

            <div style={{
                background:   "rgba(220,53,69,0.04)",
                border:       "1px solid rgba(220,53,69,0.15)",
                borderRadius: "12px",
                padding:      "16px 20px",
                marginBottom: "20px",
                textAlign:    "center"
            }}>
                <p style={{ color: "#aaa", fontSize: "11px", letterSpacing: "1.5px", marginBottom: "8px" }}>
                    DEDUCTED FROM
                </p>
                <div style={{
                    display:      "inline-flex",
                    alignItems:   "center",
                    gap:          "6px",
                    background:   "#fff",
                    border:       "1px solid #e5efea",
                    borderRadius: "50px",
                    padding:      "4px 12px",
                    fontSize:     "11px",
                    color:        primary,
                    fontWeight:   "500"
                }}>
                    🏦 Your bank balance
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
                        background:    isSubmitting ? "#aaa" : accent,
                        color:         primary,
                        border:        "none",
                        borderRadius:  "8px",
                        fontSize:      "13px",
                        fontWeight:    "bold",
                        fontFamily:    "'Inter', sans-serif",
                        letterSpacing: "0.5px",
                        cursor:        isSubmitting ? "not-allowed" : "pointer",
                        transition:    "background 0.2s"
                    }}
                    onMouseOver={e => { if (!isSubmitting) e.currentTarget.style.background = accentBright }}
                    onMouseOut={e  => { if (!isSubmitting) e.currentTarget.style.background = accent }}
                >
                    {isSubmitting ? "WITHDRAWING..." : "✅ Yes, Withdraw Now"}
                </button>
            </div>

        </ModalShell>
    )
}

export default ConfirmWithdrawModal