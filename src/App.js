// App.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import SearchForm from './components/SearchForm/SearchForm';
import LoadingIndicator from './components/LoadingIndicator/LoadingIndicator';
import ResultsDisplay from './components/ResultsDisplay/ResultsDisplay';
import AnalysisModal from './components/AnalysisModal/AnalysisModal';
import FeedbackButton from './components/FeedbackButton/FeedbackButton';
import FeedbackModal from './components/FeedbackModal/FeedbackModal';
import EmailPrompt from './components/EmailPrompt/EmailPrompt'; // Importa il nuovo componente
import './App.css';

function App() {
    // NUOVO STATO per gestire se l'email è già stata inserita
    const [hasEnteredEmail, setHasEnteredEmail] = useState(false);
    // NUOVO STATO per memorizzare l'email dell'utente
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        try {
            // Prova a recuperare la lista di feedback dal localStorage
            const savedFeedback = localStorage.getItem('feedbackList');

            // Se esiste, la convertiamo da stringa a array e aggiorniamo lo stato
            if (savedFeedback) {
                setFeedbackList(JSON.parse(savedFeedback));
                console.log('✅ Feedback precedenti caricati dal localStorage!');
            }

            // --- NUOVA LOGICA PER L'EMAIL ---
            const savedEmail = localStorage.getItem('userEmail');
            if (savedEmail) {
                setUserEmail(savedEmail);
                setHasEnteredEmail(true); // L'email è già stata inserita
                console.log('✅ Email utente caricata dal localStorage!');
            } else {
                setHasEnteredEmail(false); // L'email non è ancora stata inserita
            }
            // --- FINE NUOVA LOGICA ---

        } catch (error) {
            console.error("Errore nel caricamento dei dati dal localStorage:", error);
        }
    }, []); // L'array vuoto [] assicura che venga eseguito solo all'inizio


    const [results, setResults] = useState([]);
    const [selectedPainPoints, setSelectedPainPoints] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isCollecting, setIsCollecting] = useState(false);
    const [error, setError] = useState('');
    const [analysisData, setAnalysisData] = useState(null);
    const [currentTopic, setCurrentTopic] = useState('');
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [feedbackSubmissionMessage, setFeedbackSubmissionMessage] = useState('');

    const [feedbackList, setFeedbackList] = useState([]);

    const handleSearch = async (topic) => {
        setIsLoading(true);
        setCurrentTopic(topic);
        setError('');
        setResults([]);
        setSelectedPainPoints([]);
        try {
            const response = await axios.post('https://sparkback.onrender.com/api/brainstorm', { topic });
            setResults(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Si è verificato un errore di comunicazione con il server.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCollectInfo = async (painPointsToEnrich) => {
        setIsCollecting(true);
        setError('');
        try {
            const response = await axios.post('https://sparkback.onrender.com/api/collect-more-info', {
                topic: currentTopic,
                painPoints: painPointsToEnrich
            });
            const updatedPainPoints = response.data;
            setResults(prevResults => {
                const newResults = [...prevResults];
                updatedPainPoints.forEach(updatedPp => {
                    const index = newResults.findIndex(r => r.title === updatedPp.title);
                    if (index !== -1) { newResults[index] = updatedPp; }
                });
                return newResults;
            });
            setSelectedPainPoints([]);
        } catch (err) {
            setError(err.response?.data?.error || 'Si è verificato un errore durante la raccolta di nuovi dati.');
        } finally {
            setIsCollecting(false);
        }
    };

    const handleFeedbackSubmit = async (feedbackText) => {
        const newFeedback = {
            text: feedbackText,
            timestamp: new Date().toLocaleString('it-IT'),
            userEmail: userEmail // Aggiungiamo l'email dell'utente al feedback
        };

        const updatedList = [...feedbackList, newFeedback];

        setFeedbackList(updatedList);

        try {
            localStorage.setItem('feedbackList', JSON.stringify(updatedList));

            setFeedbackSubmissionMessage('Feedback salvato permanentemente nel browser!');
            setIsFeedbackModalOpen(false);

        } catch (error) {
            console.error("Errore nel salvataggio del feedback nel localStorage:", error);
            setFeedbackSubmissionMessage('Errore nel salvataggio. Forse lo spazio è pieno?');
        } finally {
            setTimeout(() => setFeedbackSubmissionMessage(''), 4000);
        }
    };

    // NUOVA FUNZIONE per gestire l'invio dell'email
    const handleEmailSubmit = (email) => {
        try {
            localStorage.setItem('userEmail', email); // Salva l'email nel localStorage
            setUserEmail(email);
            setHasEnteredEmail(true); // Imposta che l'email è stata inserita
            console.log('✅ Email utente salvata nel localStorage:', email);
        } catch (error) {
            console.error("Errore nel salvataggio dell'email nel localStorage:", error);
            alert("Impossibile salvare l'email. Forse lo spazio di archiviazione è pieno?");
        }
    };

    const showFeedbackInConsole = useCallback(() => {
        console.clear();
        console.log("--- 📝 Tutti i Feedback Raccolti ---");
        if (feedbackList.length === 0) {
            console.log("Nessun feedback ancora salvato.");
        } else {
            console.table(feedbackList);
        }
        console.log("------------------------------------");
        // Aggiungiamo un modo per mostrare anche l'email dell'utente
        console.log(`✉️ Email Utente Attuale: ${userEmail || 'Non ancora inserita'}`);
        return `${feedbackList.length} feedback mostrati. Per pulirli, digita: localStorage.removeItem('feedbackList') e localStorage.removeItem('userEmail')`;
    }, [feedbackList, userEmail]); // Dipende anche da userEmail

    useEffect(() => {
        window.showMyFeedback = showFeedbackInConsole;
        //console.log('💡 Suggerimento: digita `showMyFeedback()` in questa console per vedere tutti i feedback raccolti e l\'email dell\'utente.');

        return () => {
            delete window.showMyFeedback;
        }
    }, [showFeedbackInConsole]);


    const handleOpenAnalysis = (painPointData) => setAnalysisData(painPointData);
    const handleCloseAnalysis = () => setAnalysisData(null);

    // Condizione principale: se l'email non è stata inserita, mostra il componente EmailPrompt
    if (!hasEnteredEmail) {
        return <EmailPrompt onSubmit={handleEmailSubmit} />;
    }

    // Se l'email è stata inserita, mostra l'app
    return (
        <div className="App">
            <header className="App-header">
                <h1>SPARK ✦</h1>
                <h2>Pain Point Finder </h2>
                <p>Enter a topic to discover users' problems and complaints on Reddit.</p>
            </header>
            <main>
                <SearchForm onSearch={handleSearch} isLoading={isLoading || isCollecting} />
                {isLoading && <LoadingIndicator />}
                {isCollecting && <p className="collecting-info">I'm looking for more data, please wait...</p>}
                {error && <p className="error">{error}</p>}
                {Array.isArray(results) && results.length > 0 && !isLoading && (
                    <ResultsDisplay
                        results={results}
                        selected={selectedPainPoints}
                        setSelected={setSelectedPainPoints}
                        onAnalyze={handleOpenAnalysis}
                        onCollectInfo={handleCollectInfo}
                        isCollecting={isCollecting}
                    />
                )}
            </main>

            <FeedbackButton onClick={() => setIsFeedbackModalOpen(true)} />

            {isFeedbackModalOpen && (
                <FeedbackModal
                    onClose={() => setIsFeedbackModalOpen(false)}
                    onSubmit={handleFeedbackSubmit}
                />
            )}

            {feedbackSubmissionMessage && (
                <div className="feedback-toast">{feedbackSubmissionMessage}</div>
            )}

            <AnalysisModal data={analysisData} onClose={handleCloseAnalysis} />
        </div>
    );
}

export default App;