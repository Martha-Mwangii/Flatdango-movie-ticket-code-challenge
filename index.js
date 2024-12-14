// Fetch first film's details
fetch('http://localhost:5000/films')
  .then(response => response.json())
  .then(film => {
    // Update the UI with movie details
    document.querySelector('#title').textContent = film.title;
    document.querySelector('#runtime').textContent = `Runtime: ${film.runtime} mins`;
    document.querySelector('#showtime').textContent = `Showtime: ${film.showtime}`;
    document.querySelector('#tickets').textContent = `Available Tickets: ${film.capacity - film.tickets_sold}`;
    document.querySelector('#poster').src = film.poster;
  });
