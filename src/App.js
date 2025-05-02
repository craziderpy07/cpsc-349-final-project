import React, { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [page, setPage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [reviews, setReviews] = useState({});
  const [newReview, setNewReview] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
        const allCategories = [...new Set(data.map((item) => item.category))];
        setCategories(allCategories);
      });
  }, []);

  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
      const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
      const matchesRating = product.rating?.rate >= minRating;
      return matchesSearch && matchesCategory && matchesPrice && matchesRating;
    });
    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, minPrice, maxPrice, minRating, products]);

  return (
    <div className="App">
      <h1>Product Store</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(Number(e.target.value))}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
        />

        <input
          type="number"
          step="0.1"
          placeholder="Min Rating"
          value={minRating}
          onChange={(e) => setMinRating(Number(e.target.value))}
        />
      </div>

      <div className="product-list">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product">
            <img src={product.image} alt={product.title} width={100} />
            <h3>{product.title}</h3>
            <p>${product.price}</p>
            <p>Category: {product.category}</p>
            <p>Rating: {product.rating?.rate}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
