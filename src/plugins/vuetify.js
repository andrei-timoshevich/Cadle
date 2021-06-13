import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark: false,
    themes: {
      light: {
        primary: {
          base: colors.purple.base,
          darken1: colors.purple.darken2,
        },
      },
      dark: {
        primary: '#608FFF',
        background: '#1f2126',
        toolbar: '#608FFF',
      }
    },
  }
});
