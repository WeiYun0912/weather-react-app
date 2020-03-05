import React, { useState, useEffect, useMemo } from "react";
import styled from "@emotion/styled";
import useWeatherApi from "./useWeatherApi";
// import { css } from "@emotion/core";

import { ThemeProvider } from "emotion-theming";
import { findLocation } from "./utils";
import sunriseAndSubsetData from "./sunRise.json";
import WeatherCard from "./WeatherCard";
import WeatherSetting from "./WeatherSetting";
//將CSS樣式當作JS含式保存起來
// const buttonDefault = () => css`
//   display: block;
//   width: 120px;
//   height: 30px;
//   font-size: 14px;
//   background-color: transparent;
//   color: #212121;
//   border: none;
//   border-radius: 10px;
// `;

//引用CSS樣式
// const RejectButton = styled.button`
//   ${buttonDefault};
//   background-color: red;
// `;

const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  user-select: none;
`;

const getMoment = locationName => {
  const location = sunriseAndSubsetData.find(
    data => data.locationName === locationName
  );

  //找不到縣市回傳null
  if (!location) return null;

  //取得當前時間
  const now = new Date();
  const nowDate = Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  })
    .format(now)
    .replace(/\//g, "-");

  //從該地區找到對應日期
  const locationDate =
    location.time && location.time.find(time => time.dataTime === nowDate);

  //將日出日落以及當前時間轉成時間戳記（TimeStamp）
  const sunriseTimestamp = new Date(
    `${locationDate.dataTime} ${locationDate.sunrise}`
  ).getTime();
  const sunsetTimestamp = new Date(
    `${locationDate.dataTime} ${locationDate.sunset}`
  ).getTime();
  const nowTimeStamp = now.getTime();
  console.log(sunriseTimestamp);
  //當前時間介於日出和日落中間，則表示為白天，否則為晚上
  return sunriseTimestamp <= nowTimeStamp && nowTimeStamp <= sunsetTimestamp
    ? "day"
    : "night";
};

const theme = {
  light: {
    backgroundColor: "#ededed",
    foregroundColor: "#f9f9f9",
    boxShadow: "0 1px 3px 0 #999999",
    titleColor: "#212121",
    temperatureColor: "#757575",
    textColor: "#828282"
  },
  dark: {
    backgroundColor: "#1F2022",
    foregroundColor: "#121416",
    boxShadow:
      "0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)",
    titleColor: "#f9f9fa",
    temperatureColor: "#dddddd",
    textColor: "#cccccc"
  }
};

const WeatherApp = () => {
  const storageCity = localStorage.getItem("cityName");
  //若storageCity有值得話就採用 沒有的話 就用 高雄市
  const [currentCity, setCurrentCity] = useState(storageCity || "高雄市");
  const currentLocation = findLocation(currentCity) || {};
  //定義locationData 把回傳資料中會用到的部分取出
  const [weatherElement, fetchData] = useWeatherApi(currentLocation);
  const [currentPage, setCurrentPage] = useState("WeatherCard");
  const moment = useMemo(() => getMoment(currentLocation.sunriseCityName), [
    currentLocation.sunriseCityName
  ]);
  const [currentTheme, setCurrentTheme] = useState("light");

  // 根據 moment 決定要使用亮色或暗色主題
  useEffect(() => {
    setCurrentTheme(moment === "day" ? "light" : "dark");
    // 記得把 moment 放入 dependencies 中
  }, [moment]);

  useEffect(() => {
    localStorage.setItem("cityName", currentCity);
  }, [currentCity]);

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {currentPage === "WeatherCard" && (
          <WeatherCard
            cityName={currentLocation.cityName}
            weatherElement={weatherElement}
            moment={moment}
            fetchData={fetchData}
            setCurrentPage={setCurrentPage}
          />
        )}

        {currentPage === "WeatherSetting" && (
          <WeatherSetting
            cityName={currentLocation.cityName}
            setCurrentCity={setCurrentCity}
            setCurrentPage={setCurrentPage}
          />
        )}
      </Container>
    </ThemeProvider>
  );
};
// 最後觀測時間：
// {new Intl.DateTimeFormat("zh-tw", {
//   hour: "numeric",
//   minute: "numeric"
// }).format(new Date(currentWeather.observationTime))}
export default WeatherApp;
