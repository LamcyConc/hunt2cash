const accent       = "#E6A800"
const accentBright = "#F4B400"

const SubmitBtn = ({ isSubmitting, label, loadingLabel, onClick }) => (
    <button
        type="submit"
        onClick={onClick}
        disabled={isSubmitting}
        style={{
            width:         "100%",
            padding:       "13px",
            background:    isSubmitting ? "#aaa" : accent,
            color:         "#0F3D2E",
            border:        "none",
            borderRadius:  "8px",
            fontSize:      "14px",
            fontWeight:    "bold",
            fontFamily:    "'Inter', sans-serif",
            letterSpacing: "1px",
            cursor:        isSubmitting ? "not-allowed" : "pointer",
            transition:    "background 0.2s",
            marginTop:     "8px"
        }}
        onMouseOver={e => { if (!isSubmitting) e.currentTarget.style.background = accentBright }}
        onMouseOut={e  => { if (!isSubmitting) e.currentTarget.style.background = accent }}
    >
        {isSubmitting ? loadingLabel : label}
    </button>
)

export default SubmitBtn;