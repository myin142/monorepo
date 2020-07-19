import Vue from 'vue';
import App from './App.vue';
import router from './router';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import { JapaneseApiClient } from '@myin/api/japanese';
import { Stage } from '@myin/api/shared';

Vue.use(Vuetify);
Vue.config.productionTip = false;

const japaneseService = new JapaneseApiClient(Stage.LOCAL, () => '');

new Vue({
    router,
    render: (h) => h(App),
    vuetify: new Vuetify(),
    provide: { japaneseService },
}).$mount('#app');
