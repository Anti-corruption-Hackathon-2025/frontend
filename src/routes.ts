import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import Tender from "./pages/tender/Tender.vue";
import Tenders from "./pages/tender/Tenders.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    children: [
      {
        path: "/tenders",
        component: Tenders
      },
      {
        path: "/tenders/:lot_number",
        component: Tender
      },
    ]
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});
