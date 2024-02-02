const tab_bar = document.getElementById("tab_bar");
const tab_contents = document.getElementById("tab_contents");

let current_station = "tank";
let current_tab = "liquid_level";

const socket = io();


//////////////////// INITIALIZATION ////////////////////

window.onload = function () {
    socket.emit("get_data");
}

//////////////////// SOCKETS RECEPTION ////////////////////

socket.on("setup", (data) => {
    let tab_button = document.createElement("button");
    tab_button.className = "tab_button";
    tab_button.id = data.table + "_tab_button";
    tab_button.onclick = function () { tab_bar_manager(event, data.table); };
    tab_button.innerText = (data.table.charAt(0).toUpperCase() + data.table.slice(1)).replace("_", " ");
    tab_bar.appendChild(tab_button);

    let tab_table = document.createElement("div");
    tab_table.className = "tab_content";
    tab_table.id = data.table + "_content";

    tab_table.innerHTML = `            
    <table>
        <thead>
            <tr>
                <th>Variable</th>
                <th>Valeur</th>
                <th>Date et Heure</th>
                <th>Options</th>
            </tr>
        </thead>
        <tbody id="${data.table}_table">
        </tbody>
    </table>`;

    tab_contents.appendChild(tab_table);

    let table = document.getElementById(data.table + "_table");
    data.tags.forEach(function (tag) {
        table.appendChild(create_row(data.table, tag));
    });

    document.getElementById(current_tab + "_tab_button").click();
});

socket.on("append", (data) => {
    const table = document.getElementById(data.table + "_table");

    data.tags.forEach(function (tag) {
        console.log(data)
        table.appendChild(create_row(data.table, tag));
    });
});

socket.on("delete", (data) => {
    const row = document.getElementById(data.table + "_" + data.id);
    row.parentNode.removeChild(row);
});

socket.on("update", (data) => {
    const row = document.getElementById(data.table + "_" + data.tag_name);

    if (data.value) {
        row.childNodes[3].innerHTML = data.value;
    } else {
        row.childNodes[3].innerHTML = data.value;
    }
});

//////////////////// BUTTONS ////////////////////

function append_tag() {
    if (current_tab !== "states") {
        socket.emit("append", current_station, current_tab);
    }
}

function delete_tag(id) {
    socket.emit("delete", current_station, current_tab, id);
}

function switch_mode(button) {
    const mode_button = document.getElementById("mode_button");

    if (button.innerHTML == "Mode automatique") {
        socket.emit("update", current_station, "states", "manual_mode", true);
        mode_button.innerHTML = "Mode manuel";
        mode_button.style.backgroundColor = "orange";
        mode_button.style.borderColor = "orange";
    } else {
        socket.emit("update", current_station, "states", "manual_mode", false);
        mode_button.innerHTML = "Mode automatique";
        mode_button.style.backgroundColor = "darkorchid";
        mode_button.style.borderColor = "darkorchid";
    }
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

//////////////////// ROW ////////////////////

function create_row(table, tag) {
    const row = document.createElement("tr");
    let row_data = `
                <td>${tag.name}</td>
                <td>${tag.value}</td>
                <td>${tag.timestamp}</td>`;

    if (table === "states") {
        row.id = table + "_" + tag.name;
        row_data += `<td></td>`;
    } else {
        row.id = table + "_" + tag.id;
        row_data += `<td><button class="delete_buttons" onclick="delete_tag(\`${tag.id}\`)">Supprimer</button></td>`;
    }
    row.innerHTML = row_data;

    return row;
}
