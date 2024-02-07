//////////////////// BUTTONS ////////////////////


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

function setup_table(tags) {
    table_data = tags

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
}

socket.on("append", (data) => {
    const table = document.getElementById(data.table + "_table");

    data.tags.forEach(function (tag) {
        console.log(data)
        table.appendChild(create_row(data.table, tag));
    });
});