import { useEffect, useState } from "react";
import { LogOut, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await api.get(
          "/owner/dashboard"
        );

        setStores(Array.isArray(data) ? data : []);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <main className="owner-page">
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
              onClick={() =>
                navigate("/change-password")
              }
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

      <section className="owner-container">
        <div className="page-heading">
          <p className="eyebrow">STORE OWNER</p>

          <h1>Your store performance</h1>

          <p>
            See how customers are rating your store.
          </p>
        </div>

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        {loading ? (
          <p className="empty-state">
            Loading dashboard...
          </p>
        ) : stores.length === 0 ? (
          <div className="empty-state">
            <h3>No store assigned</h3>

            <p>
              Your store hasn't been added yet.
            </p>
          </div>
        ) : (
          <div className="owner-stores">
            {stores.map((store) => (
              <StoreOverview
                key={store.id}
                store={store}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function StoreOverview({ store }) {
  const averageRating =
    Number(store.averageRating) || 0;

  const ratings = Array.isArray(store.ratings)
    ? store.ratings
    : [];

  const totalRatings =
    Number(store.totalRatings) || 0;

  return (
    <article className="owner-store">
      <div className="owner-store-header">
        <div>
          <h2>{store.name}</h2>

          <p>{store.address}</p>
        </div>

        <div className="rating-summary">
          <Star
            size={22}
            fill="currentColor"
          />

          <strong>
            {averageRating.toFixed(1)}
          </strong>
        </div>
      </div>

      <div className="owner-stats">
        <div>
          <span>Average rating</span>

          <strong>
            {averageRating.toFixed(1)} / 5
          </strong>
        </div>

        <div>
          <span>Total ratings</span>

          <strong>{totalRatings}</strong>
        </div>
      </div>

      <div className="ratings-section">
        <div className="section-heading">
          <h3>Customer ratings</h3>

          <span>
            {totalRatings} submissions
          </span>
        </div>

        {ratings.length === 0 ? (
          <p className="empty-state">
            No ratings yet.
          </p>
        ) : (
          <div className="rating-list">
            {ratings.map((item, index) => (
              <div
                className="rating-row"
                key={`${item.user.id}-${index}`}
              >
                <div className="rating-user">
                  <div className="user-avatar">
                    {item.user?.name
                      ?.charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <strong>
                      {item.user?.name}
                    </strong>

                    <span>
                      {item.user?.email}
                    </span>
                  </div>
                </div>

                <div className="rating-value">
                  <div className="stars">
                    {[1, 2, 3, 4, 5].map(
                      (star) => (
                        <Star
                          key={star}
                          size={15}
                          fill={
                            star <= item.rating
                              ? "currentColor"
                              : "none"
                          }
                        />
                      )
                    )}
                  </div>

                  <strong>
                    {item.rating}/5
                  </strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}