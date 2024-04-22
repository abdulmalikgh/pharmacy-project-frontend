import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import AuthLayout from "../layouts/AuthLayout.vue";
import AppLayout from "../layouts/AppLayout.vue";
import RouteViewComponent from "../layouts/RouterBypass.vue";
import { useAuthStore } from "../stores/auth";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
  },
  {
    path: "/logout",
    name: "logout",
    component: {
      beforeRouteEnter(to, from, next) {
        const store = useAuthStore();
        store.logout();
        next("/auth/login");
      },
    },
  },
  {
    name: "admin",
    path: "/",
    component: AppLayout,
    redirect: { name: "dashboard" },
    meta: {
      middleware: "auth",
    },
    children: [
      {
        name: "dashboard",
        path: "dashboard",
        component: () => import("../pages/admin/dashboard/Dashboard.vue"),
      },
      {
        name: "settings",
        path: "settings",
        component: () => import("../pages/settings/Settings.vue"),
      },
      {
        name: "preferences",
        path: "preferences",
        component: () => import("../pages/preferences/Preferences.vue"),
      },
      {
        name: "users",
        path: "users",
        component: () => import("../pages/users/UsersPage.vue"),
      },
      {
        name: "projects",
        path: "projects",
        component: () => import("../pages/projects/ProjectsPage.vue"),
      },
      {
        name: "payments",
        path: "/payments",
        component: RouteViewComponent,
        children: [
          {
            name: "payment-methods",
            path: "payment-methods",
            component: () => import("../pages/payments/PaymentsPage.vue"),
          },
          {
            name: "billing",
            path: "billing",
            component: () => import("../pages/billing/BillingPage.vue"),
          },
          {
            name: "pricing-plans",
            path: "pricing-plans",
            component: () => import("../pages/pricing-plans/PricingPlans.vue"),
          },
        ],
      },
      {
        name: "faq",
        path: "/faq",
        component: () => import("../pages/faq/FaqPage.vue"),
      },
    ],
  },
  {
    path: "/auth",
    component: AuthLayout,
    children: [
      {
        name: "login",
        path: "login",
        component: () => import("../pages/auth/Login.vue"),
      },
      {
        name: "signup",
        path: "signup",
        component: () => import("../pages/auth/Signup.vue"),
      },
      {
        name: "recover-password",
        path: "recover-password",
        component: () => import("../pages/auth/RecoverPassword.vue"),
      },
      {
        name: "recover-password-email",
        path: "recover-password-email",
        component: () => import("../pages/auth/CheckTheEmail.vue"),
      },
      {
        path: "reset_password",
        name: "reset-password",
        component: () => import("../pages/auth/Reset_Password.vue"),
      },
      {
        path: "",
        redirect: { name: "login" },
      },
    ],
  },
  {
    name: "404",
    path: "/404",
    component: () => import("../pages/404.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    // For some reason using documentation example doesn't scroll on page navigation.
    if (to.hash) {
      return { el: to.hash, behavior: "smooth" };
    } else {
      window.scrollTo(0, 0);
    }
  },
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  //const configStore = useConfigStore();

  // verify auth token before each page change
  //authStore.verifyAuth();

  // before page access check if page requires authentication
  if (to.meta.middleware == "auth") {
    if (authStore.isAuthenticated) {
      next();
    } else {
      next({ name: "login" });
    }
  } else {
    next();
  }
});

export default router;
