// Cloudflare Function for HomeHarvest Property Search
// Note: This is a simplified version for demonstration
// Full functionality requires deploying the Python HomeHarvest library

export async function onRequestPost(context) {
  try {
    const { request } = context;
    
    // Parse the request body
    const body = await request.json();
    const { location, listing_type, property_type, past_days, limit, mls_only } = body;
    
    // Validate required fields
    if (!location) {
      return new Response(JSON.stringify({
        error: 'Location is required'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    }
    
    // For Cloudflare Pages demo, return mock data
    // In production, this would integrate with the HomeHarvest Python library
    const mockResults = generateMockResults(body);
    
    return new Response(JSON.stringify(mockResults), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
    
  } catch (error) {
    console.error('Search API Error:', error);
    
    return new Response(JSON.stringify({
      error: 'Internal server error occurred while searching properties'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// Handle preflight OPTIONS requests for CORS
export async function onRequestOptions(context) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    }
  });
}

function generateMockResults(searchParams) {
  const { location, listing_type, limit } = searchParams;
  const resultLimit = Math.min(parseInt(limit) || 50, 100);
  
  // Sample property data based on location
  const locationData = {
    'beverly hills': {
      priceRange: [800000, 3000000],
      city: 'Beverly Hills',
      state: 'CA',
      zip: '90210'
    },
    'manhattan': {
      priceRange: [600000, 2500000],
      city: 'Manhattan',
      state: 'NY', 
      zip: '10016'
    },
    'miami': {
      priceRange: [400000, 1500000],
      city: 'Miami',
      state: 'FL',
      zip: '33101'
    }
  };
  
  // Determine location data
  const locationKey = location.toLowerCase();
  let locData = locationData.miami; // default
  
  for (const key in locationData) {
    if (locationKey.includes(key)) {
      locData = locationData[key];
      break;
    }
  }
  
  const properties = [];
  const propertyTypes = ['Single Family', 'Condo', 'Townhome', 'Multi Family'];
  const streets = [
    'Ocean Drive', 'Park Avenue', 'Sunset Boulevard', 'Main Street',
    'Broadway', 'Fifth Avenue', 'Hollywood Boulevard', 'Wall Street'
  ];
  
  for (let i = 0; i < resultLimit; i++) {
    const basePrice = locData.priceRange[0] + Math.random() * (locData.priceRange[1] - locData.priceRange[0]);
    const beds = Math.floor(Math.random() * 4) + 1;
    const baths = Math.floor(Math.random() * 3) + 1;
    const sqft = 800 + Math.floor(Math.random() * 2200);
    
    const property = {
      property_id: `prop_${i + 1}`,
      listing_id: `list_${Date.now()}_${i}`,
      street: `${100 + i} ${streets[i % streets.length]}`,
      city: locData.city,
      state: locData.state,
      zip_code: locData.zip,
      beds: beds,
      full_baths: baths,
      half_baths: Math.random() > 0.7 ? 1 : 0,
      sqft: sqft,
      list_price: listing_type === 'for_rent' ? Math.floor(basePrice / 400) : Math.floor(basePrice),
      status: listing_type.toUpperCase(),
      style: propertyTypes[Math.floor(Math.random() * propertyTypes.length)],
      year_built: 1950 + Math.floor(Math.random() * 74),
      days_on_mls: Math.floor(Math.random() * 90),
      property_url: `https://realtor.com/property-${i + 1}`,
      mls: 'SAMPLE',
      mls_id: `MLS${1000000 + i}`,
      list_date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      agent_name: `Agent ${String.fromCharCode(65 + (i % 26))}. Smith`,
      agent_phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      broker_name: 'Sample Realty Group'
    };
    
    properties.push(property);
  }
  
  return {
    count: properties.length,
    properties: properties,
    message: `Found ${properties.length} properties`,
    columns: Object.keys(properties[0] || {}),
    csv_file: `homeharvest_${Date.now()}.csv`
  };
}