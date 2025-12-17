const POINTS = {
    individual: {
        1: { A: 10, B: 8, C: 6, NONE: 5 },
        2: { A: 8, B: 6, C: 4, NONE: 3 },
        3: { A: 6, B: 4, C: 2, NONE: 1 }
    },
    group: {
        1: { A: 20, B: 15, C: 13, NONE: 10 },
        2: { A: 15, B: 10, C: 8, NONE: 5 },
        3: { A: 13, B: 8, C: 6, NONE: 3 }
    }
};

exports.calculatePoints = (itemType, position, grade) => {
    // Normalize inputs
    const type = itemType.toLowerCase(); // 'individual' or 'group'
    const pos = parseInt(position);
    const grd = grade ? grade.toUpperCase() : 'NONE';

    if (!POINTS[type]) return 0;
    if (!POINTS[type][pos]) return 0;

    return POINTS[type][pos][grd] || 0;
};
