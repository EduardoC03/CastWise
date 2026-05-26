import React from 'react'
import { FishIcon } from './FishIcons'

/**
 * FishSymbol component — UPGRADE 1
 * Now a wrapper for the high-fidelity FishIcon library.
 */
export const FishSymbol = ({ speciesId, size = 24, color = "currentColor", className = "" }) => {
  // Map internal IDs to catalog names if necessary, 
  // but for now let's assume direct mapping or normalized names.
  const idToNameMap = {
    'chinook': 'Chinook Salmon',
    'coho': 'Coho Salmon',
    'sockeye': 'Sockeye Salmon',
    'pink': 'Pink Salmon',
    'chum': 'Chum Salmon',
    'steelhead': 'Steelhead',
    'trout': 'Rainbow Trout',
    'rainbow-trout': 'Rainbow Trout',
    'cutthroat-trout': 'Coastal Cutthroat Trout',
    'brown-trout': 'Brown Trout',
    'brook-trout': 'Brook Trout',
    'bull-trout': 'Bull Trout',
    'bass': 'Largemouth Bass',
    'largemouth-bass': 'Largemouth Bass',
    'smallmouth-bass': 'Smallmouth Bass',
    'walleye': 'Walleye',
    'perch': 'Yellow Perch',
    'yellow-perch': 'Yellow Perch',
    'sturgeon': 'White Sturgeon',
    'white-sturgeon': 'White Sturgeon',
    'halibut': 'Pacific Halibut',
    'lingcod': 'Lingcod',
    'dungeness': 'Dungeness Crab',
    'spot-shrimp': 'Spot Shrimp',
    'yelloweye-rockfish': 'Yelloweye Rockfish',
    'black-rockfish': 'Black Rockfish',
  }

  const name = idToNameMap[speciesId] || speciesId

  return (
    <FishIcon name={name} size={size} className={className} />
  )
}
