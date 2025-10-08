interface TagInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export default function TagInput({ 
  value, 
  onChange, 
  onSubmit, 
  placeholder = "tag name",
  autoFocus = false 
}: TagInputProps) {
  return (
    <input
      style={{
        background: "transparent",
        textAlign: "center",
        border: "none",
        color: "black",
        width: "fit-content",
        outline: "none"
      }}
      placeholder={placeholder}
      autoFocus={autoFocus}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onSubmit();
        }
      }}
      value={value}
    />
  );
}