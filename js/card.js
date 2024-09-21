let url = new URL(window.location.href);
let params = new URLSearchParams(url.search);
let cardId = params.get("card_id"); // 'chrome-instant'
const API_TOKEN = "9cfcb369-53f9-4ac7-82e2-272072cee0b3";
const API_URL =
  "https://api.real-estate-manager.redberryinternship.ge/api/real-estates";

function renderRegionCards(data) {
  const dataId = data.filter((each) => each.id == cardId);
  const regionId = dataId[0].city.region.id;
  const sameRegionCards = data.filter(
    (each) => each.city.region.id == regionId
  );
  renderEachCard(sameRegionCards);

  return sameRegionCards;
}

fetch(API_URL, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_TOKEN}`,
  },
})
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    const allCards = renderRegionCards(data);

    const allCardsCount = allCards.length;

    if (allCardsCount === 0) {
      const noCardsDiv = document.querySelector(".no-cards");
      noCardsDiv.style.display = "block";
    }

    if (allCardsCount <= 4) {
      const rightClick = document.querySelector(".right-click");
      rightClick.style.opacity = "0.5";
      rightClick.style.pointerEvents = "none";

      const leftClick = document.querySelector(".left-click");
      leftClick.style.opacity = "0.5";
      leftClick.style.pointerEvents = "none";
    }
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

const sameRegionDiv = document.querySelector(".slider-container");
let currentIndex = 0;
let totalCards = 0;

function renderEachCard(data) {
  sameRegionDiv.innerHTML = "";
  data.forEach((eachListing) => {
    const eachCard = `<div class="each-card">
      <div class="top-part">
        <div class="is_rental">
          <span class="is_rental-span">${
            eachListing.is_rental == 0 ? "იყიდება" : "ქირავდება"
          }</span>
        </div>
        <div class="image-div">
          <img src="${
            eachListing.image
          }" alt="The photo of the flat" class="image" />
        </div>
      </div>
      <div class="bottom-info-div">
        <div class="price-div">
          <span class="price-span">${eachListing.price} ₾</span>
        </div>
        <div class="address-div">
          <img src="photos/location-marker.svg" alt="location marker" class="location-icon" />
          <span class="city-span">${eachListing.city.name}, ${
      eachListing.address
    }</span>
        </div>
        <div class="rest-info-div">
          <div class="bed-num-div rest-info-each">
            <img src="photos/bed.svg" class="bed-icon all-three-icons" /><span class="bedroom-num all-three-span">${
              eachListing.bedrooms
            }</span>
          </div>
          <div class="area-div rest-info-each">
            <img src="photos/area.svg" class="area-icon all-three-icons" /><span class="area-num all-three-span">${
              eachListing.area
            } მ²</span>
          </div>
          <div class="zip-div rest-info-each">
            <img src="photos/zipcode.svg" class="zip-icon all-three-icons" /><span class="zip-num all-three-span">${
              eachListing.zip_code
            }</span>
          </div>
        </div>
      </div>
    </div>`;
    sameRegionDiv.innerHTML += eachCard;
  });

  totalCards = data.length;

  const cards = sameRegionDiv.innerHTML;
  sameRegionDiv.innerHTML += cards;

  initializeSlider(totalCards);
}

function initializeSlider(totalCards) {
  const cardsToShow = 4;
  const cardWidth = document.querySelector(".each-card").offsetWidth;
  const totalCardsLength = totalCards * 2;

  document.querySelector(".right-click").addEventListener("click", () => {
    currentIndex++;
    updateSlider(cardWidth, totalCardsLength);

    if (currentIndex === totalCards) {
      setTimeout(() => {
        sameRegionDiv.style.transition = "none";
        currentIndex = 0;
        updateSlider(cardWidth, totalCardsLength);
        setTimeout(() => {
          sameRegionDiv.style.transition = "transform 0.5s ease-in-out";
        }, 50);
      }, 500);
    }
  });

  document.querySelector(".left-click").addEventListener("click", () => {
    currentIndex--;
    updateSlider(cardWidth, totalCardsLength);

    if (currentIndex < 0) {
      setTimeout(() => {
        sameRegionDiv.style.transition = "none";
        currentIndex = totalCards - 1;
        updateSlider(cardWidth, totalCardsLength);
        setTimeout(() => {
          sameRegionDiv.style.transition = "transform 0.5s ease-in-out";
        }, 50);
      }, 500);
    }
  });
}

function updateSlider(cardWidth, totalCardsLength) {
  const transformValue = -(currentIndex * cardWidth);
  sameRegionDiv.style.transform = `translateX(${transformValue}px)`;
}
