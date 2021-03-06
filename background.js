let clickedTab;

async function find(query, catID) {
  //browser.runtime.sendMessage({ msg: "clear-results" });

  // If you don't exclude the current tab, every search will find a hit on the
  // current page.
  let this_tab_url = browser.runtime.getURL("find.html");
  let tabs = await browser.tabs.query({});

  for (let tab of tabs) {
    // Iterate through the tabs, but exclude the current tab.
    if (tab.url === this_tab_url) {
      continue;
    }
    // browser.runtime.sendMessage({
    //   msg: "debug",
    //   clickedTab,
    //   query,
    //   tab: tab.id,
    // });

    // Call the find API on each tab. We'll wait for the results for each
    // tab before progressing onto the next one by using await.
    //
    // After getting the results, send a message back to the query page
    // and highlight the tab if any results are found.

    let result = await browser.find.find(query, {
      tabId: tab.id,
      // includeRangeData: true,
      // includeRectData: true,
    });

    if (tab.id == clickedTab && result.count) {
      browser.runtime.sendMessage({
        msg: "found-result",
        id: tab.id,
        url: tab.url,
        count: result.count,
        catID: catID,
        term: query,
      });
      browser.find.highlightResults({
        tabId: tab.id,
      });
    }
    browser.runtime.sendMessage({ msg: "next-term" });
  }
}

browser.browserAction.onClicked.addListener((tab) => {
  clickedTab = tab.id;
  browser.tabs.create({ url: "/find.html" });
});
