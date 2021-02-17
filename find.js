/*
an environment product: https://earthhero.com/products/clothing-footwear/recover-biketube-recycled-backpack/
black product page: https://www.amazon.com/dp/B08QRT97Y8https://www.amazon.com/dp/B08QRT97Y8
privacy product page: https://foundation.mozilla.org/en/privacynotincluded/sonos-one-sl/
a balanced article: http://www.oecd.org/coronavirus/policy-responses/e-commerce-in-the-time-of-covid-19-3a2b78e8/
*/

let backgroundPage = browser.extension.getBackgroundPage();

let valueWeights = {
  environment: { weight: 50, count: 0, score: 0 },
  small_business: {
    weight: 50,
    count: 0,
    score: 0,
  },
  privacy: { weight: 50, count: 0, score: 0 },
};

let curCat = 0;
let curTerm = 0;
let curID;

let results = document.getElementById("result-list");
let resultsContainer = document.getElementById("results-container");
let statusContainer = document.getElementById("status");

document.getElementById("find-form").addEventListener("submit", function (e) {
  resultsContainer.classList.toggle("active", true);
  statusContainer.innerText = "Searching...";
  conductSearch();
  e.preventDefault();
});

document.getElementById("close-window").addEventListener("click", function (e) {
  window.close();
  e.preventDefault();
});

function conductSearch() {
  const rangeSlider = document.querySelectorAll(".form-control-range")[curCat];
  curID = rangeSlider.dataset.id;
  valueWeights[curID].weight = rangeSlider.value;
  const thisTerm = VALUES_DATA[curID][curTerm];
  backgroundPage.find(thisTerm, curID);
}

function handleNextTerm() {
  if (curTerm < VALUES_DATA[curID].length - 1) {
    curTerm++;
    conductSearch();
  } else {
    curTerm = 0;
    if (curCat < Object.keys(VALUES_DATA).length - 1) {
      curCat++;
      conductSearch();
    } else {
      handleFinishedSearching();
    }
  }
}

function handleFinishedSearching() {
  document.querySelectorAll(".term").forEach((term) => {
    term.innerHTML = "";
  });
  statusContainer.innerText = "Finished!";

  let highestScore = 0;
  let highestKey;

  for (const [key, value] of Object.entries(valueWeights)) {
    if (parseFloat(value.score) > parseFloat(highestScore)) {
      highestKey = key;
      highestScore = parseFloat(value.score);
    }
  }
  if (highestKey) {
    document
      .querySelector(`.score-item[data-id="${highestKey}"]`)
      .classList.toggle("active", true);
  } else {
    statusContainer.innerText = "No Values Matches for this Page!";
  }
}

function handleMessage(request, sender, response) {
  // Handle responses coming back from the background page.
  if (request.msg === "clear-results") {
    results.innerHTML = "";
  }
  if (request.msg === "found-result") {
    const thisVal = valueWeights[request.catID];
    // List out responses from the background page as they come in.
    thisVal.count += request.count;
    thisVal.score = (thisVal.count * (thisVal.weight / 100)).toFixed(2);
    const selector = `.${request.catID}_score`;
    document.querySelector(selector).innerHTML = `${thisVal.score}`;
    const termSelector = `.${request.catID}_term`;
    document.querySelector(termSelector).innerHTML = `${request.term}`;
  }

  if (request.msg === "next-term") {
    handleNextTerm();
  }

  if (request.msg === "debug") {
    console.log(request);
  }
}

browser.runtime.onMessage.addListener(handleMessage);
