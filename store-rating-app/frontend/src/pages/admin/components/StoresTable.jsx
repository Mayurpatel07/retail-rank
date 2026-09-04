import { ArrowDown, ArrowUp } from "lucide-react";

export default function StoresTable({
  stores = [],
  sort,
  setSort,
}) {
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
    if (sort?.sortBy !== field) {
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

            <th onClick={() => handleSort("rating")}>
              <span>
                Rating
                <SortIcon field="rating" />
              </span>
            </th>
          </tr>
        </thead>

        <tbody>
          {stores.length === 0 ? (
            <tr>
              <td colSpan="4" className="empty-table">
                No stores found.
              </td>
            </tr>
          ) : (
            stores.map((store) => (
              <tr key={store.id}>
                <td>{store.name}</td>

                <td>{store.email}</td>

                <td>{store.address}</td>

                <td>
                  {store.averageRating !== null &&
                  store.averageRating !== undefined
                    ? Number(store.averageRating).toFixed(1)
                    : "0.0"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}