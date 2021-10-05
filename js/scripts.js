let pokemonRepository = (function () {
  //create pokemon list
  // let pokemonList = [
  //   {name: "Kakuna", height: 0.6, type: ["bug", "poison"]},
  //   {name: "Gloom", height: 0.8, type: ["grass", "poison"]},
  //   {name: "Golem", height: 1.4, type: ["rock","ground"]}
  // ];

  let pokemonList = []; //create an empty array for pokemonList
  let apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150"; //url to fetch the data from API

  //Add item function to the pokemonList array
  function add(pokemon) {
    if(
      typeof pokemon === "object" &&
      "name" in pokemon
    ){
      pokemonList.push(pokemon);
    }else{
      console.log("pokemon is not correct");
    }
  }
  //return item function
  function getAll() {
    return pokemonList;
  }

  function addListItem(pokemon){
    let pokeList = document.querySelector(".pokemon-list"); //select pokemon-list class from html
    let listItem = document.createElement("li"); // create list items

    let button = document.createElement("button"); // create button
    button.innerText = pokemon.name; //add pokemon name from the pokemonList to each button
    button.classList.add("button1"); //add button styles
    button.addEventListener('click', function(){ //add event to button
      showDetails(pokemon);
    });

    listItem.appendChild(button);
    pokeList.appendChild(listItem);
  }

  //create function to show clicked pokemon's details
  function showDetails(pokemon) {
    loadDetails(pokemon).then(function () {
      showModal(pokemon);
    });
  }

  //show modal function
  let modalContainer = document.querySelector('#modal-container');

  function showModal(pokemon) {
    modalContainer.innerHTML = '';
    let modal = document.createElement('div');
    modal.classList.add('modal');

    //create close button for the modal
    let closeButtonElement = document.createElement('button');
    closeButtonElement.classList.add('modal-close');
    closeButtonElement.innerText = 'Close';
    closeButtonElement.addEventListener('click', hideModal);

    let titleElement = document.createElement('h1'); //Title for the pop-up pokemon window
    titleElement.innerText = pokemon.name;

    let heightElement = document.createElement('p');
    heightElement.innerText = 'Height:' + pokemon.height;

    // created an array to store the pokemon type objects.
    let pokemonTypes = [];
    Object.keys(pokemon.types).forEach((key) => {
      pokemonTypes.push(pokemon.types[key].type.name);
    });

    let typesElement = document.createElement('p');
    typesElement.innerText = 'Types: ' + pokemonTypes;

    let imageElement = document.createElement('img');
    imageElement.classList.add('pokeImage');
    imageElement.src = pokemon.imageUrl;

    modal.appendChild(closeButtonElement);
    modal.appendChild(titleElement);
    modal.appendChild(heightElement);
    modal.appendChild(typesElement);
    modal.appendChild(imageElement);
    modalContainer.appendChild(modal);

    modalContainer.classList.add('is-visible');
  }

//function for hiding the madal
  function hideModal() {
    modalContainer.classList.remove('is-visible');
  }

//hide the modal when press Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
      hideModal();
    }
  });

  //hide the modal when click outside the modal container
  modalContainer.addEventListener('click', (e) => {
    // Since this is also triggered when clicking INSIDE the modal
    // We only want to close if the user clicks directly on the overlay
    let target = e.target;
    if (target === modalContainer) {
      hideModal();
    }
  });

  // create load function to fetch data fron API
  function loadList() {
    return fetch(apiUrl).then(function (response) {
      return response.json();
    }).then(function (json) {
      json.results.forEach(function (item) {
        let pokemon = {
          name: item.name,
          detailsUrl: item.url
        };
        add(pokemon);
      });
    }).catch(function (e) {
      console.error(e);
    })
  }

  //create load detals function
  function loadDetails(item) {
    let url = item.detailsUrl;
    return fetch(url).then(function (response) {
      return response.json();
    }).then(function (details) {
      // Now we add the details to the item
      item.imageUrl = details.sprites.front_default;
      item.height = details.height;
      item.types = details.types;
    }).catch(function (e) {
      console.error(e);
    });
  }

  //return values
  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    showDetails: showDetails,
    loadList: loadList,
    loadDetails: loadDetails
  };
})();

//try adding a pokemon on the list
// console.log(pokemonRepository.getAll());
// pokemonRepository.add({name:"Seal", height:1.1, type:["water"]});
// console.log(pokemonRepository.getAll());

// create forEach function to printout the list
pokemonRepository.loadList().then(function(){
  pokemonRepository.getAll().forEach(function(pokemon){
    pokemonRepository.addListItem(pokemon);
  });
});
