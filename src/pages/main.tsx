import { useContext } from "react";
import styled from "styled-components";
import CodeEditor from "../components/editor/editor";
import Menu from "../components/menu/menu";
import Canvas from "../components/webgl/Canvas";
import ViewProvider, { VIEW, ViewContext } from "../context/view";

const Main = styled.main`
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: row;
`;

const Column = styled.div`
    height: 100%;
    width: 50%;
`;

export default function MainPage() {
    const { view } = useContext(ViewContext);

    return (
        <Main>
            <Column>
                <CodeEditor />
            </Column>
            <Column
                style={{
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <Canvas />
            </Column>
        </Main>
    );
}
