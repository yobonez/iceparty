document.addEventListener("DOMContentLoaded", function(event) {
    var song_title = document.querySelector(".song-title");
    var song_author = document.querySelector(".song-author");
    var album_art = document.querySelector(".albumart img");

    function refresh_radio()
    {
        fetch('http://192.168.1.2:2139/status-json.xsl')
        .then(response => response.json())
        .then(data => {
            author_title_arr = data.icestats.source.title.split("-");
            if (song_title.innerHTML != author_title_arr[1] || song_author.innerHTML != author_title_arr[0])
            {
                album_art.src = "img/cover.png?random=" + new Date().getTime();
            }
            song_title.innerHTML = author_title_arr[1];
            song_author.innerHTML = author_title_arr[0];
        })
        .catch(reason => {
            song_title.innerHTML = reason;
            song_author.innerHTML = "Error";
            }
        )
    }
    setInterval(refresh_radio, 1000);
});