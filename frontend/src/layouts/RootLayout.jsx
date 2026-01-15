import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

const RootLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // 경로에 따라 탭 선택
    const getActiveKey = () => {
        const path = location.pathname;
        if (path === "/" || path === "/home") return "home";
        if (path === "/meals" || path === "/meals/all" || (path.startsWith("/meals/") && !path.includes("/new"))) return "mealsAll";
        if (path === "/meals/new") return "newMeal";
        return "home";
    };

    const handleSelect = (key) => {
        if (key === "home") navigate("/");
        if (key === "mealsAll") navigate("/meals");
        // if (key === "foods") navigate("/foods");
        if (key === "newMeal") navigate("/meals/new");
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
                    <Tab eventKey="mealsAll" title="오늘식단 전체보기" />
                    {/* <Tab eventKey="foods" title="칼로리 계산하기" /> */}
                    <Tab eventKey="newMeal" title="새 식단 추가" />
                </Tabs>
            </header>
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default RootLayout;
