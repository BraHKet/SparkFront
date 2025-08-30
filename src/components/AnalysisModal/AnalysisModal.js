// AnalysisModal.js
import React from 'react';
import styles from './AnalysisModal.module.css';

const AnalysisModal = ({ data, onClose }) => {
    if (!data) return null;
    
    // Ordina i post per engagement per visualizzare i più importanti
    const sortedPosts = [...data.posts].sort((a,b) => (b.upvotes + b.comments_count) - (a.upvotes + a.comments_count));

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>&times;</button>
                <h2>Pain Point Analysis</h2>
                <h3 className={styles.title}>"{data.title}"</h3>
                
                <div className={styles.metrics}>
                    <div>
                        <span className={styles.metricValue}>{data.engagementScore}</span>
                        <span className={styles.metricLabel}>Total Engagement Score</span>
                    </div>
                    <div>
                        <span className={styles.metricValue}>{data.posts.length}</span>
                        <span className={styles.metricLabel}>Relevant Posts Found</span>
                    </div>
                </div>

                <h4>Top Posts (sorted by engagement)</h4>
                <div className={styles.postList}>
                    {sortedPosts.slice(0, 5).map(post => ( // Mostra i top 5
                        <div key={post.id} className={styles.postItem}>
                            <a href={post.url} target="_blank" rel="noopener noreferrer">{post.title}</a>
                            <div className={styles.postStats}>
                                👍 {post.upvotes} | 💬 {post.comments_count}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default AnalysisModal;
