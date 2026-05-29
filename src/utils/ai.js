export async function askClaude(messages, system, apiKey) {
  const finalKey = apiKey || import.meta.env.VITE_ANTHROPIC_API_KEY;
  
  if (!finalKey) {
    console.error('CastWise: No API key found in state or environment.');
    throw new Error('Missing API Key');
  }

  if (finalKey.trim() !== finalKey) {
    console.warn('CastWise: API key has leading or trailing whitespace.');
  }
  
  // Use the local proxy to bypass CORS
  const response = await fetch("/api/anthropic/v1/messages", {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "x-api-key": finalKey.trim(),
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1200,
      system,
      messages
    })
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('CastWise: API Error', response.status, errorData);
    throw new Error(errorData.error?.message || `API error (${response.status})`);
  }
  const data = await response.json();
  return data.content.filter(b => b.type === 'text').map(b => b.text).join('\n');
}

export function buildSystemPrompt(profile, site) {
  const stocking = site.stocked ? `Recently stocked: ${site.stocked}.` : 'No recent stocking on record.';
  const opening  = site.opening ? `Opening info: ${site.opening}.` : '';

  // Read the actual field names Onboarding writes: gear, styles, access (single string), region.
  const gear   = Array.isArray(profile.gear)   && profile.gear.length   ? profile.gear.join(', ')   : 'none specified';
  const styles = Array.isArray(profile.styles) && profile.styles.length ? profile.styles.join(', ') : 'not specified';
  const access = profile.access || 'not specified';
  const region = profile.region || 'Washington';

  // Travel: Onboarding uses display strings like "Local only (under 30 min)" / "Anywhere in WA"
  const travelDesc = /local/i.test(profile.travel)
    ? 'prefers local waters'
    : /anywhere/i.test(profile.travel)
      ? 'willing to travel anywhere in Washington'
      : `willing to travel (${profile.travel})`;

  return `You are CastWise, a knowledgeable Washington fishing assistant working with the Washington Department of Fish and Wildlife (WDFW). You speak plainly and practically, like a seasoned angler giving advice — warm but no-nonsense.

ANGLER PROFILE:
- Experience: ${profile.experience}
- Frequency: ${profile.frequency}
- Home region: ${region}
- Travel preference: ${travelDesc}
- Access preference: ${access}
- Interested in: ${styles}
- Owned gear: ${gear}

PLANNED TRIP — ${site.name} (${site.county} County, ${site.region} Washington):
- Managed by: ${site.manager}
- Waterbody type: ${site.type}
- Likely species: ${(site.species || []).join(', ') || 'unknown'}
- Access infrastructure: ${site.boatRamps} boat ramp(s), ${site.handLaunches} hand launch(es), ${site.fishingPlatforms} fishing platform(s)${site.ada_parking > 0 ? `, ${site.ada_parking} ADA parking stalls` : ''}${site.ada_loading ? ', ADA loading platform' : ''}
- Closure status: ${site.closure}${site.openDates ? ` (${site.openDates})` : ''}
- ${stocking} ${opening}
${site.notes ? `- Site notes: ${site.notes}` : ''}

When the user first asks for trip prep, give: (1) gear-specific recommendations tailored to their owned gear and experience level — call out gear they're missing if relevant, (2) a clear ALERT about any closure, opening date, or recent stocking that affects this trip, (3) 2-3 practical tactics for the listed species. Keep it scannable — short sections, no walls of text. Use plain markdown (## for headers, ** for bold, - for lists). Start ALERT lines with the word ALERT so the app can format them. For follow-up questions, answer directly and concisely. Always remind the user to verify current rules at wdfw.wa.gov before fishing.`;
}
