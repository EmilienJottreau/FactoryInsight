const tab_bar = document.getElementById("tab_bar");
const content = document.getElementById("content");

let current_station = "tank";
let current_tab = "level";

const socket = io();


//////////////////// SOCKETS RECEPTION ////////////////////

socket.on("setup", (data) => {
    let tab = document.createElement("button");
    tab.className = "tab";
    tab.id = data.table + "_tab";
    tab.onclick = function () { tab_bar_manager(event, data.table); };
    tab.innerText = data.table.charAt(0).toUpperCase() + data.table.slice(1);
    tab_bar.appendChild(tab);

    let table = document.createElement("div");
    table.className = "tab_content";
    table.id = data.table + "_content";

    table.innerHTML = `            
    <table>
        <thead>
            <tr>
                <th>Variable</th>
                <th>Valeur</th>
                <th>Qualité</th>
                <th>Date et Heure</th>
                <th>Options</th>
            </tr>
        </thead>
        <tbody id="${data.table}_table">
        </tbody>
    </table>`;

    content.appendChild(table);

    let tbody = document.getElementById(data.table + "_table");
    data.tags.forEach(function (tag) {
        let row = document.createElement("tr");
        row_data = `            
                    <td>${tag.name}</td>
                    <td>${tag.value}</td>
                    <td>${tag.quality}</td>
                    <td>${tag.timestamp}</td>
                    <td><button class="delete_buttons" onclick="delete_tag(\`${tag.id}\`)">Supprimer</button></td>
                `;
        row.id = data.table + "_" + tag.id;
        row.innerHTML = row_data;
        tbody.appendChild(row);
    });

    document.getElementById(current_tab + "_tab").click();
});

socket.on("append", (data) => {
    let table = document.getElementById(data.table + "_table");

    data.tags.forEach(function (tag) {
        let row = document.createElement("tr");
        row_data = `<tr id="${data.table}_${tag.id}">
                    <td>${tag.name}</td>
                    <td>${tag.value}</td>
                    <td>${tag.quality}</td>
                    <td>${tag.timestamp}</td>
                    <td><button class="delete_buttons" onclick="delete_tag(\`${tag.id}\`)">Supprimer</button></td>
                </tr>                       
            `;
        row.id = data.table + "_" + tag.id;
        row.innerHTML = row_data;
        table.appendChild(row);
    });
});

socket.on("delete", (data) => {
    console.log(data.table + "_" + data.id)
    let row = document.getElementById(data.table + "_" + data.id);
    console.log(parentNode)
    row.parentNode.removeChild(row);
});

socket.on("update", (data) => {
    let row = document.getElementById(data.table + "_" + data.tag_name);
    let mode_button = document.getElementById("mode_button");

    if (data.value) {
        mode_button.innerHTML = "Mode manuel";
        mode_button.style.backgroundColor = "orange";
        mode_button.style.borderColor = "orange";
        row.childNodes[3].innerHTML = data.value;
    } else {
        mode_button.innerHTML = "Mode automatique";
        mode_button.style.backgroundColor = "darkorchid";
        mode_button.style.borderColor = "darkorchid";
        row.childNodes[3].innerHTML = data.value;
    }
});

//////////////////// BUTTONS ////////////////////

function append_tag() {
    socket.emit("append", current_station, current_tab);
}

function delete_tag(id) {
    socket.emit("delete", current_station, current_tab, id);
}

function switch_mode(button) {
    if (button.innerHTML == "Mode automatique") {
        socket.emit("update", current_station, "states", "manual_mode", true);
    } else {
        socket.emit("update", current_station, "states", "manual_mode", false);
    }
}

//////////////////// TAB BAR ////////////////////

function tab_bar_manager(evt, selected_tab) {
    let i, tab_content, tab_links;

    tab_content = document.getElementsByClassName("tab_content");
    for (i = 0; i < tab_content.length; i++) {
        tab_content[i].style.display = "none";
    }

    tab_links = document.getElementsByClassName("tab");
    for (i = 0; i < tab_links.length; i++) {
        tab_links[i].className = tab_links[i].className.replace(" active", "");
    }

    current_tab = selected_tab;
    document.getElementById(selected_tab + "_content").style.display = "block";
    evt.currentTarget.className += " active";
}

//////////////////// INITIALIZATION ////////////////////

window.onload = function () {
    socket.emit("get_data");
}