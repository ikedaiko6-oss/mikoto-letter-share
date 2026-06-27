function renderCompatibilityResult(data) {
  const birthDate = data.birthDate || dateFromParts(data, "birth");
  const partnerBirthday = data.partnerBirthday || dateFromParts(data, "partner");
  const seed = hashText(`${data.nickname}-${birthDate}-${data.gender}-${data.partnerName}-${partnerBirthday}-${data.partnerGender}-${data.relationship}-${data.worry}`);
  const mine = getSunSign(birthDate);
  const partner = getSunSign(partnerBirthday);
  const minePhase = getFivePhase(birthDate);
  const partnerPhase = getFivePhase(partnerBirthday);
  const fivePhase = `${minePhase.text} × ${partnerPhase.text}`;
  const tone = compatibilityTone(mine, partner);
  const score = 64 + (seed % 29);
  const worry = data.worry.trim();
  const lucky = pickLucky(seed);
  const pairNames = {
    共鳴: ["同じ灯りを持つふたり", "呼吸が重なる星"],
    追い風: ["風を送る星と進む星", "足りない光を渡すふたり"],
    調律: ["違う音を合わせるふたり", "惹かれ合う月影の星"]
  };
  const pairName = pairNames[tone.key][seed % pairNames[tone.key].length];
  const genderNote = data.gender || data.partnerGender ? ` / ${data.gender || "性別未回答"} × ${data.partnerGender || "性別未回答"}` : "";
  const focus = `${data.nickname}さんは${mine.name}、${data.partnerName}さんは${partner.name} / ${data.relationship}${genderNote}`;
  const questionLine = worry ? `「${worry}」という問いには、` : "";

  document.querySelector("#result-type").textContent = `相性率 ${score}%`;
  document.querySelector("#result-focus").textContent = worry ? `今回の焦点：${focus} / 「${worry}」` : `今回の焦点：${focus}`;
  document.querySelector("#astro-summary").classList.remove("hidden");
  document.querySelector("#score-number").textContent = `${score}%`;
  document.querySelector("#score-ring").style.setProperty("--score-angle", `${score * 3.6}deg`);
  document.querySelector("#pair-name").textContent = pairName;
  document.querySelector("#your-sign").textContent = mine.name;
  document.querySelector("#partner-sign").textContent = partner.name;
  document.querySelector("#five-phase").textContent = fivePhase;
  document.querySelector("#five-phase-visual").style.setProperty("--phase-color", minePhase.color);
  document.querySelector("#lucky-food").textContent = lucky.food.name;
  document.querySelector("#lucky-food-visual").className = `food-visual ${lucky.food.visual}`;
  document.querySelector("#lucky-direction").textContent = lucky.direction.name;
  document.querySelector("#compass-needle").style.setProperty("--direction-angle", `${lucky.direction.angle}deg`);
  document.querySelector("#lucky-signal").textContent = lucky.signal;
  document.querySelector("#lucky-distance").textContent = lucky.distance;
  document.querySelector("#avoid-word").textContent = `「${lucky.avoid}」`;
  document.querySelector("#deep-insight").textContent = `ふたりの型は「${pairName}」。太陽星座では、${data.nickname}さんは${mine.mood}、${data.partnerName}さんは${partner.mood}。東洋占術の五行イメージでは「${fivePhase}」です。${tone.text}`;
  document.querySelector("#mikoto-letter").textContent = `${questionLine}今夜の便りには「${tone.key}」と出ています。ふたりは、近づき方の速さや安心する言葉が少し違っていても、同じ方角を見つける余地がありそうです。今は相手の気持ちを当てに行くより、どの距離ならお互いが息をしやすいかを見る時かもしれません。`;
  document.querySelector("#blind-spot").textContent = `星が示すすれ違い：${tone.caution}`;
  document.querySelector("#no-action").textContent = "星が弱まりやすい流れ：気持ちを読もうとしすぎるほど、実際に起きている小さな優しさや違和感を見落としやすくなります。";
  document.querySelector("#result-summary").textContent = `${data.relationship}としての流れは「${pairName}」です。無料版では太陽星座から、ふたりの基本の近づき方を見ています。`;
  document.querySelector("#flow-score").textContent = `${score}%`;
  document.querySelector("#key-word").textContent = pairName;
  document.querySelector("#result-advice").textContent = softenAdvice("今日は結論を急がず、相手に求めたいことをひとつだけ短い言葉にしてみてもよさそうです。");
  document.querySelector("#next-step").textContent = softenStep("相手に求めたいことを、責め言葉ではなくお願いの形で1行にする", seed);
  document.querySelector("#after-action").textContent = "お願いの形にすると、気持ちを当てる時間から、関係を少し整える時間へ移りやすくなります。";
  document.querySelector("#sample-day").textContent = "今日は相手を変える日ではなく、ふたりの距離が少し楽になる言葉を探す日です。";
  document.querySelector("#locked-preview").textContent = "詳しい星読みでは、安心する距離と惹かれ方がさらに……";
  document.querySelector("#locked-question").textContent = "ふたりは似ているから惹かれるのか、違うから気になるのか。";
  document.querySelector("#astro-copy").textContent = "無料版は太陽星座ベースの簡易相性です。詳しい星読みでは、月星座、金星、火星なども重ねた7日間の接し方を準備しています。";

  loadingPanel.classList.add("hidden");
  resultPanel.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderResult(data) {
  const seed = hashText(`${data.nickname}-${data.birthMonth}-${data.theme}-${data.concern}-${data.worry}`);
  const result = types[seed % types.length];
  const worry = data.worry.trim();
  const omikuji = buildOmikuji(seed, data, worry);
  const score = Math.min(96, 62 + (seed % 30) + omikuji.scoreOffset);
  const concern = concerns[data.concern];
  const insight = concern ? concern.core : getCoreInsight(worry, data.theme, seed);
  const worryInsight = concern ? concern.line : getWorryInsight(worry, seed);
  const ritualStep = varyStep(concern ? concern.step : getPersonalStep(worry, data.theme), data.concern, data.theme, seed);
  const letterBody = getLetterBody(concern, data, seed, worry);

  document.querySelector("#result-type").textContent = `${omikuji.name}・${result.key}`;
  document.querySelector("#result-focus").textContent = worry
    ? `${omikuji.focusLead}：${concern ? concern.label : themes[data.theme]} / 「${worry}」`
    : `${omikuji.focusLead}：${concern ? concern.label : themes[data.theme]}`;
  document.querySelector("#deep-insight").textContent = worry
    ? `${insight} ${omikuji.bridge} ${worryInsight}`
    : `${insight} ${omikuji.bridge}`;
  document.querySelector("#mikoto-letter").textContent = concern
    ? `${omikuji.letterLead} ${letterBody} ${omikuji.letterClose}`
    : `${omikuji.letterLead} ${letterBody} ${omikuji.letterClose}`;
  document.querySelector("#blind-spot").textContent = getGentleBlindSpot(data.concern, data.theme, seed);
  document.querySelector("#no-action").textContent = getGentleNoAction(data.concern, data.theme, seed);
  document.querySelector("#result-summary").textContent =
    concern
      ? `${data.nickname}さんの${concern.label}は「${result.key}」が入口です。${concern.reading}`
      : `${data.nickname}さんの${themes[data.theme]}の流れは「${result.key}」が入口です。${result.summary}`;
  document.querySelector("#flow-score").textContent = `${score}%`;
  document.querySelector("#key-word").textContent = omikuji.light;
  document.querySelector("#result-advice").textContent = leadAdvice(omikuji.adviceLead, concern ? concern.advice : result.advice);
  document.querySelector("#next-step").textContent = softenStep(ritualStep, seed);
  document.querySelector("#after-action").textContent = getRitualAfter(ritualStep, data.theme, seed, data.concern);
  document.querySelector("#sample-day").textContent = `${omikuji.sealedLead} ${softenAdvice(concern ? concern.sample : result.sample)}`;
  document.querySelector("#locked-preview").textContent = `${(concern ? concern.locked : result.locked).slice(0, 28)}……`;
  document.querySelector("#locked-question").textContent = getLockedQuestion(data.concern, data.theme);
  document.querySelector("#astro-copy").textContent = getAstroCopy(worry, data.theme, data.concern);

  loadingPanel.classList.add("hidden");
  resultPanel.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function saveResultImage() {
  const canvas = document.querySelector("#card-canvas");
  const context = canvas.getContext("2d");
  const title = document.querySelector("#result-type").textContent;
  const summary = document.querySelector("#result-summary").textContent;
  const advice = document.querySelector("#result-advice").textContent;

  context.fillStyle = "#111315";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#d7b46a";
  context.font = "700 56px system-ui, sans-serif";
  context.fillText("夜見の響き", 72, 120);
  context.fillStyle = "#f4f0e8";
  wrapText(context, title, 72, 260, 920, 72);
  context.fillStyle = "#aaa39a";
  context.font = "36px system-ui, sans-serif";
  wrapText(context, summary, 72, 470, 920, 56);
  context.fillStyle = "#79c7bd";
  wrapText(context, advice, 72, 850, 920, 56);
  context.fillStyle = "#d7b46a";
  context.font = "32px system-ui, sans-serif";
  context.fillText("夜見の響き", 72, 1230);

  const link = document.createElement("a");
  link.download = "mikoto-result.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
  const chars = [...text];
  let line = "";
  for (const char of chars) {
    const test = line + char;
    if (context.measureText(test).width > maxWidth && line) {
      context.fillText(line, x, y);
      line = char;
      y += lineHeight;
    } else {
      line = test;
    }
  }
  context.fillText(line, x, y);
}

