import { createApp } from 'vue'
import App from './App.vue'
import { createVuetify } from 'vuetify'
import { createPinia } from 'pinia'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
  theme: {
  defaultTheme: 'light',
  themes: {
    light: {
      colors: {
        // Base
        background: '#FAF9F6',   // clean off-white (soft, modern)
        surface: '#FFFFFF',      // pure surface (cards, sheets)
        // Brand
        primary: '#C9A23A',      // warm gold (main accent)
        'primary-darken-1': '#A67C2B',
        secondary: '#241710',    // rich dark-brown for text/anchors
        'secondary-lighten-1': '#3A241C',
        accent: '#FFD54A',       // bright gold highlight
        // Semantic (modern / Material-like)
        error: '#D32F2F',        // standard error red
        info: '#1976D2',         // standard blue info
        success: '#2E7D32',      // green success
        warning: '#FBC02D',      // amber warning
        // Contrast helpers
        'on-primary': '#16120F',   // dark text on gold
        'on-secondary': '#FFFFFF', // white on deep brown
        'on-surface': '#241710',   // content color on white surface
        'on-background': '#241710',// content color on off-white background
        // Optional subtle neutrals
        muted: '#BDB2A7',         // beige/neutral for less-important UI
        divider: '#E6DCD0',       // soft divider
      },
    },
    dark: {
      colors: {
        // Base (darker than before for stronger contrast)
        background: '#050505',   // near-black background for max contrast
        surface: '#0F0B09',      // dark chocolate surface
        // Brand
        primary: '#FFD700',      // bright gold for emphasis on dark
        'primary-darken-1': '#E6C200',
        secondary: '#E6D9C8',    // warm beige used as text on dark surfaces
        'secondary-darken-1': '#B68A6E',
        accent: '#FFCF66',       // softer gold accent for emphasis
        // Semantic
        error: '#EF5350',        // slightly brighter red on dark
        info: '#64B5F6',         // light blue info
        success: '#66BB6A',      // light green success
        warning: '#FFB300',      // amber warning
        // Contrast helpers
        'on-primary': '#0F0B09',   // dark text against bright gold
        'on-secondary': '#0F0B09', // dark text for beige secondary
        'on-surface': '#E6D9C8',   // readable light text on dark surface
        'on-background': '#E6D9C8',// readable content color on dark background
        // Optional neutrals for dark UI
        muted: '#7A6A59',         // toned neutral for subdued elements
        divider: '#271F1B',       // subtle divider on dark
      },
    },
  },
},

  icons: {
    defaultSet: 'mdi',
  },
})

const pinia = createPinia()

createApp(App).use(vuetify).use(pinia).mount('#app')
