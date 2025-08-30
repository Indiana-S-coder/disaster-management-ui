import React, { useState } from 'react';
import DisasterForm from './components/DisasterForm';
import DisastersList from './components/DisasterList';
import ResourceMap from './components/ResourceMap';
import SocialMediaFeed from './components/SocialMediaFeed';
import OfficialUpdates from './components/OfficialUpdates';
import ImageVerification from './components/ImageVerification';
import './App.css'; // We will add new styles here

// Define a type for our disaster object for better type safety
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

const App: React.FC = () => {
  const [selectedDisaster, setSelectedDisaster] = useState<Disaster | null>(null);
  const [isCreating, setIsCreating] = useState(false); // State to show/hide the form
  const [refreshList, setRefreshList] = useState(false);

  const handleSelectDisaster = (disaster: Disaster) => {
    setSelectedDisaster(disaster);
    setIsCreating(false); // Hide form when a disaster is selected
  };

  const handleDisasterCreated = () => {
    setIsCreating(false); // Hide form after creation
    setRefreshList(prev => !prev); // Refresh the list to show the new disaster
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Disaster Response Coordination Platform</h1>
      </header>
      
      <main className="main-layout">
        {/* ======================= LEFT PANE: Master List ======================= */}
        <div className="left-pane">
          <div className="pane-header">
            <h2>Disaster Events</h2>
            <button onClick={() => { setIsCreating(true); setSelectedDisaster(null); }}>
              + New Disaster
            </button>
          </div>
          <DisastersList 
            onSelectDisaster={handleSelectDisaster} 
            refreshTrigger={refreshList}
            selectedDisasterId={selectedDisaster?.id}
          />
        </div>

        {/* ======================= CENTER & RIGHT PANES: Detail View ======================= */}
        <div className="right-content">
          {/* Show a welcome message or the main dashboard */}
          {!selectedDisaster && !isCreating && (
            <div className="welcome-message">
              <h2>Welcome</h2>
              <p>Select a disaster from the list on the left to view its details, or click "+ New Disaster" to create a new event.</p>
            </div>
          )}

          {/* Show the creation form when user clicks "+ New Disaster" */}
          {isCreating && (
            <div className="details-view">
              <div className="center-pane">
                  <div className="pane-header">
                      <h2>Create New Disaster Event</h2>
                  </div>
                  <DisasterForm onSuccess={handleDisasterCreated} />
              </div>
            </div>
          )}

          {/* Show the main dashboard when a disaster is selected */}
          {selectedDisaster && (
            <div className="details-view">
              {/* --- CENTER PANE: Operational Dashboard --- */}
              <div className="center-pane">
                <div className="pane-header">
                  <h2>Dashboard: {selectedDisaster.title}</h2>
                </div>
                <p>{selectedDisaster.description}</p>
                <ResourceMap 
                  disasterId={selectedDisaster.id} 
                  lon={selectedDisaster.location.coordinates[0]} 
                  lat={selectedDisaster.location.coordinates[1]} 
                />
              </div>

              {/* --- RIGHT PANE: Toolbox --- */}
              <div className="right-pane">
                <div className="tool-section">
                  <h3>Live Social Media Feed</h3>
                  <SocialMediaFeed disasterId={selectedDisaster.id} />
                </div>
                <div className="tool-section">
                  <h3>Official Updates</h3>
                  <OfficialUpdates disasterId={selectedDisaster.id} />
                </div>
                <div className="tool-section">
                  <h3>Analysis Tools</h3>
                  <ImageVerification disasterId={selectedDisaster.id} />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
