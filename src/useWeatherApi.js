import { useState, useEffect, useCallback } from "react";
const fetchCurrentWeather = locationName => {
  return fetch(
    `https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWB-DD611EA4-48B9-47F9-A29E-92845D968E8F&locationName=${locationName}`
  )
    .then(res => res.json())
    .then(data => {
      const locationData = data.records.location[0];
      //reduce 累加器的概念 這邊看做 把需要的資料 累加回累加器(丟回累加器)
      const weatherElements = locationData.weatherElement.reduce(
        (needElements, item) => {
          //判斷item的elementName是不是有WDSD TEMP HUMD 這幾個字 有的話就為true
          if (["WDSD", "TEMP", "HUMD"].includes(item.elementName)) {
            needElements[item.elementName] = item.elementValue;
          }
          return needElements;
        },
        {} //放到一個空物件裡面
      );
      return {
        observationTime: locationData.time.obsTime,
        locationName: locationData.locationName,
        temperature: weatherElements.TEMP,
        windSpeed: weatherElements.WDSD,
        humid: weatherElements.HUMD
      };
    });
};

const fetchWeatherForecast = cityName => {
  return fetch(
    `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-DD611EA4-48B9-47F9-A29E-92845D968E8F&locationName=${cityName}`
  )
    .then(res => res.json())
    .then(data => {
      const locationData = data.records.location[0];
      const weatherElements = locationData.weatherElement.reduce(
        (needElements, item) => {
          if (["Wx", "PoP", "CI"].includes(item.elementName)) {
            needElements[item.elementName] = item.time[0].parameter;
          }
          return needElements;
        },
        {}
      );
      return {
        description: weatherElements.Wx.parameterName,
        weatherCode: weatherElements.Wx.parameterValue,
        rainPossibility: weatherElements.PoP.parameterName,
        comfortability: weatherElements.CI.parameterName
      };
    });
};

const useWeatherApi = currentLocation => {
  const { locationName, cityName } = currentLocation;
  const [weatherElement, setWeatherElement] = useState({
    observationTime: new Date(),
    locationName: "",
    description: "",
    temperature: 0,
    windSpeed: 0,
    humid: 0,
    weatherCode: 0,
    rainPossibility: 0,
    comfortability: "",
    isLoading: true
  });

  const fetchData = useCallback(() => {
    const fetchingData = async () => {
      const [currentWeather, weatherForecast] = await Promise.all([
        fetchCurrentWeather(locationName),
        fetchWeatherForecast(cityName)
      ]);

      setWeatherElement({
        ...currentWeather,
        ...weatherForecast,
        isLoading: false
      });
    };

    setWeatherElement(prevState => ({
      ...prevState,
      isLoading: true
    }));
    fetchingData();
  }, [locationName, cityName]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return [weatherElement, fetchData];
};

export default useWeatherApi;
