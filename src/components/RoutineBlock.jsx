function RoutineBlock({ title, products }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <h3>{title}</h3>

      {products.map((p) => (
        <div
          key={p.id}
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "10px",
          }}
        >
          {p.image && <img src={p.image} alt={p.name} width="100" />}
          <h4>{p.name}</h4>
          <p>{p.brand}</p>
        </div>
      ))}
    </div>
  );
}

export default RoutineBlock;
