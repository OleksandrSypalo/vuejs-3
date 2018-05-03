import Vue from 'vue';
import VueRouter from 'vue-router';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import Feather from 'vue-icon';

Vue.use(VueRouter);
Vue.use(BootstrapVue);
Vue.use(Feather, 'v-icon');

import randomDB from './random-db';
import DB from './db';

import App from './components/App.vue';
import Widgets from './components/Widgets.vue';
import Widget from './components/Widget.vue';
import Navbar from './components/Navbar.vue';

Vue.component('component-navbar', Navbar);

const router = new VueRouter({
    mode: 'history',
    base: __dirname,
    routes: [
        {
            path: '/init-demo',
            beforeEnter: (to, from, next) => {
                DB.use(randomDB).initForDemo();
                next('/');
            }
        },
        {
            path: '/',
            component: Widgets
        },
        {
            path: '/delete/:id',
            name: 'delete',
            beforeEnter: (to, from, next) => {
                if (to.params && to.params.id) {
                    DB.drop('widgets', {id: +to.params.id});
                }
                next('/');
            }
        },
        {
            path: '/:id',
            name: 'widget',
            component: Widget,
            beforeEnter: (to, from, next) => {
                if (/^[0-9]+$/.test(to.params.id) && Number.isInteger(+to.params.id)) {
                    next();
                } else {
                    next('/');
                }
            }
        }
    ]
});

new Vue({
    el: '#app',
    router,
    render: h => h(App)
});
