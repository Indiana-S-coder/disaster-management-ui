import React, { useState, useEffect } from 'react';
import { getSocialMediaReports, socket } from '../api';

interface SocialMediaFeedProps {
  disasterId: string;
}

const SocialMediaFeed: React.FC<SocialMediaFeedProps> = ({ disasterId }) => {
  const [reports, setReports] = useState<any[]>([]);

  const fetchReports = async () => {
    try {
      const response = await getSocialMediaReports(disasterId);
      setReports(response.data);
    } catch (error) {
      console.error('Failed to fetch social media reports', error);
    }
  };

  useEffect(() => {
    fetchReports();

    const handleSocialMediaUpdate = () => {
      fetchReports();
    };

    socket.on('social_media_updated', handleSocialMediaUpdate);

    return () => {
      socket.off('social_media_updated', handleSocialMediaUpdate);
    };
  }, [disasterId]);

  return (
    <div>
      <h4>Social Media Feed</h4>
      <ul>
        {reports.map((report, index) => (
          <li key={index}>{report.post} - by {report.user}</li>
        ))}
      </ul>
    </div>
  );
};

export default SocialMediaFeed;
