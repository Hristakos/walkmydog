import React from "react";
import "./MainHeader.css";
import HeaderNavigation from "../MainHeader/HeaderNavigation";

const MainHeader = () => {
    return (
        <header className="mainHeader">
            <h1>Walk My Dog</h1>
            <HeaderNavigation />
        </header>
    );
};

export default MainHeader;
