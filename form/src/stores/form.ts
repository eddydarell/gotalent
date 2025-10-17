import { defineStore } from 'pinia'
import type { FormData, ValidationErrors } from '@/types'

export const useFormStore = defineStore('form', {
  state: () => ({
    formData: {
      // Informations personnelles
      nom: '',
      postNom: '',
      prenom: '',
      sexe: '',
      dateNaissance: '',
      email: '',
      telephone: '',
      adresse: '',

      // Education
      diplome: '',
      etablissement: '',
      anneeObtention: null,

      // Expérience professionnelle
      poste: '',
      entreprise: '',
      anneesExperience: null,
      descriptionPoste: '',

      // A propos de l'événement
      commentEntendu: [],
      attentes: [],
      commentairesSupplementaires: '',
      accepteTermes: false,
      accepteUtilisationDonnees: false,
      souhaiteInformationsFutures: false,
    } as FormData,
    
    currentStep: 0,
    errors: {} as ValidationErrors,
    isSubmitting: false,
    isAutoSaving: false,
  }),

  getters: {
    progressPercentage: (state) => {
      const totalSteps = 4
      return Math.round(((state.currentStep + 1) / totalSteps) * 100)
    },
    
    isStepValid: (state) => {
      return (step: number) => {
        switch (step) {
          case 0: // Informations personnelles
            return !!(state.formData.nom && state.formData.sexe && state.formData.email)
          case 1: // Education
            return !!(state.formData.diplome && state.formData.etablissement && state.formData.anneeObtention)
          case 2: // Expérience professionnelle
            return !!state.formData.poste
          case 3: // A propos de l'événement
            return !!(
              state.formData.commentEntendu.length > 0 &&
              state.formData.attentes.length > 0 &&
              state.formData.accepteTermes &&
              state.formData.accepteUtilisationDonnees
            )
          default:
            return false
        }
      }
    },
  },

  actions: {
    updateFormData(field: keyof FormData, value: any) {
      this.formData[field] = value as never
      this.autoSave()
    },

    setStep(step: number) {
      this.currentStep = step
    },

    nextStep() {
      if (this.currentStep < 3) {
        this.currentStep++
      }
    },

    previousStep() {
      if (this.currentStep > 0) {
        this.currentStep--
      }
    },

    setError(field: string, error: string) {
      this.errors[field] = error
    },

    clearError(field: string) {
      delete this.errors[field]
    },

    clearAllErrors() {
      this.errors = {}
    },

    async autoSave() {
      if (this.isAutoSaving) return
      
      this.isAutoSaving = true
      try {
        localStorage.setItem('inscription-form-data', JSON.stringify({
          formData: this.formData,
          currentStep: this.currentStep,
          timestamp: Date.now()
        }))
      } catch (error) {
        console.error('Erreur lors de la sauvegarde automatique:', error)
      } finally {
        this.isAutoSaving = false
      }
    },

    loadSavedData() {
      try {
        const saved = localStorage.getItem('inscription-form-data')
        if (saved) {
          const { formData, currentStep, timestamp } = JSON.parse(saved)
          
          // Vérifier que les données ne sont pas trop anciennes (7 jours)
          const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000
          if (Date.now() - timestamp < sevenDaysInMs) {
            this.formData = { ...this.formData, ...formData }
            this.currentStep = currentStep || 0
            return true
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données sauvegardées:', error)
      }
      return false
    },

    clearSavedData() {
      localStorage.removeItem('inscription-form-data')
    },

    async submitForm() {
      this.isSubmitting = true
      this.clearAllErrors()

      try {
        const response = await fetch('/api/inscriptions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.formData),
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.message || 'Erreur lors de la soumission')
        }

        // Nettoyer les données sauvegardées après soumission réussie
        this.clearSavedData()
        
        return result
      } catch (error) {
        throw error
      } finally {
        this.isSubmitting = false
      }
    },

    validateCurrentStep(): boolean {
      this.clearAllErrors()
      let isValid = true

      switch (this.currentStep) {
        case 0: // Informations personnelles
          if (!this.formData.nom.trim()) {
            this.setError('nom', 'Le nom est requis')
            isValid = false
          }
          if (!this.formData.sexe) {
            this.setError('sexe', 'Le sexe est requis')
            isValid = false
          }
          if (!this.formData.email.trim()) {
            this.setError('email', 'L\'email est requis')
            isValid = false
          } else if (!/\S+@\S+\.\S+/.test(this.formData.email)) {
            this.setError('email', 'Format d\'email invalide')
            isValid = false
          }
          break

        case 1: // Education
          if (!this.formData.diplome.trim()) {
            this.setError('diplome', 'Le diplôme est requis')
            isValid = false
          }
          if (!this.formData.etablissement.trim()) {
            this.setError('etablissement', 'L\'établissement est requis')
            isValid = false
          }
          if (!this.formData.anneeObtention) {
            this.setError('anneeObtention', 'L\'année d\'obtention est requise')
            isValid = false
          }
          break

        case 2: // Expérience professionnelle
          if (!this.formData.poste.trim()) {
            this.setError('poste', 'Le poste est requis')
            isValid = false
          }
          break

        case 3: // A propos de l'événement
          if (this.formData.commentEntendu.length === 0) {
            this.setError('commentEntendu', 'Veuillez sélectionner au moins une option')
            isValid = false
          }
          if (this.formData.attentes.length === 0) {
            this.setError('attentes', 'Veuillez sélectionner au moins une attente')
            isValid = false
          }
          if (!this.formData.accepteTermes) {
            this.setError('accepteTermes', 'Vous devez accepter les termes et conditions')
            isValid = false
          }
          if (!this.formData.accepteUtilisationDonnees) {
            this.setError('accepteUtilisationDonnees', 'Vous devez accepter l\'utilisation de vos données')
            isValid = false
          }
          break
      }

      return isValid
    },
  },
})
