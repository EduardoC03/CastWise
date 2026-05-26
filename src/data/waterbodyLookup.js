/**
 * WATERBODY LOOKUP DATA — PART 1 & 2
 * Hardcoded species data for top 50 WA waterbodies.
 * Salmon migration calendar and hotspot locations.
 */

export const topWaterbodies = {
  "Lake Washington": ["Chinook Salmon", "Coho Salmon", "Sockeye Salmon", "Rainbow Trout", "Cutthroat Trout", "Largemouth Bass", "Smallmouth Bass", "Yellow Perch"],
  "Lake Chelan": ["Kokanee Salmon", "Lake Trout", "Rainbow Trout", "Chinook Salmon", "Smallmouth Bass", "Burbot"],
  "Columbia River": ["Chinook Salmon", "Coho Salmon", "Sockeye Salmon", "Steelhead", "White Sturgeon", "Walleye", "Smallmouth Bass", "Shad"],
  "Snake River": ["Chinook Salmon", "Steelhead", "White Sturgeon", "Smallmouth Bass", "Walleye", "Channel Catfish"],
  "Puget Sound": ["Chinook Salmon", "Coho Salmon", "Pink Salmon", "Chum Salmon", "Lingcod", "Pacific Halibut", "Rockfish", "Dungeness Crab"],
  "Lake Stevens": ["Kokanee Salmon", "Largemouth Bass", "Smallmouth Bass", "Rainbow Trout", "Yellow Perch"],
  "Banks Lake": ["Walleye", "Smallmouth Bass", "Largemouth Bass", "Yellow Perch", "Rainbow Trout", "Kokanee Salmon", "Crappie"],
  "Green River": ["Chinook Salmon", "Coho Salmon", "Chum Salmon", "Steelhead", "Rainbow Trout", "Cutthroat Trout"],
  "Yakima River": ["Rainbow Trout", "Westslop Cutthroat Trout", "Chinook Salmon", "Coho Salmon", "Smallmouth Bass"],
  "Snohomish River": ["Coho Salmon", "Pink Salmon", "Chum Salmon", "Chinook Salmon", "Steelhead", "Bull Trout"],
  "Skagit River": ["Chinook Salmon", "Coho Salmon", "Pink Salmon", "Chum Salmon", "Sockeye Salmon", "Steelhead", "Bull Trout", "Dolly Varden"],
  "Puyallup River": ["Chinook Salmon", "Coho Salmon", "Pink Salmon", "Chum Salmon", "Steelhead"],
  "Lake Sammamish": ["Chinook Salmon", "Coho Salmon", "Cutthroat Trout", "Largemouth Bass", "Smallmouth Bass", "Yellow Perch"],
  "Lake Whatcom": ["Kokanee Salmon", "Smallmouth Bass", "Cutthroat Trout", "Yellow Perch"],
  "Baker Lake": ["Sockeye Salmon", "Kokanee Salmon", "Bull Trout", "Dolly Varden"],
  "Ross Lake": ["Rainbow Trout", "Bull Trout", "Dolly Varden"],
  "Lake Wenatchee": ["Sockeye Salmon", "Chinook Salmon", "Bull Trout", "Dolly Varden", "Rainbow Trout"],
  "Spokane River": ["Rainbow Trout", "Brown Trout", "Smallmouth Bass", "Walleye"],
  "Lake Roosevelt": ["Walleye", "Rainbow Trout", "Kokanee Salmon", "Smallmouth Bass", "Burbot", "White Sturgeon"],
  "Moses Lake": ["Walleye", "Largemouth Bass", "Smallmouth Bass", "Yellow Perch", "Crappie", "Rainbow Trout"],
  "Potholes Reservoir": ["Walleye", "Largemouth Bass", "Smallmouth Bass", "Yellow Perch", "Crappie", "Rainbow Trout"],
  "Hood Canal": ["Coho Salmon", "Chum Salmon", "Chinook Salmon", "Dungeness Crab", "Spot Shrimp", "Rockfish"],
  "Grays Harbor": ["Chinook Salmon", "Coho Salmon", "Steelhead", "Dungeness Crab"],
  "Willapa Bay": ["Chinook Salmon", "Coho Salmon", "Chum Salmon", "Dungeness Crab", "Pacific Oysters"],
  "Hoh River": ["Chinook Salmon", "Coho Salmon", "Steelhead", "Cutthroat Trout"],
  "Queets River": ["Chinook Salmon", "Coho Salmon", "Steelhead", "Cutthroat Trout"],
  "Quinault River": ["Chinook Salmon", "Coho Salmon", "Sockeye Salmon", "Steelhead", "Bull Trout"],
  "Elwha River": ["Chinook Salmon", "Coho Salmon", "Steelhead", "Bull Trout", "Rainbow Trout"],
  "Sol Duc River": ["Chinook Salmon", "Coho Salmon", "Steelhead", "Cutthroat Trout"],
  "Klickitat River": ["Chinook Salmon", "Coho Salmon", "Steelhead"],
  "Lewis River": ["Chinook Salmon", "Coho Salmon", "Steelhead"],
  "Cowlit River": ["Chinook Salmon", "Coho Salmon", "Steelhead", "Smelt"],
  "Kalama River": ["Chinook Salmon", "Coho Salmon", "Steelhead"],
  "Deschutes River": ["Chinook Salmon", "Coho Salmon", "Steelhead", "Rainbow Trout"],
  "Nisqually River": ["Chinook Salmon", "Coho Salmon", "Chum Salmon", "Steelhead"],
  "Skokomish River": ["Chinook Salmon", "Coho Salmon", "Chum Salmon", "Steelhead"],
  "Skykomish River": ["Chinook Salmon", "Coho Salmon", "Pink Salmon", "Chum Salmon", "Steelhead"],
  "Stillaguamish River": ["Chinook Salmon", "Coho Salmon", "Pink Salmon", "Chum Salmon", "Steelhead"],
  "Lake Cushman": ["Kokanee Salmon", "Cutthroat Trout", "Chinook Salmon"],
  "Riffe Lake": ["Landlocked Coho", "Chinook Salmon", "Smallmouth Bass", "Rainbow Trout"],
  "Mayfield Lake": ["Tiger Muskie", "Rainbow Trout", "Chinook Salmon"],
  "Rimrock Lake": ["Kokanee Salmon", "Rainbow Trout"],
  "Lake Ozette": ["Sockeye Salmon", "Cutthroat Trout", "Yellow Perch"],
  "Lake Crescent": ["Beardslee Trout", "Crescenti Trout"],
  "American Lake": ["Kokanee Salmon", "Rainbow Trout", "Largemouth Bass", "Smallmouth Bass", "Yellow Perch"],
  "Clear Lake": ["Rainbow Trout", "Largemouth Bass", "Smallmouth Bass", "Yellow Perch"],
  "Silver Lake": ["Largemouth Bass", "Crappie", "Yellow Perch", "Rainbow Trout"],
  "Mineral Lake": ["Rainbow Trout", "Brown Trout", "Largemouth Bass"],
  "Lake Merwin": ["Kokanee Salmon", "Tiger Muskie", "Rainbow Trout"],
  "Yale Lake": ["Kokanee Salmon", "Rainbow Trout"]
};

export const salmonHotspots = [
  { name: "Columbia River (mouth)", coords: [46.2465, -124.0594], species: ["Chinook", "Coho"] },
  { name: "Columbia River (Bonneville)", coords: [45.6440, -121.9410], species: ["Chinook", "Coho", "Sockeye", "Steelhead"] },
  { name: "Columbia River (McNary)", coords: [45.9355, -119.2972], species: ["Chinook", "Steelhead", "Walleye"] },
  { name: "Snake River (confluence)", coords: [46.2058, -119.0292], species: ["Chinook", "Steelhead"] },
  { name: "Puget Sound (general)", coords: [47.6062, -122.4580], species: ["Chinook", "Coho", "Pink", "Chum"] },
  { name: "Skagit River", coords: [48.4244, -122.3362], species: ["Chinook", "Coho", "Pink", "Chum", "Sockeye", "Steelhead"] },
  { name: "Snohomish River", coords: [47.9138, -122.1573], species: ["Coho", "Pink", "Chum", "Steelhead"] },
  { name: "Green River", coords: [47.3281, -122.2126], species: ["Chinook", "Coho", "Chum", "Steelhead"] },
  { name: "Nisqually River", coords: [47.0892, -122.7035], species: ["Chinook", "Coho", "Chum", "Steelhead"] },
  { name: "Puyallup River", coords: [47.2048, -122.4217], species: ["Chinook", "Coho", "Pink", "Chum", "Steelhead"] },
  { name: "Skykomish River", coords: [47.8579, -121.9399], species: ["Chinook", "Coho", "Pink", "Chum", "Steelhead"] },
  { name: "Stillaguamish River", coords: [48.1718, -122.2718], species: ["Chinook", "Coho", "Pink", "Chum", "Steelhead"] },
  { name: "Hoh River", coords: [47.7577, -124.1476], species: ["Chinook", "Coho", "Steelhead"] },
  { name: "Queets River", coords: [47.5324, -124.2302], species: ["Chinook", "Coho", "Steelhead"] },
  { name: "Quinault River", coords: [47.4557, -123.8476], species: ["Chinook", "Coho", "Sockeye", "Steelhead"] },
  { name: "Elwha River", coords: [48.1218, -123.5635], species: ["Chinook", "Coho", "Steelhead"] },
  { name: "Lake Washington Ship Canal", coords: [47.6553, -122.3351], species: ["Sockeye", "Chinook", "Coho"] },
  { name: "Ballard Locks", coords: [47.6655, -122.3950], species: ["Sockeye", "Chinook", "Coho"] },
  { name: "Hood Canal (general)", coords: [47.6135, -122.9932], species: ["Coho", "Chum", "Chinook"] },
  { name: "Grays Harbor", coords: [46.9765, -124.1008], species: ["Chinook", "Coho", "Steelhead"] }
];

export const salmonCalendar = {
  "Chinook": [1, 1, 0, 0, 2, 2, 3, 3, 3, 2, 0, 0], // Jan=0, Feb=1, etc. Value is stars.
  "Coho":    [0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 2, 1],
  "Pink":    [0, 0, 0, 0, 0, 0, 1, 3, 3, 0, 0, 0], // Only odd years, logic in code
  "Chum":    [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 2],
  "Sockeye": [0, 0, 0, 0, 1, 3, 3, 2, 1, 0, 0, 0]
};
