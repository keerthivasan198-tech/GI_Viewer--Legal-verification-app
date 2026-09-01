import { ToolItem } from '../types';

export const TOOLS_LIST: ToolItem[] = [
  {
    id: 'ec',
    title: 'Online EC (Encumbrance Certificate)',
    description: 'Verify property encumbrance records, title ownership history, and registration details online.',
    path: '/tools/ec',
    category: 'verification',
    iconName: 'FileCheck',
    imageUrl: '/assets/tools/ec_cover.jpg',
    badge: 'Popular',
    imageBanner: '/images/tools/ec_infographic.jpg',
    cardImage: '/images/tools_cards/card_1.png'
  },
  {
    id: 'cersai',
    title: 'CERSAI Check',
    description: 'Check if a property is already mortgaged or pledged to any bank/financial institution.',
    path: '/tools/cersai',
    category: 'verification',
    iconName: 'Building2',
    imageUrl: '/assets/tools/cersai_cover.jpg',
    imageBanner: '/images/tools/cersai_infographic.jpg',
    cardImage: '/images/tools_cards/card_2.png'
  },
  {
    id: 'court-case',
    title: 'Court Case Search',
    description: 'Check litigation history and court cases by Party Name, Revenue Court, or CNR Number.',
    path: '/tools/court-case',
    category: 'search',
    iconName: 'Scale',
    imageUrl: '/assets/tools/court_case_cover.jpg',
    badge: 'Litigation Check',
    imageBanner: '/images/tools/court_case_infographic.jpg',
    cardImage: '/images/tools_cards/card_3.png'
  },
  {
    id: 'guideline-value',
    title: 'Guideline Value',
    description: 'Search official government guideline values for land & properties across Tamil Nadu zones.',
    path: '/tools/guideline-value',
    category: 'valuation',
    iconName: 'TrendingUp',
    imageUrl: '/assets/tools/guideline_value_cover.jpg',
    imageBanner: '/images/tools/guideline_value_infographic.jpg',
    cardImage: '/images/tools_cards/card_4.png'
  },
  {
    id: 'composite-value',
    title: 'Apartment Composite Value',
    description: 'Calculate and search combined guideline values for apartments, flats & multi-story units.',
    path: '/tools/composite-value',
    category: 'valuation',
    iconName: 'Layers',
    imageUrl: '/assets/tools/composite_value_cover.jpg',
    imageBanner: '/images/tools/composite_value_infographic.jpg',
    cardImage: '/images/tools_cards/card_5.png'
  },
  {
    id: 'temple-property',
    title: 'Temple Property Check',
    description: 'Search and verify HR&CE Hindu Religious & Charitable Endowment temple land records.',
    path: '/tools/temple-property',
    category: 'verification',
    iconName: 'Landmark',
    imageUrl: '/assets/tools/temple_property_cover.jpg',
    imageBanner: '/images/tools/temple_property_infographic.jpg',
    cardImage: '/images/tools_cards/card_6.png'
  },
  {
    id: 'waqf-property',
    title: 'WAQF Property Check',
    description: 'Verify WAQF Board registered property list and prevent illegal transactions on WAQF lands.',
    path: '/tools/waqf-property',
    category: 'verification',
    iconName: 'ShieldAlert',
    imageUrl: '/assets/tools/waqf_property_cover.jpg',
    imageBanner: '/images/tools/waqf_property_infographic.jpg',
    cardImage: '/images/tools_cards/card_7.png'
  },
  {
    id: 'stamp-duty',
    title: 'Stamp Duty & Registration Fees Calculator',
    description: 'Instant calculation of government stamp duty and registration fees for property conveyances.',
    path: '/tools/stamp-duty',
    category: 'utilities',
    iconName: 'Calculator',
    imageUrl: '/assets/tools/stamp_duty_cover.jpg',
    imageBanner: '/images/tools/stamp_duty_infographic.jpg',
    cardImage: '/images/tools_cards/card_8.png'
  },
  {
    id: 'find-sro',
    title: 'Find Your SRO',
    description: 'Locate your designated Sub Registrar Office (SRO) by interactive map or village hierarchy.',
    path: '/tools/find-sro',
    category: 'search',
    iconName: 'MapPin',
    imageUrl: '/assets/tools/sro_finder_cover.jpg',
    imageBanner: '/images/tools/sro_finder_infographic.jpg',
    cardImage: '/images/tools_cards/card_9.png'
  },
  {
    id: 'forms',
    title: 'Forms & Templates',
    description: 'Download standard legal deed formats, sale agreements, power of attorney, and CMDA forms.',
    path: '/tools/forms',
    category: 'utilities',
    iconName: 'FileText',
    imageUrl: '/assets/tools/forms_templates_cover.jpg',
    imageBanner: '/images/tools/forms_templates_infographic.jpg',
    cardImage: '/images/tools_cards/card_10.png'
  },
  {
    id: 'building-value',
    title: 'Building Value Calculator',
    description: 'Calculate structural building valuation based on official PWD plinth area rates & depreciation.',
    path: '/tools/building-value',
    category: 'valuation',
    iconName: 'Home',
    imageUrl: '/assets/tools/building_value_cover.jpg',
    imageBanner: '/images/tools/building_value_infographic.jpg',
    cardImage: '/images/tools_cards/card_11.png'
  },
  {
    id: 'survey-number',
    title: 'Survey Number Finder',
    description: 'Identify land survey numbers, sub-division details, and FMB sketches on interactive map.',
    path: '/tools/survey-number',
    category: 'search',
    iconName: 'Search',
    imageUrl: '/assets/tools/survey_number_cover.jpg',
    imageBanner: '/images/tools/survey_number_infographic.jpg',
    cardImage: '/images/tools_cards/card_12.png'
  }
];

// Official 9 Registration Zones of Tamil Nadu (Tnreginet)
export const MOCK_ZONES = [
  { value: 'chennai', label: 'Chennai Zone' },
  { value: 'coimbatore', label: 'Coimbatore Zone' },
  { value: 'cuddalore', label: 'Cuddalore Zone' },
  { value: 'madurai', label: 'Madurai Zone' },
  { value: 'ramanathapuram', label: 'Ramanathapuram Zone' },
  { value: 'salem', label: 'Salem Zone' },
  { value: 'trichy', label: 'Tiruchirappalli (Trichy) Zone' },
  { value: 'tirunelveli', label: 'Tirunelveli Zone' },
  { value: 'thanjavur', label: 'Thanjavur Zone' },
  { value: 'vellore', label: 'Vellore Zone' }
];

export const TAMIL_NADU_DISTRICTS = [
  { value: 'ariyalur', label: 'Ariyalur' },
  { value: 'chengalpattu', label: 'Chengalpattu' },
  { value: 'chennai', label: 'Chennai' },
  { value: 'coimbatore', label: 'Coimbatore' },
  { value: 'cuddalore', label: 'Cuddalore' },
  { value: 'dharmapuri', label: 'Dharmapuri' },
  { value: 'dindigul', label: 'Dindigul' },
  { value: 'erode', label: 'Erode' },
  { value: 'kallakurichi', label: 'Kallakurichi' },
  { value: 'kanchipuram', label: 'Kanchipuram' },
  { value: 'kanyakumari', label: 'Kanyakumari' },
  { value: 'karur', label: 'Karur' },
  { value: 'krishnagiri', label: 'Krishnagiri' },
  { value: 'madurai', label: 'Madurai' },
  { value: 'mayiladuthurai', label: 'Mayiladuthurai' },
  { value: 'nagapattinam', label: 'Nagapattinam' },
  { value: 'namakkal', label: 'Namakkal' },
  { value: 'nilgiris', label: 'Nilgiris (Ooty)' },
  { value: 'perambalur', label: 'Perambalur' },
  { value: 'pudukkottai', label: 'Pudukkottai' },
  { value: 'ramanathapuram', label: 'Ramanathapuram' },
  { value: 'ranipet', label: 'Ranipet' },
  { value: 'salem', label: 'Salem' },
  { value: 'sivaganga', label: 'Sivaganga' },
  { value: 'tenkasi', label: 'Tenkasi' },
  { value: 'thanjavur', label: 'Thanjavur' },
  { value: 'theni', label: 'Theni' },
  { value: 'thoothukudi', label: 'Thoothukudi (Tuticorin)' },
  { value: 'tiruchirappalli', label: 'Tiruchirappalli (Trichy)' },
  { value: 'tirunelveli', label: 'Tirunelveli' },
  { value: 'tirupathur', label: 'Tirupathur' },
  { value: 'tiruppur', label: 'Tiruppur' },
  { value: 'tiruvallur', label: 'Tiruvallur' },
  { value: 'tiruvannamalai', label: 'Tiruvannamalai' },
  { value: 'tiruvarur', label: 'Tiruvarur' },
  { value: 'vellore', label: 'Vellore' },
  { value: 'viluppuram', label: 'Viluppuram' },
  { value: 'virudhunagar', label: 'Virudhunagar' }
];

// Exact Registration Districts per Zone according to Tnreginet
export const MOCK_DISTRICTS: Record<string, { value: string; label: string }[]> = {
  chennai: [
    { value: 'chennai_central', label: 'Chennai Central' },
    { value: 'chennai_south', label: 'Chennai South' },
    { value: 'chennai_north', label: 'Chennai North' },
    { value: 'chengalpattu', label: 'Chengalpattu' },
    { value: 'kanchipuram', label: 'Kanchipuram' },
    { value: 'tiruvallur', label: 'Tiruvallur' }
  ],
  coimbatore: [
    { value: 'coimbatore', label: 'Coimbatore' },
    { value: 'tiruppur', label: 'Tiruppur' },
    { value: 'erode', label: 'Erode' },
    { value: 'gobichettipalayam', label: 'Gobichettipalayam' },
    { value: 'karur', label: 'Karur' },
    { value: 'nilgiris', label: 'Nilgiris (Ooty)' }
  ],
  cuddalore: [
    { value: 'cuddalore', label: 'Cuddalore' },
    { value: 'chidambaram', label: 'Chidambaram' },
    { value: 'kallakurichi', label: 'Kallakurichi' },
    { value: 'tiruvannamalai', label: 'Tiruvannamalai' },
    { value: 'villupuram', label: 'Villupuram' }
  ],
  madurai: [
    { value: 'madurai', label: 'Madurai' },
    { value: 'dindigul', label: 'Dindigul' },
    { value: 'karaikudi', label: 'Karaikudi' },
    { value: 'palayamkottai', label: 'Palayamkottai' },
    { value: 'periyakulam', label: 'Periyakulam (Theni)' },
    { value: 'virudhunagar', label: 'Virudhunagar' }
  ],
  ramanathapuram: [
    { value: 'ramanathapuram', label: 'Ramanathapuram' },
    { value: 'sivaganga', label: 'Sivaganga' }
  ],
  salem: [
    { value: 'salem', label: 'Salem' },
    { value: 'dharmapuri', label: 'Dharmapuri' },
    { value: 'krishnagiri', label: 'Krishnagiri' },
    { value: 'namakkal', label: 'Namakkal' }
  ],
  trichy: [
    { value: 'trichy', label: 'Tiruchirappalli' },
    { value: 'ariyalur', label: 'Ariyalur' },
    { value: 'pudukkottai', label: 'Pudukkottai' }
  ],
  tirunelveli: [
    { value: 'tirunelveli', label: 'Tirunelveli' },
    { value: 'tenkasi', label: 'Tenkasi' },
    { value: 'thoothukudi', label: 'Thoothukudi (Tuticorin)' },
    { value: 'kanyakumari', label: 'Kanyakumari (Nagercoil)' }
  ],
  thanjavur: [
    { value: 'thanjavur', label: 'Thanjavur' },
    { value: 'nagapattinam', label: 'Nagapattinam' },
    { value: 'mayiladuthurai', label: 'Mayiladuthurai' },
    { value: 'tiruvarur', label: 'Tiruvarur' }
  ],
  vellore: [
    { value: 'vellore', label: 'Vellore' },
    { value: 'ranipet', label: 'Ranipet' },
    { value: 'tirupathur', label: 'Tirupathur' },
    { value: 'cheyyar', label: 'Cheyyar' }
  ]
};

// Sub-Registrar Offices (SRO) per Registration District
export const MOCK_SROS: Record<string, { value: string; label: string }[]> = {
  chennai_central: [
    { value: 't_nagar', label: 'T. Nagar SRO' },
    { value: 'mylapore', label: 'Mylapore SRO' },
    { value: 'triplicane', label: 'Triplicane SRO' },
    { value: 'kodambakkam', label: 'Kodambakkam SRO' },
    { value: 'egmore', label: 'Egmore SRO' },
    { value: 'royapettah', label: 'Royapettah SRO' },
    { value: 'purasawalkam', label: 'Purasawalkam SRO' },
    { value: 'ashok_nagar', label: 'Ashok Nagar SRO' },
    { value: 'anna_nagar', label: 'Anna Nagar SRO' },
    { value: 'sowcarpet', label: 'Sowcarpet SRO' }
  ],
  chennai_south: [
    { value: 'adyar', label: 'Adyar SRO' },
    { value: 'velachery', label: 'Velachery SRO' },
    { value: 'tambaram', label: 'Tambaram SRO' },
    { value: 'neelankarai', label: 'Neelankarai SRO' },
    { value: 'chromepet', label: 'Chromepet SRO' },
    { value: 'pallavaram', label: 'Pallavaram SRO' },
    { value: 'alandur', label: 'Alandur SRO' },
    { value: 'virugambakkam', label: 'Virugambakkam SRO' },
    { value: 'guduvancheri', label: 'Guduvancheri SRO' }
  ],
  chennai_north: [
    { value: 'ambattur', label: 'Ambattur SRO' },
    { value: 'royapuram', label: 'Royapuram SRO' },
    { value: 'thiruvottiyur', label: 'Thiruvottiyur SRO' },
    { value: 'redhills', label: 'Red Hills SRO' },
    { value: 'ponneri', label: 'Ponneri SRO' },
    { value: 'gummidipoondi', label: 'Gummidipoondi SRO' },
    { value: 'madhavaram', label: 'Madhavaram SRO' }
  ],
  chengalpattu: [
    { value: 'chengalpattu_joint_1', label: 'Chengalpattu Joint I SRO' },
    { value: 'chengalpattu_joint_2', label: 'Chengalpattu Joint II SRO' },
    { value: 'maraimalai_nagar', label: 'Maraimalai Nagar SRO' },
    { value: 'maduranthakam', label: 'Maduranthakam SRO' },
    { value: 'tirukalukundram', label: 'Tirukalukundram SRO' },
    { value: 'tiruporur', label: 'Tiruporur SRO' },
    { value: 'cheyyur', label: 'Cheyyur SRO' }
  ],
  kanchipuram: [
    { value: 'kanchipuram_joint_1', label: 'Kanchipuram Joint I SRO' },
    { value: 'kanchipuram_joint_2', label: 'Kanchipuram Joint II SRO' },
    { value: 'sriperumbudur', label: 'Sriperumbudur SRO' },
    { value: 'walajabad', label: 'Walajabad SRO' },
    { value: 'sunguvarchatram', label: 'Sunguvarchatram SRO' },
    { value: 'uthiramerur', label: 'Uthiramerur SRO' }
  ],
  tiruvallur: [
    { value: 'tiruvallur_joint_1', label: 'Tiruvallur Joint I SRO' },
    { value: 'tiruvallur_joint_2', label: 'Tiruvallur Joint II SRO' },
    { value: 'avadi', label: 'Avadi SRO' },
    { value: 'poonamallee', label: 'Poonamallee SRO' },
    { value: 'thiruthani', label: 'Thiruthani SRO' },
    { value: 'uthukottai', label: 'Uthukottai SRO' }
  ],
  coimbatore: [
    { value: 'coimbatore_joint_1', label: 'Coimbatore Joint I SRO' },
    { value: 'coimbatore_joint_2', label: 'Coimbatore Joint II SRO' },
    { value: 'gandhipuram', label: 'Gandhipuram SRO' },
    { value: 'peelamedu', label: 'Peelamedu SRO' },
    { value: 'singanallur', label: 'Singanallur SRO' },
    { value: 'perianaickenpalayam', label: 'Perianaickenpalayam SRO' },
    { value: 'ganapathy', label: 'Ganapathy SRO' },
    { value: 'thondamuthur', label: 'Thondamuthur SRO' },
    { value: 'madukkarai', label: 'Madukkarai SRO' },
    { value: 'kinathukadavu', label: 'Kinathukadavu SRO' },
    { value: 'pollachi_joint_1', label: 'Pollachi Joint I SRO' },
    { value: 'pollachi_joint_2', label: 'Pollachi Joint II SRO' },
    { value: 'anamalai', label: 'Anamalai SRO' }
  ],
  tiruppur: [
    { value: 'tiruppur_joint_1', label: 'Tiruppur Joint I SRO' },
    { value: 'tiruppur_joint_2', label: 'Tiruppur Joint II SRO' },
    { value: 'avinashi', label: 'Avinashi SRO' },
    { value: 'palladam', label: 'Palladam SRO' },
    { value: 'udumalaipettai', label: 'Udumalaipettai SRO' },
    { value: 'dharapuram', label: 'Dharapuram SRO' },
    { value: 'kangeyam', label: 'Kangeyam SRO' }
  ],
  erode: [
    { value: 'erode_joint_1', label: 'Erode Joint I SRO' },
    { value: 'erode_joint_2', label: 'Erode Joint II SRO' },
    { value: 'perundurai', label: 'Perundurai SRO' },
    { value: 'bhavani', label: 'Bhavani SRO' },
    { value: 'kodumudi', label: 'Kodumudi SRO' },
    { value: 'modakkurichi', label: 'Modakkurichi SRO' }
  ],
  gobichettipalayam: [
    { value: 'gobichettipalayam', label: 'Gobichettipalayam SRO' },
    { value: 'sathyamangalam', label: 'Sathyamangalam SRO' },
    { value: 'anthiyur', label: 'Anthiyur SRO' }
  ],
  karur: [
    { value: 'karur_joint_1', label: 'Karur Joint I SRO' },
    { value: 'karur_joint_2', label: 'Karur Joint II SRO' },
    { value: 'kulithalai', label: 'Kulithalai SRO' },
    { value: 'aravakurichi', label: 'Aravakurichi SRO' }
  ],
  nilgiris: [
    { value: 'ooty_joint', label: 'Ooty Joint SRO' },
    { value: 'coonoor', label: 'Coonoor SRO' },
    { value: 'gudalur', label: 'Gudalur SRO' },
    { value: 'kotagiri', label: 'Kotagiri SRO' }
  ],
  cuddalore: [
    { value: 'cuddalore_joint_1', label: 'Cuddalore Joint I SRO' },
    { value: 'cuddalore_joint_2', label: 'Cuddalore Joint II SRO' },
    { value: 'panruti', label: 'Panruti SRO' },
    { value: 'kurinjipadi', label: 'Kurinjipadi SRO' }
  ],
  chidambaram: [
    { value: 'chidambaram', label: 'Chidambaram SRO' },
    { value: 'vriddhachalam', label: 'Vriddhachalam SRO' },
    { value: 'tittagudi', label: 'Tittagudi SRO' },
    { value: 'kattumannarkoil', label: 'Kattumannarkoil SRO' }
  ],
  kallakurichi: [
    { value: 'kallakurichi', label: 'Kallakurichi SRO' },
    { value: 'sankarapuram', label: 'Sankarapuram SRO' },
    { value: 'tirukoilur', label: 'Tirukoilur SRO' },
    { value: 'ulundurpet', label: 'Ulundurpet SRO' }
  ],
  tiruvannamalai: [
    { value: 'tiruvannamalai_joint_1', label: 'Tiruvannamalai Joint I SRO' },
    { value: 'tiruvannamalai_joint_2', label: 'Tiruvannamalai Joint II SRO' },
    { value: 'arani', label: 'Arani SRO' },
    { value: 'polur', label: 'Polur SRO' },
    { value: 'vandavasi', label: 'Vandavasi SRO' },
    { value: 'chengam', label: 'Chengam SRO' }
  ],
  villupuram: [
    { value: 'villupuram_joint_1', label: 'Villupuram Joint I SRO' },
    { value: 'villupuram_joint_2', label: 'Villupuram Joint II SRO' },
    { value: 'tindivanam', label: 'Tindivanam SRO' },
    { value: 'gingee', label: 'Gingee SRO' },
    { value: 'vanur', label: 'Vanur SRO' }
  ],
  madurai: [
    { value: 'madurai_joint_1', label: 'Madurai Joint I SRO' },
    { value: 'madurai_joint_2', label: 'Madurai Joint II SRO' },
    { value: 'tallakulam', label: 'Tallakulam SRO' },
    { value: 'mahal', label: 'Mahal SRO' },
    { value: 'thiruparankundram', label: 'Thiruparankundram SRO' },
    { value: 'thamaraipatti', label: 'Thamaraipatti SRO' },
    { value: 'vadipatti', label: 'Vadipatti SRO' },
    { value: 'melur', label: 'Melur SRO' },
    { value: 'usilampatti', label: 'Usilampatti SRO' },
    { value: 'tirumangalam', label: 'Tirumangalam SRO' }
  ],
  dindigul: [
    { value: 'dindigul_joint_1', label: 'Dindigul Joint I SRO' },
    { value: 'dindigul_joint_2', label: 'Dindigul Joint II SRO' },
    { value: 'palani', label: 'Palani SRO' },
    { value: 'kodaikanal', label: 'Kodaikanal SRO' },
    { value: 'nattam', label: 'Nattam SRO' },
    { value: 'oddanchatram', label: 'Oddanchatram SRO' }
  ],
  periyakulam: [
    { value: 'theni_joint', label: 'Theni Joint SRO' },
    { value: 'periyakulam', label: 'Periyakulam SRO' },
    { value: 'bodinayakanur', label: 'Bodinayakanur SRO' },
    { value: 'cumbum', label: 'Cumbum SRO' },
    { value: 'uthamapalayam', label: 'Uthamapalayam SRO' }
  ],
  virudhunagar: [
    { value: 'virudhunagar', label: 'Virudhunagar SRO' },
    { value: 'sivakasi', label: 'Sivakasi SRO' },
    { value: 'rajapalayam', label: 'Rajapalayam SRO' },
    { value: 'satur', label: 'Satur SRO' },
    { value: 'aruppukottai', label: 'Aruppukottai SRO' },
    { value: 'srivilliputhur', label: 'Srivilliputhur SRO' }
  ],
  karaikudi: [
    { value: 'karaikudi', label: 'Karaikudi SRO' },
    { value: 'devakottai', label: 'Devakottai SRO' },
    { value: 'tiruppattur_svg', label: 'Tiruppattur SRO' }
  ],
  ramanathapuram: [
    { value: 'ramanathapuram_joint', label: 'Ramanathapuram Joint SRO' },
    { value: 'paramakudi', label: 'Paramakudi SRO' },
    { value: 'rameswaram', label: 'Rameswaram SRO' },
    { value: 'mudukulathur', label: 'Mudukulathur SRO' }
  ],
  sivaganga: [
    { value: 'sivaganga_joint', label: 'Sivaganga Joint SRO' },
    { value: 'manamadurai', label: 'Manamadurai SRO' },
    { value: 'kalaiyarkoil', label: 'Kalaiyarkoil SRO' }
  ],
  salem: [
    { value: 'salem_east', label: 'Salem East SRO' },
    { value: 'salem_west', label: 'Salem West SRO' },
    { value: 'suramangalam', label: 'Suramangalam SRO' },
    { value: 'attur', label: 'Attur SRO' },
    { value: 'mettur', label: 'Mettur SRO' },
    { value: 'omalur', label: 'Omalur SRO' },
    { value: 'sankari', label: 'Sankari SRO' },
    { value: 'valapady', label: 'Valapady SRO' }
  ],
  dharmapuri: [
    { value: 'dharmapuri_joint_1', label: 'Dharmapuri Joint I SRO' },
    { value: 'dharmapuri_joint_2', label: 'Dharmapuri Joint II SRO' },
    { value: 'harur', label: 'Harur SRO' },
    { value: 'pennagaram', label: 'Pennagaram SRO' }
  ],
  krishnagiri: [
    { value: 'krishnagiri_joint', label: 'Krishnagiri Joint SRO' },
    { value: 'hosur_joint_1', label: 'Hosur Joint I SRO' },
    { value: 'hosur_joint_2', label: 'Hosur Joint II SRO' },
    { value: 'denkanikottai', label: 'Denkanikottai SRO' },
    { value: 'pochampalli', label: 'Pochampalli SRO' }
  ],
  namakkal: [
    { value: 'namakkal_joint_1', label: 'Namakkal Joint I SRO' },
    { value: 'namakkal_joint_2', label: 'Namakkal Joint II SRO' },
    { value: 'rasipuram', label: 'Rasipuram SRO' },
    { value: 'tiruchengodu', label: 'Tiruchengodu SRO' },
    { value: 'paramathi', label: 'Paramathi Velur SRO' }
  ],
  trichy: [
    { value: 'trichy_joint_1', label: 'Trichy Joint I SRO' },
    { value: 'trichy_joint_2', label: 'Trichy Joint II SRO' },
    { value: 'srirangam', label: 'Srirangam SRO' },
    { value: 'lalgudi', label: 'Lalgudi SRO' },
    { value: 'thiruverumbur', label: 'Thiruverumbur SRO' },
    { value: 'manachanallur', label: 'Manachanallur SRO' }
  ],
  ariyalur: [
    { value: 'ariyalur', label: 'Ariyalur SRO' },
    { value: 'udayarpalayam', label: 'Udayarpalayam SRO' },
    { value: 'jayamkondam', label: 'Jayamkondam SRO' },
    { value: 'perambalur', label: 'Perambalur SRO' }
  ],
  pudukkottai: [
    { value: 'pudukkottai_joint_1', label: 'Pudukkottai Joint I SRO' },
    { value: 'pudukkottai_joint_2', label: 'Pudukkottai Joint II SRO' },
    { value: 'aranthangi', label: 'Aranthangi SRO' },
    { value: 'thirumayam', label: 'Thirumayam SRO' }
  ],
  tirunelveli: [
    { value: 'tirunelveli_joint_1', label: 'Tirunelveli Joint I SRO' },
    { value: 'tirunelveli_joint_2', label: 'Tirunelveli Joint II SRO' },
    { value: 'palayamkottai', label: 'Palayamkottai SRO' },
    { value: 'cheranmahadevi', label: 'Cheranmahadevi SRO' },
    { value: 'ambasamudram', label: 'Ambasamudram SRO' }
  ],
  tenkasi: [
    { value: 'tenkasi', label: 'Tenkasi SRO' },
    { value: 'sankarankovil', label: 'Sankarankovil SRO' },
    { value: 'kadayanallur', label: 'Kadayanallur SRO' },
    { value: 'shenkottai', label: 'Shenkottai SRO' }
  ],
  thoothukudi: [
    { value: 'thoothukudi_joint_1', label: 'Thoothukudi Joint I SRO' },
    { value: 'thoothukudi_joint_2', label: 'Thoothukudi Joint II SRO' },
    { value: 'kovilpatti', label: 'Kovilpatti SRO' },
    { value: 'tiruchendur', label: 'Tiruchendur SRO' }
  ],
  kanyakumari: [
    { value: 'nagercoil_joint_1', label: 'Nagercoil Joint I SRO' },
    { value: 'nagercoil_joint_2', label: 'Nagercoil Joint II SRO' },
    { value: 'thuckalay', label: 'Thuckalay SRO' },
    { value: 'marthandam', label: 'Marthandam SRO' },
    { value: 'kanyakumari', label: 'Kanyakumari SRO' }
  ],
  thanjavur: [
    { value: 'thanjavur_joint_1', label: 'Thanjavur Joint I SRO' },
    { value: 'thanjavur_joint_2', label: 'Thanjavur Joint II SRO' },
    { value: 'kumbakonam_joint_1', label: 'Kumbakonam Joint I SRO' },
    { value: 'pattukkottai', label: 'Pattukkottai SRO' }
  ],
  nagapattinam: [
    { value: 'nagapattinam', label: 'Nagapattinam SRO' },
    { value: 'velankanni', label: 'Velankanni SRO' },
    { value: 'vedaranyam', label: 'Vedaranyam SRO' }
  ],
  mayiladuthurai: [
    { value: 'mayiladuthurai', label: 'Mayiladuthurai SRO' },
    { value: 'sirkali', label: 'Sirkali SRO' },
    { value: 'tharangambadi', label: 'Tharangambadi SRO' }
  ],
  tiruvarur: [
    { value: 'tiruvarur', label: 'Tiruvarur SRO' },
    { value: 'mannargudi', label: 'Mannargudi SRO' },
    { value: 'thiruthuraipoondi', label: 'Thiruthuraipoondi SRO' }
  ],
  vellore: [
    { value: 'vellore_joint_1', label: 'Vellore Joint I SRO' },
    { value: 'katpadi', label: 'Katpadi SRO' },
    { value: 'gudiyattam', label: 'Gudiyattam SRO' }
  ],
  ranipet: [
    { value: 'ranipet', label: 'Ranipet SRO' },
    { value: 'walajah', label: 'Walajapet SRO' },
    { value: 'arakkonam', label: 'Arakkonam SRO' },
    { value: 'sholinghur', label: 'Sholinghur SRO' }
  ],
  tirupathur: [
    { value: 'tirupathur', label: 'Tirupathur SRO' },
    { value: 'vaniyambadi', label: 'Vaniyambadi SRO' },
    { value: 'ambur', label: 'Ambur SRO' }
  ],
  cheyyar: [
    { value: 'cheyyar', label: 'Cheyyar SRO' },
    { value: 'arani', label: 'Arani SRO' },
    { value: 'vandavasi', label: 'Vandavasi SRO' }
  ]
};

// Revenue Villages per Sub Registrar Office
export const MOCK_VILLAGES: Record<string, { value: string; label: string }[]> = {
  t_nagar: [
    { value: 't_nagar', label: 'T. Nagar' },
    { value: 'west_mambalam', label: 'West Mambalam' },
    { value: 'kodambakkam_part', label: 'Kodambakkam (Part)' },
    { value: 'puliyur_part', label: 'Puliyur (Part)' }
  ],
  mylapore: [
    { value: 'mylapore', label: 'Mylapore' },
    { value: 'mandaveli', label: 'Mandaveli' },
    { value: 'santhome', label: 'Santhome' },
    { value: 'ra_puram', label: 'R.A. Puram' },
    { value: 'alwarpet', label: 'Alwarpet' }
  ],
  triplicane: [
    { value: 'triplicane', label: 'Triplicane' },
    { value: 'chepauk', label: 'Chepauk' },
    { value: 'royapettah_part', label: 'Royapettah (Part)' },
    { value: 'nungambakkam_part', label: 'Nungambakkam (Part)' }
  ],
  kodambakkam: [
    { value: 'kodambakkam', label: 'Kodambakkam' },
    { value: 'vadapalani', label: 'Vadapalani' },
    { value: 'ashok_nagar', label: 'Ashok Nagar' },
    { value: 'saligramam', label: 'Saligramam' }
  ],
  egmore: [
    { value: 'egmore', label: 'Egmore' },
    { value: 'chetpet', label: 'Chetpet' },
    { value: 'kilpauk', label: 'Kilpauk' },
    { value: 'cholemedu', label: 'Choolaimedu' }
  ],
  royapettah: [
    { value: 'royapettah', label: 'Royapettah' },
    { value: 'gopalapuram', label: 'Gopalapuram' },
    { value: 'thiru_vi_ka_nagar', label: 'Thiru-Vi-Ka Nagar' }
  ],
  purasawalkam: [
    { value: 'purasawalkam', label: 'Purasawalkam' },
    { value: 'vepery', label: 'Vepery' },
    { value: 'perambur', label: 'Perambur' },
    { value: 'otteri', label: 'Otteri' }
  ],
  ashok_nagar: [
    { value: 'ashok_nagar', label: 'Ashok Nagar' },
    { value: 'kk_nagar', label: 'K.K. Nagar' },
    { value: 'jafferkhanpet', label: 'Jafferkhanpet' }
  ],
  anna_nagar: [
    { value: 'anna_nagar', label: 'Anna Nagar' },
    { value: 'shenoy_nagar', label: 'Shenoy Nagar' },
    { value: 'arumbakkam', label: 'Arumbakkam' },
    { value: 'koyambedu', label: 'Koyambedu' }
  ],
  sowcarpet: [
    { value: 'sowcarpet', label: 'Sowcarpet' },
    { value: 'edapalayam', label: 'Edapalayam' },
    { value: 'kothawal_chavadi', label: 'Kothawal Chavadi' }
  ],
  adyar: [
    { value: 'adyar', label: 'Adyar' },
    { value: 'thiruvanmiyur', label: 'Thiruvanmiyur' },
    { value: 'besant_nagar', label: 'Besant Nagar' },
    { value: 'kotturpuram', label: 'Kotturpuram' },
    { value: 'kasturba_nagar', label: 'Kasturba Nagar' }
  ],
  velachery: [
    { value: 'velachery', label: 'Velachery' },
    { value: 'taramani', label: 'Taramani' },
    { value: 'perungudi', label: 'Perungudi' },
    { value: 'keelkattalai', label: 'Keelkattalai' },
    { value: 'madipakkam', label: 'Madipakkam' }
  ],
  tambaram: [
    { value: 'tambaram', label: 'Tambaram' },
    { value: 'selaiyur', label: 'Selaiyur' },
    { value: 'mudichur', label: 'Mudichur' },
    { value: 'kadapperi', label: 'Kadapperi' },
    { value: 'chitlapakkam', label: 'Chitlapakkam' }
  ],
  neelankarai: [
    { value: 'neelankarai', label: 'Neelankarai' },
    { value: 'palavakkam', label: 'Palavakkam' },
    { value: 'injambakkam', label: 'Injambakkam' },
    { value: 'sholinganallur', label: 'Sholinganallur' },
    { value: 'akkarai', label: 'Akkarai' }
  ],
  chromepet: [
    { value: 'chromepet', label: 'Chromepet' },
    { value: 'hasthinapuram', label: 'Hasthinapuram' },
    { value: 'nagalkeni', label: 'Nagalkeni' },
    { value: 'nemilichery', label: 'Nemilichery' }
  ],
  pallavaram: [
    { value: 'zamin_pallavaram', label: 'Zamin Pallavaram' },
    { value: 'isa_pallavaram', label: 'Isa Pallavaram' },
    { value: 'pammal', label: 'Pammal' },
    { value: 'anakaputhur', label: 'Anakaputhur' }
  ],
  alandur: [
    { value: 'alandur', label: 'Alandur' },
    { value: 'guindy', label: 'Guindy' },
    { value: 'nanganallur', label: 'Nanganallur' },
    { value: 'pazhavanthangal', label: 'Pazhavanthangal' }
  ],
  virugambakkam: [
    { value: 'virugambakkam', label: 'Virugambakkam' },
    { value: 'valasaravakkam', label: 'Valasaravakkam' },
    { value: 'ramapuram', label: 'Ramapuram' },
    { value: 'neshapakkam', label: 'Neshapakkam' }
  ],
  guduvancheri: [
    { value: 'guduvancheri', label: 'Guduvancheri' },
    { value: 'kattankulathur', label: 'Kattankulathur' },
    { value: 'potheri', label: 'Potheri' },
    { value: 'adhanur', label: 'Adhanur' }
  ],
  ambattur: [
    { value: 'ambattur', label: 'Ambattur' },
    { value: 'mogappair', label: 'Mogappair' },
    { value: 'korattur', label: 'Korattur' },
    { value: 'padi', label: 'Padi' },
    { value: 'mannurpet', label: 'Mannurpet' }
  ],
  royapuram: [
    { value: 'royapuram', label: 'Royapuram' },
    { value: 'george_town', label: 'George Town' },
    { value: 'washermanpet', label: 'Washermanpet' },
    { value: 'tondiarpet', label: 'Tondiarpet' }
  ],
  thiruvottiyur: [
    { value: 'thiruvottiyur', label: 'Thiruvottiyur' },
    { value: 'ennore', label: 'Ennore' },
    { value: 'manali', label: 'Manali' },
    { value: 'kathivakkam', label: 'Kathivakkam' }
  ],
  redhills: [
    { value: 'redhills', label: 'Red Hills' },
    { value: 'puzhal', label: 'Puzhal' },
    { value: 'sholavaram', label: 'Sholavaram' },
    { value: 'naravarikuppam', label: 'Naravarikuppam' }
  ],
  ponneri: [
    { value: 'ponneri', label: 'Ponneri' },
    { value: 'minjur', label: 'Minjur' },
    { value: 'kavaraipettai', label: 'Kavaraipettai' }
  ],
  gummidipoondi: [
    { value: 'gummidipoondi', label: 'Gummidipoondi' },
    { value: 'elavur', label: 'Elavur' },
    { value: 'arambakkam', label: 'Arambakkam' }
  ],
  madhavaram: [
    { value: 'madhavaram', label: 'Madhavaram' },
    { value: 'mathur', label: 'Mathur' },
    { value: 'perungavoor', label: 'Perungavoor' }
  ],
  chengalpattu_joint_1: [
    { value: 'chengalpattu_town', label: 'Chengalpattu (Town)' },
    { value: 'gundu_uppalavadi', label: 'Gundu Uppalavadi' },
    { value: 'melamaiyur', label: 'Melamaiyur' }
  ],
  chengalpattu_joint_2: [
    { value: 'singaperumal_koil', label: 'Singaperumal Koil' },
    { value: 'paranur', label: 'Paranur' },
    { value: 'veerapuram', label: 'Veerapuram' }
  ],
  maraimalai_nagar: [
    { value: 'maraimalai_nagar', label: 'Maraimalai Nagar' },
    { value: 'ninnakarai', label: 'Ninnakarai' },
    { value: 'peramanur', label: 'Peramanur' }
  ],
  maduranthakam: [
    { value: 'maduranthakam', label: 'Maduranthakam' },
    { value: 'karunguzhi', label: 'Karunguzhi' },
    { value: 'padalam', label: 'Padalam' },
    { value: 'kithiruppu', label: 'Kithiruppu' }
  ],
  tirukalukundram: [
    { value: 'tirukalukundram', label: 'Tirukalukundram' },
    { value: 'mamallapuram', label: 'Mamallapuram' },
    { value: 'sadras', label: 'Sadras' },
    { value: 'salavankuppam', label: 'Salavankuppam' }
  ],
  tiruporur: [
    { value: 'tiruporur', label: 'Tiruporur' },
    { value: 'kelambakkam', label: 'Kelambakkam' },
    { value: 'navalur', label: 'Navalur' },
    { value: 'thaiyur', label: 'Thaiyur' },
    { value: 'padur', label: 'Padur' }
  ],
  cheyyur: [
    { value: 'cheyyur', label: 'Cheyyur' },
    { value: 'lathur', label: 'Lathur' },
    { value: 'chithamur', label: 'Chithamur' }
  ],
  kanchipuram_joint_1: [
    { value: 'kanchipuram_town', label: 'Kanchipuram (Town)' },
    { value: 'big_kanchipuram', label: 'Big Kanchipuram' },
    { value: 'sevilimedu', label: 'Sevilimedu' }
  ],
  kanchipuram_joint_2: [
    { value: 'little_kanchipuram', label: 'Little Kanchipuram' },
    { value: 'orikkai', label: 'Orikkai' },
    { value: 'nathapettai', label: 'Nathapettai' }
  ],
  sriperumbudur: [
    { value: 'sriperumbudur', label: 'Sriperumbudur' },
    { value: 'sunguvarchatram', label: 'Sunguvarchatram' },
    { value: 'mambakkam', label: 'Mambakkam' },
    { value: 'irungattukottai', label: 'Irungattukottai' }
  ],
  walajabad: [
    { value: 'walajabad', label: 'Walajabad' },
    { value: 'tenneri', label: 'Tenneri' },
    { value: 'ayyampettai', label: 'Ayyampettai' }
  ],
  sunguvarchatram: [
    { value: 'sunguvarchatram', label: 'Sunguvarchatram' },
    { value: 'molachur', label: 'Molachur' },
    { value: 'santhavelur', label: 'Santhavelur' }
  ],
  uthiramerur: [
    { value: 'uthiramerur', label: 'Uthiramerur' },
    { value: 'manamathy', label: 'Manamathy' },
    { value: 'kaliyoor', label: 'Kaliyoor' }
  ],
  tiruvallur_joint_1: [
    { value: 'tiruvallur_town', label: 'Tiruvallur (Town)' },
    { value: 'manavalanagar', label: 'Manavalanagar' },
    { value: 'periyakuppam', label: 'Periyakuppam' }
  ],
  tiruvallur_joint_2: [
    { value: 'ekkadu', label: 'Ekkadu' },
    { value: 'pulla_rombakkam', label: 'Pulla Rombakkam' },
    { value: 'severapet', label: 'Severapet' }
  ],
  avadi: [
    { value: 'avadi', label: 'Avadi' },
    { value: 'pattabiram', label: 'Pattabiram' },
    { value: 'thiruninravur', label: 'Thiruninravur' },
    { value: 'mitnamallee', label: 'Mitnamallee' }
  ],
  poonamallee: [
    { value: 'poonamallee', label: 'Poonamallee' },
    { value: 'porur', label: 'Porur' },
    { value: 'kumananchavadi', label: 'Kumananchavadi' },
    { value: 'iyappanthangal', label: 'Iyappanthangal' }
  ],
  thiruthani: [
    { value: 'thiruthani', label: 'Thiruthani' },
    { value: 'rk_pet', label: 'R.K. Pet' },
    { value: 'agoor', label: 'Agoor' }
  ],
  uthukottai: [
    { value: 'uthukottai', label: 'Uthukottai' },
    { value: 'periyapalayam', label: 'Periyapalayam' },
    { value: 'tiruvellavoyal', label: 'Tiruvellavoyal' }
  ],
  coimbatore_joint_1: [
    { value: 'coimbatore_town', label: 'Coimbatore (Town)' },
    { value: 'rs_puram', label: 'R.S. Puram' },
    { value: 'town_hall', label: 'Town Hall' }
  ],
  coimbatore_joint_2: [
    { value: 'saibaba_colony', label: 'Saibaba Colony' },
    { value: 'rathinapuri', label: 'Rathinapuri' },
    { value: 'sivananda_colony', label: 'Sivananda Colony' }
  ],
  gandhipuram: [
    { value: 'gandhipuram', label: 'Gandhipuram' },
    { value: 'tatabad', label: 'Tatabad' },
    { value: 'avarampalayam', label: 'Avarampalayam' }
  ],
  peelamedu: [
    { value: 'peelamedu', label: 'Peelamedu' },
    { value: 'hope_college', label: 'Hope College' },
    { value: 'tidel_park_area', label: 'Tidel Park Area' },
    { value: 'sowripalayam', label: 'Sowripalayam' }
  ],
  singanallur: [
    { value: 'singanallur', label: 'Singanallur' },
    { value: 'ondipudur', label: 'Ondipudur' },
    { value: 'ramanathapuram_cbe', label: 'Ramanathapuram (CBE)' }
  ],
  perianaickenpalayam: [
    { value: 'perianaickenpalayam', label: 'Perianaickenpalayam' },
    { value: 'press_colony', label: 'Press Colony' },
    { value: 'naickenpalayam', label: 'Naickenpalayam' }
  ],
  ganapathy: [
    { value: 'ganapathy', label: 'Ganapathy' },
    { value: 'saravanampatti', label: 'Saravanampatti' },
    { value: 'chinnavedampatti', label: 'Chinnavedampatti' }
  ],
  thondamuthur: [
    { value: 'thondamuthur', label: 'Thondamuthur' },
    { value: 'vedapatti', label: 'Vedapatti' },
    { value: 'velliangiri_foothills', label: 'Velliangiri Foothills' }
  ],
  madukkarai: [
    { value: 'madukkarai', label: 'Madukkarai' },
    { value: 'kovaipudur', label: 'Kovaipudur' },
    { value: 'kuniyamuthur', label: 'Kuniyamuthur' }
  ],
  kinathukadavu: [
    { value: 'kinathukadavu', label: 'Kinathukadavu' },
    { value: 'kothavadi', label: 'Kothavadi' },
    { value: 'senguttaipalayam', label: 'Senguttaipalayam' }
  ],
  pollachi_joint_1: [
    { value: 'pollachi_town', label: 'Pollachi (Town)' },
    { value: 'mahalingapuram', label: 'Mahalingapuram' },
    { value: 'venkitapuram', label: 'Venkitapuram' }
  ],
  pollachi_joint_2: [
    { value: 'zamin_uthukuli', label: 'Zamin Uthukuli' },
    { value: 'achipatti', label: 'Achipatti' },
    { value: 'unjavelampatti', label: 'Unjavelampatti' }
  ],
  anamalai: [
    { value: 'anamalai', label: 'Anamalai' },
    { value: 'vettaikaranpudur', label: 'Vettaikaranpudur' },
    { value: 'topslip_area', label: 'Topslip Area' }
  ],
  tiruppur_joint_1: [
    { value: 'tiruppur_town', label: 'Tiruppur (Town)' },
    { value: 'khaderpet', label: 'Khaderpet' },
    { value: 'nallur', label: 'Nallur' }
  ],
  tiruppur_joint_2: [
    { value: 'rayapuram_tpr', label: 'Rayapuram (Tiruppur)' },
    { value: 'neru_perichal', label: 'Neru Perichal' },
    { value: 'veerapandi', label: 'Veerapandi' }
  ],
  avinashi: [
    { value: 'avinashi', label: 'Avinashi' },
    { value: 'tekalur', label: 'Tekalur' },
    { value: 'velayuthampalayam', label: 'Velayuthampalayam' }
  ],
  palladam: [
    { value: 'palladam', label: 'Palladam' },
    { value: 'kodangipalayam', label: 'Kodangipalayam' },
    { value: 'karaipudur', label: 'Karaipudur' }
  ],
  udumalaipettai: [
    { value: 'udumalaipettai', label: 'Udumalaipettai' },
    { value: 'mudarapatti', label: 'Mudarapatti' },
    { value: 'kaniyur', label: 'Kaniyur' }
  ],
  dharapuram: [
    { value: 'dharapuram', label: 'Dharapuram' },
    { value: 'koilpalayam', label: 'Koilpalayam' },
    { value: 'chinnakkampalayam', label: 'Chinnakkampalayam' }
  ],
  kangeyam: [
    { value: 'kangeyam', label: 'Kangeyam' },
    { value: 'sivanmalai', label: 'Sivanmalai' },
    { value: 'nathakadaiyur', label: 'Nathakadaiyur' }
  ],
  erode_joint_1: [
    { value: 'erode_town', label: 'Erode (Town)' },
    { value: 'perundurai_road', label: 'Perundurai Road' },
    { value: 'bhavani_road', label: 'Bhavani Road' }
  ],
  erode_joint_2: [
    { value: 'surampatti', label: 'Surampatti' },
    { value: 'kasipalayam', label: 'Kasipalayam' },
    { value: 'veerappanchatram', label: 'Veerappanchatram' }
  ],
  perundurai: [
    { value: 'perundurai', label: 'Perundurai' },
    { value: 'sipcot_complex', label: 'SIPCOT Industrial Complex' },
    { value: 'kunnathur', label: 'Kunnathur' }
  ],
  bhavani: [
    { value: 'bhavani', label: 'Bhavani' },
    { value: 'komarapalayam', label: 'Komarapalayam' },
    { value: 'lakshmi_nagar', label: 'Lakshmi Nagar' }
  ],
  kodumudi: [
    { value: 'kodumudi', label: 'Kodumudi' },
    { value: 'unjalur', label: 'Unjalur' },
    { value: 'pasur', label: 'Pasur' }
  ],
  modakkurichi: [
    { value: 'modakkurichi', label: 'Modakkurichi' },
    { value: 'ganapathipalayam', label: 'Ganapathipalayam' },
    { value: 'avalpoondurai', label: 'Avalpoondurai' }
  ],
  gobichettipalayam: [
    { value: 'gobichettipalayam', label: 'Gobichettipalayam' },
    { value: 'kullampalayam', label: 'Kullampalayam' },
    { value: 'lakkampatti', label: 'Lakkampatti' }
  ],
  sathyamangalam: [
    { value: 'sathyamangalam', label: 'Sathyamangalam' },
    { value: 'bannari', label: 'Bannari' },
    { value: 'pazhani_nagar', label: 'Pazhani Nagar' }
  ],
  anthiyur: [
    { value: 'anthiyur', label: 'Anthiyur' },
    { value: 'bargur_erode', label: 'Bargur (Erode)' },
    { value: 'appakudal', label: 'Appakudal' }
  ],
  karur_joint_1: [
    { value: 'karur_town', label: 'Karur (Town)' },
    { value: 'gandhigramam_karur', label: 'Gandhigramam (Karur)' },
    { value: 'thanthoni', label: 'Thanthoni' }
  ],
  karur_joint_2: [
    { value: 'inam_karur', label: 'Inam Karur' },
    { value: 'pasupathipalayam', label: 'Pasupathipalayam' },
    { value: 'vengamedu', label: 'Vengamedu' }
  ],
  kulithalai: [
    { value: 'kulithalai', label: 'Kulithalai' },
    { value: 'musiri_karur', label: 'Musiri (Karur)' },
    { value: 'nangavaram', label: 'Nangavaram' }
  ],
  aravakurichi: [
    { value: 'aravakurichi', label: 'Aravakurichi' },
    { value: 'pallapatti', label: 'Pallapatti' },
    { value: 'k_paramathi', label: 'K.Paramathi' }
  ],
  ooty_joint: [
    { value: 'ooty_town', label: 'Ooty (Town)' },
    { value: 'charing_cross', label: 'Charing Cross' },
    { value: 'lovedale', label: 'Lovedale' },
    { value: 'ketti', label: 'Ketti' }
  ],
  coonoor: [
    { value: 'coonoor', label: 'Coonoor' },
    { value: 'wellington_cantonment', label: 'Wellington Cantonment' },
    { value: 'aruvankadu', label: 'Aruvankadu' }
  ],
  gudalur: [
    { value: 'gudalur', label: 'Gudalur' },
    { value: 'pandalur', label: 'Pandalur' },
    { value: 'devala', label: 'Devala' }
  ],
  kotagiri: [
    { value: 'kotagiri', label: 'Kotagiri' },
    { value: 'kodaveru', label: 'Kodaveru' },
    { value: 'denad', label: 'Denad' }
  ],
  cuddalore_joint_1: [
    { value: 'cuddalore_town', label: 'Cuddalore (Town)' },
    { value: 'manjakuppam', label: 'Manjakuppam' },
    { value: 'chidambaram_road', label: 'Chidambaram Road' }
  ],
  cuddalore_joint_2: [
    { value: 'cuddalore_ot', label: 'Cuddalore OT' },
    { value: 'semmandalam', label: 'Semmandalam' },
    { value: 'pachayankuppam', label: 'Pachayankuppam' }
  ],
  panruti: [
    { value: 'panruti', label: 'Panruti' },
    { value: 'kurinjipadi_panruti', label: 'Kurinjipadi (Panruti)' },
    { value: 'kadampuliyur', label: 'Kadampuliyur' }
  ],
  kurinjipadi: [
    { value: 'kurinjipadi', label: 'Kurinjipadi' },
    { value: 'vadalur', label: 'Vadalur' },
    { value: 'vadalur_rs', label: 'Vadalur RS' }
  ],
  chidambaram: [
    { value: 'chidambaram', label: 'Chidambaram' },
    { value: 'annamalai_nagar', label: 'Annamalai Nagar' },
    { value: 'bhuvanagiri', label: 'Bhuvanagiri' }
  ],
  vriddhachalam: [
    { value: 'vriddhachalam', label: 'Vriddhachalam' },
    { value: 'neyveli_lignite_township', label: 'Neyveli Lignite Township' },
    { value: 'mangalampettai', label: 'Mangalampettai' }
  ],
  tittagudi: [
    { value: 'tittagudi', label: 'Tittagudi' },
    { value: 'pennadam', label: 'Pennadam' },
    { value: 'avatti', label: 'Avatti' }
  ],
  kattumannarkoil: [
    { value: 'kattumannarkoil', label: 'Kattumannarkoil' },
    { value: 'srimushnam', label: 'Srimushnam' },
    { value: 'lalpet', label: 'Lalpet' }
  ],
  kallakurichi: [
    { value: 'kallakurichi', label: 'Kallakurichi' },
    { value: 'vadakanandal', label: 'Vadakanandal' },
    { value: 'chinnasalem', label: 'Chinnasalem' }
  ],
  sankarapuram: [
    { value: 'sankarapuram', label: 'Sankarapuram' },
    { value: 'moornapattu', label: 'Moornapattu' },
    { value: 'devapandalam', label: 'Devapandalam' }
  ],
  tirukoilur: [
    { value: 'tirukoilur', label: 'Tirukoilur' },
    { value: 'manalurpet', label: 'Manalurpet' },
    { value: 'arakandanallur', label: 'Arakandanallur' }
  ],
  ulundurpet: [
    { value: 'ulundurpet', label: 'Ulundurpet' },
    { value: 'elavanasur_kottai', label: 'Elavanasur Kottai' },
    { value: 'eranji', label: 'Eranji' }
  ],
  tiruvannamalai_joint_1: [
    { value: 'tiruvannamalai_town', label: 'Tiruvannamalai (Town)' },
    { value: 'girivalam_path_area', label: 'Girivalam Path Area' },
    { value: 'vengikkal', label: 'Vengikkal' }
  ],
  tiruvannamalai_joint_2: [
    { value: 'athiyandal', label: 'Athiyandal' },
    { value: 'kilpennathur', label: 'Kilpennathur' },
    { value: 'veraiyur', label: 'Veraiyur' }
  ],
  arani: [
    { value: 'arani', label: 'Arani' },
    { value: 'devikapuram', label: 'Devikapuram' },
    { value: 'sathyavijayanagaram', label: 'Sathyavijayanagaram' }
  ],
  polur: [
    { value: 'polur', label: 'Polur' },
    { value: 'kalasapakkam', label: 'Kalasapakkam' },
    { value: 'jamunamarathur', label: 'Jamunamarathur' }
  ],
  vandavasi: [
    { value: 'vandavasi', label: 'Vandavasi' },
    { value: 'desur', label: 'Desur' },
    { value: 'thellar', label: 'Thellar' }
  ],
  chengam: [
    { value: 'chengam', label: 'Chengam' },
    { value: 'pudupalayam', label: 'Pudupalayam' },
    { value: 'nachipattu', label: 'Nachipattu' }
  ],
  villupuram_joint_1: [
    { value: 'villupuram_town', label: 'Villupuram (Town)' },
    { value: 'salamedu', label: 'Salamedu' },
    { value: 'valavanur', label: 'Valavanur' }
  ],
  villupuram_joint_2: [
    { value: 'kandamangalam', label: 'Kandamangalam' },
    { value: 'vikravandi', label: 'Vikravandi' },
    { value: 'vikkravandi', label: 'Vikkravandi' }
  ],
  tindivanam: [
    { value: 'tindivanam', label: 'Tindivanam' },
    { value: 'marakkanam', label: 'Marakkanam' },
    { value: 'brammadesam', label: 'Brammadesam' }
  ],
  gingee: [
    { value: 'gingee', label: 'Gingee' },
    { value: 'ananthapuram', label: 'Ananthapuram' },
    { value: 'melmalayanur', label: 'Melmalayanur' }
  ],
  vanur: [
    { value: 'vanur', label: 'Vanur' },
    { value: 'auroville_area', label: 'Auroville Area' },
    { value: 'kottaakuppam', label: 'Kottaakuppam' }
  ],
  madurai_joint_1: [
    { value: 'madurai_town', label: 'Madurai (Town)' },
    { value: 'simmakkal', label: 'Simmakkal' },
    { value: 'goripalayam', label: 'Goripalayam' }
  ],
  madurai_joint_2: [
    { value: 'madurai_south', label: 'Madurai South' },
    { value: 'periyar_area', label: 'Periyar Area' },
    { value: 'palanganatham', label: 'Palanganatham' }
  ],
  tallakulam: [
    { value: 'tallakulam', label: 'Tallakulam' },
    { value: 'kk_nagar_madurai', label: 'K.K. Nagar (Madurai)' },
    { value: 'gandhi_nagar', label: 'Gandhi Nagar' }
  ],
  mahal: [
    { value: 'mahal', label: 'Mahal' },
    { value: 'tvk_nagar', label: 'TVK Nagar' },
    { value: 'villapuram', label: 'Villapuram' }
  ],
  thiruparankundram: [
    { value: 'thiruparankundram', label: 'Thiruparankundram' },
    { value: 'harveypatti', label: 'Harveypatti' },
    { value: 'thirunagar', label: 'Thirunagar' }
  ],
  thamaraipatti: [
    { value: 'thamaraipatti', label: 'Thamaraipatti' },
    { value: 'chittampatti', label: 'Chittampatti' },
    { value: 'othakadai', label: 'Othakadai' }
  ],
  vadipatti: [
    { value: 'vadipatti', label: 'Vadipatti' },
    { value: 'sholavandan', label: 'Sholavandan' },
    { value: 'alanganallur', label: 'Alanganallur' }
  ],
  melur: [
    { value: 'melur', label: 'Melur' },
    { value: 'kottampatti', label: 'Kottampatti' },
    { value: 'thiruvathavur', label: 'Thiruvathavur' }
  ],
  usilampatti: [
    { value: 'usilampatti', label: 'Usilampatti' },
    { value: 'sedapatti', label: 'Sedapatti' },
    { value: 'valandur', label: 'Valandur' }
  ],
  tirumangalam: [
    { value: 'tirumangalam', label: 'Tirumangalam' },
    { value: 'kalligudi', label: 'Kalligudi' },
    { value: 't_kallupatti', label: 'T.Kallupatti' }
  ],
  dindigul_joint_1: [
    { value: 'dindigul_town', label: 'Dindigul (Town)' },
    { value: 'begambur', label: 'Begambur' },
    { value: 'batlagundu_road', label: 'Batlagundu Road' }
  ],
  dindigul_joint_2: [
    { value: 'nagal_nagar', label: 'Nagal Nagar' },
    { value: 'rmtc_colony', label: 'RMTC Colony' },
    { value: 'adiyanuthu', label: 'Adiyanuthu' }
  ],
  palani: [
    { value: 'palani', label: 'Palani' },
    { value: 'ayakudi', label: 'Ayakudi' },
    { value: 'neikarapatti', label: 'Neikarapatti' }
  ],
  kodaikanal: [
    { value: 'kodaikanal', label: 'Kodaikanal' },
    { value: 'pambarpuram', label: 'Pambarpuram' },
    { value: 'shenbaganur', label: 'Shenbaganur' }
  ],
  nattam: [
    { value: 'nattam', label: 'Nattam' },
    { value: 'sanarpatti', label: 'Sanarpatti' },
    { value: 'sendurai', label: 'Sendurai' }
  ],
  oddanchatram: [
    { value: 'oddanchatram', label: 'Oddanchatram' },
    { value: 'kallimandayam', label: 'Kallimandayam' },
    { value: 'chatrapatti', label: 'Chatrapatti' }
  ],
  theni_joint: [
    { value: 'theni_town', label: 'Theni (Town)' },
    { value: 'allinagaram', label: 'Allinagaram' },
    { value: 'veerapandi_theni', label: 'Veerapandi (Theni)' }
  ],
  periyakulam: [
    { value: 'periyakulam', label: 'Periyakulam' },
    { value: 'vadugapatti', label: 'Vadugapatti' },
    { value: 'devadanapatti', label: 'Devadanapatti' }
  ],
  bodinayakanur: [
    { value: 'bodinayakanur', label: 'Bodinayakanur' },
    { value: 'silamarathupatti', label: 'Silamarathupatti' },
    { value: 'bodi_zamin', label: 'Bodi Zamin' }
  ],
  cumbum: [
    { value: 'cumbum', label: 'Cumbum' },
    { value: 'gudalur_theni', label: 'Gudalur (Theni)' },
    { value: 'uthamapalayam', label: 'Uthamapalayam' }
  ],
  uthamapalayam: [
    { value: 'uthamapalayam', label: 'Uthamapalayam' },
    { value: 'chinnamanur', label: 'Chinnamanur' },
    { value: 'royappanpatti', label: 'Royappanpatti' }
  ],
  virudhunagar: [
    { value: 'virudhunagar', label: 'Virudhunagar' },
    { value: 'rosalpatti', label: 'Rosalpatti' },
    { value: 'allampatti', label: 'Allampatti' }
  ],
  sivakasi: [
    { value: 'sivakasi', label: 'Sivakasi' },
    { value: 'thiruthangal', label: 'Thiruthangal' },
    { value: 'viswanatham', label: 'Viswanatham' }
  ],
  rajapalayam: [
    { value: 'rajapalayam', label: 'Rajapalayam' },
    { value: 'seithur', label: 'Seithur' },
    { value: 'samusigapuram', label: 'Samusigapuram' }
  ],
  satur: [
    { value: 'satur', label: 'Satur' },
    { value: 'elayirampannai', label: 'Elayirampannai' },
    { value: 'nalli', label: 'Nalli' }
  ],
  aruppukottai: [
    { value: 'aruppukottai', label: 'Aruppukottai' },
    { value: 'pandalgudi', label: 'Pandalgudi' },
    { value: 'palayampatti', label: 'Palayampatti' }
  ],
  srivilliputhur: [
    { value: 'srivilliputhur', label: 'Srivilliputhur' },
    { value: 'watrap', label: 'Watrap' },
    { value: 'mammshapuram', label: 'Mammshapuram' }
  ],
  karaikudi: [
    { value: 'karaikudi', label: 'Karaikudi' },
    { value: 'devakottai_road', label: 'Devakottai Road' },
    { value: 'kottaiyur', label: 'Kottaiyur' },
    { value: 'kanadukathan', label: 'Kanadukathan' }
  ],
  devakottai: [
    { value: 'devakottai', label: 'Devakottai' },
    { value: 'rasingamangalam', label: 'Rasingamangalam' },
    { value: 'kalanivasal', label: 'Kalanivasal' }
  ],
  tiruppattur_svg: [
    { value: 'tiruppattur_sivaganga', label: 'Tiruppattur (Sivaganga)' },
    { value: 'pillayarpatti', label: 'Pillayarpatti' },
    { value: 'nerkuppai', label: 'Nerkuppai' }
  ],
  ramanathapuram_joint: [
    { value: 'ramanathapuram_town', label: 'Ramanathapuram (Town)' },
    { value: 'kenikarai', label: 'Kenikarai' },
    { value: 'vandiyur', label: 'Vandiyur' }
  ],
  paramakudi: [
    { value: 'paramakudi', label: 'Paramakudi' },
    { value: 'emaneswaram', label: 'Emaneswaram' },
    { value: 'nainarkoil', label: 'Nainarkoil' }
  ],
  rameswaram: [
    { value: 'rameswaram', label: 'Rameswaram' },
    { value: 'pamban', label: 'Pamban' },
    { value: 'dhanushkodi', label: 'Dhanushkodi' }
  ],
  mudukulathur: [
    { value: 'mudukulathur', label: 'Mudukulathur' },
    { value: 'sayalgudi', label: 'Sayalgudi' },
    { value: 'kadaladi', label: 'Kadaladi' }
  ],
  sivaganga_joint: [
    { value: 'sivaganga_town', label: 'Sivaganga (Town)' },
    { value: 'paiyur', label: 'Paiyur' },
    { value: 'namanur', label: 'Namanur' }
  ],
  manamadurai: [
    { value: 'manamadurai', label: 'Manamadurai' },
    { value: 'tirupuvanam', label: 'Tirupuvanam' },
    { value: 'muthanandal', label: 'Muthanandal' }
  ],
  kalaiyarkoil: [
    { value: 'kalaiyarkoil', label: 'Kalaiyarkoil' },
    { value: 'nattarasankottai', label: 'Nattarasankottai' },
    { value: 'maravamangalam', label: 'Maravamangalam' }
  ],
  salem_east: [
    { value: 'salem_east', label: 'Salem East' },
    { value: 'ammapet_salem', label: 'Ammapet (Salem)' },
    { value: 'ponnammapet', label: 'Ponnammapet' }
  ],
  salem_west: [
    { value: 'salem_west', label: 'Salem West' },
    { value: 'fairlands_salem', label: 'Fairlands (Salem)' },
    { value: 'meyyanur', label: 'Meyyanur' }
  ],
  suramangalam: [
    { value: 'suramangalam', label: 'Suramangalam' },
    { value: 'salem_junction_area', label: 'Salem Junction Area' },
    { value: 'jagir_ammapalayam', label: 'Jagir Ammapalayam' }
  ],
  attur: [
    { value: 'attur', label: 'Attur' },
    { value: 'narasingapuram_attur', label: 'Narasingapuram (Attur)' },
    { value: 'thalaivasal', label: 'Thalaivasal' }
  ],
  mettur: [
    { value: 'mettur_dam', label: 'Mettur Dam' },
    { value: 'palamalai', label: 'Palamalai' },
    { value: 'mecheri', label: 'Mecheri' }
  ],
  omalur: [
    { value: 'omalur', label: 'Omalur' },
    { value: 'taramangalam', label: 'Taramangalam' },
    { value: 'karisamangalam', label: 'Karisamangalam' }
  ],
  sankari: [
    { value: 'sankari_durg', label: 'Sankari Durg' },
    { value: 'magudanchavadi', label: 'Magudanchavadi' },
    { value: 'macdonald_choultry', label: 'Macdonald Choultry' }
  ],
  valapady: [
    { value: 'valapady', label: 'Valapady' },
    { value: 'yercaud', label: 'Yercaud' },
    { value: 'belur_salem', label: 'Belur (Salem)' }
  ],
  dharmapuri_joint_1: [
    { value: 'dharmapuri_town', label: 'Dharmapuri (Town)' },
    { value: 'virupakshipuram', label: 'Virupakshipuram' },
    { value: 'kollagatte', label: 'Kollagatte' }
  ],
  dharmapuri_joint_2: [
    { value: 'oddapatti', label: 'Oddapatti' },
    { value: 'indur', label: 'Indur' },
    { value: 'nallampalli', label: 'Nallampalli' }
  ],
  harur: [
    { value: 'harur', label: 'Harur' },
    { value: 'pappireddipatti', label: 'Pappireddipatti' },
    { value: 'morappur', label: 'Morappur' }
  ],
  pennagaram: [
    { value: 'pennagaram', label: 'Pennagaram' },
    { value: 'hogenakkal_area', label: 'Hogenakkal Area' },
    { value: 'eriyur', label: 'Eriyur' }
  ],
  krishnagiri_joint: [
    { value: 'krishnagiri_town', label: 'Krishnagiri (Town)' },
    { value: 'kaveripattinam', label: 'Kaveripattinam' },
    { value: 'kattiganapalli', label: 'Kattiganapalli' }
  ],
  hosur_joint_1: [
    { value: 'hosur_joint_1', label: 'Hosur Joint I' },
    { value: 'sipcot_hosur', label: 'SIPCOT Hosur' },
    { value: 'zuzuvadi', label: 'Zuzuvadi' }
  ],
  hosur_joint_2: [
    { value: 'mookandapalli', label: 'Mookandapalli' },
    { value: 'mathigiri', label: 'Mathigiri' },
    { value: 'bagalur', label: 'Bagalur' }
  ],
  denkanikottai: [
    { value: 'denkanikottai', label: 'Denkanikottai' },
    { value: 'thally', label: 'Thally' },
    { value: 'anchetty', label: 'Anchetty' }
  ],
  pochampalli: [
    { value: 'pochampalli', label: 'Pochampalli' },
    { value: 'bargur', label: 'Bargur' },
    { value: 'nagarasampatti', label: 'Nagarasampatti' }
  ],
  namakkal_joint_1: [
    { value: 'namakkal_town', label: 'Namakkal (Town)' },
    { value: 'nallipalayam', label: 'Nallipalayam' },
    { value: 'mudalaipatti', label: 'Mudalaipatti' }
  ],
  namakkal_joint_2: [
    { value: 'mohanur', label: 'Mohanur' },
    { value: 'senthamangalam', label: 'Senthamangalam' },
    { value: 'erumapatty', label: 'Erumapatty' }
  ],
  rasipuram: [
    { value: 'rasipuram', label: 'Rasipuram' },
    { value: 'venandur', label: 'Venandur' },
    { value: 'pillanallur', label: 'Pillanallur' }
  ],
  tiruchengodu: [
    { value: 'tiruchengodu', label: 'Tiruchengodu' },
    { value: 'kokkarayanpettai', label: 'Kokkarayanpettai' },
    { value: 'mallasamudram', label: 'Mallasamudram' }
  ],
  paramathi: [
    { value: 'paramathi_velur', label: 'Paramathi Velur' },
    { value: 'kabilarmalai', label: 'Kabilarmalai' },
    { value: 'paundamangalam', label: 'Paundamangalam' }
  ],
  trichy_joint_1: [
    { value: 'trichy_cantonment', label: 'Trichy Cantonment' },
    { value: 'thillai_nagar', label: 'Thillai Nagar' },
    { value: 'woraiyur', label: 'Woraiyur' }
  ],
  trichy_joint_2: [
    { value: 'k_sathanur', label: 'K. Sathanur' },
    { value: 'kk_nagar_trichy', label: 'K.K. Nagar (Trichy)' },
    { value: 'crawford', label: 'Crawford' }
  ],
  srirangam: [
    { value: 'srirangam', label: 'Srirangam' },
    { value: 'thiruvanaikoil', label: 'Thiruvanaikoil' },
    { value: 'tiruverumbur_part', label: 'Tiruverumbur (Part)' }
  ],
  lalgudi: [
    { value: 'lalgudi', label: 'Lalgudi' },
    { value: 'manachanallur', label: 'Manachanallur' },
    { value: 'samayapuram', label: 'Samayapuram' }
  ],
  thiruverumbur: [
    { value: 'thiruverumbur', label: 'Thiruverumbur' },
    { value: 'bhel_township', label: 'BHEL Township' },
    { value: 'kattur_trichy', label: 'Kattur (Trichy)' }
  ],
  manachanallur: [
    { value: 'manachanallur', label: 'Manachanallur' },
    { value: 'tiruvellarai', label: 'Tiruvellarai' },
    { value: 'pichandar_kovil', label: 'Pichandar Kovil' }
  ],
  ariyalur: [
    { value: 'ariyalur', label: 'Ariyalur' },
    { value: 'thirumanur', label: 'Thirumanur' },
    { value: 'sendurai_ariyalur', label: 'Sendurai (Ariyalur)' }
  ],
  udayarpalayam: [
    { value: 'udayarpalayam', label: 'Udayarpalayam' },
    { value: 'varadarajanpettai', label: 'Varadarajanpettai' },
    { value: 't_palur', label: 'T.Palur' }
  ],
  jayamkondam: [
    { value: 'jayamkondam', label: 'Jayamkondam' },
    { value: 'gangaikonda_cholapuram', label: 'Gangaikonda Cholapuram' },
    { value: 'andimadam', label: 'Andimadam' }
  ],
  perambalur: [
    { value: 'perambalur', label: 'Perambalur' },
    { value: 'veppanthattai', label: 'Veppanthattai' },
    { value: 'kunnam', label: 'Kunnam' }
  ],
  pudukkottai_joint_1: [
    { value: 'pudukkottai_town', label: 'Pudukkottai (Town)' },
    { value: 'machuvadi', label: 'Machuvadi' },
    { value: 'kattumavadi', label: 'Kattumavadi' }
  ],
  pudukkottai_joint_2: [
    { value: 'ganesh_nagar', label: 'Ganesh Nagar' },
    { value: 'namanasamudram', label: 'Namanasamudram' },
    { value: 'virachilai', label: 'Virachilai' }
  ],
  aranthangi: [
    { value: 'aranthangi', label: 'Aranthangi' },
    { value: 'avudaiyarkoil', label: 'Avudaiyarkoil' },
    { value: 'manamelkudi', label: 'Manamelkudi' }
  ],
  thirumayam: [
    { value: 'thirumayam', label: 'Thirumayam' },
    { value: 'ponnamaravathi', label: 'Ponnamaravathi' },
    { value: 'karisai', label: 'Karisai' }
  ],
  tirunelveli_joint_1: [
    { value: 'tirunelveli_town', label: 'Tirunelveli (Town)' },
    { value: 'tachanallur', label: 'Tachanallur' },
    { value: 'vannarpettai', label: 'Vannarpettai' }
  ],
  tirunelveli_joint_2: [
    { value: 'tirunelveli_junction', label: 'Tirunelveli Junction' },
    { value: 'perumalpuram', label: 'Perumalpuram' },
    { value: 'ktc_nagar', label: 'KTC Nagar' }
  ],
  palayamkottai: [
    { value: 'palayamkottai', label: 'Palayamkottai' },
    { value: 'high_ground', label: 'High Ground' },
    { value: 'nggo_colony', label: 'NGGO Colony' }
  ],
  cheranmahadevi: [
    { value: 'cheranmahadevi', label: 'Cheranmahadevi' },
    { value: 'pathamadai', label: 'Pathamadai' },
    { value: 'mukkoodal', label: 'Mukkoodal' }
  ],
  ambasamudram: [
    { value: 'ambasamudram', label: 'Ambasamudram' },
    { value: 'vickramasingapuram', label: 'Vickramasingapuram' },
    { value: 'kallidaikurichi', label: 'Kallidaikurichi' }
  ],
  tenkasi: [
    { value: 'tenkasi', label: 'Tenkasi' },
    { value: 'courtallam', label: 'Courtallam' },
    { value: 'melagaram', label: 'Melagaram' }
  ],
  sankarankovil: [
    { value: 'sankarankovil', label: 'Sankarankovil' },
    { value: 'thiruvengadam', label: 'Thiruvengadam' },
    { value: 'karivalamvandanallur', label: 'Karivalamvandanallur' }
  ],
  kadayanallur: [
    { value: 'kadayanallur', label: 'Kadayanallur' },
    { value: 'puliyangudi', label: 'Puliyangudi' },
    { value: 'vasudevanallur', label: 'Vasudevanallur' }
  ],
  shenkottai: [
    { value: 'shenkottai', label: 'Shenkottai' },
    { value: 'panpoli', label: 'Panpoli' },
    { value: 'ilanji', label: 'Ilanji' }
  ],
  thoothukudi_joint_1: [
    { value: 'thoothukudi_town', label: 'Thoothukudi (Town)' },
    { value: 'palayamkottai_road_tcy', label: 'Palayamkottai Road (TCY)' },
    { value: 'harbour_area', label: 'Harbour Area' }
  ],
  thoothukudi_joint_2: [
    { value: 'thermal_nagar', label: 'Thermal Nagar' },
    { value: 'muthiahpuram', label: 'Muthiahpuram' },
    { value: 'terespuram', label: 'Terespuram' }
  ],
  kovilpatti: [
    { value: 'kovilpatti', label: 'Kovilpatti' },
    { value: 'kayathar', label: 'Kayathar' },
    { value: 'ettayapuram', label: 'Ettayapuram' }
  ],
  tiruchendur: [
    { value: 'tiruchendur', label: 'Tiruchendur' },
    { value: 'authoor', label: 'Authoor' },
    { value: 'udangudi', label: 'Udangudi' }
  ],
  nagercoil_joint_1: [
    { value: 'nagercoil_town', label: 'Nagercoil (Town)' },
    { value: 'kottar', label: 'Kottar' },
    { value: 'agasteeswaram', label: 'Agasteeswaram' }
  ],
  nagercoil_joint_2: [
    { value: 'asaripallam', label: 'Asaripallam' },
    { value: 'vadasery', label: 'Vadasery' },
    { value: 'kanyakumari_road', label: 'Kanyakumari Road' }
  ],
  thuckalay: [
    { value: 'thuckalay', label: 'Thuckalay' },
    { value: 'padmanabhapuram', label: 'Padmanabhapuram' },
    { value: 'colachel', label: 'Colachel' }
  ],
  marthandam: [
    { value: 'marthandam', label: 'Marthandam' },
    { value: 'kuzhithurai', label: 'Kuzhithurai' },
    { value: 'unnamalaikadai', label: 'Unnamalaikadai' }
  ],
  kanyakumari: [
    { value: 'kanyakumari', label: 'Kanyakumari' },
    { value: 'suchindram', label: 'Suchindram' },
    { value: 'agastheeswaram', label: 'Agastheeswaram' }
  ],
  thanjavur_joint_1: [
    { value: 'thanjavur_palace_area', label: 'Thanjavur Palace Area' },
    { value: 'medical_college_area_tnj', label: 'Medical College Area (TNJ)' },
    { value: 'old_bus_stand', label: 'Old Bus Stand' }
  ],
  thanjavur_joint_2: [
    { value: 'vallam', label: 'Vallam' },
    { value: 'budalur', label: 'Budalur' },
    { value: 'sengipatti', label: 'Sengipatti' }
  ],
  kumbakonam_joint_1: [
    { value: 'kumbakonam_town', label: 'Kumbakonam (Town)' },
    { value: 'darasuram', label: 'Darasuram' },
    { value: 'swamimalai', label: 'Swamimalai' }
  ],
  pattukkottai: [
    { value: 'pattukkottai', label: 'Pattukkottai' },
    { value: 'peravurani', label: 'Peravurani' },
    { value: 'adirampattinam', label: 'Adirampattinam' }
  ],
  nagapattinam: [
    { value: 'nagapattinam', label: 'Nagapattinam' },
    { value: 'kilvelur', label: 'Kilvelur' },
    { value: 'nagore', label: 'Nagore' }
  ],
  velankanni: [
    { value: 'velankanni', label: 'Velankanni' },
    { value: 'thirukkuvalai', label: 'Thirukkuvalai' },
    { value: 'prathamaramapuram', label: 'Prathamaramapuram' }
  ],
  vedaranyam: [
    { value: 'vedaranyam', label: 'Vedaranyam' },
    { value: 'kodiyakarai', label: 'Kodiyakarai' },
    { value: 'thagattur', label: 'Thagattur' }
  ],
  mayiladuthurai: [
    { value: 'mayiladuthurai', label: 'Mayiladuthurai' },
    { value: 'kuttalam', label: 'Kuttalam' },
    { value: 'manalmedu', label: 'Manalmedu' }
  ],
  sirkali: [
    { value: 'sirkali', label: 'Sirkali' },
    { value: 'vaithiswarankoil', label: 'Vaitheeswarankoil' },
    { value: 'ananthathirtha', label: 'Ananthathirtha' }
  ],
  tharangambadi: [
    { value: 'tharangambadi', label: 'Tharangambadi' },
    { value: 'porayar', label: 'Porayar' },
    { value: 'tirukadaiyur', label: 'Tirukadaiyur' }
  ],
  tiruvarur: [
    { value: 'tiruvarur', label: 'Tiruvarur' },
    { value: 'nannilam', label: 'Nannilam' },
    { value: 'kudavasal', label: 'Kudavasal' }
  ],
  mannargudi: [
    { value: 'mannargudi', label: 'Mannargudi' },
    { value: 'needamangalam', label: 'Needamangalam' },
    { value: 'kottur_tiruvarur', label: 'Kottur (Tiruvarur)' }
  ],
  thiruthuraipoondi: [
    { value: 'thiruthuraipoondi', label: 'Thiruthuraipoondi' },
    { value: 'muthupet', label: 'Muthupet' },
    { value: 'edaiyur', label: 'Edaiyur' }
  ],
  vellore_joint_1: [
    { value: 'vellore_fort_area', label: 'Vellore Fort Area' },
    { value: 'sathuvachari', label: 'Sathuvachari' },
    { value: 'thorapadi', label: 'Thorapadi' }
  ],
  katpadi: [
    { value: 'katpadi', label: 'Katpadi' },
    { value: 'vit_campus_area', label: 'VIT Campus Area' },
    { value: 'gandhi_nagar_vellore', label: 'Gandhi Nagar (Vellore)' }
  ],
  gudiyattam: [
    { value: 'gudiyattam', label: 'Gudiyattam' },
    { value: 'kv_kupam', label: 'K.V. Kuppam' },
    { value: 'pernambut', label: 'Pernambut' }
  ],
  ranipet: [
    { value: 'ranipet', label: 'Ranipet' },
    { value: 'sipcot_ranipet', label: 'SIPCOT Ranipet' },
    { value: 'navlock', label: 'Navlock' }
  ],
  walajah: [
    { value: 'walajapet', label: 'Walajapet' },
    { value: 'kaveripakkam', label: 'Kaveripakkam' },
    { value: 'mussiri_ranipet', label: 'Mussiri (Ranipet)' }
  ],
  arakkonam: [
    { value: 'arakkonam', label: 'Arakkonam' },
    { value: 'winterpet', label: 'Winterpet' },
    { value: 'nemili', label: 'Nemili' }
  ],
  sholinghur: [
    { value: 'sholinghur', label: 'Sholinghur' },
    { value: 'banavaram', label: 'Banavaram' },
    { value: 'kondapalayam', label: 'Kondapalayam' }
  ],
  tirupathur: [
    { value: 'tirupathur', label: 'Tirupathur' },
    { value: 'jolarpettai', label: 'Jolarpettai' },
    { value: 'kandili', label: 'Kandili' }
  ],
  vaniyambadi: [
    { value: 'vaniyambadi', label: 'Vaniyambadi' },
    { value: 'yelagiri_hills', label: 'Yelagiri Hills' },
    { value: 'alangayam', label: 'Alangayam' }
  ],
  ambur: [
    { value: 'ambur', label: 'Ambur' },
    { value: 'thuthipet', label: 'Thuthipet' },
    { value: 'omerabad', label: 'Omerabad' }
  ],
  cheyyar: [
    { value: 'cheyyar', label: 'Cheyyar' },
    { value: 'cheyyar_sipcot', label: 'Cheyyar SIPCOT' },
    { value: 'anakkavoor', label: 'Anakkavoor' }
  ]
};

// Helper getter functions with robust fallback logic
export const getDistrictsForZone = (zoneKey: string) => {
  if (MOCK_DISTRICTS[zoneKey] && MOCK_DISTRICTS[zoneKey].length > 0) {
    return MOCK_DISTRICTS[zoneKey];
  }
  // Generic fallback if zone is not mapped directly
  const zoneObj = MOCK_ZONES.find(z => z.value === zoneKey);
  const label = zoneObj ? zoneObj.label.replace(' Zone', '') : zoneKey;
  return [
    { value: `${zoneKey}_central`, label: `${label} Central` },
    { value: `${zoneKey}_north`, label: `${label} North` },
    { value: `${zoneKey}_south`, label: `${label} South` }
  ];
};

export const getSrosForDistrict = (districtKey: string) => {
  if (MOCK_SROS[districtKey] && MOCK_SROS[districtKey].length > 0) {
    return MOCK_SROS[districtKey];
  }
  // Generic fallback for any district
  const distObj = TAMIL_NADU_DISTRICTS.find(d => d.value === districtKey);
  const label = distObj ? distObj.label : districtKey;
  return [
    { value: `${districtKey}_joint_1`, label: `${label} Joint I SRO` },
    { value: `${districtKey}_joint_2`, label: `${label} Joint II SRO` },
    { value: `${districtKey}_taluk_sro`, label: `${label} Taluk SRO` }
  ];
};

export const getVillagesForSro = (sroKey: string) => {
  if (MOCK_VILLAGES[sroKey] && MOCK_VILLAGES[sroKey].length > 0) {
    return MOCK_VILLAGES[sroKey];
  }
  // Generic fallback for any SRO
  const cleanName = sroKey.replace('_sro', '').replace('_v', '').replace('_joint_1', '').replace('_joint_2', '').replace(/_/g, ' ');
  const formatted = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
  return [
    { value: `${sroKey}_v1`, label: `${formatted}` },
    { value: `${sroKey}_v2`, label: `${formatted} North` },
    { value: `${sroKey}_v3`, label: `${formatted} South` }
  ];
};
