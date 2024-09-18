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
const uploadedPhotoAgent = document.querySelector(
  ".listing-agent-upload-photo"
);
const deletePhotoBtn = document.querySelector(".listing-delete-image");
const photoDiv = document.querySelector(".listing-photo-input");
const addListingBtn = document.querySelector(".add-listing-btn-below");
const formObj = {};
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
    regexAndotherDetails(regionSelectInput);
  }
}

regionSelectInput.addEventListener("change", function () {
  localStorage.setItem("city_id", "");
  renderCities(dataCities);
});

function renderCities(data) {
  // console.log(dataCities);
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
    if (selectedCity) {
      citySelectInput.value = selectedCity;
      regexAndotherDetails(citySelectInput);
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
    regexAndotherDetails(agentSelect);
  }
}

document
  .querySelector(".listing-cancel-btn")
  .addEventListener("click", function (e) {
    e.preventDefault();
  });

listingForm.addEventListener("input", function (e) {
  if (e.target.name === "image") {
    const file = e.target.files[0];
    console.log(file);
    localStorage.setItem("fileName", file.name);
    localStorage.setItem("fileType", file.type);
    file.length !== 0 ? checkPhotoDetails(file, photoDiv) : "";
    if (file) {
      const reader = new FileReader();

      reader.onloadend = function () {
        const base64String = reader.result;
        localStorage.setItem(e.target.name, base64String);
      };
      reader.readAsDataURL(file);
    }
  } else {
    localStorage.setItem(e.target.name, e.target.value);
    regexAndotherDetails(e.target);
  }
});

function regexAndotherDetails(target) {
  const minTwoSymbolssRegex = /^[\w\s,.'-]{2,}$/;
  const onlyNumbersRegex = /^[0-9]+$/;
  const minFiveWordsRegex = /^(\b\w+\b[\s,.'-]*){5,}$/;
  if (target.name === "address") {
    formObj[`${target.name}`] = checkVaidation(minTwoSymbolssRegex, target);
  } else if (
    target.name === "zip_code" ||
    target.name === "price" ||
    target.name === "area" ||
    target.name === "bedrooms"
  ) {
    formObj[`${target.name}`] = checkVaidation(onlyNumbersRegex, target);
  } else if (target.name === "description") {
    formObj[`${target.name}`] = checkVaidation(minFiveWordsRegex, target);
  } else if (
    target.name === "region_id" ||
    target.name === "city_id" ||
    target.name === "agent_id"
  ) {
    checkVaidationSelect(target.value, target);
  }
}

function checkVaidationSelect(value, eachInput) {
  if (value) {
    eachInput.nextElementSibling.children[0].classList.add("listing-hidden");
    eachInput.nextElementSibling.children[1].classList.remove("listing-hidden");
    eachInput.nextElementSibling.children[2].classList.add("listing-hidden");
    eachInput.nextElementSibling.children[3].style.color = " #45A849";
  } else {
    eachInput.nextElementSibling.children[0].classList.add("listing-hidden");
    eachInput.nextElementSibling.children[1].classList.add("listing-hidden");
    eachInput.nextElementSibling.children[2].classList.remove("listing-hidden");
    eachInput.nextElementSibling.children[3].style.color = "#F93B1D";
  }
}
function checkVaidation(regex, eachInput) {
  if (eachInput.value === "") {
    eachInput.nextElementSibling.children[0].classList.remove("listing-hidden");
    eachInput.nextElementSibling.children[1].classList.add("listing-hidden");
    eachInput.nextElementSibling.children[2].classList.add("listing-hidden");
    eachInput.nextElementSibling.children[3].style.color = "#021526";
  } else if (!regex.test(eachInput.value)) {
    eachInput.nextElementSibling.children[0].classList.add("listing-hidden");
    eachInput.nextElementSibling.children[1].classList.add("listing-hidden");
    eachInput.nextElementSibling.children[2].classList.remove("listing-hidden");
    eachInput.nextElementSibling.children[3].style.color = "#F93B1D";
  } else {
    eachInput.nextElementSibling.children[0].classList.add("listing-hidden");
    eachInput.nextElementSibling.children[1].classList.remove("listing-hidden");
    eachInput.nextElementSibling.children[2].classList.add("listing-hidden");
    eachInput.nextElementSibling.children[3].style.color = " #45A849";
    return eachInput.value;
  }
}
function displayuploadedPhoto(file) {
  const reader = new FileReader();
  reader.onload = function (e) {
    uploadedPhotoAgent.src = e.target.result;
    uploadedPhotoAgent.classList.add("listing-uploaded-photo");
  };
  reader.readAsDataURL(file);
}
deletePhotoBtn.addEventListener("click", function (e) {
  e.stopPropagation();
  e.preventDefault();
  const photo = document.querySelector(".listing-photo-input");
  photo.value = "";
  uploadedPhotoAgent.src = "photos/photo-upload-circle.svg";
  uploadedPhotoAgent.classList.remove("listing-uploaded-photo");
  photo.nextElementSibling.children[0].classList.remove("hidden");
  photo.nextElementSibling.children[1].classList.add("hidden");
  photo.nextElementSibling.children[2].classList.add("hidden");
  photo.nextElementSibling.children[3].style.color = "#021526";
  photo.nextElementSibling.children[3].innerHTML =
    "ატვირთეთ ფოტო შესაბამის ფორმატში, მოცულობით 2MB-მდე";
  deletePhotoBtn.classList.add("listing-hidden");
  localStorage.removeItem("image");
});
function checkPhotoDetails(file, photo) {
  const maxSizeInBytes = 2 * 1024 * 1024;
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/bmp",
    "image/tiff",
    "image/x-icon",
    "image/svg+xml",
    "image/heif",
    "image/heic",
    "image/vnd.adobe.photoshop",
    "image/jxr",
  ];
  if (!allowedTypes.includes(file.type) || file.size > maxSizeInBytes) {
    photo.nextElementSibling.children[0].classList.add("listing-hidden");
    photo.nextElementSibling.children[1].classList.add("listing-hidden");
    photo.nextElementSibling.children[2].classList.remove("listing-hidden");
    photo.nextElementSibling.children[3].style.color = "#F93B1D";
    uploadedPhotoAgent.src = "photos/photo-upload-circle.svg";
    uploadedPhotoAgent.classList.remove("uploaded-photo");
    deletePhotoBtn.classList.add("listing-hidden");
    !allowedTypes.includes(file.type)
      ? (photo.nextElementSibling.children[3].innerHTML =
          "შეარჩიე ფოტოს სწორი ფორმატი")
      : "";

    file.size > maxSizeInBytes
      ? (photo.nextElementSibling.children[3].innerHTML =
          "ფოტო უნდა იყოს 2 MB-ზე ნაკლები")
      : "";
  } else {
    photo.nextElementSibling.children[0].classList.add("listing-hidden");
    photo.nextElementSibling.children[1].classList.remove("listing-hidden");
    photo.nextElementSibling.children[2].classList.add("listing-hidden");
    photo.nextElementSibling.children[3].style.color = "#45A849";
    photo.nextElementSibling.children[3].innerHTML = "მიღებულია";
    displayuploadedPhoto(file);
    deletePhotoBtn.classList.remove("listing-hidden");
    return file;
  }
}
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
      } else if (el.name === "image") {
        const file = returnToFile(savedValue);
        console.log(file);
        checkPhotoDetails(file[0], photoDiv);
        el.files = file;
      } else {
        el.value = savedValue;
        regexAndotherDetails(el);
      }
    }
  });
}
function returnToFile(base64String) {
  const fileName = localStorage.getItem("fileName");
  const fileType = localStorage.getItem("fileType");
  if (base64String) {
    const byteCharacters = atob(base64String.split(",")[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: fileType });
    const file = new File([blob], fileName, { type: fileType });

    // ///////////////
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    return dataTransfer.files;
  }
}

// localStorage.clear();
listingForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(e.target);

  const fileInput = document.querySelector('input[name="image"]');
  const file = fileInput.files[0];
  // console.log(fileInput.files[0]);
  if (file) {
    formData.set("image", file);
  }
  const regionID = Number(
    document.querySelector('select[name="region_id"]').value
  );
  const cityID = Number(document.querySelector('select[name="city_id"]').value);
  const price = Number(document.querySelector('input[name="price"]').value);
  const area = Number(document.querySelector('input[name="area"]').value);
  const bedrooms = Number(
    document.querySelector('input[name="bedrooms"]').value
  );
  const is_rental = document.querySelector('input[name="is_rental"]').value;

  console.log(is_rental);
  formData.set("region_id", regionID);
  formData.set("city_id", cityID);
  formData.set("price", price);
  formData.set("area", area);
  formData.set("bedrooms", bedrooms);
  // Log FormData entries (for demonstration purposes)
  for (let [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
    console.log(`${key}: ${typeof value}`);
  }
  console.log();
});

// is_rental problemmuria, sul 0 values madzlevs
