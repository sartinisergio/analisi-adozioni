import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { database } from './services/database.service';

// Inizializza il database prima di avviare l'app
database.open()
  .then(() => {
    console.log('✓ Database inizializzato correttamente');
    
    // Monta l'applicazione React
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  })
  .catch((error) => {
    console.error('✗ Errore inizializzazione database:', error);
    
    // Mostra un messaggio di errore all'utente
    document.getElementById('root')!.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: system-ui;">
        <div style="text-align: center; padding: 2rem; background: #fee; border: 2px solid #f00; border-radius: 8px; max-width: 500px;">
          <h2 style="color: #c00; margin-bottom: 1rem;">Errore Inizializzazione Database</h2>
          <p style="color: #666; margin-bottom: 1rem;">
            Non è stato possibile inizializzare il database locale. 
            Questo può accadere se il browser blocca IndexedDB o se sei in modalità privata.
          </p>
          <p style="color: #666; font-size: 0.9rem;">
            <strong>Soluzioni:</strong><br>
            1. Assicurati di non essere in modalità navigazione privata<br>
            2. Controlla le impostazioni del browser per IndexedDB<br>
            3. Prova a ricaricare la pagina<br>
            4. Prova con un altro browser (Chrome, Firefox, Edge)
          </p>
          <button 
            onclick="location.reload()" 
            style="margin-top: 1rem; padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;"
          >
            Ricarica Pagina
          </button>
        </div>
      </div>
    `;
  });
