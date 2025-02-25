rules_version = '2';
service cloud.firestore {

match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }

  match /databases/{database}/documents {
    // Permitir a los usuarios autenticados leer y escribir en su propio documento de usuario
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Permitir a los usuarios autenticados leer y escribir en su propia colección general-list
    match /users/{userId}/general-list/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    // Permitir a los usuarios autenticados leer y escribir en su propia colección car-list
     match /users/{userId}/car-list/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Permitir a los usuarios autenticados leer y escribir en cualquier otro lugar donde tengan acceso
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}

