import { useState, useEffect } from "react"
import { useFormik } from "formik"
import * as yup from "yup"
import Layout      from "../../components/common/Layout"
import FieldLabel  from "../../components/common/FieldLabel"
import Toast       from "../../components/common/Toast"
import { sendAdminMessage, getAdminMessage } from "../../services/api"

const primary      = "#0F3D2E"
const accent       = "#E6A800"
const accentBright = "#F4B400"

const CONTEXTS = [
    { value: "general", label: "🏠 General",        sub: "Shows on user dashboard"       },
    { value: "deposit", label: "⬇️ Deposit Crypto", sub: "Shows on crypto deposit modal" },
    { value: "sell",    label: "💱 Sell Crypto",    sub: "Shows on crypto sell modal"     },
]

const AdminMessage = () => {
    const [activeContext,    setActiveContext]    = useState("general")
    const [currentMessages,  setCurrentMessages]  = useState({})
    const [toast,            setToast]            = useState({ show: false, type: "success", message: "" })

    const showToast = (type, message) => setToast({ show: true, type, message })
    const hideToast = () => setToast({ show: false, type: "success", message: "" })

    const fetchAllMessages = async () => {
        try {
            const results = await Promise.allSettled(
                CONTEXTS.map(c => getAdminMessage(c.value))
            )
            const msgs = {}
            results.forEach((result, i) => {
                if (result.status === "fulfilled") {
                    msgs[CONTEXTS[i].value] = result.value.data.data?.message || ""
                }
            })
            setCurrentMessages(msgs)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => { fetchAllMessages() }, [])

    const formik = useFormik({
        initialValues: { message: "" },
        enableReinitialize: true,

        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                await sendAdminMessage({
                    message: values.message,
                    context: activeContext
                })
                showToast("success", `Message sent to ${activeContext} context! 🎉`)
                resetForm()
                fetchAllMessages()
            } catch (error) {
                showToast("error", error.response?.data?.message || "Failed to send message")
            } finally {
                setSubmitting(false)
            }
        },

        validationSchema: yup.object({
            message: yup.string().required("Message cannot be empty").min(5, "Message too short")
        })
    })

    return (
        <Layout pageTitle="Message">

            <Toast
                show={toast.show}
                type={toast.type}
                message={toast.message}
                onClose={hideToast}
            />

            <div className="mb-4">
                <h5 style={{
                    color:        primary,
                    fontWeight:   "bold",
                    fontFamily:   "'Inter', sans-serif",
                    marginBottom: 4
                }}>
                    Admin Messages
                </h5>
                <p style={{ color: "#888", fontSize: 13, margin: 0 }}>
                    Send targeted messages to users per section.
                </p>
            </div>

            {/* Context Selector */}
            <div className="row g-3 mb-4">
                {CONTEXTS.map(ctx => (
                    <div key={ctx.value} className="col-12 col-md-4">
                        <div
                            onClick={() => setActiveContext(ctx.value)}
                            style={{
                                background:   activeContext === ctx.value ? primary : "#FFFFFF",
                                border:       `1.5px solid ${activeContext === ctx.value ? primary : "#e8ede9"}`,
                                borderRadius: "12px",
                                padding:      "16px 20px",
                                cursor:       "pointer",
                                transition:   "all 0.2s",
                                boxShadow:    "0 2px 8px rgba(15,61,46,0.04)"
                            }}
                        >
                            <p style={{
                                color:      activeContext === ctx.value ? "#FFFFFF" : primary,
                                fontWeight: "bold",
                                fontFamily: "'Inter', sans-serif",
                                fontSize:   "14px",
                                margin:     "0 0 4px"
                            }}>
                                {ctx.label}
                            </p>
                            <p style={{
                                color:    activeContext === ctx.value ? "rgba(255,255,255,0.7)" : "#aaa",
                                fontSize: "11px",
                                margin:   "0 0 8px"
                            }}>
                                {ctx.sub}
                            </p>
                            {currentMessages[ctx.value] && (
                                <p style={{
                                    color:        activeContext === ctx.value ? "rgba(255,255,255,0.9)" : "#555",
                                    fontSize:     "12px",
                                    margin:       0,
                                    fontStyle:    "italic",
                                    overflow:     "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace:   "nowrap"
                                }}>
                                    "{currentMessages[ctx.value]}"
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Message Form */}
            <div style={{
                background:   "#FFFFFF",
                border:       "1px solid #e8ede9",
                borderRadius: "16px",
                padding:      "24px",
                boxShadow:    "0 2px 8px rgba(15,61,46,0.04)",
                maxWidth:     "600px"
            }}>
                <p style={{
                    color:         "#888",
                    fontSize:      "11px",
                    letterSpacing: "2px",
                    fontWeight:    "bold",
                    marginBottom:  "16px"
                }}>
                    SEND MESSAGE TO — {activeContext.toUpperCase()}
                </p>

                <form onSubmit={formik.handleSubmit}>
                    <div className="mb-4">
                        <FieldLabel text="MESSAGE" />
                        <textarea
                            name="message"
                            placeholder={`Type your ${activeContext} message here...`}
                            rows={4}
                            onChange={formik.handleChange}
                            value={formik.values.message}
                            style={{
                                width:        "100%",
                                padding:      "12px 14px",
                                borderRadius: "8px",
                                border:       `1.5px solid ${formik.touched.message && formik.errors.message ? "#dc3545" : "#ddd"}`,
                                fontSize:     "14px",
                                fontFamily:   "'Inter', sans-serif",
                                outline:      "none",
                                background:   "#fafafa",
                                resize:       "vertical",
                                transition:   "border 0.2s"
                            }}
                            onFocus={e => e.target.style.border = `1.5px solid ${primary}`}
                            onBlur={e => {
                                formik.handleBlur(e)
                                e.target.style.border = `1.5px solid ${formik.errors.message ? "#dc3545" : "#ddd"}`
                            }}
                        />
                        {formik.touched.message && formik.errors.message && (
                            <small className="text-danger">{formik.errors.message}</small>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={formik.isSubmitting}
                        style={{
                            padding:       "12px 32px",
                            background:    formik.isSubmitting ? "#aaa" : accent,
                            color:         primary,
                            border:        "none",
                            borderRadius:  "8px",
                            fontSize:      "14px",
                            fontWeight:    "bold",
                            fontFamily:    "'Inter', sans-serif",
                            letterSpacing: "1px",
                            cursor:        formik.isSubmitting ? "not-allowed" : "pointer",
                            transition:    "background 0.2s"
                        }}
                        onMouseOver={e => { if (!formik.isSubmitting) e.currentTarget.style.background = accentBright }}
                        onMouseOut={e  => { if (!formik.isSubmitting) e.currentTarget.style.background = accent }}
                    >
                        {formik.isSubmitting ? "SENDING..." : "SEND MESSAGE"}
                    </button>
                </form>
            </div>

        </Layout>
    )
}

export default AdminMessage;