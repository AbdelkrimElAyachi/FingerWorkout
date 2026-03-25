import api from "@/utils/api";

/**
 * Saves the results of a typing test to the server.
 * @param {number} numberCorrectCharacters
 * @param {number} numberCorrectWords
 * @param {number} numberWrongCharacters
 * @param {number} numberWrongWords
 * @param {number} duration - Test duration in minutes.
 * @returns {Promise<boolean>}
 */
const saveTestResults = async (numberCorrectCharacters, numberCorrectWords, numberWrongCharacters, numberWrongWords, duration) => {
    const res = await api.post('/json/test/save', {
        numberCorrectCharacters,
        numberCorrectWords,
        numberWrongCharacters,
        numberWrongWords,
        duration,
        datetime: new Date().toISOString()
    });

    if (!res.data?.success) {
        throw new Error('Failed to save test results');
    }
    return true;
};

/**
 * Fetches paginated test results for the authenticated user.
 * @param {number} page - Page number (1-based).
 * @param {number} limit - Number of results per page.
 * @returns {Promise<{testResults: Array, total: number, pages: number, page: number, limit: number}>}
 */
const getTestResults = async (page, limit) => {
    const res = await api.get(`/json/test/all?page=${page}&limit=${limit}`);
    const data = res.data;

    if (!data?.success) {
        throw new Error('Failed to fetch test results');
    }

    return {
        testResults: data.data,
        total: data.total,
        pages: data.pages,
        page: data.page,
        limit: data.limit
    };
};

/**
 * Fetches the user's top (best) test result.
 * @returns {Promise<Array>} Array of top test result objects.
 */
const getTopTestResult = async () => {
    const res = await api.get('/json/test/top');
    const data = res.data;

    if (!data?.success) {
        throw new Error('Failed to fetch top test result');
    }

    return data.data;
};

export { saveTestResults, getTestResults, getTopTestResult };
