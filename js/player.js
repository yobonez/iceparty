var player_first_run = true;
var short_listenurl = "";


function set_status_loading() 
{
    var song_title = document.querySelector(".song-title");
    var song_author = document.querySelector(".song-author");
    var album_art = document.querySelector(".albumart img");
    //var playButton = document.getElementById("idplaybutton");

    song_title.innerHTML = "Loading...";
    song_author.innerHTML = "";
    album_art.src = "img/loading.png";
}

function change_radio_src()
{ 
    if (arguments.length == 0)
    {
        let audio = document.getElementById("player");
        audio.src = "/" + short_listenurl;
        player_first_run = false; 
    }
    else {
        let audio = document.getElementById("player");
        audio.src = "/" + arguments[0];
    }
}

function decode(str) {

    let txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
}

document.addEventListener("DOMContentLoaded", function(event) {
    var song_title = document.querySelector(".song-title");
    var song_author = document.querySelector(".song-author");
    var album_art = document.querySelector(".albumart img");
    
    var playButton = document.getElementById("idplaybutton");
    var wait_message = document.querySelector(".wait-message p");
    var volumeslider = document.getElementById("idvolumeslider");
    
    var blink_handler = undefined;
    var blink_counter = 0;
    function blink_button() {
        if (blink_counter == 0)
        {
            playButton.classList.add("blink");
        }
        else {
            playButton.classList.remove("blink");
            blink_counter = 0;
            clearInterval(blink_handler);
        }
        blink_counter++;
    }
    
    function load_cover()
    {
        album_art.src = "img/cover-" + short_listenurl + ".png?refresh=" + new Date().getTime();
        document.querySelector(".background").style = "background-image: url('img/cover-"+ short_listenurl +".png?refresh=" + new Date().getTime() + "');";
    }
    

    async function refresh_radio()
    {
        let current_mountpoint;
        let mountpoints = await fetch_mountpoints();
        const selection = document.querySelector(".playerbox-selection-wrapper #selected-mountpoint");

        if (mountpoints.length == 0)
        {
            song_title.innerHTML = "There are no icecast mountpoints, or icecast server is down."
            song_author.innerHTML = "Error";
            album_art.src = "img/error.png";
        }

        if (player_first_run)
        { current_mountpoint = mountpoints[0]; }
        else if (selection)
        { 
            for(let i = 0; i < mountpoints.length; i++)
            {
                let mountpoint_name = mountpoints[i].listenurl.split("/").at(-1);
                if (selection.querySelector("h2").innerText == mountpoint_name)
                {
                    current_mountpoint = mountpoints[i];
                    short_listenurl = mountpoint_name;
                }
            }
        }

        short_listenurl = await current_mountpoint.listenurl.split("/").at(-1);

        if (player_first_run)
        { change_radio_src() }


        let author_title_arr = current_mountpoint.title.split("-");

        // let's ignore the fact that there may be some artists with dashes in their nicknames 
        let author = decode(author_title_arr[0]);
        let title = "";

        for (let i = 1; i < author_title_arr.length; i++)
        {
            title += decode(author_title_arr[i]);
        }

        if (song_title.innerHTML != title.trim() || song_author.innerHTML != author.trim())
        { load_cover(); set_selected_mountpoint(short_listenurl); }
        if (!album_art.src.includes(short_listenurl))
        { load_cover(); }

        song_author.innerHTML = author.trim();
        song_title.innerHTML = title.trim();
        playButton.style.cursor = "pointer";
    }

    refresh_radio();
    setInterval(refresh_radio, 5000);

    
    playButton.addEventListener('click', () => {
        let audio = document.getElementById("player");
        let audio_link = audio.src;
        let player_state = playButton.innerHTML;
        playButton.style.color = "gray";

        if (player_state == "play_circle") {
            wait_message.innerHTML = "Hold on...";
            audio.removeAttribute("src");
            audio.load();

            audio.src = audio_link.split("?")[0] + "?refresh=" + new Date().getTime();
            audio.play();
            player_state = 0;
        }
        else {
            playButton.innerHTML = "play_circle";
            audio.pause();
            player_state = 1;
        }
    })

    audio.onplaying = (_) => {
        playButton.innerHTML = "stop_circle";
        playButton.style.color = "black";
        wait_message.innerHTML = "";
    }
    audio.onpause = (_) => {
        playButton.innerHTML = "play_circle";
        playButton.style.color = "black";
    }

    audio.onabort = (_) => {
        playButton.innerHTML = "play_circle";
        playButton.style.color = "black";
        blink_handler = setInterval(blink_button, 500);
    }

    volumeslider.addEventListener("input", function() {
        audio.volume = this.value / 100;
    })
    
});
