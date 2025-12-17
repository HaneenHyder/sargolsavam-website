const { calculatePoints } = require('../src/utils/scoring');

describe('Scoring Engine', () => {
    test('Individual Item Points', () => {
        expect(calculatePoints('Individual', 1, 'A')).toBe(10);
        expect(calculatePoints('Individual', 2, 'B')).toBe(6);
        expect(calculatePoints('Individual', 3, 'C')).toBe(2);
        expect(calculatePoints('Individual', 1, 'NONE')).toBe(5);
    });

    test('Group Item Points', () => {
        expect(calculatePoints('Group', 1, 'A')).toBe(20);
        expect(calculatePoints('Group', 2, 'B')).toBe(10);
        expect(calculatePoints('Group', 3, 'C')).toBe(6);
    });

    test('Invalid Inputs', () => {
        expect(calculatePoints('Individual', 4, 'A')).toBe(0);
        expect(calculatePoints('Unknown', 1, 'A')).toBe(0);
    });

    test('Case Insensitivity', () => {
        expect(calculatePoints('individual', 1, 'a')).toBe(10);
    });
});
