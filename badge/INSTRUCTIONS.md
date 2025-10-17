# Go Talent

Create a PWA that will be basic web app that will display the details for each participant in the Go Talent event.

## Instructions

1. Create a new PWA using vanilla JS and [animejs](https://animejs.com/) for animations.
2. The PWA should have a login page with a single input for the participant's email.
3. After logging in, the main page should display the details for the logged-in participant in a business card-like format.
4. The participant details should include:
   - Timestamp (Timestamp) (THe registration time)
   - Email (Email)
   - Contact Number (Contact Number)
   - How did you hear about the Go Talent event? (Comment avez-vous entendu parler de l’événement Go Talent ?)
   - Please select your area of expertise (Veuillez sélectionner votre domaine d’expertise :)
   - Gender (Genre)
   - What are your goals for participating? (Quel(s) objectif(s) avez-vous en participant ?)
   - Please specify what you expect from this conference (contenu, contacts, suivi, etc.). (Merci de préciser ce que vous attendez de cette conférence (contenu, contacts, suivi, etc.).)
   - Email Address (Email Address)
   - Drink (Boisson)
5. The webapp UI is entirely in French.
6. The main page should have a sleek and modern design with nice and smooth animation for some background UI elements. Use animejs for these animations. and publicly available assets such as SVG, icons and images from the web.
7. Ensure the PWA is responsive and works well on both desktop and mobile devices but focus on mobile first.
8. Use service workers to cache the app for offline use.
9. The app should be deployable on a static hosting service like GitHub Pages, Netlify, or Vercel.
10. Include a README file with instructions on how to run the app locally and how to deploy it.
11. Use the data in the provided data/participants.json file to populate the participant details after login.
12. Add a button on the participant card to flip the card and show a QR code containing the participant's name, email address, and contact number (business card like info) using [qrcode.js](https://davidshimjs.github.io/qrcodejs/).
13. use tailwindcss for styling the app to ensure a modern and responsive design.
14. The PWA is for a mining event called "Go Talent" and should reflect the theme of the event in its design and animations. You can find the event details at [Go Talent](https://www.linkedin.com/events/atelierd-changes7345738761684594689/)