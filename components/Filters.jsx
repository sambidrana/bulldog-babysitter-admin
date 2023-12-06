const Filters = ({ columnFilters, setColumnFilters }) => {
  const firstNameFilter = columnFilters.find((f) => f.id === "firstName") || {
    value: "",
  };
  const petNameFilter = columnFilters.find((f) => f.id === "petName") || {
    value: "",
  };
  const startDateFilter = columnFilters.find((f) => f.id === "startDate") || {
    value: "",
  };
  const onFilterChange = (id, value) => {
    setColumnFilters((prev) => {
      const updatedFilters = prev
        .filter((f) => f.id !== "firstName" && f.id !== "petName" && f.id !== "startDate")
        .concat({
          id: "firstName",
          value: id === "firstName" ? value : firstNameFilter.value,
        })
        .concat({
          id: "petName",
          value: id === "petName" ? value : petNameFilter.value,
        })
        .concat({
          id: "startDate",
          value: id === "startDate" ? value : startDateFilter.value,
        });

      return updatedFilters;
    });
  };

  return (
    <div className="mb-4">
      <input
        className="p-2 border border-gray-600 rounded-lg mr-2"
        placeholder="Search First Name"
        value={firstNameFilter.value}
        onChange={(e) => onFilterChange("firstName", e.target.value)}
      />
      <input
        className="p-2 border border-gray-600 rounded-lg mr-2"
        placeholder="Search Pet Name"
        value={petNameFilter.value}
        onChange={(e) => onFilterChange("petName", e.target.value)}
      />
      <input
        className="p-2 border border-gray-600 rounded-lg mr-2"
        placeholder="Search Start Date"
        value={startDateFilter.value}
        onChange={(e) => onFilterChange("startDate", e.target.value)}
      />
    </div>
  );
};

export default Filters;
