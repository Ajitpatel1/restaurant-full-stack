
import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  UtensilsCrossed,
  Search,
  Leaf,
  ArrowRight,
  X,
  CheckCircle2
} from 'lucide-react'

import './App.css'

// Food image function
function getFoodImage(food) {
  return food.food_image || '/images/default-food.jpg'
}

function App() {
  const [menu, setMenu] = useState([])
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cartOpen, setCartOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  // Fetch menu from FastAPI
  useEffect(() => {
    fetch('http://127.0.0.1:8000/menu')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Unable to fetch menu')
        }
        return response.json()
      })
      .then((result) => {
        setMenu(result.data)
      })
      .catch(() => {
        setError('Menu load nahi ho paya. Backend server check karo.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  // Categories
  const categories = useMemo(
    () => ['All', ...new Set(menu.map((item) => item.category))],
    [menu]
  )

  // Search and category filter
  const filteredMenu = menu.filter((food) => {
    const matchesSearch = food.food_name
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchesCategory =
      category === 'All' || food.category === category

    return matchesSearch && matchesCategory
  })

  // Add food to cart
  const addToCart = (food) => {
    setCart((previous) => {
      const existing = previous.find(
        (item) => item.food_id === food.food_id
      )

      if (existing) {
        return previous.map((item) =>
          item.food_id === food.food_id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [...previous, { ...food, quantity: 1 }]
    })

    setCartOpen(true)
  }

  // Update quantity
  const updateQuantity = (foodId, change) => {
    setCart((previous) =>
      previous
        .map((item) =>
          item.food_id === foodId
            ? { ...item, quantity: item.quantity + change }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  // Remove item
  const removeItem = (foodId) => {
    setCart((previous) =>
      previous.filter((item) => item.food_id !== foodId)
    )
  }

  // Bill calculation
  const subtotal = cart.reduce(
    (total, item) =>
      total + Number(item.price) * item.quantity,
    0
  )

  const discount = subtotal >= 300 ? subtotal * 0.10 : 0
  const total = subtotal - discount

  const itemCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  )

  return (
    <div className="restaurant-app">

      {/* Navbar */}
      <header className="navbar">
        <a className="brand" href="#home">
          <span className="brand-icon">
            <Leaf size={23} />
          </span>

          <span>
            PATEL<span className="brand-light"> RESTAURANT</span>
          </span>
        </a>

        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#menu">Our Menu</a>
          <a href="#about">About</a>
        </nav>

        <button
          className="nav-cart"
          onClick={() => setCartOpen(true)}
        >
          <ShoppingBag size={19} />
          <span>My Cart</span>
          <b>{itemCount}</b>
        </button>
      </header>

      <main>

        {/* Hero Section */}
        <section className="hero-section" id="home">
          <div className="hero-content">

            <motion.div
              className="hero-copy"
              initial={{ opacity: 0, x: -45 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="hero-label">
                <Leaf size={15} />
                100% PURE VEGETARIAN
              </span>

              <h1>
                Fresh Food.
                <br />
                <span>Happy Moments.</span>
              </h1>

              <p>
                Delicious vegetarian meals, made fresh with love.
                Your favourite flavours are just a few clicks away.
              </p>

              <a href="#menu" className="hero-button">
                Explore Menu
                <ArrowRight size={18} />
              </a>

              <div className="hero-points">
                <span>
                  <CheckCircle2 size={16} />
                  Freshly prepared
                </span>

                <span>
                  <CheckCircle2 size={16} />
                  Pure vegetarian
                </span>
              </div>
            </motion.div>

            <motion.div
              className="hero-image-wrap"
              initial={{ opacity: 0, scale: 0.85, rotate: 4 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8 }}
            >
              <img
                src="/images/veg-biryani.jpg"
                alt="Veg Biryani"
              />

              <div className="hero-image-tag">
                <Leaf size={17} />
                <span>Made with freshness</span>
              </div>
            </motion.div>

          </div>
        </section>

        {/* Menu Section */}
        <section className="menu-section" id="menu">

          <div className="section-heading">
            <div>
              <span className="section-kicker">
                OUR SPECIALITIES
              </span>

              <h2>
                Explore Our <span>Menu</span>
              </h2>

              <p>
                Choose your favourite dish and enjoy every bite.
              </p>
            </div>

            <div className="search-box">
              <Search size={18} />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search food..."
              />
            </div>
          </div>

          {/* Category Buttons */}
          <div className="category-list">
            {categories.map((item) => (
              <button
                key={item}
                className={
                  category === item
                    ? 'category-btn active'
                    : 'category-btn'
                }
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>

          {loading && (
            <p className="message">
              Loading delicious food...
            </p>
          )}

          {error && (
            <p className="message error-message">
              {error}
            </p>
          )}

          {/* Food Cards */}
          {!loading && !error && (
            <motion.div layout className="food-grid">
              <AnimatePresence>
                {filteredMenu.map((food, index) => (
                  <motion.article
                    className="food-card"
                    key={food.food_id}
                    layout
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{
                      duration: 0.35,
                      delay: index * 0.04
                    }}
                  >

                    <div className="food-photo">
                      <img
                        src={getFoodImage(food)}
                        alt={food.food_name}
                        loading="lazy"
                      />

                      <span className="veg-mark">
                        <Leaf size={13} />
                        VEG
                      </span>
                    </div>

                    <div className="food-details">
                      <span className="food-category">
                        {food.category}
                      </span>

                      <h3>{food.food_name}</h3>

                      <div className="food-card-bottom">
                        <strong>
                          ₹{Number(food.price).toFixed(2)}
                        </strong>

                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => addToCart(food)}
                          className="add-button"
                        >
                          <Plus size={17} />
                          Add
                        </motion.button>
                      </div>
                    </div>

                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {!loading && !error && filteredMenu.length === 0 && (
            <p className="message">
              No food items found.
            </p>
          )}

        </section>

        {/* About Section */}
        <section className="about-section" id="about">
          <div>
            <span className="section-kicker">
              OUR PROMISE
            </span>

            <h2>
              Good food, made with <span>care.</span>
            </h2>

            <p>
              Fresh ingredients, vegetarian goodness and
              flavours worth coming back for.
            </p>
          </div>

          <div className="about-icon">
            <UtensilsCrossed size={42} />
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="footer">
        <span>© 2026 Patel Restaurant</span>

        <span>
          Freshness in every bite
          <Leaf size={15} />
        </span>
      </footer>

      {/* Cart Drawer */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              className="drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
            />

            <motion.aside
              className="cart-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{
                type: 'spring',
                damping: 28,
                stiffness: 250
              }}
            >

              <div className="drawer-header">
                <div>
                  <span className="section-kicker">
                    YOUR SELECTION
                  </span>

                  <h2>Your Cart ({itemCount})</h2>
                </div>

                <button
                  className="close-btn"
                  onClick={() => setCartOpen(false)}
                >
                  <X />
                </button>
              </div>

              <div className="drawer-items">
                {cart.length === 0 ? (
                  <div className="empty-cart">
                    <ShoppingBag size={48} />

                    <h3>Your cart is empty</h3>

                    <p>
                      Add something delicious from our menu.
                    </p>

                    <button onClick={() => setCartOpen(false)}>
                      Explore Menu
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <motion.div
                      className="drawer-item"
                      key={item.food_id}
                      layout
                    >
                      <img
                        src={getFoodImage(item)}
                        alt={item.food_name}
                      />

                      <div className="drawer-item-info">
                        <h4>{item.food_name}</h4>

                        <strong>
                          ₹{Number(item.price).toFixed(2)}
                        </strong>

                        <div className="quantity-row">
                          <button
                            onClick={() =>
                              updateQuantity(item.food_id, -1)
                            }
                          >
                            <Minus size={14} />
                          </button>

                          <span>{item.quantity}</span>

                          <button
                            onClick={() =>
                              updateQuantity(item.food_id, 1)
                            }
                          >
                            <Plus size={14} />
                          </button>

                          <button
                            className="remove-btn"
                            onClick={() => removeItem(item.food_id)}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Cart Bill */}
              {cart.length > 0 && (
                <div className="drawer-bill">

                  <div>
                    <span>Subtotal</span>
                    <strong>₹{subtotal.toFixed(2)}</strong>
                  </div>

                  <div>
                    <span>Discount</span>

                    <strong className="discount">
                      -₹{discount.toFixed(2)}
                    </strong>
                  </div>

                  {subtotal < 300 && (
                    <p className="discount-hint">
                      Add ₹{(300 - subtotal).toFixed(2)}
                      {' '}more to unlock 10% discount.
                    </p>
                  )}

                  <div className="total-row">
                    <span>Total</span>
                    <strong>₹{total.toFixed(2)}</strong>
                  </div>

                  <button
                    className="checkout-button"
                    onClick={() => setCheckoutOpen(true)}
                  >
                    Continue to Checkout
                    <ArrowRight size={18} />
                  </button>

                </div>
              )}

            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <AnimatePresence>
        {checkoutOpen && (
          <motion.div
            className="checkout-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >

            <motion.div
              className="checkout-modal"
              initial={{
                opacity: 0,
                y: 25,
                scale: 0.95
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1
              }}
              exit={{
                opacity: 0,
                y: 20
              }}
            >

              <button
                className="close-btn modal-close"
                onClick={() => setCheckoutOpen(false)}
              >
                <X />
              </button>

              <div className="modal-icon">
                <ShoppingBag size={30} />
              </div>

              <span className="section-kicker">
                ORDER SUMMARY
              </span>

              <h2>Almost there!</h2>

              <p>
                Your cart total is
                <strong> ₹{total.toFixed(2)}</strong>.
              </p>

              <p className="checkout-note">
                Your order will be submitted after we connect
                the checkout API. No order or payment has
                been placed yet.
              </p>

              <button
                className="checkout-button"
                onClick={() => setCheckoutOpen(false)}
              >
                Back to Cart
              </button>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}

export default App
