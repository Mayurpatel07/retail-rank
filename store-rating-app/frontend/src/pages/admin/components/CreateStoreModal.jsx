import { useState } from "react";
import { X } from "lucide-react";
import api from "../../../services/api";

export default function CreateStoreModal({
  owners,
  onClose,
  onCreated,
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    ownerId: "",
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

      await api.post("/admin/stores", {
        ...form,
        ownerId: Number(form.ownerId),
      });

      onCreated();
      onClose();
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to create store."
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
            <h2>Add store</h2>
            <p>Register a store and assign its owner.</p>
          </div>

          <button onClick={onClose} className="icon-button">
            <X size={19} />
          </button>
        </div>

        <form onSubmit={submit} className="admin-form">
          <label>
            Store name
            <input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Store name"
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="store@example.com"
              required
            />
          </label>

          <label>
            Address
            <textarea
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              placeholder="Store address"
              rows="3"
              required
            />
          </label>

          <label>
            Store owner
            <select
              value={form.ownerId}
              onChange={(e) => update("ownerId", e.target.value)}
              required
            >
              <option value="">Select owner</option>

              {owners.map((owner) => (
                <option key={owner.id} value={owner.id}>
                  {owner.name}
                </option>
              ))}
            </select>
          </label>

          {error && <div className="form-error">{error}</div>}

          <button
            className="primary-button"
            disabled={loading || !owners.length}
          >
            {loading ? "Creating..." : "Create store"}
          </button>
        </form>
      </div>
    </div>
  );
}