import fsorData from '../data/fsor.json' with { type: 'json' };




export const getfsor = (x) => {
      const q = x;
      if (q) {
    const category = q;
    const filteredByCategory = fsorData.filter(item => item.Item.toLowerCase().includes(category.toLowerCase()) || item["Long Description"].toLowerCase().includes(category.toLowerCase()) || item["Unit of Measure"].toLowerCase().includes(category.toLowerCase()));
    return filteredByCategory
  }
  return fsorData;
};
