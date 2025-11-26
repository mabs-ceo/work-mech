import React, { useState } from 'react';

export default function MobilePm({ data }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpand, setIsExpand] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Toggle expand/collapse
  const toggleExpand = (id) => {
    setSelectedId(id);
    setIsExpand(id === selectedId ? !isExpand : true);
  };

  // Highlight search term in text
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

  // Filter data by Equipment Name, Svc Pkg, or any dynamic task
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

  return (
    <div className='flex flex-col justify-center items-center max-w-[750px] mx-auto'>
      <h1 className='font-bold  text-lg'>Preventive Maintenance (PM) Schedule</h1>
<p className=' font-mono text-[12px] m-2'>{filteredData.length} results found</p>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className='font-bold mb-4 w-full max-w-md bg-amber-50 px-4 py-2 rounded'
        placeholder='Search Equipment, Service, or Task...'
      />

      {filteredData.map((item, index) => {
        const details = item.ServiceDetails;
        const keys = Object.keys(details);
        const secondKey = keys[1];  // dynamic key
        const secondValue = details[secondKey];

        return (
          <div key={index} className='border p-4 m-2 rounded shadow-md w-full max-w-md flex flex-col'>
            <h2 className='font-semibold'>
              Equipment: {highlightText(item["Equipment Name"], searchTerm)}
            </h2>
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
                  <li key={idx}>
                    {highlightText(task, searchTerm)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
