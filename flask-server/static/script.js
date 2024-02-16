const tab_bar = document.getElementById("tab_bar");
const tab_contents = document.getElementById("tab_contents");

let current_station = "Tank";
let current_tab = "liquid_level";

const MAX_TABLE_SIZE = 10;
let table_data = {};

const socket = io();
var series;

//////////////////// INITIALIZATION ////////////////////

window.onload = async function () {
    let history = await get_history(1);
    console.log(history);
    setup_tables(history);
    setup_graph()
}

//////////////////// SOCKETS RECEPTION ////////////////////

socket.on("datachange", (new_data) => {
    console.log(new_data);
    update_table(new_data);
    if (new_data.tag === "liquid_level") {
        update_graph(new_data)
    }
});

//////////////////// FETCH FUNCTIONS  ////////////////////

async function get_history(limit) {
    return fetch(`/api/v1/history/${limit}`)
        .then(response => response.json())
        .then(data => {
            return data
        })
}

async function get_values(station, tag, limit) {
    return fetch(`/api/v1/values/${station}/${tag}/${limit}`)
        .then(response => response.json())
        .then(data => {
            console.log("Get values : ");
            console.log(data);
            return data
        })
}

function switch_tag(station, tag, value) {
    fetch(`/api/v1/switch/${station}/${tag}/${value}`)
        .then(response => response.json())
        .then(data => {
            console.log("Update tag : " + data.value);
        })
}

function switch_mode(button, station, tag) {
    if (button.innerText == "Off") {
        switch_tag(station, tag, 1);
        button.innerText = "On";
        button.style.backgroundColor = "limegreen";
        button.style.borderColor = "limegreen";
    } else {
        switch_tag(station, tag, 0);
        button.innerText = "Off";
        button.style.backgroundColor = "crimson";
        button.style.borderColor = "crimson";
    }
}

//////////////////// TABLES FUNCTIONS  ////////////////////

function setup_tables(tags) {
    tags.forEach(function (data) {
        create_tables(data["station"], data["tag"]);

        if (data.station in table_data) {
            table_data[data.station][data.tag] = [data];
        } else {
            table_data[data.station] = {};
        }
    });

    console.log(table_data);
    render_tables();
    document.getElementById(current_station + "_" + current_tab + "_tab_button").click();
}

function update_table(new_data) {
    table_data[new_data.station][new_data.tag].unshift(new_data);

    if (table_data[new_data.station][new_data.tag].length > MAX_TABLE_SIZE) {
        table_data[new_data.station][new_data.tag].pop();
    }

    render_tables();
}

function render_tables() {
    let table = null;

    for (let station in table_data) {
        for (let tag in table_data[station]) {
            table = document.getElementById(tag + "_table");
            table.innerHTML = "";
            table_data[station][tag].forEach(function (data) {
                table.appendChild(create_row(tag, data));
            });
        }
    }
}

function create_tables(station, tag) {
    let tab_button = document.createElement("button");
    tab_button.className = "tab_button";
    tab_button.id = station + "_" + tag + "_tab_button";
    tab_button.onclick = function () { tab_bar_manager(event, tag); };
    tab_button.innerText = (tag.charAt(0).toUpperCase() + tag.slice(1)).replace("_", " ");
    tab_bar.appendChild(tab_button);

    let tab_table = document.createElement("div");
    tab_table.className = "tab_content";
    tab_table.id = tag + "_content";

    tab_table.innerHTML = `            
    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Valeur</th>
                <th>Date et Heure</th>
            </tr>
        </thead>
        <tbody id="${tag}_table">
        </tbody>
    </table>`;

    tab_contents.appendChild(tab_table);
}

function create_row(table, data) {
    const row = document.createElement("tr");
    let row_data = `
                <td>${data.id}</td>
                <td>${data.value}</td>
                <td>${data.timestamp}</td>`;

    row.id = table + "_" + data.id;
    row.innerHTML = row_data;

    return row;
}

//////////////////// TAB BAR ////////////////////

function tab_bar_manager(evt, selected_tab) {
    let i, tables, tab_buttons;

    tables = document.getElementsByClassName("tab_content");
    for (i = 0; i < tables.length; i++) {
        tables[i].style.display = "none";
    }

    tab_buttons = document.getElementsByClassName("tab_button");
    for (i = 0; i < tab_buttons.length; i++) {
        tab_buttons[i].className = tab_buttons[i].className.replace(" active", "");
    }

    current_tab = selected_tab;
    document.getElementById(selected_tab + "_content").style.display = "block";
    evt.currentTarget.className += " active";
}

//////////////////// CHART ////////////////////


function setup_graph() {
    if (typeof series === "undefined") {
        am5.ready(function () {

            var root = am5.Root.new("chartdiv");

            root.setThemes([
                am5themes_Animated.new(root)
            ]);


            var value = 100;

            function setup_data(data) {
                chartData = data.Tank.liquid_level
                console.log(chartData)
                return chartData;
            }

            function generateChartData() {
                var chartData = [];
                var firstDate = new Date();
                firstDate.setDate(firstDate.getDate() - 1000);
                firstDate.setHours(0, 0, 0, 0);

                for (var i = 0; i < 50; i++) {
                    var newDate = new Date(firstDate);
                    newDate.setSeconds(newDate.getSeconds() + i);

                    value += (Math.random() < 0.5 ? 1 : -1) * Math.random() * 10;

                    chartData.push({
                        date: newDate.getTime(),
                        value: value
                    });
                }
                return chartData;
            }

            var data = setup_data(table_data);

            var chart = root.container.children.push(am5xy.XYChart.new(root, {
                focusable: true,
                panX: true,
                panY: true,
                wheelX: "panX",
                wheelY: "zoomX",
                pinchZoomX: false,
                paddingLeft: 0
            }));

            var easing = am5.ease.linear;


            var xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
                maxDeviation: 0.5,
                groupData: false,
                extraMax: 0.1, // this adds some space in front
                extraMin: -0.1,  // this removes some space form th beginning so that the line would not be cut off
                baseInterval: {
                    timeUnit: "second",
                    count: 1
                },
                renderer: am5xy.AxisRendererX.new(root, {
                    minorGridEnabled: true,
                    minGridDistance: 50
                }),
                tooltip: am5.Tooltip.new(root, {})
            }));

            var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
                renderer: am5xy.AxisRendererY.new(root, {})
            }));


            series = chart.series.push(am5xy.LineSeries.new(root, {
                name: "Series 1",
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: "value",
                valueXField: "timestamp",
                tooltip: am5.Tooltip.new(root, {
                    pointerOrientation: "horizontal",
                    labelText: "{valueY}"
                })
            }));

            // tell that the last data item must create bullet
            data[data.length - 1].bullet = true;
            series.data.setAll(data);


            // Create animating bullet by adding two circles in a bullet container and
            // animating radius and opacity of one of them.
            series.bullets.push(function (root, series, dataItem) {
                // only create sprite if bullet == true in data context
                if (dataItem.dataContext.bullet) {
                    var container = am5.Container.new(root, {});
                    var circle0 = container.children.push(am5.Circle.new(root, {
                        radius: 5,
                        fill: am5.color(0x0000ff)
                    }));
                    var circle1 = container.children.push(am5.Circle.new(root, {
                        radius: 5,
                        fill: am5.color(0x0000ff)
                    }));

                    circle1.animate({
                        key: "radius",
                        to: 20,
                        duration: 1000,
                        easing: am5.ease.out(am5.ease.cubic),
                        loops: Infinity
                    });
                    circle1.animate({
                        key: "opacity",
                        to: 0,
                        from: 1,
                        duration: 1000,
                        easing: am5.ease.out(am5.ease.cubic),
                        loops: Infinity
                    });

                    return am5.Bullet.new(root, {
                        locationX: undefined,
                        sprite: container
                    })
                }
            })

            var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
                xAxis: xAxis
            }));
            cursor.lineY.set("visible", false);


            /*setInterval(function () {
              addData();
            }, 1000)*/

            function addData() {
                console.log("in addData")
                var lastDataItem = series.dataItems[series.dataItems.length - 1];

                var lastValue = lastDataItem.get("valueY");
                //var newValue = value + ((Math.random() < 0.5 ? 1 : -1) * Math.random() * 5);
                var lastDate = new Date(lastDataItem.get("valueX"));
                var time = am5.time.add(new Date(lastDate), "second", 1).getTime();
                series.data.removeIndex(0);
                series.data.push({
                    date: time,
                    value: newValue
                })

                var newDataItem = series.dataItems[series.dataItems.length - 1];
                newDataItem.animate({
                    key: "valueYWorking",
                    to: newValue,
                    from: lastValue,
                    duration: 600,
                    easing: easing
                });

                // use the bullet of last data item so that a new sprite is not created
                newDataItem.bullets = [];
                newDataItem.bullets[0] = lastDataItem.bullets[0];
                newDataItem.bullets[0].get("sprite").dataItem = newDataItem;
                // reset bullets
                lastDataItem.dataContext.bullet = false;
                lastDataItem.bullets = [];

                var animation = newDataItem.animate({
                    key: "locationX",
                    to: 0.5,
                    from: -0.5,
                    duration: 600
                });
                if (animation) {
                    var tooltip = xAxis.get("tooltip");
                    if (tooltip && !tooltip.isHidden()) {
                        animation.events.on("stopped", function () {
                            xAxis.updateTooltip();
                        })
                    }
                }
            }

            chart.appear(1000, 100);

        })
        addData()
    } else {
        
    }
}

function update_graph(new_data) {
    series.data.removeIndex(0);
    series.data.push(new_data)
}