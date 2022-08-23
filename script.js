//assigning selector to variables to avoid redundancy of code
const wrapper = document.querySelector(".wrapper"),
  searchInput = wrapper.querySelector("input"),
  volume = wrapper.querySelector(".word i"),
  infoText = wrapper.querySelector(".info-text"),
  synonyms = wrapper.querySelector(".synonyms .list"),
  removeIcon = wrapper.querySelector(".search span");

let audio;

// displays all information of word
function data(result, word) {
  if (result.title) {
    //if api returns the message of cant find then
    infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try to search for another word.`;
  } else {
    wrapper.classList.add("active"); //once the meaning is found the information needs to be displayed which is prepared as unordered list
    //accessing the desired contents inside the response
    let definitions = result[0].meanings[0].definitions[0],
      phontetics = `${result[0].meanings[0].partOfSpeech}  /${result[0].phonetics[0].text}/`;
    //passing the particular response data to a particular element
    document.querySelector(".word p").innerText = result[0].word;
    document.querySelector(".word span").innerText = phontetics;
    document.querySelector(".meaning span").innerText = definitions.definition;
    document.querySelector(".example span").innerText = definitions.example;
    audio = new Audio("https:" + result[0].phonetics[0].audio); //creating new audio object and passing audio src obtained from response
    //in case the synonym is not found, we have to hide it
    if (definitions.synonyms[0] == undefined) {
      synonyms.parentElement.style.display = "none";
    } else {
      synonyms.parentElement.style.display = "block";
      synonyms.innerHTML = "";
      for (let i = 0; i < 5; i++) {
        // for displaying only 5 synonyms
        //synonyms are put into tag element
        //each synonym is provided with onclick event which is directed to searchbar again,
        let tag = `<span onclick="search('${definitions.synonyms[i]}')">${definitions.synonyms[i]},</span>`;
        //for the last synonym no comma
        tag =
          i == 4
            ? (tag = `<span onclick="search('${definitions.synonyms[i]}')">${definitions.synonyms[4]}</span>`)
            : tag;
        synonyms.insertAdjacentHTML("beforeend", tag); //this is inserted in the synonym element
      }
    }
  }
}

//search function for the  synonyms which is same as for in search bar
function search(word) {
  fetchApi(word);
  searchInput.value = word;
}

function fetchApi(word) {
  wrapper.classList.remove("active");
  infoText.style.color = "#000";
  infoText.innerHTML = `Searching the meaning of <span>"${word}"</span>`; //once the enter is clicked, the information is displayed while searching takes time
  let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`; //the required word will be used to fetch meanings
  fetch(url)
    .then((response) => response.json()) //response object is returned as promise, json() extracts json body from response object
    .then((result) => data(result, word)) //data function is invoked for displaying the information of the word
    .catch(() => {
      //in case of fetch error the following code is executed
      infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try to search for another word.`;
    });
}

//when users releases key after pressing keyup event is activated,
searchInput.addEventListener("keyup", (e) => {
  let word = e.target.value.replace(/\s+/g, " ");
  if (e.key == "Enter" && word) {
    //if the word to be searched is typed and enter key is pressed fetchapi is called
    fetchApi(word);
  }
});

volume.addEventListener("click", () => {
  volume.style.color = "#4D59FB"; //on click color of volume icon should change
  audio.play(); // audio extracted in data function is used here
  setTimeout(() => {
    volume.style.color = "#999";
  }, 800);
});

//remove search word at one click function
removeIcon.addEventListener("click", () => {
  searchInput.value = ""; //clearing inputfield
  searchInput.focus(); // | is introduced in search field to show focus
  wrapper.classList.remove("active"); // the footer needs to be inactive
  infoText.style.color = "#9A9A9A";
  infoText.innerHTML =
    "Type any existing word and press enter to get meaning, example, synonyms, etc.";
});
