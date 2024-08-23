let quotesViewed = 0;
let quotesFavorited = JSON.parse(localStorage.getItem('favorites'))?.length || 0;

const quoteButton = document.getElementById('quoteButton');
const favoriteButton = document.getElementById('favoriteButton');
const toggleButton = document.getElementById('toggleButtons');
const additionalButtons = document.getElementById('additionalButtons');
const shareTwitter = document.getElementById('shareTwitter');
const shareFacebook = document.getElementById('shareFacebook');
const generateImage = document.getElementById('generateImage');
const quoteDisplay = document.getElementById('quoteDisplay');
const statsViewed = document.getElementById('statsViewed');
const statsFavorited = document.getElementById('statsFavorited');
const favoritesList = document.getElementById('favoritesList');
const toggleListButton = document.getElementById('toggleListButton');


function updateStats() {
    statsViewed.innerText = `Quotes Viewed: ${quotesViewed}`;
    statsFavorited.innerText = `Quotes Favorited: ${quotesFavorited}`;
}


function displayFavorites() {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favoritesList.innerHTML = '';
    const fragment = document.createDocumentFragment();

    favorites.forEach((quote, index) => {
        let listItem = document.createElement('li');
        listItem.textContent = quote;


        if (index < 2) {
            listItem.classList.add('visible');
        }

        fragment.appendChild(listItem);
    });

    favoritesList.appendChild(fragment);


    if (favorites.length > 2) {
        toggleListButton.classList.remove('hidden');
    }
}

toggleListButton.addEventListener('click', () => {
    const allQuotes = document.querySelectorAll('#favoritesList li');
    const isExpanded = toggleListButton.getAttribute('data-expanded') === 'true';

    if (isExpanded) {
        allQuotes.forEach((quote, index) => {
            quote.classList.remove('visible');
            if (index < 2) {
                quote.classList.add('visible');
            }
        });
        toggleListButton.textContent = 'Show more';
    } else {
        allQuotes.forEach(quote => {
            quote.classList.add('visible');
        });
        toggleListButton.textContent = 'Show less';
    }

    toggleListButton.setAttribute('data-expanded', !isExpanded);
});


function addToFavorites(quote) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.push(quote);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    quotesFavorited++;
    alert('Quote added to favorites!');
    displayFavorites();
    updateStats();
}


quoteButton.addEventListener('click', () => {
    const category = document.getElementById('categorySelect').value;
    fetch(`https://api.quotable.io/random?tags=${category}`)
        .then(response => response.json())
        .then(data => {
            quoteDisplay.innerText = data.content;
            quotesViewed++;
            updateStats();
        })
        .catch(error => {
            console.error('Error fetching the quote:', error);
            quoteDisplay.innerText = "Oops! Something went wrong.";
        });
});

searchButton.addEventListener('click', () => {
    const searchQuery = searchInput.value;
    fetch(`https://api.quotable.io/search/quotes?query=${searchQuery}`)
        .then(response => response.json())
        .then(data => {
            if (data.results.length > 0) {
                const quote = data.results[0].content;
                quoteDisplay.innerText = quote;
                quotesViewed++;
                updateStats();
            } else {
                quoteDisplay.innerText = "No quotes found.";
            }
        })
        .catch(error => {
            console.error('Error searching the quote:', error);
            quoteDisplay.innerText = "Oops! Something went wrong.";
        });
});


favoriteButton.addEventListener('click', () => {
    const quote = quoteDisplay.innerText;
    if (quote && quote !== "Click the button to generate a quote!" && quote !== "Oops! Something went wrong." && quote !== "No quotes found.") {
        addToFavorites(quote);
    } else {
        alert('No valid quote to add to favorites.');
    }
});


shareTwitter.addEventListener('click', () => {
    const quote = quoteDisplay.innerText;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(quote)}`;
    window.open(twitterUrl, '_blank');
});

shareFacebook.addEventListener('click', () => {
    const quote = quoteDisplay.innerText;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(quote)}`;
    window.open(facebookUrl, '_blank');
});

generateImage.addEventListener('click', () => {
    const quote = quoteDisplay.innerText;
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000000';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(quote, canvas.width / 2, canvas.height / 2);

    const image = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
    const link = document.createElement('a');
    link.download = 'quote.png';
    link.href = image;
    link.click();
});


toggleButton.addEventListener('click', () => {
    additionalButtons.classList.toggle('hidden');
    additionalButtons.classList.toggle('show');


    if (additionalButtons.classList.contains('show')) {
        toggleButton.innerText = '▲';
        toggleButton.setAttribute('aria-label', 'Hide additional options');
    } else {
        toggleButton.innerText = '▼';
        toggleButton.setAttribute('aria-label', 'Show additional options');
    }
});


window.addEventListener('DOMContentLoaded', () => {
    displayFavorites();
    updateStats();
});
