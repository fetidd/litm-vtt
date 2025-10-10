export const dialogStyles = {
  // Dialog container
  dialog: {
    position: "fixed" as const,
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    background: "#333",
    border: "2px solid #68ff03ff",
    borderRadius: "4px",
    padding: "12px",
    zIndex: 10000,
    color: "white",
    userSelect: "none" as const,
  },

  // Positioned dialog (like TagEditDialog)
  positionedDialog: {
    position: "fixed" as const,
    background: "#333",
    border: "2px solid #68ff03ff",
    borderRadius: "4px",
    padding: "12px",
    zIndex: 10000,
    minWidth: "200px",
    color: "white",
    userSelect: "none" as const,
  },

  // Input fields
  input: {
    width: "100%",
    padding: "4px",
    background: "#222",
    border: "1px solid #555",
    borderRadius: "2px",
    color: "white",
    fontSize: "12px",
  },

  // Textarea fields
  textarea: {
    padding: "4px",
    background: "#222",
    border: "1px solid #555",
    borderRadius: "2px",
    color: "white",
    resize: "vertical" as const,
    fontFamily: "inherit",
    fontSize: "12px",
  },

  // Primary button (green)
  primaryButton: {
    padding: "4px 12px",
    background: "#68ff03ff",
    color: "black",
    border: "none",
    borderRadius: "2px",
    cursor: "pointer",
    fontSize: "12px",
  },

  // Secondary button (gray)
  secondaryButton: {
    padding: "4px 12px",
    background: "#666",
    color: "white",
    border: "none",
    borderRadius: "2px",
    cursor: "pointer",
    fontSize: "12px",
  },

  // Disabled button
  disabledButton: {
    padding: "4px 12px",
    background: "#666",
    color: "white",
    border: "none",
    borderRadius: "2px",
    cursor: "not-allowed",
    fontSize: "12px",
  },

  // Section header
  sectionHeader: {
    margin: "1px -12px",
    padding: "4px 12px",
    backgroundColor: "rgba(204, 165, 126, 0.43)",
    textAlign: "center" as const,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  // Small text
  smallText: {
    fontSize: "12px",
  },

  // Dialog title
  dialogTitle: {
    marginTop: 0,
    marginBottom: "12px",
    fontSize: "14px",
  },
};