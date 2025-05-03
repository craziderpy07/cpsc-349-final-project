import React, { useState, useEffect } from "react";

export default function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [page, setPage] = useState("home");

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [reviews, setReviews] = useState({});
  const [reviewerName, setReviewerName] = useState("");
  const [newReview, setNewReview] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [profileError, setProfileError] = useState("");
  const [expandedOrders, setExpandedOrders] = useState({});

  // new states for orders and user profile
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipcode: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [contactStatus, setContactStatus] = useState("");

  // fetch products from FakeStoreAPI
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
          <button
            onClick={() => setPage("sign-up")}
            style={styles.primaryButton}
          >
            register
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
    setErrorMessage("");
    alert("successfully registered.");
  };

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
          <button
            type="button"
            onClick={() => setPage("sign-in")}
            style={styles.primaryButton}
          >
            back to login
          </button>
        </div>
      </form>
    </div>
  );

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setPage("home");
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
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => setPage("profile")}
              style={styles.primaryButton}
            >
              profile
            </button>
            <button
              onClick={() => setPage("orders")}
              style={styles.primaryButton}
            >
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

  // profile page for editing user information
  const renderProfile = () => (
    <div style={styles.page}>
      <h2>profile</h2>
      <form
        style={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          const {
            firstName,
            lastName,
            address,
            city,
            state,
            zipcode,
            cardNumber,
            expiry,
            cvv,
          } = profile;

          // all-fields required
          if (
            [
              firstName,
              lastName,
              address,
              city,
              state,
              zipcode,
              cardNumber,
              expiry,
              cvv,
            ].some((f) => f.trim() === "")
          ) {
            setProfileError("please fill out all fields.");
            return;
          }

          const rawCard = profile.cardNumber.replace(/\s/g, "");

          if (rawCard.length !== 16) {
            setProfileError("card number must be 16 digits.");
            return;
          }

          // zip code = exactly 5 digits
          if (zipcode.length !== 5) {
            setProfileError("zip code must be 5 digits.");
            return;
          }

          // expiry must match MM/YY
          if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
            setProfileError("expiration date must be in MM/YY format.");
            return;
          }

          // 4) cvv = exactly 3 digits
          if (cvv.length !== 3) {
            setProfileError("funny 3 numbers must be 3 digits.");
            return;
          }

          setProfileError("");
          alert("profile saved.");
        }}
      >
        {profileError && (
          <p style={{ ...styles.error, marginBottom: 10 }}>{profileError}</p>
        )}

        <div style={styles.field}>
          <label htmlFor="firstName">first name:</label>
          <input
            id="firstName"
            type="text"
            value={profile.firstName}
            onChange={(e) => {
              const onlyLetters = e.target.value.replace(/[^a-zA-Z]/g, "");
              setProfile({ ...profile, firstName: onlyLetters });
            }}
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label htmlFor="lastName">last name:</label>
          <input
            id="lastName"
            type="text"
            value={profile.lastName}
            onChange={(e) => {
              const onlyLetters = e.target.value.replace(/[^a-zA-Z]/g, "");
              setProfile({ ...profile, lastName: onlyLetters });
            }}
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label htmlFor="address">street address:</label>
          <input
            id="address"
            type="text"
            value={profile.address}
            onChange={(e) =>
              setProfile({ ...profile, address: e.target.value })
            }
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label htmlFor="city">city:</label>
          <input
            id="city"
            type="text"
            value={profile.city}
            onChange={(e) => {
              const onlyLetters = e.target.value.replace(/[^a-zA-Z]/g, "");
              setProfile({ ...profile, city: onlyLetters });
            }}
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label htmlFor="state">state:</label>
          <input
            id="state"
            type="text"
            value={profile.state}
            maxLength={2}
            onChange={(e) => {
              const val = e.target.value
                .toUpperCase() // force uppercase
                .replace(/[^A-Z]/g, "") // strip non-letters
                .slice(0, 2); // limit to 2 chars
              setProfile({ ...profile, state: val });
            }}
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label htmlFor="zipcode">zip code:</label>
          <input
            id="zipcode"
            type="text"
            value={profile.zipcode}
            maxLength={5}
            onChange={(e) => {
              const onlyNums = e.target.value.replace(/\D/g, "").slice(0, 5);
              setProfile({ ...profile, zipcode: onlyNums });
            }}
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label htmlFor="cardNumber">card number:</label>
          <input
            id="cardNumber"
            type="text"
            placeholder="1234 5678 9012 3456"
            value={profile.cardNumber}
            maxLength={19}
            onChange={(e) => {
              let val = e.target.value.replace(/\D/g, "").slice(0, 16);
              val = val.replace(/(\d{4})(?=\d)/g, "$1 ");
              setProfile({ ...profile, cardNumber: val });
            }}
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label htmlFor="expiry">expiration date:</label>
          <input
            id="expiry"
            type="text"
            placeholder="MM/YY"
            value={profile.expiry}
            maxLength={5}
            onChange={(e) => {
              let val = e.target.value.replace(/[^\d]/g, "");
              if (val.length > 2) {
                val = val.slice(0, 2) + "/" + val.slice(2, 4);
              }
              setProfile({ ...profile, expiry: val });
            }}
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label htmlFor="cvv">
            those funny 3 numbers on the back of the card:
          </label>
          <input
            id="cvv"
            type="text"
            value={profile.cvv}
            maxLength={3}
            onChange={(e) => {
              const onlyNums = e.target.value.replace(/\D/g, "").slice(0, 3);
              setProfile({ ...profile, cvv: onlyNums });
            }}
            style={styles.input}
          />
        </div>

        <button type="submit" style={styles.primaryButton}>
          save profile
        </button>
      </form>
    </div>
  );

  // orders page to display past purchases
  const renderOrders = () => (
    <div style={styles.page}>
      <h2>order history</h2>
      {orders.length === 0 ? (
        <p style={styles.description}>you have no past orders.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {orders.map((order, idx) => {
            const formattedDate = new Date(order.date).toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });
            return (
              <li key={idx} style={{ marginBottom: "10px" }}>
                <button
                  style={styles.orderToggleButton}
                  onClick={() =>
                    setExpandedOrders((prev) => ({
                      ...prev,
                      [idx]: !prev[idx],
                    }))
                  }
                >
                  <span>
                    order {idx + 1} —{" "}
                    <span style={styles.orderDate}>{formattedDate}</span>
                  </span>
                  <span style={styles.orderArrow}>
                    {expandedOrders[idx] ? "▲" : "▼"}
                  </span>
                </button>
                {expandedOrders[idx] && (
                  <div style={{ marginTop: "10px", paddingLeft: "15px" }}>
                    {order.items.map((item, itemIdx) => (
                      <div key={itemIdx} style={styles.orderItem}>
                        <img
                          src={item.image}
                          alt={item.title}
                          style={styles.orderImage}
                        />
                        <div>
                          <strong>{item.title}</strong> × {item.quantity} — $
                          {(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );

  const handleCheckout = () => {
    const itemsMap = cart.reduce((acc, item) => {
      if (!acc[item.id]) {
        acc[item.id] = { ...item, quantity: 1 };
      } else {
        acc[item.id].quantity += 1;
      }
      return acc;
    }, {});
    const uniqueItems = Object.values(itemsMap);
    if (uniqueItems.length === 0) return;
    const order = {
      items: uniqueItems,
      date: new Date().toLocaleString(),
    };
    setOrders((prev) => [...prev, order]);
    alert("purchase complete.");
    setCart([]);
    setPage("orders");
  };

  const goToProductDetail = (product) => {
    setSelectedProduct(product);
    setPage("detail");
  };

  const addToCart = (product) => {
    if (!user) {
      alert("please sign in to add products to your cart!");
      return;
    }

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

  const searchedProducts = filteredProducts.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(searchedProducts.length / productsPerPage);

  const displayPage = searchedProducts.length > 0 ? currentPage : 0;
  const displayTotalPages = searchedProducts.length > 0 ? totalPages : 0;

  const renderHome = () => (
    <div style={styles.page}>
      <h1 style={styles.heroTitle}>welcome to posti</h1>
      <p style={styles.heroSubtitle}>kevin, huy, and teresa.</p>
      <button onClick={() => setPage("shop")} style={styles.ctaButton}>
        shop now
      </button>

      <h2 style={{ marginTop: "40px" }}>top 3 popular products</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          flexWrap: "wrap",
          marginTop: "20px",
        }}
      >
        {products.slice(0, 3).map((product) => (
          <div key={product.id} style={styles.productCard}>
            <img
              src={product.image}
              alt={product.title}
              style={styles.productImage}
            />
            <p style={{ fontWeight: "bold" }}>{product.title}</p>
            <p>${product.price.toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "50px", textAlign: "center" }}>
        <h3 style={{ marginBottom: "15px" }}>✨ kirby break ✨</h3>
        <img
          src="https://i.pinimg.com/originals/cb/38/1b/cb381b1d5a5d1e5ad8b9690864a60da1.gif"
          alt="kirby-eating"
          style={{
            width: "300px",
            borderRadius: "15px",
            boxShadow: "0 0 10px pink",
          }}
        />
        <p style={{ fontStyle: "italic", marginTop: "15px" }}>poyo!</p>
      </div>
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
        <button onClick={() => setPage("contact")} style={styles.navLink}>
          contact us
        </button>

        {!isAuthenticated ? (
          <>
            <button onClick={() => setPage("sign-in")} style={styles.navLink}>
              sign in
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setPage("account")} style={styles.navLink}>
              account
            </button>
            <button onClick={handleSignOut} style={styles.navLink}>
              log out
            </button>
          </>
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
                <p style={styles.price}>${product.price.toFixed(2)}</p>
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
              page {displayPage} of {displayTotalPages}
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
      if (newReview.trim() === "" || reviewerName.trim() === "") return;

      const newReviewObj = { name: reviewerName, text: newReview };

      setReviews((prev) => ({
        ...prev,
        [selectedProduct.id]: [
          ...(prev[selectedProduct.id] || []),
          newReviewObj,
        ],
      }));
      setNewReview("");
      setReviewerName("");
    };

    return (
      <div style={styles.page}>
        <h2 style={styles.sectionTitle}>{selectedProduct.title}</h2>
        <img
          src={selectedProduct.image}
          alt={selectedProduct.title}
          style={styles.detailImage}
        />
        <p style={styles.price}>${selectedProduct.price.toFixed(2)}</p>

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

        <div style={{ marginTop: "40px", textAlign: "left" }}>
          <h3>reviews:</h3>
          {productReviews.length === 0 ? (
            <p style={styles.description}>no reviews yet.</p>
          ) : (
            <ul style={{ paddingLeft: "0px" }}>
              {productReviews.map((rev, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: "#fff",
                    padding: "20px",
                    borderRadius: "8px",
                    marginBottom: "10px",
                    display: "flex",
                    alignItems: "center",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  <img
                    src="https://media.tenor.com/pbcpuLXu-hMAAAAj/nerd.gif"
                    alt="nerdy-waddle-dee"
                    style={{
                      width: "55px",
                      height: "40px",
                      marginRight: "10px",
                    }}
                  />
                  <div>
                    <p style={{ margin: 0 }}>
                      <strong>{rev.name}</strong>: {rev.text}
                    </p>
                  </div>
                </div>
              ))}
            </ul>
          )}

          <div style={{ marginTop: "20px" }}>
            <input
              type="text"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              placeholder="your name..."
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "14px",
                fontFamily: "'Segoe UI', sans-serif",
                borderRadius: "4px",
                border: "1px solid #ccc",
                marginBottom: "10px",
              }}
            />
            <textarea
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              placeholder="write your review..."
              style={{
                width: "100%",
                height: "80px",
                padding: "10px",
                fontSize: "14px",
                fontFamily: "'Segoe UI', sans-serif",
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
              <button onClick={handleCheckout} style={styles.checkoutButton}>
                check out
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const { name, email, message } = contactForm;

    if (name && email && message) {
      setContactStatus("Your message has been sent successfully!");
      setContactForm({ name: "", email: "", message: "" }); // reset form
    } else {
      setContactStatus("Please fill out all fields.");
    }
  };

  const renderContact = () => {
    return (
      <div style={{ padding: "20px" }}>
        <h2 style={{ fontSize: "40px" }}>contact us!</h2>
        <form onSubmit={handleContactSubmit} style={styles.contactForm}>
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <input
              type="text"
              name="name"
              placeholder="your name..."
              value={contactForm.name}
              onChange={handleContactChange}
              style={{ ...styles.inputField, flex: 1 }}
            />
            <input
              type="email"
              name="email"
              placeholder="email address..."
              value={contactForm.email}
              onChange={handleContactChange}
              style={{ ...styles.inputField, flex: 1 }}
            />
          </div>
          <input
            name="message"
            placeholder="message to us..."
            value={contactForm.message}
            onChange={handleContactChange}
            style={{
              ...styles.inputField,
              width: "98.5%",
              marginBottom: "20px",
            }}
          />
          <button type="submit" style={{ ...styles.button }}>
            Submit
          </button>
        </form>
        {contactStatus && (
          <p style={{ marginTop: "10px", textAlign: "center" }}>
            {contactStatus}
          </p>
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
      {page === "profile" && renderProfile()}
      {page === "orders" && renderOrders()}
      {page === "contact" && renderContact()}
    </div>
  );
}

const pink = "#dd0459";

const styles = {
  app: {
    fontFamily: "Arial, sans-serif",
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
    marginLeft: "300px", // to leave space for the sidebar
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

  productCard: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "15px",
    textAlign: "center",
    width: "1000px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
  },

  productImage: {
    width: "100px",
    height: "100px",
    objectFit: "contain",
    marginTop: "25px",
    marginBottom: "10px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: "10px",
  },
  orderToggleButton: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: "10px 15px",
    backgroundColor: pink,
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  orderDate: {
    marginLeft: "8px",
    fontSize: "14px",
    opacity: 0.9,
    textTransform: "lowercase",
  },
  orderArrow: {
    marginLeft: "8px",
    fontSize: "16px",
  },
  orderItem: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
  },
  orderImage: {
    width: "50px",
    height: "50px",
    marginRight: "10px",
  },
  contactForm: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "400px",
    margin: "0 auto",
  },
  inputField: {
    marginBottom: "10px",
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontFamily: "'Segoe UI', sans-serif",
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    backgroundColor: pink,
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    width: "415px",
  },
};
