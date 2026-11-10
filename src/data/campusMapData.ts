/**
 * SRM University AP Campus & Logistics Geographic Road Network Data
 * Extracted from Google Maps & OpenStreetMap for Amaravati / Mangalagiri / Chinnakakani / Vijayawada corridor.
 */

export interface LatLngPoint {
  lat: number;
  lng: number;
}

export type LatLngTuple = [number, number];

export interface OutletLocation {
  restaurantId: string;
  name: string;
  lat: number;
  lng: number;
  zone: string;
  address: string;
  rating: number;
  deliveryTime: number;
  distanceKm: number;
  cuisines: string[];
}

export interface HostelLocation {
  id: string;
  name: string;
  category: 'boys_hostel' | 'girls_hostel' | 'campus_center' | 'gate';
  lat: number;
  lng: number;
  description: string;
}

export interface RoadCorridor {
  id: string;
  name: string;
  description: string;
  color: string;
  coordinates: LatLngTuple[];
}

// SRM AP Campus Center & Hostels Coordinates
export const SRM_CAMPUS_CENTER: LatLngTuple = [16.46352, 80.50854];

export const SRM_CAMPUS_LOCATIONS: HostelLocation[] = [
  {
    id: 'srm_core',
    name: 'SRM University AP (Main Campus Core)',
    category: 'campus_center',
    lat: 16.46352,
    lng: 80.50854,
    description: 'Central Academic Block, Admin & Food Court Plaza',
  },
  {
    id: 'ganga_hostel',
    name: 'Ganga Boys Hostel',
    category: 'boys_hostel',
    lat: 16.46485,
    lng: 80.50982,
    description: 'Hostel Tier-1, Block 2 • Primary delivery dropoff gate',
  },
  {
    id: 'yamuna_hostel',
    name: 'Yamuna Girls Hostel',
    category: 'girls_hostel',
    lat: 16.46190,
    lng: 80.51025,
    description: 'Yamuna Residential Towers • Secure entry security drop point',
  },
  {
    id: 'krishna_hostel',
    name: 'Krishna Boys Hostel',
    category: 'boys_hostel',
    lat: 16.46410,
    lng: 80.50890,
    description: 'Krishna Block • North lawn courtyard entrance',
  },
  {
    id: 'sac_center',
    name: 'Student Activity Centre (SAC)',
    category: 'campus_center',
    lat: 16.46280,
    lng: 80.50760,
    description: 'Indoor sports complex, amphitheatre & student union lounge',
  },
  {
    id: 'main_gate_1',
    name: 'SRM AP Main Gate 1 (West Entrance)',
    category: 'gate',
    lat: 16.46550,
    lng: 80.50420,
    description: 'Neerukonda Main Entrance & Campus Security Checkpost',
  },
  {
    id: 'east_gate_2',
    name: 'SRM AP East Gate 2 (Kuragallu Entrance)',
    category: 'gate',
    lat: 16.46220,
    lng: 80.51200,
    description: 'Expressway access gate from Chinnakakani & Mangalagiri',
  },
];

// All 29 Partner Restaurants with Precise Geographic Coordinates
export const ALL_OUTLETS_DATA: OutletLocation[] = [
  {
    restaurantId: 'R001',
    name: 'Little Village Restaurant',
    lat: 16.45330,
    lng: 80.53650,
    zone: 'Chinnakakani / Mangalagiri Bypass',
    address: 'Opp. Y Junction Tunnel, NRI Hospitals, Bypass Service Road',
    rating: 4.8,
    deliveryTime: 20,
    distanceKm: 3.2,
    cuisines: ['Andhra', 'Potlam Biryani', 'North Indian'],
  },
  {
    restaurantId: 'R002',
    name: 'Village Kitchen Family Restaurant',
    lat: 16.44210,
    lng: 80.56120,
    zone: 'Mangalagiri / Autonagar',
    address: 'Plot CA-2, Gouthama Budha Road, near NRI General Hospital',
    rating: 4.4,
    deliveryTime: 30,
    distanceKm: 4.2,
    cuisines: ['South Indian', 'Tiffins', 'Family Meals'],
  },
  {
    restaurantId: 'R003',
    name: 'Bismillah Dum Biryani Center',
    lat: 16.43580,
    lng: 80.56410,
    zone: 'Mangalagiri Town',
    address: 'Tenali Road, Trunk Road, Mangalagiri',
    rating: 4.5,
    deliveryTime: 25,
    distanceKm: 5.1,
    cuisines: ['Dum Biryani', 'Mughlai', 'Kebabs'],
  },
  {
    restaurantId: 'R004',
    name: 'Rasa Raya Restaurant',
    lat: 16.43920,
    lng: 80.56280,
    zone: 'Mangalagiri',
    address: 'Main Road, opposite Ushodaya Supermarket',
    rating: 4.2,
    deliveryTime: 28,
    distanceKm: 4.8,
    cuisines: ['South Indian', 'Chinese', 'Thalis'],
  },
  {
    restaurantId: 'R005',
    name: 'KFC Autonagar',
    lat: 16.44450,
    lng: 80.56300,
    zone: 'Autonagar / Mangalagiri',
    address: 'CA/16, Autonagar, Mangalagiri',
    rating: 4.3,
    deliveryTime: 30,
    distanceKm: 4.5,
    cuisines: ['Burgers', 'Fried Chicken', 'Fast Food'],
  },
  {
    restaurantId: 'R006',
    name: 'Senapathi Military Hotel',
    lat: 16.41620,
    lng: 80.54150,
    zone: 'Kaza / NH16',
    address: 'NH16 Service Road, near Toll Plaza, Kaza',
    rating: 4.6,
    deliveryTime: 35,
    distanceKm: 6.8,
    cuisines: ['Military Hotel Non-Veg', 'Mutton Fry', 'Biryani'],
  },
  {
    restaurantId: 'R007',
    name: 'Burger Babai',
    lat: 16.43450,
    lng: 80.56700,
    zone: 'Mangalagiri',
    address: 'Grand Trunk Road, opposite BMW showroom',
    rating: 4.4,
    deliveryTime: 25,
    distanceKm: 5.4,
    cuisines: ['Craft Burgers', 'Fries', 'Shakes'],
  },
  {
    restaurantId: 'R008',
    name: 'meAme Cafe',
    lat: 16.45180,
    lng: 80.53820,
    zone: 'Chinnakakani',
    address: 'Gowtham Buddha Road, opposite NRI Hospital Road',
    rating: 4.7,
    deliveryTime: 20,
    distanceKm: 3.4,
    cuisines: ['Artisan Coffee', 'Pizza', 'Pasta', 'Desserts'],
  },
  {
    restaurantId: 'R009',
    name: 'The Shawarma Company Mangalagiri',
    lat: 16.43700,
    lng: 80.56200,
    zone: 'Mangalagiri',
    address: 'Opposite Alfa Restaurant, Mangalagiri',
    rating: 4.5,
    deliveryTime: 25,
    distanceKm: 5.0,
    cuisines: ['Lebanese Shawarma', 'Falafel', 'Rolls'],
  },
  {
    restaurantId: 'R010',
    name: 'Abhiruchi Family Restaurant',
    lat: 16.43850,
    lng: 80.56050,
    zone: 'Mangalagiri',
    address: 'Opposite Municipal Office, G.B. Road',
    rating: 4.3,
    deliveryTime: 30,
    distanceKm: 4.7,
    cuisines: ['Andhra Thali', 'Biryani', 'Curries'],
  },
  {
    restaurantId: 'R011',
    name: 'Zamzam Family Restaurant',
    lat: 16.43620,
    lng: 80.56150,
    zone: 'Mangalagiri',
    address: 'Main Road, Mangalagiri',
    rating: 4.4,
    deliveryTime: 30,
    distanceKm: 4.9,
    cuisines: ['Mandi', 'Arabian Biryani', 'Grilled Chicken'],
  },
  {
    restaurantId: 'R012',
    name: 'Khaja Bhai Biryani',
    lat: 16.43510,
    lng: 80.56350,
    zone: 'Mangalagiri',
    address: 'Old Bus Stand, Trunk Road',
    rating: 4.6,
    deliveryTime: 25,
    distanceKm: 5.2,
    cuisines: ['Traditional Hyderabadi Biryani', 'Kabab'],
  },
  {
    restaurantId: 'R013',
    name: 'One Stop Cafe - Food Court',
    lat: 16.44050,
    lng: 80.55800,
    zone: 'Mangalagiri / Chenetha Colony',
    address: 'Rajeev Center, opposite Narayana Junior College',
    rating: 4.2,
    deliveryTime: 25,
    distanceKm: 4.6,
    cuisines: ['Street Food', 'Momos', 'Chaat', 'Beverages'],
  },
  {
    restaurantId: 'R014',
    name: 'Biryanis and More',
    lat: 16.45450,
    lng: 80.53500,
    zone: 'Chinnakakani',
    address: 'Door No. 6-188, near NRI Hospital',
    rating: 4.5,
    deliveryTime: 20,
    distanceKm: 3.1,
    cuisines: ['Special Biryanis', 'Pulao', 'Starters'],
  },
  {
    restaurantId: 'R015',
    name: 'Besta - The Indian Kitchen',
    lat: 16.49600,
    lng: 80.65500,
    zone: 'Vijayawada / Guru Nanak Colony',
    address: 'Guru Nanak Colony Road, beside DBS Bank',
    rating: 4.6,
    deliveryTime: 40,
    distanceKm: 18.5,
    cuisines: ['North Indian', 'Gourmet Curries', 'Tandoor'],
  },
  {
    restaurantId: 'R016',
    name: 'Platform 65 The Train Theme Restaurant',
    lat: 16.49980,
    lng: 80.64720,
    zone: 'Vijayawada / Benz Circle',
    address: '2nd Floor, KBCL Building, MG Road',
    rating: 4.7,
    deliveryTime: 45,
    distanceKm: 19.2,
    cuisines: ['Multi-Cuisine', 'Train Dining Special', 'Biryani'],
  },
  {
    restaurantId: 'R017',
    name: 'Paradise Biryani',
    lat: 16.49850,
    lng: 80.64950,
    zone: 'Vijayawada / Benz Circle',
    address: 'Beside Trendset Mall, Sai Nagar, Benz Circle',
    rating: 4.5,
    deliveryTime: 45,
    distanceKm: 19.0,
    cuisines: ['Authentic Dum Biryani', 'Mirchi Ka Salan', 'Kebabs'],
  },
  {
    restaurantId: 'R018',
    name: 'United Food Palace',
    lat: 16.50100,
    lng: 80.65100,
    zone: 'Vijayawada / Benz Circle',
    address: 'Kala Nagar Road, near KFC, Benz Circle',
    rating: 4.4,
    deliveryTime: 45,
    distanceKm: 19.5,
    cuisines: ['Chinese', 'Continental', 'Indian Special'],
  },
  {
    restaurantId: 'R019',
    name: '7Seas Arabian Mandi',
    lat: 16.50420,
    lng: 80.64200,
    zone: 'Vijayawada / Labbipet',
    address: '39-9-46, Labbipet, Vijayawada',
    rating: 4.8,
    deliveryTime: 45,
    distanceKm: 20.0,
    cuisines: ['Arabian Mandi', 'Al-Faham Chicken', 'Kunafa'],
  },
  {
    restaurantId: 'R020',
    name: 'RR Durbar',
    lat: 16.50750,
    lng: 80.64450,
    zone: 'Vijayawada / Mogalrajapuram',
    address: 'Mogalrajapuram, Sidhartha Nagar, Labbipet',
    rating: 4.5,
    deliveryTime: 45,
    distanceKm: 20.4,
    cuisines: ['Royal Andhra Meals', 'Biryani', 'Starters'],
  },
  {
    restaurantId: 'R021',
    name: 'Swagramam Restaurant',
    lat: 16.50600,
    lng: 80.64300,
    zone: 'Vijayawada / Mogalrajapuram',
    address: 'Mogalrajapuram, Sidhartha Nagar, Labbipet',
    rating: 4.3,
    deliveryTime: 45,
    distanceKm: 20.2,
    cuisines: ['Traditional Andhra Pulao', 'Sweets'],
  },
  {
    restaurantId: 'R022',
    name: 'Sri Sai Mess',
    lat: 16.50520,
    lng: 80.64100,
    zone: 'Vijayawada / Labbipet',
    address: 'Tikkle Road, beside Manor Food Plaza',
    rating: 4.7,
    deliveryTime: 40,
    distanceKm: 19.8,
    cuisines: ['Unlimited Andhra Mess Meals', 'Podi Ghee Rice'],
  },
  {
    restaurantId: 'R023',
    name: 'Blue Fox',
    lat: 16.50300,
    lng: 80.64020,
    zone: 'Vijayawada / Labbipet',
    address: '40-1-1/17, Donka Road, Labbipet',
    rating: 4.4,
    deliveryTime: 45,
    distanceKm: 19.6,
    cuisines: ['Fine Dining', 'North Indian', 'Sizzlers'],
  },
  {
    restaurantId: 'R024',
    name: "Tindam (By Lalitha's)",
    lat: 16.50200,
    lng: 80.63850,
    zone: 'Vijayawada / Labbipet',
    address: 'Ground floor, D.No. 39-3-38, opposite Gurukul College',
    rating: 4.6,
    deliveryTime: 40,
    distanceKm: 19.4,
    cuisines: ['Modern Andhra Tiffins', 'Crispy Dosas', 'Combos'],
  },
  {
    restaurantId: 'R025',
    name: 'Cicely',
    lat: 16.50500,
    lng: 80.63750,
    zone: 'Vijayawada / Labbipet',
    address: 'Food Republic Lane, near Fortune Murali Park',
    rating: 4.5,
    deliveryTime: 45,
    distanceKm: 19.7,
    cuisines: ['Continental', 'Pasta', 'Espresso Cafe'],
  },
  {
    restaurantId: 'R026',
    name: 'Cafe Ice Magic',
    lat: 16.49550,
    lng: 80.65800,
    zone: 'Vijayawada / Patamata',
    address: 'Nirmala Convent Road, NTR Circle, Patamata',
    rating: 4.3,
    deliveryTime: 45,
    distanceKm: 19.8,
    cuisines: ['Gourmet Sundaes', 'Ice Cream Cakes', 'Thickshakes'],
  },
  {
    restaurantId: 'R027',
    name: 'CRAB Coffee Roasters and Bakers',
    lat: 16.49750,
    lng: 80.66200,
    zone: 'Vijayawada / LIC Colony',
    address: 'Water Tank Road, LIC Colony',
    rating: 4.7,
    deliveryTime: 45,
    distanceKm: 20.5,
    cuisines: ['Specialty Coffee', 'Bakery', 'Croissants'],
  },
  {
    restaurantId: 'R028',
    name: 'Thyme & Whisk',
    lat: 16.50150,
    lng: 80.65350,
    zone: 'Vijayawada / Benz Circle',
    address: 'NH16 Service Road, opposite Maris Stella College',
    rating: 4.6,
    deliveryTime: 45,
    distanceKm: 19.5,
    cuisines: ['Global Vegetarian', 'Woodfired Pizza', 'Pan Asian'],
  },
  {
    restaurantId: 'R029',
    name: 'Bigguys: Wings & Burgers',
    lat: 16.49400,
    lng: 80.65650,
    zone: 'Vijayawada / Guru Nanak Colony',
    address: 'Surya Prakash Square, Guru Nanak Colony',
    rating: 4.5,
    deliveryTime: 40,
    distanceKm: 18.8,
    cuisines: ['Crispy Hot Wings', 'Smash Burgers', 'Loaded Fries'],
  },
];

// Road Corridors extracted from OpenStreetMap / Google Maps road curves connecting all points to SRM AP
export const ROAD_CORRIDORS: RoadCorridor[] = [
  {
    id: 'corridor_chinnakakani',
    name: 'Chinnakakani - Kuragallu Expressway Corridor',
    description: 'Fastest 3.2km primary artery connecting NRI Hospital & Little Village to SRM AP',
    color: '#f97316', // Orange
    coordinates: [
      [16.45330, 80.53650], // Little Village
      [16.45420, 80.53480], // Bypass turn
      [16.45540, 80.53200], // Service road bridge
      [16.45680, 80.52850], // Kuragallu junction
      [16.45820, 80.52500], // Neerukonda green belt road
      [16.45950, 80.52180], // Kuragallu Lake bypass
      [16.46080, 80.51850], // Neerukonda entrance bend
      [16.46150, 80.51600], // University avenue feeder
      [16.46190, 80.51350], // East approach
      [16.46220, 80.51200], // SRM AP East approach
      [16.46280, 80.51080], // Inner avenue branch
      [16.46352, 80.50854], // SRM University AP
    ],
  },
  {
    id: 'corridor_mangalagiri',
    name: 'Mangalagiri Trunk Road Corridor',
    description: 'Town route from Mangalagiri Bus Stand & G.B. Road via Autonagar to SRM AP',
    color: '#3b82f6', // Blue
    coordinates: [
      [16.43510, 80.56350], // Mangalagiri Old Bus Stand
      [16.43700, 80.56200], // Shawarma Co
      [16.43850, 80.56050], // Abhiruchi / Municipal Office
      [16.44210, 80.56120], // Village Kitchen
      [16.44450, 80.55700], // Autonagar link
      [16.44850, 80.55100], // Mangalagiri West bypass road
      [16.45180, 80.54200], // Chinnakakani Y-Junction
      [16.45420, 80.53480], // Kuragallu approach
      [16.45680, 80.52850], // Junction
      [16.45950, 80.52180], // Lake road
      [16.46220, 80.51200], // East approach
      [16.46352, 80.50854], // SRM University AP
    ],
  },
  {
    id: 'corridor_kaza',
    name: 'NH16 Kaza Highway Corridor',
    description: 'Southern artery connecting Kaza Toll Plaza & Senapathi Military Hotel to SRM AP',
    color: '#10b981', // Emerald
    coordinates: [
      [16.41620, 80.54150], // Senapathi Military Hotel
      [16.42300, 80.54100], // NH16 Toll road
      [16.43200, 80.53980], // Kaza North exit
      [16.44200, 80.53850], // Chinnakakani South flyover
      [16.45150, 80.53750], // Y-Junction flyover underpass
      [16.45420, 80.53480], // Kuragallu feeder
      [16.45680, 80.52850], // Kuragallu junction
      [16.46080, 80.51850], // Neerukonda approach
      [16.46220, 80.51200], // East approach
      [16.46352, 80.50854], // SRM University AP
    ],
  },
  {
    id: 'corridor_vijayawada',
    name: 'Vijayawada - Kanaka Durga Varadhi - Amaravati Expressway',
    description: 'Northern express corridor crossing Krishna River connecting Benz Circle / Labbipet to SRM AP',
    color: '#8b5cf6', // Violet
    coordinates: [
      [16.50500, 80.63800], // MG Road / Labbipet
      [16.49980, 80.64720], // Benz Circle
      [16.49600, 80.65500], // Guru Nanak Colony feeder
      [16.49800, 80.62500], // Krishna Lanka approach
      [16.49800, 80.61200], // Kanaka Durga Varadhi Bridge
      [16.49100, 80.60500], // Tadepalli Entry
      [16.47800, 80.59800], // Tadepalli Bypass
      [16.46500, 80.58200], // Mangalagiri AIIMS flyover
      [16.45800, 80.56500], // Mangalagiri Bypass
      [16.45180, 80.54200], // Chinnakakani Y-Junction
      [16.45680, 80.52850], // Kuragallu Road
      [16.46150, 80.51600], // Neerukonda Avenue
      [16.46220, 80.51200], // East approach
      [16.46352, 80.50854], // SRM University AP
    ],
  },
];

/**
 * Returns an optimized delivery road route from any partner restaurant directly to SRM University AP.
 */
export function getActiveDeliveryRoute(
  restaurantId: string,
  _destinationId?: string
): LatLngTuple[] {
  const outlet = ALL_OUTLETS_DATA.find((o) => o.restaurantId === restaurantId);
  const startPoint: LatLngTuple = outlet ? [outlet.lat, outlet.lng] : [16.45330, 80.53650];
  const srmApCampusPoint: LatLngTuple = SRM_CAMPUS_CENTER;

  // Depending on the outlet's geographic zone, splice with the nearest realistic road points
  if (outlet && outlet.zone.includes('Vijayawada')) {
    return [
      startPoint,
      [16.49980, 80.64720],
      [16.49800, 80.61200],
      [16.47800, 80.59800],
      [16.45800, 80.56500],
      [16.45420, 80.53480],
      [16.45680, 80.52850],
      [16.45950, 80.52180],
      [16.46220, 80.51200],
      srmApCampusPoint,
    ];
  }

  if (outlet && outlet.zone.includes('Kaza')) {
    return [
      startPoint,
      [16.42300, 80.54100],
      [16.43500, 80.53900],
      [16.45150, 80.53750],
      [16.45420, 80.53480],
      [16.45680, 80.52850],
      [16.45950, 80.52180],
      [16.46220, 80.51200],
      srmApCampusPoint,
    ];
  }

  if (outlet && (outlet.zone.includes('Mangalagiri') || outlet.zone.includes('Autonagar'))) {
    return [
      startPoint,
      [16.43920, 80.56050],
      [16.44450, 80.55700],
      [16.45180, 80.54200],
      [16.45420, 80.53480],
      [16.45680, 80.52850],
      [16.45950, 80.52180],
      [16.46220, 80.51200],
      srmApCampusPoint,
    ];
  }

  // Default: Chinnakakani / Little Village corridor
  return [
    startPoint,
    [16.45420, 80.53480],
    [16.45680, 80.52850],
    [16.45820, 80.52500],
    [16.45950, 80.52180],
    [16.46150, 80.51600],
    [16.46220, 80.51200],
    srmApCampusPoint,
  ];
}

