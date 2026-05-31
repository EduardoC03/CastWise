import { useState, useEffect } from 'react';

// Cache so we don't re-fetch the same site on every render
const cache = {};

/**
 * Fetches the first image from a Wikipedia article matching the given site name.
 * Returns { photoUrl, loading } where photoUrl is null if no image found.
 *
 * Strategy:
 * 1. Search Wikipedia for "{siteName} Washington" to find the closest article
 * 2. Get the page's images and return the first non-icon, non-logo image
 */
export default function useWikiPhoto(siteName) {
  const [photoUrl, setPhotoUrl] = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (!siteName) { setLoading(false); return; }

    // Return cached result immediately
    if (cache[siteName] !== undefined) {
      setPhotoUrl(cache[siteName]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchPhoto = async () => {
      try {
        // Step 1: search for the most relevant Wikipedia article
        const searchQuery = encodeURIComponent(`${siteName} Washington`);
        const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${searchQuery}&srlimit=1&format=json&origin=*`;
        const searchRes = await fetch(searchUrl);
        const searchData = await searchRes.json();

        const results = searchData?.query?.search;
        if (!results || results.length === 0) {
          cache[siteName] = null;
          if (!cancelled) { setPhotoUrl(null); setLoading(false); }
          return;
        }

        const pageId = results[0].pageid;

        // Step 2: get images from that page
        const imgUrl = `https://en.wikipedia.org/w/api.php?action=query&pageids=${pageId}&prop=images&imlimit=10&format=json&origin=*`;
        const imgRes = await fetch(imgUrl);
        const imgData = await imgRes.json();

        const images = imgData?.query?.pages?.[pageId]?.images || [];

        // Filter out icons, flags, logos, SVGs
        const filtered = images.filter(img => {
          const name = img.title.toLowerCase();
          return (
            !name.includes('icon') &&
            !name.includes('logo') &&
            !name.includes('flag') &&
            !name.includes('map') &&
            !name.includes('symbol') &&
            !name.includes('commons-logo') &&
            !name.endsWith('.svg') &&
            !name.endsWith('.gif')
          );
        });

        if (filtered.length === 0) {
          cache[siteName] = null;
          if (!cancelled) { setPhotoUrl(null); setLoading(false); }
          return;
        }

        // Step 3: get the actual image URL for the first valid image
        const imageName = encodeURIComponent(filtered[0].title.replace('File:', ''));
        const thumbUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=File:${imageName}&prop=imageinfo&iiprop=url&iiurlwidth=900&format=json&origin=*`;
        const thumbRes = await fetch(thumbUrl);
        const thumbData = await thumbRes.json();

        const pages = thumbData?.query?.pages || {};
        const pageKeys = Object.keys(pages);
        const url = pages[pageKeys[0]]?.imageinfo?.[0]?.thumburl || null;

        cache[siteName] = url;
        if (!cancelled) { setPhotoUrl(url); setLoading(false); }

      } catch (err) {
        cache[siteName] = null;
        if (!cancelled) { setPhotoUrl(null); setLoading(false); }
      }
    };

    fetchPhoto();
    return () => { cancelled = true; };
  }, [siteName]);

  return { photoUrl, loading };
}
