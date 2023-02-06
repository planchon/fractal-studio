import { Button, Tab, Tabs } from "@mui/material";
import { useContext } from "react";
import styled from "styled-components";
import { VIEW, ViewContext } from "../../context/view";

const FloattingMenu = styled.div`
    position: absolute;
    top: 20px;
    z-index: 1000;
    right: 20px;
    width: 200px;
    height: 50px;
    bakground: white;
`;

export default function Menu() {
    const { view, setView } = useContext(ViewContext);

    const changeView = (_: any, v: number) => {
        switch (v) {
            case 0:
                setView(VIEW.CODE);
                break;
            case 1:
                setView(VIEW.RENDER);
                break;
            default:
                setView(VIEW.RENDER);
        }
    };

    return (
        <FloattingMenu>
            <Tabs value={view} onChange={changeView}>
                <Tab label="Code" />
                <Tab label="Render" />
            </Tabs>
        </FloattingMenu>
    );
}
