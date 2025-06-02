# Movie Review Web App

This is a simple web application that allows users to add and search for movie reviews. Data is stored in Firebase Realtime Database. The project is designed to be easily deployable on GitHub Pages.

## Features

- Add new movie reviews:
    - Input movie title.
    - Rate the movie from 1 to 5 stars.
    - Write a short review (max 150 characters).
- Search existing movie reviews:
    - Search by movie title.
    - View all added reviews.
- Data persistence using Firebase Realtime Database.

## Project Setup

To run this project locally or deploy it, you'll need to configure Firebase.

### 1. Firebase Setup

1.  **Create a Firebase Project:**
    *   Go to the [Firebase Console](https://console.firebase.google.com/).
    *   Click on "Add project" and follow the setup steps.
2.  **Register your app with Firebase:**
    *   In your Firebase project dashboard, click on the "Web" icon (`</>`) to add a web app.
    *   Give your app a nickname and click "Register app".
    *   Firebase will provide you with a configuration object (firebaseConfig). **Copy this object.**
3.  **Enable Firebase Realtime Database:**
    *   In your Firebase project dashboard, go to "Realtime Database" (or "Build" > "Realtime Database").
    *   Click "Create Database".
    *   Choose a region.
    *   Select "Start in **test mode**" for initial development (allows read/write without authentication). For production, you should configure security rules.
    *   Click "Enable".
4.  **Update `script.js`:**
    *   Open the `script.js` file in this project.
    *   Find the `firebaseConfig` object near the top:
        ```javascript
        const firebaseConfig = {
          apiKey: "YOUR_API_KEY",
          authDomain: "YOUR_AUTH_DOMAIN",
          databaseURL: "YOUR_DATABASE_URL", // Make sure this matches your Realtime Database URL
          projectId: "YOUR_PROJECT_ID",
          storageBucket: "YOUR_STORAGE_BUCKET",
          messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
          appId: "YOUR_APP_ID"
        };
        ```
    *   Replace the placeholder values (`"YOUR_API_KEY"`, etc.) with the actual values from the Firebase configuration object you copied in step 1.2.

### 2. Running the Application

*   Once Firebase is configured in `script.js`:
    *   Open `index.html` in your web browser to add movie reviews.
    *   Open `search.html` in your web browser to search for movie reviews.

## Usage

-   **Adding a Review (`index.html`):**
    1.  Enter the movie title.
    2.  Select a star rating (1-5 stars).
    3.  Write a short review (up to 150 characters).
    4.  Click "Save Review".
-   **Searching Reviews (`search.html`):**
    1.  The page loads all existing reviews by default.
    2.  Type a movie title in the search box and click "Search" (or press Enter).
    3.  Click "Clear" to clear the search and view all reviews again.

## Deployment to GitHub Pages

1.  Ensure your repository has the `index.html` file at the root (or configure GitHub Pages to use a specific folder).
2.  Go to your repository settings on GitHub.
3.  Navigate to the "Pages" section.
4.  Choose the branch to deploy from (e.g., `main` or `master`).
5.  Select the folder (usually `/root`).
6.  Save the settings. GitHub will provide you with the URL for your live page.

**Note on Firebase Security Rules:**
For this project, the Firebase Realtime Database is likely set up in "test mode," which allows open read/write access. For a production application, you **must** configure proper security rules to protect your data. For example, you might only allow authenticated users to write data.
```
