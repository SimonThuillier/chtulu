export const PWD_STRENGTH = {
    TOO_WEAK:'trop faible',
    WEAK:'faible',
    MEDIUM:'moyen',
    STRONG:'fort',
    VERY_STRONG:'très fort',
};

export function scorePassword(pass) {
    let score = 0;
    if (!pass)
        return score;

    // award every unique letter until 5 repetitions
    let letters = {};
    for (let i=0; i<pass.length; i++) {
        letters[pass[i]] = (letters[pass[i]] || 0) + 1;
        score += 5.0 / letters[pass[i]];
    }

    // bonus points for mixing it up
    let variations = {
        digits: /\d/.test(pass),
        lower: /[a-z]/.test(pass),
        upper: /[A-Z]/.test(pass),
        nonWords: /\W/.test(pass),
    };

    let variationCount = 0;
    for (let check in variations) {
        variationCount += (variations[check] === true) ? 1 : 0;
    }
    score += (variationCount - 1) * 10;

    return +score;
};

export function checkPasswordStrength(pass,minScore=40) {
    let score = scorePassword(pass);
    if (score > 2.5*minScore)
        return PWD_STRENGTH.VERY_STRONG;
    if (score > 2*minScore)
        return PWD_STRENGTH.STRONG;
    if (score > 1.5*minScore)
        return PWD_STRENGTH.MEDIUM;
    if (score >= minScore)
        return PWD_STRENGTH.WEAK;

    return PWD_STRENGTH.TOO_WEAK;
};
