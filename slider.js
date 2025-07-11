const results = document.getElementById("results");
const slideTrack = document.getElementById("slideTrack");

window.addEventListener("DOMContentLoaded", () => {
  fetchBooks("javascript");
  loadSliderImages("bestseller");
});

function searchBooks() {
  const query = document.getElementById("searchInput").value.trim();
  fetchBooks(query || "javascript");
}

async function fetchBooks(query) {
  results.innerHTML = `<p>Loading...</p>`;
  try {
    const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);
    const data = await res.json();

    if (data.docs.length === 0) {
      results.innerHTML = `<p>No books found for "${query}".</p>`;
      return;
    }

    results.innerHTML = data.docs.slice(0, 20).map(book => {
      const title = book.title || "No Title";
      const author = book.author_name?.join(', ') || "Unknown Author";
      const year = book.first_publish_year || "Unknown Year";
      const coverId = book.cover_i;
      const coverUrl = coverId
        ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
        : `https://via.placeholder.com/200x250?text=No+Cover`;

      return `
        <div class="book">
          <img src="${coverUrl}" alt="${title}">
          <h3>${title}</h3>
          <p><strong>Author:</strong> ${author}</p>
          <p><strong>Year:</strong> ${year}</p>
        </div>
      `;
    }).join("");
  } catch (err) {
    results.innerHTML = `<p>Error fetching books.</p>`;
    console.error(err);
  }
}

async function loadSliderImages(query) {
  try {
    const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    const images = data.docs.slice(0, 10).map(book => {
      const coverId = book.cover_i;
      return coverId
        ? `<img src="https://covers.openlibrary.org/b/id/${coverId}-L.jpg" alt="cover">`
        : "";
    }).join("");

    // Duplicate images for smooth loop
    slideTrack.innerHTML = images + images;
  } catch (error) {
    console.error("Slider load error:", error);
  }
}
