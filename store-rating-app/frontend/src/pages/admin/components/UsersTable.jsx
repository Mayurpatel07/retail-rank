import { ArrowDown, ArrowUp, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UsersTable({
  users = [],
  sort,
  setSort,
}) {
  const navigate = useNavigate();

  const handleSort = (field) => {
    setSort((current) => ({
      sortBy: field,
      order:
        current.sortBy === field && current.order === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const SortIcon = ({ field }) => {
    if (sort.sortBy !== field) {
      return null;
    }

    return sort.order === "asc" ? (
      <ArrowUp size={14} />
    ) : (
      <ArrowDown size={14} />
    );
  };

  return (
    <div className="table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th onClick={() => handleSort("name")}>
              <span>
                Name
                <SortIcon field="name" />
              </span>
            </th>

            <th onClick={() => handleSort("email")}>
              <span>
                Email
                <SortIcon field="email" />
              </span>
            </th>

            <th onClick={() => handleSort("address")}>
              <span>
                Address
                <SortIcon field="address" />
              </span>
            </th>

            <th onClick={() => handleSort("role")}>
              <span>
                Role
                <SortIcon field="role" />
              </span>
            </th>

            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="5" className="empty-table">
                No users found.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>

                <td>{user.email}</td>

                <td>{user.address}</td>

                <td>
                  <span
                    className={`role-badge ${user.role.toLowerCase()}`}
                  >
                    {user.role}
                  </span>
                </td>

                <td>
                  <button
                    className="table-action"
                    onClick={() =>
                      navigate(`/admin/users/${user.id}`)
                    }
                  >
                    <Eye size={16} />
                    View
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}