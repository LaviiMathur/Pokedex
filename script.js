$(document).ready(function () {
  const colors = {
    fire: "#e03a3a",
    grass: "#50C878",
    electric: "#fad343",
    water: "#1E90FF",
    ground: "#735139",
    rock: "#63594f",
    fairy: "#EE99AC",
    poison: "#b34fb3",
    bug: "#A8B820",
    dragon: "#fc883a",
    psychic: "#882eff",
    flying: "#87CEEB",
    fighting: "#bf5858",
    normal: "#D2B48C",
    ghost: "#7B62A3",
    dark: "#414063",
    steel: "#808080",
    ice: "#98D8D8",
  };
  const regions = {
    kanto: {
      start: 1,
      end: 151,
    },
    johto: {
      start: 152,
      end: 251,
    },
    hoenn: {
      start: 252,
      end: 386,
    },
    sinnoh: {
      start: 387,
      end: 493,
    },
    unova: {
      start: 494,
      end: 649,
    },
    kalos: {
      start: 650,
      end: 721,
    },
    alola: {
      start: 722,
      end: 809,
    },
    galar: {
      start: 810,
      end: 898,
    },
    hisui: {
      start: 899,
      end: 905,
    },
    paldea: {
      start: 906,
      end: 1010,
    },
  };

  const header = $("header");
  const main = $("main");
  const body = $("body");
  const region = $(".region");
  function toggleDarkMode() {
    body.toggleClass("bodyClr");
    header.toggleClass("headerClr");
    region.toggleClass("regionClr");
  }
  $(".btn").on("click", toggleDarkMode);
  let abortController = new AbortController();
  async function fetchPokemons(region) {
    main.html("");
    abortController.abort();
    abortController = new AbortController();
    const start = regions[region]?.start;
    const end = regions[region]?.end;
    try {
      for (let i = start; i <= end; i++) {
        const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        const res = await fetch(url, { signal: abortController.signal });
        const data = await res.json();
        createPokemonCard(data);
        setTimeout(() => {}, "150");
      }
    } catch (error) {
      console.error("Error fetching Pokémon:", error);
    }
  }

  function createPokemonCard(pokemon) {
    const container = $("<div>").addClass("container");
    const card = $("<div>").addClass("card").attr("id", pokemon.id);
    const details = $("<a>").attr("href", "details.html");
    main.append(container);
    container.append(details);
    details.append(card);

    const frontImg = pokemon.sprites.other.dream_world.front_default
      ? pokemon.sprites.other.dream_world.front_default
      : pokemon.sprites.other["official-artwork"].front_default;
    const backImg = pokemon.sprites.other.showdown.back_default;
    const type_1 = pokemon.types[0]?.type.name;
    const type_2 = pokemon.types[1]?.type.name;

    card.html(`
    <div class="front side">
          <div class="images">
                        <img class="background" src="Icons/default/pokeball.svg" alt="pokeball">
                        <img class="image front_image"
                            src="${frontImg}"
                            alt="${pokemon.name}">
          </div>
                    <span class="number">#${pokemon.id}</span>
                    <h3 class="name">${pokemon.name}</h3>
          <div class="types">
                        <div class="type_bg ${type_1}">
                            <img src="Icons/${type_1}.svg" alt="${type_1}">
                        </div>
                ${
                  type_2
                    ? `<div class="type_bg ${type_2}">
                            <img src="Icons/${type_2}.svg" alt="${type_2}">
                        </div>`
                    : ""
                } 
          </div>
  </div>
  <div class="back side">
    <div class="images">
                        <img class="background" src="Icons/default/pokeball.svg" alt="pokeball">
                        <img class="image"
                            src="${backImg == null ? frontImg : backImg}"
                            alt="${pokemon.name}">
    </div>
                    <span class="number">#${pokemon.id}</span>
                    <h3 class="name">${pokemon.name} </h3>
    <div class="about">
                        <div class="weight">${pokemon.weight}kg</div>
                        <div class="height">${pokemon.height}m</div>
    </div>`);
    card.css({
      background: colors[type_1],
      boxShadow: `0 3px 15px  ${colors[type_1]}`,
    });
  }
  function searchPokemon() {
    let input = $("#input").val().toLowerCase().trim();
    let x = $(".container");
    // console.log(input);
    for (let i = 0; i < x.length; i++) {
      const pokemonName = x.eq(i).find(".name").text().toLowerCase();
      const type_1 = x[i].querySelector(".type_bg")?.classList?.[1];
      const type_2 = x[i].querySelectorAll(".type_bg")[1]?.classList?.[1];

      if (
        pokemonName.includes(input) ||
        type_1.includes(input) ||
        (type_2 && type_2.includes(input))
      ) {
        x.eq(i).css({
          display: "flex",
          position: "relative",
        });
      } else {
        x.eq(i).css("display", "none");
      }
    }
  }
  function changeRegion() {
    $(".region").on("click", (event) => {
      const selectedRegion = $(event.target);
      const activeRegion = $(".activeRegion");
      const selectedRegionName = selectedRegion.text();
      if (selectedRegion.length) {
        fetchPokemons().stop;
        activeRegion.removeClass("activeRegion");
        selectedRegion.addClass("activeRegion");
        fetchPokemons(selectedRegionName);
      }
    });
  }
  $("#input").on("input", searchPokemon);
  fetchPokemons("kanto");
  changeRegion();
});
