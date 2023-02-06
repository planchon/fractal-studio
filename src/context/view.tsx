import React, { createContext, useState } from "react";

export enum VIEW {
    CODE = 0,
    RENDER = 1,
}

export const ViewContext = createContext<{ view: VIEW; setView: any }>({
    view: VIEW.CODE,
    setView: () => {},
});

export default function ViewProvider({ children }) {
    const [view, setView] = useState<VIEW>(VIEW.CODE);

    return (
        <ViewContext.Provider value={{ view, setView }}>
            {children}
        </ViewContext.Provider>
    );
}
