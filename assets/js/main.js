var wavesurfer;
$(document).ready(function () {
    // init map
    initAudio();
    let audioListCont = $(".voice-list .scrolling");
    let div = $("<div/>");
    audioLists.forEach((audio) => {
        let audioElm = getAudioListTemplate(audio);
        div.append(audioElm);
        audioListCont.append(div);
    });
    let audioListElms = audioListCont.find(".list-1");
    audioListElms.on("click", async function (e) {
        let isActive = this.classList.contains("active");

        if (isActive) return;
        $(".voice-list .scrolling .active").removeClass("active");
        this.classList.add("active");
        let randomSec = Math.floor(Math.random() * (2500 - 1500)) + 1500;
        let id = this.dataset.id;
        let progressBar = $(".bar-animation");
        preLoad();
        progressBar.animate(
            {
                width: "100%",
            },
            randomSec
        );
        try {
            let audio = await getAudioData(+id, randomSec);
            $(".analysis .prog-title h4").text("Analysis Completed");

            let {
                sentiment,
                track,
                recognition,
                location,
                langProcess,
                voiceText,
            } = audio;
            SetLocation(location);
            setVoiceText(voiceText);
            setAudioSentiments(sentiment);
            setVoiceRecognition(recognition);
            setAudioTrack(track);
            setLangProcessing(langProcess);
        } catch (error) {
            console.log(error);
        }
    });
});

function getAudioData(id, time) {
    let selectedAudio = audioData.filter((audio) => audio.id === id);

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            selectedAudio.length
                ? resolve(selectedAudio[0])
                : reject("Failed To get Data");
        }, time);
    });
}
let markers = [];
function SetLocation(locations) {
    markers.forEach((marker) => marker.setMap(null));
    markers = [];
    let avgPosition = { lat: 0, lng: 0 };
    locations.forEach(({ userTag, lat, lng }, i) => {
        avgPosition["lat"] += lat;
        avgPosition["lng"] += lng;
        let markerOptions = {
            position: new google.maps.LatLng(lat, lng),
            map: map,
            title: userTag + "",

            icon:
                i === 0
                    ? "assets/image/lang/marker1.png"
                    : "assets/image/lang/marker2.png",
        };
        let color = i === 0 ? "#A22627" : "#2073B9";
        setPopUp(new google.maps.LatLng(lat, lng), userTag + "", color);
        markers.push(new google.maps.Marker(markerOptions));
    });
    // map.setCenter(markers[markers.length - 1].getPosition());
    avgPosition.lat /= 2;
    avgPosition.lng /= 2;

    map.setCenter(avgPosition);
    popUps.forEach((popup) => {
        popup.setMap(map);
    });
    $("#map-cont").fadeIn();
}

function setVoiceText(texts) {
    let container = $(".convert_text-cont");
    container.empty();
    texts.forEach((t) => {
        let template = getVoiceTextTemplate(t.text, t.id, t.delay);
        setTimeout(() => {
            container.append(template);
            container.animate(
                {
                    scrollTop: $(".box-content:last-of-type").offset().top,
                },
                600
            );
        }, t.delay);
    });
    container.fadeIn();
    // $('.sdg-data').removeClass("active");
    // sdgItem.children()[i].classList.add("active");
    // $('.sdg-places-info').animate({
    //     scrollTop: sdgItem.children()[i].offsetTop
    // }, 600);

    // document.getElementsByClassName(".box-content").forEach((e) => {
    // e.delay(e.delay).addClass("active");
    // });
}
function getVoiceTextTemplate(text, id, delay) {
    let template = `<div class="box-content">
                  <div class="img-box">
                    <img src="assets/image/Acoustic/avatar.svg" alt="">
					<span>ID ${id}</span>
                  </div>
                  <div class="convert-text">
                    <p>
                     ${text}
                    </p>
                  </div>
                </div>`;
    return template;
}

function setLangProcessing(langProcess) {
    let boxesElms = $(".processing .box-content");
    boxesElms.each((i, elm) => {
        let type = elm.dataset.name;
        if (langProcess[type]) {
            elm.querySelector("h6").innerText = langProcess[type];
            elm.previousElementSibling.classList.add("active");
        } else {
            elm.querySelector("h6").innerText = "Not Found";
        }
    });
    $(".processing .box-content h6").css("visibility", "visible");
    // $('.processing')
}

function setAudioTrack(path) {
    let playBtn = document.getElementById("playBtn");
    if (playBtn.src.includes("pause.png")) {
        playBtn.src = "assets/image/Acoustic/plays.png";
    }
    wavesurfer.load(path);
}

function setVoiceRecognition(recognitions) {
    let container = $(".person-id");
    container.empty();
    recognitions.forEach((elm) => {
        let template = getVoiceRecognitionTemplate(elm);

        container.append(template);
    });
    container.find(".box-id").append(spinnerTemplate());
    container.fadeIn();
    $(".spinner-container").each((i, spin) => {
        setTimeout(() => {
            hideSpinner(spin);
        }, i * 4000 + 2000);
    });
}

function spinnerTemplate() {
    return `<div class="spinner-container">
      <div class="lds-spinner">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    </div>`;
}

function hideSpinner(spinner) {
    let elm = $(spinner);
    let boxFlex = $(".person-id .box-flex");
    elm.fadeOut();
    elm.prev().fadeIn();
}

function getVoiceRecognitionTemplate({ name, img, tag }) {
    img = img || "assets/image/Acoustic/User-i.png";
    name = name || "Unknown";
    let boxTemplate = `<div class="box-id box-full-width">
     <div class="box-flex">
       <div class="img-right">
         <img src="assets/image/Acoustic/Warning.png" alt="" />
       </div>
       <div class="image-cont">
         <img src=${img} alt="" />
       </div>
       <div class="box-cont-1">
         <h2>${name}</h2>
       </div>
       <div class="box-cont-2">
         <h4>Voice Tag: ${tag}</h4>
       </div>
     </div>
   </div>`;

    return boxTemplate;
}

function setAudioSentiments(sentiments) {
    let elms = $(".emotions .e-cont");
    elms.each((i, elm) => {
        let type = elm.dataset.name;
        let sentiment = sentiments[type];
        elm.querySelector("span").innerHTML = `${sentiment}%`;
    });
}

function preLoad() {
    //  Reset Audio Sentiment
    $(".emotions .e-cont span").text("0%");

    // Voice Text
    $(".voice-converter .convert .scrolling").fadeOut();

    //  voice Recognition
    $(".person-id").fadeOut();

    $("#map-cont").fadeOut();

    wavesurfer && wavesurfer.empty();

    // Lang Processing
    $(".processing .box-content h6").css("visibility", "hidden");

    // progress bar
    let progTitle = $(".analysis .prog-title h4");
    progTitle.text("Analysis in progress");
    progTitle.css("visibility", "visible");
    $(".bar-animation").css("width", "0%");

    // resetPopUp
    popUps.length && resetPopUps();
}

function getAudioListTemplate({ id, name, location, known }) {
    return `<div class="list-1" data-id="${id}">
                <div class="a-name">
                  <img src="assets/image/Acoustic/adui-1.svg" alt="">
                  <span>${name}</span>
                </div>
                ${
                    location
                        ? `<div class="a-location"><img src="assets/image/Acoustic/l-dark.png" alt=""></div>`
                        : '<div class="a-location"></div>'
                }
                ${
                    known
                        ? ` <div class="a-known"><img src="assets/image/Acoustic/a-dark.png" alt=""></div>`
                        : '<div class="a-known"></div>'
                }
              </div>`;
}

function initAudio() {
    var left = document.getElementById("left");
    var right = document.getElementById("right");
    var playBtn = document.getElementById("playBtn");
    var current = document.getElementById("current");
    var duration = document.getElementById("duration");
    var timer = function (value) {
        second = Math.floor(value % 60);
        minute = Math.floor((value / 60) % 60);

        if (second < 10) {
            second = "0" + second;
        }
        return minute + ":" + second;
    };

    wavesurfer = WaveSurfer.create({
        container: "#waveform",
        waveColor: "#F9F9FB",
        progressColor: "#072654",
        barWidth: 1,
        height: 100,
        responsive: true,
        hideScrollbar: true,
        barRadius: 2,
        barGap: 5,
    });

    wavesurfer.on("ready", function (e) {
        duration.textContent = timer(wavesurfer.getDuration());
        playBtn.onclick = function () {
            wavesurfer.playPause();

            let isPlaying = wavesurfer.isPlaying();
            if (isPlaying) {
                playBtn.src = "assets/image/Acoustic/pause.png";
            } else {
                playBtn.src = "assets/image/Acoustic/plays.png";
            }

            // if (playBtn.src.includes('plays.png')) {
            //   playBtn.src = 'assets/image/Acoustic/pause.png';
            // } else {
            //   playBtn.src = 'assets/image/Acoustic/plays.png';
            // }
        };

        left.onclick = function () {
            wavesurfer.seekTo(0);
        };
        right.onclick = function () {
            wavesurfer.seekTo(0.5);
        };
        playBtn.click();
    });
    wavesurfer.on("audioprocess", function (e) {
        current.textContent = timer(wavesurfer.getCurrentTime());
    });
}
let popUps = [];
function setPopUp(pos, markerContent, color) {
    /**
     * A customized popup on the map.
     */
    class Popup extends google.maps.OverlayView {
        position;
        containerDiv;
        constructor(position, content) {
            super();
            this.position = position;
            content.classList.add("popup-bubble");

            // This zero-height div is positioned at the bottom of the bubble.
            const bubbleAnchor = document.createElement("div");

            bubbleAnchor.classList.add("popup-bubble-anchor");
            bubbleAnchor.appendChild(content);
            // This zero-height div is positioned at the bottom of the tip.
            this.containerDiv = document.createElement("div");
            this.containerDiv.classList.add("popup-container");
            this.containerDiv.appendChild(bubbleAnchor);
            // Optionally stop clicks, etc., from bubbling up to the map.
            Popup.preventMapHitsAndGesturesFrom(this.containerDiv);
        }
        /** Called when the popup is added to the map. */
        onAdd() {
            this.getPanes().floatPane.appendChild(this.containerDiv);
        }
        /** Called when the popup is removed from the map. */
        onRemove() {
            if (this.containerDiv.parentElement) {
                this.containerDiv.parentElement.removeChild(this.containerDiv);
            }
        }
        /** Called each frame when the popup needs to draw itself. */
        draw() {
            const divPosition = this.getProjection().fromLatLngToDivPixel(
                this.position
            );
            // Hide the popup when it is far out of view.
            const display = "block";
            // Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000
            //   ? 'block'
            //   : 'none';

            if (display === "block") {
                this.containerDiv.style.left = divPosition.x + "px";
                this.containerDiv.style.top = divPosition.y + "px";
            }

            if (this.containerDiv.style.display !== display) {
                this.containerDiv.style.display = display;
            }
        }
    }
    let newCont = document.createElement("div");
    newCont.id = `popup-${markerContent}`;
    newCont.innerText = markerContent;
    newCont.style.color = color;
    popUps.push((popup = new Popup(pos, newCont)));
}

function resetPopUps() {
    popUps.forEach((popup) => {
        popup.setMap(null);
    });
    popUps = [];
}
