// Ensures html  fully load before executing the js
document.addEventListener("DOMContentLoaded", () => {
  // Selecting  DOM Elements by their ids
  const filmsList = document.getElementById("films"); // Sidebar film list container
  const poster = document.getElementById("poster"); // Movie poster element
  const title = document.getElementById("title"); // Movie title element
  const runtime = document.getElementById("runtime-value"); // Runtime element
  const showtime = document.getElementById("showtime-value"); // Showtime element
  const tickets = document.getElementById("tickets-value"); // Remaining tickets element
  const buyButton = document.getElementById("buy-ticket"); // Buy ticket button element
  const deleteButton = document.getElementById("delete-ticket"); // Delete movie button element

  const apiUrl = "http://localhost:3000/films"; // The base URL of the API endpoint to manage the data
  let selectedMovie = null; //Holds the currently selected movie's data (useful for displaying or updating movie details)

  // Fetch all films from the API and initialize the first movie
  function fetchFilms() {
    fetch(apiUrl) // Makes a GET request to the API
      .then((res) => res.json()) // Parse the response as JSON
      .then((films) => {
        filmsList.innerHTML = ""; // Clears the sidebar list before populating it
        if (films.length > 0) {
          // Check if there are any films in the response
          films.forEach((film) => displayFilm(film)); //Iterates through the films array and display each film in the sidebar
          if (!selectedMovie) {
            loadFilmDetails(films[0]); // Load details of the first movie(index 0) by default
          }
        } else {
          clearDetails(); // If there are no movies available in the db.json clear the movie details section
        }
      })
      .catch((err) => console.error("Error fetching films:", err)); //Logs any errors that occur during the fetch operation
  }

  // Display a film in the sidebar
  function displayFilm(film) {
    const li = document.createElement("li"); // Creates a new list item
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



