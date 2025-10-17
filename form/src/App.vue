<template>
  <v-app class="app-background">
    <v-main>
      <InscriptionForm />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTheme } from 'vuetify'
import InscriptionForm from './components/InscriptionForm.vue'

const theme = useTheme()
const isDark = ref(false)

onMounted(() => {
  // Check browser preference or saved preference
  const savedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  isDark.value = savedTheme ? savedTheme === 'dark' : prefersDark
  theme.global.name.value = isDark.value ? 'dark' : 'light'
})
</script>

<style scoped>
.app-background {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

/* Dark theme background */
.v-theme--dark .app-background {
  background: red !important;
  background: linear-gradient(135deg, #0D0A08 0%, #1A1611 50%, #2C1E14 100%);
}

.app-background::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 15% 85%, rgba(255, 215, 0, 0.4) 0%, transparent 40%),
    radial-gradient(circle at 85% 15%, rgba(255, 193, 7, 0.3) 0%, transparent 35%),
    radial-gradient(circle at 45% 55%, rgba(255, 235, 59, 0.2) 0%, transparent 30%),
    radial-gradient(circle at 75% 75%, rgba(255, 215, 0, 0.3) 0%, transparent 45%),
    radial-gradient(circle at 25% 25%, rgba(255, 160, 0, 0.2) 0%, transparent 35%),
    radial-gradient(circle at 65% 35%, rgba(255, 183, 77, 0.25) 0%, transparent 40%);
  animation: bokeh 35s ease-in-out infinite;
  filter: blur(60px);
  opacity: 0.8;
}

/* Dark theme bokeh effect */
.v-theme--dark .app-background::before {
  background: 
    radial-gradient(circle at 15% 85%, rgba(255, 215, 0, 0.6) 0%, transparent 40%),
    radial-gradient(circle at 85% 15%, rgba(255, 193, 7, 0.5) 0%, transparent 35%),
    radial-gradient(circle at 45% 55%, rgba(255, 235, 59, 0.3) 0%, transparent 30%),
    radial-gradient(circle at 75% 75%, rgba(255, 215, 0, 0.5) 0%, transparent 45%),
    radial-gradient(circle at 25% 25%, rgba(255, 160, 0, 0.4) 0%, transparent 35%),
    radial-gradient(circle at 65% 35%, rgba(255, 183, 77, 0.45) 0%, transparent 40%);
  opacity: 0.9;
}

/* Additional bokeh particles */
.app-background::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 90% 90%, rgba(255, 215, 0, 0.15) 0%, transparent 25%),
    radial-gradient(circle at 10% 10%, rgba(255, 193, 7, 0.12) 0%, transparent 20%),
    radial-gradient(circle at 55% 15%, rgba(255, 235, 59, 0.1) 0%, transparent 18%),
    radial-gradient(circle at 30% 80%, rgba(255, 215, 0, 0.13) 0%, transparent 22%);
  animation: bokeh-reverse 40s ease-in-out infinite reverse;
  filter: blur(80px);
  opacity: 0.6;
  z-index: -1;
}

.v-theme--dark .app-background::after {
  background: 
    radial-gradient(circle at 90% 90%, rgba(255, 215, 0, 0.25) 0%, transparent 25%),
    radial-gradient(circle at 10% 10%, rgba(255, 193, 7, 0.22) 0%, transparent 20%),
    radial-gradient(circle at 55% 15%, rgba(255, 235, 59, 0.18) 0%, transparent 18%),
    radial-gradient(circle at 30% 80%, rgba(255, 215, 0, 0.23) 0%, transparent 22%);
  opacity: 0.7;
  z-index: -1;
}

@keyframes bokeh {
  0%, 100% {
    transform: translate(0, 0) scale(1) rotate(0deg);
  }
  25% {
    transform: translate(20px, -15px) scale(1.1) rotate(90deg);
  }
  50% {
    transform: translate(-10px, 25px) scale(0.9) rotate(180deg);
  }
  75% {
    transform: translate(15px, -20px) scale(1.05) rotate(270deg);
  }
}

@keyframes bokeh-reverse {
  0%, 100% {
    transform: translate(0, 0) scale(1) rotate(360deg);
  }
  33% {
    transform: translate(-25px, 20px) scale(1.15) rotate(240deg);
  }
  66% {
    transform: translate(30px, -25px) scale(0.85) rotate(120deg);
  }
}
</style>
