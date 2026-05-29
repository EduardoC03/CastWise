const PROFILE_KEY = 'castwise:profile';
const TRIP_KEY = 'castwise:trip';
const API_KEY = 'castwise:apikey';

export async function loadApiKey() {
  try {
    const r = await window.storage.get(API_KEY);
    return r ? r.value : null;
  } catch { return null; }
}

export async function saveApiKey(key) {
  try {
    if (!key) await window.storage.delete(API_KEY);
    else await window.storage.set(API_KEY, key);
  } catch (e) { console.error(e); }
}

export async function loadProfile() {
  try {
    const r = await window.storage.get(PROFILE_KEY);
    if (!r) return null;
    const p = JSON.parse(r.value);
    if (!p || typeof p.experience !== 'string' || !Array.isArray(p.accessType) ||
        !Array.isArray(p.fishingTypes) || !Array.isArray(p.gear) ||
        typeof p.location !== 'string' || typeof p.travel !== 'string') {
      await window.storage.delete(PROFILE_KEY);
      return null;
    }
    return p;
  } catch { return null; }
}

export async function saveProfile(p) {
  try { await window.storage.set(PROFILE_KEY, JSON.stringify(p)); } catch (e) { console.error(e); }
}

export async function loadTrip() {
  try {
    const r = await window.storage.get(TRIP_KEY);
    if (!r) return null;
    const t = JSON.parse(r.value);
    if (!t || !t.site || typeof t.site.name !== 'string') {
      await window.storage.delete(TRIP_KEY);
      return null;
    }
    return t;
  } catch { return null; }
}

export async function saveTrip(t) {
  try {
    if (t === null) await window.storage.delete(TRIP_KEY);
    else await window.storage.set(TRIP_KEY, JSON.stringify(t));
  } catch (e) { console.error(e); }
}

export async function clearAllStorage() {
  try { await window.storage.delete(PROFILE_KEY); } catch {}
  try { await window.storage.delete(TRIP_KEY); } catch {}
}
