import { Product } from '../types';
import bovaMiningBootsImg from '../assets/images/bova_mining_boots_1787430923446.jpg';
import miningWorksuitPpeImg from '../assets/images/mining_worksuit_ppe_1787431118142.jpg';
import diggingSpadeShovelImg from '../assets/images/digging_spade_shovel_1787431263857.jpg';
import mechanicalGlovesImg from '../assets/images/mechanical_gloves_1785175864808.jpg';
import pvcGlovesImg from '../assets/images/pvc_gloves_1785175880270.jpg';
import leatherApronImg from '../assets/images/leather_apron_1785175893651.jpg';
import faceShieldImg from '../assets/images/face_shield_1785175906468.jpg';
import primeBondSiliconeImg from '../assets/images/prime_bond_silicone_1785175919354.jpg';
import packetCableTiesImg from '../assets/images/packet_cable_ties_1785175932136.jpg';
import industrialFoodSupplyImg from '../assets/images/industrial_food_supply_1785905724066.jpg';
import heavyDutyHydraulicsImg from '../assets/images/heavy_duty_hydraulics_1791208457525.jpg';
import crusherWearSparesImg from '../assets/images/crusher_wear_spares_1791208471585.jpg';
import slurryPumpSparesImg from '../assets/images/slurry_pump_spares_1791208484890.jpg';

export const inventory: Product[] = [
  {
    id: 'nd-hw-101',
    name: 'Mining Boots',
    category: 'Hardware',
    subcategory: 'PPE & Wearables',
    description: 'Ultra-durable, waterproof full-grain leather mining boots equipped with impact-resistant steel toe-caps, puncture-proof steel midsoles, and high-traction metatarsal protectors designed for subterranean conditions.',
    priceEstimate: 85.00,
    specifications: [
      'Full-grain bovine leather with water-repellent treatment',
      '200J steel toe cap and 1100N anti-penetration steel plate midsole',
      'Dual-density polyurethane outsole offering acid, oil, and heat resistance up to 300°C',
      'Anti-static and shock-absorbing heel with reinforced ankle support',
      'Wicking mesh lining for temperature control'
    ],
    safetyStandards: ['SANS 20345 Compliant', 'EN ISO 20345:2011', 'CE Certified'],
    image: bovaMiningBootsImg,
    stockStatus: 'In Stock',
    sizes: ['UK Size 6', 'UK Size 7', 'UK Size 8', 'UK Size 9', 'UK Size 10', 'UK Size 11', 'UK Size 12'],
    types: ['Standard Lace-up', 'Quick-Release Pull-on', 'Metatarsal Guard Protection Edition']
  },
  {
    id: 'nd-hw-102',
    name: 'Industrial Mining Overalls',
    category: 'Hardware',
    subcategory: 'PPE & Wearables',
    description: 'Heavy-duty 100% cotton D59 flame-retardant and acid-resistant thermal protective suits. Complete with silver high-visibility reflective tape for maximum subterranean visibility.',
    priceEstimate: 45.00,
    specifications: [
      '100% cotton material (320gsm) treated with flame-retardant chemical coating',
      'Chemically treated to repel light acid splashes, oils, and industrial solvents',
      'YKK heavy-duty brass zippers on front jacket and trousers',
      'Triple-stitched seams on stress points for maximum anti-tear lifespan',
      '50mm premium silver reflective tape around arms, legs, and shoulders'
    ],
    safetyStandards: ['SANS 434 Approved', 'SANS 1387-4 (D59 Fabric)', 'EN 11612 (Flame Protection)'],
    image: miningWorksuitPpeImg,
    stockStatus: 'In Stock',
    sizes: ['Chest Size 34', 'Chest Size 38', 'Chest Size 42', 'Chest Size 46', 'Chest Size 50', 'Chest Size 54'],
    types: ['Standard Two-Piece (Jacket/Pants)', 'One-Piece Boiler Suit Edition']
  },
  {
    id: 'nd-hw-103',
    name: 'Professional Digging Spade & Scoop Shovel',
    category: 'Hardware',
    subcategory: 'Rigging & Tools',
    description: 'Heavy-duty industrial grade digging shovel with hardened carbon steel blade and solid core fiberglass handle, complete with comfortable D-grip handle and anti-corrosion coating.',
    priceEstimate: 29.00,
    specifications: [
      '14-gauge tempered carbon steel blade with forward turned-step for secure foot placement',
      'Solid core fiberglass handle with thick outer protective sheath',
      'Ergonomic heavy-duty poly D-grip handle prevents hand fatigue',
      'Reinforced steel collar collar connection to prevent handle breakage',
      'Rust-resistant black powder coat finish'
    ],
    safetyStandards: ['SANS 281-1 Class A', 'BS 3388'],
    image: diggingSpadeShovelImg,
    stockStatus: 'In Stock',
    sizes: ['Standard 105cm'],
    types: ['Round Nose / Scoop', 'Square Mouth / Shoveling']
  },
  {
    id: 'nd-hw-104',
    name: 'Heavy-Duty Rubber Conveyor Belting',
    category: 'Hardware',
    subcategory: 'Conveyor Systems & Components',
    description: 'Premium-grade reinforced rubber conveyor belting engineered for rigorous industrial and mining operations. Designed to withstand high tensile stress, severe abrasion, impact gouging, and deep troughing, these belts are ideal for transporting run-of-mine ore, aggregate, gravel, and coal in both surface and underground environments.',
    priceEstimate: 185.00,
    specifications: [
      'Multi-ply synthetic EP (Polyester/Nylon) fabric carcass offering high modulus and low elongation',
      'Premium wear-resistant rubber covers designed for high abrasion (SANS 1173 Grade M)',
      'Intrinsically safe, flame-retardant, and anti-static compounds for underground mining applications',
      'High carcass-to-cover and inter-ply adhesion strength preventing delamination under extreme loads',
      'Excellent deep troughability supporting standard 35° and 45° idler roller configurations',
      'Reinforced molded or cut rubber edges to prevent moisture ingress and edge fraying'
    ],
    safetyStandards: ['SANS 1173 Compliant', 'ISO 340 (Flame Retardancy)', 'ISO 284 (Anti-Static Electrical Conductivity)', 'DIN 22102'],
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlKvVsOjTjHAcLrHZf_ZAWohG43vNiCdEQG3lHUxEw_cI3vJnoMOIwdmwK&s=10',
    stockStatus: 'In Stock',
    sizes: ['600mm Width x 100m Roll', '750mm Width x 100m Roll', '900mm Width x 100m Roll', '1050mm Width x 100m Roll', '1200mm Width x 100m Roll'],
    types: ['Grade M (High Abrasion & Gouge Resistant)', 'Grade N (General Purpose / Medium Duty)', 'Grade F (Flame-Retardant & Anti-Static Underground)']
  },
  {
    id: 'nd-hw-105',
    name: 'LED Intrinsically Safe Cap Lamp (Ex d)',
    category: 'Hardware',
    subcategory: 'Lighting & Safety',
    description: 'Explosion-proof, intrinsically safe LED mining helmet cap lamp with wireless rechargeable Li-ion battery. Features adjustable dual beam brightness and SOS rescue strobe mode.',
    priceEstimate: 120.00,
    specifications: [
      'Super bright CREE LED main light emitting up to 250 lumens (8000 lux at 1m)',
      'Integrated high-capacity rechargeable 6.4Ah Li-ion battery with 15h runtime on high beam',
      'Intrinsically safe IP68 ingress protection casing, gas-tight and impact-resistant polymer',
      'Two-stage adjustable optical system: spot beam for inspection and flood beam for general operations',
      'Supports standard wireless induction charging dock stations'
    ],
    safetyStandards: ['SANS 10108 Ex d I Mb (Coal Mines Approved)', 'IECEx certified', 'ATEX Zone 0'],
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgZZGCnW3SrGFohhu2Q5ShAId6b3nFKKvPSrXYxuOsMA&s=10',
    stockStatus: 'In Stock',
    sizes: ['Universal Helmet Mount'],
    types: ['Wireless Cordless Edition', 'Corded Heavy Duty Battery Pack']
  },
  {
    id: 'nd-hw-106',
    name: 'Scrap Metal Services',
    category: 'Services',
    subcategory: 'Scrap Metal & Recovery',
    description: 'We provides comprehensive industrial scrap metal recycling and trading services. We specialize in both buying industrial scrap metal at highly competitive market-indexed rates, and reselling premium processed ferrous and non-ferrous scrap metals to foundries, mills, and manufacturing partners. Complete with heavy-duty roll-on/roll-off bin placement, certified digital weighbridge grading, and full environmental compliance.',
    priceEstimate: 1.95,
    specifications: [
      'Scrap Buyback: We purchase industrial scrap metal (HMS, copper, aluminum, brass) directly from mining and construction sites',
      'Scrap Resale: We supply premium-grade, sorted, and processed ferrous and non-ferrous metals for industrial re-melting',
      'On-Site Bin Service: Free placement and collection of high-capacity skip bins (6m³ to 30m³) for structured on-site scrap collection',
      'Certified Weighbridge Assessment: Digital grading and weighing tickets supplied with every shipment to ensure absolute billing integrity',
      'Environmental Auditing: Provision of safe disposal reports, green recycling certificates, and waste destruction logs'
    ],
    safetyStandards: ['ISO 14001 Environmental Management', 'SANS 10234 Hazardous Materials Compliant', 'NEMWA (National Environmental Management: Waste Act) Approved'],
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJb3gSfFe1fLVQx8EHQeb6ccLvOW5-EPoS5bMd2Jqf2g&s=10',
    stockStatus: 'In Stock',
    sizes: ['We Buy Scrap Metal (Sell to Us)', 'We Sell Processed Scrap (Buy from Us)', '10-Tonne Skip Bin Request', '25-Tonne Roll-on/Roll-off Bin Request'],
    types: ['Ferrous Heavy Melting Steel (HMS 1 & 2)', 'Copper Scrap (Bright Common, Barley, Cables)', 'Industrial Aluminum Scrap (Extrusions, Sheets)', 'Red Metals (Brass & Bronze Salvage)', 'Spent Lead-Acid Battery Recovery']
  },
  {
    id: 'nd-hw-107',
    name: 'Double-Cartridge Dust & Gas Respirator',
    category: 'Hardware',
    subcategory: 'PPE & Wearables',
    description: 'Industrial-grade half-face double-cartridge gas mask designed to provide highly effective protection against fine silica dust, organic gases, and acidic vapours in deep underground mine shafts.',
    priceEstimate: 55.00,
    specifications: [
      'Soft medical-grade silicone face-seal for maximum airtight custom contour fit',
      'Dual-cartridge design with highly efficient particulate carbon filters',
      'Easy adjustable four-point head harness with quick release neck strap',
      'Exhalation valve designed to minimize breathing resistance and hot air buildup',
      'Highly compatible with standard protective goggles, safety helmets, and ear muffs'
    ],
    safetyStandards: ['SANS 50140', 'EN 140:1998 Class 1', 'NIOSH N95/P100 Approved'],
    image: 'https://mineafrica.co.za/image/cache/catalog/XMASKS-005-removebg-preview-800x800.png',
    stockStatus: 'In Stock',
    sizes: ['Medium (Standard Face)', 'Large (Broad Face)'],
    types: ['Silica Dust P3 Cartridges Included', 'Multi-Gas Organic Vapor Protection Kit']
  },
  {
    id: 'nd-hw-108',
    name: 'Labour Hire Services',
    category: 'Services',
    subcategory: 'On-Site Skilled Trades',
    description: 'Professional, fully-vetted, and safety-inducted skilled labour hire for underground and open-cast mining sites. Ndulu provides highly qualified trade specialists equipped with complete certified industrial PPE, active medical Red Tickets, and rigorous safety training.',
    priceEstimate: 65.00,
    specifications: [
      'Pre-inducted tradespeople with active mining-medical clearance (Red Tickets)',
      'Fully equipped with certified Level 2/3 PPE from our premium stock',
      'Available for short-term emergency shutdowns, planned maintenance, or long-term contracts',
      'Extensively screened for safety compliance, hazard identification, and risk assessment',
      'Includes active on-site supervisor co-ordination for teams exceeding 5 personnel'
    ],
    safetyStandards: ['SANS 10147 Compliant', 'ISO 45001 Occupational Health & Safety', 'MQA (Mining Qualifications Authority) Accredited'],
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOsq1LCKYJYEvBcmJmF1amy2rqRFpu-9xg_HG3rg_yaz4a-v5Oc-Rnq5Zk&s=10',
    stockStatus: 'In Stock',
    sizes: ['Single Shift (8 Hours)', 'Double Shift (16 Hours)', 'Weekly Placement Contract', 'Monthly Ongoing Contract'],
    types: ['Certified Coded Welder / Boilermaker', 'Mechanical Fitter', 'Heavy Equipment & Excavator Operator', 'Underground Shaft Rigger', 'Safety Officer / Inspector']
  },
  {
    id: 'nd-hw-109',
    name: 'Solar Installation Services',
    category: 'Services',
    subcategory: 'Clean Energy & Solar',
    description: 'Professional, custom-engineered commercial & industrial solar PV installation services designed to dramatically reduce operational electricity costs, ensure business continuity during grid outages, and meet corporate ESG sustainability metrics. We deliver complete turn-key solutions including expert solar engineering, Tier-1 hardware procurement, municipal grid-tie compliance approval, and long-term performance monitoring.',
    priceEstimate: 12500.00,
    specifications: [
      'Comprehensive on-site solar assessment, building roof structural scanning, and solar irradiance modeling',
      'High-efficiency Tier-1 monocrystalline PV solar panels with minimum 25-year linear output guarantees',
      'Industrial-grade smart hybrid and grid-tied inverters equipped with real-time cloud analytics and IoT monitoring',
      'Custom-engineered, wind-tunnel tested mounting structures (roof-integrated, flat-roof ballasted, or ground-mount)',
      'Professional electrical engineering (Pr.Eng) sign-off and municipal/SENELEC/NERSA grid-tie connection applications',
      'Seamless integration with Containerized Battery Energy Storage Systems (BESS) for load-shedding mitigation and peak shaving'
    ],
    safetyStandards: ['SANS 10142-1 (Wiring of Premises)', 'NRS 097-2-1 Grid Interconnection Compliance', 'SAPVIA (PV GreenCard Accredited)', 'OHS Act Safety Regulations'],
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=500&q=80',
    stockStatus: 'In Stock',
    sizes: ['50 kWp Commercial System', '100 kWp Mid-Scale Industrial Plant', '250 kWp High-Capacity System', 'Custom Megawatt Utility Installation'],
    types: ['Grid-Tied Solar System (Energy Cost Reduction)', 'Hybrid Solar System (Outage & Load-Shedding Protection)', 'Off-Grid Solar System with Dedicated BESS Backup']
  },
  {
    id: 'nd-srv-116',
    name: 'Industrial Food Supplying & Camp Catering',
    category: 'Services',
    subcategory: 'Food & Catering Services',
    description: 'Full-scale industrial food supplying, daily shift meal catering, canteen management, and cold-chain ration distribution for subterranean mining camps, industrial processing plants, and corporate field sites. We ensure high-calorie, hygienically prepared, nutrition-balanced meals for shift workers under strict food safety and HACCP standards.',
    priceEstimate: 0,
    specifications: [
      'Full-service daily meal catering for 24/7 rotational mining crew shifts',
      'HACCP certified kitchen hygiene, temperature-controlled food transport, and certified food handlers',
      'Nutritionally balanced high-energy meal plans customized for underground physical labor requirements',
      'Flexible site solutions: mobile catering units, full canteen management, or bulk packaged shift meal boxes',
      'On-site food safety officer supervision and strict allergen & dietary management'
    ],
    safetyStandards: ['HACCP Certified', 'SANS 10049 Food Safety Management', 'ISO 22000 Food Safety', 'OHS Act Sanitation Standards'],
    image: industrialFoodSupplyImg,
    stockStatus: 'In Stock',
    sizes: ['Shift Pack (50 - 150 Workers)', 'Mid-Size Crew (150 - 500 Workers)', 'Large Mine Complex (500+ Workers)', 'Custom Remote Camp Contract'],
    types: ['Full Canteen & Kitchen Management', '3-Shift Packaged Hot Meal Delivery', 'Cold-Chain Bulk Grocery & Dry Provisions Supply']
  },
  {
    id: 'nd-hw-110',
    name: 'Heavy-Duty Impact Mechanical Gloves',
    category: 'Hardware',
    subcategory: 'PPE & Wearables',
    description: 'High-performance synthetic leather mechanical work gloves with thermoplastic rubber (TPR) exoskeleton impact protection across fingers and knuckles, anti-vibration gel palm padding, and reinforced grip seams for heavy machinery and tool handling.',
    priceEstimate: 0,
    specifications: [
      'Heavy-duty TPR exoskeleton for knuckle, pinch-point, and impact protection',
      'Synthetic leather palm with reinforced Kevlar stitching at high-wear zones',
      'Vibration-dampening gel palm padding for operating pneumatic drills and heavy tools',
      'Breathable air-mesh back with secure neoprene cuff and hook-and-loop wrist closure',
      'High dexterity grip for precise mechanical and assembly work'
    ],
    safetyStandards: ['EN 388:2016 (4121XP)', 'SANS 1224 Compliant', 'CE Certified'],
    image: mechanicalGlovesImg,
    stockStatus: 'In Stock',
    sizes: ['Size 8 (Medium)', 'Size 9 (Large)', 'Size 10 (X-Large)', 'Size 11 (2X-Large)'],
    types: ['High-Impact TPR Protection', 'Anti-Vibration Padded Palm', 'Cut-Resistant Level A4 Edition']
  },
  {
    id: 'nd-hw-111',
    name: 'Industrial Chemical & Acid PVC Gloves',
    category: 'Hardware',
    subcategory: 'PPE & Wearables',
    description: 'Heavy-duty red PVC gauntlet gloves with soft cotton interlock lining, rough textured finish for wet oil/chemical grip, and extended forearm cuffs providing maximum chemical, liquid, and puncture resistance.',
    priceEstimate: 0,
    specifications: [
      'Double-dipped high-grade PVC coating resistant to acids, alkalis, oils, and leachates',
      'Granulated textured palm and finger surface for superior non-slip wet grip',
      'Soft 100% cotton interlock liner for moisture absorption and thermal insulation',
      'Extended 27cm to 40cm gauntlet lengths for forearm protection against liquid splashes',
      'Flexible ergonomic hand shape reducing fatigue during prolonged chemical handling'
    ],
    safetyStandards: ['EN 374-1:2016 Type A (AKLMPST)', 'EN 388 (4121X)', 'SANS 1224 Chemical Standard'],
    image: pvcGlovesImg,
    stockStatus: 'In Stock',
    sizes: ['Size 9 (Large)', 'Size 10 (X-Large)'],
    types: ['27cm Standard Wrist Gauntlet', '35cm Forearm Length Gauntlet', '40cm Shoulder Extended Gauntlet']
  },
  {
    id: 'nd-hw-112',
    name: 'Heavy-Duty Chrome Leather Welding Apron',
    category: 'Hardware',
    subcategory: 'PPE & Wearables',
    description: 'Premium split chrome cowhide leather protective apron built for severe welding, grinding, and metal foundry environments. Features Kevlar heat-resistant stitching and adjustable cross-back harness straps.',
    priceEstimate: 0,
    specifications: [
      'Heavy-duty 1.2mm - 1.4mm premium split cowhide chrome leather construction',
      'Stitched entirely with heat-resistant 5-ply Dupont Kevlar thread for maximum seam integrity',
      'Self-balancing cross-back harness system distributing weight evenly to reduce neck strain',
      'Heavy-duty quick-release brass buckles and reinforced stress point rivets',
      'Superior thermal barrier protecting against hot spatter, sparks, slag, and radiant heat'
    ],
    safetyStandards: ['EN ISO 11611:2015 Class 2 A1', 'SANS 434 Leather Protective Gear', 'CE Certified'],
    image: leatherApronImg,
    stockStatus: 'In Stock',
    sizes: ['60cm x 90cm Standard', '60cm x 120cm Extended Coverage'],
    types: ['Single Piece Chrome Leather', 'Split Leg Mobility Edition', 'Reinforced Front Bib Pocket Edition']
  },
  {
    id: 'nd-hw-113',
    name: 'High-Impact Industrial Safety Face Shield',
    category: 'Hardware',
    subcategory: 'PPE & Wearables',
    description: 'Clear, high-impact polycarbonate full-face shield visor with ratcheting headgear suspension, anti-fog inner coating, and aluminum bound edge providing full facial coverage against flying debris, chemical splashes, and sparks.',
    priceEstimate: 0,
    specifications: [
      '2.0mm thick optical-grade high-impact clear polycarbonate visor (UV400 protection)',
      'Ergonomic crown protector with smooth ratchet-adjustment head harness and plush sweatband',
      'Anti-fog and scratch-resistant hard coat on both visor surfaces',
      'Aluminum edge trim allowing custom shaping and extra structural rigidity',
      'Universal slot adapter option for direct hard hat/helmet mounting'
    ],
    safetyStandards: ['SANS 1400 / EN 166 1 B 3 9', 'ANSI Z87.1+ High Impact Approved', 'CE Certified'],
    image: faceShieldImg,
    stockStatus: 'In Stock',
    sizes: ['Universal Adjustable Headgear', 'Universal Helmet Slot Adapter'],
    types: ['Clear Polycarbonate (Impact & Splash)', 'Gold-Coated Radiant Heat Reflection', 'IR Shade 5 Welding / Plasma Cutting Visor']
  },
  {
    id: 'nd-hw-114',
    name: 'Prime Bond Industrial High-Temperature Silicone Sealant',
    category: 'Hardware',
    subcategory: 'Rigging & Tools',
    description: 'Industrial-grade RTV silicone adhesive sealant engineered for heavy-duty sealing, flange gasketing, waterproof jointing, and high-vibration applications across mechanical equipment, ducting, and piping.',
    priceEstimate: 0,
    specifications: [
      'Neutral-cure 100% silicone formulation providing non-corrosive adhesion to metals and plastics',
      'High thermal resistance operating continuously from -60°C to +300°C',
      'Excellent resistance to weather, UV radiation, mine water, oils, and industrial chemicals',
      'High tensile strength and permanent flexibility accommodating structural expansion and joint movement',
      '310ml standard cartridge suitable for industrial caulking applicator guns'
    ],
    safetyStandards: ['SANS 1078 Industrial Sealants', 'ASTM C920 Type S Grade NS', 'ISO 11600'],
    image: primeBondSiliconeImg,
    stockStatus: 'In Stock',
    sizes: ['310ml Cartridge', 'Box of 12 Cartridges', 'Box of 24 Cartridges'],
    types: ['Clear Multi-Purpose Sealant', 'Black High-Temp RTV Gasket Sealant', 'Red Ultra-High Temp (300°C) Flange Sealant']
  },
  {
    id: 'nd-hw-115',
    name: 'Heavy-Duty Industrial Nylon Cable Ties (Pack of 100)',
    category: 'Hardware',
    subcategory: 'Rigging & Tools',
    description: 'High tensile strength UV-stabilized Nylon 66 cable ties designed for bundling heavy electrical cables, mining hoses, temporary piping, and industrial rigging. Supplied in sealed bulk packets of 100 units.',
    priceEstimate: 0,
    specifications: [
      'Manufactured from virgin Nylon 6/6 with carbon black additives for maximum UV weather resistance',
      'Internal self-locking non-reversible pawl mechanism providing reliable high loop tensile strength',
      'Smooth rounded edges preventing insulation chafe or damage to heavy rubber cables and hydraulic hoses',
      'Flame retardant UL 94V-2 rating and wide temperature tolerance (-40°C to +85°C)',
      '100 units per heavy-duty sealed industrial resealable pack'
    ],
    safetyStandards: ['UL Recognized E258780', 'CE / RoHS Compliant', 'SANS 62275 Cable Management'],
    image: packetCableTiesImg,
    stockStatus: 'In Stock',
    sizes: ['200mm x 4.8mm (Pack of 100)', '300mm x 4.8mm (Pack of 100)', '370mm x 7.6mm Heavy Duty (Pack of 100)', '500mm x 9.0mm Ultra Heavy Duty (Pack of 100)'],
    types: ['UV Black Industrial Grade', 'Natural Clear Indoor Grade', 'Stainless Steel Locking Barb High-Tensile']
  },
  {
    id: 'nd-spr-201',
    name: 'Heavy-Duty Hydraulic Cylinders & Seal Rebuild Kits',
    category: 'Heavy Duty Spares',
    subcategory: 'Earthmoving & Mining Hydraulics',
    description: 'OEM-grade double-acting heavy industrial hydraulic cylinders, hard-chrome plated induction-hardened piston rods, high-pressure polyurethane seal kits, and swivel eye mountings engineered for open-pit mining excavators, wheel loaders, and articulated dump trucks.',
    priceEstimate: 1450.00,
    specifications: [
      'Operating working pressure rated up to 350 bar (5,000 PSI) with 4:1 safety factor',
      'Induction-hardened, micro-crack hard-chrome plated steel rod (minimum 30µm chrome layer)',
      'High-integrity polyurethane U-cup rod seals, double-lip wiper seals, and bronze-filled PTFE wear rings',
      'Precision-honed high-yield carbon steel cylinder barrel (St52.3 / DIN 2391 standard)',
      'Direct fitment compatibility: Caterpillar (336/349/374), Komatsu (PC400/PC800/PC1250), Volvo (EC480/EC750), Bell Equipment'
    ],
    safetyStandards: ['ISO 6020/2 Hydraulic Standard', 'DIN 24554 Industrial Fluid Power', 'OEM Dimensional Tolerance Certified'],
    image: heavyDutyHydraulicsImg,
    stockStatus: 'In Stock',
    sizes: ['Boom Lift Cylinder Assembly', 'Arm / Stick Cylinder Assembly', 'Bucket Tilt Cylinder Assembly', 'Complete Polyurethane Hydraulic Seal Rebuild Kit'],
    types: ['CAT Excavator Direct Fit', 'Komatsu Mining Excavator Spec', 'Universal Heavy Equipment Custom Stroke']
  },
  {
    id: 'nd-spr-202',
    name: 'Manganese Crusher Jaw Plates & Cone Mantle Liners',
    category: 'Heavy Duty Spares',
    subcategory: 'Crushing & Milling Wear Spares',
    description: 'Severe-duty austenitic manganese steel jaw plates, cheek plates, cone crusher mantles, and concave bowl liners engineered for primary and secondary copper ore reduction plants. Features severe work-hardening under high compressive impact loading.',
    priceEstimate: 3200.00,
    specifications: [
      'Mn18Cr2 and Mn22Cr2 high-manganese cast alloy with work-hardening surface hardness reaching 500+ HBW',
      'Engineered tooth and corrugation profiles optimized for maximum throughput and uniform cubical product output',
      'Precision CNC-machined backing faces ensuring vibration-free tight fitment against crusher mainframe',
      'Supplied complete with high-tensile locking bolts, wedges, zinc backing compound, and lifting lugs',
      'Proven extended operational lifespan in harsh Copperbelt copper, cobalt, and gold ore crushing circuits'
    ],
    safetyStandards: ['ASTM A128 / A128M High Manganese Standard', 'ISO 9001 Foundry Certified', 'SABS / OHS Heavy Rigging Protocol'],
    image: crusherWearSparesImg,
    stockStatus: 'In Stock',
    sizes: ['Primary Jaw Crusher (Fixed & Swing Set)', 'Cone Crusher Mantle & Bowl Liner Set', 'Cheek Plates & Wedges Service Pack'],
    types: ['Mn18Cr2 Standard Heavy Ore', 'Mn22Cr2 Severe Impact & High-Silica Grade', 'Deep-Corrugated High-Capacity Profile']
  },
  {
    id: 'nd-spr-203',
    name: 'High-Chrome Slurry Pump Impellers & Casing Liners',
    category: 'Heavy Duty Spares',
    subcategory: 'Slurry Handling & Mineral Processing',
    description: 'Ultra-abrasion and corrosion-resistant high-chrome white iron (A05 / 27% Cr) slurry pump impellers, volute liners, throatbushes, and frame plate liner inserts designed for heavy abrasive mineral slurry transfer, tailings discharge, and cyclone feeds.',
    priceEstimate: 2150.00,
    specifications: [
      'Cast in premium high-chrome alloy iron (ASTM A532 Class III Type A, 27% Chromium, 650+ HBW hardness)',
      'Dynamically balanced 5-vane / 4-vane closed impeller designs maximizing hydraulic efficiency and reducing wear erosion',
      'Thickened wear sections at leading vane edges and cutwater zones for extended campaign lifecycles',
      'Heavy-duty shaft sleeve (420 stainless steel / ceramic coated) and expeller mechanical gland seal assemblies',
      'Interchangeable fitment with industry-standard 10/8, 8/6, 6/4, and 4/3 centrifugal heavy mining slurry pumps'
    ],
    safetyStandards: ['ASTM A532 / A532M High-Chrome White Iron', 'ISO 9906 Hydraulic Pump Testing Class 2', 'Mining Machinery Pressure Test Certified'],
    image: slurryPumpSparesImg,
    stockStatus: 'In Stock',
    sizes: ['4/3 E-AH Heavy Slurry Spares', '6/4 E-AH High-Capacity Spares', '8/6 E-AH Primary Mill Circuit Spares', '10/8 Heavy Duty Tailings Spares'],
    types: ['High-Chrome A05 Alloy (Severe Abrasive Slurry)', 'Rubber-Lined Impeller & Liner Pack (Fine Corrosive Acid Tails)', 'Gland Shaft Sleeve & Expeller Seal Kit']
  }
];
