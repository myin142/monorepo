import Vue from 'vue';
import App from './App.vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import { JapaneseApiClient } from '@myin/japanese/api';
import { AuthService } from '@myin/shared/authentication';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Vuetify);
Vue.use(VueRouter);
Vue.config.productionTip = false;

const japaneseService = new JapaneseApiClient(null, () => '');
const authService = new AuthService();

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
        component: Home,
        beforeEnter: authGuard,
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@myin/japanese/feature/login'),
    },
];

const router = new VueRouter({
    mode: 'history',
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
