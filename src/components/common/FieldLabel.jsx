const FieldLabel = ({ text }) => (
    <label style={{
        display:       "block",
        color:         "#555",
        fontSize:      "11px",
        letterSpacing: "1.5px",
        fontWeight:    "bold",
        marginBottom:  "8px"
    }}>
        {text}
    </label>
)

export default FieldLabel;