import React, { createContext, useContext, useState } from 'react';

const TrackingUpdateContext = createContext();

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