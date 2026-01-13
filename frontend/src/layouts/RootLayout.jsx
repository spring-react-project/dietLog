import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

const RootLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // 경로에 따라 탭 선택
    const getActiveKey = () => {
        if (location.pathname === "/" || location.pathname === "/home") return "home";
        if (location.pathname.startsWith("/meals")) return "meals";
        return "home";
    };

    const handleSelect = (key) => {
        if (key === "home") navigate("/");
        if (key === "meals") navigate("/meals");
    };

    return (
        <div className="container">
            <header>
                <Tabs
                    activeKey={getActiveKey()}
                    onSelect={handleSelect}
                    id="uncontrolled-tab-example"
                    className="mb-3"
                >
                    <Tab eventKey="home" title="Home" />
                    <Tab eventKey="meals" title="meals" />
                </Tabs>
            </header>
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default RootLayout;
