<template>
  <div class="pa-4">
    <v-card-title class="text-h5 mb-4">
      <v-icon icon="mdi-school" class="mr-3" />
      Éducation
    </v-card-title>
    
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="formData.diplome"
          label="Diplôme *"
          placeholder="Ex: Licence en Informatique"
          :error-messages="errors.diplome"
          required
          variant="outlined"
          prepend-inner-icon="mdi-certificate"
          @input="updateField('diplome', $event.target.value)"
        />
      </v-col>
      
      <v-col cols="12" md="6">
        <v-text-field
          v-model="formData.etablissement"
          label="Établissement *"
          placeholder="Ex: Université de Kinshasa"
          :error-messages="errors.etablissement"
          required
          variant="outlined"
          prepend-inner-icon="mdi-school"
          @input="updateField('etablissement', $event.target.value)"
        />
      </v-col>
      
      <v-col cols="12" md="6">
        <v-text-field
          v-model="formData.anneeObtention"
          label="Année d'obtention *"
          type="number"
          :min="1950"
          :max="new Date().getFullYear()"
          placeholder="Ex: 2023"
          :error-messages="errors.anneeObtention"
          required
          variant="outlined"
          prepend-inner-icon="mdi-calendar"
          @input="updateField('anneeObtention', parseInt($event.target.value) || null)"
        />
      </v-col>
    </v-row>
    
    <v-alert
      type="info"
      variant="tonal"
      class="mt-4"
    >
      Indiquez votre plus haut niveau d'éducation atteint.
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
