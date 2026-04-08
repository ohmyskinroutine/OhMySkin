const AuthField = ({ label, type, value, onChange, placeholder, required = true }) => (
  <div className="auth-field">
    <label>{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
    />
  </div>
);

export default AuthField;
