import React, { useState, useEffect } from 'react';

export default function MobilePm({ data }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpand, setIsExpand] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState('');

  // Load phone number from localStorage
  useEffect(() => {
    const savedPhone = localStorage.getItem('pm_phone');
    if (savedPhone) setPhoneNumber(savedPhone);
  }, []);

  // Save phone number to localStorage
  const savePhone = () => {
    if (phoneNumber.trim() === '') return;
    localStorage.setItem('pm_phone', phoneNumber);
    alert('Phone number saved!');
  };

  // Clear phone number
  const clearPhone = () => {
    localStorage.removeItem('pm_phone');
    setPhoneNumber('');
  };

  // Toggle expand/collapse
  const toggleExpand = (id) => {
    setSelectedId(id);
    setIsExpand(id === selectedId ? !isExpand : true);
  };

  // Toggle selecting an item
  const toggleSelectItem = (item) => {
    setSelectedItems(prev =>
      prev.includes(item)
        ? prev.filter(x => x !== item)
        : [...prev, item]
    );
  };

  // Highlight search term
  const highlightText = (text, highlight) => {
    if (!highlight) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={i} className="bg-yellow-300">{part}</span>
      ) : (
        part
      )
    );
  };

  // Filter data
  const filteredData = data
    ? data.filter(item => {
        const nameMatch = item["Equipment Name"].toLowerCase().includes(searchTerm.toLowerCase());
        const pkgMatch = item["Svc Pkg"].toLowerCase().includes(searchTerm.toLowerCase());

        const details = item.ServiceDetails;
        const keys = Object.keys(details);
        const secondKey = keys[1];
        const secondValue = details[secondKey];

        const detailsMatch =
          Array.isArray(secondValue) &&
          secondValue.some(task =>
            task.toLowerCase().includes(searchTerm.toLowerCase())
          );

        return nameMatch || pkgMatch || detailsMatch;
      })
    : [];

  // WhatsApp message sending
  const sendWhatsApp = () => {
    if (!phoneNumber) {
      alert("Please enter your phone number first.");
      return;
    }

    if (selectedItems.length === 0) {
      alert("Please select at least one item.");
      return;
    }

    const msg = selectedItems
      .map((item, idx) => `${idx + 1}. ${item["Equipment Name"]} - ${item["Svc Pkg"]}`)
      .join("\n");

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      "Selected PM items:\n" + msg
    )}`;

    window.open(url, "_blank");
  };

  return (
    <div className='flex flex-col justify-center items-center max-w-[750px] mx-auto'>

      <h1 className='font-bold text-lg'>Preventive Maintenance (PM) Schedule</h1>

      <p className='font-mono text-[12px] m-2'>{filteredData.length} results found</p>

      {/* Search */}
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className='font-bold mb-4 w-full max-w-md bg-amber-50 px-4 py-2 rounded'
        placeholder='Search Equipment, Service, or Task...'
      />

      {/* Phone Input */}
      <div className="w-full max-w-md bg-gray-100 p-3 rounded mb-3">
        <p className="font-semibold mb-1">WhatsApp Number</p>
        <input
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full px-3 py-2 rounded border"
          placeholder="Enter phone number (e.g., 6591234567)"
        />
        <div className="flex gap-3 mt-2">
          <button onClick={savePhone} className="bg-green-600 text-white px-3 py-1 rounded">Save</button>
          <button onClick={clearPhone} className="bg-red-600 text-white px-3 py-1 rounded">Clear</button>
        </div>
      </div>

      {/* Send WhatsApp */}
      <button
        onClick={sendWhatsApp}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full max-w-md mb-4"
      >
        Send Selected via WhatsApp
      </button>

      {/* Data Cards */}
      {filteredData.map((item, index) => {
        const details = item.ServiceDetails;
        const keys = Object.keys(details);
        const secondKey = keys[1];
        const secondValue = details[secondKey];

        const isSelected = selectedItems.includes(item);

        return (
          <div
            key={index}
            className={`border p-4 m-2 rounded shadow-md w-full max-w-md flex flex-col 
              ${isSelected ? 'border-green-600 bg-green-50' : ''}`}
          >
            <div className="flex justify-between items-center">
              <h2 className='font-semibold'>Equipment: {highlightText(item["Equipment Name"], searchTerm)}</h2>
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleSelectItem(item)}
              />
            </div>

            <h2 className='font-semibold'>
              Service: {highlightText(item["Svc Pkg"], searchTerm)}
            </h2>

            <h2 className='font-semibold flex flex-col items-center mt-2'>
              Task
              <div
                onClick={() => toggleExpand(index)}
                className='w-full flex justify-center cursor-pointer bg-gray-500 text-white m-2 py-1 rounded'
              >
                {isExpand && selectedId === index ? 'Hide Spec' : 'View Spec'}
              </div>
            </h2>

            {isExpand && selectedId === index && Array.isArray(secondValue) && (
              <ul className='ml-4 list-disc'>
                {secondValue.map((task, idx) => (
                  <li key={idx}>{highlightText(task, searchTerm)}</li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
