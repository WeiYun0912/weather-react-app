import React from "react";
import "./styles.css";
import Weather from "./Weather";
// 這支 CSS 檔的樣式會作用到全域
// import "./styles.css";
export default function App() {
  return (
    <div className="App">
      <Weather />
    </div>
  );
}
