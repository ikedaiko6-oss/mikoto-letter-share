function readStoredJson(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch (error) {
    return null;
  }
}

function buildPremiumBooks(data, premiumData) {
  const worry = (data.worry || "").trim();
  const seed = hashText(`${data.nickname}-${data.birthMonth}-${data.theme}-${data.concern}-${worry}`);
  const concern = concerns[data.concern];
  const ritualStep = varyStep(concern ? concern.step : getPersonalStep(worry, data.theme), data.concern, data.theme, seed);
  const birthTime = premiumData.birthTime || "unknown";
  const birthPlace = premiumData.birthPlace || "不明";
  const timeNote = {
    unknown: "生まれた時間は不明として、今の問いに出ている気配を中心に読みます。",
    morning: "朝の気配を重ね、始まり方と立ち上がりの癖を見ます。",
    noon: "昼の気配を重ね、表に出る力と人前での揺れを見ます。",
    evening: "夕方の気配を重ね、手放し方と迷いが出る場所を見ます。",
    night: "夜の気配を重ね、内側に残る本音と静かな願いを見ます。",
    exact: "正確な時間を重ね、問いの出方を少し細かく見ます。"
  };

  return [
    {
      label: "一の書",
      title: "本音のかたち",
      body: concern
        ? `${concern.core} ${concern.line} まず見るのは、出来事の正解ではなく、${data.nickname}さんの中でまだ声になっていない本音です。`
        : getCoreInsight(worry, data.theme, seed)
    },
    {
      label: "二の書",
      title: "縁のながれ",
      body: `${getGentleBlindSpot(data.concern, data.theme, seed)} ${timeNote[birthTime] || timeNote.unknown} 生まれた場所は「${birthPlace}」として、今の縁の近さを読みます。`
    },
    {
      label: "三の書",
      title: "今宵のしるし",
      body: `${ritualStep} ${getRitualAfter(ritualStep, data.theme, seed, data.concern)}`
    },
    {
      label: "四の書",
      title: "手放すもの",
      body: `${getGentleNoAction(data.concern, data.theme, seed)} 今夜手放すのは、答えそのものではなく、ひとりで全部を抱えなければならないという思い込みです。`
    },
    {
      label: "五の書",
      title: "道の分かれ",
      body: `${getLockedQuestion(data.concern, data.theme)} この問いに急いで答えなくても大丈夫です。ただ、次に選ぶ時は、自分が少し息をしやすい方を道しるべにしてください。`
    },
    {
      label: "六の書",
      title: "ミコトの結び",
      body: concern
        ? `${concern.locked} けれど、今日のあなたはもう、その重さに名前をつけ始めています。小さな所作をひとつ置けたなら、流れはそこで少し変わります。`
        : "今日の問いは、まだ途中にあります。けれど、見ないふりをしていた重さに名前をつけた時点で、流れは少し変わり始めています。"
    }
  ];
}

function renderPremiumResult() {
  const panel = document.querySelector("#premium-unlocked");
  const empty = document.querySelector("#premium-empty");
  if (!panel) return;

  const data = readStoredJson("mikoto:lastDiagnosis");
  const premiumData = readStoredJson("mikoto:premiumInput") || {};

  if (!data) {
    panel.classList.add("hidden");
    if (empty) empty.classList.remove("hidden");
    return;
  }

  const books = buildPremiumBooks(data, premiumData);
  panel.innerHTML = books.map((book) => `
    <article class="unlocked-book">
      <span>${book.label}</span>
      <h3>${book.title}</h3>
      <p>${book.body}</p>
    </article>
  `).join("");
}

renderPremiumResult();
