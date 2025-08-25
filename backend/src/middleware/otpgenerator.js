function generateRandomFourDigit(four) {
    let randomArray = new Uint32Array(1);
    crypto.getRandomValues(randomArray);
    let fourDigitRandom = randomArray[0] % four + 1000;
    return fourDigitRandom;
}

// Export if needed in another filenn
module.exports = generateRandomFourDigit;
