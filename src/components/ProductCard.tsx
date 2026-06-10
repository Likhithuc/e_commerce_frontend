import { Link } from 'react-router-dom';
import type { ProductResponse } from '../types';
import { imageUrl } from '../utils/imageUrl';

export default function ProductCard({ product }: { product: ProductResponse }) {
  const image = imageUrl(product.images?.[0]) || 'https://placehold.co/300x300?text=No+Image';
  const price = product.salePrice || product.price;

  return (
    <Link to={`/products/${product.id}`} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition overflow-hidden">
      <img src={image} alt={product.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
        <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
        <div className="mt-2">
          <span className="text-lg font-bold text-indigo-600">${price.toFixed(2)}</span>
          {product.salePrice && (
            <span className="ml-2 text-sm text-gray-400 line-through">${product.price.toFixed(2)}</span>
          )}
        </div>
        {product.stockQuantity <= 5 && product.stockQuantity > 0 && (
          <p className="text-xs text-orange-500 mt-1">Only {product.stockQuantity} left</p>
        )}
        {product.stockQuantity === 0 && (
          <p className="text-xs text-red-500 mt-1">Out of stock</p>
        )}
      </div>
    </Link>
  );
}
