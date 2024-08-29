export const lesionRecommendations: { [key: string]: string[] } = {
    basalCellCarcinoma: [
        'Apply topical 5-fluorouracil cream (e.g., Efudex) twice daily.',
        'Use topical imiquimod cream (e.g., Aldara) three times a week.',
        'Consider Mohs micrographic surgery for complete excision.',
        'Follow up with a dermatologist every 6 months.',
    ],
    squamousCellCarcinoma: [
        'Apply topical chemotherapy cream like 5-fluorouracil (e.g., Efudex) daily.',
        'Use topical imiquimod (e.g., Aldara) as directed by your physician.',
        'Consider surgical excision for removal.',
        'Regularly monitor for recurrence or new lesions.',
    ],
    melanoma: [
        'Administer BRAF inhibitors (e.g., Vemurafenib) if BRAF mutation positive.',
        'Use immune checkpoint inhibitors (e.g., Pembrolizumab) as per oncologist recommendation.',
        'Regular skin exams and imaging studies to monitor disease status.',
        'Consider adjuvant therapy based on stage and risk factors.',
    ],
    actinicKeratosis: [
        'Apply topical diclofenac gel (e.g., Solaraze) twice daily.',
        'Use topical 5-fluorouracil cream (e.g., Efudex) daily.',
        'Cryotherapy may be used for lesion removal.',
        'Monitor skin regularly for new lesions.',
    ],
    eczema: [
        'Apply topical corticosteroids (e.g., Hydrocortisone) as directed.',
        'Use emollients such as petrolatum or ceramide-based creams.',
        'Consider antihistamines (e.g., Cetirizine) for itching relief.',
        'Avoid known irritants and allergens.',
    ],
    psoriasis: [
        'Use topical corticosteroids (e.g., Clobetasol) to reduce inflammation.',
        'Apply vitamin D analogues (e.g., Calcipotriene) daily.',
        'Consider systemic treatments (e.g., Methotrexate) for severe cases.',
        'Regular follow-ups to adjust treatment based on response.',
    ],
    seborrheicKeratosis: [
        'Cryotherapy using liquid nitrogen to freeze the lesion.',
        'Consider topical solutions containing hydrogen peroxide.',
        'Surgical removal if the lesion is symptomatic or for cosmetic reasons.',
        'Monitor for changes in the lesion’s appearance.',
    ],
    molluscumContagiosum: [
        'Apply topical cantharidin (e.g., Canthacur) to lesions.',
        'Use cryotherapy for removal.',
        'Consider imiquimod cream (e.g., Aldara) for persistent cases.',
        'Avoid sharing personal items to prevent spread.',
    ],
    impetigo: [
        'Apply topical antibiotics such as mupirocin (e.g., Bactroban) to the lesions.',
        'Use oral antibiotics like cephalexin for widespread infections.',
        'Keep the affected area clean and covered.',
        'Seek medical advice if the condition does not improve.',
    ],
    shingles: [
        'Administer oral antiviral medications (e.g., Acyclovir or Valacyclovir) as soon as possible.',
        'Use topical analgesics or corticosteroids to relieve pain.',
        'Maintain good hygiene and avoid contact with susceptible individuals.',
        'Consider a shingles vaccine to prevent future outbreaks.',
    ],
    lichenPlanus: [
        'Apply topical corticosteroids (e.g., Clobetasol) to reduce inflammation.',
        'Use oral antihistamines (e.g., Loratadine) for itching relief.',
        'Consider systemic treatments if lesions are widespread.',
        'Regular follow-up to monitor for changes in symptoms.',
    ],
};

const mapLesionToName: { [key: string]: string } = {
    basalCellCarcinoma: 'Basal Cell Carcinoma',
    squamousCellCarcinoma: 'Squamous Cell Carcinoma',
    melanoma: 'Melanoma',
    actinicKeratosis: 'Actinic Keratosis',
    eczema: 'Eczema',
    psoriasis: 'Psoriasis',
    seborrheicKeratosis: 'Seborrheic Keratosis',
    molluscumContagiosum: 'Molluscum Contagiosum',
    impetigo: 'Impetigo',
    shingles: 'Shingles',
    lichenPlanus: 'Lichen Planus',
};

export const getRandomLesion = () => {
    const lesions = Object.keys(lesionRecommendations);
    const randomIndex = Math.floor(Math.random() * lesions.length);
    const randomLesion = mapLesionToName[lesions[randomIndex]];
    return { name: randomLesion, recommendations: lesionRecommendations[lesions[randomIndex]] };
};
