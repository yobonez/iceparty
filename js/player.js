document.addEventListener("DOMContentLoaded", function(event) {
    var song_title = document.querySelector(".song-title");
    var song_author = document.querySelector(".song-author");
    var album_art = document.querySelector(".albumart img");

    var playButton = document.getElementById("idplaybutton");
    var volumeslider = document.getElementById("idvolumeslider");

    function refresh_radio()
    {
        fetch('/status-json.xsl')
        .then(response => response.json())
        .then(data => {
            author_title_arr = data.icestats.source.title.split("-");
            if (song_title.innerHTML != author_title_arr[1] || song_author.innerHTML != author_title_arr[0])
            {
                album_art.src = "img/cover.png?refresh=" + new Date().getTime();
                document.getElementsByTagName("body")[0].style = "background-image: url('img/cover.png?refresh=" + new Date().getTime() + "');";
            }
            song_title.innerHTML = author_title_arr[1];
            song_author.innerHTML = author_title_arr[0];
            playButton.style.cursor = "pointer";
        })
        .catch(_ => {
            album_art.src = "img/error.png"
            song_title.innerHTML = "Desired Icecast mountpoint or server is down.";
            song_author.innerHTML = "Error";
            playButton.style.pointer = "not-allowed";
            }
        )
    }
    setInterval(refresh_radio, 1000);


    var audio = document.getElementById("player");
    var audio_link = audio.src;

    playButton.addEventListener('click', () => {
        let player_state = playButton.innerHTML;
        playButton.style.color = "gray";

        if (player_state == "play_circle") {
            audio.removeAttribute("src");
            audio.load();

            audio.src = audio_link + "?refresh=" + new Date().getTime();
            audio.play();
            player_state = 0;
        }
        else {
            playButton.innerHTML = "play_circle";
            audio.pause();
            player_state = 1;
        }
    })

    audio.onplaying = (e) => {
        playButton.innerHTML = "stop_circle";
        playButton.style.color = "black";
    }
    audio.onpause = (e) => {
        playButton.innerHTML = "play_circle";
        playButton.style.color = "black";
    }

    volumeslider.addEventListener("input", function() {
        audio.volume = this.value / 100;
    })
    
});
