import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import { environment } from '../../environments/environment';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [];

const router = new VueRouter({
    mode: 'history',
    base: environment.baseUrl,
    routes,
});

export default router;
