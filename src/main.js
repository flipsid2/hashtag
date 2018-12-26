// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueFire from 'vuefire'
import VueClipboard from 'vue-clipboard2'
import App from './App'
Vue.use(VueFire)
Vue.use(VueClipboard)
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
