import React, { useState } from "react";
export default function Address({ data, onUpdate, onNext, onPrevious }) {
  const [errors, setErrors] = useState({});
  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};
    let fieldLabels = {
      street: "Street Address",
      city: "City",
      state: "State",
      zip: "Zip Code",
    };
    Object.entries(fieldLabels).forEach(([field, label]) => {
      if (!data.address[field]) {
        newErrors[field] = `${label} is required`;
      }
    });
    setErrors(newErrors);
  };
  const handleChange = (e) => {
    let field = e.target.name;
    let value = e.target.value;
    onUpdate({ address: { ...data.address, [field]: value } });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label className="block text-sm font-md text-gray-700 mb-2">
          Street Address
        </label>
        <input
          type="text"
          name="street"
          value={data.address.street}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></input>
        {errors.street && (
          <p className="text-red-500 text-sm mt-1">{errors.street}</p>
        )}
        <label className="block text-sm font-md text-gray-700 mb-2">City</label>
        <input
          type="text"
          name="city"
          value={data.address.city}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></input>
        {errors.city && (
          <p className="text-red-500 text-sm mt-1">{errors.city}</p>
        )}
        <label className="block text-sm font-md text-gray-700 mb-2">
          State
        </label>
        <input
          type="text"
          name="state"
          value={data.address.state}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></input>
        {errors.state && (
          <p className="text-red-500 text-sm mt-1">{errors.state}</p>
        )}
        <label className="block text-sm font-md text-gray-700 mb-2">
          Zip Code
        </label>
        <input
          type="number"
          name="zip"
          value={data.address.zip}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></input>
        {errors.zip && (
          <p className="text-red-500 text-sm mt-1">{errors.zip}</p>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
