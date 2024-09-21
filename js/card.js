let url = new URL(window.location.href);
let params = new URLSearchParams(url.search);
let cardId = params.get("card_id"); // 'chrome-instant'
console.log(cardId);
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

// ////////////////////////////////////////////////////////////////////////////

fetch(
  `https://api.real-estate-manager.redberryinternship.ge/api/real-estates/${cardId}`,
  {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_TOKEN}`,
    },
  }
)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    console.log(data);
    renderClickedCard(data);
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });
const cardDiv = document.querySelector(".card-div");
function renderClickedCard(data) {
  const date = new Date(data.created_at);
  const formattedDate = `${String(date.getDate()).padStart(2, "0")}/${String(
    date.getMonth() + 1
  ).padStart(2, "0")}/${date.getFullYear()}`;
  const carrdInfo = `<div class="main-info-div">
        <div class="left-photo-div">
          <p class="is_rental-on-photo">${
            data.is_rental == 0 ? "იყიდება" : "ქირავდება"
          }</p>
          <div class="image-div">
            <img src="${data.image}" class="main-img" />
          </div>
          <p class="publish-date">გამოქვეყნების თარიღი ${formattedDate}</p>
        </div>
        <div class="right-photo-div">
          <div class="bottom-info-div-other">
            <div class="price-div">
              <span class="price-span">${data.price} ₾</span>
            </div>
            <div class="address-div">
              <img
                src="photos/location-marker.svg"
                alt="location marker"
                class="location-icon"
              />
              <span class="city-span">${data.city.name}, ${data.address}</span>
            </div>
            <div class="rest-info-div">
              <div class="bed-num-div rest-info-each">
                <img
                  src="photos/bed.svg"
                  class="bed-icon all-three-icons"
                /><span class="bedroom-num all-three-span city-span">
                  ფართი ${data.area} მ²;</span
                >
              </div>
              <div class="area-div rest-info-each">
                <img
                  src="photos/area.svg"
                  class="area-icon all-three-icons"
                /><span class="area-num all-three-span city-span">
                  საძინებელი ${data.bedrooms}</span
                >
              </div>
              <div class="zip-div rest-info-each">
                <img
                  src="photos/zipcode.svg"
                  class="zip-icon all-three-icons"
                /><span class="zip-num all-three-span city-span">
                  საფოსტო ინდექსი ${data.zip_code}</span
                >
              </div>
            </div>
          </div>
          <div class="description">
            <p class="description-para">
              ${data.description}
            </p>
          </div>
          <div class="agent-info-div">
            <div class="agent-photo-and-next">
              <img src="photos/agent-photo.png" class="agent-photo" />
              <div class="other-info">
                <p class="name-lastname">${data.agent.name} ${
    data.agent.surname
  }</p>
                <p class="agenti">აგენტი</p>
              </div>
            </div>
            <div>
              <div class="email">
                <img src="photos/email-icon.svg" class="img-photos-icon" /><span
                  class="email-text"
                  >${data.agent.email}</span
                >
              </div>
              <div class="phone-num">
                <img src="photos/phone-num.svg" class="img-photos-icon" /><span
                  class="email-text"
                  >${data.agent.phone}</span
                >
              </div>
            </div>
          </div>
          <button class="listing-delete-btn">ლისტინგის წაშლა</button>
        </div>
      </div>`;
  cardDiv.innerHTML = carrdInfo;
  deleteListingfunction(data.id);
}

document.querySelector(".go-back-btn").addEventListener("click", function () {
  window.location = "index.html";
});
const overlay = document.querySelector(".overlay");
const deleteListing = document.querySelector(".delete-listing");
const cancelBtn = document.querySelector(".cancelBtn");
const approveBtn = document.querySelector(".approveBtn");
function deleteListingfunction(id) {
  document
    .querySelector(".listing-delete-btn")
    .addEventListener("click", function () {
      overlay.classList.remove("hidden");
      deleteListing.classList.remove("hidden");
    });
}

cancelBtn.addEventListener("click", function () {
  overlay.classList.add("hidden");
  deleteListing.classList.add("hidden");
});
approveBtn.addEventListener("click", function () {
  fetch(
    `https://api.real-estate-manager.redberryinternship.ge/api/real-estates/${cardId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Data deleted successfully:", data);
      window.location = "index.html";
    })
    .catch((error) => {
      console.error("Error deleting data:", error);
    });
});
