const Filters = ({ columnFilters, setColumnFilters }) => {
  const getFilter = (id) =>
    columnFilters.find((f) => f.id === id) || { value: "" };

  const onFilterChange = (id, value) => {
    setColumnFilters((prev) => {
      const updatedFilters = prev
        .filter((f) => f.id !== "firstName" && f.id !== "petName")
        .concat([
          {
            id: "firstName",
            value: id === "firstName" ? value : getFilter("firstName").value,
          },
          {
            id: "petName",
            value: id === "petName" ? value : getFilter("petName").value,
          },
        ]);

      return updatedFilters;
    });
  };

  return (
    <div className="mb-4">
      {["firstName", "petName"].map((filterId) => (
        <input
          key={filterId}
          className="p-2 border border-gray-600 rounded-lg mr-2"
          placeholder={`Search ${
            filterId === "firstName" ? "First" : "Pet"
          } Name`}
          value={getFilter(filterId).value}
          onChange={(e) => onFilterChange(filterId, e.target.value)}
        />
      ))}
    </div>
  );
};

export default Filters;
