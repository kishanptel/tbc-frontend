import React, { useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Flower2, Filter } from 'lucide-react';
import { signatureProducts, categories } from '../data/products';
import ProductSkeletonGrid from '../components/ProductSkeletonGrid';
import ProductImageCarousel from '../components/ProductImageCarousel';

export default function Products({ isPageLoading, addToCart, currentUser, showToast }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get('category') || 'all';

  const handleAddToCart = (product) => {
    if (!currentUser) {
      if (showToast) showToast('Please register or log in to add products to your cart!');
      navigate('/register');
      return;
    }
    addToCart(product);
  };

  const filteredProducts = useMemo(() => {
    if (currentCategory === 'all') return signatureProducts;
    return signatureProducts.filter(p => p.category === currentCategory);
  }, [currentCategory]);

  const handleCategoryChange = (catId) => {
    if (catId === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: catId });
    }
  };

  return (
    <main className="page-route-animate" style={{ overflowX: 'hidden', width: '100%' }}>
      <section className="page-header">
        <div className="container" data-aos="fade-up">
          <span className="section-label">Sweet Goodies Collection</span>
          <h1>Our Handcrafted Products</h1>
          <p>Explore cute pipe cleaner flower bouquets, satin ribbon roses, keychains &amp; bag charms, and single blooms.</p>
        </div>
      </section>

      <section className="section-pad" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="container">

        {/* Category Tabs / Filters */}
        <div className="products-filter-bar" data-aos="fade-up" data-aos-delay="100">
          <div className="filter-title-wrap">
            <Filter size={18} color="var(--primary)" />
            <span>Categories:</span>
          </div>
          <div className="category-pills">
            {categories.map((cat) => {
              const isActive = (cat.id === 'all' && currentCategory === 'all') || currentCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  className={`category-pill ${isActive ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(cat.id)}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Display Grid */}
        {isPageLoading ? (
          <ProductSkeletonGrid />
        ) : filteredProducts.length === 0 ? (
          <div className="empty-products-box" data-aos="fade-up">
            <h3>No products found in this category</h3>
            <p>Try selecting another folder or clear the filter to view all goodies!</p>
            <button className="btn btn-primary" onClick={() => handleCategoryChange('all')}>
              Show All Products
            </button>
          </div>
        ) : (
          <div className="flower-grid">
            {filteredProducts.map((p, idx) => (
              <div key={p.id} className="flower-card" data-aos="fade-up" data-aos-delay={(idx % 4) * 80}>
                <div className="flower-img-wrap">
                  <span className="flower-badge">{p.tag}</span>
                  <img src={p.img} alt={p.name} className="flower-img" />
                </div>
                <div className="flower-body">
                  <span className="flower-category-tag">{p.category}</span>
                  <h3 className="flower-title">{p.name}</h3>
                  <p className="flower-desc">{p.desc}</p>
                  {(p.note || p.category === 'Keychain') && (
                    <div className="keychain-note-box">
                      <span>📌 <strong>Note:</strong> {p.note || 'Bag is not included'}</span>
                    </div>
                  )}
                  <div className="flower-footer">
                    <span className="flower-price">₹{p.price.toLocaleString('en-IN')}</span>
                    <button className="btn btn-primary btn-sm" onClick={() => handleAddToCart(p)}>
                      + Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </section>
    </main>
  );
}
