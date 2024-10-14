let wordName = document.querySelector(".searchedWord");
let definition1 = document.querySelector(".def1");
let definition2 = document.querySelector(".def2");
let partOfSpeech = document.querySelector(".pos");
let example = document.querySelector(".examples");
let btn = document.getElementById("searchBtn");
let input = document.getElementById("typeInput");
let playAudio = document.getElementById("playBtn");
let audio = null;
let message = document.getElementById("noSound");

function dictionary(word) {
    let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    fetch(url)
        .then((fetchAPI) => {
            if (fetchAPI.status === 404) {
                wordName.innerHTML = `WORD - N/A`;
                definition1.innerHTML = "DEFINITION - N/A";
                definition2.innerHTML = "ANOTHER DEFINITION - N/A";
                partOfSpeech.innerHTML = "Part Of Speech - N/A";
                example.innerHTML = "EXAMPLE - N/A";
                audio = null;
                return Promise.reject("Word not found");
            }
            return fetchAPI.json();
        })
        .then((jsonFormat) => {
            let AudioURL = "";

            jsonFormat[0].phonetics.forEach((aud) => {
                if (aud.hasOwnProperty("audio")) {
                    AudioURL = aud.audio;
                }
            });

            if (AudioURL) {
                if (audio) {
                    audio.pause();
                    audio.currentTime = 0;
                }

                audio = new Audio(AudioURL);
            } else {
                audio = null;
            }

            let define1 = jsonFormat[0].meanings[0].definitions[0].definition;
            let define2 = jsonFormat[0].meanings[0].definitions[1]?.definition || 'N/A';
            let partofsp = jsonFormat[0].meanings[0].partOfSpeech;

            definition1.innerHTML = `DEFINITION - ${define1}`;
            definition2.innerHTML = `ANOTHER DEFINITION - ${define2}`;
            partOfSpeech.innerHTML = `Part Of Speech - ${partofsp}`;
            wordName.innerHTML = `WORD - ${word}`;
            example.innerHTML = `EXAMPLE - ${jsonFormat[0].meanings[0].definitions[0].example || 'N/A'}`;
        })
        .catch((error) => {
            console.error('Error fetching the dictionary data:', error);
            audio = null;
        });
}

// 1st event listener
btn.addEventListener("click", () => {
    dictionary(input.value);

    message.style.visibility = "hidden";
});

// 2nd event listener
playAudio.addEventListener("click", () => {
    if (input.value === "") {
        message.style.visibility = "visible";
        message.innerText = "Enter a word";
    }
    else if (audio) {
        audio.play();
        message.style.visibility = "hidden";
    }
    else {
        message.style.visibility = "visible";
        message.innerText = `Sorry, No sound available for this particular word "${input.value.toUpperCase()}"`;
    }
});
