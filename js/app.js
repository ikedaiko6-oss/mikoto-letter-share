// App entrypoint. Data, engine, render, and payment helpers are loaded first.
const form = document.querySelector("#diagnosis-form");
const formPanel = document.querySelector("#form-panel");
const loadingPanel = document.querySelector("#loading-panel");
const resultPanel = document.querySelector("#result-panel");
const shareCard = document.querySelector("#share-card");
const themeSelect = document.querySelector('select[name="theme"]');
const concernSelect = document.querySelector('select[name="concern"]');
const birthTimeSelect = document.querySelector('select[name="birthTime"]');
const exactTimeField = document.querySelector("#exact-time-field");
const premiumForm = document.querySelector(".premium-form");

function updateConcernOptions(theme) {
  if (!concernSelect) return;
  const optionKeys = concernOptionsByTheme[theme] || [];
  concernSelect.innerHTML = "";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = theme ? "近い縁を選んでください" : "先に問いの向きを選んでください";
  concernSelect.appendChild(placeholder);

  optionKeys.forEach((key) => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = concerns[key].label;
    concernSelect.appendChild(option);
  });

  concernSelect.value = "";
  concernSelect.disabled = optionKeys.length === 0;
}

if (themeSelect) {
  themeSelect.addEventListener("change", () => {
    updateConcernOptions(themeSelect.value);
  });
}

updateConcernOptions(themeSelect ? themeSelect.value : "");

if (birthTimeSelect && exactTimeField) {
  birthTimeSelect.addEventListener("change", () => {
    exactTimeField.classList.toggle("hidden", birthTimeSelect.value !== "exact");
  });
}

initPaymentTriggers();

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  localStorage.setItem("mikoto:lastDiagnosis", JSON.stringify(data));
  formPanel.classList.add("hidden");
  resultPanel.classList.add("hidden");
  loadingPanel.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
  window.setTimeout(() => renderResult(data), 2800);
});

if (premiumForm) {
  premiumForm.addEventListener("input", () => {
    const premiumData = Object.fromEntries(new FormData(premiumForm));
    localStorage.setItem("mikoto:premiumInput", JSON.stringify(premiumData));
  });
}

document.querySelector("#retry").addEventListener("click", () => {
  resultPanel.classList.add("hidden");
  loadingPanel.classList.add("hidden");
  formPanel.classList.remove("hidden");
});

document.querySelector("#save-image").addEventListener("click", saveResultImage);


