// {{{1 Imports
import React from "react";
import { slide as SideBar } from "react-burger-menu";

// {{{1 var leftBarStyles
var leftBarStyles = {
  bmBurgerButton: {
    position: "fixed",
    width: "36px",
    height: "30px",
    left: "36px",
    top: "66px"
  },
  bmBurgerBars: {
    background: "#fcf4dc"
  },
  bmCrossButton: {
    height: "24px",
    width: "24px"
  },
  bmCross: {
    background: "#bdc3c7"
  },
  bmMenu: {
    background: "#fcf4dc",
    border: "4px solid #00d6b6",
    padding: "2.5em 1.5em 0",
    fontSize: "1.15em"
  },
  bmMorphShape: {
    fill: "#373a47"
  },
  bmItemList: {
    color: "#b8b7ad",
    padding: "0.8em"
  },
  bmOverlay: {
    background: "rgba(0, 0, 0, 0.3)"
  }
};

// {{{1 class LeftBar
export class LeftBar extends React.Component {
  showSettings(event) {
    event.preventDefault();
  }

  render() {
    return (
      <SideBar
        width={window.innerWidth < 768 ? "100%" : "33%"}
        styles={leftBarStyles}
        customBurgerIcon={<img src="/static/pictures/chat.png" />}
      >
        <div>Sidebar is still Under Construction ...</div>
      </SideBar>
    );
  }
}
