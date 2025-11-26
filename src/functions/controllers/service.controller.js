import serviceData from '../data/service.json' with { type: 'json' };




export const getservice = () => {
  return serviceData
};
export const filterservice = (x) => {
  

  // 1. Filter by Service No
 const filteredData = serviceData.filter(item => {
  return x.some(reqNo => 
    item["Service No"].toUpperCase() === reqNo.toUpperCase()
  );
});
return filteredData;

 


};



export const returnFuncReplaceSpec = () => {


 const filteredData = serviceData.filter(item => {
    const values = Object.values(item);
    const secondProp = values[1];

    // Ensure it is an array
    if (Array.isArray(secondProp)) {
      const match = secondProp.some(task =>
        task.toUpperCase().includes('replace'.toUpperCase())
      );
// 

      return match // TRUE if task matches
    }

    return false;
  });
const specs = filteredData.map(task => task['Service No'])
 

 return specs
};

