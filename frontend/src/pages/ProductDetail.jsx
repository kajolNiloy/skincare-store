import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProduct, getProductReviews, addReview } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewMsg, setReviewMsg] = useState('');
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const fetch = async () => {
      try {
        const [prodRes, revRes] = await Promise.all([
          getProduct(id),
          getProductReviews(id)
        ]);
        setProduct(prodRes.data.product);
        setReviews(revRes.data.reviews);
        setAvgRating(revRes.data.average_rating);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(product);
    setReviewMsg('Added to cart! 🛒');
    setTimeout(() => setReviewMsg(''), 2000);
  };

  const handleReview = async () => {
    try {
      await addReview({ product_id: id, ...reviewForm });
      setReviewMsg('Review submitted! ✨');
      const revRes = await getProductReviews(id);
      setReviews(revRes.data.reviews);
      setAvgRating(revRes.data.average_rating);
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) {
      setReviewMsg(err.response?.data?.error || 'Failed to submit review');
    }
  };

  if (loading) return <div className="text-center py-20 opacity-50">Loading...</div>;
  if (!product) return <div className="text-center py-20 opacity-50">Product not found</div>;

  return (
    <div style={{ backgroundColor: '#FFFDF9', minHeight: '100vh' }} className="px-6 py-12">
      <div className="max-w-5xl mx-auto">

        {/* Product Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">

          {/* Image */}
          <div className="rounded-3xl flex items-center justify-center text-9xl h-80" style={{ backgroundColor: '#FFF0EB' }}>
            🍑
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center gap-4">
            <p className="text-sm font-medium" style={{ color: '#FFAB91' }}>{product.categories?.name}</p>
            <h1 className="text-3xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: '#2D2D2D' }}>
              {product.name}
            </h1>
            <p className="opacity-60 text-sm leading-relaxed" style={{ color: '#2D2D2D' }}>{product.description}</p>

            <div className="flex items-center gap-2">
              <span className="text-yellow-400">{'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))}</span>
              <span className="text-sm opacity-60">({reviews.length} reviews)</span>
            </div>

            <p className="text-3xl font-bold" style={{ color: '#FFAB91' }}>৳{product.price}</p>

            <p className="text-sm opacity-60">Skin type: {product.skin_type}</p>
            <p className="text-sm opacity-60">Stock: {product.stock} left</p>

            {/* Quantity */}
            <div className="flex items-center gap-3">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold"
                style={{ backgroundColor: '#F8BBD9' }}>−</button>
              <span className="font-medium w-6 text-center">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)}
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold"
                style={{ backgroundColor: '#F8BBD9' }}>+</button>
            </div>

            {reviewMsg && (
              <p className="text-sm font-medium" style={{ color: '#FFAB91' }}>{reviewMsg}</p>
            )}

            <button onClick={handleAddToCart}
              className="py-3 px-8 rounded-full text-white font-medium hover:opacity-90 transition w-fit"
              style={{ backgroundColor: '#FFAB91' }}>
              Add to Cart 🛒
            </button>
          </div>
        </div>

        {/* Reviews */}
        <div>
          <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif', color: '#2D2D2D' }}>
            Customer Reviews
          </h2>

          {/* Add Review */}
          {user && (
            <div className="rounded-2xl p-6 mb-8" style={{ backgroundColor: '#FFF0EB' }}>
              <h3 className="font-semibold mb-4" style={{ color: '#2D2D2D' }}>Write a Review</h3>
              <div className="flex gap-2 mb-3">
                {[1,2,3,4,5].map(star => (
                  <button key={star} onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                    className="text-2xl">
                    {star <= reviewForm.rating ? '★' : '☆'}
                  </button>
                ))}
              </div>
              <textarea
                placeholder="Share your experience..."
                value={reviewForm.comment}
                onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border outline-none mb-3 resize-none"
                style={{ borderColor: '#F8BBD9', backgroundColor: '#fff' }}
                rows={3}
              />
              <button onClick={handleReview}
                className="px-6 py-2 rounded-full text-white font-medium hover:opacity-90 transition"
                style={{ backgroundColor: '#FFAB91' }}>
                Submit Review
              </button>
            </div>
          )}

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <p className="opacity-50 text-sm">No reviews yet. Be the first! 🍑</p>
          ) : (
            <div className="flex flex-col gap-4">
              {reviews.map(r => (
                <div key={r.id} className="rounded-2xl p-5" style={{ backgroundColor: '#fff', border: '1px solid #F8BBD9' }}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-sm" style={{ color: '#2D2D2D' }}>{r.users?.name}</p>
                    <span className="text-yellow-400 text-sm">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                  </div>
                  <p className="text-sm opacity-70" style={{ color: '#2D2D2D' }}>{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;