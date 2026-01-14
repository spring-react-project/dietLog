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
        if (key === "foods") navigate("/foods");
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
                    <Tab eventKey="home" title="홈" />
                    <Tab eventKey="meals" title="오늘식단 전체보기" />
                    <Tab eventKey="foods" title="칼로리 계산하기" />
                </Tabs>
            </header>
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default RootLayout;
