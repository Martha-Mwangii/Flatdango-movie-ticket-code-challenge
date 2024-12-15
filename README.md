# Flatdango

Flatdango is a mini web application that allows users to purchase movie tickets from the Flatiron Movie Theater. Users can view movie details, see available tickets, and buy tickets for their favorite films.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- View details of the first movie, including poster, title, runtime, showtime, and available tickets.
- See a list of all movies available at the theater.
- Buy tickets for a movie, which decreases the number of available tickets.
- Indicate when a movie is sold out by changing the button text and styling the movie in the list.

## Technologies Used

- HTML
- CSS
- JavaScript
- JSON Server (for mock API)

## Installation

To run this project locally, follow these steps:

1. **Clone the repository:**
Open the ubuntu terminal or the Visual Studio terminal and clone your repository
  - git clone https://github.com/yourusername/flatdango.git
  - cd(to open the cloned directory to start working on the project)
2. **Install JSON Server:**
If you don't have JSON Server installed, you can install it globally using npm:

  - npm install -g json-server

3. **Create a db.json file:**
 Create a db.json file in the root of your project directory and populate it with the following sample data:


4. **Start the JSON Server:**
 Run the following command to start the JSON server:

 - json-server --watch db.json

5. **Open the application:**
 Open index.html in your web browser to view the application. 

6. **Usage**

***View Movies:***
Movies are displayed in the sidebar on the left. Click on any movie to view its details in the main section.

***Buy Tickets:***
Click the "Buy Ticket" button to purchase a ticket. The remaining tickets count will update automatically. Once all tickets are sold, the button will display "Sold Out."

***Delete Movies:***
To remove a movie from the list, click the "Delete Movie" button. The next movie will automatically load, or the details section will clear if no movies remain.

***Real-Time Updates:***

The app dynamically updates the sidebar and movie details section based on user actions.

***Contributing***
Contributions are welcome! If you’d like to contribute to the project, follow these steps:

1. Fork the repository.
Create a new branch for your feature:

2. Commit your changes:
git commit -m "Add feature name"

3. Push your branch:
git push 

4. Open a pull request on the main repository.
## License
This project is licensed under the MIT License. You are free to use, modify, and distribute it. See the LICENSE file for details
