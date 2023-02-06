import Editor from "@monaco-editor/react";
import { useContext } from "react";
import "./App.css";
import CodeEditor from "./components/editor/editor";
import Menu from "./components/menu/menu";
import MainPage from "./pages/main";
import CodeProvider from "./context/code";
import ViewProvider from "./context/view";

function App() {
    return (
        <main
            style={{
                width: "100vw",
                height: "100vh",
            }}
        >
            <ViewProvider>
                <CodeProvider>
                    <MainPage />
                </CodeProvider>
            </ViewProvider>
        </main>
    );
}

export default App;
