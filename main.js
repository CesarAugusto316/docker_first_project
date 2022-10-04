"use strict";

//* ────────────────────────────────────────────────── */
//* DARK MODE (default) */
//* ────────────────────────────────────────────────── */
const input$ToDo = document.querySelector("#create-todo");
const items$List = document.querySelector("div.list-items"); //*CONTAINER*/
const tasks = []; /* for items(tasks ToDo) */

//* CREATING ITEM */
function createNewItem(inputValue) {
  /* @inputValue: String representing content of item */
  const $item = document.createElement("div");
  $item.classList.add("item");
  $item.setAttribute("draggable", true);
  $item.innerHTML = `<figure class="image-container">
  <img src="images/icon-check.svg" alt="" />
  </figure>
  <p class="draggable-text">${inputValue.value}</p>
  <div class="btn-x">
  <img src="images/icon-cross.svg" alt="" />
  </div>`;

  tasks.push($item);
  registerEventHandlers([$item]);
  inputValue.value = ""; //-> Cleaning the Input after Insertion */
}

//? Should this receive an array as argument? -> A: NOT NECESSARILY */
function displayItems(args) {
  /* @args: String -> all, active, completed */
  items$List.innerHTML = ""; //* -> Cleaning List before Insertion */
  if (args == "all") {
    tasks.forEach(($item, index) => {
      $item.querySelector(".draggable-text").setAttribute("data-index", index);
      items$List.append($item);
    });
  } else if (args == "active") {
    tasks.forEach(($item) => {
      if (!$item.classList.contains("completed")) {
        items$List.append($item);
      }
    });
  } else if (args == "completed") {
    tasks.forEach(($item) => {
      if ($item.classList.contains("completed")) {
        items$List.append($item);
      }
    });
  }
}

//* ITEMS LEFT */
function displayItemsLeft() {
  const itemsLeft = tasks.filter(
    ($item) => !$item.classList.contains("completed")
  ).length;

  document.querySelector(".items-left > span").textContent = itemsLeft;
}

//* ADDING NEW ITEMS(TASKS) */
input$ToDo.addEventListener("keyup", function (e) {
  if (e.key === "Enter") {
    createNewItem(this); /* @this: string from user-input */
    displayItems("all"); /* -> default Behavior */
    displayItemsLeft(); /* Total tasks left to do */
  }
});

//* COMPLETING - CLOSING TASK */
items$List.addEventListener("click", function (e) {
  /* SELECTING ITEM AS COMPLETED */
  if (e.target.closest(".image-container") || e.target.closest(".item > p")) {
    e.target.closest(".item").classList.toggle("completed");
    displayItemsLeft();
  } else if (e.target.closest(".btn-x")) {
    /* CLOSING ITEM */
    e.target.closest(".item").remove();
  }
});

//* DISPLAYING: ALL, ACTIVE, COMPLETED */
document
  .querySelector(".options .center")
  .addEventListener("click", function (e) {
    if (e.target.closest(".completed")) {
      displayItems("completed");
    } else if (e.target.closest(".active")) {
      displayItems("active");
    } else if (e.target.closest(".all")) {
      displayItems("all");
    } else {
      return;
    }
  });

//* DELETING COMPLETED */
document
  .querySelector(".clear-completed")
  .addEventListener("click", function (e) {
    for (let $item = 0; $item < tasks.length; $item++) {
      if (tasks[$item].classList.contains("completed")) {
        // tasks[$node].removeEventListener("dragstart", handleDragStart);
        // tasks[$node].removeEventListener("dragover", handleDragOver);
        // tasks[$node].removeEventListener("drop", handleDrop);
        tasks.splice($item, 1);
        $item--; /* -> Because the array shrinks we decrement iterator */
      }
    }

    displayItems("all");
  });

//* ────────────────────────────────────────────────── */
//* LIGHT MODE */
//* ────────────────────────────────────────────────── */
document.querySelector(".header > img").addEventListener("click", function (e) {
  document.querySelector("body").classList.toggle("light-mode");
  if (document.querySelector("body").classList.contains("light-mode")) {
    this.src = "images/icon-moon.svg";
  } else {
    this.src = "images/icon-sun.svg";
  }
});

//* ────────────────────────────────────────────────── */
//* DRAG AND DROP IMPLEMENTATION */
//* ────────────────────────────────────────────────── */
function registerEventHandlers(arr) {
  arr.forEach(($item) => {
    $item.addEventListener("dragstart", handleDragStart);
    $item.addEventListener("dragover", handleDragOver);
    $item.addEventListener("drop", handleDrop);
  });
}

function handleDragOver(e) {
  e.preventDefault();
}

function handleDragStart(e) {
  e.dataTransfer.setData(
    "text/html",
    this.querySelector(".draggable-text").dataset.index
  );
}

function handleDrop(e) {
  let startIndex = +e.dataTransfer.getData("text/html");
  let endIndex = +this.querySelector(".draggable-text").dataset.index;
  // console.log(`startIndex: ${startIndex}, endIndex: ${endIndex}`);

  //* SWAPPING TEXTNODES WHEN DROPPING*/
  swappItems(startIndex, endIndex, tasks);
}

function swappItems(i, j, arr) {
  [
    arr[i].querySelector(".draggable-text").textContent,
    arr[j].querySelector(".draggable-text").textContent,
  ] = [
    arr[j].querySelector(".draggable-text").textContent,
    arr[i].querySelector(".draggable-text").textContent,
  ];

  if (arr[i].classList[1] != arr[j].classList[1]) {
    [arr[i], arr[j]].forEach((item) => {
      item.classList.toggle("completed");
    });
  } else {
    //* If both items are completed or neither, do nothing */
    return;
  }
}
