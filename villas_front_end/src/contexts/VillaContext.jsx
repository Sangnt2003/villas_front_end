/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { createContext, useContext, useState } from 'react';

const VillaContext = createContext();

export const VillaProvider = ({ children }) => {
    const [search, setSearchParams] = useState({});
    const [filters, setFilters] = useState({});
    const [villas, setVillas] = useState([]);
    const [selectedVilla, setSelectedVilla] = useState(null);

    return (
        <VillaContext.Provider value={{ search, setSearchParams, filters, setFilters, villas, setVillas, selectedVilla, setSelectedVilla }}>
            {children}
        </VillaContext.Provider>
    );
};

export const useVillaContext = () => useContext(VillaContext);
