import React, { useEffect, useState } from 'react'
import { getservice } from '../functions/controllers/service.controller';

export default function Service() {
  const [serviceData, setServiceData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = serviceData.filter(item => {
    if (!item) return false;

    // Search in Service No
    const nameMatch = item["Service No"]
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Dynamic keys inside ServiceDetails
    const details = item
    const keys = Object.keys(details);

    // Example: keys = ["Service No", "Basic Inspection"]
    const dynamicKey = keys[1]; 
    const dynamicValue = details[dynamicKey];

    // Search inside task array (if exists)
    const taskMatch =
      Array.isArray(dynamicValue) &&
      dynamicValue.some(task =>
        task.toLowerCase().includes(searchTerm.toLowerCase())
      );

   
    return nameMatch || taskMatch;
  });
  const highlightText = (text, highlight) => {
    if (!highlight) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={i} className="bg-amber-300 w-max">{part}</span>
      ) : (
        part
      )
    );
  }
  useEffect(() => {
    document.title = "Service";
    const getData = async () => {
      const data = await getservice();
      setServiceData(data);
    };
    getData();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center max-w-[750px] mx-auto">
      <h1 className="text-xl font-bold">Service</h1>

      <p className='font-mono text-[12px] m-2'>
        {filteredData.length} results found
      </p>

      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className='font-bold mb-4 w-full max-w-md bg-amber-50 px-4 py-2 rounded'
        placeholder='Search Service No or Tasks...'
      />

      <div className="w-full max-w-md">
        {filteredData.map((item, index) => {
          
          const details = item || {};
          const keys = Object.keys(details);
          const dynamicKey = keys[1];
          const dynamicValue = details[dynamicKey];
  
          return (
            <div 
              key={index} 
              className='border p-3 m-2 rounded shadow-md'
            >
              <p><strong>Service No:</strong> {highlightText(item["Service No"], searchTerm)}</p>
              <p><strong>Task Group:</strong> {dynamicKey}</p>

              {dynamicValue && (
                <ul className='list-disc ml-5'>
                  {dynamicValue.map((task, i) => (
                    <li key={i}>{task}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  )
}
