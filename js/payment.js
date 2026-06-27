const premiumCheckoutButton = document.querySelector("#premium-checkout");
const premiumTriggerButtons = document.querySelectorAll(".premium-trigger");
const checkoutStatus = document.querySelector("#checkout-status");
const paymentLink = window.MIKOTO_CONFIG?.paymentLink || "";
const demoUnlock = Boolean(window.MIKOTO_CONFIG?.demoUnlock);

function savePremiumInput() {
  const premiumForm = document.querySelector(".premium-form");
  if (!premiumForm) return;
  const premiumData = Object.fromEntries(new FormData(premiumForm));
  localStorage.setItem("mikoto:premiumInput", JSON.stringify(premiumData));
}

function initPaymentTriggers() {
  if (!premiumTriggerButtons.length || !checkoutStatus) return;

  premiumTriggerButtons.forEach((button) => button.addEventListener("click", () => {
    savePremiumInput();

    if (paymentLink) {
      window.location.href = paymentLink;
      return;
    }

    if (demoUnlock) {
      checkoutStatus.textContent = "確認用に、封じられた六つの書を開きます。";
      window.location.href = "./thank-you.html?demo=1";
      return;
    }

    checkoutStatus.textContent = "封じを解く入口は、ただいま準備中です。もう少しだけお待ちください。";
    premiumTriggerButtons.forEach((trigger) => {
      trigger.textContent = "準備中です";
      trigger.classList.add("is-pending");
    });
  }));
}
