let backgroundPage = browser.extension.getBackgroundPage();

document.getElementById("find-form").addEventListener("submit", function (e) {
  // Send the query from the form to the background page.
  backgroundPage.find(document.getElementById("find-input").value);
  e.preventDefault();
});

document.getElementById("close-window").addEventListener("click", function (e) {
  window.close();
  e.preventDefault();
});

let results = document.getElementById("result-list");
let resultsContainer = document.getElementById("results-container");

function handleMessage(request, sender, response) {
  // Handle responses coming back from the background page.
  if (request.msg === "clear-results") {
    results.innerHTML = "";
  }
  if (request.msg === "found-result") {
    console.log(request);
    // List out responses from the background page as they come in.
    let li = document.createElement("li");
    li.innerHTML = `${request.count} result(s) found on <a href="${request.url}">this page</a> `;
    results.appendChild(li);
    resultsContainer.classList.toggle("active", true);
  }
  if (request.msg === "debug") {
    console.log(request);
  }
}

browser.runtime.onMessage.addListener(handleMessage);
