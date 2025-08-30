// src/components/EmailPrompt/EmailPrompt.js
import React, { useState } from 'react';
import './EmailPrompt.css'; // Creeremo questo file CSS

function EmailPrompt({ onSubmit }) {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email) {
            onSubmit(email);
        } else {
            alert("Per favore, inserisci un'email valida.");
        }
    };

    return (
        <div className="email-prompt-overlay">
            <div className="email-prompt-modal">
                <h2>Benvenuto su Pain Point Finder!</h2>
                <p>Prima di iniziare, per favore inserisci la tua email. Questo ci aiuta a migliorare l'esperienza e non ti verrà chiesto di nuovo.</p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="La tua email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit">Accedi all'App</button>
                </form>
            </div>
        </div>
    );
}

export default EmailPrompt;