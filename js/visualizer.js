var first_run = true;
//document.getElementsByTagName("html")[0].clientWidth;
const screen_width = window.screen.width * window.devicePixelRatio;

const audio = document.getElementById("player");
var audio_source = undefined;
var analyser = undefined;

document.addEventListener("DOMContentLoaded", function(_) {
    const playButton = document.getElementById("idplaybutton");
    
    function draw_bars() {
        const bars_amount = parseInt(screen_width / 8);

        const freq_bin_count = analyser.frequencyBinCount;
        const factor = parseInt(freq_bin_count / bars_amount);

        const freq_array = new Uint8Array(freq_bin_count);
        analyser.getByteFrequencyData(freq_array);

        bar_index = 0;
        for (let i = 0; i < freq_array.length; i++)
        {
            if (i % 4 == 0){
                const single_freq = freq_array[bar_index];
                // .visualizer-bar[id='0']
                const single_bar = document.querySelector(".visualizer-bar[id='" + bar_index + "']");

                if(!single_bar) {
                    continue;
                }

                if (single_freq < 2)
                {
                    single_bar.style.height = 2 + "px";
                }
                else {
                    single_bar.style.height = single_freq*2.5 + "px";
                }


                bar_index++;
            }
        }
        window.requestAnimationFrame(draw_bars);
    }

    function run() {
        //const screen_height = window.screen.height;
        const visualizer_container = document.querySelector(".visualizer-container");
    
        // 1920px / 8px = 240 bars
        // 1024 / 240 = 4.26 ~ every 4th bar (1024 % 4)
    
        // |2px    4px    2px| = 8
        // |margin bar margin|
        // elegancko

        // create bars
        const bars_amount = screen_width / 8;
        for (let i = 0; i < bars_amount; i++)
        {
            const bar = document.createElement("div");
            bar.setAttribute("id", i);
            bar.setAttribute("class","visualizer-bar");
    
            visualizer_container.appendChild(bar);
        }
    }

    playButton.addEventListener('click', function(_) {
        if (first_run){
            const actx = new AudioContext();
            audio_source = actx.createMediaElementSource(audio);
            analyser = actx.createAnalyser();
            
            audio_source.connect(analyser);
            analyser.connect(actx.destination);
            run();
            draw_bars();
            first_run = false;
        }
    })
})
