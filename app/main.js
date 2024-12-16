const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('word-input');
const resultDiv = document.getElementById('result');
const fontSelect = document.getElementById('font-select');
const moonIcon = document.getElementById('image-dark');


document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedFont = localStorage.getItem('fontFamily') || 'Arial';
    applyTheme(savedTheme);
    applyFont(savedFont);
    fontSelect.value = savedFont;
});

function validate(date) {
    const word = date.trim();
    if(word.length < 2) {
        alert("2 xonalidan katta bolishi kerak!")
    } 
}


moonIcon.addEventListener('click', () => {
    const newTheme = document.body.classList.toggle('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
});


fontSelect.addEventListener('change', () => {
    const selectedFont = fontSelect.value;
    applyFont(selectedFont);
    localStorage.setItem('fontFamily', selectedFont);
});


function applyFont(font) {
    document.body.style.fontFamily = font;
}

function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

searchBtn.addEventListener('click', () => {
    const word = searchInput.value.trim();
    if (word) {
        fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
            .then(response => {
                if (!response.ok) throw new Error('Bunday soz APIda yo`q. Iltimos qayta urunib korin');
                return response.json();
            })
            .then(data => displayResult(data))
            .catch(error => resultDiv.innerHTML = `<p style="color:red;">${error.message}</p>`);
    }
});


function displayResult(data) {
    const wordData = data[0];
    const phonetic = wordData.phonetics[0]?.text || '';
    const audioSrc = wordData.phonetics.find(p => p.audio)?.audio || '';
    const meanings = wordData.meanings.map(meaning => `
        <div class="part-of-speech">${meaning.partOfSpeech}</div>
        <ul>${meaning.definitions.map(def => `<li>${def.definition}</li>`).join('')}</ul>
    `).join('');
    const synonyms = wordData.meanings[0]?.synonyms?.length
        ? `<div class="synonyms">Synonyms: ${wordData.meanings[0].synonyms.join(', ')}</div>`
        : '';
    resultDiv.innerHTML = `
    <div class="block">
        <div class="word-title">${wordData.word}</div>
         ${audioSrc ? `<button class="audio-button" onclick="playAudio('${audioSrc}')"> <img  class="audioo" src="./images/player.png" alt="audio"></button>` : ''}
          </div>
        <div class="pronunciation">${phonetic}</div>
              <h5>${meanings}</h5>
              <h5> ${synonyms}</h5>
       
    `;
}

function playAudio(src) {
    new Audio(src).play();
}
