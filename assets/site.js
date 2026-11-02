document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const opened = nav.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", String(opened));
      toggle.textContent = opened ? "✕" : "☰";
    });
  }

  const langButtons = document.querySelectorAll(".lang-toggle");
  let language = localStorage.getItem("alSalamLanguage") || "en";
  const applyLanguage = (lang) => {
    language = lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-en][data-ar]").forEach(el => {
      el.innerHTML = el.dataset[lang];
    });
    langButtons.forEach(btn => btn.textContent = lang === "ar" ? "English" : "العربية");
    localStorage.setItem("alSalamLanguage", lang);
  };
  langButtons.forEach(btn => btn.addEventListener("click", () => applyLanguage(language === "en" ? "ar" : "en")));
  applyLanguage(language);

  const form = document.getElementById("enquiry-form");
  if (form) {
    const query = new URLSearchParams(window.location.search);
    const room = query.get("room");
    const roomSelect = document.getElementById("room");
    if (room && roomSelect) {
      const match = [...roomSelect.options].find(o => o.text.toLowerCase() === room.toLowerCase());
      if (match) roomSelect.value = match.value;
    }
    const checkin = document.getElementById("checkin");
    const checkout = document.getElementById("checkout");
    const today = new Date();
    const localDate = d => {
      const date = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
      return date.toISOString().slice(0,10);
    };
    if (checkin) checkin.min = localDate(today);
    if (checkout) checkout.min = checkin?.value || localDate(today);
    checkin?.addEventListener("change", () => {
      checkout.min = checkin.value;
      if (checkout.value && checkout.value < checkin.value) checkout.value = "";
    });
    form.addEventListener("submit", event => {
      event.preventDefault();
      const name = document.getElementById("guest-name").value.trim();
      const inDate = checkin.value;
      const outDate = checkout.value;
      const guests = document.getElementById("guests").value;
      const roomChoice = roomSelect.value;
      const requests = document.getElementById("requests").value.trim();
      const error = document.getElementById("form-error");
      if (!name || !inDate || !outDate) {
        error.textContent = "Please enter your name and both dates.";
        return;
      }
      if (outDate <= inDate) {
        error.textContent = "Check-out must be after check-in.";
        checkout.focus();
        return;
      }
      error.textContent = "";
      const message = [
        "Hello Al Salam Hotel, I would like to enquire about a stay.",
        "",
        "Name: " + name,
        "Check-in: " + inDate,
        "Check-out: " + outDate,
        "Guests: " + guests,
        "Room preference: " + roomChoice,
        requests ? "Special requests: " + requests : "",
        "",
        "Please confirm availability, total amount, inclusions and booking terms. Thank you."
      ].filter(Boolean).join("\n");
      window.open("https://wa.me/96522263600?text=" + encodeURIComponent(message), "_blank", "noopener");
    });
  }
});