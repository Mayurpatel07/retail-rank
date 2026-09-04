import { useEffect, useState } from "react";
import { ArrowLeft, Star } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../services/api";

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data } = await api.get(`/admin/users/${id}`);
        setUser(data.user);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id]);

  if (loading) {
    return (
      <div className="page-center">
        <div className="loading-spinner"></div>
        <p>Loading user...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="page-center">
        <h2>User not found</h2>

        <button
          className="primary-button"
          onClick={() => navigate("/admin/dashboard")}
        >
          Back to dashboard
        </button>
      </div>
    );
  }

  const ownerRating =
    user.storeOwner?.store?.averageRating ?? null;

  return (
    <div className="admin-page">
      <button
        className="back-button"
        onClick={() => navigate("/admin/dashboard")}
      >
        <ArrowLeft size={17} />
        Back to Dashboard
      </button>

      <div className="details-header">
        <div>
          <p className="eyebrow">USER DETAILS</p>
          <h1>{user.name}</h1>
          <p className="muted">{user.email}</p>
        </div>

        <span className={`role-badge ${user.role.toLowerCase()}`}>
          {user.role}
        </span>
      </div>

      <div className="details-grid">
        <div className="details-card">
          <h3>Account Information</h3>

          <div className="detail-row">
            <span>Name</span>
            <strong>{user.name}</strong>
          </div>

          <div className="detail-row">
            <span>Email</span>
            <strong>{user.email}</strong>
          </div>

          <div className="detail-row">
            <span>Address</span>
            <strong>{user.address}</strong>
          </div>

          <div className="detail-row">
            <span>Role</span>
            <strong>{user.role}</strong>
          </div>
        </div>

        {user.role === "STORE_OWNER" && (
          <div className="details-card">
            <h3>Store Rating</h3>

            {user.storeOwner?.store ? (
              <>
                <p className="store-detail-name">
                  {user.storeOwner.store.name}
                </p>

                <div className="owner-rating">
                  <Star size={22} fill="currentColor" />

                  <strong>
                    {ownerRating !== null
                      ? Number(ownerRating).toFixed(1)
                      : "0.0"}
                  </strong>

                  <span>/ 5</span>
                </div>

                <p className="muted">
                  Average rating received by this store.
                </p>
              </>
            ) : (
              <p className="muted">
                No store assigned to this owner.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}