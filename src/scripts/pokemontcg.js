import pokemon from 'pokemontcgsdk';

const container = document.querySelector('#container');
const pkmnSets = document.querySelector('#pkmnSets');

// Create the "Load More" button and add it to the DOM, but hide it initially
const loadMore = document.createElement('button');
loadMore.id = 'loadMore';
loadMore.textContent = 'Load More';
loadMore.style.backgroundColor = 'white';
loadMore.style.display = 'none'; // Hidden initially
loadMore.style.margin = '10px auto';
loadMore.style.padding = '10px';
document.body.appendChild(loadMore); // Append outside of #container

// Grab the sets and order them from date released from newest to oldest as options in the select called pkmnSets
pokemon.set.all()
    .then((sets) => {
        sets.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
        
        sets.forEach((set) => {
            const option = document.createElement('option');
            option.value = set.id;
            option.textContent = set.name;
            pkmnSets.appendChild(option);
        });

        pkmnSets.addEventListener('change', () => {
            const selectedSet = pkmnSets.value;
            loadSetCards(selectedSet);
        });
    });

function loadSetCards(setId) {
    let currentPage = 1;
    const pageSize = 250;

    function fetchAndDisplayCards() {
        pokemon.card.where({ q: `set.id:${setId}`, page: currentPage, pageSize: pageSize })
            .then((response) => {
                const cards = response.data; // Access the array of cards from the response

                cards.forEach((card) => {
                    const template = `
                        <ul id='card'>
                            <li id='name'><h2>${card.name}</h2></li>
                            <li id='pkmnIMG'><img src="${card.images.large}" alt="${card.name}" /></li>
                            <li id='cardNum'>Card Number: ${card.number}</li>
                        </ul>
                    `;
                    container.insertAdjacentHTML('beforeend', template);
                });

                if (response.totalCount > currentPage * pageSize) {
                    loadMore.style.display = 'block'; // Show the button if there are more cards to load
                    loadMore.onclick = () => {
                        loadMore.style.display = 'none'; // Hide the button while loading more cards
                        currentPage++;
                        fetchAndDisplayCards();
                    };
                } else {
                    loadMore.style.display = 'none'; // Hide the button if there are no more cards to load
                }
            });
    }

    container.innerHTML = ''; // Clear previous cards
    loadMore.style.display = 'none'; // Hide the button initially
    currentPage = 1; // Reset to first page
    fetchAndDisplayCards(); // Fetch and display the first page of cards
}
