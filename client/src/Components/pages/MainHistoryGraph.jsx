import { useOutletContext, useSearchParams } from "react-router-dom";
import { getTagOfStation } from "./MainHistoryTable";
import config from "../configuration.json";
import { useState, useEffect } from "react";
import { Select } from "../base/Select";
import axios from 'axios';
import { useRef, useLayoutEffect } from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

export function MainHistoryGraph(props) {
  const [searchParams] = useSearchParams();
  const [lastStation, setLastStation] = useOutletContext();

  console.log("last station  " + lastStation);
  const tag = searchParams.get("tag");

  const [selected, setSelected] = useState(tag);
  const [data, setData] = useState([]);

  var station = "";
  if (lastStation == 0) {
    station = "Tank";
  }

  useEffect(() => {
    if (selected == "" || selected == null) return;

    const url =
      "/api/v1/history/" +
      station +
      "/" +
      selected +
      "/10";

    axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
      // .then((response) => response.json())
      .then((json) => setData(json.data));
  }, [selected]);

  const tags = getTagOfStation(lastStation, config);

  //////////////////graph components
  const chartRef = useRef(null);
// Creates the chart, this code only runs one time
useLayoutEffect(() => {
  let root = am5.Root.new("chartdiv");

  root.setThemes([
    am5themes_Animated.new(root)
  ]);

  let chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      panY: false,
      layout: root.verticalLayout
    })
  );

  // Define data
  let data = [{"id":3269,"timestamp":"2024-02-09 17:02:55","value":1.10234},
  {"id":3268,"timestamp":"2024-02-09 17:02:51","value":1.10173},
  {"id":3267,"timestamp":"2024-02-09 17:02:48","value":1.10094},
  {"id":3266,"timestamp":"2024-02-09 17:02:45","value":1.10002},
  {"id":3265,"timestamp":"2024-02-09 17:02:42","value":1.09974},
  {"id":3264,"timestamp":"2024-02-09 17:02:39","value":1.09944},
  {"id":3263,"timestamp":"2024-02-09 17:02:36","value":1.09918},
  {"id":3262,"timestamp":"2024-02-09 17:02:32","value":1.09843},
  {"id":3261,"timestamp":"2024-02-09 17:02:29","value":1.09804},
  {"id":3260,"timestamp":"2024-02-09 17:02:26","value":1.09764}];

  // Create Y-axis
  let yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {})
    })
  );

  // Create X-Axis
  let xAxis = chart.xAxes.push(
    am5xy.CategoryAxis.new(root, {
  renderer: am5xy.AxisRendererX.new(root, {}),
      categoryField: "timestamp"
    })
  );
  xAxis.data.setAll(data);

  // Create series
  let series1 = chart.series.push(
    am5xy.ColumnSeries.new(root, {
      name: "Series",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "value",
      categoryXField: "timestamp"
    })
  );
  series1.data.setAll(data);

   // Add scrollbar
    // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
    chart.set("scrollbarX", am5.Scrollbar.new(root, {
      orientation: "horizontal"
    }));

  // Add legend
  let legend = chart.children.push(am5.Legend.new(root, {}));
  legend.data.setAll(chart.series.values);

  // Add cursor
  chart.set("cursor", am5xy.XYCursor.new(root, {}));

  chartRef.current = chart;

  return () => {
    root.dispose();
  };
}, []);

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
          <div>{JSON.stringify(data)}</div>
          
          <div className="rootGraphic" id="chartdiv" style={{ width: "900px", height: "900px" }}></div>

        </div>
      </div>
    </>
  );
}
