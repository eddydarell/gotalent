export interface FormData {
  // Informations personnelles
  nom: string
  postNom: string
  prenom: string
  sexe: string
  dateNaissance: string
  email: string
  telephone: string
  adresse: string

  // Education
  diplome: string
  etablissement: string
  anneeObtention: number | null

  // Expérience professionnelle
  poste: string
  entreprise: string
  anneesExperience: number | null
  descriptionPoste: string

  // A propos de l'événement
  commentEntendu: string[]
  attentes: string[]
  commentairesSupplementaires: string
  accepteTermes: boolean
  accepteUtilisationDonnees: boolean
  souhaiteInformationsFutures: boolean
}

export interface ValidationErrors {
  [key: string]: string | undefined
}

export interface ApiResponse {
  success: boolean
  message: string
  data?: any
}
