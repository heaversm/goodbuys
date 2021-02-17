const VALUES_DATA = {
  environment: [
    "sustainability",
    "biodiversity",
    "solar",
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

let backgroundPage = browser.extension.getBackgroundPage();

let valueWeights = {
  environment: { weight: 50, count: 0 },
  small_business: {
    weight: 50,
    count: 0,
  },
  privacy: { weight: 50, count: 0 },
};

let curCat = 0;
let curTerm = 0;
let curID;
let resultsFound = false; //true when we have at least one match

let results = document.getElementById("result-list");
let resultsContainer = document.getElementById("results-container");

document.getElementById("find-form").addEventListener("submit", function (e) {
  // Send the query from the form to the background page.
  // document.querySelectorAll(".form-control-range").forEach((rangeSlider, i) => {
  //   if (i === 0) {
  //     const thisID = rangeSlider.dataset.id;
  //     valueWeights[thisID].weight = rangeSlider.value;
  //     for (let j = 0; j < VALUES_DATA[thisID].length; j++) {
  //       const thisTerm = VALUES_DATA[thisID][j];
  //       backgroundPage.find(thisTerm, thisID);
  //     }
  //   }
  // });
  //backgroundPage.find(document.getElementById("find-input").value);

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
  console.log(curTerm, VALUES_DATA[curID].length);
  if (curTerm < VALUES_DATA[curID].length - 1) {
    curTerm++;
    conductSearch();
  } else {
    curTerm = 0;
    if (curCat < 2) {
      //TODO: get actual count of VALUES_DATA
      curCat++;
      conductSearch();
    } else {
      handleFinishedSearching();
    }
  }
}

function handleFinishedSearching() {
  //TODO: all finished searching
}

function handleMessage(request, sender, response) {
  // Handle responses coming back from the background page.
  if (request.msg === "clear-results") {
    results.innerHTML = "";
  }
  if (request.msg === "found-result") {
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
    const selector = `.${request.catID}_score`;
    document.querySelector(selector).innerHTML = `${curScore}`;
  }

  if (request.msg === "next-term") {
    handleNextTerm();
  }

  if (request.msg === "debug") {
    console.log(request);
  }
}

browser.runtime.onMessage.addListener(handleMessage);
