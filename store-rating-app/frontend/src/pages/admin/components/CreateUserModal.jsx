import { useState } from "react";
import { X } from "lucide-react";
import api from "../../../services/api";

export default function CreateUserModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "USER",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const submit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      await api.post("/admin/users", {
        ...form,
      });

      onCreated();
      onClose();
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to create user."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <div>
            <h2>Add user</h2>
            <p>Create an admin, user, or store owner.</p>
          </div>

          <button onClick={onClose} className="icon-button">
            <X size={19} />
          </button>
        </div>

        <form onSubmit={submit} className="admin-form">
          <label>
            Name
            <input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Full name"
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="email@example.com"
              required
            />
          </label>

          <label>
            Address
            <textarea
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              placeholder="Address"
              rows="3"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              placeholder="Password"
              required
            />
          </label>

          <label>
            Role
            <select
              value={form.role}
              onChange={(e) => update("role", e.target.value)}
            >
              <option value="USER">Normal User</option>
              <option value="STORE_OWNER">Store Owner</option>
              <option value="ADMIN">Admin</option>
            </select>
          </label>

          {error && <div className="form-error">{error}</div>}

          <button className="primary-button" disabled={loading}>
            {loading ? "Creating..." : "Create user"}
          </button>
        </form>
      </div>
    </div>
  );
}