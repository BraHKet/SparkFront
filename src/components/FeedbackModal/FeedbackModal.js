import React, { useState } from 'react';
import './FeedbackModal.css';

function FeedbackModal({ onClose, onSubmit }) {
    const [feedbackText, setFeedbackText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (feedbackText.trim() === '') {
            alert('Please, enter your feedback.');
            return;
        }
        setIsSubmitting(true);
        await onSubmit(feedbackText);
        setIsSubmitting(false);
        setFeedbackText('');
    };

    return (
        <div className="feedback-modal-overlay" onClick={onClose}>
            <div className="feedback-modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Your Feedback</h2>
                <p>Help us improve! Write your suggestions or report any issues below.</p>
                <form onSubmit={handleSubmit}>
                    <textarea
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="Your feedback..."
                        rows="5"
                        required
                        disabled={isSubmitting}
                    ></textarea>
                    <div className="modal-actions">
                        <button type="button" onClick={onClose} disabled={isSubmitting} className="cancel-btn">Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="submit-btn">
                            {isSubmitting ? 'Sending...' : 'Send Feedback'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default FeedbackModal;