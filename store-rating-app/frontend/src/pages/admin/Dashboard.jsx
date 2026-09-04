import { useEffect, useState } from "react";
import { Search, LogOut, UserPlus, Store as StoreIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

import StatsCard from "./components/StatsCard";
import UsersTable from "./components/UsersTable";
import StoresTable from "./components/StoresTable";
import CreateUserModal from "./components/CreateUserModal";
import CreateStoreModal from "./components/CreateStoreModal";

export default function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    users: 0,
    stores: 0,
    ratings: 0,
  });

  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [owners, setOwners] = useState([]);

  const [loading, setLoading] = useState(true);

  // User filters
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [userRole, setUserRole] = useState("");

  // Store filters
  const [storeName, setStoreName] = useState("");
  const [storeEmail, setStoreEmail] = useState("");
  const [storeAddress, setStoreAddress] = useState("");

  // Sorting
  const [userSort, setUserSort] = useState({
    sortBy: "name",
    order: "asc",
  });

  const [storeSort, setStoreSort] = useState({
    sortBy: "name",
    order: "asc",
  });

  const [showUserModal, setShowUserModal] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);

  // -------------------------
  // Dashboard stats
  // -------------------------
  const fetchDashboard = async () => {
    const { data } = await api.get("/admin/dashboard");

    setStats({
      users: data.users ?? 0,
      stores: data.stores ?? 0,
      ratings: data.ratings ?? 0,
    });
  };

  // -------------------------
  // Users
  // -------------------------
  const fetchUsers = async () => {
    const params = {
      sortBy: userSort.sortBy,
      order: userSort.order,
    };

    if (userName.trim()) {
      params.name = userName.trim();
    }

    if (userEmail.trim()) {
      params.email = userEmail.trim();
    }

    if (userAddress.trim()) {
      params.address = userAddress.trim();
    }

    if (userRole) {
      params.role = userRole;
    }

    const { data } = await api.get("/admin/users", { params });

    // Backend returns an array directly
    setUsers(Array.isArray(data) ? data : []);
  };

  // -------------------------
  // Stores
  // -------------------------
  const fetchStores = async () => {
    const params = {
      sortBy: storeSort.sortBy,
      order: storeSort.order,
    };

    if (storeName.trim()) {
      params.name = storeName.trim();
    }

    if (storeEmail.trim()) {
      params.email = storeEmail.trim();
    }

    if (storeAddress.trim()) {
      params.address = storeAddress.trim();
    }

    const { data } = await api.get("/admin/stores", { params });

    // Backend may return array directly
    setStores(Array.isArray(data) ? data : []);
  };

  // -------------------------
  // Store owners
  // -------------------------
  const fetchOwners = async () => {
    const { data } = await api.get("/admin/users", {
      params: {
        role: "STORE_OWNER",
        sortBy: "name",
        order: "asc",
      },
    });

    setOwners(Array.isArray(data) ? data : []);
  };

  // -------------------------
  // Initial load
  // -------------------------
  const loadAll = async () => {
    try {
      setLoading(true);

      await Promise.all([
        fetchDashboard(),
        fetchUsers(),
        fetchStores(),
        fetchOwners(),
      ]);
    } catch (error) {
      console.error("Admin dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  // -------------------------
  // User filters/sorting
  // -------------------------
  useEffect(() => {
    if (!loading) {
      fetchUsers().catch((error) =>
        console.error("Users error:", error)
      );
    }
  }, [
    userName,
    userEmail,
    userAddress,
    userRole,
    userSort,
  ]);

  // -------------------------
  // Store filters/sorting
  // -------------------------
  useEffect(() => {
    if (!loading) {
      fetchStores().catch((error) =>
        console.error("Stores error:", error)
      );
    }
  }, [
    storeName,
    storeEmail,
    storeAddress,
    storeSort,
  ]);

  // -------------------------
  // Logout
  // -------------------------
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // -------------------------
  // User created
  // -------------------------
  const handleUserCreated = async () => {
    setShowUserModal(false);

    await Promise.all([
      fetchDashboard(),
      fetchUsers(),
      fetchOwners(),
    ]);
  };

  // -------------------------
  // Store created
  // -------------------------
  const handleStoreCreated = async () => {
    setShowStoreModal(false);

    await Promise.all([
      fetchDashboard(),
      fetchStores(),
    ]);
  };

  if (loading) {
    return (
      <div className="page-center">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">

      {/* Header */}
      <header className="admin-header">
        <div>
          <p className="eyebrow">ADMIN PANEL</p>

          <h1>Dashboard</h1>

          <p className="muted">
            Manage users, stores and ratings.
          </p>
        </div>

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
  >
    <LogOut size={17} />
    Logout
  </button>
</div>
      </header>

      {/* Stats */}
      <section className="stats-grid">

        <StatsCard
          label="Total Users"
          value={stats.users}
        />

        <StatsCard
          label="Total Stores"
          value={stats.stores}
        />

        <StatsCard
          label="Total Ratings"
          value={stats.ratings}
        />

      </section>

      {/* Users */}
      <section className="admin-section">

        <div className="section-heading">

          <div>
            <h2>Users</h2>

            <p className="muted">
              Search and manage registered users.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={() => setShowUserModal(true)}
          >
            <UserPlus size={17} />
            Add User
          </button>

        </div>

        {/* User Filters */}
        <div className="filter-grid">

          <div className="filter-input">
            <Search size={17} />

            <input
              value={userName}
              onChange={(e) =>
                setUserName(e.target.value)
              }
              placeholder="Filter by name"
            />
          </div>

          <div className="filter-input">
            <Search size={17} />

            <input
              value={userEmail}
              onChange={(e) =>
                setUserEmail(e.target.value)
              }
              placeholder="Filter by email"
            />
          </div>

          <div className="filter-input">
            <Search size={17} />

            <input
              value={userAddress}
              onChange={(e) =>
                setUserAddress(e.target.value)
              }
              placeholder="Filter by address"
            />
          </div>

          <select
            value={userRole}
            onChange={(e) =>
              setUserRole(e.target.value)
            }
            className="filter-select"
          >
            <option value="">All roles</option>
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
            <option value="STORE_OWNER">
              Store Owner
            </option>
          </select>

        </div>

        <UsersTable
          users={users}
          sort={userSort}
          setSort={setUserSort}
        />

      </section>

      {/* Stores */}
      <section className="admin-section">

        <div className="section-heading">

          <div>
            <h2>Stores</h2>

            <p className="muted">
              Search and manage stores.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={() =>
              setShowStoreModal(true)
            }
          >
            <StoreIcon size={17} />
            Add Store
          </button>

        </div>

        {/* Store Filters */}
        <div className="filter-grid">

          <div className="filter-input">
            <Search size={17} />

            <input
              value={storeName}
              onChange={(e) =>
                setStoreName(e.target.value)
              }
              placeholder="Filter by name"
            />
          </div>

          <div className="filter-input">
            <Search size={17} />

            <input
              value={storeEmail}
              onChange={(e) =>
                setStoreEmail(e.target.value)
              }
              placeholder="Filter by email"
            />
          </div>

          <div className="filter-input">
            <Search size={17} />

            <input
              value={storeAddress}
              onChange={(e) =>
                setStoreAddress(e.target.value)
              }
              placeholder="Filter by address"
            />
          </div>

        </div>

        <StoresTable
          stores={stores}
          sort={storeSort}
          setSort={setStoreSort}
        />

      </section>

      {/* Create User Modal */}
      {showUserModal && (
        <CreateUserModal
          onClose={() =>
            setShowUserModal(false)
          }
          onCreated={handleUserCreated}
        />
      )}

      {/* Create Store Modal */}
      {showStoreModal && (
        <CreateStoreModal
          owners={owners}
          onClose={() =>
            setShowStoreModal(false)
          }
          onCreated={handleStoreCreated}
        />
      )}

    </div>
  );
}