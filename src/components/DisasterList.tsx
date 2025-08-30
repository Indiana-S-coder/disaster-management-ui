import React, { useEffect, useState } from 'react';
import { getDisasters, deleteDisaster, socket } from '../api';

interface Disaster {
    id: string;
    title: string;
    description: string;
    location_name?: string;
    tags: string[];
    location: {
        coordinates: [number, number]; // [longitude, latitude]
      };
  }
// Define a more specific type for the props
interface DisasterListProps {
    onSelectDisaster: (disaster: Disaster) => void;
    refreshTrigger: boolean;
    selectedDisasterId?: string | null;
}

const DisastersList: React.FC<DisasterListProps> = ({ 
    onSelectDisaster, 
    refreshTrigger, 
    selectedDisasterId 
}) => {
  const [disasters, setDisasters] = useState<Disaster[]>([]);

  const fetchDisasters = async () => {
    try {
      const response = await getDisasters();
      setDisasters(response.data);
    } catch (error) {
      console.error('Failed to fetch disasters', error);
    }
  };

  // This useEffect hook handles the initial fetch and socket listeners.
  useEffect(() => {
    fetchDisasters();

    const handleDisasterUpdate = () => {
      fetchDisasters();
    };

    socket.on('disaster_updated', handleDisasterUpdate);

    return () => {
      socket.off('disaster_updated', handleDisasterUpdate);
    };
  }, []);

  // ** New: This useEffect hook listens for the parent's refresh trigger. **
  useEffect(() => {
    // We don't want to fetch on the initial render, only on subsequent changes.
    fetchDisasters();
  }, [refreshTrigger]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent the click from selecting the disaster
    const userId = 'netrunnerX';
    if (window.confirm('Are you sure you want to delete this disaster?')) {
      try {
        await deleteDisaster(id, userId);
        // The socket event will handle refreshing the list automatically
      } catch (error) {
        console.error('Failed to delete disaster', error);
      }
    }
  };

  return (
    <div className="disaster-list-container">
      <ul className="disaster-list">
        {disasters.length === 0 && <p className="no-disasters">No disasters found.</p>}
        {disasters.map(d => (
          <li 
            key={d.id} 
            // ** New: Add a class if the item is selected for styling **
            className={d.id === selectedDisasterId ? 'selected' : ''}
            onClick={() => onSelectDisaster(d)}
          >
            <div className="disaster-info">
              <span className="disaster-title">{d.title}</span>
              <span className="disaster-tags">{d.tags.join(', ')}</span>
            </div>
            <button 
              onClick={(e) => handleDelete(e, d.id)} 
              className="delete-btn"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DisastersList;
