import React, { useState } from 'react';
import api from '../api';

interface ReportFormProps {
  disasterId: string;
  onSuccess: () => void;
}

const ReportForm: React.FC<ReportFormProps> = ({ disasterId, onSuccess }) => {
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Note: The assignment asks for a `reports` table, but no explicit POST endpoint.
      // Assuming a POST to `/disasters/:id/reports` would be appropriate.
      await api.post(`/disasters/${disasterId}/reports`, {
        content,
        image_url: imageUrl,
        user_id: 'citizen1' // Mock user
      });
      onSuccess();
      setContent('');
      setImageUrl('');
    } catch (error) {
      console.error('Failed to submit report', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4>Submit a Report</h4>
      <textarea placeholder="Report content" value={content} onChange={e => setContent(e.target.value)} required />
      <input type="text" placeholder="Image URL" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
      <button type="submit">Submit Report</button>
    </form>
  );
};

export default ReportForm;
