// var current_mountpoint = undefined; // przenieś do player.js

var available_mountpoints = [];

const selection_container = document.querySelector(".playerbox-selection-wrapper");
const selectables = document.querySelector(".playerbox-selection-wrapper .dropdown-items");
const arrow = document.querySelector(".playerbox-selection-wrapper .arrow");

var dropdown_items_count = 0;

var selectables_selecting_state = 0;

function show_list()
{
    selectables.style.display = "grid";
    selectables.style.opacity = 1;
    selectables_selecting_state = 1;

    selection_container.style.backgroundColor = "dimgrey";

    arrow.style.top = "49px";
    arrow.style.borderBottom = "none";
    arrow.style.borderTop = "10px solid black";
}

function hide_list()
{
    selectables.style.display = "none";
    selectables.style.opacity = 0;
    selectables_selecting_state = 0;

    selection_container.style.backgroundColor = "inherit";

    arrow.style.top = "14px";
    arrow.style.borderTop = "none";
    arrow.style.borderBottom = "10px solid black";
}

// this is getting messy
function setup_list()
{
    const current_selection = document.querySelector(".playerbox-selection-wrapper #selected-mountpoint");
    current_selection.addEventListener('click', function(){
        if (!selectables_selecting_state)
        { show_list(); }
        else { hide_list(); }
    })
}

// function to setup everything for selected mountpoint
// function set_mountpoint()
// {
//     const audio_player = document.getElementById("player");
//     audio_player.src = "/" + current_mountpoint;
// }

async function set_selected_mountpoint(mnt_name)
{
    mnt_name = mnt_name.split("/").at(-1);

    const old_selection = document.querySelector(".playerbox-selection-wrapper #selected-mountpoint");
    if (old_selection) { old_selection.remove(); }
    
    const name = document.createTextNode(mnt_name);
    
    const item = document.createElement("div");
    item.setAttribute("class", "item");
    item.setAttribute("id", "selected-mountpoint");
    

    const selected_mountpoint_h2 = document.createElement("h2");
    selected_mountpoint_h2.appendChild(name);
    item.appendChild(selected_mountpoint_h2);
    selection_container.appendChild(item);

    setup_list();

    hide_list();

    set_selectable_mountpoints(mnt_name, await fetch_mountpoints())
}

function set_selectable_mountpoints(mnt_name_omit, mountpoints) 
{
    selectables.innerHTML = "";
    
    for (let i = 0; i < mountpoints.length; i++)
    {
        let mountpoint_name = mountpoints[i].listenurl.split("/").at(-1);
        if (mountpoint_name == mnt_name_omit)
        { continue; }

        const name = document.createTextNode(mountpoint_name);
        
        const item = document.createElement("div");
        item.setAttribute("class", "item");
        item.setAttribute("id", dropdown_items_count);
        
        const selected_mountpoint_h2 = document.createElement("h2");
        
        selected_mountpoint_h2.appendChild(name);
        item.appendChild(selected_mountpoint_h2);
        selectables.appendChild(item);
        
        dropdown_items_count++;

        item.addEventListener('click', function () { 
            set_selected_mountpoint(item.querySelector("h2").innerText);
            change_radio_src(mountpoint_name);
        });
    }
}

async function fetch_mountpoints()
{
    available_mountpoints = [];

    let icecast_status = await fetch("/status-json.xsl");

    // todo
    //if (icecast_status.status != 200)
    let data = await icecast_status.json();
    if (Array.isArray(data.icestats.source))
    {
        let mountpoints = await data.icestats.source;
        for (const mountpoint of mountpoints) { available_mountpoints.push(mountpoint); }
    }
    else { 
        let mountpoint = await data.icestats.source;
        available_mountpoints.push(mountpoint); 
    }

    return available_mountpoints;
}
