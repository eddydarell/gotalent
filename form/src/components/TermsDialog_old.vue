<template>
  <v-dialog v-model="dialog" max-width="800" scrollable persistent>
    <v-card>
      <v-card-title class="text-h5 text-center pa-6 bg-primary text-white">
        <v-icon icon="mdi-file-document-outline" class="mr-3" />
        Termes et Conditions
      </v-card-title>
      
      <v-divider />
      
      <v-card-text class="pa-6" style="height: 400px">
        <div class="text-body-1">
          <h3 class="text-h6 mb-4">1. Acceptation des termes</h3>
          <p class="mb-4">
            En vous inscrivant à l'événement Go Talent, vous acceptez d'être lié par ces termes et conditions. 
            Si vous n'acceptez pas ces termes, veuillez ne pas vous inscrire à l'événement.
          </p>
          
          <h3 class="text-h6 mb-4">2. Informations personnelles</h3>
          <p class="mb-4">
            Les informations que vous fournissez lors de l'inscription seront utilisées uniquement dans le cadre 
            de l'organisation et de la gestion de l'événement. Nous nous engageons à protéger vos données 
            personnelles conformément aux lois en vigueur sur la protection des données.
          </p>
          
          <h3 class="text-h6 mb-4">3. Utilisation des données</h3>
          <p class="mb-4">
            Vos données pourront être utilisées pour :
          </p>
          <ul class="mb-4">
            <li>Vous envoyer des informations relatives à l'événement</li>
            <li>Gérer votre participation à l'événement</li>
            <li>Vous contacter en cas de changements ou d'annulation</li>
            <li>Améliorer nos futurs événements (données anonymisées)</li>
          </ul>
          
          <h3 class="text-h6 mb-4">4. Participation à l'événement</h3>
          <p class="mb-4">
            Votre inscription ne garantit pas automatiquement votre participation. 
            Les organisateurs se réservent le droit de sélectionner les participants 
            en fonction des critères définis et de la capacité d'accueil.
          </p>
          
          <h3 class="text-h6 mb-4">5. Annulation et remboursement</h3>
          <p class="mb-4">
            L'événement étant gratuit, aucun remboursement n'est applicable. 
            En cas d'annulation de votre part, veuillez nous en informer dans les plus brefs délais.
          </p>
          
          <h3 class="text-h6 mb-4">6. Propriété intellectuelle</h3>
          <p class="mb-4">
            Tout contenu présenté lors de l'événement (présentations, documents, etc.) 
            reste la propriété de leurs auteurs respectifs. Toute reproduction ou 
            distribution non autorisée est interdite.
          </p>
          
          <h3 class="text-h6 mb-4">7. Responsabilité</h3>
          <p class="mb-4">
            Go Talent décline toute responsabilité en cas de dommages directs ou 
            indirects résultant de votre participation à l'événement.
          </p>
          
          <h3 class="text-h6 mb-4">8. Modifications</h3>
          <p class="mb-4">
            Ces termes et conditions peuvent être modifiés à tout moment. 
            Les participants seront informés de tout changement significatif.
          </p>
          
          <h3 class="text-h6 mb-4">9. Contact</h3>
          <p class="mb-4">
            Pour toute question concernant ces termes et conditions ou l'événement, 
            vous pouvez nous contacter à l'adresse : info@go-talent.cd
          </p>
          
          <p class="text-caption text-grey">
            Dernière mise à jour : Août 2025
          </p>
        </div>
      </v-card-text>
      
      <v-divider />
      
      <v-card-actions class="pa-6 justify-center">
        <v-btn
          variant="outlined"
          @click="decline"
          class="mr-3"
          prepend-icon="mdi-close"
        >
          Refuser
        </v-btn>
        <v-btn
          color="primary"
          @click="accept"
          prepend-icon="mdi-check"
        >
          Accepter les termes
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  accept: []
  decline: []
}>()

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const accept = () => {
  emit('accept')
}

const decline = () => {
  emit('decline')
}
</script>
