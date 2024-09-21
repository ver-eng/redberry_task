"use strict";
// const API_TOKEN = "9cfcb369-53f9-4ac7-82e2-272072cee0b3";
const API_URL_REGIONS =
  "https://api.real-estate-manager.redberryinternship.ge/api/regions";
const API_LISTING_URL =
  "https://api.real-estate-manager.redberryinternship.ge/api/real-estates";
const cardBox = document.querySelector(".cards-box");
const regionFilter = document.querySelector(".region-filters");
let clonedData;
document.addEventListener("DOMContentLoaded", function () {
  fetch(
    "https://api.real-estate-manager.redberryinternship.ge/api/real-estates",
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
      clonedData = JSON.parse(JSON.stringify(data));

      renderEachCard(data);

      const cards = document.querySelectorAll(".each-card");

      cards.forEach((card) => {
        card.addEventListener("click", function () {
          const id = card.getAttribute("id").split("-");

          window.location.href = "/card.html?card_id=" + id[1];
        });
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

  fetch(API_URL_REGIONS)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      renderRegionFilter(data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
  function renderRegionFilter(data) {
    data.forEach((region) => {
      const checkBox = `<div>
                  <input
                    type="checkbox"
                    name="filter_region"
                    id="${region.name}"
                    value="${region.id}"
                    class="filter_input"
                  /><label for="${region.name}" class="filter-label">${region.name}</label>
                </div>`;
      regionFilter.innerHTML += checkBox;
    });
  }
});

function renderEachCard(data) {
  cardBox.innerHTML = "";
  data.forEach((eachListing, i) => {
    const eachCard = `<div class="each-card" id="card-${eachListing.id}">
        <div class="top-part">
          <div class="is_rental">
            <span class="is_rental-span">${
              eachListing.is_rental == 0 ? "იყიდება" : "ქირავდება"
            }</span>
          </div>
          <div class="image-div">
            <img
              src="${eachListing.image}"
              alt="The photo of the flat"
              class="image"
            />
          </div>
        </div>
        <div class="bottom-info-div">
          <div class="price-div">
            <span class="price-span">${eachListing.price} ₾</span>
          </div>
          <div class="address-div">
            <img
              src="photos/location-marker.svg"
              alt="location marker"
              class="location-icon"
            />
            <span class="city-span">${eachListing.city.name}, ${
      eachListing.address
    }</span>
          </div>
          <div class="rest-info-div">
            <div class="bed-num-div rest-info-each">
              <img
                src="photos/bed.svg"
                class="bed-icon all-three-icons"
              /><span class="bedroom-num all-three-span">${
                eachListing.bedrooms
              }</span>
            </div>
            <div class="area-div rest-info-each">
              <img
                src="photos/area.svg"
                class="area-icon all-three-icons"
              /><span class="area-num all-three-span">${
                eachListing.area
              } მ&#178;</span>
            </div>
            <div class="zip-div rest-info-each">
              <img
                src="photos/zipcode.svg"
                class="zip-icon all-three-icons"
              /><span class="zip-num all-three-span">${
                eachListing.zip_code
              }</span>
            </div>
          </div>
        </div>
      </div>`;
    cardBox.innerHTML += eachCard;
  });
}
const eachFilterBtn = document.querySelectorAll(".each-filter-heading-div");
const allFilterBoxes = document.querySelectorAll(".filter-hidden-div");
const arrDown = document.querySelectorAll(".arrow-down");

eachFilterBtn.forEach((eachBtn) => {
  eachBtn.addEventListener("click", function () {
    allFilterBoxes.forEach((eachBox) => {
      if (eachBtn.nextElementSibling !== eachBox) {
        eachBox.classList.add("hidden");
      }
    });
    arrDown.forEach((eachArr) => {
      if (eachBtn.children[1] !== eachArr) {
        eachArr.classList.remove("arrow-up");
      }
    });
    eachBtn.nextElementSibling.classList.toggle("hidden");
    eachBtn.children[1].classList.toggle("arrow-up");
  });
});

const minPriceInput = document.getElementById("min-price");
const maxPriceInput = document.getElementById("max-price");
const errorMsg = document.querySelector(".price-err-msg");
const priceChooseBtn = document.querySelector(".price-choose-btn");

document.querySelectorAll(".min-price-btn").forEach((button) => {
  button.addEventListener("click", () => {
    minPriceInput.value = button.getAttribute("data-min");
    validatePriceRange();
  });
});

document.querySelectorAll(".max-price-btn").forEach((button) => {
  button.addEventListener("click", () => {
    maxPriceInput.value = button.getAttribute("data-max");
    validatePriceRange();
  });
});
let minimumPrice;
let maximumPrice;
function validatePriceRange() {
  const minPrice = parseInt(minPriceInput.value.replace(/[^\d]/g, ""), 10) || 0;
  const maxPrice = parseInt(maxPriceInput.value.replace(/[^\d]/g, ""), 10) || 0;

  if (minPrice > maxPrice && maxPrice !== 0) {
    errorMsg.classList.remove("hidden");
    minPriceInput.classList.add("mgs-err-color");
    maxPriceInput.classList.add("mgs-err-color");
    return 0;
  } else if (minPriceInput.value === "" && maxPriceInput.value === "") {
    minimumPrice = 0;
    maximumPrice = 0;
    return { minPrice, maxPrice };
  } else {
    errorMsg.classList.add("hidden");
    minPriceInput.classList.remove("mgs-err-color");
    maxPriceInput.classList.remove("mgs-err-color");
    minimumPrice = minPrice;
    maximumPrice = maxPrice;
    return { minPrice, maxPrice };
  }
}

minPriceInput.addEventListener("input", validatePriceRange);
maxPriceInput.addEventListener("input", validatePriceRange);

priceChooseBtn.addEventListener("click", function () {
  const isValid = validatePriceRange();

  if (isValid) {
    priceChooseBtn.parentElement.parentElement.classList.add("hidden");
    priceChooseBtn.parentElement.parentElement.previousElementSibling.children[1].classList.remove(
      "arrow-up"
    );
    addFilterNames();
    clearPriceValues();
    FilterdataWithEverything();
  }
});
const filterNamesDiv = document.querySelector(".filter-names-div");
// const eachName = document.querySelector(".each-name");
function addFilterNames() {
  if ((minimumPrice === 0) & (maximumPrice === 0)) {
    return;
  } else {
    const filtName = `<div class="each-name">
    <span class="each-filter-name">${minimumPrice == 0 ? 0 : minimumPrice}₾-${
      maximumPrice === 0 ? "+" : maximumPrice
    }₾</span>
    <button class="filter-x-btn">
      <img src="photos/x.svg" class="filter-x" />
    </button>
  </div>`;

    filterNamesDiv.innerHTML += filtName;
  }
}
function clearPriceValues() {
  minPriceInput.value = "";
  maxPriceInput.value = "";
}
// ////////////////////////////////////////////////////////////////////
const areaDiv = document.querySelector(".area-div");
const minAreaInput = document.getElementById("min-area");
const maxAreaInput = document.getElementById("max-area");
const areaErrorMsg = document.querySelector(".area-err-msg");
let minimumArea;
let maximumArea;
function validateAreaInput() {
  const minArea = parseFloat(minAreaInput.value) || 0;
  const maxArea = parseFloat(maxAreaInput.value) || 0;

  minimumArea = minArea;
  maximumArea = maxArea;
  if (minArea && maxArea && minArea > maxArea) {
    areaErrorMsg.classList.remove("hidden");
    minAreaInput.classList.add("mgs-err-color");
    maxAreaInput.classList.add("mgs-err-color");
    return 0;
  } else {
    areaErrorMsg.classList.add("hidden");
    minAreaInput.classList.remove("mgs-err-color");
    maxAreaInput.classList.remove("mgs-err-color");

    return 1;
  }
}

const minAreaButtons = document.querySelectorAll(".min-area-span");
const maxAreaButtons = document.querySelectorAll(".max-area-span");

minAreaButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    const minValue = e.target.getAttribute("data-min");
    minAreaInput.value = minValue;
    validateAreaInput();
  });
});

maxAreaButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    const maxValue = e.target.getAttribute("data-max");
    maxAreaInput.value = maxValue;
    validateAreaInput();
  });
});

minAreaInput.addEventListener("input", validateAreaInput);
maxAreaInput.addEventListener("input", validateAreaInput);

const areaChooseBtn = document.querySelector(".area-choose-btn");
areaChooseBtn.addEventListener("click", function () {
  const isValidated = validateAreaInput();
  if (isValidated) {
    addFilterNamesArea();
    areaChooseBtn.parentElement.parentElement.classList.add("hidden");
    clearAreaValues();
    areaChooseBtn.parentElement.parentElement.previousElementSibling.children[1].classList.remove(
      "arrow-up"
    );
    FilterdataWithEverything();
  }
});

function addFilterNamesArea() {
  console.log("redone");
  console.log(minimumArea);
  console.log(maximumArea);
  console.log(areaDiv);

  areaDiv.innerHTML = "";
  console.log(areaDiv);
  if ((minimumArea === 0) & (maximumArea === 0)) {
    console.log("returned");
    return;
  } else {
    console.log("changed");
    console.log(minimumArea);
    console.log(maximumArea);
    const filtName = `<div class="each-name">
    <span class="each-filter-name">${minimumArea == 0 ? 0 : minimumArea}მ² - ${
      maximumArea === 0 ? "+" : maximumArea
    }მ²</span>
    <button class="filter-x-btn">
      <img src="photos/x.svg" class="filter-x" />
    </button>
  </div>`;

    areaDiv.innerHTML += filtName;
  }
}

function clearAreaValues() {
  minAreaInput.value = "";
  maxAreaInput.value = "";
}

// ////////////////////////////////////////////////////////////////////
let selectedRegions = [];
let selectedRegionsNames = [];

document
  .querySelector(".region-choose-btn")
  .addEventListener("click", function (e) {
    const checkedRegions = document.querySelectorAll(
      ".region-filters input[type='checkbox']:checked"
    );

    checkedRegions.forEach((checkbox) => {
      if (!selectedRegionsNames.includes(checkbox.id)) {
        selectedRegionsNames.unshift(checkbox.id),
          addRegionFilterNames(checkbox.id);
      }
      if (!selectedRegions.includes(checkbox.value)) {
        selectedRegions.unshift(Number(checkbox.value));
      }
    });
    e.target.parentElement.parentElement.classList.add("hidden");
    e.target.parentElement.parentElement.previousElementSibling.children[1].classList.remove(
      "arrow-up"
    );
    clearRegions();
    FilterdataWithEverything();
  });
function addRegionFilterNames(region) {
  const filtName = `<div class="each-name">
    <span class="each-filter-name">${region}</span>
    <button class="filter-x-btn">
      <img src="photos/x.svg" class="filter-x" />
    </button>
  </div>`;

  filterNamesDiv.innerHTML += filtName;
}

function clearRegions() {
  const checkedRegions = document.querySelectorAll(
    ".region-filters input[type='checkbox']:checked"
  );
  checkedRegions.forEach((eachReg) => (eachReg.checked = false));
}

// //////////////////////////////////////////////////////////
let bedroomNum = [];
document
  .querySelector(".bedroom-num-input")
  .addEventListener("input", function () {
    validateBedroomInput();
  });

function validateBedroomInput() {
  const errorMsg = document.querySelector(".bedroom-err-msg");
  const bedroomInput = document.getElementById("bedroom-num");
  const bedroomValue = Number(bedroomInput.value);

  if (bedroomValue < 0 || isNaN(bedroomValue)) {
    errorMsg.classList.remove("hidden");
    bedroomInput.classList.add("mgs-err-color");
    return 0;
  } else {
    errorMsg.classList.add("hidden");
    bedroomInput.classList.remove("mgs-err-color");
    return 1;
  }
}
document
  .querySelector(".bedroom-choose-btn")
  .addEventListener("click", function () {
    const bedroomInput = document.getElementById("bedroom-num");
    let roomNums = Number(bedroomInput.value);
    const isValid = validateBedroomInput();
    if (isValid) {
      if (roomNums !== 0 && !bedroomNum.includes(roomNums)) {
        addBedroomFilterName();
        bedroomNum.push(Number(roomNums));
        FilterdataWithEverything();
      }
      bedroomInput.parentElement.classList.add("hidden");
      bedroomInput.value = "";
    }
  });
function addBedroomFilterName() {
  const bedroomInput = document.getElementById("bedroom-num");
  const filtName = `<div class="each-name">
    <span class="each-filter-name">${bedroomInput.value}</span>
    <button class="filter-x-btn">
      <img src="photos/x.svg" class="filter-x" />
    </button>
  </div>`;

  filterNamesDiv.innerHTML += filtName;
}

function FilterdataWithEverything() {
  // console.log(selectedRegions);
  // console.log(clonedData);
  // console.log(minimumArea);
  // console.log(maximumArea);

  const newData = clonedData.filter((eachData) => {
    return (
      bedroomNum.includes(eachData.bedrooms) ||
      selectedRegions.includes(eachData.city.region_id)
    );
  });

  renderEachCard(newData);
  const cards = document.querySelectorAll(".each-card");

  cards.forEach((card) => {
    card.addEventListener("click", function () {
      const id = card.getAttribute("id").split("-");

      window.location.href = "/card.html?card_id=" + id[1];
    });
  });
}
