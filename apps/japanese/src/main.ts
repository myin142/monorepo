import Vue from 'vue';
import App from './App.vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import { JapaneseService } from '@myin/japanese/api';
import { AuthService } from '@myin/shared/authentication';
import VueRouter, { RouteConfig } from 'vue-router';
import { Stage } from '@myin/shared/api';

Vue.use(Vuetify);
Vue.use(VueRouter);
Vue.config.productionTip = false;

const authService = new AuthService();
const japaneseService = new JapaneseService(Stage.PROD, () => authService.getToken());

const authGuard = (to, from, next) => {
    if (authService.isAuthenticated()) {
        next();
    } else {
        next({ name: 'Login' });
    }
};

const routes: Array<RouteConfig> = [
    {
        path: '/',
        name: 'Home',
        redirect: '/report',
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@myin/japanese/feature/login'),
    },
    {
        path: '/report',
        name: 'Report',
        component: () => import('@myin/japanese/feature/report'),
        beforeEnter: authGuard,
    },
    {
        path: '/radicals',
        name: 'Radicals',
        component: () => import('@myin/japanese/feature/radical-search'),
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.NODE_ENV === 'production' ? '/japanese' : '',
    routes,
});

new Vue({
    router,
    render: (h) => h(App),
    vuetify: new Vuetify(),
    provide: {
        japaneseService,
        authService,
    },
}).$mount('#app');
