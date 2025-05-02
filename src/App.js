import React, { useState, useEffect } from "react";

export default function App() {
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [page, setPage] = useState("login");  

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

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
        const allCategories = Array.from(
          new Set(data.map((item) => item.category))
        );
        setCategories(allCategories);
      });
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    // test login credentials for right now
    if (username === "guest" && password === "12345") {
      setUser({ username });
      setIsAuthenticated(true);
      setErrorMessage("");
      setPage("account");
    } else {
      setErrorMessage("invalid credentials.");
    }
  };  
  
  const renderLogin = () => (
    <div style={styles.page}>
      <h2>login</h2>
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        {errorMessage && <p style={styles.error}>{errorMessage}</p>}
        <div style={{ display: "flex", gap: "10px" }}>
        <button type="submit" style={styles.primaryButton}>
          log in
          </button>
        <button onClick={() => setPage("sign-up")} style={styles.primaryButton}>
          register
        </button>
        </div>
      </form>
    </div>
  );

  const renderSignUp = () => (
    <div style={styles.page}>
      <h2>sign up</h2>
      <form onSubmit={handleSignUp} style={styles.form}>
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        {errorMessage && <p style={styles.error}>{errorMessage}</p>}
        <div style={{ display: "flex", gap: "10px" }}>
        <button type="submit" style={styles.primaryButton}>
          register
        </button>
        <button onClick={() => setPage("sign-in")} style={styles.primaryButton}>
          back to login
        </button>
        </div>
      </form>
    </div>
  );

  const handleSignUp = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMessage("both fields are required.");
      return;
    }
  };

  const renderAccount = () => {
    const handleLogout = () => {
      setUser(null);
      setIsAuthenticated(false);
      setPage("home");
    };
  
    if (!user) {
      return (
        <div style={styles.page}>
          <h2>account</h2>
          <p>not logged in.</p>
        </div>
      );
    }
  
    return (
      <div style={styles.page}>
        <h2>hello, {user.username}. welcome to your account!</h2>
        <p>what would you like to do, {user.username}?</p>
        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => setPage("profile")} style={styles.primaryButton}>
              profile
            </button>
            <button onClick={() => setPage("orders")} style={styles.primaryButton}>
              order history
            </button>
            <button onClick={handleLogout} style={styles.primaryButton}>
              log out
            </button>
          </div>
        </div>
      </div>
    );
  };

  const goToProductDetail = (product) => {
    setSelectedProduct(product);
    setPage("detail");
  };

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  const removeFromCart = (productId) => {
    setCart((prev) => {
      const index = prev.findIndex((p) => p.id === productId);
      if (index < 0) return prev;
      const newCart = [...prev];
      newCart.splice(index, 1);
      return newCart;
    });
  };


  const clearCart = () => {
    setCart([]);
  };

  const handleCategoryChange = (category) => {
    if (category === "All") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter((product) => product.category === category)
      );
    }
    setCurrentPage(1);
    setSearchTerm("");
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    const searchedProducts = filteredProducts.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const totalPages = Math.ceil(searchedProducts.length / productsPerPage);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const renderHome = () => (
    <div style={styles.page}>
      <h1 style={styles.heroTitle}>welcome to posti</h1>
      <p style={styles.heroSubtitle}>kevin, huy, and teresa.</p>
      <button onClick={() => setPage("shop")} style={styles.ctaButton}>
        shop now
      </button>
    </div>
  );

  const renderNav = () => (
    <nav style={styles.nav}>
      <div style={styles.logo}>
        <img
          src="https://media.tenor.com/6xNuaXMevsMAAAAi/kirby-shade.gif"
          alt="Kirby logo"
          style={{
            height: "100px",
            verticalAlign: "middle",
            marginRight: "8px",
          }}
        />
        posti
      </div>
      <div>
        <button onClick={() => setPage("home")} style={styles.navLink}>
          home
        </button>
        <button onClick={() => setPage("shop")} style={styles.navLink}>
          shop
        </button>
        <button onClick={() => setPage("cart")} style={styles.navLink}>
          cart ({cart.length})
        </button>
        {!isAuthenticated ? (
          <>
            <button onClick={() => setPage("sign-in")} style={styles.navLink}>
              sign in
            </button>
          </>
        ) : (
          <button onClick={() => setPage("account")} style={styles.navLink}>
            account
          </button>
        )}
      </div>
    </nav>
  );

  const renderShop = () => {
    const searchedProducts = filteredProducts.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = searchedProducts.slice(
      indexOfFirstProduct,
      indexOfLastProduct
    );
    const totalPages = Math.ceil(searchedProducts.length / productsPerPage);

    return (
      <div style={styles.shopPage}>
        <div style={styles.sidebar}>
          <h3 style={styles.sidebarTitle}>categories</h3>
          <button
            onClick={() => handleCategoryChange("All")}
            style={styles.filterButton}
          >
            all
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              style={styles.filterButton}
            >
              {category}
            </button>
          ))}
        </div>

        <div style={styles.productsContainer}>
          <h2 style={styles.sectionTitle}>shop all</h2>

          <div style={{ marginBottom: "20px", marginTop: "10px" }}>
            <input
              type="text"
              placeholder="search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "98%",
                padding: "10px",
                fontSize: "16px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div style={styles.grid}>
            {currentProducts.map((product) => (
              <div key={product.id} style={styles.card}>
                <img
                  src={product.image}
                  alt={product.title}
                  style={styles.image}
                />
                <h3>{product.title}</h3>
                <p style={styles.description}>
                  {product.description.slice(0, 60)}...
                </p>
                <p style={styles.price}>${product.price}</p>
                <p>
                  rating: {product.rating.rate} ⭐ ({product.rating.count}{" "}
                  reviews)
                </p>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => goToProductDetail(product)}
                    style={styles.secondaryButton}
                  >
                    view
                  </button>
                  <button
                    onClick={() => addToCart(product)}
                    style={styles.primaryButton}
                  >
                    add to cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.pagination}>
            <button onClick={prevPage} style={styles.pageArrowButton}>
              &#8592; prev
            </button>
            <span style={styles.pageInfo}>
              page {currentPage} of {totalPages}
            </span>
            <button onClick={nextPage} style={styles.pageArrowButton}>
              next &#8594;
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderDetail = () => {
    if (!selectedProduct) return null;

    const productReviews = reviews[selectedProduct.id] || [];

    const handleReviewSubmit = () => {
      if (newReview.trim() === "") return;
      setReviews((prev) => ({
        ...prev,
        [selectedProduct.id]: [...(prev[selectedProduct.id] || []), newReview],
      }));
      setNewReview("");
    };

    return (
      <div style={styles.page}>
        <h2 style={styles.sectionTitle}>{selectedProduct.title}</h2>
        <img
          src={selectedProduct.image}
          alt={selectedProduct.title}
          style={styles.detailImage}
        />
        <p style={styles.price}>${selectedProduct.price}</p>

        <p style={styles.description}>{selectedProduct.description}</p>

        <button
          onClick={() => addToCart(selectedProduct)}
          style={styles.primaryButton}
        >
          add to cart
        </button>
        <button
          onClick={() => setPage("shop")}
          style={{ ...styles.secondaryButton, marginLeft: "10px" }}
        >
          back to shop
        </button>

        {/* Reviews Section */}
        <div style={{ marginTop: "40px", textAlign: "left" }}>
          <h3>reviews:</h3>
          {productReviews.length === 0 ? (
            <p style={styles.description}>no reviews yet.</p>
          ) : (
            <ul style={{ paddingLeft: "20px" }}>
              {productReviews.map((review, idx) => (
                <li key={idx} style={{ marginBottom: "10px" }}>
                  {review}
                </li>
              ))}
            </ul>
          )}

          <div style={{ marginTop: "20px" }}>
            <textarea
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              placeholder="write your review..."
              style={{
                width: "100%",
                height: "80px",
                padding: "10px",
                fontSize: "14px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
            <button
              onClick={handleReviewSubmit}
              style={{ ...styles.primaryButton, marginTop: "10px" }}
            >
              submit review
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderCart = () => {
    const itemsMap = cart.reduce((acc, item) => {
      if (!acc[item.id]) {
        acc[item.id] = { ...item, quantity: 1 };
      } else {
        acc[item.id].quantity += 1;
      }
      return acc;
    }, {});
    const uniqueItems = Object.values(itemsMap);
    const total = uniqueItems.reduce(
      (sum, { price, quantity }) => sum + price * quantity,
      0
    );


    return (
      <div style={styles.cartContainer}>
        <h2 style={styles.sectionTitle}>your cart</h2>


        {uniqueItems.length === 0 ? (
          <p style={styles.description}>your cart is empty.</p>
        ) : (
          <>
            <div style={styles.cartList}>
              {uniqueItems.map(({ id, title, price, quantity, image }) => (
                <div key={id} style={styles.cartItemCard}>
                  <img src={image} alt={title} style={styles.cartImage} />
                  <div style={styles.cartDetails}>
                    <span style={styles.cartTitle}>{title}</span>
                    <span style={styles.cartQtyWrapper}>
                      <span style={styles.cartQtyLabel}>quantity: </span>
                      <span>{quantity}</span>
                    </span>
                    <span style={styles.cartQtyWrapper}>
                      <span style={styles.cartQtyLabel}>price: </span>
                      <span>${(price * quantity).toFixed(2)}</span>
                    </span>
                  </div>
                  <button
                    onClick={() => removeFromCart(id)}
                    style={styles.removeButton}
                  >
                    remove
                  </button>
                </div>
              ))}
            </div>


            <div style={styles.cartFooter}>
              <span style={styles.cartTotal}>Total: ${total.toFixed(2)}</span>
              <button onClick={clearCart} style={styles.checkoutButton}>
                clear cart
              </button>
              <button
                onClick={() => alert("purchase complete.")}
                style={styles.checkoutButton}
              >
                check out
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div style={styles.app}>
      {renderNav()}
      {page === "home" && renderHome()}
      {page === "shop" && renderShop()}
      {page === "detail" && renderDetail()}
      {page === "cart" && renderCart()}
      {page === "sign-in" && renderLogin()}
      {page === "sign-up" && renderSignUp()}
      {page === "account" && renderAccount()}
    </div>
  );
}

const pink = "#FFD1DC";

const styles = {
  app: {
    fontFamily: "'Segoe UI', sans-serif",
    backgroundColor: "#fff0f5",
    minHeight: "100vh",
    color: "#333",
  },
  nav: {
    backgroundColor: pink,
    padding: "15px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    color: "#fff",
    fontSize: "22px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
  },
  navLink: {
    background: "none",
    border: "none",
    color: "#fff",
    marginLeft: "15px",
    fontSize: "16px",
    cursor: "pointer",
  },
  searchContainer: {
    display: "flex",
    alignItems: "center",
  },
  searchInput: {
    padding: "8px",
    fontSize: "14px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    width: "200px",
    marginLeft: "20px",
  },
  page: {
    padding: "40px 20px",
    maxWidth: "1000px",
    margin: "0 auto",
    textAlign: "center",
  },
  heroTitle: {
    fontSize: "48px",
    marginBottom: "10px",
    color: pink,
  },
  heroSubtitle: {
    fontSize: "18px",
    color: "#666",
    marginBottom: "30px",
  },
  ctaButton: {
    padding: "12px 30px",
    fontSize: "16px",
    backgroundColor: pink,
    color: "#fff",
    border: "none",
    cursor: "pointer",
    borderRadius: "4px",
  },
  sectionTitle: {
    fontSize: "32px",
    marginBottom: "30px",
  },
  sidebar: {
    width: "250px",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    marginRight: "20px",
    position: "fixed",
    top: "120px",
    left: "20px",
  },
  sidebarTitle: {
    fontSize: "20px",
    marginBottom: "20px",
  },
  filterButton: {
    backgroundColor: pink,
    color: "#fff",
    border: "none",
    marginBottom: "10px",
    padding: "8px 16px",
    cursor: "pointer",
    borderRadius: "4px",
    width: "100%",
  },
  productsContainer: {
    marginLeft: "300px", // To leave space for the sidebar
    padding: "0 20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "left",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },
  image: {
    width: "100%",
    height: "200px",
    objectFit: "contain",
    marginBottom: "10px",
  },
  detailImage: {
    height: "300px",
    objectFit: "contain",
    marginBottom: "20px",
  },
  description: {
    color: "#555",
    fontSize: "14px",
    marginBottom: "10px",
  },
  price: {
    fontWeight: "bold",
    marginBottom: "10px",
    fontSize: "16px",
  },
  primaryButton: {
    padding: "8px 16px",
    backgroundColor: pink,
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  secondaryButton: {
    padding: "8px 16px",
    backgroundColor: "#f2f2f2",
    color: "#333",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  cartItem: {
    listStyle: "none",
    margin: "10px 0",
    fontSize: "16px",
  },
  cartContainer: {
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    maxWidth: "800px",
    margin: "0 auto",
    textAlign: "left",
  },
  cartList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  cartQtyWrapper: {
    display: "flex",
    alignItems: "center",
  },
  cartQtyLabel: {
    fontWeight: "bold",
    marginRight: "6px",
  },
  cartItemCard: {
    display: "flex",
    alignItems: "center",
    padding: "10px",
    backgroundColor: pink, // "#FFD1DC"
    borderRadius: "6px",
  },
  cartImage: {
    width: "60px",
    height: "60px",
    objectFit: "cover",
    borderRadius: "4px",
    marginRight: "15px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
  },
  cartDetails: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    color: "#333",
  },
  cartTitle: {
    fontWeight: "600",
    fontSize: "16px",
  },
  removeButton: {
    backgroundColor: "#fff",
    color: "gray",
    border: `1px solid ${pink}`,
    borderRadius: "4px",
    padding: "5px 10px",
    cursor: "pointer",
    textShadow: "0 0 2px white",
  },
  cartFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "20px",
  },
  cartTotal: {
    fontSize: "18px",
    fontWeight: "bold",
  },
  checkoutButton: {
    backgroundColor: pink,
    color: "#ff3c8c",
    border: "none",
    fontSize: "medium",
    borderRadius: "4px",
    padding: "8px 15px",
    cursor: "pointer",
    textShadow: "0 0 2px white",
  },
  pagination: {
    marginTop: "20px",
  },
  pageArrowButton: {
    padding: "10px 15px",
    margin: "0 5px",
    backgroundColor: pink,
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  pageInfo: {
    fontSize: "16px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    margin: "10px 0",
    width: "300px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  error: {
    color: "red",
    fontSize: "14px",
  },
};
