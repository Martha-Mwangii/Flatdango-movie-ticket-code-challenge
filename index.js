// Wait for the DOM content to fully load before executing the script
document.addEventListener("DOMContentLoaded", () => {
  // Get references to elements in the HTML
  const filmsList = document.getElementById("films"); // Sidebar film list container
  const poster = document.getElementById("poster"); // Movie poster element
  const title = document.getElementById("title"); // Movie title element
  const runtime = document.getElementById("runtime-value"); // Runtime element
  const showtime = document.getElementById("showtime-value"); // Showtime element
  const tickets = document.getElementById("tickets-value"); // Remaining tickets element
  const buyButton = document.getElementById("buy-ticket"); // Buy ticket button element
  const deleteButton = document.getElementById("delete-ticket"); // Delete movie button element

  const apiUrl = "http://localhost:3000/films"; // URL of the API to fetch movie data
  let selectedMovie = null; // Variable to track the currently selected movie

  // Fetch all films from the API and initialize the first movie
  function fetchFilms() {
    fetch(apiUrl) // Make a GET request to the API
      .then((res) => res.json()) // Parse the response as JSON
      .then((films) => {
        filmsList.innerHTML = ""; // Clear the sidebar list before populating it
        if (films.length > 0) {
          // If there are films in the response
          films.forEach((film) => renderFilm(film)); // Render each film in the sidebar
          if (!selectedMovie) {
            loadFilmDetails(films[0]); // Load details of the first movie by default
          }
        } else {
          clearDetails(); // If no films remain, clear the movie details section
        }
      })
      .catch((err) => console.error("Error fetching films:", err)); // Log errors if fetching fails
  }

  // Render a film in the sidebar
  function renderFilm(film) {
    const li = document.createElement("li"); // Create a new list item
    li.textContent = film.title; // Set the list item's text to the film title
    li.dataset.id = film.id; // Store the film's ID in a data attribute

    // If the movie is sold out, style it accordingly
    if (film.capacity - film.tickets_sold <= 0) {
      li.classList.add("sold-out"); // Add a "sold-out" class for styling
      li.textContent += " (Sold Out)"; // Append "Sold Out" to the title
    }

    // Add a click event listener to load the film details when clicked
    li.addEventListener("click", () => loadFilmDetails(film));
    filmsList.appendChild(li); // Add the list item to the sidebar
  }

  // Load the details of a selected film into the main section
  function loadFilmDetails(film) {
    selectedMovie = film; // Set the current film as the selected movie

    // Update the poster, title, runtime, and showtime elements with film data
    poster.src = film.poster;
    title.textContent = film.title;
    runtime.textContent = `${film.runtime} minutes`;
    showtime.textContent = `${film.showtime}`;

    // Calculate the remaining tickets and update the tickets element
    const remainingTickets = film.capacity - film.tickets_sold;
    tickets.textContent = `${remainingTickets}`;

    // Update the button states based on the ticket availability
    updateButtonState();
  }

  // Update the ticket count display for the selected movie
  function updateTicketDisplay() {
    const remainingTickets = selectedMovie.capacity - selectedMovie.tickets_sold; // Calculate remaining tickets
    tickets.textContent = `${remainingTickets}`; // Update the tickets element with the new count
  }

  // Update the Buy Ticket button state based on ticket availability
  function updateButtonState() {
    const remainingTickets = selectedMovie.capacity - selectedMovie.tickets_sold; // Calculate remaining tickets

    if (remainingTickets <= 0) {
      // If no tickets remain
      buyButton.textContent = "Sold Out"; // Change button text to "Sold Out"
      buyButton.style.backgroundColor = "yellow"; // Set button background to yellow
      buyButton.disabled = true; // Disable the button
    } else {
      // If tickets are still available
      buyButton.textContent = "Buy Ticket"; // Reset button text to "Buy Ticket"
      buyButton.style.backgroundColor = ""; // Reset button background color
      buyButton.disabled = false; // Enable the button
    }
  }

  // Handle the Buy Ticket button click
  buyButton.addEventListener("click", () => {
    if (!selectedMovie) return; // Exit if no movie is selected

    if (selectedMovie.tickets_sold < selectedMovie.capacity) {
      // If tickets are still available
      selectedMovie.tickets_sold += 1; // Increment the number of tickets sold

      // Update the server with the new tickets_sold value
      fetch(`${apiUrl}/${selectedMovie.id}`, {
        method: "PATCH", // Use PATCH to update specific data
        headers: { "Content-Type": "application/json" }, // Specify JSON content
        body: JSON.stringify({ tickets_sold: selectedMovie.tickets_sold }), // Send updated ticket count
      })
        .then(() => {
          updateTicketDisplay(); // Update ticket display in the UI
          updateButtonState(); // Update button state
          updateSidebarState(); // Update the sidebar to reflect sold-out status if needed
        })
        .catch((err) => console.error("Error updating tickets:", err)); // Log errors if updating fails
    }
  });

  // Handle the Delete Movie button click
  deleteButton.addEventListener("click", () => {
    if (!selectedMovie) return; // Exit if no movie is selected

    fetch(apiUrl) // Fetch all films from the API
      .then((res) => res.json()) // Parse the response as JSON
      .then((films) => {
        const index = films.findIndex((film) => film.id === selectedMovie.id); // Find the index of the selected movie

        // Send a DELETE request to the server to remove the selected movie
        fetch(`${apiUrl}/${selectedMovie.id}`, { method: "DELETE" })
          .then(() => {
            // Determine which movie to load next
            let nextMovie = null;

            if (index < films.length - 1) {
              // Load the next movie in the list
              nextMovie = films[index + 1];
            } else if (index > 0) {
              // Load the previous movie if the deleted movie was the last
              nextMovie = films[index - 1];
            }

            fetchFilms(); // Reload the film list in the sidebar
            if (nextMovie) {
              loadFilmDetails(nextMovie); // Load details of the next movie
            } else {
              clearDetails(); // Clear the details if no movies remain
            }
          })
          .catch((err) => console.error("Error deleting movie:", err)); // Log errors if deleting fails
      })
      .catch((err) => console.error("Error fetching films:", err)); // Log errors if fetching fails
  });

  // Update the sidebar for sold-out movies
  function updateSidebarState() {
    const remainingTickets = selectedMovie.capacity - selectedMovie.tickets_sold; // Calculate remaining tickets
    const filmItems = filmsList.querySelectorAll("li"); // Get all list items in the sidebar

    // Update the styling of the corresponding film in the sidebar
    filmItems.forEach((li) => {
      if (li.dataset.id == selectedMovie.id) {
        if (remainingTickets <= 0) {
          li.classList.add("sold-out"); // Add a "sold-out" class for styling
          li.textContent = `${selectedMovie.title} (Sold Out)`; // Update the text to indicate it's sold out
        }
      }
    });
  }

  // Clear the movie details section in the UI
  function clearDetails() {
    selectedMovie = null; // Clear the selected movie
    poster.src = ""; // Clear the poster
    title.textContent = ""; // Clear the title
    runtime.textContent = ""; // Clear the runtime
    showtime.textContent = ""; // Clear the showtime
    tickets.textContent = ""; // Clear the tickets
    buyButton.textContent = "Buy Ticket"; // Reset the Buy Ticket button text
    buyButton.disabled = true; // Disable the Buy Ticket button
  }

  // Initialize the application by fetching the films
  fetchFilms();
});









/*document.addEventListener("DOMContentLoaded", () => {
  const filmsList = document.getElementById("films");
  const poster = document.getElementById("poster");
  const title = document.getElementById("title");
  const runtime = document.getElementById("runtime");
  const showtime = document.getElementById("showtime");
  const tickets = document.getElementById("tickets");
  const buyButton = document.getElementById("buy-ticket");
  const deleteButton = document.getElementById("delete-ticket");

  let currentMovie = null; // Track the current movie being displayed
  let allMovies = []; // Cache all movies to avoid repeated fetching

  // Fetch all movies only once
  fetchMovies();

  function fetchMovies() {
    fetch("http://localhost:3000/films")
      .then((response) => response.json())
      .then((movies) => {
        allMovies = movies; // Cache all movies
        populateMovieList(movies);

        // Display the first movie only on initial load if no movie is currently selected
        if (!currentMovie && movies.length > 0) {
          currentMovie = movies[0]; // Set the current movie to the first one
          displayMovieDetails(currentMovie); // Display the first movie details
        }
      })
      .catch((error) => console.error("Error fetching movies:", error));
  }

  // Populate the list of movies in the sidebar
  function populateMovieList(movies) {
    filmsList.innerHTML = ""; // Clear existing list

    movies.forEach((movie) => {
      const li = document.createElement("li");
      li.textContent = movie.title;
      li.classList.add("film", "item");

      // Add 'sold-out' class if tickets are sold out
      if (movie.capacity - movie.tickets_sold <= 0) {
        li.classList.add("sold-out");
      }

      // Click event to display selected movie details
      li.addEventListener("click", () => {
        currentMovie = movie; // Set the current movie
        displayMovieDetails(movie);
      });

      filmsList.appendChild(li);
    });
  }

  // Display movie details in the main section
  function displayMovieDetails(movie) {
    poster.src = movie.poster;
    poster.alt = movie.title;
    title.textContent = movie.title;
    runtime.textContent = `Runtime: ${movie.runtime} mins`;
    showtime.textContent = `Showtime: ${movie.showtime}`;
    tickets.textContent = `Available Tickets: ${movie.capacity - movie.tickets_sold}`;
    updateButtonState(movie);
  }

  // Handle "Buy Ticket" button click
  buyButton.addEventListener("click", () => {
    if (!currentMovie) return;

    const availableTickets = currentMovie.capacity - currentMovie.tickets_sold;

    if (availableTickets > 0) {
      currentMovie.tickets_sold++;
      tickets.textContent = `Available Tickets: ${currentMovie.capacity - currentMovie.tickets_sold}`;
      updateButtonState(currentMovie);

      // Persist ticket count to the server
      fetch(`http://localhost:3000/films/${currentMovie.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tickets_sold: currentMovie.tickets_sold }),
      }).catch((error) => console.error("Error updating ticket count:", error));
    }
  });

  // Update the Buy Ticket button and mark as Sold Out if needed
  function updateButtonState(movie) {
    const availableTickets = movie.capacity - movie.tickets_sold;

    if (availableTickets <= 0) {
      buyButton.textContent = "Sold Out";
      buyButton.disabled = true;
    } else {
      buyButton.textContent = "Buy Ticket";
      buyButton.disabled = false;
    }
  }

  // Handle "Delete Movie" button click
  deleteButton.addEventListener("click", () => {
    if (!currentMovie) return;

    // Find the index of the current movie in the allMovies array
    const currentIndex = allMovies.findIndex(movie => movie.id === currentMovie.id);
    
    // Remove the movie from the list
    fetch(`http://localhost:3000/films/${currentMovie.id}`, {
      method: "DELETE",
    })
      .then(() => {
        // Remove the movie from the list
        allMovies = allMovies.filter((movie) => movie.id !== currentMovie.id);
        populateMovieList(allMovies); // Re-render the list
        
        // Determine the next movie to display
        if (allMovies.length > 0) {
          let nextMovie;
          
          // If the deleted movie wasn't the last one, show the next movie
          if (currentIndex < allMovies.length) {
            nextMovie = allMovies[currentIndex];
          } else {
            // If the deleted movie was the last one, show the previous movie
            nextMovie = allMovies[currentIndex - 1];
          }

          // Display the next movie details
          displayMovieDetails(nextMovie);
          currentMovie = nextMovie; // Update the current movie
        } else {
          // If no movies are left, clear the details section
          displayMovieDetails(null);
          currentMovie = null; // Clear the current movie
        }
      })
      .catch((error) => console.error("Error deleting movie:", error));
  });
});
*/






/*document.addEventListener("DOMContentLoaded", () => {

let currentFilm = {}; // Store the current film details

// Fetch all films and populate the list
fetch('http://localhost:5000/films')
    .then(response => response.json())
    .then(films => {
        const filmsList = document.querySelector('#films');
        filmsList.innerHTML = ''; // Clear any existing content
        films.forEach(film => {
            const li = document.createElement('li');
            li.textContent = film.title;
            li.dataset.id = film.id;
            li.addEventListener('click', () => loadFilmDetails(film.id));
            filmsList.appendChild(li);
        });
        // Load the first movie by default
        if (films.length > 0) loadFilmDetails(films[0].id);
    });

// Function to load movie details
function loadFilmDetails(filmId) {
    fetch(`http://localhost:5000/films/${filmId}`)
        .then(response => response.json())
        .then(film => {
            currentFilm = film;
            document.querySelector('#poster').src = film.poster;
            document.querySelector('#title').textContent = film.title;
            document.querySelector('#runtime').textContent = `Runtime: ${film.runtime} mins`;
            document.querySelector('#showtime').textContent = `Showtime: ${film.showtime}`;
            const availableTickets = film.capacity - film.tickets_sold;
            document.querySelector('#tickets').textContent = `Available Tickets: ${availableTickets}`;
            const buyButton = document.querySelector('#buy-ticket');
            if (availableTickets === 0) {
                buyButton.textContent = "Sold Out";
                buyButton.disabled = true;
            } else {
                buyButton.textContent = "Buy Ticket";
                buyButton.disabled = false;
            }
        });
}

// Buy ticket functionality
document.querySelector('#buy-ticket').addEventListener('click', () => {
    const availableTickets = currentFilm.capacity - currentFilm.tickets_sold;
    if (availableTickets > 0) {
        currentFilm.tickets_sold++;
        fetch(`http://localhost:5000/films/${currentFilm.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tickets_sold: currentFilm.tickets_sold })
        }).then(() => loadFilmDetails(currentFilm.id));
    }
});

// Delete movie functionality
document.querySelector('#delete-ticket').addEventListener('click', () => {
    fetch(`http://localhost:5000/films/${currentFilm.id}`, {
        method: 'DELETE'
    }).then(() => {
        document.querySelector(`li[data-id="${currentFilm.id}"]`).remove();
        document.querySelector('#movie-details').innerHTML = '<p>Movie Deleted.</p>';
    });
});
})*/
