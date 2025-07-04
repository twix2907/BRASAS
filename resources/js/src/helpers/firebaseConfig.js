// helpers/firebaseConfig.js
// Configuración e inicialización de Firebase para D'Brasas y Carbón
// Solo importa y usa "app" o los servicios que necesites en otros módulos

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCFFDlJw8O1kLY-1wwPONScjxRzumpELEE",
  authDomain: "dbrasasycarbon-f154a.firebaseapp.com",
  projectId: "dbrasasycarbon-f154a",
  storageBucket: "dbrasasycarbon-f154a.firebasestorage.app",
  messagingSenderId: "253431555479",
  appId: "1:253431555479:web:314d12b8ae8188db4450d2"
};

// Inicializa Firebase solo una vez
const app = initializeApp(firebaseConfig);

export default app;
