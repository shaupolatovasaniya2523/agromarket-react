function ProductCard({ product, onAdd, featured }) {
  const isAvailable = product.stock > 0;

  return (
    <article
      className={featured ? 'card card--featured' : 'card'}
      data-testid="product-card"
    >
      {featured && (
        <span className="badge">Товар недели</span>
      )}

      <img
        src={
          product.image ||
          'https://www.svgrepo.com/show/313583/book-solid.svg'
        }
        alt={product.name}
      />

      <h3>{product.name}</h3>

      <p>{product.price.toLocaleString('ru-RU')} тг</p>

      <p>{product.category}</p>

      {product.farmer && <p>{product.farmer}</p>}

      <button
        disabled={!isAvailable}
        onClick={() => onAdd?.(product)}
      >
        {isAvailable ? 'В заявку' : 'Нет в наличии'}
      </button>
    </article>
  );
}

export default ProductCard;