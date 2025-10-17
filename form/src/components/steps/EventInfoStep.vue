<template>
  <div class="pa-4">
    <v-card-title class="text-h5 mb-4">
      <v-icon icon="mdi-calendar-star" class="mr-3" />
      À propos de l'événement
    </v-card-title>
    
    <v-row>
      <v-col cols="12">
        <v-card variant="outlined" class="mb-4">
          <v-card-title class="text-h6">
            Comment avez-vous entendu parler de cet événement ? *
          </v-card-title>
          <v-card-text>
            <v-checkbox
              v-for="option in commentEntendus"
              :key="option.value"
              v-model="formData.commentEntendu"
              :label="option.title"
              :value="option.value"
              color="primary"
              @update:model-value="updateArrayField('commentEntendu', $event)"
            />
            <v-alert
              v-if="errors.commentEntendu"
              type="error"
              variant="tonal"
              density="compact"
              class="mt-2"
            >
              {{ errors.commentEntendu }}
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12">
        <v-card variant="outlined" class="mb-4">
          <v-card-title class="text-h6">
            Qu'attendez-vous de cet événement ? *
          </v-card-title>
          <v-card-text>
            <v-checkbox
              v-for="option in attentesOptions"
              :key="option.value"
              v-model="formData.attentes"
              :label="option.title"
              :value="option.value"
              color="primary"
              @update:model-value="updateArrayField('attentes', $event)"
            />
            <v-alert
              v-if="errors.attentes"
              type="error"
              variant="tonal"
              density="compact"
              class="mt-2"
            >
              {{ errors.attentes }}
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12">
        <v-textarea
          v-model="formData.commentairesSupplementaires"
          label="Commentaires supplémentaires"
          placeholder="Partagez vos questions, suggestions ou toute autre information utile..."
          rows="4"
          variant="outlined"
          prepend-inner-icon="mdi-comment"
          @input="updateField('commentairesSupplementaires', $event.target.value)"
        />
      </v-col>
      
      <v-col cols="12">
        <v-card variant="outlined" class="mb-4">
          <v-card-title class="text-h6">
            Consentement *
          </v-card-title>
          <v-card-text>
            <v-checkbox
              v-model="formData.accepteTermes"
              color="primary"
              :error-messages="errors.accepteTermes"
              @update:model-value="updateField('accepteTermes', $event)"
            >
              <template #label>
                <span>
                  J'accepte les 
                  <a href="#" @click.prevent="showTerms" class="text-primary text-decoration-underline">
                    termes et conditions
                  </a>
                </span>
              </template>
            </v-checkbox>
            
            <v-checkbox
              v-model="formData.accepteUtilisationDonnees"
              label="J'accepte que mes données soient utilisées dans le cadre de cet événement"
              color="primary"
              :error-messages="errors.accepteUtilisationDonnees"
              @update:model-value="updateField('accepteUtilisationDonnees', $event)"
            />
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12">
        <v-card variant="outlined">
          <v-card-title class="text-h6">
            Communications futures
          </v-card-title>
          <v-card-text>
            <v-radio-group
              v-model="formData.souhaiteInformationsFutures"
              @update:model-value="updateField('souhaiteInformationsFutures', $event)"
            >
              <v-radio
                :value="true"
                label="Oui, j'aimerais recevoir des informations sur de futurs événements"
                color="primary"
              />
              <v-radio
                :value="false"
                label="Non, je ne souhaite pas recevoir d'informations futures"
                color="primary"
              />
            </v-radio-group>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFormStore } from '@/stores/form'

const formStore = useFormStore()

const formData = computed(() => formStore.formData)
const errors = computed(() => formStore.errors)

const emit = defineEmits<{
  showTerms: []
}>()

const commentEntendus = [
  { title: 'LinkedIn', value: 'LinkedIn' },
  { title: 'Facebook', value: 'Facebook' },
  { title: 'WhatsApp', value: 'WhatsApp' },
  { title: 'Email de Go-Talent', value: 'Email de Go-Talent' },
  { title: 'De bouche à oreille', value: 'De bouche à oreille' },
  { title: 'Autre', value: 'Autre' }
]

const attentesOptions = [
  { title: 'Networking', value: 'Networking' },
  { title: 'Apprentissage', value: 'Apprentissage' },
  { title: 'Opportunités d\'emploi', value: 'Opportunités d\'emploi' },
  { title: 'Opportunités de stage', value: 'Opportunités de stage' },
  { title: 'Découverte de nouvelles compétences', value: 'Découverte de nouvelles compétences' },
  { title: 'Marketing', value: 'Marketing' },
  { title: 'Autre', value: 'Autre' }
]

const updateField = (field: string, value: any) => {
  formStore.updateFormData(field as any, value)
  formStore.clearError(field)
}

const updateArrayField = (field: string, value: any) => {
  formStore.updateFormData(field as any, value)
  formStore.clearError(field)
}

const showTerms = () => {
  emit('showTerms')
}
</script>
