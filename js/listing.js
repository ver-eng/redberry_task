"use strict";

const API_URL_REGIONS =
  "https://api.real-estate-manager.redberryinternship.ge/api/regions";

const API_URL_CITIES =
  "https://api.real-estate-manager.redberryinternship.ge/api/cities";

const API_AGENTS =
  "https://api.real-estate-manager.redberryinternship.ge/api/agents";
const API_TOKEN = "9cfcb369-53f9-4ac7-82e2-272072cee0b3";
const regionSelectInput = document.querySelector(".region-input-select");
const citySelectInput = document.querySelector(".city-input-select");
const agentSelect = document.querySelector(".listing-agent-input-select");
const listingForm = document.querySelector(".listing-form");
let dataRegions;
let dataCities;
let dataAgent;

document.addEventListener("DOMContentLoaded", function () {
  loadFormData();
});
fetch(API_URL_REGIONS)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    renderRegions(data);
    fetch(API_URL_CITIES)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        dataCities = [...data];
        renderCities(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

function renderRegions(data) {
  data.forEach((eachRegion) => {
    const eachOptionRegion = `<option value="${eachRegion.id}" class="each-region-option">
                      ${eachRegion.name}
                    </option>`;
    regionSelectInput.innerHTML += eachOptionRegion;
  });
  const selectedRegion = localStorage.getItem("region_id");
  if (selectedRegion) {
    regionSelectInput.value = selectedRegion;
  }
}

regionSelectInput.addEventListener("change", function () {
  localStorage.setItem("city_id", "");
  renderCities(dataCities);
});

function renderCities(data) {
  console.log(dataCities);
  const region_ID = Number(regionSelectInput.value);
  citySelectInput.innerHTML = `<option value="" class="each-city-option">
                      აირჩიე ქალაქი
                    </option>`;
  if (region_ID !== 0) {
    citySelectInput.disabled = false;
    data.forEach((eachCity) => {
      if (eachCity.region_id === region_ID) {
        const renderCity = `<option value="${eachCity.id}" class="each-city-option">
                      ${eachCity.name}
                    </option>`;
        citySelectInput.innerHTML += renderCity;
      }
    });
    const selectedCity = localStorage.getItem("city_id");
    console.log(selectedCity);
    if (selectedCity) {
      citySelectInput.value = selectedCity;
    }
  } else {
    citySelectInput.disabled = true;
  }
}

// });
fetch(API_AGENTS, {
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
    // console.log(data);
    dataAgent = [...data];
    addAgentListing(data);
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });
function addAgentListing(data) {
  data.forEach((each) => {
    const eachAgent = `<option value="${each.id}" class="each-agent-option">
    ${each.name} ${each.surname}
  </option>`;

    agentSelect.innerHTML += eachAgent;
  });
  const selectedAgent = localStorage.getItem("agent_id");
  if (selectedAgent) {
    agentSelect.value = selectedAgent;
  }
}

document
  .querySelector(".listing-cancel-btn")
  .addEventListener("click", function (e) {
    e.preventDefault();
  });
listingForm.addEventListener("input", function (e) {
  localStorage.setItem(e.target.name, e.target.value);
});

function loadFormData() {
  const inputs = document.querySelectorAll(
    "#submitListingForm input,#submitListingForm select, #submitListingForm textarea"
  );
  inputs.forEach((el) => {
    const savedValue = localStorage.getItem(el.name);
    if (savedValue !== null) {
      if (el.name === "is_rental" && Number(savedValue) === 1) {
        if (el.id === "rent") {
          el.checked = true;
        }
      } else if (el.name === "is_rental" && Number(savedValue) === 0) {
        if (el.id === "buy") {
          el.checked = true;
        }
      } else {
        console.log(el);
        el.value = savedValue;
      }
    }
  });
}
