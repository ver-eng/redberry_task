"use strict";
const agentInformaion = {
  firstName: "",
  lastName: "",
  emailAddress: "",
  phoneNumber: "",
  image: {},
};
const API_TOKEN = "9cfcb369-53f9-4ac7-82e2-272072cee0b3";
const apiUrlRealEstate =
  "https://api.real-estate-manager.redberryinternship.ge/api/real-estates";
const apiURLAgents =
  "https://api.real-estate-manager.redberryinternship.ge/api/agents";
const apiURLAgentsPOST =
  "https://api.real-estate-manager.redberryinternship.ge/api/agents";

fetch(apiURLAgents, {
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
    console.log(data);
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

const addNewAgentBtn = document.querySelector(".add-agent-btn");
const AgentForm = document.querySelector(".modal-form");
const uploadedPhotoAgent = document.querySelector(".agent-upload-photo");
const deletePhotoBtn = document.querySelector(".delete-image");
const addAgentBtnInForm = document.querySelector(".add-agent-btn-below");
const sectionTwo = document.querySelector(".section-two");
const overlay = document.querySelector(".overlay");

addNewAgentBtn.addEventListener("click", function () {
  sectionTwo.classList.remove("hidden");
  overlay.classList.remove("hidden");
});
AgentForm.addEventListener("input", function () {
  const firstName = document.querySelector(".first-name-input");
  const lastName = document.querySelector(".last-name-input");
  const email = document.querySelector(".email-input");
  const phoneNum = document.querySelector(".phone-num-input");
  const photo = document.querySelector(".photo-input");

  const nameAndLastNameRegex = /^\p{L}{2,}$/u;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@redberry\.ge$/;
  const phoneNumRegex = /^5\d{8}$/;
  agentInformaion.firstName = checkVaidation(nameAndLastNameRegex, firstName);
  agentInformaion.lastName = checkVaidation(nameAndLastNameRegex, lastName);
  agentInformaion.emailAddress = checkVaidation(emailRegex, email);
  agentInformaion.phoneNumber = checkVaidation(phoneNumRegex, phoneNum);
  photo.files.length !== 0
    ? (agentInformaion.image = checkPhotoDetails(photo))
    : "";
});

function checkPhotoDetails(photo) {
  const file = photo.files[0];
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
    photo.nextElementSibling.children[0].classList.add("hidden");
    photo.nextElementSibling.children[1].classList.add("hidden");
    photo.nextElementSibling.children[2].classList.remove("hidden");
    photo.nextElementSibling.children[3].style.color = "#F93B1D";
    uploadedPhotoAgent.src = "photos/photo-upload-circle.svg";
    uploadedPhotoAgent.classList.remove("uploaded-photo");
    deletePhotoBtn.classList.add("hidden");
    !allowedTypes.includes(file.type)
      ? (photo.nextElementSibling.children[3].innerHTML =
          "შეარჩიე ფოტოს სწორი ფორმატი")
      : "";

    file.size > maxSizeInBytes
      ? (photo.nextElementSibling.children[3].innerHTML =
          "ფოტო უნდა იყოს 2 MB-ზე ნაკლები")
      : "";
  } else {
    photo.nextElementSibling.children[0].classList.add("hidden");
    photo.nextElementSibling.children[1].classList.remove("hidden");
    photo.nextElementSibling.children[2].classList.add("hidden");
    photo.nextElementSibling.children[3].style.color = "#45A849";
    photo.nextElementSibling.children[3].innerHTML = "მიღებულია";
    displayuploadedPhoto(file);
    deletePhotoBtn.classList.remove("hidden");
    return file;
  }
}
deletePhotoBtn.addEventListener("click", function (e) {
  e.stopPropagation();
  e.preventDefault();
  const photo = document.querySelector(".photo-input");
  photo.value = "";
  uploadedPhotoAgent.src = "photos/photo-upload-circle.svg";
  uploadedPhotoAgent.classList.remove("uploaded-photo");
  photo.nextElementSibling.children[0].classList.remove("hidden");
  photo.nextElementSibling.children[1].classList.add("hidden");
  photo.nextElementSibling.children[2].classList.add("hidden");
  photo.nextElementSibling.children[3].style.color = "#021526";
  photo.nextElementSibling.children[3].innerHTML =
    "ატვირთეთ ფოტო შესაბამის ფორმატში, მოცულობით 2MB-მდე";
  agentInformaion.image = {};
  deletePhotoBtn.classList.add("hidden");
});
function displayuploadedPhoto(file) {
  const reader = new FileReader();
  reader.onload = function (e) {
    uploadedPhotoAgent.src = e.target.result;
    uploadedPhotoAgent.classList.add("uploaded-photo");
  };
  reader.readAsDataURL(file);
}
function checkVaidation(regex, eachInput) {
  if (eachInput.value === "") {
    eachInput.nextElementSibling.children[0].classList.remove("hidden");
    eachInput.nextElementSibling.children[1].classList.add("hidden");
    eachInput.nextElementSibling.children[2].classList.add("hidden");
    eachInput.nextElementSibling.children[3].style.color = "#021526";
  } else if (!regex.test(eachInput.value)) {
    eachInput.nextElementSibling.children[0].classList.add("hidden");
    eachInput.nextElementSibling.children[1].classList.add("hidden");
    eachInput.nextElementSibling.children[2].classList.remove("hidden");
    eachInput.nextElementSibling.children[3].style.color = "#F93B1D";
  } else {
    eachInput.nextElementSibling.children[0].classList.add("hidden");
    eachInput.nextElementSibling.children[1].classList.remove("hidden");
    eachInput.nextElementSibling.children[2].classList.add("hidden");
    eachInput.nextElementSibling.children[3].style.color = " #45A849";
    return eachInput.value;
  }
}
addAgentBtnInForm.addEventListener("click", function () {
  document.querySelectorAll(".first-four-inputs").forEach((eachInput) => {
    if (eachInput.value === "") {
      eachInput.nextElementSibling.children[0].classList.add("hidden");
      eachInput.nextElementSibling.children[1].classList.add("hidden");
      eachInput.nextElementSibling.children[2].classList.remove("hidden");
      eachInput.nextElementSibling.children[3].style.color = "#F93B1D";
    }
  });
});
AgentForm.addEventListener("submit", function (e) {
  e.preventDefault();
  document.querySelectorAll(".first-four-inputs").forEach((eachInput) => {
    if (eachInput.value === "") {
    }
  });

  const formData = new FormData();
  formData.append("name", document.querySelector('input[name="name"]').value);

  formData.append(
    "surname",
    document.querySelector('input[name="surname"]').value
  );
  formData.append("email", document.querySelector('input[name="email"]').value);
  formData.append("phone", document.querySelector('input[name="phone"]').value);

  const photoInput = document.querySelector(".photo-input");
  const file = photoInput.files[0];

  if (file) {
    formData.append("avatar", file, file.name);
    sendAgentDataFunction(formData);
    clearForm();
  } else {
    console.log("no file");
  }
});

function sendAgentDataFunction(formData) {
  fetch("https://api.real-estate-manager.redberryinternship.ge/api/agents", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      // "Content-Type": "multipart/form-data",
      // Accept: "application/json", // Specify JSON content type
    },
    body: formData, // Send JSON data
  })
    .then((response) => {
      // Check if the content type is JSON
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        // If the response is JSON, parse it
        return response.json();
      } else {
        // If not, handle as text or throw an error
        return response.text().then((text) => {
          throw new Error(`Expected JSON, but got: ${text}`);
        });
      }
    })
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

document.querySelector(".cancel-btn").addEventListener("click", function (e) {
  e.preventDefault();
  clearForm();
});

function clearForm() {
  document.querySelectorAll(".first-four-inputs").forEach((eachInput) => {
    eachInput.value = "";
    eachInput.nextElementSibling.children[0].classList.remove("hidden");
    eachInput.nextElementSibling.children[1].classList.add("hidden");
    eachInput.nextElementSibling.children[2].classList.add("hidden");
    eachInput.nextElementSibling.children[3].style.color = "#021526";
    if (eachInput.name === "avatar") {
      eachInput.nextElementSibling.children[3].innerHTML =
        "ატვირთეთ ფოტო შესაბამის ფორმატში, მოცულობით 2MB-მდე";
      uploadedPhotoAgent.src = "photos/photo-upload-circle.svg";
      uploadedPhotoAgent.classList.remove("uploaded-photo");
      deletePhotoBtn.classList.add("hidden");
    }
    sectionTwo.classList.add("hidden");
    overlay.classList.add("hidden");
  });
}

window.addEventListener("click", function (event) {
  if (event.target === overlay) {
    console.log(event.target);
    clearForm();
  }
});
