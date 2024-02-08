const tab_bar = document.getElementById("tab_bar");
const tab_contents = document.getElementById("tab_contents");

let current_station = "Tank";
let current_tab = "liquid_level";

const MAX_TABLE_SIZE = 10;
let table_data = {};

const socket = io();


//////////////////// INITIALIZATION ////////////////////

window.onload = function () {
    fetch("/api/v1/getall")
        .then(response => response.json())
        .then(data => {
            //console.log(data);
            setup_tables(data);
        })
}

//////////////////// SOCKETS RECEPTION ////////////////////

socket.on("datachange", (new_data) => {
    //console.log(new_data);
    update_table(new_data);
});

//////////////////// FETCH FUNCTIONS  ////////////////////

function get_value(station) {
    fetch(`/api/v1/get/${station}/${current_tab}`)
        .then(response => response.json())
        .then(data => {
            console.log("Get value : " + data.value);
        })
}

function get_history(station, tag, limit) {
    fetch(`/api/v1/history/${station}/${tag}/${limit}`)
        .then(response => response.json())
        .then(data => {
            console.log("Get history : ");
            console.log(data);
        })
}

function update_tag(station, tag, value) {
    fetch(`/api/v1/update/${station}/${tag}/${value}`)
        .then(response => response.json())
        .then(data => {
            console.log("Update tag : " + data.value);
        })
}

function switch_mode(button, station, tag) {
    if (button.innerText == "Off") {
        update_tag(station, tag, true);
        button.innerText = "On";
        button.style.backgroundColor = "limegreen";
        button.style.borderColor = "limegreen";
    } else {
        update_tag(station, tag, false);
        button.innerText = "Off";
        button.style.backgroundColor = "crimson";
        button.style.borderColor = "crimson";
    }
}

//////////////////// TABLES FUNCTIONS  ////////////////////

function setup_tables(tags) {
    table_data = tags;

    for (let station in table_data) {
        for (let tag in table_data[station]) {
            create_tables(station, tag);
        }
    }

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
