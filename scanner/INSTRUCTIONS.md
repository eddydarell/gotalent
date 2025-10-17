# Go Talent Scanner

1. Create a simple vanilla js pwa that used the host's device camera to scan a qr code for an event
2. Use tailwind css for styling
3. The scanned qr code is a vCard
4. The app should extract the vCard's email and phone number
5. This information should be used to fetch the event's participants information from a google spreadsheet document at the URL #fetch https://docs.google.com/spreadsheets/d/1m4hh4D9zVg96QznABLW17hgswURBXjq7c6xKT5dd6wY/edit?gid=1843963371#gid=1843963371
6. Test if the number OR email exists in the spreadsheet
7. The number is DR Congo phone numbers format +243XXXXXXXXXX OR without the country code 0XXXXXXXXXX
8. If EITHER the email or phone number exists, display a message "You are registered for the event" and the participant's name
9. If neither exists, display a message "You are not registered for the event"
10. Ensure the app is a PWA with service worker and manifest file
11. The UI should be simple, Ask the user for permission to use the camera
12. If the camera permission is denied, display a message "Camera permission is required to scan the QR code"
13. Use html5-qrcode library for QR code scanning #fetch https://www.npmjs.com/package/html5-qrcode
14. Use npm to manage dependencies
15. The UI should be responsive and work on both mobile and desktop devices
16. When camera permission is granted, start scanning for QR codes immediately
