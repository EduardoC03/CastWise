/**
 * CastWise content-based ranking.
 *
 * Input: angler profile (the shape Onboarding writes) + enriched sites (from SITES export)
 * Output: ranked list of { site, score, drivingFeatures } per the project schema.
 *
 * Design choices (called out for the writeup):
 *   - Weights are top-of-file constants. They are not learned. The professor's
 *     rubric values clear thinking over algorithmic complexity, and inspectable
 *     weights are easier to defend than a black box.
 *   - Each score component returns BOTH a 0..1 contribution AND a human label.
 *     The top 3 contributions per site become `drivingFeatures` — this is the
 *     "show your reasoning" piece the professor explicitly asked for.
 *   - Live conditions (weather, real-time stocking) are stubbed via the static
 *     `stocked` / `opening` fields on enriched sites. Architecture supports a
 *     live feed; the static version is honest about what's wired up today.
 *   - One "explore" slot per the business plan: a site that scored decently but
 *     missed the top 3, surfaced with explicit framing.
 */

// =========================================================================
// WEIGHTS — sum to 100. Edit here, not in scoring functions.
// =========================================================================
export const WEIGHTS = {
  distance:    25,  // does the site fit the angler's travel willingness?
  access:      20,  // does the site's access (bank/boat/wade) match preference?
  species:     20,  // does the site have species the angler wants?
  openStatus:  15,  // open year-round > seasonal-open-today > closed
  stocking:    10,  // recently stocked sites score higher (matters for trout)
  skillMatch:   5,  // beginners get easier sites; advanced get tougher ones
  adaBonus:     5,  // small bump for sites with ADA features (broad usefulness)
};

// =========================================================================
// VALUE NORMALIZERS — translate the human-readable Onboarding strings into
// machine values. We keep Onboarding's strings; we don't force lowercase.
// =========================================================================

// Approximate centroids per region. Used to compute distance.
const REGION_CENTROID = {
  'Northwest WA': { lat: 47.8, lng: -122.3 },  // Seattle/Everett/Bellingham
  'Southwest WA': { lat: 46.3, lng: -122.9 },  // Longview/Vancouver
  'Central WA':   { lat: 47.4, lng: -120.3 },  // Wenatchee/Yakima
  'Eastern WA':   { lat: 47.7, lng: -117.4 },  // Spokane
};

// Travel willingness in miles. "Local" caps tight; "Anywhere" effectively unlimited.
const TRAVEL_MILES = {
  'Local only (under 30 min)': 30,
  'Up to 1 hour':              60,
  'Up to 2 hours':             120,
  'Anywhere in WA':            400,
};

// Experience as numeric difficulty tolerance (0..1).
const EXPERIENCE_LEVEL = {
  'Beginner':     0.0,
  'Intermediate': 0.5,
  'Advanced':     1.0,
};

// Map Onboarding's `access` value to access verbs the site offers.
// Sites don't carry an `accessTypes` array; we derive from ramp/launch/platform counts.
function siteAccessTypes(site) {
  const types = [];
  if (site.fishingPlatforms > 0) types.push('Bank fishing');
  if (site.handLaunches > 0)     types.push('Wade fishing'); // hand launches imply small/shallow access
  if (site.boatRamps > 0)        types.push('Boat / kayak');
  // Every site allows shore access in some form even without a platform,
  // so we give bank fishing as a fallback for sites with restrooms (i.e., developed access).
  if (types.length === 0 && site.restrooms > 0) types.push('Bank fishing');
  return types;
}

// Map a user's `styles` selection to the species categories they likely want.
// Coarse — but the writeup explicitly frames this as content-based, not ML.
const STYLE_TO_SPECIES = {
  'Spin fishing':  ['Bass', 'Trout', 'Walleye', 'Perch', 'Salmon', 'Steelhead'],
  'Fly fishing':   ['Trout', 'Steelhead', 'Salmon'],
  'Bait fishing':  ['Trout', 'Bass', 'Perch', 'Catfish', 'Salmon'],
  'Trolling':      ['Salmon', 'Kokanee', 'Walleye', 'Trout', 'Lingcod'],
  'Ice fishing':   ['Trout', 'Perch'],
};

// =========================================================================
// GEOMETRY — haversine distance, miles.
// =========================================================================
function haversineMiles(a, b) {
  const R = 3958.8;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// =========================================================================
// SCORE COMPONENTS — each returns { value: 0..1, label, detail } so the
// driving-features explainer can quote them verbatim.
// =========================================================================

function scoreDistance(profile, site) {
  const home = REGION_CENTROID[profile.region] || REGION_CENTROID['Northwest WA'];
  const miles = haversineMiles(home, { lat: site.lat, lng: site.lng });
  const limit = TRAVEL_MILES[profile.travel] ?? 60;

  let value;
  if (miles <= limit * 0.5)      value = 1.0;           // well inside their range
  else if (miles <= limit)       value = 1.0 - (miles - limit * 0.5) / (limit * 0.5) * 0.4;  // 1.0 → 0.6
  else if (miles <= limit * 1.5) value = 0.6 - (miles - limit) / (limit * 0.5) * 0.5;        // 0.6 → 0.1
  else                           value = 0.0;

  const detail =
    miles < 25 ? `${Math.round(miles)} miles — close to home`
    : miles < limit ? `${Math.round(miles)} miles — within your range`
    : `${Math.round(miles)} miles — beyond your usual reach`;

  return { value: Math.max(0, value), label: 'Travel distance', detail };
}

function scoreAccess(profile, site) {
  const wanted = profile.access; // single string from Onboarding
  const available = siteAccessTypes(site);

  if (available.includes(wanted)) {
    return {
      value: 1.0,
      label: 'Access match',
      detail: `${wanted} available on site`,
    };
  }
  // Partial credit for related access (e.g. wants "Wade", site has "Bank")
  const hasAny = available.length > 0;
  return {
    value: hasAny ? 0.35 : 0.0,
    label: 'Access',
    detail: hasAny
      ? `${available[0]} only — ${wanted.toLowerCase()} not directly supported`
      : 'Limited developed access',
  };
}

function scoreSpecies(profile, site) {
  const wantedCategories = new Set();
  (profile.styles || []).forEach(style => {
    (STYLE_TO_SPECIES[style] || []).forEach(s => wantedCategories.add(s));
  });

  if (wantedCategories.size === 0) {
    return { value: 0.5, label: 'Species', detail: 'No style preference set' };
  }

  const siteSpecies = site.species || [];
  const matches = siteSpecies.filter(sp =>
    [...wantedCategories].some(cat => sp.toLowerCase().includes(cat.toLowerCase()))
  );

  const value = matches.length === 0
    ? 0.0
    : Math.min(1.0, matches.length / Math.min(3, siteSpecies.length));

  const detail = matches.length === 0
    ? `No matching species — site has ${siteSpecies.slice(0, 2).join(', ') || 'unknown species'}`
    : matches.length === siteSpecies.length
      ? `All species match (${matches.slice(0, 2).join(', ')})`
      : `${matches.slice(0, 2).join(', ')} — matches your style`;

  return { value, label: 'Species match', detail };
}

function scoreOpenStatus(profile, site) {
  const closure = (site.closure || '').toLowerCase();
  const openDates = site.openDates || '';
  const now = new Date();
  const month = now.getMonth(); // 0=Jan

  if (closure.includes('no closure') || openDates.toLowerCase().includes('year-round')) {
    if (closure.includes('seasonal limited')) {
      // Vehicle access seasonal but walk-in usually OK
      return { value: 0.85, label: 'Access status', detail: 'Open year-round (vehicle access seasonal)' };
    }
    return { value: 1.0, label: 'Access status', detail: 'Open year-round' };
  }

  // Seasonal: roughly Apr–Oct = open
  const inSeason = month >= 3 && month <= 9;
  if (inSeason) {
    return { value: 0.9, label: 'Access status', detail: `In season (${site.openDates || 'seasonal'})` };
  }
  return { value: 0.2, label: 'Access status', detail: `Out of season (${site.openDates || 'seasonal closure'})` };
}

function scoreStocking(profile, site) {
  if (!site.stocked) {
    return { value: 0.3, label: 'Stocking', detail: 'No recent stocking on record' };
  }
  // We don't have machine-readable dates, but presence of a `stocked` string
  // means it's curated and recent. Curated > inferred. Bigger bump if "Apr 2026" parses.
  const stockedStr = String(site.stocked);
  const recentMatch = /apr|mar|may/i.test(stockedStr);
  return {
    value: recentMatch ? 1.0 : 0.7,
    label: 'Recent stocking',
    detail: stockedStr,
  };
}

function scoreSkillMatch(profile, site) {
  const skill = EXPERIENCE_LEVEL[profile.experience] ?? 0.5;
  // Heuristic site difficulty:
  //   - lakes with concrete ramps + restrooms = beginner-friendly (0.2)
  //   - rivers, saltwater, unimproved access = harder (0.7-0.9)
  let difficulty;
  if (site.type === 'lake' && site.boatRamps > 0 && site.restrooms > 0) difficulty = 0.2;
  else if (site.type === 'lake') difficulty = 0.4;
  else if (site.type === 'reservoir') difficulty = 0.5;
  else if (site.type === 'river') difficulty = 0.75;
  else if (site.type === 'saltwater') difficulty = 0.9;
  else difficulty = 0.6;

  // Score is 1 when difficulty matches the angler's skill, falls off either way
  const gap = Math.abs(skill - difficulty);
  const value = 1.0 - gap; // 0..1

  let detail;
  if (gap < 0.2) detail = `${site.type || 'access site'} — matches your experience`;
  else if (skill < difficulty) detail = `${site.type || 'access site'} — challenging for your level`;
  else detail = `${site.type || 'access site'} — easier than your usual`;

  return { value: Math.max(0, value), label: 'Skill match', detail };
}

function scoreADA(profile, site) {
  const hasADA = site.ada_parking > 0 || site.ada_loading || site.ada_restrooms > 0;
  if (!hasADA) return { value: 0.0, label: 'Accessibility', detail: 'No ADA features listed' };
  const parts = [];
  if (site.ada_parking > 0)   parts.push(`${site.ada_parking} ADA parking`);
  if (site.ada_loading)       parts.push('ADA loading platform');
  if (site.ada_restrooms > 0) parts.push('ADA restroom');
  return { value: 1.0, label: 'Accessibility', detail: parts.join(', ') };
}

// =========================================================================
// MAIN: rank all sites for an angler.
// =========================================================================
export function rankSites(profile, sites, options = {}) {
  if (!profile) return [];

  const results = sites.map(site => {
    const components = [
      { weight: WEIGHTS.distance,   ...scoreDistance(profile, site) },
      { weight: WEIGHTS.access,     ...scoreAccess(profile, site) },
      { weight: WEIGHTS.species,    ...scoreSpecies(profile, site) },
      { weight: WEIGHTS.openStatus, ...scoreOpenStatus(profile, site) },
      { weight: WEIGHTS.stocking,   ...scoreStocking(profile, site) },
      { weight: WEIGHTS.skillMatch, ...scoreSkillMatch(profile, site) },
      { weight: WEIGHTS.adaBonus,   ...scoreADA(profile, site) },
    ];

    // Weighted sum, 0..100.
    const score = components.reduce((sum, c) => sum + c.weight * c.value, 0);

    // Driving features = top 3 components by contribution (weight * value),
    // excluding anything with value ~= 0 (a "feature" of zero isn't a driver).
    const drivingFeatures = components
      .map(c => ({ ...c, contribution: c.weight * c.value }))
      .filter(c => c.contribution > 1) // ignore noise
      .sort((a, b) => b.contribution - a.contribution)
      .slice(0, 3)
      .map(c => ({ label: c.label, detail: c.detail }));

    return {
      site,
      score: Math.round(score),
      drivingFeatures,
    };
  });

  results.sort((a, b) => b.score - a.score);
  return results;
}

// =========================================================================
// "Explore" pick: a site that's a decent match but not top 3.
// Per the business plan's explore-vs-exploit point.
// =========================================================================
export function pickExplore(rankedResults, topN = 3) {
  const skipped = rankedResults.slice(topN); // everything past top 3
  // Take the highest-scoring site from positions topN..topN+20 that's at least
  // "decent" (score >= 50). This actively surfaces under-fished but still good
  // matches, which is what WDFW would want for pressure distribution.
  const candidates = skipped
    .slice(0, 20)
    .filter(r => r.score >= 50);
  return candidates.length > 0 ? candidates[Math.floor(Math.random() * Math.min(5, candidates.length))] : null;
}

// =========================================================================
// Default export for convenience: top-3 + explore in one call.
// =========================================================================
export function getRecommendations(profile, sites) {
  const ranked = rankSites(profile, sites);
  return {
    top: ranked.slice(0, 3),
    explore: pickExplore(ranked, 3),
    totalScored: ranked.length,
  };
}
