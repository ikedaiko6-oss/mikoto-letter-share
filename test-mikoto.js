const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");
const { chromium } = require("playwright");

const INPUT = {
  nickname: "テスト",
  birthYear: "1990",
  birthMonth: "4",
  birthDay: "12",
  gender: "女性",
  partnerName: "あの人",
  partnerYear: "1988",
  partnerMonth: "10",
  partnerDay: "28",
  partnerGender: "男性",
  relationship: "夫婦",
  worry: "最近すれ違いが多い。どう接したらいいか知りたい",
};

const SCREENSHOT_PATH = process.env.MIKOTO_SCREENSHOT || "C:/tmp/future-log-result.png";

function firstExisting(paths) {
  return paths.find((candidate) => candidate && fs.existsSync(candidate));
}

function browserExecutablePath() {
  if (process.env.PLAYWRIGHT_BROWSER_PATH) return process.env.PLAYWRIGHT_BROWSER_PATH;

  if (process.platform === "win32") {
    return firstExisting([
      "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
      "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
      "C:/Program Files/Google/Chrome/Application/chrome.exe",
      "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    ]);
  }

  if (process.platform === "darwin") {
    return firstExisting([
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    ]);
  }

  return undefined;
}

async function selectFirst(page, label, selectors, action) {
  for (const selector of selectors) {
    const locator = page.locator(selector).first();
    if (await locator.count()) {
      await action(locator);
      console.log(`OK ${label}: ${selector}`);
      return selector;
    }
  }

  throw new Error(`Selector not found for ${label}: ${selectors.join(", ")}`);
}

async function main() {
  const executablePath = browserExecutablePath();
  const launchOptions = {
    headless: true,
    args: ["--disable-crash-reporter", "--disable-breakpad", "--no-first-run"],
  };
  if (executablePath) launchOptions.executablePath = executablePath;

  const browser = await chromium.launch(launchOptions);
  const page = await browser.newPage({ viewport: { width: 1365, height: 1600 } });

  page.on("pageerror", (error) => console.log(`PAGEERROR ${error.message}`));
  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) {
      console.log(`PAGE ${message.type()}: ${message.text()}`);
    }
  });

  const htmlPath = path.resolve(__dirname, "index.html");
  await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "load" });

  await selectFirst(page, "nickname", ['[name="nickname"]', "#nickname"], (locator) =>
    locator.fill(INPUT.nickname)
  );
  await selectFirst(page, "birthYear", ['[name="birthYear"]', "#birthYear"], (locator) =>
    locator.fill(INPUT.birthYear)
  );
  await selectFirst(page, "birthMonth", ['[name="birthMonth"]', "#birthMonth"], (locator) =>
    locator.fill(INPUT.birthMonth)
  );
  await selectFirst(page, "birthDay", ['[name="birthDay"]', "#birthDay"], (locator) =>
    locator.fill(INPUT.birthDay)
  );
  await selectFirst(page, "gender", ['[name="gender"]', "#gender"], (locator) =>
    locator.selectOption(INPUT.gender)
  );
  await selectFirst(page, "partnerName", ['[name="partnerName"]', "#partnerName"], (locator) =>
    locator.fill(INPUT.partnerName)
  );
  await selectFirst(page, "partnerYear", ['[name="partnerYear"]', "#partnerYear"], (locator) =>
    locator.fill(INPUT.partnerYear)
  );
  await selectFirst(page, "partnerMonth", ['[name="partnerMonth"]', "#partnerMonth"], (locator) =>
    locator.fill(INPUT.partnerMonth)
  );
  await selectFirst(page, "partnerDay", ['[name="partnerDay"]', "#partnerDay"], (locator) =>
    locator.fill(INPUT.partnerDay)
  );
  await selectFirst(page, "partnerGender", ['[name="partnerGender"]', "#partnerGender"], (locator) =>
    locator.selectOption(INPUT.partnerGender)
  );
  await selectFirst(page, "relationship", ['[name="relationship"]', "#relationship"], (locator) =>
    locator.selectOption(INPUT.relationship)
  );
  await selectFirst(page, "worry", ['[name="worry"]', "#worry"], (locator) =>
    locator.fill(INPUT.worry)
  );

  await selectFirst(
    page,
    "diagnose button",
    ['#diagnosis-form button[type="submit"]', 'button[type="submit"]', "#diagnose-button"],
    (locator) => locator.click()
  );

  await page.locator("#result-panel:not(.hidden)").waitFor({ timeout: 10000 });
  await page.screenshot({ path: SCREENSHOT_PATH, fullPage: true });

  const result = {
    deepInsight: await page.locator("#deep-insight").innerText(),
    mikotoLetter: await page.locator("#mikoto-letter").innerText(),
    advice: await page.locator("#result-advice").innerText(),
    nextStep: await page.locator("#next-step").innerText(),
    screenshot: SCREENSHOT_PATH,
  };

  console.log(JSON.stringify(result, null, 2));
  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
