// PainPointCard.js
import React, { useState } from 'react';
import styles from './PainPointCard.module.css';

const PainPointCard = ({ painPoint, isSelected, onSelectionChange, onAnalyze }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <input 
                    type="checkbox" 
                    className={styles.checkbox}
                    checked={isSelected}
                    onChange={(e) => onSelectionChange(e.target.checked)}
                />
                <h3 className={styles.title}>{painPoint.title}</h3>
                <div className={styles.score}>
                    🔥 {painPoint.engagementScore} <span>Engagement</span>
                </div>
                <div className={styles.actions}>
                    <button onClick={onAnalyze} className={styles.actionBtn}>Analyze</button>
                    <button onClick={() => setIsExpanded(!isExpanded)} className={styles.actionBtn}>
                        {isExpanded ? 'Close Post' : `Show ${painPoint.posts.length} Post`}
                    </button>
                </div>
            </div>
            {isExpanded && (
                <div className={styles.postsContainer}>
                    {painPoint.posts.map(post => (
                        <div key={post.id} className={styles.post}>
                            <strong>{post.title}</strong>
                            <p>{post.text.substring(0, 200)}...</p>
                            <a href={post.url} target="_blank" rel="noopener noreferrer">Read on Reddit</a>
                            <span>(👍 {post.upvotes} / 💬 {post.comments_count})</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
export default PainPointCard;
