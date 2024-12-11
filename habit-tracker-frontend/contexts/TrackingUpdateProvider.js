import React, { createContext, useContext, useState } from 'react';

const TrackingUpdateContext = createContext();

// creates a tracking update toggle to notify of updates
export const TrackingUpdateProvider = ({ children }) => {
    const [trackingUpdated, setTrackingUpdated] = useState(false);

    const toggleTrackingUpdate = () => {
        setTrackingUpdated((prev) => !prev);
    };

    return (
        <TrackingUpdateContext.Provider value={{ trackingUpdated, toggleTrackingUpdate }}>
            {children}
        </TrackingUpdateContext.Provider>
    );
};

export const useTrackingUpdate = () => useContext(TrackingUpdateContext);