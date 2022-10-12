document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addTodo();
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function addTodo() {
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = document.getElementById("inputBookYear").value;
  const inputBookIsComplete = document.getElementById(
    "inputBookIsComplete"
  ).checked;

  const generatedID = generateId();
  const todoObject = generateTodoObject(
    generatedID,
    title,
    author,
    year,
    inputBookIsComplete
  );
  incompleteBookshelfList.push(todoObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function generateId() {
  return +new Date();
}

function generateTodoObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}
const incompleteBookshelfList = [];
const RENDER_EVENT = "render-todo";

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedTODOList = document.getElementById(
    "incompleteBookshelfList"
  );
  uncompletedTODOList.innerHTML = "";

  const completedTODOList = document.getElementById("completeBookshelfList");
  completedTODOList.innerHTML = "";

  for (const todoItem of incompleteBookshelfList) {
    const todoElement = makeTodo(todoItem);
    if (!todoItem.isCompleted) uncompletedTODOList.append(todoElement);
    else completedTODOList.append(todoElement);
  }
});

function makeTodo(todoObject) {
  const textTitle = document.createElement("h3");
  textTitle.innerText = todoObject.title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = todoObject.author;

  const textYear = document.createElement("p");
  textYear.innerText = todoObject.year;

  const selesaiMembaca = document.createElement("button");
  selesaiMembaca.innerText = "Selesai dibaca";
  selesaiMembaca.classList.add("green");

  const hapusBuku = document.createElement("button");
  hapusBuku.innerText = "Hapus Buku";
  hapusBuku.classList.add("red");

  const action = document.createElement("div");
  action.classList.add("action");

  const container = document.createElement("article");
  container.classList.add("book_item");
  container.append(textTitle, textAuthor, textYear, action);

  container.setAttribute("id", `todo-${todoObject.id}`);

  if (todoObject.isCompleted) {
    const kembalimembaca = document.createElement("button");
    kembalimembaca.innerText = "Belum selesai di Baca";
    kembalimembaca.classList.add("green");

    kembalimembaca.addEventListener("click", function () {
      undoTaskFromCompleted(todoObject.id);
    });

    const hapusBuku = document.createElement("button");
    hapusBuku.innerText = "Hapus Buku";
    hapusBuku.classList.add("red");

    hapusBuku.addEventListener("click", function () {
      removeTaskFromCompleted(todoObject.id);
    });

    action.append(kembalimembaca, hapusBuku);
  } else {
    const selesaiMembaca = document.createElement("button");
    selesaiMembaca.innerText = "Selesai dibaca";
    selesaiMembaca.classList.add("green");
    selesaiMembaca.addEventListener("click", function () {
      addTaskToCompleted(todoObject.id);
    });

    const hapusBuku = document.createElement("button");
    hapusBuku.innerText = "Hapus Buku";
    hapusBuku.classList.add("red");
    hapusBuku.addEventListener("click", function () {
      removeTaskFromCompleted(todoObject.id);
    });
    action.append(selesaiMembaca, hapusBuku);
  }

  return container;
}

function addTaskToCompleted(todoId) {
  const todoTarget = findTodo(todoId);

  if (todoTarget == null) return;

  todoTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findTodo(todoId) {
  for (const todoItem of incompleteBookshelfList) {
    if (todoItem.id === todoId) {
      return todoItem;
    }
  }
  return null;
}

function removeTaskFromCompleted(todoId) {
  const todoTarget = findTodoIndex(todoId);

  if (todoTarget === -1) return;

  incompleteBookshelfList.splice(todoTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoTaskFromCompleted(todoId) {
  const todoTarget = findTodo(todoId);

  if (todoTarget == null) return;

  todoTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findTodoIndex(todoId) {
  for (const index in incompleteBookshelfList) {
    if (incompleteBookshelfList[index].id === todoId) {
      return index;
    }
  }

  return -1;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(incompleteBookshelfList);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

const SAVED_EVENT = "saved-Bookshelf_Apps";
const STORAGE_KEY = "Bookshelf_Apps";

function isStorageExist() /* boolean */ {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const todo of data) {
      incompleteBookshelfList.push(todo);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}
