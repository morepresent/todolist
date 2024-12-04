// On page load, retrieve tasks from localStorage or initialize as empty array
const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const taskInput = document.querySelector("#inputArea");
const addButton = document.querySelector("#addButton");
const toDoList = document.querySelector("#toDoList");

let taskCounter = 0;

// Function to render tasks from the tasks array
function renderTasks() {
  toDoList.innerHTML = ""; // Clear the existing tasks before re-rendering
  tasks.forEach((task, index) => {
    console.log(task);
    const taskWrapper = document.createElement("label");
    taskWrapper.setAttribute("for", `checkBox-${index}`);
    taskWrapper.style.display = "flex";
    taskWrapper.style.alignItems = "start";

    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.id = `checkBox-${index}`;
    checkBox.checked = task.checked;

    const checkBoxImg = document.createElement("img");
    checkBoxImg.src = checkBox.checked
      ? "checkbox-check.svg"
      : "checkbox-unchecked.svg";

    const createdTask = document.createElement("p");
    createdTask.textContent = task.content;
    createdTask.style.maxWidth = "80%";
    createdTask.style.overflowWrap = "break-word";
    createdTask.style.wordBreak = "break-word";
    createdTask.style.textDecoration = checkBox.checked
      ? "line-through"
      : "none";

    const editIcon = document.createElement("i");
    editIcon.className = "fa fa-pencil-square-o";
    editIcon.style.marginLeft = "auto";
    editIcon.style.marginRight = "10px";

    const trashIcon = document.createElement("i");
    trashIcon.className = "fa fa-trash";

    // Add elements to the DOM

    toDoList.appendChild(taskWrapper);
    taskWrapper.appendChild(checkBoxImg);
    taskWrapper.appendChild(checkBox);
    taskWrapper.appendChild(createdTask);
    taskWrapper.appendChild(editIcon);
    taskWrapper.appendChild(trashIcon);

    // Strikethrough when checkbox is checked
    checkBox.addEventListener("change", () => {
      createdTask.style.textDecoration = checkBox.checked
        ? "line-through"
        : "none";

      checkBoxImg.src = checkBox.checked
        ? "checkbox-check.svg"
        : "checkbox-unchecked.svg";

      // Update the task state in the tasks array and localStorage
      tasks[index].checked = checkBox.checked;
      localStorage.setItem("tasks", JSON.stringify(tasks));
    });

    // Remove task when trash icon is clicked
    trashIcon.addEventListener("click", () => {
      tasks.splice(index, 1); // Remove task from the tasks array
      localStorage.setItem("tasks", JSON.stringify(tasks)); // Update localStorage
      renderTasks(); // Re-render tasks after deletion
    });

    // Edit task when edit icon is clicked
    editIcon.addEventListener("click", () => {
      createdTask.setAttribute("contenteditable", "true");
      createdTask.focus(); // Automatically focus the paragraph for editing

      const range = document.createRange();
      range.selectNodeContents(createdTask);

      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);

      createdTask.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          createdTask.blur();
        }
      });

      // Optionally, stop editing when the user presses Enter or clicks elsewhere
      createdTask.addEventListener("blur", () => {
        createdTask.setAttribute("contenteditable", "false");
        task.content = createdTask.textContent.trim(); // Update the task content in the array
        localStorage.setItem("tasks", JSON.stringify(tasks)); // Save changes to localStorage
      });
    });
  });
}

// Render tasks when the page loads
renderTasks();

// Add task to the to-do list
addButton.addEventListener("click", () => {
  const taskContents = taskInput.value.trim();
  if (taskContents) {
    taskCounter++;
    const newTask = { content: taskContents, checked: false };

    // Add the new task to the tasks array
    tasks.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    taskInput.value = ""; // Clear input field
    renderTasks(); // Re-render tasks to display the new task
  }
});
