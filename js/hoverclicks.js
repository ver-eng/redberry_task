"use strict";
const whitePlus = document.querySelector(".plus-img-second");
const redPlus = document.querySelector(".plus-img-second-red");
const addAgentBtn = document.querySelector(".add-agent-btn");

const eachFilterHeadingDiv = document.querySelectorAll(
  ".each-filter-heading-div"
);
addAgentBtn.addEventListener("mouseover", function () {
  whitePlus.classList.remove("hidden");
  redPlus.classList.add("hidden");
});
addAgentBtn.addEventListener("mouseout", function () {
  whitePlus.classList.add("hidden");
  redPlus.classList.remove("hidden");
});

// eachFilterHeadingDiv.forEach((eachDiv) => {
//   eachDiv.addEventListener("click", function () {
//     eachDiv.style.backgroundColor = "#f3f3f3";
//   });
// });
