import { useState } from "react";
import Card from "./Card";
import "./NaviCard.css";

function NaviCard() {
  return (
    <div className="navicard-page">
      <Card />
      <Card />
      <Card />
      <Card />
    </div>
  );
}

export default NaviCard;
