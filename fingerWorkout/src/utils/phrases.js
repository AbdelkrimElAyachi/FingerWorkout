/**
 * Shuffles an array in-place using the Fisher-Yates algorithm.
 * @param {Array} array - The array to shuffle.
 * @returns {Array} The same array, shuffled.
 */
export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * Fetches text from Wikipedia and splits it into phrases of ~12 words each.
 * @param {number} quantity - Number of sentences to extract from Wikipedia.
 * @param {string} title - Wikipedia article title to fetch.
 * @param {string} [language="eng"] - Language code (currently unused, defaults to English Wikipedia).
 * @returns {Promise<string[]>} Array of phrase strings.
 */
export async function getPhrases(quantity, title, language = "eng") {
    const res = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=${quantity}&exlimit=1&titles=${title}&explaintext=1&format=json&formatversion=2&origin=*`
    );
    const data = await res.json();
    const text = data.query.pages[0].extract;
    const words = text.match(/[A-Za-z0-9\u0600-\u06FF]+/g);

    const uniqueWords = new Set(words);
    const shuffledWords = shuffleArray([...uniqueWords]);

    const phrases = [];
    for (let i = 0; i < shuffledWords.length; i += 12) {
        phrases.push(shuffledWords.slice(i, i + 12).join(" "));
    }

    return phrases;
}
