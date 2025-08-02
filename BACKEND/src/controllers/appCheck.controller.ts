import { Request, Response, NextFunction } from 'express';
import { initializeApp, cert } from 'firebase-admin/app';
import { getAppCheck } from 'firebase-admin/app-check';


const serviceAccount = require('/path/to/your/serviceAccountKey.json');

initializeApp({
  credential: cert(serviceAccount),
});

export const verifyAppCheckToken = async (req: Request, res: Response, next: NextFunction) => {
  // Get the App Check token from the request header.
  const appCheckToken = req.header('X-Firebase-AppCheck');

  // If no token is provided, deny the request.
  if (!appCheckToken) {
    return res.status(401).send('Unauthorized: App Check token is missing.');
  }

  try {
    await getAppCheck().verifyToken(appCheckToken);

    next();
  } catch (err) {
    // If verification fails, deny the request.
    res.status(401).send('Unauthorized: Invalid App Check token.');
  }
};



// ================================================================================
//CLIENT-SIDE - JavaScript Example (e.g., in your web application)
// ================================================================================
// This shows how your frontend application gets and sends the token.
// */

// You would need to have the Firebase client SDK in your project.
// npm install firebase

// import { initializeApp } from "firebase/app";
// import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";

// // --- SETUP: Do this once when your web app loads ---
// const firebaseConfig = {
//   // Your web app's Firebase configuration
//   apiKey: "...",
//   authDomain: "...",
//   projectId: "...",
//   // ...
// };

// const app = initializeApp(firebaseConfig);

// // Initialize App Check
// // IMPORTANT: You must get a reCAPTCHA Enterprise Site Key from the Google Cloud console
// // and link it to your Firebase project in the App Check settings.
// const appCheck = initializeAppCheck(app, {
//   provider: new ReCaptchaEnterpriseProvider('YOUR_RECAPTCHA_ENTERPRISE_SITE_KEY'),
//   isTokenAutoRefreshEnabled: true // Automatically refresh the token
// });
// // --- END SETUP ---


// // --- USAGE: When making an API call ---
// // The Firebase SDK does NOT automatically add the token to fetch requests.
// // You must do it manually.

// async function generateArticleClient(articleData: any) {
//   let appCheckTokenResponse;
//   try {
//     // The SDK handles getting/caching the token.
//     appCheckTokenResponse = await appCheck.getToken(/* forceRefresh= */ false);
//   } catch (err) {
//     console.error("Failed to get App Check token:", err);
//     // Handle the error: show a message to the user, etc.
//     return;
//   }

//   const { token } = appCheckTokenResponse;

//   // Make the fetch request, including the token in the header.
//   const response = await fetch('/api/v1/article/generate', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'X-Firebase-AppCheck': token, // <-- The crucial header
//     },
//     body: JSON.stringify(articleData),
//   });

//   return response.json();
// }
