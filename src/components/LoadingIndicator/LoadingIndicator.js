// LoadingIndicator.js
import React from 'react';
import styles from './LoadingIndicator.module.css';

const LoadingIndicator = () => (
    <div className={styles.container}>
        <div className={styles.spinner}></div>
        <p className={styles.text}>I'm searching on Reddit and analyzing the results with AI... This may take a minute.</p>
    </div>
);
export default LoadingIndicator;