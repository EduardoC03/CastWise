/**
 * COMPLETE SPECIES CATALOG — UPGRADE 2
 * Sourced from WDFW (wdfw.wa.gov) and eRegulations.
 * Data attributed to Washington Dept. of Fish & Wildlife.
 */

export const speciesCatalog = [
  // --- FRESHWATER FISH: Salmon & Trout ---
  {
    id: 'chinook',
    name: 'Chinook Salmon',
    scientificName: 'Oncorhynchus tshawytscha',
    category: 'Anadromous',
    description: 'The largest Pacific salmon, known for its powerful build and black spots on both tail lobes. Also called "King Salmon" or "Blackmouth" in its immature saltwater stage.',
    record: '68.26 lbs (Elochoman River)',
    season: 'Varies by river (Summer/Fall peak)',
    habitat: 'Major rivers and Puget Sound',
    quickTip: 'Target deep pools in rivers. Use large spinners or drifted bait.'
  },
  {
    id: 'coho',
    name: 'Coho Salmon',
    scientificName: 'Oncorhynchus kisutch',
    category: 'Anadromous',
    description: 'Silver-sided salmon with small spots only on the upper lobe of the tail. Known for their aggressive nature and spectacular jumping when hooked.',
    record: '25.34 lbs (Quinault River)',
    season: 'August – December',
    habitat: 'Coastal streams and Puget Sound tributaries',
    quickTip: 'Aggressive biters. Twitching jigs or small spoons are highly effective.'
  },
  {
    id: 'sockeye',
    name: 'Sockeye Salmon',
    scientificName: 'Oncorhynchus nerka',
    category: 'Anadromous',
    description: 'Bright red body with a green head during spawning. They lack distinct black spots on their back or tail, unlike other Pacific salmon.',
    record: '10.63 lbs (Cedar River)',
    season: 'June – August',
    habitat: 'Lake-fed river systems (e.g., Lake Washington, Baker Lake)',
    quickTip: 'Slow trollers using small hootchies often find success in lakes.'
  },
  {
    id: 'pink',
    name: 'Pink Salmon',
    scientificName: 'Oncorhynchus gorbuscha',
    category: 'Anadromous',
    description: 'The smallest Pacific salmon, featuring large oval black spots on their back and tail. Males develop a massive humped back during spawning.',
    record: '15.4 lbs (Skykomish River)',
    season: 'August – September (Odd years)',
    habitat: 'Lower reaches of coastal rivers',
    quickTip: 'Pink jigs and small pink lures are the gold standard for "Humpies".'
  },
  {
    id: 'chum',
    name: 'Chum Salmon',
    scientificName: 'Oncorhynchus keta',
    category: 'Anadromous',
    description: 'Develops distinct purple/green vertical bars on their sides during spawning. They have large "dog-like" teeth and no distinct black spots.',
    record: '25.3 lbs (Clearwater River)',
    season: 'October – January',
    habitat: 'Coastal rivers and Puget Sound',
    quickTip: 'Float-fishing with purple or green jigs is a popular tactic.'
  },
  {
    id: 'steelhead',
    name: 'Steelhead',
    scientificName: 'Oncorhynchus mykiss',
    category: 'Anadromous',
    description: 'Anadromous (sea-run) form of rainbow trout. They are sleek, silver, and famous for their incredible fighting ability and aerial acrobatics.',
    record: '32.73 lbs (East Fork Lewis River)',
    season: 'Year-round (Winter/Summer runs)',
    habitat: 'Fast-moving rivers and streams',
    quickTip: 'Check specific river rules; many require release of wild (unclipped) fish.'
  },
  {
    id: 'rainbow-trout',
    name: 'Rainbow Trout',
    scientificName: 'Oncorhynchus mykiss',
    category: 'Freshwater',
    description: 'Features a brilliant pinkish-red lateral stripe and black spots across the body and fins. The most widely stocked game fish in Washington.',
    record: '29.6 lbs (Rufus Woods Lake)',
    season: 'Year-round (Spring peak)',
    habitat: 'Lakes, ponds, and cold-water streams',
    quickTip: 'PowerBait in lakes or small flies in streams work consistently.'
  },
  {
    id: 'cutthroat-trout',
    name: 'Coastal Cutthroat Trout',
    scientificName: 'Oncorhynchus clarkii clarkii',
    category: 'Anadromous',
    description: 'Identified by the bright orange-red "slash" marks under the lower jaw. They are heavily spotted and very aggressive towards lures.',
    record: '6 lbs (Lake Crescent)',
    season: 'Year-round',
    habitat: 'Coastal streams, lakes, and saltwater estuaries',
    quickTip: 'Small spoons or spinners near structure often trigger strikes.'
  },
  {
    id: 'brown-trout',
    name: 'Brown Trout',
    scientificName: 'Salmo trutta',
    category: 'Freshwater',
    description: 'Golden-brown color with large dark spots and red spots often surrounded by blue halos. Known for being more elusive than other trout.',
    record: '22 lbs (Sullivan Lake)',
    season: 'Year-round',
    habitat: 'Deep lakes and larger river systems',
    quickTip: 'Low-light periods are best; they are often nocturnal hunters.'
  },
  {
    id: 'brook-trout',
    name: 'Brook Trout',
    scientificName: 'Salvelinus fontinalis',
    category: 'Freshwater',
    description: 'Technically a char, featuring light spots on a dark background and worm-like markings (vermiculations) on the back.',
    record: '9.3 lbs (Clear Lake)',
    season: 'Year-round',
    habitat: 'High mountain lakes and cold headwater streams',
    quickTip: 'Worms or small spinners work well for these colorful fish.'
  },

  // --- FRESHWATER: Warmwater & Other ---
  {
    id: 'largemouth-bass',
    name: 'Largemouth Bass',
    scientificName: 'Micropterus salmoides',
    category: 'Freshwater',
    description: 'Deep green body with a dark lateral stripe. Their jaw extends past the back of the eye. Prefer warm, weedy waters.',
    record: '12.5 lbs (Lake-of-the-Woods)',
    season: 'April – October',
    habitat: 'Lowland lakes and slow-moving sloughs',
    quickTip: 'Fish near lily pads or fallen timber with soft plastics.'
  },
  {
    id: 'smallmouth-bass',
    name: 'Smallmouth Bass',
    scientificName: 'Micropterus dolomieu',
    category: 'Freshwater',
    description: 'Bronze-colored with vertical bars on the sides. They are legendary fighters, often found in rocky or faster-moving water than largemouths.',
    record: '8.75 lbs (Hanford Reach, Columbia River)',
    season: 'April – October',
    habitat: 'Large rivers (Columbia/Snake) and rocky lakes',
    quickTip: 'Crankbaits and tubes near rocky drop-offs are key.'
  },
  {
    id: 'walleye',
    name: 'Walleye',
    scientificName: 'Sander vitreus',
    category: 'Freshwater',
    description: 'Long, olive-colored body with a distinct glassy white eye adapted for low-light hunting. Highly prized for their delicious flaky white meat.',
    record: '19.3 lbs (Columbia River)',
    season: 'Year-round',
    habitat: 'Columbia River, Snake River, and large reservoirs',
    quickTip: 'Fish deep near the bottom with jig-and-minnow combinations.'
  },
  {
    id: 'yellow-perch',
    name: 'Yellow Perch',
    scientificName: 'Perca flavescens',
    category: 'Freshwater',
    description: 'Yellowish-green with 6-8 dark vertical bars. A popular panfish often found in large schools near the bottom.',
    record: '2.75 lbs (Snohomish County lake)',
    season: 'Year-round',
    habitat: 'Most lowland lakes throughout Washington',
    quickTip: 'A simple worm on a hook near the bottom is all you need.'
  },
  {
    id: 'white-sturgeon',
    name: 'White Sturgeon',
    scientificName: 'Acipenser transmontanus',
    category: 'Freshwater',
    description: 'Ancient, long-lived fish with bony scutes instead of scales. They have a flat snout and four barbels near their vacuum-like mouth.',
    record: 'No modern record (Catch & Release only in many areas)',
    season: 'Varies (Check WDFW emergency rules)',
    habitat: 'Columbia, Snake, and Fraser River systems',
    quickTip: 'Heavy gear is mandatory; use fresh smelt or squid for bait.'
  },

  // --- SALTWATER FISH ---
  {
    id: 'halibut',
    name: 'Pacific Halibut',
    scientificName: 'Hippoglossus stenolepis',
    category: 'Saltwater',
    description: 'The largest flatfish in the world, diamond-shaped with both eyes on the dark upper side. Highly sought after for their firm, white fillets.',
    record: '288 lbs (Swiftsure Bank)',
    season: 'May – June (Highly restricted)',
    habitat: 'Deep ocean banks and coastal waters',
    quickTip: 'Large circle hooks with herring or octopus work best.'
  },
  {
    id: 'lingcod',
    name: 'Lingcod',
    scientificName: 'Ophiodon elongatus',
    category: 'Saltwater',
    description: 'Not a true cod, but a member of the greenling family. Known for their large, toothy mouths and aggressive strikes.',
    record: '61 lbs (San Juan Islands)',
    season: 'May – June (Check Marine Area rules)',
    habitat: 'Rocky reefs and submerged structures',
    quickTip: 'Large lead-head jigs or live greenling (where legal) are deadly.'
  },
  {
    id: 'yelloweye-rockfish',
    name: 'Yelloweye Rockfish',
    scientificName: 'Sebastes ruberrimus',
    category: 'Saltwater',
    description: 'One of the longest-lived fish in the world. Bright orange-red body with distinctive yellow eyes. Protected in Puget Sound.',
    record: '34 lbs (Cape Flattery)',
    season: 'Closed in most areas (Strict release rules)',
    habitat: 'Deep rocky reefs (60 – 1000+ feet)',
    quickTip: 'Descending devices are required for releasing rockfish.'
  },

  // --- CRAB & SHRIMP ---
  {
    id: 'dungeness-crab',
    name: 'Dungeness Crab',
    scientificName: 'Metacarcinus magister',
    category: 'Crab & Shrimp',
    description: "Washington's most iconic shellfish. Tan-brown shell with white-tipped claws and a distinctive toothed front edge on the carapace.",
    record: 'N/A (Size limit 6.25" for males)',
    season: 'July – September (Varies by area)',
    habitat: 'Sandy or muddy bottoms in Puget Sound and Coast',
    quickTip: 'Use fresh salmon carcasses or chicken for bait in pots.'
  },
  {
    id: 'spot-shrimp',
    name: 'Spot Shrimp',
    scientificName: 'Pandalus platyceros',
    category: 'Crab & Shrimp',
    description: 'The largest shrimp in Washington, identified by two white spots on the side of the abdomen. Known for their sweet, lobster-like flavor.',
    record: 'N/A',
    season: 'May – July (Short windows)',
    habitat: 'Deep rocky bottoms (200 – 400 feet)',
    quickTip: 'Heavy weighted pots are needed to reach their deep haunts.'
  }
];
