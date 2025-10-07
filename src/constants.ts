import React from "react";

export default {
  TAG_HEIGHT: 30,
  STATUS_HEIGHT: 30,
  TAG_CHAR_WIDTH_MULTIPLIER: 9,
  GAME_TABLE_HEIGHT: 1200,
  GAME_TABLE_WIDTH: 2000,
  GAME_TABLE_SELECTED_ENTITY_ZINDEX: 10,
  GAME_TABLE_ZINDEX: 2,
  TAG_COLOR: "#fff9a6",
  STATUS_COLOR: "#b5fa95ff",
  MIGHT_COLORS: {
    origin: "rgba(48, 119, 48, 1)",
    adventure: "rgba(134, 60, 42, 1)",
    greatness: "rgba(35, 73, 117, 1)",
  },
};

export const CARD_STYLE: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  background: "#dbc49aff",
  border: "3px solid transparent",
  borderRadius: "4px",
  width: `300px`,
  minWidth: "300px",
  maxWidth: "300px",
  minHeight: `600px`,
  maxHeight: "600px",
  color: "#333",
  alignContent: "center",
};

export const iconStyle: React.CSSProperties = {
  width: "20px",
  height: "20px",
  marginRight: "8px",
};
