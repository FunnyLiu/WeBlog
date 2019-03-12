import Vue from 'vue';
import Vuex from 'vuex';
import number from './modules/number';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
    modules:{
        number
    },
    strict:debug
});