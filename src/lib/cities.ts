export interface City {
  name: string;
  state: string;
  lat: number;
  lng: number;
  zoom: number;
}

// At least one major city from every Indian state and union territory
export const CITIES: City[] = [
  // Andhra Pradesh
  { name: "Visakhapatnam", state: "Andhra Pradesh", lat: 17.6868, lng: 83.2185, zoom: 13 },
  { name: "Vijayawada", state: "Andhra Pradesh", lat: 16.5062, lng: 80.648, zoom: 13 },
  { name: "Tirupati", state: "Andhra Pradesh", lat: 13.6288, lng: 79.4192, zoom: 13 },
  { name: "Guntur", state: "Andhra Pradesh", lat: 16.3067, lng: 80.4365, zoom: 13 },

  // Arunachal Pradesh
  { name: "Itanagar", state: "Arunachal Pradesh", lat: 27.0844, lng: 93.6053, zoom: 14 },

  // Assam
  { name: "Guwahati", state: "Assam", lat: 26.1445, lng: 91.7362, zoom: 13 },
  { name: "Dibrugarh", state: "Assam", lat: 27.4728, lng: 94.912, zoom: 14 },

  // Bihar
  { name: "Patna", state: "Bihar", lat: 25.6093, lng: 85.1376, zoom: 13 },
  { name: "Gaya", state: "Bihar", lat: 24.7955, lng: 84.9994, zoom: 14 },

  // Chhattisgarh
  { name: "Raipur", state: "Chhattisgarh", lat: 21.2514, lng: 81.6296, zoom: 13 },
  { name: "Bilaspur", state: "Chhattisgarh", lat: 22.0797, lng: 82.1409, zoom: 14 },

  // Delhi (UT)
  { name: "New Delhi", state: "Delhi", lat: 28.6139, lng: 77.209, zoom: 12 },

  // Goa
  { name: "Panaji", state: "Goa", lat: 15.4909, lng: 73.8278, zoom: 14 },
  { name: "Margao", state: "Goa", lat: 15.2832, lng: 73.9862, zoom: 14 },

  // Gujarat
  { name: "Ahmedabad", state: "Gujarat", lat: 23.0225, lng: 72.5714, zoom: 12 },
  { name: "Surat", state: "Gujarat", lat: 21.1702, lng: 72.8311, zoom: 13 },
  { name: "Vadodara", state: "Gujarat", lat: 22.3072, lng: 73.1812, zoom: 13 },
  { name: "Rajkot", state: "Gujarat", lat: 22.3039, lng: 70.8022, zoom: 13 },
  { name: "Gandhinagar", state: "Gujarat", lat: 23.2156, lng: 72.6369, zoom: 13 },

  // Haryana
  { name: "Gurugram", state: "Haryana", lat: 28.4595, lng: 77.0266, zoom: 13 },
  { name: "Faridabad", state: "Haryana", lat: 28.4089, lng: 77.3178, zoom: 13 },
  { name: "Ambala", state: "Haryana", lat: 30.378, lng: 76.7767, zoom: 14 },

  // Himachal Pradesh
  { name: "Shimla", state: "Himachal Pradesh", lat: 31.1048, lng: 77.1734, zoom: 14 },
  { name: "Manali", state: "Himachal Pradesh", lat: 32.2396, lng: 77.1887, zoom: 14 },
  { name: "Dharamshala", state: "Himachal Pradesh", lat: 32.219, lng: 76.3234, zoom: 14 },

  // Jharkhand
  { name: "Ranchi", state: "Jharkhand", lat: 23.3441, lng: 85.3096, zoom: 13 },
  { name: "Jamshedpur", state: "Jharkhand", lat: 22.8046, lng: 86.2029, zoom: 13 },

  // Karnataka
  { name: "Bangalore", state: "Karnataka", lat: 12.9716, lng: 77.5946, zoom: 12 },
  { name: "Mysore", state: "Karnataka", lat: 12.2958, lng: 76.6394, zoom: 13 },
  { name: "Mangalore", state: "Karnataka", lat: 12.9141, lng: 74.856, zoom: 13 },
  { name: "Hubli", state: "Karnataka", lat: 15.3647, lng: 75.124, zoom: 13 },

  // Kerala
  { name: "Thiruvananthapuram", state: "Kerala", lat: 8.5241, lng: 76.9366, zoom: 13 },
  { name: "Kochi", state: "Kerala", lat: 9.9312, lng: 76.2673, zoom: 13 },
  { name: "Kozhikode", state: "Kerala", lat: 11.2588, lng: 75.7804, zoom: 13 },
  { name: "Thrissur", state: "Kerala", lat: 10.5276, lng: 76.2144, zoom: 14 },

  // Madhya Pradesh
  { name: "Bhopal", state: "Madhya Pradesh", lat: 23.2599, lng: 77.4126, zoom: 13 },
  { name: "Indore", state: "Madhya Pradesh", lat: 22.7196, lng: 75.8577, zoom: 13 },
  { name: "Jabalpur", state: "Madhya Pradesh", lat: 23.1815, lng: 79.9864, zoom: 13 },
  { name: "Gwalior", state: "Madhya Pradesh", lat: 26.2183, lng: 78.1828, zoom: 13 },

  // Maharashtra
  { name: "Mumbai", state: "Maharashtra", lat: 19.076, lng: 72.8777, zoom: 12 },
  { name: "Pune", state: "Maharashtra", lat: 18.5204, lng: 73.8567, zoom: 12 },
  { name: "Nagpur", state: "Maharashtra", lat: 21.1458, lng: 79.0882, zoom: 13 },
  { name: "Nashik", state: "Maharashtra", lat: 19.9975, lng: 73.7898, zoom: 13 },
  { name: "Aurangabad", state: "Maharashtra", lat: 19.8762, lng: 75.3433, zoom: 13 },
  { name: "Thane", state: "Maharashtra", lat: 19.2183, lng: 72.9781, zoom: 13 },
  { name: "Navi Mumbai", state: "Maharashtra", lat: 19.033, lng: 73.0297, zoom: 13 },

  // Manipur
  { name: "Imphal", state: "Manipur", lat: 24.817, lng: 93.9368, zoom: 14 },

  // Meghalaya
  { name: "Shillong", state: "Meghalaya", lat: 25.5788, lng: 91.8933, zoom: 14 },

  // Mizoram
  { name: "Aizawl", state: "Mizoram", lat: 23.7271, lng: 92.7176, zoom: 14 },

  // Nagaland
  { name: "Kohima", state: "Nagaland", lat: 25.6751, lng: 94.1086, zoom: 14 },
  { name: "Dimapur", state: "Nagaland", lat: 25.7069, lng: 93.7273, zoom: 14 },

  // Odisha
  { name: "Bhubaneswar", state: "Odisha", lat: 20.2961, lng: 85.8245, zoom: 13 },
  { name: "Cuttack", state: "Odisha", lat: 20.4625, lng: 85.883, zoom: 13 },
  { name: "Puri", state: "Odisha", lat: 19.8135, lng: 85.8312, zoom: 14 },

  // Punjab
  { name: "Ludhiana", state: "Punjab", lat: 30.901, lng: 75.8573, zoom: 13 },
  { name: "Amritsar", state: "Punjab", lat: 31.634, lng: 74.8723, zoom: 13 },
  { name: "Jalandhar", state: "Punjab", lat: 31.326, lng: 75.5762, zoom: 13 },

  // Rajasthan
  { name: "Jaipur", state: "Rajasthan", lat: 26.9124, lng: 75.7873, zoom: 12 },
  { name: "Jodhpur", state: "Rajasthan", lat: 26.2389, lng: 73.0243, zoom: 13 },
  { name: "Udaipur", state: "Rajasthan", lat: 24.5854, lng: 73.7125, zoom: 13 },
  { name: "Kota", state: "Rajasthan", lat: 25.2138, lng: 75.8648, zoom: 13 },
  { name: "Ajmer", state: "Rajasthan", lat: 26.4499, lng: 74.6399, zoom: 14 },

  // Sikkim
  { name: "Gangtok", state: "Sikkim", lat: 27.3389, lng: 88.6065, zoom: 14 },

  // Tamil Nadu
  { name: "Chennai", state: "Tamil Nadu", lat: 13.0827, lng: 80.2707, zoom: 12 },
  { name: "Coimbatore", state: "Tamil Nadu", lat: 11.0168, lng: 76.9558, zoom: 13 },
  { name: "Madurai", state: "Tamil Nadu", lat: 9.9252, lng: 78.1198, zoom: 13 },
  { name: "Tiruchirappalli", state: "Tamil Nadu", lat: 10.7905, lng: 78.7047, zoom: 13 },
  { name: "Salem", state: "Tamil Nadu", lat: 11.6643, lng: 78.146, zoom: 13 },

  // Telangana
  { name: "Hyderabad", state: "Telangana", lat: 17.385, lng: 78.4867, zoom: 12 },
  { name: "Warangal", state: "Telangana", lat: 17.9784, lng: 79.5941, zoom: 13 },

  // Tripura
  { name: "Agartala", state: "Tripura", lat: 23.8315, lng: 91.2868, zoom: 14 },

  // Uttar Pradesh
  { name: "Lucknow", state: "Uttar Pradesh", lat: 26.8467, lng: 80.9462, zoom: 12 },
  { name: "Varanasi", state: "Uttar Pradesh", lat: 25.3176, lng: 82.9739, zoom: 13 },
  { name: "Kanpur", state: "Uttar Pradesh", lat: 26.4499, lng: 80.3319, zoom: 13 },
  { name: "Agra", state: "Uttar Pradesh", lat: 27.1767, lng: 78.0081, zoom: 13 },
  { name: "Noida", state: "Uttar Pradesh", lat: 28.5355, lng: 77.391, zoom: 13 },
  { name: "Prayagraj", state: "Uttar Pradesh", lat: 25.4358, lng: 81.8463, zoom: 13 },

  // Uttarakhand
  { name: "Dehradun", state: "Uttarakhand", lat: 30.3165, lng: 78.0322, zoom: 13 },
  { name: "Haridwar", state: "Uttarakhand", lat: 29.9457, lng: 78.1642, zoom: 14 },
  { name: "Rishikesh", state: "Uttarakhand", lat: 30.0869, lng: 78.2676, zoom: 14 },

  // West Bengal
  { name: "Kolkata", state: "West Bengal", lat: 22.5726, lng: 88.3639, zoom: 12 },
  { name: "Siliguri", state: "West Bengal", lat: 26.7271, lng: 88.3953, zoom: 13 },
  { name: "Durgapur", state: "West Bengal", lat: 23.5204, lng: 87.3119, zoom: 14 },

  // --- Union Territories ---

  // Andaman and Nicobar Islands
  { name: "Port Blair", state: "Andaman & Nicobar", lat: 11.6234, lng: 92.7265, zoom: 13 },

  // Chandigarh
  { name: "Chandigarh", state: "Chandigarh", lat: 30.7333, lng: 76.7794, zoom: 13 },

  // Dadra and Nagar Haveli and Daman and Diu
  { name: "Daman", state: "Dadra & Nagar Haveli and Daman & Diu", lat: 20.397, lng: 72.8328, zoom: 14 },
  { name: "Silvassa", state: "Dadra & Nagar Haveli and Daman & Diu", lat: 20.2766, lng: 73.0169, zoom: 14 },

  // Jammu & Kashmir
  { name: "Srinagar", state: "Jammu & Kashmir", lat: 34.0837, lng: 74.7973, zoom: 13 },
  { name: "Jammu", state: "Jammu & Kashmir", lat: 32.7266, lng: 74.857, zoom: 13 },

  // Ladakh
  { name: "Leh", state: "Ladakh", lat: 34.1526, lng: 77.5771, zoom: 14 },

  // Lakshadweep
  { name: "Kavaratti", state: "Lakshadweep", lat: 10.5593, lng: 72.642, zoom: 15 },

  // Puducherry
  { name: "Puducherry", state: "Puducherry", lat: 11.9416, lng: 79.8083, zoom: 14 },
];

// Get unique states sorted alphabetically
export const STATES = [...new Set(CITIES.map((c) => c.state))].sort();

// Group cities by state
export function getCitiesByState(): Record<string, City[]> {
  const grouped: Record<string, City[]> = {};
  for (const city of CITIES) {
    if (!grouped[city.state]) grouped[city.state] = [];
    grouped[city.state].push(city);
  }
  return grouped;
}
