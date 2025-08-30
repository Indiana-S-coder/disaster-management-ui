import React, { useState, useEffect } from 'react';
import { getResources, socket } from '../api';

interface ResourceMapProps {
  disasterId: string;
  lat: number;
  lon: number;
}

const ResourceMap: React.FC<ResourceMapProps> = ({ disasterId, lat, lon }) => {
  const [resources, setResources] = useState<any[]>([]);

  const fetchResources = async () => {
    if (!lat || !lon) return;
    try {
      const response = await getResources(disasterId, lat, lon);
      setResources(response.data);
    } catch (error) {
      console.error('Failed to fetch resources', error);
    }
  };

  useEffect(() => {
    fetchResources();

    const handleResourcesUpdate = () => {
      fetchResources();
    };

    socket.on('resources_updated', handleResourcesUpdate);

    return () => {
      socket.off('resources_updated', handleResourcesUpdate);
    };
  }, [disasterId, lat, lon]);

  return (
    <div>
      <h4>Nearby Resources</h4>
      <ul>
        {resources.map(r => (
          <li key={r.id}>{r.name} - {r.type} at {r.location_name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ResourceMap;

