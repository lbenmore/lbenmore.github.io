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

  const init = ([template, ...lists]) => {
  const markup = lists.map((list, idx) => {
    return (
      `<div class="card" style="--setlist-image: url('../assets/${list.thumbnail}')">
        <input class="card__toggle" type="radio" name="cards" value="card-${idx}" id="card-${idx}" hidden>
        <div class="card__wrapper">
          <div class="card__inner">
            <div class="card__side card__side--front">
            <label class="card__label" for="card-${idx}">
                <div class="card__image"></div>
                <div class="card__title">${list.label}</div>
              </label>
            </div>
            <div class="card__side card__side--back">
              <label>
                Back
                <input type="radio" name="cards" value="none" hidden>
              </label>
              <h1 class="card__title">${list.label}</h1>
              <p>${parseDate(list.timestamp)}</p>
              <ul>
                ${list.artists.map((artist) => (
                  `<li class="card__artist">${artist}</li>`
                )).join("")}
              </ul>
              ${list.sets.map((set) => (
                `<h2 class="card__artist">${set.artist}</h2>
                <ol class="card__setlist">
                  ${set.songs.map((song) => (
                    `<li class="card__song">${song}</li>`
                  )).join("")}
                </ol>`
              )).join("")}
            </div>
          </div>
        </div>
      </div>`
    );
  }).join("");

  x._(".cards").innerHTML = markup;
};

fetch("./data.json")
  .then((res) => res.json())
  .then((json) => init(json))
  .catch((err) => console.error("something has gone awry!", err));

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
