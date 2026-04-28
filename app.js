// 1. Ekrandaki (HTML içindeki) elemanları JavaScript'e tanıtıyoruz
const pokeContainer = document.getElementById("pokeContainer");
const searchInput = document.getElementById("searchInput");
const statusText = document.getElementById("status");

// Kaç tane Pokemon çekeceğimizi belirliyoruz
const POKEMON_COUNT = 151;

// Pokemon verilerini saklamak için boş bir liste (array) oluşturuyoruz
let pokemonList = [];

// 2. İnternetten (API) verileri çeken ana fonksiyon
async function fetchPokemonList() {
  statusText.textContent = "Pokemonlar yükleniyor...";

  try {
    // Pokemonların listesini almak için istek gönderiyoruz
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${POKEMON_COUNT}`,
    );
    const data = await response.json();

    // Listeyi tek tek geziyoruz ve her Pokemon'un detaylarını alıyoruz
    for (let pokemon of data.results) {
      const details = await fetchPokemonDetails(pokemon.url);
      pokemonList.push(details);
    }

    statusText.textContent = "";
    renderPokemonCards(pokemonList);
  } catch (error) {
    statusText.textContent = "Veriler alınırken bir hata oluştu!";
    console.error("Hata:", error);
  }
}

// 3. Her bir Pokemon'un detaylarını çeken yardımcı fonksiyon
async function fetchPokemonDetails(url) {
  const response = await fetch(url);
  const data = await response.json();

  return {
    id: data.id,
    name: data.name,
    image: data.sprites.other["official-artwork"].front_default,
    types: data.types,
  };
}

// 4. Pokemon verilerini HTML kartlarına dönüştüren fonksiyon
function renderPokemonCards(pokemons) {
  pokeContainer.innerHTML = "";

  pokemons.forEach((pokemon) => {
    const mainType = pokemon.types[0].type.name;
    const card = document.createElement("div");
    card.className = `pokemon-card ${mainType}`;

    let typesHTML = "";
    pokemon.types.forEach((item) => {
      typesHTML += `<span class="type-badge">${item.type.name}</span>`;
    });

    card.innerHTML = `
            <span class="card-id">#${String(pokemon.id).padStart(3, "0")}</span>
            <div class="card-name">${pokemon.name}</div>
            <div class="types-container">
                ${typesHTML}
            </div>
            <img src="${pokemon.image}" alt="${pokemon.name}">
        `;

    pokeContainer.appendChild(card);
  });
}

// 5. Arama çubuğu fonksiyonu
searchInput.addEventListener("input", function () {
  const arananKelime = searchInput.value.toLowerCase();

  const filtrelenmisPokemonlar = pokemonList.filter((pokemon) => {
    const isimUyuyorMu = pokemon.name.includes(arananKelime);
    const idUyuyorMu = pokemon.id.toString().includes(arananKelime);
    return isimUyuyorMu || idUyuyorMu;
  });

  renderPokemonCards(filtrelenmisPokemonlar);
});

fetchPokemonList();
