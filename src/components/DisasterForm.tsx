import React, { useState } from 'react';
import { createDisaster, updateDisaster } from '../api';

interface DisasterFormProps {
  disaster?: any;
}

const DisasterForm: React.FC<DisasterFormProps> = ({ disaster }) => {
  const [title, setTitle] = useState(disaster?.title || '');
  const [description, setDescription] = useState(disaster?.description || '');
  const [locationName, setLocationName] = useState(disaster?.location_name || '');
  const [tags, setTags] = useState(disaster?.tags?.join(', ') || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const disasterData = {
      title,
      description,
      location_name: locationName,
      tags: tags.split(',').map(tag => tag.trim()),
      // Mock user
    };
    const userId = 'netrunnerX'; 

    try {
      if (disaster) {
        await updateDisaster(disaster.id, disasterData, userId);
      } else {
        await createDisaster(disasterData, userId);
      }

    } catch (error) {
      console.error('Failed to save disaster', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{disaster ? 'Edit Disaster' : 'Create Disaster'}</h3>
      <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
      <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required />
      <input type="text" placeholder="Location Name (e.g., Manhattan, NYC)" value={locationName} onChange={e => setLocationName(e.target.value)} />
      <input type="text" placeholder="Tags (comma-separated)" value={tags} onChange={e => setTags(e.target.value)} />
      <button type="submit">{disaster ? 'Update' : 'Create'}</button>
    </form>
  );
};

export default DisasterForm;
