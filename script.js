
const searchBtn = document.getElementById("searchBtn");

const searchInput = document.getElementById("searchInput");

const loader = document.getElementById("loader");

const container = document.getElementById("bookContainer");

searchBtn.addEventListener("click", searchBooks);

searchInput.addEventListener("keypress", function (e) {

    if (e.key === "Enter") {

        searchBooks();

    }

});

async function searchBooks() {

    const title = searchInput.value.trim();

    if (title === "") {

        alert("Please enter a book name.");

        return;

    }

    loader.style.display = "block";

    container.innerHTML = "";

    try {

        const response = await fetch(
            `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}`
        );

        const data = await response.json();

        loader.style.display = "none";

        if (data.docs.length === 0) {

            container.innerHTML = "<h2>No Books Found.</h2>";

            return;

        }

        data.docs.slice(0, 20).forEach(book => {

            const image = book.cover_i
                ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
                : "https://via.placeholder.com/180x260?text=No+Cover";

            const author = book.author_name
                ? book.author_name.join(", ")
                : "Unknown";

            const year = book.first_publish_year || "N/A";

            
            const rating = (Math.random() * 2 + 3).toFixed(1);

            const card = document.createElement("div");

            card.className = "card";

            card.innerHTML = `

                <img src="${image}" alt="${book.title}">

                <h2>${book.title}</h2>

                <p><strong>Author:</strong> ${author}</p>

                <p><strong>Published:</strong> ${year}</p>

                <div class="rating">
                    ⭐ ${rating} / 5
                </div>

                <button class="favorite-btn">
                    ❤️ Add to Favourites
                </button>

            `;

            const favBtn = card.querySelector(".favorite-btn");

            favBtn.addEventListener("click", () => {

                let favourites =
                    JSON.parse(localStorage.getItem("favourites")) || [];

                const exists = favourites.some(item =>
                    item.title === book.title
                );

                if (exists) {

                    alert("Book already in favourites!");

                    return;

                }

                favourites.push({

                    title: book.title,

                    author: author,

                    image: image,

                    year: year,

                    rating: rating

                });

                localStorage.setItem(

                    "favourites",

                    JSON.stringify(favourites)

                );

                alert("❤️ Added to favourites!");

            });

            container.appendChild(card);

        });

    }

    catch (error) {

        loader.style.display = "none";

        container.innerHTML = "<h2>Something went wrong.</h2>";

        console.log(error);

    }

}



searchInput.value = "";

searchBooks();




