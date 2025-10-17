# Inscription form

Create a inscription form using VueJS 3 and [Vuetify](https://vuetifyjs.com/en/components/forms/) following these requirements.

1. The form interface will be entirely in french.
2. The form will include validation for all fields.
3. The form web app will be responsive and user-friendly and with clear delimitation for each section and clear indication of required fields.
4. The form will be served and built using modern best practices with Vite.
5. The form will include user feedback for successful submission and error handling.
6. The form will be connected to a SQLite database connected via a hono server.
7. Use Deno for backend server tooling.
8. Use TypeScript for all code.
9. The form will include fields, organized in sections:
   - Informations personnelles
     - Nom (required)
     - Post-nom
     - Prénom
     - Sexe (required)
     - Date de naissance
     - Email (required)
     - Téléphone
     - Adresse
   - Education
     - Diplôme (required)
     - Établissement (required)
     - Année d'obtention (required)
   - Expérience professionnelle
     - Poste (required)
     - Entreprise
     - Années d'expérience
     - Description du poste
   - A propos de l'événement
     - Comment avez-vous entendu parler de cet événement ? (required)
       - [ ] LinkedIn
       - [ ] Facebook
       - [ ] WhatsApp
       - [ ] Email de Go-Talent
       - [ ] De bouche à oreille
       - [ ] Autre
     - Qu'attendez-vous de cet événement ? (required)
       - [ ] Networking
       - [ ] Apprentissage
       - [ ] Opportunités d'emploi
       - [ ] Opportunités de stage
       - [ ] Découverte de nouvelles compétences
       - [ ] Marketing
       - [ ] Autre
     - Commentaires supplémentaires (TextArea)
     - Consentement
       - [ ] J'accepte les termes et conditions
       - [ ] J'accepte que mes données soient utilisées dans le cadre de cet événement
     - Souhaitez-vous recevoir des informations sur de futurs événements ?
       - [ ] Oui
       - [ ] Non
10. At the top of the page, add a countdown timer for the event registration deadline.(December 01, 2025)
11. Include a progress bar to indicate the user's progress through the form.
12. Add auto save functionality to the form to prevent data loss. By using local storage, the form can save user input at regular intervals and restore it if the user navigates away or refreshes the page.
13. Implement form submission with validation feedback. If the user submits the form with invalid data, display error messages next to the relevant fields.
14. Ensure that the form is accessible and follows best practices for web accessibility (e.g., proper use of ARIA attributes, keyboard navigation).
15. Add proper icons to the form fields and buttons to enhance the user experience.
16. The users must accept the terms and conditions before submitting the form.
17. Add a dialog/modal containing the terms and conditions that users must accept before submitting the form.
18. Implement a mechanism to track user progress through the form and allow them to resume later.
19. Add a floating action button to toggle dark mode. By default, the form should use the browser's theme.
20. Add a dockerfile to containerize the application for deployment.
21. Add a docker compose file to manage multi-container Docker deployments with the server, the form frontend, a caddy reverse proxy, a SQLite database, and a adminer service.
