import EquipmentData from '../data/equipment.json' with { type: 'json' };

const monthYear = [    
"Nov-25",
"Dec-25",
"Jan-26",
"Feb-26",
"Mar-26",
"Apr-26",
"May-26",
"Jun-26",
"Jul-26",
"Aug-26",
"Sep-26",
"Oct-26",
"Nov-26",
"Dec-26",
"Jan-27",
"Feb-27",
"Mar-27",
"Apr-27",
"May-27",
"Jun-27",
"Jul-27",
"Aug-27",
"Sep-27",
"Oct-27",
"Nov-27",
"Dec-27",
"Jan-28",
"Feb-28",
"Mar-28",
"Apr-28",
"May-28",
"Jun-28",
"Jul-28",
"Aug-28",
"Sep-28",
"Oct-28"
]

export const getEquipment = (q) => {
     
     if (q) {
    const category = q;
    const filteredByCategory = EquipmentData.filter(item => item['Equipment Name'].toLowerCase().includes(category.toLowerCase()));
    return res.status(200).json({message:'Equipment route is working',data:filteredByCategory});
  }
 
  
  return EquipmentData
};
export const getCurrentMonthEquipment = async (q) => {
  try {
    // Build current month-year like May-25
    const date = new Date();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear().toString().slice(-2);
    const currentMonthYear = `${month}-${year}`;

    

    // Filter equipment by current month schedule
    const pm = EquipmentData.filter(
      item => String(item['Scheduled Months']).includes(currentMonthYear)
    );
   
    const spec = pm.map(
      item => item['Svc Pkg']
    );
 
    // Get replacement spec list




   
    // Search by equipment name
    if (q) {
      const filteredByCategory = pm.filter(item =>
        item['Equipment Name'].toLowerCase().includes(q.toLowerCase())
      );

      return filteredByCategory
      
    }

    // Return full dataset
    return {  pm, spec}; 

  } catch (error) {
    return error

  }
};

export const getMonthlyEquipment = async(req, res) => {
 const monthyear = req.params.monthyear;

 if (!monthYear.includes(monthyear)) {
   return res.status(400).json({ message: 'Invalid monthyear parameter' });
 }
 const filterservice = EquipmentData.filter(item => item['Scheduled Months'].includes(monthyear));


 //

    res.status(200).json({message:'Equipment route is working',data:filterservice});
};
