import "./RoutineBlock.css";

function RoutineBlock({ title, products }) {
  // console.log(products);
  return (
    <div className="routine-block">
      <h3>{title}</h3>

      {products.map((product) => (
        <div key={product.id}>
          {product.image && <img src={product.image} alt={product.name} />}
          <h4>{product.name}</h4>
          <p>{product.brand}</p>
        </div>
      ))}
    </div>
  );
}

export default RoutineBlock;
