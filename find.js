let backgroundPage = browser.extension.getBackgroundPage();

const VALUES_DATA = {
  environment: [
    "sustainability",
    "biodiversity",
    "pollutant",
    "organic",
    "pollution",
    "organism",
    "biology",
    "biological",
    "ecosystem",
    "microbe",
    "microorganism",
    "contaminant",
    "ecology",
    "environmentalist",
    "pesticide",
    "humidity",
    "forest",
    "deforestation",
    "outdoor",
    "conserve",
    "conservation",
    "sediment",
    "green",
    "contamination",
    "weather",
    "urbanization",
    "waste",
    "epa",
    "compost",
    "eco",
    "wastewater",
    "warming",
    "natural",
    "biological",
    "sensing",
    "species",
    "monitoring",
    "carbon",
    "degradation",
    "recycle",
    "chemical",
    "resource",
  ],
  small_business: [
    "small business",
    "independent",
    "women owned",
    "black owned",
    "bipoc",
    "craft",
    "hand made",
    "non-profit",
    "african american",
    "equality",
    "equity",
    "ethnic",
    "multicultural",
    "local",
    "one of a kind",
    "female owned",
    "artisan",
    "non profit",
    "alliance",
    "unique",
    "sustainable",
    "regional",
    "handmade",
    "native",
    "feminist",
    "equitable",
    "fair trade",
    "inclusive",
    "diverse",
    "accessible",
    "equal",
    "opportunity",
    "outreach",
    "public",
    "nonprofit",
    "good",
    "benefit",
    "support",
    "neighborhood",
    "area",
    "market",
    "brick and mortar",
    "shop small",
    "alliance",
    "marketplace",
    "union",
  ],
  privacy: [
    "privacy",
    "encryption",
    "secure",
    "security",
    "encrypted",
    "anonymous",
    "robust",
    "authentication",
    "vault",
    "protect",
    "authenticate",
    "private",
    "antivirus",
    "standards",
    "data",
    "password",
    "safeguard",
    "vulnerable",
    "biometric",
    "scanning",
    "breech",
    "warranty",
    "permission",
    "location",
    "hacker",
    "disclosure",
    "guarantee",
    "algorithm",
    "artificial intelligence",
    "blockchain",
    "connection",
    "crypto",
    "framework",
    "decentralize",
    "cybersecurity",
    "authority",
    "trusted",
    "certificate",
    "credential",
    "trust",
    "personal",
  ],
};

let valueWeights = {
  environment: { weight: 50, count: 0 },
  small_business: {
    weight: 50,
    count: 0,
  },
  privacy: { weight: 50, count: 0 },
};

let resultsFound = false; //true when we have at least one match

document.getElementById("find-form").addEventListener("submit", function (e) {
  // Send the query from the form to the background page.
  document.querySelectorAll(".form-control-range").forEach((rangeSlider, i) => {
    const thisID = rangeSlider.dataset.id;
    valueWeights[thisID].weight = rangeSlider.value;
    for (let i = 0; i < VALUES_DATA[thisID].length; i++) {
      const thisTerm = VALUES_DATA[thisID][i];
      backgroundPage.find(thisTerm, thisID);
    }
  });
  //backgroundPage.find(document.getElementById("find-input").value);

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
    //console.log(request);
    if (resultsFound === false) {
      resultsFound = true;
      resultsContainer.classList.toggle("active", true);
    }
    const thisVal = valueWeights[request.catID];
    // List out responses from the background page as they come in.
    thisVal.count += request.count;
    //let li = document.createElement("li");
    //li.innerHTML = `${request.count} result(s) found on <a href="${request.url}">this page</a> `;
    //results.appendChild(li);
    const curScore = thisVal.count * (thisVal.weight / 100);
    document.querySelector(
      `.score-item[data-id="${request.catID}"] .score`
    ).innerText = `${curScore}`;
  }

  if (request.msg === "debug") {
    console.log(request);
  }
}

browser.runtime.onMessage.addListener(handleMessage);
