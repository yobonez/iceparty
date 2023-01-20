document.addEventListener("DOMContentLoaded", function(event) {
    var song_title = document.querySelector(".song-title");
    var song_author = document.querySelector(".song-author");
    var album_art = document.querySelector(".albumart img");

    var playButton = document.getElementById("idplaybutton");
    var wait_message = document.querySelector(".wait-message p");
    var volumeslider = document.getElementById("idvolumeslider");
    
    function refresh_radio()
    {
        fetch('/status-json.xsl')
        .then(response => response.json())
        .then(data => {
            // case for multiple icecast mountpoints
            // if (Array.isArray(data.icestats.source))
            // {
            //     for (let i = 0; i < mountpoints.length; i++)
            //     {
                    
            //     }
            // }

            let author_title_arr = data.icestats.source.title.split("-");

            // let's ignore the fact that there may be some artists with dashes in their nicknames 
            let author = author_title_arr[0];
            let title = "";

            for (let i = 1; i < author_title_arr.length; i++)
            {
                title += author_title_arr[i];
            }

            if (song_title.innerHTML != title || song_author.innerHTML != author)
            {
                album_art.src = "img/cover.png?refresh=" + new Date().getTime();
                document.querySelector(".background").style = "background-image: url('img/cover.png?refresh=" + new Date().getTime() + "');";
            }
            
            song_author.innerHTML = author;
            song_title.innerHTML = title;
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

    refresh_radio();
    setInterval(refresh_radio, 5000);


    var audio = document.getElementById("player");
    var audio_link = audio.src;

    playButton.addEventListener('click', () => {
        let player_state = playButton.innerHTML;
        playButton.style.color = "gray";

        if (player_state == "play_circle") {
            wait_message.innerHTML = "Hold on...";
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

    audio.onplaying = (_) => {
        playButton.innerHTML = "stop_circle";
        playButton.style.color = "black";
        wait_message.innerHTML = "";
    }
    audio.onpause = (_) => {
        playButton.innerHTML = "play_circle";
        playButton.style.color = "black";
    }

    volumeslider.addEventListener("input", function() {
        audio.volume = this.value / 100;
    })
    
});
