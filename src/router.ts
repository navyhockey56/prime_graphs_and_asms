import Vue from 'vue';
import Router from 'vue-router';

import Home from './views/Home.vue';
import Theory from './views/Theory.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      component: Home,
      name: 'Home',
      path: '/',
    },
    {
      component: Theory,
      name: 'Theory',
      path: '/theory',
    },
  ],
});
