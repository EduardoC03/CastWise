// License decision tree: residency → age → waterType → license object
export const licenseTree = {
  resident: {
    junior: {
      freshwater: { name: 'Junior Resident Freshwater License', price: '$10.00', description: 'For WA residents under 16. Covers all freshwater fishing statewide.' },
      saltwater: { name: 'Junior Resident Saltwater License', price: '$10.00', description: 'For WA residents under 16. Covers Puget Sound and coastal saltwater fishing.' },
      combo: { name: 'Junior Resident Combination License', price: '$15.00', description: 'For WA residents under 16. Covers both freshwater and saltwater fishing statewide.' },
    },
    adult: {
      freshwater: { name: 'Resident Freshwater License', price: '$29.50', description: 'For WA residents 16–69. Covers all freshwater fishing statewide. Salmon/steelhead endorsements sold separately.' },
      saltwater: { name: 'Resident Saltwater License', price: '$29.50', description: 'For WA residents 16–69. Covers Puget Sound, coastal ocean, and Columbia River saltwater sections.' },
      combo: { name: 'Resident Combination License', price: '$52.40', description: 'For WA residents 16–69. Best value — covers all freshwater and saltwater fishing statewide.' },
    },
    senior: {
      freshwater: { name: 'Senior Resident Freshwater License', price: '$7.50', description: 'For WA residents 70+. Discounted freshwater fishing license. Salmon endorsement required for salmon/steelhead.' },
      saltwater: { name: 'Senior Resident Saltwater License', price: '$7.50', description: 'For WA residents 70+. Discounted saltwater fishing license.' },
      combo: { name: 'Senior Resident Combination License', price: '$15.00', description: 'For WA residents 70+. Best value for seniors — covers all waters statewide.' },
    },
  },
  nonresident: {
    junior: {
      freshwater: { name: 'Non-Resident Junior Freshwater License', price: '$20.00', description: 'For visitors under 16. Covers all WA freshwater fishing.' },
      saltwater: { name: 'Non-Resident Junior Saltwater License', price: '$20.00', description: 'For visitors under 16. Covers Puget Sound and coastal saltwater fishing.' },
      combo: { name: 'Non-Resident Junior Combination License', price: '$30.00', description: 'For visitors under 16. Covers all WA freshwater and saltwater fishing.' },
    },
    adult: {
      freshwater: { name: 'Non-Resident Freshwater License', price: '$85.00', description: 'For out-of-state visitors 16+. Covers all WA freshwater fishing. Annual.' },
      saltwater: { name: 'Non-Resident Saltwater License', price: '$55.00', description: 'For out-of-state visitors 16+. Covers saltwater fishing in WA. Annual.' },
      combo: { name: 'Non-Resident Combination License', price: '$120.00', description: 'For out-of-state visitors 16+. Best value — covers all WA fishing waters. Annual.' },
    },
    senior: {
      freshwater: { name: 'Non-Resident Freshwater License', price: '$85.00', description: 'Out-of-state seniors receive no discount. Covers all WA freshwater fishing.' },
      saltwater: { name: 'Non-Resident Saltwater License', price: '$55.00', description: 'Out-of-state seniors receive no discount. Covers all WA saltwater fishing.' },
      combo: { name: 'Non-Resident Combination License', price: '$120.00', description: 'Out-of-state seniors receive no discount. Best value non-resident option.' },
    },
  },
}

export const licenseQuestions = [
  {
    id: 'residency',
    question: 'Are you a Washington State resident?',
    hint: 'Resident = WA driver\'s license or state ID with 90+ days continuous residency',
    options: [
      { value: 'resident', label: 'Yes, I\'m a WA Resident' },
      { value: 'nonresident', label: 'No, I\'m from out of state' },
    ],
  },
  {
    id: 'age',
    question: 'What is your age group?',
    hint: 'Juniors (under 16) and Seniors (70+) qualify for discounted licenses',
    options: [
      { value: 'junior', label: 'Junior (Under 16)' },
      { value: 'adult', label: 'Adult (16–69)' },
      { value: 'senior', label: 'Senior (70+)' },
    ],
  },
  {
    id: 'waterType',
    question: 'Where do you plan to fish?',
    hint: 'Combo license covers both and is often the best value',
    options: [
      { value: 'freshwater', label: 'Freshwater only (lakes, rivers)' },
      { value: 'saltwater', label: 'Saltwater only (Puget Sound, coast)' },
      { value: 'combo', label: 'Both freshwater & saltwater' },
    ],
  },
]

export const buyLink = 'https://fishhunt.dfw.wa.gov'
