import Vue from 'vue';
import App from './app/app.vue';
import router from './app/router';

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
