// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import * as VueGoogleMaps from 'vue2-google-maps';
import VueTouch from 'vue-touch';
import Trend from 'vuetrend';
import Toasted from 'vue-toasted';
import VueApexCharts from 'vue-apexcharts';
import VueSweetalert2 from 'vue-sweetalert2';

// If you don't need the styles, do not connect
import 'sweetalert2/dist/sweetalert2.min.css';

import store from './store';
import router from './Routes';
import App from './App';
import layoutMixin from './mixins/layout';
import Widget from './components/Widget/Widget';

import {helper} from "@/core/helper";
import "@/core/ml";
import {serviceAPI} from "@/core/serviceAPI";

Vue.prototype.$helper = helper
Vue.prototype.$serviceAPI = serviceAPI
window.$ = window.jQuery = require('jquery')

import Notifications from 'vue-notification'

Vue.use(Notifications)
Vue.use(VueSweetalert2);
Vue.use(BootstrapVue);
Vue.use(VueTouch);
Vue.use(Trend);
Vue.component('Widget', Widget);
// Vue.use(VueGoogleMaps, {
//     load: {
//         key: 'AIzaSyB7OXmzfQYua_1LEhRdqsoYzyJOPh9hGLg',
//     },
// });
Vue.component('apexchart', VueApexCharts);
Vue.mixin(layoutMixin);
Vue.use(Toasted, {duration: 10000});

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    router,
    render: h => h(App),
});
