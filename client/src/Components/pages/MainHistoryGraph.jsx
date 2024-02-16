import { useOutletContext, useSearchParams } from "react-router-dom";
import { getTagOfStation } from "./MainHistoryTable";
import config from "../configuration.json";
import { useState, useEffect, useContext } from "react";
import { Select } from "../base/Select";
import axios from "axios";
import { useRef, useLayoutEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { Context } from "../App";

export function MainHistoryGraph(props) {
  const [searchParams] = useSearchParams();
  const [lastStation, setLastStation] = useOutletContext();
  const values = useContext(Context);
  var stationData = {};

  console.log("last station  " + lastStation);
  var tag = searchParams.get("tag");
  if (tag == null) {
    tag = "liquid_level";
  }

  const [selected, setSelected] = useState(tag);
  const [data, setData] = useState([]);

  var station = "";
  if (lastStation == 0) {
    station = "Tank";
    if (values && values.stations) {
      stationData = values.stations.Tank;
    }
  }

  useEffect(() => {
    if (selected == "" || selected == null) return;

    const url = "/api/v1/values/" + station + "/" + selected + "/10";

    axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      })
      // .then((response) => response.json())
      .then((json) => setData(json.data));
  }, [selected]);

  useEffect(() => {
    if (!stationData) {
      return;
    }

    console.log(stationData);
    for (let i = 0; i < Object.keys(stationData).length; i++) {
      const x = stationData[Object.keys(stationData)[i]];
      if (Object.keys(stationData)[i] == selected) {
        setData((newData) => {
          if (newData.at(0) && newData.at(0).timestamp != x.timestamp) {
            newData.unshift(x);
            return newData.slice(0, 25); // keep only 25 first elems
          }
          return newData;
        });
      }
    }
  }, [stationData, selected, values]);

  const tags = getTagOfStation(lastStation, config);

  //////////////////graph components
  const chartRef = useRef(null);
  // Creates the chart, this code only runs one time
  useLayoutEffect(() => {
    let root = am5.Root.new("chartdiv");

    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panY: false,
        layout: root.verticalLayout,
      })
    );

    // Create Y-axis
    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );

    // Create X-Axis
    let xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        renderer: am5xy.AxisRendererX.new(root, {}),
        categoryField: "timestamp",
      })
    );
    xAxis.data.setAll(data.slice().reverse());

    const item = config.stations[0].read.filter((item) => item.name === selected)[0];
    var hue = "0deg"
    if(item){
      hue = item.hue
      console.log("hue", hue)
    }
    // Create series
    let series1 = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: "Series",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        categoryXField: "timestamp",
        fill: "hsl(" + hue + " 60% 40% / 1)",
        stroke: "hsl(" + hue + " 70% 70% / 1)",
      })
    );
    series1.data.setAll(data.slice().reverse());

    // Add scrollbar
    // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
    chart.set(
      "scrollbarX",
      am5.Scrollbar.new(root, {
        orientation: "horizontal",
      })
    );

    // Add legend
    let legend = chart.children.push(am5.Legend.new(root, {}));
    legend.data.setAll(chart.series.values);

    // Add cursor
    chart.set("cursor", am5xy.XYCursor.new(root, {}));

    // Actual bullet
    series1.bullets.push(function () {
      var bulletCircle = am5.Circle.new(root, {
        radius: 5,
        fill: series1.get("fill"),
      });
      return am5.Bullet.new(root, {
        sprite: bulletCircle,
      });
    });

    chartRef.current = chart;

    return () => {
      root.dispose();
    };
  }, [data]);

  // When the paddingRight prop changes it will update the chart
  useLayoutEffect(() => {
    chartRef.current.set("paddingRight", props.paddingRight);
  }, [props.paddingRight]);

  return (
    <>
      <div className="center">
        <div className="graphicContainer">
          Ici sera mis les graphiques de {tag} pour station {lastStation}
          <Select
            items={tags}
            description={"Choisissez le tag"}
            selected={selected}
            setSelected={setSelected}
          />
          {/* <div>{JSON.stringify(data)}</div> */}
          <div
            className="rootGraphic"
            id="chartdiv"
            style={{ width: "min(900px,100%)", height: "min(600px,100%)" }}
          ></div>
        </div>
      </div>
    </>
  );
}
