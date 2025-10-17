<template>
  <div class="pa-4 step-container">
    <v-card-title class="text-h5 mb-4">
      <v-icon icon="mdi-account" class="mr-3" />
      Informations personnelles
    </v-card-title>
    
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="formData.nom"
          label="Nom *"
          placeholder="Votre nom de famille"
          :error-messages="errors.nom"
          required
          variant="outlined"
          prepend-inner-icon="mdi-account"
          @input="updateField('nom', $event.target.value)"
        />
      </v-col>
      
      <v-col cols="12" md="6">
        <v-text-field
          v-model="formData.postNom"
          label="Post-nom"
          placeholder="Votre post-nom"
          variant="outlined"
          prepend-inner-icon="mdi-account"
          @input="updateField('postNom', $event.target.value)"
        />
      </v-col>
      
      <v-col cols="12" md="6">
        <v-text-field
          v-model="formData.prenom"
          label="Prénom"
          placeholder="Votre prénom"
          variant="outlined"
          prepend-inner-icon="mdi-account"
          @input="updateField('prenom', $event.target.value)"
        />
      </v-col>
      
      <v-col cols="12" md="6">
        <v-select
          v-model="formData.sexe"
          label="Sexe *"
          :items="sexeOptions"
          :error-messages="errors.sexe"
          required
          variant="outlined"
          prepend-inner-icon="mdi-gender-male-female"
          @update:model-value="updateField('sexe', $event)"
        />
      </v-col>
      
      <v-col cols="12" md="6">
        <v-text-field
          v-model="formData.dateNaissance"
          label="Date de naissance"
          type="date"
          variant="outlined"
          prepend-inner-icon="mdi-calendar"
          @input="updateField('dateNaissance', $event.target.value)"
        />
      </v-col>
      
      <v-col cols="12" md="6">
        <v-text-field
          v-model="formData.email"
          label="Email *"
          type="email"
          placeholder="votre.email@exemple.com"
          :error-messages="errors.email"
          required
          variant="outlined"
          prepend-inner-icon="mdi-email"
          @input="updateField('email', $event.target.value)"
        />
      </v-col>
      
      <v-col cols="12" md="6">
        <v-text-field
          v-model="formData.telephone"
          label="Téléphone"
          type="tel"
          placeholder="+243 XXX XXX XXX"
          variant="outlined"
          prepend-inner-icon="mdi-phone"
          @input="updateField('telephone', $event.target.value)"
        />
      </v-col>
      
      <v-col cols="12" md="6">
        <v-textarea
          v-model="formData.adresse"
          label="Adresse"
          placeholder="Votre adresse complète"
          rows="3"
          variant="outlined"
          prepend-inner-icon="mdi-map-marker"
          @input="updateField('adresse', $event.target.value)"
        />
      </v-col>
    </v-row>
    
    <v-alert
      type="info"
      variant="tonal"
      class="mt-4"
    >
      Les champs marqués d'un astérisque (*) sont obligatoires.
    </v-alert>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFormStore } from '@/stores/form'

const formStore = useFormStore()

const formData = computed(() => formStore.formData)
const errors = computed(() => formStore.errors)

const sexeOptions = [
  { title: 'Masculin', value: 'Masculin' },
  { title: 'Féminin', value: 'Féminin' },
  { title: 'Autre', value: 'Autre' },
  { title: 'Préfère ne pas dire', value: 'Préfère ne pas dire' }
]

const updateField = (field: string, value: any) => {
  formStore.updateFormData(field as any, value)
  formStore.clearError(field)
}
</script>

<style scoped>
.step-container {
  background: rgba(255, 248, 225, 0.3);
  border: 1px solid rgba(184, 134, 11, 0.1);
}

.v-theme--dark .step-container {
  background: rgba(26, 22, 17, 0.5);
  border-color: rgba(255, 215, 0, 0.2);
}

.step-title {
  color: rgb(var(--v-theme-primary));
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 2px solid rgba(184, 134, 11, 0.2);
  padding-bottom: 1rem;
}

.v-theme--dark .step-title {
  border-bottom-color: rgba(255, 215, 0, 0.3);
}

.step-icon {
  background: linear-gradient(135deg, #FFD700, #FFA000);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 1.8rem;
}

.v-theme--dark .step-icon {
  background: linear-gradient(135deg, #FFD700, #FFE082);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

:deep(.v-field--variant-outlined .v-field__outline) {
  --v-field-border-width: 2px;
  border-color: rgba(184, 134, 11, 0.3);
}

.v-theme--dark :deep(.v-field--variant-outlined .v-field__outline) {
  border-color: rgba(255, 215, 0, 0.4);
}

:deep(.v-field--focused .v-field__outline) {
  border-color: rgb(var(--v-theme-primary)) !important;
  box-shadow: 0 0 0 2px rgba(184, 134, 11, 0.2);
}

.v-theme--dark :deep(.v-field--focused .v-field__outline) {
  box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.3);
}

:deep(.v-field__prepend-inner .v-icon) {
  color: rgb(var(--v-theme-primary));
  opacity: 0.8;
}

</style>
