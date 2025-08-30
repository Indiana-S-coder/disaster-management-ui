import React, { useState, useEffect } from 'react';
import { getOfficialUpdates } from '../api';

interface OfficialUpdatesProps {
  disasterId: string;
}

const OfficialUpdates: React.FC<OfficialUpdatesProps> = ({ disasterId }) => {
  const [updates, setUpdates] = useState<any[]>([]);

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const response = await getOfficialUpdates(disasterId);
        setUpdates(response.data);
      } catch (error) {
        console.error('Failed to fetch official updates', error);
      }
    };
    fetchUpdates();
  }, [disasterId]);

  return (
    <div>
      <h4>Official Updates</h4>
      {/* This assumes the scraped data is an array of objects with a 'title' and 'link' */}
      <ul>
        {updates.map((update, index) => (
          <li key={index}>
            <a href={update.link} target="_blank" rel="noopener noreferrer">{update.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OfficialUpdates;
