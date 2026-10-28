/**
 * Firebase Project Configuration & Authentication Provider Setup
 * Connected to: smart-grocery-tracker-52ac2
 */
window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyDElaAnQSNpoh2Okx9Oxlx4FcJ0mmYg_8M",
  authDomain: "smart-grocery-tracker-52ac2.firebaseapp.com",
  projectId: "smart-grocery-tracker-52ac2",
  storageBucket: "smart-grocery-tracker-52ac2.firebasestorage.app",
  messagingSenderId: "377525411155",
  appId: "1:377525411155:web:ab6207540639f5cd5515a6"
};

/**
 * Initialize Google Auth Provider with email and profile scopes
 */
window.initGoogleAuthProvider = function() {
  if (typeof firebase !== 'undefined' && firebase.auth && firebase.auth.GoogleAuthProvider) {
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    googleProvider.addScope('email');
    googleProvider.addScope('profile');
    googleProvider.setCustomParameters({ prompt: 'select_account' });
    return googleProvider;
  }
  return null;
};
