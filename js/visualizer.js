var first_run = true;
//document.getElementsByTagName("html")[0].clientWidth;
const screen_width = window.screen.width * window.devicePixelRatio;
const options_tab = document.querySelector(".options");
const audio = document.getElementById("player");
var mouse_afk;

var actx = undefined;
var audio_source = undefined;
var analyser = undefined;

var biquad_filter = undefined;
var gain_filter = undefined;

document.addEventListener("DOMContentLoaded", function(_) {
    const playButton = document.getElementById("idplaybutton");
    const bassBoostButton = document.getElementById("bboost");
    
    function connect_nodes()
    {
        biquad_filter = actx.createBiquadFilter();
        gain_filter = actx.createGain();
        biquad_filter.type = "lowpass";

        audio_source.connect(analyser);
        analyser.connect(actx.destination);
        
        audio_source.connect(biquad_filter);
        biquad_filter.connect(gain_filter);
        gain_filter.connect(actx.destination);
        

        biquad_filter.frequency.setValueAtTime(0, actx.currentTime);
        gain_filter.gain.setValueAtTime(0, actx.currentTime);
        //analyser.connect(actx.destination);
        
        console.log(audio_source);
    }

    function set_filters()
    {
        const is_bassboost = document.getElementById("bboost").checked;
        if (is_bassboost)
        {
            biquad_filter.frequency.setValueAtTime(100, actx.currentTime);
            gain_filter.gain.setValueAtTime(0.7, actx.currentTime);
            biquad_filter.Q.value = 5;
        }
        else {
            biquad_filter.frequency.setValueAtTime(0, actx.currentTime);
            gain_filter.gain.setValueAtTime(0, actx.currentTime);
            biquad_filter.Q.value = 0;
        }
    }

    function draw_bars() {
        const bars_amount = parseInt(screen_width / 8);

        const freq_bin_count = analyser.frequencyBinCount;
        const factor = parseInt(freq_bin_count / bars_amount);

        //TODO: biquad filter
        const freq_array = new Uint8Array(freq_bin_count);
        analyser.getByteFrequencyData(freq_array);

        bar_index = 0;
        for (let i = 0; i < freq_array.length; i++)
        {
            if (i % factor == 0){
                const single_freq = freq_array[bar_index];
                // .visualizer-bar[id='0']
                const single_bar = document.querySelector(".visualizer-bar[id='" + bar_index + "']");

                if(!single_bar) {
                    continue;
                }

                if (single_freq < 2)
                { single_bar.style.height = 2 + "px"; }
                else {
                    single_bar.style.height = single_freq*2.5 + "px";
                    //single_bar.style.color.r = single_freq;
                    //single_bar.style.backgroundColor = "rgb(0,0," + single_freq + ")";
                }
                
                if (single_freq > 200)
                { single_bar.style.borderColor = "rgb(" + single_freq + ", 0, 0)"; }
                else 
                { single_bar.style.borderColor = "black"; }

                bar_index++;
            }
        }
        //window.requestAnimationFrame(draw_bars);
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
        const bars_amount = screen_width / 10;
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
            actx = new AudioContext();
            audio_source = actx.createMediaElementSource(audio);
            analyser = actx.createAnalyser();
        
            run();
            connect_nodes();

            setInterval(draw_bars, 15);
            first_run = false;
        }
    })

    bassBoostButton.addEventListener('click', function() {
        set_filters();
    })

    document.onmousemove = function()
    {
        clearTimeout(mouse_afk)
        options_tab.style.opacity = 1;
        mouse_afk = setTimeout(() => {
            options_tab.style.opacity = 0;
        }, 2000);
    }
})
