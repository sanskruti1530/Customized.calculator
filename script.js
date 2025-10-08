const display = document.getElementById("display");
const buttons = document.querySelectorAll(".btn");
const historyList = document.getElementById("history");
const acBtn = document.getElementById("ac-btn");
const backspaceBtn = document.getElementById("backspace-btn");

// Load history from localStorage on page load
window.addEventListener("load", () => {
  const savedHistory = JSON.parse(localStorage.getItem("calcHistory")) || [];
  savedHistory.forEach(item => addToHistory(item.expression, item.result, false));
});

// Button functionality
buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    if (btn.textContent === "=") {
      calculate();
    } else if (btn.textContent !== "AC" && btn.textContent !== "⌫") {
      display.value += btn.textContent;
    }
  });
});

// AC button clears everything
acBtn.addEventListener("click", () => {
  display.value = "";
});

// Backspace button removes last character
backspaceBtn.addEventListener("click", () => {
  display.value = display.value.slice(0, -1);
});

// Perform calculation
function calculate() {
  try {
    let expression = display.value;
    let result = eval(expression) || "";
    if (result !== "") {
      display.value = result;
      addToHistory(expression, result, true);
    }
  } catch {
    display.value = "Error";
  }
}

// Add history
function addToHistory(expression, result, save = true) {
  let li = document.createElement("li");
  li.textContent = `${expression} = ${result}`;

  // Make history clickable
  li.addEventListener("click", () => {
    display.value = expression; // restore full expression
  });

  historyList.prepend(li);

  // Save to localStorage
  if (save) {
    const currentHistory = JSON.parse(localStorage.getItem("calcHistory")) || [];
    currentHistory.unshift({ expression, result }); // newest on top
    localStorage.setItem("calcHistory", JSON.stringify(currentHistory));
  }
}

// Theme switcher
function setTheme(theme) {
  document.body.className = theme;
}

// Copy to Clipboard
document.getElementById("copy-btn").addEventListener("click", function() {
  if (display.value.trim() !== "") {
    navigator.clipboard.writeText(display.value).then(() => {
      alert("Result copied: " + display.value);
    });
  } else {
    alert("No result to copy!");
  }
});

// ✅ Keyboard Support
document.addEventListener("keydown", (event) => {
  if (!isNaN(event.key) || "+-*/().".includes(event.key)) {
    display.value += event.key; // allow numbers and operators
  } else if (event.key === "Enter") {
    calculate();
  } else if (event.key === "Backspace") {
    display.value = display.value.slice(0, -1);
  } else if (event.key === "Escape") {
    display.value = "";
  }
});


const clearHistoryBtn = document.getElementById("clear-history-btn");

// Clear history button functionality
clearHistoryBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all history?")) {
    historyList.innerHTML = "";          // clear on-page history
    localStorage.removeItem("calcHistory"); // clear local storage
  }
});
