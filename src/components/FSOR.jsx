import React, { useEffect, useState } from 'react'
import { getfsor } from '../functions/controllers/fsor.controller';

export default function FSOR() {
const [fsorData, setFsorData] = useState(null);
const [searchTerm, setSearchTerm] = useState('');

 

const filteredData = fsorData
    ? fsorData.filter(item => 
        item.Item.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item["Long Description"].toLowerCase().includes(searchTerm.toLowerCase()) ||
        item["Unit of Measure"].toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];


      // Highlight search term in text
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
  };
  // {highlightText(item["Equipment Name"], searchTerm)}
  useEffect(() => {
    document.title = "FSOR"
const fsorData = getfsor()
setFsorData(fsorData);

  }, []);
  return (
    <div className='flex flex-col justify-center items-center max-w-[750px] mx-auto'>
      <h1 className='m-2'>FSOR</h1>
     <input 
       value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
     type="text" 
      className='font-bold mb-4 w-full max-w-md bg-amber-50 px-4 py-2 rounded'
        placeholder='Search Description  or U.O.M ...'
     />
        {filteredData ? <div>
          <div className=' flex justify-center font-mono text-[12px]'>

          formData loaded with {filteredData.length} items.
          </div>
           {filteredData?.map((item, index) => (
            <div key={index} className="border border-2-black   flex flex-col justify-center items-center gap-2 mb-2 ">
              <div className=' flex  justify-between items-center bg-blue-200 p-2 rounded w-full'>

              <p><strong>Item:</strong> {item.Item}</p>
             
              <p><strong>Cost:</strong> $ {item["Rate ($)"]}</p>
              <p><strong>Unit of Measure:</strong> {highlightText(item["Unit of Measure"], searchTerm)}</p>
              </div>
            
             <p className='flex flex-col m-2'><strong>Long Description:</strong> {highlightText(item["Long Description"], searchTerm)}</p>
            </div>
          ))}
        </div> : 'Loading...'}
    </div>
  )
}
