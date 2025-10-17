<template>
  <div class="pa-4">
    <v-card-title class="text-h5 mb-4">
      <v-icon icon="mdi-briefcase" class="mr-3" />
      Expérience professionnelle
    </v-card-title>
    
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="formData.poste"
          label="Poste actuel *"
          placeholder="Ex: Développeur Full-Stack"
          :error-messages="errors.poste"
          required
          variant="outlined"
          prepend-inner-icon="mdi-account-tie"
          @input="updateField('poste', $event.target.value)"
        />
      </v-col>
      
      <v-col cols="12" md="6">
        <v-text-field
          v-model="formData.entreprise"
          label="Entreprise"
          placeholder="Ex: Tech Solutions DRC"
          variant="outlined"
          prepend-inner-icon="mdi-office-building"
          @input="updateField('entreprise', $event.target.value)"
        />
      </v-col>
      
      <v-col cols="12" md="6">
        <v-text-field
          v-model="formData.anneesExperience"
          label="Années d'expérience"
          type="number"
          min="0"
          max="50"
          placeholder="Ex: 3"
          variant="outlined"
          prepend-inner-icon="mdi-clock"
          @input="updateField('anneesExperience', parseInt($event.target.value) || null)"
        />
      </v-col>
      
      <v-col cols="12">
        <v-textarea
          v-model="formData.descriptionPoste"
          label="Description du poste"
          placeholder="Décrivez brièvement vos responsabilités et réalisations principales..."
          rows="4"
          variant="outlined"
          prepend-inner-icon="mdi-text"
          @input="updateField('descriptionPoste', $event.target.value)"
        />
      </v-col>
    </v-row>
    
    <v-alert
      type="info"
      variant="tonal"
      class="mt-4"
    >
      Indiquez votre expérience professionnelle la plus récente ou pertinente.
    </v-alert>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFormStore } from '@/stores/form'

const formStore = useFormStore()

const formData = computed(() => formStore.formData)
const errors = computed(() => formStore.errors)

const updateField = (field: string, value: any) => {
  formStore.updateFormData(field as any, value)
  formStore.clearError(field)
}
</script>
