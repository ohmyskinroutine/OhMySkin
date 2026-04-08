const AuthField = ({ label, type, value, onChange, placeholder }) => (
  <div className="auth-field">
    <label>{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required
    />
  </div>
);

export default AuthField;
