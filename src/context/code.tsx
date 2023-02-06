import React, { createContext, useState } from "react";

export const CodeContext = createContext<{ code: string; setCode: any }>({
    code: "// no comment",
    setCode: () => {},
});

export default function CodeProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [code, setCode] = useState("");

    return (
        <CodeContext.Provider value={{ code, setCode }}>
            {children}
        </CodeContext.Provider>
    );
}
