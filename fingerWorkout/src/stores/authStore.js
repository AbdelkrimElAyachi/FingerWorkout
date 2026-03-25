import { defineStore } from "pinia";
import { getUser } from "../utils/auth";
import { getTopTestResult } from '@/utils/tests';

// Auth store — manages user authentication state and top test result.

export const useAuthStore = defineStore('auth', {
  state: () => ({
    name: null,
    email: null,
    picture: null,
    token: null,
    topTestResult: 0,
    authenticated: false
  }),

  getters: {
    isAuthenticated: (state) => state.authenticated,
    getPicture: (state) => state.picture,
    getEmail: (state) => state.email,
    getName: (state) => state.name,
    getTopTestResult: (state) => state.topTestResult
  },

  actions: {
    async initializeAuth() {
      if (this.authenticated) {
        return;
      }
      else {
        const res = await getUser();
        if (res) {
          this.name = res.name;
          this.email = res.email;
          this.picture = res.picture;
          this.authenticated = true;
          const data = await getTopTestResult();
          this.topTestResult = data[0]?.wpm ?? 1;
        }
      }
    },

    setUser(user, token) {
      if (token) {
        localStorage.setItem("auth_token", token);
      }
      this.name = user?.name;
      this.email = user.email;
      this.picture = user?.picture;
      this.token = token;
      this.authenticated = true;
    },

    setNewRecord(newRecord) {
      this.topTestResult = newRecord;
    },

    clear() {
      this.name = null;
      this.email = null;
      this.picture = null;
      this.authenticated = false;
      this.token = null;
      localStorage.removeItem("auth_token");
    },

  },
});
