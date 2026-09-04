import { useEffect, useState } from "react";
import { Search, Star, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

export default function Stores() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [stores, setStores] = useState([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStores = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get("/stores", {
        params: { name, address },
      });

      setStores(Array.isArray(data) ? data : []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load stores."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStores();
  }, []);

  const searchStores = (event) => {
    event.preventDefault();
    loadStores();
  };

  const submitRating = async (storeId, rating, hasRating) => {
    try {
      setError("");

      if (hasRating) {
        await api.patch(`/stores/${storeId}/rating`, {
          rating,
        });
      } else {
        await api.post(`/stores/${storeId}/rating`, {
          rating,
        });
      }

      await loadStores();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to submit rating."
      );
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <main className="stores-page">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">
            <Star size={17} fill="currentColor" />
          </div>

          <span>StoreRate</span>
        </div>

        <div className="user-menu">
          <span>{user?.name}</span>

          <div className="header-actions">
            <button
              className="secondary-button"
              onClick={() => navigate("/change-password")}
            >
              Change Password
            </button>

            <button
              className="logout-button"
              onClick={handleLogout}
              title="Log out"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <section className="stores-container">
        <div className="page-heading">
          <div>
            <p className="eyebrow">DISCOVER STORES</p>

            <h1>Find a store</h1>

            <p>
              Browse stores and share your experience.
            </p>
          </div>
        </div>

        <form
          className="search-bar"
          onSubmit={searchStores}
        >
          <div className="search-input">
            <Search size={18} />

            <input
              placeholder="Search by store name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <input
            placeholder="Search by address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <button
            type="submit"
            className="primary-button"
          >
            Search
          </button>
        </form>

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        {loading ? (
          <p className="empty-state">
            Loading stores...
          </p>
        ) : stores.length === 0 ? (
          <p className="empty-state">
            No stores found.
          </p>
        ) : (
          <div className="store-grid">
            {stores.map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                onRate={submitRating}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function StoreCard({ store, onRate }) {
  const [rating, setRating] = useState(
    store.userRating || 0
  );

  const hasRating = store.userRating !== null;

  const overallRating =
    Number(store.overallRating) || 0;

  return (
    <article className="store-card">
      <div className="store-card-top">
        <div className="store-avatar">
          {store.name?.charAt(0).toUpperCase()}
        </div>

        <div>
          <h2>{store.name}</h2>

          <p>{store.address}</p>
        </div>
      </div>

      <div className="overall-rating">
        <div className="stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={18}
              fill={
                star <= Math.round(overallRating)
                  ? "currentColor"
                  : "none"
              }
            />
          ))}
        </div>

        <strong>
          {overallRating.toFixed(1)}
        </strong>

        <span>overall</span>
      </div>

      <div className="your-rating">
        <div>
          <span>Your rating</span>

          <strong>
            {store.userRating ?? "Not rated"}
          </strong>
        </div>

        <div className="rating-actions">
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                aria-label={`Rate ${star}`}
              >
                <Star
                  size={20}
                  fill={
                    star <= rating
                      ? "currentColor"
                      : "none"
                  }
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            className="rate-button"
            disabled={!rating}
            onClick={() =>
              onRate(
                store.id,
                rating,
                hasRating
              )
            }
          >
            {hasRating ? "Update" : "Rate"}
          </button>
        </div>
      </div>
    </article>
  );
}