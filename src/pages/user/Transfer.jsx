import { useState } from "react"
import Layout         from "../../components/common/Layout"
import SendMoneyModal from "../../components/banking/SendMoneyModal"
import DepositModal   from "../../components/banking/DepositModal"
import WithdrawModal  from "../../components/banking/WithdrawModal"

const primary = "#0F3D2E"

const Transfer = () => {
    const [activeModal, setActiveModal] = useState(null)

    const cards = [
        {
            id:       "send",
            icon:     "💸",
            title:    "Send Money",
            sub:      "Transfer funds to any Hunt2Cash account instantly. Account lookup is automatic.",
            color:    primary,
            btnLabel: "Send Money"
        },
        {
            id:       "deposit",
            icon:     "⬇️",
            title:    "Deposit Funds",
            sub:      "Add money to your Hunt2Cash balance quickly and securely.",
            color:    "#2196F3",
            btnLabel: "Deposit Now"
        },
        {
            id:       "withdraw",
            icon:     "⬆️",
            title:    "Withdraw Funds",
            sub:      "Withdraw money from your Hunt2Cash balance to your bank account.",
            color:    "#9C27B0",
            btnLabel: "Withdraw Now"
        },
    ]

    return (
        <Layout pageTitle="Transfer">

            <div className="mb-4">
                <h5 style={{
                    color:        primary,
                    fontWeight:   "bold",
                    fontFamily:   "'Inter', sans-serif",
                    marginBottom: 4
                }}>
                    Transfers & Payments
                </h5>
                <p style={{ color: "#888", fontSize: 13, margin: 0 }}>
                    Send, deposit or withdraw funds securely.
                </p>
            </div>

            {/* Three Cards */}
            <div className="row g-4">
                {cards.map(card => (
                    <div key={card.id} className="col-12 col-md-4">
                        <div style={{
                            background:    "#FFFFFF",
                            border:        "1px solid #e8ede9",
                            borderRadius:  "16px",
                            padding:       "28px 24px",
                            boxShadow:     "0 2px 12px rgba(15,61,46,0.04)",
                            height:        "100%",
                            display:       "flex",
                            flexDirection: "column",
                            gap:           "16px"
                        }}>

                            {/* Icon */}
                            <div style={{
                                width:          "52px", height: "52px",
                                background:     `${card.color}12`,
                                borderRadius:   "12px",
                                display:        "flex",
                                alignItems:     "center",
                                justifyContent: "center",
                                fontSize:       "26px"
                            }}>
                                {card.icon}
                            </div>

                            {/* Text */}
                            <div style={{ flex: 1 }}>
                                <h6 style={{
                                    color:        primary,
                                    fontWeight:   "bold",
                                    fontFamily:   "'Inter', sans-serif",
                                    fontSize:     "16px",
                                    marginBottom: 6
                                }}>
                                    {card.title}
                                </h6>
                                <p style={{
                                    color:      "#888",
                                    fontSize:   "13px",
                                    margin:     0,
                                    lineHeight: 1.6
                                }}>
                                    {card.sub}
                                </p>
                            </div>

                            {/* Button */}
                            <button
                                onClick={() => setActiveModal(card.id)}
                                style={{
                                    width:         "100%",
                                    padding:       "11px",
                                    background:    card.color,
                                    color:         "#FFFFFF",
                                    border:        "none",
                                    borderRadius:  "8px",
                                    fontSize:      "13px",
                                    fontWeight:    "bold",
                                    fontFamily:    "'Inter', sans-serif",
                                    letterSpacing: "1px",
                                    cursor:        "pointer",
                                    transition:    "opacity 0.2s"
                                }}
                                onMouseOver={e => e.currentTarget.style.opacity = "0.85"}
                                onMouseOut={e  => e.currentTarget.style.opacity = "1"}
                            >
                                {card.btnLabel}
                            </button>

                        </div>
                    </div>
                ))}
            </div>

            {/* Modals */}
            <SendMoneyModal
                show={activeModal === "send"}
                onClose={() => setActiveModal(null)}
            />
            <DepositModal
                show={activeModal === "deposit"}
                onClose={() => setActiveModal(null)}
            />
            <WithdrawModal
                show={activeModal === "withdraw"}
                onClose={() => setActiveModal(null)}
            />

        </Layout>
    )
}

export default Transfer