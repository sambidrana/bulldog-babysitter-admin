import React from "react";

const FilterBoarding = ({ columnFilters, setColumnFilters }) => {
  const firstNameFilter = columnFilters.find((f) => f.id === "firstName") || {
    value: "",
  };
  const petNameFilter = columnFilters.find((f) => f.id === "petName") || {
    value: "",
  };
  const lastNameFilter = columnFilters.find((f) => f.id === "lastName") || {
    value: "",
  };
  const onFilterChange = (id, value) => {
    setColumnFilters((prev) => {
      const updatedFilters = prev
        .filter(
          (f) =>
            f.id !== "firstName" && f.id !== "petName" && f.id !== "lastName"
        )
        .concat({
          id: "firstName",
          value: id === "firstName" ? value : firstNameFilter.value,
        })
        .concat({
          id: "petName",
          value: id === "petName" ? value : petNameFilter.value,
        })
        .concat({
          id: "lastName",
          value: id === "lastName" ? value : lastNameFilter.value,
        });

      return updatedFilters;
    });
  };

  return (
    <div className="flex flex-col md:flex-row md:mb-4">
      <input
        className="p-2 border border-gray-600 rounded-lg mb-2 md:mr-2"
        placeholder="Search First Name"
        value={firstNameFilter.value}
        onChange={(e) => onFilterChange("firstName", e.target.value)}
      />
      <input
        className="p-2 border border-gray-600 rounded-lg mb-2 md:mr-2"
        placeholder="Search Last Name"
        value={lastNameFilter.value}
        onChange={(e) => onFilterChange("lastName", e.target.value)}
      />
      <input
        className="p-2 border border-gray-600 rounded-lg mb-2 md:mr-2"
        placeholder="Search Pet Name"
        value={petNameFilter.value}
        onChange={(e) => onFilterChange("petName", e.target.value)}
      />
    </div>
  );
};

export default FilterBoarding;
