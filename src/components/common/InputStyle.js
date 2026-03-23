const inputStyle = (hasError) => ({
    width:        "100%",
    padding:      "12px 14px",
    borderRadius: "8px",
    border:       `1.5px solid ${hasError ? "#dc3545" : "#ddd"}`,
    fontSize:     "14px",
    fontFamily:   "'Inter', sans-serif",
    outline:      "none",
    background:   "#fafafa",
    transition:   "border 0.2s"
})

export default inputStyle