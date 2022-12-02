import React, { useState, createContext } from "react";

export const DeckContext = createContext();

export const DeckProvider = (props) => {
    const [decks, setDecks] = useState([]);

    return (
        <DeckContext.Provider value={[decks, setDecks]}>
            {props.children}
        </DeckContext.Provider>
    );
}
