import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

// include bulma css library
import './../node_modules/bulma/css/bulma.css';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

