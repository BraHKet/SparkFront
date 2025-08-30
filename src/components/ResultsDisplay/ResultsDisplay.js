// ResultsDisplay.js
import React, { useState } from 'react';
import PainPointCard from '../PainPointCard/PainPointCard';
import styles from './ResultsDisplay.module.css';

const ResultsDisplay = ({ results, selected, setSelected, onAnalyze, onCollectInfo, isCollecting }) => {
    
    const handleSelection = (ppTitle, isChecked) => {
        if (isChecked) {
            setSelected(prev => [...prev, results.find(r => r.title === ppTitle)]);
        } else {
            setSelected(prev => prev.filter(r => r.title !== ppTitle));
        }
    };

    const [showComingSoon, setShowComingSoon] = useState(false);
    const handleComingSoon = () => {
        setShowComingSoon(true);
        setTimeout(() => setShowComingSoon(false), 2000); // Nasconde dopo 2 secondi
    };
    
    const selectedTitles = new Set(selected.map(s => s.title));

    return (
    <div className={styles.container}>
        <div className={styles.toolbar}>
            <h2>Analysis Results</h2>
            
            {/* Contenitore per i pulsanti di azione */}
            <div>
                <button
                    //onClick={() => onCollectInfo(selected)}
                    onClick={handleComingSoon}
                    disabled={selected.length === 0 || selected.length > 5 || isCollecting}
                    className={styles.collectButton}
                    title={selected.length > 5 ? "You can select up to 5 pain points at a time" : ""}
                >
                    {isCollecting ? 'Digging Deeper...' : `Explore Data (${selected.length} sel.)`}
                </button>
            </div>
        </div>
        
        <div className={styles.resultsList}>
            {results.map(pp => (
                <PainPointCard
                    key={pp.title}
                    painPoint={pp}
                    isSelected={selectedTitles.has(pp.title)}
                    onSelectionChange={(isChecked) => handleSelection(pp.title, isChecked)}
                    onAnalyze={() => onAnalyze(pp)}
                />
            ))}
        </div>
        {showComingSoon && (
                <div className={styles.comingSoonOverlay}>
                    <div className={styles.comingSoonText}>COMING SOON</div>
                </div>
            )}
    </div>
);
};
export default ResultsDisplay;