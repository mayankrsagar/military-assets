import api from './api';

// Default export for SWR pattern
export default url => api.get(url).then(res => res.data);

// Named export for equipment types
export const fetchEquipmentTypes = () => 
  api.get('/api/equipment-types').then(res => res.data);