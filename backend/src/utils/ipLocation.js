const axios = require('axios');

async function getLocationFromIP(ip) {
  try {
    const url = `http://ip-api.com/json/${ip}?fields=status,country,regionName,city`;
    const { data } = await axios.get(url);

    if (data.status === 'success') {
      return {
        city: data.city || null,
        state: data.regionName || null,
        country: data.country || null,
      };
    } else {
      return { city: null, state: null, country: null };
    }
  } catch (error) {
    console.error("IP location error:", error.message);
    return { city: null, state: null, country: null };
  }
}

module.exports = getLocationFromIP;
