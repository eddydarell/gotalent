<template>
  <v-container class="pa-4" max-width="800" style="background:transparent !important" :class="containerClass">
    <v-card class="elevation-3 form-card">
      <!-- Logo Section -->
      <div class="text-center pa-4 logo-section position-relative">
        <v-img 
          src="/assets/logo.png"
          alt="Go Talent Event Logo" 
          max-width="150"
          max-height="150"
          class="mx-auto logo-image"
        />
        <!-- Theme Toggle Button -->
        <v-fab
          :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          @click="toggleTheme"
          color="accent"
          class="theme-toggle-btn position-absolute"
          style="bottom: -25px; right: 16px; z-index: 10; border-radius: 50%;"
        />
      </div>
      
      <v-card-title class="text-h4 text-center gradient-header">
        <div class="title-text">
          L'HUMAIN AU CENTRE
        </div>
        <div class="subtitle-text">
          Compétences recherchées pour mieux servir <br>
          <small>Samedi, 6 Décembre 2025, Novotel, Kolwezi</small>
        </div>
      </v-card-title>

      <!-- Countdown Timer -->
      <CountdownTimer :deadline="eventDeadline" />
      
      

      <!-- Progress Bar -->
      <v-card-text class="pa-0">
        <v-progress-linear
          :model-value="progressPercentage"
          height="8"
          color="success"
          bg-color="grey-lighten-3"
        />
        <div class="text-center pa-2 text-caption">
          Étape {{ currentStep + 1 }} sur 4 ({{ progressPercentage }}%)
        </div>
      </v-card-text>

      <!-- Auto-save indicator -->
      <v-fade-transition>
        <v-alert
          v-if="isAutoSaving"
          type="info"
          variant="tonal"
          density="compact"
          class="ma-2"
        >
          <v-icon icon="mdi-content-save" class="mr-2" />
          Sauvegarde automatique en cours...
        </v-alert>
      </v-fade-transition>

      <!-- Form Steps -->
      <v-card-text class="pa-2">
        <v-form ref="formRef" v-model="valid">
          <v-stepper v-model="currentStep" class="elevation-0" >
            <v-stepper-header>
              <v-stepper-item
                v-for="(step, index) in steps"
                :key="index"
                :value="index"
                :complete="isStepValid(index)"
                :icon="step.icon"
                :title="step.title"
                :color="isStepValid(index) ? 'success' : 'primary'"
              />
            </v-stepper-header>

            <v-stepper-window>
              <!-- Étape 1: Informations personnelles -->
              <v-stepper-window-item :value="0">
                <PersonalInfoStep />
              </v-stepper-window-item>

              <!-- Étape 2: Education -->
              <v-stepper-window-item :value="1">
                <EducationStep />
              </v-stepper-window-item>

              <!-- Étape 3: Expérience professionnelle -->
              <v-stepper-window-item :value="2">
                <ExperienceStep />
              </v-stepper-window-item>

              <!-- Étape 4: A propos de l'événement -->
              <v-stepper-window-item :value="3">
                <EventInfoStep />
              </v-stepper-window-item>
            </v-stepper-window>
          </v-stepper>
        </v-form>
      </v-card-text>

      <!-- Navigation Buttons -->
      <v-card-actions class="pa-4">
        <v-btn
          v-if="currentStep > 0"
          variant="text"
          @click="previousStep"
          prepend-icon="mdi-arrow-left"
        >
          Précédent
        </v-btn>

        <v-spacer />

        <v-btn
          v-if="currentStep < 3"
          color="primary"
          variant="tonal"
          @click="nextStep"
          append-icon="mdi-arrow-right"
          :disabled="!isStepValid(currentStep)"
        >
          Suivant
        </v-btn>

        <v-btn
          v-else
          color="success"
          @click="submitForm"
          variant="tonal"
          prepend-icon="mdi-send"
          :loading="isSubmitting"
          :disabled="!isStepValid(currentStep)"
        >
          Soumettre l'inscription
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- Terms and Conditions Dialog -->
    <TermsDialog
      v-model="showTermsDialog"
      @accept="acceptTerms"
      @decline="declineTerms"
    />

    <!-- Success Dialog -->
    <v-dialog v-model="showSuccessDialog" max-width="500" persistent>
      <v-card>
        <v-card-title class="text-h5 text-center pa-6 bg-success text-white">
          <v-icon icon="mdi-check-circle" class="mr-3" />
          Inscription réussie !
        </v-card-title>
        <v-card-text class="pa-6 text-center">
          <p class="text-h6 mb-4">Merci pour votre inscription !</p>
          <p>Votre demande d'inscription a été soumise avec succès. Vous recevrez un email de confirmation sous peu.</p>
        </v-card-text>
        <v-card-actions class="justify-center pa-6">
          <v-btn
            color="success"
            variant="flat"
            @click="resetForm"
            prepend-icon="mdi-refresh"
          >
            Nouvelle inscription
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Error Dialog -->
    <v-dialog v-model="showErrorDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h5 text-center pa-6 bg-error text-white">
          <v-icon icon="mdi-alert-circle" class="mr-3" />
          Erreur
        </v-card-title>
        <v-card-text class="pa-6 text-center">
          <p>{{ errorMessage }}</p>
        </v-card-text>
        <v-card-actions class="justify-center pa-6">
          <v-btn
            color="error"
            variant="flat"
            @click="showErrorDialog = false"
          >
            Fermer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Restore Data Dialog -->
    <v-dialog v-model="showRestoreDialog" max-width="500" persistent>
      <v-card>
        <v-card-title class="text-h5 text-center pa-6">
          <v-icon icon="mdi-backup-restore" class="mr-3" />
          Données sauvegardées trouvées
        </v-card-title>
        <v-card-text class="pa-6 text-center">
          <p>Nous avons trouvé des données de formulaire sauvegardées précédemment.</p>
          <p>Souhaitez-vous les restaurer pour continuer où vous vous êtes arrêté ?</p>
        </v-card-text>
        <v-card-actions class="justify-center pa-6">
          <v-btn
            variant="outlined"
            @click="declineRestore"
            class="mr-3"
          >
            Non, recommencer
          </v-btn>
          <v-btn
            color="primary"
            @click="acceptRestore"
          >
            Oui, restaurer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useFormStore } from '@/stores/form'
import { useTheme } from 'vuetify'
import CountdownTimer from './CountdownTimer.vue'
import PersonalInfoStep from './steps/PersonalInfoStep.vue'
import EducationStep from './steps/EducationStep.vue'
import ExperienceStep from './steps/ExperienceStep.vue'
import EventInfoStep from './steps/EventInfoStep.vue'
import TermsDialog from './TermsDialog.vue'

const formStore = useFormStore()
const formRef = ref()
const valid = ref(false)

// Theme functionality
const theme = useTheme()
const isDark = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  theme.global.name.value = isDark.value ? 'dark' : 'light'
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

// Dialogs
const showTermsDialog = ref(false)
const showSuccessDialog = ref(false)
const showErrorDialog = ref(false)
const showRestoreDialog = ref(false)
const errorMessage = ref('')

// Event deadline
const eventDeadline = new Date('2025-12-05T23:59:59')

// Computed properties
const currentStep = computed(() => formStore.currentStep)
const progressPercentage = computed(() => formStore.progressPercentage)
const isAutoSaving = computed(() => formStore.isAutoSaving)
const isSubmitting = computed(() => formStore.isSubmitting)
const isStepValid = computed(() => formStore.isStepValid)
const containerClass = computed(() => ({
  'dark-background': isDark.value,
  'light-background': !isDark.value
}))

// Steps configuration
const steps = [
  {
    title: 'Informations personnelles',
    icon: 'mdi-account',
  },
  {
    title: 'Éducation',
    icon: 'mdi-school',
  },
  {
    title: 'Expérience',
    icon: 'mdi-briefcase',
  },
  {
    title: 'Événement',
    icon: 'mdi-calendar-star',
  },
]

// Methods
const nextStep = () => {
  if (formStore.validateCurrentStep()) {
    if (currentStep.value === 2 && !formStore.formData.accepteTermes) {
      showTermsDialog.value = true
      return
    }
    formStore.nextStep()
  }
}

const previousStep = () => {
  formStore.previousStep()
}

const acceptTerms = () => {
  formStore.updateFormData('accepteTermes', true)
  showTermsDialog.value = false
  formStore.nextStep()
}

const declineTerms = () => {
  formStore.updateFormData('accepteTermes', false)
  showTermsDialog.value = false
}

const submitForm = async () => {
  if (!formStore.validateCurrentStep()) {
    return
  }

  try {
    await formStore.submitForm()
    showSuccessDialog.value = true
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Une erreur inconnue s\'est produite'
    showErrorDialog.value = true
  }
}

const resetForm = () => {
  formStore.$reset()
  showSuccessDialog.value = false
}

const acceptRestore = () => {
  showRestoreDialog.value = false
}

const declineRestore = () => {
  formStore.clearSavedData()
  showRestoreDialog.value = false
}

// Auto-save functionality
let autoSaveInterval: NodeJS.Timeout

onMounted(() => {
  // Check for saved data
  if (formStore.loadSavedData()) {
    showRestoreDialog.value = true
  }

  // Initialize theme
  const savedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  isDark.value = savedTheme ? savedTheme === 'dark' : prefersDark
  theme.global.name.value = isDark.value ? 'dark' : 'light'

  // Set up auto-save interval (every 30 seconds)
  autoSaveInterval = setInterval(() => {
    formStore.autoSave()
  }, 30000)
})

// Cleanup
onUnmounted(() => {
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval)
  }
})
</script>

<style scoped>
.light-background {
  background: transparent;
  min-height: 100vh;
  transition: all 0.3s ease;
}

.dark-background {
  background: transparent;
  min-height: 100vh;
  transition: all 0.3s ease;
}

.gradient-header {
  background: linear-gradient(135deg, #B8860B 0%, #DAA520 50%, #FFD700 100%) !important;
  color: #FFFFFF !important;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  border-bottom: 2px solid rgba(255, 215, 0, 0.3);
  position: relative;
  overflow: hidden;
}

.gradient-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  /* animation: shimmer 3s ease-in-out infinite; */
}

.theme-toggle-btn {
    transition: all 0.3s ease;
  }

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

.v-theme--dark .gradient-header {
  background: linear-gradient(135deg, #FFD700 0%, #FFA000 50%, #DAA520 100%) !important;
  color: #1A1611 !important;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.title-text {
  font-size: 2.2rem;
  font-weight: 700;
  letter-spacing: 2px;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
}

.subtitle-text {
  font-size: 1.1rem;
  font-weight: 400;
  opacity: 0.9;
}

/* Responsive styles for mobile devices */
@media (max-width: 600px) {
  .gradient-header {
    padding: 1rem 0.5rem !important;
  }
  
  .title-text {
    font-size: 1.4rem;
    letter-spacing: 1px;
    margin-bottom: 0.3rem;
    line-height: 1.2;
  }
  
  .subtitle-text {
    font-size: 0.9rem;
    line-height: 1.3;
  }
  
  .subtitle-text small {
    font-size: 0.8rem;
  }
  
  .logo-section {
    padding: 1rem 0.5rem !important;
  }
  
  .logo-image {
    max-width: 100px !important;
    max-height: 100px !important;
  }
  
  .theme-toggle-btn {
    right: 8px !important;
    bottom: 20px !important;
  }
  
  .v-card-title {
    padding: 0.5rem !important;
  }
}

/* Extra small screens (XS) */
@media (max-width: 420px) {
  .gradient-header {
    padding: 0.5rem 0.25rem !important;
  }
  
  .title-text {
    font-size: 1.1rem;
    letter-spacing: 0.5px;
    margin-bottom: 0.2rem;
    line-height: 1.1;
  }
  
  .subtitle-text {
    font-size: 0.75rem;
    line-height: 1.2;
  }
  
  .subtitle-text small {
    font-size: 0.7rem;
    display: block;
    margin-top: 0.2rem;
  }
  
  .logo-section {
    padding: 0.5rem 0.25rem !important;
  }
  
  .logo-image {
    max-width: 80px !important;
    max-height: 80px !important;
  }
  
  .theme-toggle-btn {
    right: 4px !important;
    bottom: 6px !important;
  }
  
  .v-card-title {
    padding: 0.25rem !important;
  }
  
  .pa-4 {
    padding: 0.5rem !important;
  }
}

.form-card {
  background: rgba(255, 255, 255, 0.92) !important;
  backdrop-filter: blur(15px);
  border: 2px solid rgba(184, 134, 11, 0.2);
  box-shadow: 0 8px 32px rgba(184, 134, 11, 0.1), 
              0 4px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.v-theme--dark .form-card {
  background: rgba(26, 22, 17, 0.95) !important;
  border: 2px solid rgba(255, 215, 0, 0.3);
  box-shadow: 0 8px 32px rgba(255, 215, 0, 0.2), 
              0 4px 16px rgba(0, 0, 0, 0.3);
}

.v-stepper {
  box-shadow: none !important;
  background: transparent !important;
}

.v-stepper-header {
  box-shadow: none !important;
  border-bottom: 2px solid rgba(184, 134, 11, 0.2);
  background: rgba(255, 248, 225, 0.5) !important;
}

.step-container{
  padding: 0 !important;
  border: 0 !important;
}

.v-theme--dark .v-stepper-header {
  border-bottom: 2px solid rgba(255, 215, 0, 0.3);
  background: rgba(26, 22, 17, 0.7) !important;
}

.theme-toggle-btn {
  box-shadow: 0 4px 12px rgba(184, 134, 11, 0.3) !important;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #FFD700, #FFA000) !important;
}

.v-theme--dark .theme-toggle-btn {
  background: linear-gradient(135deg, #1A1611, #2C1E14) !important;
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4) !important;
}

.theme-toggle-btn:hover {
  transform: translateY(-3px) scale(1.1);
  box-shadow: 0 6px 20px rgba(184, 134, 11, 0.4) !important;
}

.v-theme--dark .theme-toggle-btn:hover {
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.5) !important;
}

.logo-section {
  background-color :  #241710; 
  border-bottom: 2px solid rgba(184, 134, 11, 0.2);
  position: relative;
}

.v-theme--dark .logo-section {
  background: transparent;
  border-bottom: 2px solid rgba(255, 215, 0, 0.3);
}

.logo-image {
  transition: all 0.3s ease;
  filter: drop-shadow(0 4px 8px rgba(184, 134, 11, 0.3));
}

.logo-image:hover {
  transform: scale(1.05) rotate(2deg);
  filter: drop-shadow(0 6px 12px rgba(184, 134, 11, 0.4));
}

.v-theme--dark .logo-image {
  filter: drop-shadow(0 4px 8px rgba(255, 215, 0, 0.4));
}

.v-theme--dark .logo-image:hover {
  filter: drop-shadow(0 6px 12px rgba(255, 215, 0, 0.5));
}

/* Progress bar styling */
:deep(.v-progress-linear) {
  overflow: hidden;
}

:deep(.v-progress-linear__determinate) {
  background: linear-gradient(90deg, #B8860B, #FFD700, #DAA520) !important;
}

/* Button styling */
:deep(.v-btn) {
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0.5px;
}

:deep(.v-btn--variant-outlined) {
  border: 2px solid rgba(184, 134, 11, 0.5);
}

.v-theme--dark :deep(.v-btn--variant-outlined) {
  border: 2px solid rgba(255, 215, 0, 0.5);
}
</style>
