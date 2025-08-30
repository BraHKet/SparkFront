// SearchForm.js
import React, { useState } from 'react';
import styles from './SearchForm.module.css';

const SearchForm = ({ onSearch, isLoading }) => {
    const [topic, setTopic] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (topic.trim() && !isLoading) {
            onSearch(topic);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ex: mechanics, founders, baristas, developers..."
                className={styles.input}
                disabled={isLoading}
            />
            <button type="submit" className={styles.button} disabled={isLoading}>
                {isLoading ? 'Analyzing...' : 'Find Pain Points'}
            </button>
        </form>
    );
};
export default SearchForm;