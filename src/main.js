import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import App from './App.vue';
import en from './locales/en.json';
import zh from './locales/zh.json';

import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import '@mdi/font/css/materialdesignicons.css';
import './style.css';

const vuetify = createVuetify({
  components,
  directives,
});

const i18n = createI18n({
  locale: 'zh',
  fallbackLocale: 'zh',
  messages: {
    en,
    zh
  }
})

const app = createApp(App)
app.use(vuetify)
app.use(i18n)
app.mount('#app')
