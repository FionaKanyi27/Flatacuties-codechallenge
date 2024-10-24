document.addEventListener("DOMContentLoaded", () => {
  const baseUrl = "http://localhost:3000/characters";
  const characterBar = document.getElementById("character-bar");
  const detailedInfo = document.getElementById("detailed-info");
  const voteForm = document.getElementById("votes-form");
  const resetButton = document.getElementById("reset-btn");
  const characterForm = document.getElementById("character-form");
  let currentCharacter = null; // To track the currently displayed character

  // Fetch all characters and display their names in the character bar
  fetch(baseUrl)
    .then((response) => response.json())
    .then((characters) => {
      characters.forEach((character) => {
        addCharacterToBar(character);
      });
    });

  // Function to add a character to the character bar
  function addCharacterToBar(character) {
    const span = document.createElement("span");
    span.textContent = character.name;
    span.dataset.id = character.id;
    characterBar.appendChild(span);

    // Add click event to display character details
    span.addEventListener("click", () => {
      displayCharacterDetails(character);
    });
  }

  // Display character details in the detailed-info div
  function displayCharacterDetails(character) {
    const name = document.getElementById("name");
    const image = document.getElementById("image");
    const voteCount = document.getElementById("vote-count");

    name.textContent = character.name;
    image.src = character.image;
    image.alt = character.name;
    voteCount.textContent = character.votes;

    currentCharacter = character; // Store the current character
  }

  // Add votes to the current character when the form is submitted
  voteForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const voteInput = document.getElementById("votes").value;
    const voteCount = document.getElementById("vote-count");

    // Update the displayed votes
    const currentVotes = parseInt(voteCount.textContent);
    const newVotes = currentVotes + parseInt(voteInput);
    voteCount.textContent = newVotes;

    // Update the character's votes on the server
    updateVotesOnServer(currentCharacter.id, newVotes);

    // Reset input field
    voteForm.reset();
  });

  // Reset votes to 0 when the reset button is clicked
  resetButton.addEventListener("click", () => {
    const voteCount = document.getElementById("vote-count");
    voteCount.textContent = 0;

    // Update the character's votes on the server
    updateVotesOnServer(currentCharacter.id, 0);
  });

  // Add new character when the character form is submitted
  if (characterForm) {
    characterForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const newCharacter = {
        name: document.getElementById("name").value,
        image: document.getElementById("image-url").value,
        votes: 0,
      };

      // Add the new character to the character-bar and display its details
      fetch(baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCharacter),
      })
        .then((response) => response.json())
        .then((savedCharacter) => {
          addCharacterToBar(savedCharacter); // Add to character bar with ID
          displayCharacterDetails(savedCharacter); // Show its details immediately
        });

      // Clear form
      characterForm.reset();
    });
  }

  // Function to update votes on the server using PATCH request
  function updateVotesOnServer(characterId, votes) {
    fetch(`${baseUrl}/${characterId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ votes }),
    })
      .then((response) => response.json())
      .then((updatedCharacter) => {
        console.log("Votes updated on server:", updatedCharacter);
      });
  }
});
