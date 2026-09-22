import * as x from "./helpers.js";

const months = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December",
];

const parseDate = (ts) => {
  const dt = new Date(ts);
  const y = dt.getFullYear();
  const d = dt.getDate();
  const m = dt.getMonth();

  return `${months[m]} ${d}, ${y}`;
};

const generateCard = (setlistData, idx) => {
  const card = document.createElement("div");
  const cardMarkup = (
    `<input class="card__toggle" type="radio" name="cards" value="card-${idx}" id="card-${idx}" hidden>
      <div class="card__wrapper">
        <div class="card__inner">
          <div class="card__side card__side--front">
          <label class="card__label" for="card-${idx}">
            <div class="card__image"></div>
            <div class="card__title">${setlistData.label}</div>
          </label>
        </div>
        <div class="card__side card__side--back">
          <label>
            Back
            <input type="radio" name="cards" value="none" hidden>
          </label>
          <h1 class="card__title">${setlistData.label}</h1>
          <p>${parseDate(setlistData.timestamp)}</p>
          <ul>
            ${setlistData.artists.map((artist) => (
              `<li class="card__artist">${artist}</li>`
            )).join("")}
          </ul>
          ${setlistData.sets.map((set) => (
            `<h2 class="card__artist">${set.artist}</h2>
            <ol class="card__setlist">
              ${set.songs.map((song) => (
                `<li class="card__song">${song}</li>`
              )).join("")}
            </ol>`
          )).join("")}
        </div>
      </div>
    </div>`
  );

  card.style.setProperty("--setlist-image", `url('../assets/${setlistData.thumbnail}')`);
  card.classList.add("card");
  card.innerHTML = cardMarkup;

  return card;
}

const handleSetlistsData = ([template, ...setlistsData]) => {
  const cards = setlistsData.map((setlistData, idx) => generateCard(setlistData, idx));
  const target = x._(".cards");
  cards.forEach((card) => target.appendChild(card));

  return true;
};

const updateStyling = () => {
  // set the scrollbar offset CSS variable value
  try {
    const { innerWidth } = window;
    const { documentElement: docEl } = document;
    const { clientWidth } = docEl;
    const scrollbarOffsetValue = innerWidth - clientWidth;

    docEl.style.setProperty("--scrollbar-offset", `${scrollbarOffsetValue}px`);
  } catch (err) {
    console.error("Error updating styling:");
    console.error(err);
  }
}

async function populateCards() {
  await fetch("./data.json")
    .then((response) => response.json())
    .then((setlistsData) => handleSetlistsData(setlistsData))
    .catch((err) => console.error("something has gone awry!", err));

  return true;
}

async function initFns() {
  await populateCards();
  updateStyling();
}

if (document.readyState === "complete") {
  initFns();
} else {
  document.addEventListener("readystatechange", () => {
    if (document.readyState === "complete") {
      initFns();
    }
  });
}

try {
  fetch("./assets/doing_a_tool_thing.txt")
    .then((res) => res.text())
    .then((txt) => txt.split("\n"))
    .then((arr) => arr.filter(x => !!x))
    .then((list) => list.reduce((result, name, i) => {
      const entryExists = result.filter(item => item.name === name).length;
      if (entryExists) return result;

      result.push({
        name,
        count: list.filter(x => x === name).length,
      });

      return result;
    }, []))
    .then((items) => items.sort((a, b) => (a.count < b.count ? 1 : a.count > b.count ? -1 : 0)))
    .then((table) => {console.groupCollapsed("7OOL things"); console.table(table); console.groupEnd();})
    .catch((err) => console.error(err));
} catch (err) {
  console.error(err);
}
