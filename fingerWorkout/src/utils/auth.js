import api from "@/utils/api";

/**
 * Extracts a standardised error object from an unsuccessful API response.
 * Handles both Zod flatten() validation errors and plain auth-error messages.
 * @param {Object} data - The response body from the API.
 * @returns {{ success: false, errors: Object }}
 */
function extractApiErrors(data) {
    const errors = {};

    // Zod flatten() format: { fieldErrors: { email: ["msg"], password: ["msg"] }, formErrors: [...] }
    if (data?.fieldErrors) {
        const mapped = {};
        for (const [field, messages] of Object.entries(data.fieldErrors)) {
            if (Array.isArray(messages) && messages.length) {
                mapped[field] = messages[0];
            }
        }
        errors.validationErrors = mapped;
    }

    if (data?.message) {
        errors.authError = data.message;
    }

    return { success: false, errors };
}

/**
 * Authenticates a user with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ success: boolean, user?: Object, token?: string, errors?: Object }>}
 */
const login = async (email, password) => {
    try {
        const res = await api.post('/json/login', { email, password });
        return res.data;
    } catch (error) {
        if (error.response?.data) {
            return extractApiErrors(error.response.data);
        }
        throw error;
    }
};

/**
 * Registers a new user account.
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ success: boolean, user?: Object, errors?: Object }>}
 */
const register = async (name, email, password) => {
    try {
        const res = await api.post('/json/register', { name, email, password });
        return res.data;
    } catch (error) {
        if (error.response?.data) {
            return extractApiErrors(error.response.data);
        }
        return { success: false, errors: { authError: "Unable to connect. Please try again later." } };
    }
};

/**
 * Updates the authenticated user's profile (name, email, password, picture).
 * @param {FormData} formData - Multipart form data with profile fields.
 * @returns {Promise<{ success: boolean, user?: Object, errors?: Object }>}
 */
export const updateProfile = async (formData) => {
    try {
        const res = await api.post('/profile/update', formData);
        const data = res.data;

        if (!data?.success) {
            return extractApiErrors(data);
        }
        return data;
    }
    catch (err) {
        throw new Error("Error establishing connection: " + err);
    }
};

/**
 * Fetches the currently authenticated user's profile.
 * @returns {Promise<Object|false>} The user object, or false if not authenticated.
 */
const getUser = async () => {
    try {
        const res = await api.get('/json/profile');
        const data = res.data;
        if (!data.success) {
            return false;
        }
        return data.user;
    }
    catch (error) {
        console.error("Error fetching user profile:", error);
        return false;
    }
};

export { login, register, getUser };
