import Vue from 'vue';
import App from './App.vue';
import router from './router';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import { JapaneseApiClient } from '@myin/japanese/api';
// import { Stage } from '@myin/shared/api';

Vue.use(Vuetify);
Vue.config.productionTip = false;

const japaneseService = new JapaneseApiClient(null, () => '');

new Vue({
    router,
    render: (h) => h(App),
    vuetify: new Vuetify(),
    provide: { japaneseService },
}).$mount('#app');
