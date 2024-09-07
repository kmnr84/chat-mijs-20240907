import { initializeApp } from "firebase/app";
import { defineNuxtPlugin } from "#app";
import { browserLocalPersistence, getAuth, onAuthStateChanged, setPersistence } from "firebase/auth";
import { initializeFirestore, persistentLocalCache } from "firebase/firestore";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    storageBucket: config.public.firebaseStorageBucket,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId
  };
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  setPersistence(auth, browserLocalPersistence);
  initializeFirestore(app, { localCache: persistentLocalCache(/*settings*/{}) });

  onAuthStateChanged(auth, user => {
    useCurrentUser().id.value = user?.uid ?? '';

    const path = useRoute().path;
    const isRequiredAuth = !(path.endsWith('login') || path.endsWith('signup'));
    if (!user && isRequiredAuth) navigateTo('/login');
    if (user && !isRequiredAuth) navigateTo('/');
  });
});
