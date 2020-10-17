const cityId = "288"; // Atlanta
const cuisineId = "83"; // Seafood

const headers = new Headers({
  'Content-Type': 'application/json',
  'user-key': 'd75a58b23939cfe8f16d3367916f0564'
});

const SEARCH_API_URL = `https://developers.zomato.com/api/v2.1/search?entity_id=${cityId}&entity_type=city&cuisines=${cuisineId}`;

const searchRequest = new Request(SEARCH_API_URL, {
  headers: headers
});

const restaurants = document.getElementById("restaurants");
const filterButton = document.getElementById('filterSubmit');
const checkElements = document.querySelectorAll('.rating');

const showRandomResults = () => {
  restaurants.innerHTML = "";
  fetch(searchRequest)
    .then(response => response.json())
    .then(data => {
      const restaurantArray = data.restaurants;
      getRestaurantInfo(restaurantArray);
      newRestaurants.forEach((restaurant) => {
        restaurants.innerHTML += generateHTMLForRestaurants(restaurant);
      });
    });
};
showRandomResults();

let newRestaurants = [];
const getRestaurantInfo = (array) => {
  array.forEach(item => {
    const name = item.restaurant.name;
    const address = item.restaurant.location.address;
    const averageCost = item.restaurant.average_cost_for_two;
    const rating = parseFloat(item.restaurant.user_rating.aggregate_rating);
    const image = addImage(item.restaurant.featured_image);
    newRestaurants.push({ name, address, averageCost, rating, image });
  });
}

const addImage = (image) => {
  if (image === '') {
    return ('./img/seafood.jpg');
  } else {
    return image;
  }
}

const generateHTMLForRestaurants = (array) => {
  let restaurantHTML = "";
  restaurantHTML += `<div class="box"><div class="image"><img src=${array.image} alt="Image of seafood"></div>`;
  restaurantHTML += `<h2 class="name">${array.name}</h2>`;
  restaurantHTML += `<p class="address">${array.address}</p>`;
  restaurantHTML += `<div class="info"><p class="cost">Average cost for 2: ${array.averageCost} &#36 </p>`;
  restaurantHTML += `<p class="stars">${array.rating} &#11088</p></div></div>`;
  return restaurantHTML;
};

const sortByCostAsc = () => {
  const sortedArrayAsc = newRestaurants.sort((a, b) => {
    return a.averageCost - b.averageCost;
  });
  console.log(sortedArrayAsc);
  restaurants.innerHTML = "";
  sortedArrayAsc.forEach((restaurant) => {
    restaurants.innerHTML += generateHTMLForRestaurants(restaurant);
  });
};

const sortByCostDesc = () => {
  const sortedArrayDesc = newRestaurants.sort((a, b) => {
    return b.averageCost - a.averageCost;
  });
  console.log(sortedArrayDesc);
  restaurants.innerHTML = "";
  sortedArrayDesc.forEach((restaurant) => {
    restaurants.innerHTML += generateHTMLForRestaurants(restaurant);
  });
};

displayFilteredRestaurants = (array) => {
  let filteredRestaurants = [];
  checkElements.forEach((rating) => {
    if (rating.checked) {
      const partOfFilteredRestaurants = array.filter(item => {
        return Math.round(item.rating) === parseInt(rating.value);
      });
      filteredRestaurants = [...filteredRestaurants, ...partOfFilteredRestaurants];
    }
  })
  return filteredRestaurants;
};

filterButton.addEventListener('click', () => {
  const filteredRestaurants = displayFilteredRestaurants(newRestaurants);
  restaurants.innerHTML = '';
  filteredRestaurants.forEach((restaurant) => {
    restaurants.innerHTML += generateHTMLForRestaurants(restaurant);
  });
})

const reset = () => {
  location.reload();
};
