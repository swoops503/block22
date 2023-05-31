const newPartyForm = document.querySelector('#new-party-form');
const partyContainer = document.querySelector('#party-container');

const PARTIES_API_URL = 'http://fsa-async-await.herokuapp.com/api/workshop/parties';
const GUESTS_API_URL = 'http://fsa-async-await.herokuapp.com/api/workshop/guests';
const RSVPS_API_URL = 'http://fsa-async-await.herokuapp.com/api/workshop/rsvps';
const GIFTS_API_URL = 'http://fsa-async-await.herokuapp.com/api/workshop/gifts';

// get all parties
const getAllParties = async () => {
  try {
    const response = await fetch(PARTIES_API_URL);
    const parties = await response.json();
    return parties;
  } catch (error) {
    console.error(error);
  }
};

// get single party by id
const getPartyById = async (id) => {
  try {
    const response = await fetch(`${PARTIES_API_URL}/${id}`);
    const party = await response.json();
    return party;
  } catch (error) {
    console.error(error);
  }
};

// delete party
const deleteParty = async (id) => {

  console.log('delete attempt yuuuuh')
  try {
    const response = await fetch(`${PARTIES_API_URL}/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      // Party deleted successfully
      console.log('Party deleted');
      const parties = await getAllParties();
      renderParties(parties);
    } else {
      console.error('Error deleting party');
    }
  } catch (error) {
    console.error(error);
  }
};

// render a single party by id
const renderSinglePartyById = (party) => {
  const partyDetailsElement = document.createElement('div');
  partyDetailsElement.classList.add('party-details');
  partyDetailsElement.innerHTML = `
    <h2>${party.name}</h2>
    <p>${party.location}</p>
    <p>${party.time}</p>
    <p>${party.description}</p>
    <button class="close-button">Close</button>
  `;
  partyContainer.appendChild(partyDetailsElement);

  // add event listener to close button
  const closeButton = partyDetailsElement.querySelector('.close-button');
  closeButton.addEventListener('click', () => {
    partyDetailsElement.remove();
  });
};

// render all parties
const renderParties = async (parties) => {
  try {
    partyContainer.innerHTML = '';
    parties.forEach((party) => {
      const partyElement = document.createElement('div');
      partyElement.classList.add('party');
      partyElement.innerHTML = `
        <h2>${party.name}</h2>
        <button class="details-button" data-id="${party.id}">See Details</button>
        <button class="delete-button" data-id="${party.id}">Delete</button>
      `;
      partyContainer.appendChild(partyElement);

      // see details
      const detailsButton = partyElement.querySelector('.details-button');
      detailsButton.addEventListener('click', async (event) => {
        const partyId = event.target.dataset.id;
        const partyDetails = await getPartyById(partyId);
        renderSinglePartyById(partyDetails);
      });

      // delete party
      const deleteButton = partyElement.querySelector('.delete-button');
      deleteButton.addEventListener('click', async (event) => {
        const partyId = event.target.dataset.id;
        await deleteParty(partyId);
      });
    });
  } catch (error) {
    console.error(error);
  }
};

// init function
const init = async () => {
  try {
    const parties = await getAllParties();
    await renderParties(parties);
  } catch (error) {
    console.error(error);
  }
};

init();
