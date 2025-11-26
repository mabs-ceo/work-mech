import React from 'react'

import {getCurrentMonthEquipment} from '../functions/controllers/equipment.controller.js'
import { useState } from 'react';
import { useEffect } from 'react';
import MobilePm from './Screen/MobilePm';

import { filterservice } from '../functions/controllers/service.controller.js';

export default function PM() {
    const [data, setData] = useState(null);
    const isMobile = window.innerWidth <= 768;
    useEffect(() => {
     const pmData = async () => {
       const {pm ,spec} = await getCurrentMonthEquipment();
       const data =  filterservice(spec);
     
     const editedPM = pm.map(item => {
        const serviceInfo = data.find(service => service['Service No'] === item['Svc Pkg']);
        return {
          ...item,
          ServiceDetails: serviceInfo || {}
        };
      });
     
       
       setData(editedPM);
    
     };
     pmData();
      }, []);
useEffect(() => {
    const handleResize = () => {
      window.location.reload();
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [ isMobile]);
  return <MobilePm data={data} /> 
   
    
 
}
