

// Toggle navbar links on small screens
document.getElementById("menuToggle").addEventListener("click", () => {
  document.getElementById("navLinks").classList.toggle("active");
});




const results = document.getElementById("results");

// Run this function when page loads
window.addEventListener("DOMContentLoaded", () => {
  fetchBooks("javascript"); // default topic
});

// Called when user clicks search
function searchBooks() {
  const query = document.getElementById("searchInput").value.trim();
  if (query) {
    fetchBooks(query);
  } else {
    fetchBooks("javascript");
  }
}

// Fetch books from Open Library API
async function fetchBooks(query) {
  results.innerHTML = `<p>Loading...</p>`;
  try {
    const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);
    const data = await response.json();

    if (data.docs.length === 0) {
      results.innerHTML = `<p>No books found for "${query}".</p>`;
      return;
    }

    // Render books
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
  } catch (error) {
    results.innerHTML = `<p>Something went wrong. Please try again later.</p>`;
    console.error("Error fetching books:", error);
  }
}

