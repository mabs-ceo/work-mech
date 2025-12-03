import React, { useState, useEffect, useMemo } from "react";

export default function MobilePm({ data }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [isExpand, setIsExpand] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");

  // Load saved phone
  useEffect(() => {
    const saved = localStorage.getItem("pm_phone");
    if (saved) setPhoneNumber(saved);
  }, []);

  const savePhone = () => {
    if (phoneNumber.trim()) {
      localStorage.setItem("pm_phone", phoneNumber);
      alert("Phone saved!");
    } else {
      alert("Enter a valid phone number");
    }
  };

  const clearPhone = () => {
    localStorage.removeItem("pm_phone");
    setPhoneNumber("");
  };

  const sendWhatsApp = () => {
    if (!phoneNumber.trim()) return alert("Enter phone number");
    if (selectedItems.length === 0) return alert("Select items first");

    const msg = selectedItems
      .map((i, n) => `${n + 1}. ${i["Equipment Name"]} - ${i["Svc Pkg"]}`)
      .join("\n");

    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  // Filtered data safely
  const filteredData = useMemo(() => {
    if (!Array.isArray(data)) return [];

    return data.filter((item) => {
      const term = searchTerm.toLowerCase();
      const name = item["Equipment Name"]?.toLowerCase() || "";
      const pkg = item["Svc Pkg"]?.toLowerCase() || "";
      const details = item.ServiceDetails || {};
      const keys = Object.keys(details);
      const tasks = keys[1] && Array.isArray(details[keys[1]]) ? details[keys[1]] : [];

      const taskMatch = tasks.some((t) => t.toLowerCase().includes(term));
      return name.includes(term) || pkg.includes(term) || taskMatch;
    });
  }, [data, searchTerm]);

  const toggleSelectItem = (item) => {
    setSelectedItems((prev) =>
      prev.includes(item)
        ? prev.filter((x) => x !== item)
        : [...prev, item]
    );
  };

  return (
    <div className="flex flex-col items-center max-w-[750px] mx-auto">

      <h1 className="font-bold text-lg mt-2">Preventive Maintenance (PM) Schedule 😎</h1>

      {/* --- HEADER SECTION --- */}
      <div className="w-full max-w-md">

        {/* Search input */}
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="font-bold mb-4 w-full bg-amber-50 px-4 py-2 rounded"
          placeholder="Search Equipment, Service, or Task..."
        />

        {/* Phone number */}
        <div className="bg-gray-100 p-3 rounded mb-3">
          <p className="font-semibold mb-1">WhatsApp Number</p>
          <input
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-3 py-2 rounded border"
            placeholder="Enter phone number (e.g. 6591234567)"
          />
          <div className="flex gap-3 mt-2">
            <button onClick={savePhone} className="bg-green-600 text-white px-3 py-1 rounded">
              Save
            </button>
            <button onClick={clearPhone} className="bg-red-600 text-white px-3 py-1 rounded">
              Clear
            </button>
          </div>
        </div>

        {/* WhatsApp send button */}
        <button
          onClick={sendWhatsApp}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full mb-4"
        >
          Send Selected via WhatsApp
        </button>

      </div>

      <p className="font-mono text-[12px] m-2">{filteredData.length} results found</p>

      {/* --- LIST SECTION --- */}
      {filteredData.map((item, index) => {
        const details = item.ServiceDetails || {};
        const keys = Object.keys(details);
        const tasks = keys[1] && Array.isArray(details[keys[1]]) ? details[keys[1]] : [];
        const isSelected = selectedItems.includes(item);

        return (
          <div
            key={index}
            className={`border p-4 m-2 rounded shadow-md w-full max-w-md ${
              isSelected ? "bg-green-50 border-green-600" : ""
            }`}
          >
            {/* Top row */}
            <div className="flex justify-between items-center">
              <h2 className="font-semibold">Equipment: {item["Equipment Name"]}</h2>
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleSelectItem(item)}
              />
            </div>

            <h2 className="font-semibold">Service: {item["Svc Pkg"]}</h2>

            {/* Expand button */}
            <div
              onClick={() => {
                setIsExpand(index === selectedId ? !isExpand : true);
                setSelectedId(index);
              }}
              className="w-full bg-gray-500 text-white text-center py-1 rounded mt-2 cursor-pointer"
            >
              {isExpand && selectedId === index ? "Hide Spec" : "View Spec"}
            </div>

            {/* Task list */}
            {isExpand && selectedId === index && tasks.length > 0 && (
              <ul className="ml-4 list-disc mt-2">
                {tasks.map((task, i) => <li key={i}>{task}</li>)}
              </ul>
            )}
          </div>
        );
      })}

    </div>
  );
}
