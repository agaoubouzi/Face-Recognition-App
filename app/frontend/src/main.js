import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';

import 'uikit/dist/css/uikit.css';
import './assets/scss/main.scss';


UIkit.use(Icons);

const app = createApp(App)

app.use(router)



app.mount('#app')
