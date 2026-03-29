// Route definitions — uses lazy-loaded imports for code-splitting.
// Navigation metadata (label, icon, showInNav, requiresAuth) drives the header dynamically.

import isEnabled from 'feature-flags'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import("@/views/HomeView.vue"),
    label: 'Home',
    icon: 'bi-house-door',
    showInNav: true,
    requiresAuth: false,
  },
  {
    path: '/login',
    name: 'login',
    component: () => import("@/views/LoginView.vue"),
    label: 'Log In',
    icon: 'bi-box-arrow-in-right',
    showInNav: isEnabled("auth"),
    requiresAuth: false,
    guestOnly: true,
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import("@/views/SignupView.vue"),
    showInNav: false,
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import("@/views/ProfileView.vue"),
    label: 'Profile',
    icon: 'bi-person',
    showInNav: true,
    requiresAuth: true,
  },
  {
    path: '/compete',
    name: 'compete',
    component: () => import("@/views/CompetitionView.vue"),
    label: 'Competition',
    icon: 'bi-trophy',
    showInNav: isEnabled("competition"),
    requiresAuth: true,
  },
];

export default routes;
