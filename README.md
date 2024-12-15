# Flatdango
Flatdango is a mini web application that allows users to purchase movie tickets from the Flatiron Movie Theater. Users can view movie details, see available tickets, and buy tickets for their favorite films.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Author](#author)
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
  - git clone (git clone git@github.com:......git <--the ssh code -->)
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

## Usage

***View Movies:***
Movies are displayed in the sidebar on the left. Click on any movie to view its details in the main section.

***Buy Tickets:***
Click the "Buy Ticket" button to purchase a ticket. The remaining tickets count will update automatically. Once all tickets are sold, the button will display "Sold Out."

***Delete Movies:***
To remove a movie from the list, click the "Delete" button. The next movie will automatically load, or the movie details section will clear if all the movies are deleted.

***Real-Time Updates:***
The app dynamically updates the sidebar and movie details section based on user actions such as clicking the delete button or the movie list on the left.

## Author:Martha Mwangi
 If you encounter any issues with the code or need assistance, kindly reach out through:
 - email ..<marthawanguimwangi4@gmail.com> 
 - contact ..<+254745418529>

## License
Copyright (c) 2024 Martha-Mwangii