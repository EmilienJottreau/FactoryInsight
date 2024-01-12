let selected_tab = "level";
const socket = io();


socket.on("insert", (data) => {
    let table = document.getElementById(data.table + "_table");

    row_data = `<tr id="${data.table}_${data.tags.id}">
                <td>${data.tags.name}</td>
                <td>${data.tags.value}</td>
                <td>${data.tags.quality}</td>
                <td>${data.tags.timestamp}</td>
                <td><button class="delete_buttons" onclick="delete_tag(\`${data.tags.id}\`)">Supprimer</button></td>
            </tr>                       
        `;

    raw = document.createElement("tr");
    raw.innerHTML = row_data;
    table.appendChild(raw);
});

socket.on("delete", (data) => {
    let row = document.getElementById(data.table + "_" + data.table);
    row.parentNode.removeChild(row);
});

socket.on("update", (data) => {
    let row = document.getElementById(data.table + "_" + data.tag_name);
    let mode_button = document.getElementById("mode_button");

    if (data.value) {
        mode_button.innerHTML = "Mode manuel";
        mode_button.style.backgroundColor = "orange";
        mode_button.style.borderColor = "orange";
        row.childNodes[3].innerHTML = data.value
    } else {
        mode_button.innerHTML = "Mode automatique";
        mode_button.style.backgroundColor = "darkorchid";
        mode_button.style.borderColor = "darkorchid";
        row.childNodes[3].innerHTML = data.value
    }
});


function append_tag() {
    socket.emit("append", selected_tab);
}

function delete_tag(id) {
    socket.emit("delete", selected_tab, id);
}

function switch_mode(button) {
    if (button.innerHTML == "Mode automatique") {
        socket.emit("update", "states", "manual_mode", true);
    } else {
        socket.emit("update", "states", "manual_mode", false);
    }
}

function tabs_manager(evt, table_name) {
    let i, tab_content, tab_links;

    tab_content = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tab_content.length; i++) {
        tab_content[i].style.display = "none";
    }

    tab_links = document.getElementsByClassName("tablinks");
    for (i = 0; i < tab_links.length; i++) {
        tab_links[i].className = tab_links[i].className.replace(" active", "");
    }

    selected_tab = table_name;
    document.getElementById(table_name).style.display = "block";
    evt.currentTarget.className += " active";
}

document.getElementById("level_tab").click();
