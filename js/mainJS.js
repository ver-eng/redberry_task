"use strict";
// const API_TOKEN = "9cfcb369-53f9-4ac7-82e2-272072cee0b3";
const API_URL_REGIONS =
  "https://api.real-estate-manager.redberryinternship.ge/api/regions";
const API_LISTING_URL =
  "https://api.real-estate-manager.redberryinternship.ge/api/real-estates";
const cardBox = document.querySelector(".cards-box");
const regionFilter = document.querySelector(".region-filters");
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
      // console.log(data);
      renderEachCard(data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

  function renderEachCard(data) {
    console.log(data);
    data.forEach((eachListing) => {
      const eachCard = `<div class="each-card">
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
  fetch(API_URL_REGIONS)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
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
