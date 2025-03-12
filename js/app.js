let presentations = document.querySelectorAll(".presentation");

presentations.forEach((presentation) => {
  let rightInfoListBox = presentation.previousElementSibling;

  if (
    rightInfoListBox &&
    rightInfoListBox.classList.contains("rightInfoListBox")
  ) {
    presentation.addEventListener("mouseover", function () {
      rightInfoListBox.style.display = "block";
    });

    presentation.addEventListener("mouseout", function () {
      rightInfoListBox.style.display = "none";
    });
  } else {
    console.error("Mos .rightInfoListBox topilmadi:", presentation);
  }
});

let openFormBtn = document.querySelectorAll(".openFormBtn");
let overlay = document.querySelector(".form-overlay");
let formBox = document.querySelector(".form-box");
const form = document.getElementById("registrationForm");
const loader = document.querySelector(".form-overlay-loader");
let submitBtn = document.querySelector(".submit-btn");
let cloesForm = document.querySelector(".cloesForm");

openFormBtn.forEach(function (item) {
  item.addEventListener("click", function () {
    overlay.style.display = "block";
    formBox.classList.add("form-box-active");
    document.body.style.overflowY = "hidden";
  });
});

cloesForm.addEventListener("click", function () {
  overlay.style.display = "none";
  formBox.classList.remove("form-box-active");
  document.body.style.overflowY = "auto";
});

overlay.addEventListener("click", function () {
  overlay.style.display = "none";
  formBox.classList.remove("form-box-active");
  document.body.style.overflowY = "auto";
});

const phoneInput = document.getElementById("phone");

phoneInput.addEventListener("keypress", function (e) {
  // Agar kiritilgan belgi raqam bo‘lmasa, kiritishni to‘xtatamiz
  if (!/[0-9]/.test(e.key)) {
    e.preventDefault();
  }
});

phoneInput.addEventListener("input", function (e) {
  let value = e.target.value.replace(/[^\d]/g, "");
  if (value.length > 3) {
    value = value.slice(0, 12); // Limit to 12 digits including +998
    let formatted = "+998";
    if (value.length > 3) formatted += " " + value.slice(3, 5);
    if (value.length > 5) formatted += " " + value.slice(5, 8);
    if (value.length > 8) formatted += " " + value.slice(8, 10);
    if (value.length > 10) formatted += " " + value.slice(10, 12);
    e.target.value = formatted;
  }
});

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  // Reset previous error states
  document.querySelectorAll(".form-group").forEach((group) => {
    group.classList.remove("invalid");
  });
  document.querySelectorAll(".error-message").forEach((error) => {
    error.textContent = "";
  });

  // Get input values
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.replace(/\s/g, "");

  // Validation flags
  let isValid = true;

  // Name validation
  if (!name) {
    document.getElementById("nameError").textContent = "Ism kiritish majburiy";
    document.getElementById("name").parentElement.classList.add("invalid");
    isValid = false;
  } else if (name.length < 2) {
    document.getElementById("nameError").textContent =
      "Ism kamida 2 harfdan iborat bo'lishi kerak";
    document.getElementById("name").parentElement.classList.add("invalid");
    isValid = false;
  }

  // Phone validation
  if (!phone || phone === "+998") {
    document.getElementById("phoneError").textContent =
      "Telefon raqam kiritish majburiy";
    document.getElementById("phone").parentElement.classList.add("invalid");
    isValid = false;
  } else if (phone.length !== 13) {
    document.getElementById("phoneError").textContent =
      "To'liq telefon raqam kiriting";
    document.getElementById("phone").parentElement.classList.add("invalid");
    isValid = false;
  }

  if (isValid) {
    loader.style.display = "flex";
    formBox.classList.remove("form-box-active");
    overlay.style.display = "none";

    form.querySelector(".submit-btn").disabled = true;

    // Prepare data for Google Sheets
    const formData = new FormData();
    formData.append("Ism Familya", name);
    formData.append("Telefon raqam", phone);

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbyZ0so9zlmqP2hgMUrIcwOVJDb7DXI-jkIRN2eSbkVkLGSMCV_n0liP2Cx4-p1KmhtGcA/exec",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        window.location = "/target.html";
        form.reset();
        submitBtn.textContent = "Davom etish";
        document.getElementById("phone").value = "+998";
      } else {
        throw new Error("Server error");
      }
    } catch (error) {
      alert("Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.");
      console.error(error);
    } finally {
      loader.style.display = "none";
      form.querySelector(".submit-btn").disabled = false;
      overlay.style.display = "none";
      formBox.classList.remove("form-box-active");
    }
  }
});

function updateTimer() {
  const targetDate = new Date('March 21, 2025 22:30:00');
  const now = new Date();
  const difference = targetDate - now;

  if (difference <= 0) {
      document.getElementById('timer').innerHTML = "Vaqt tugadi!";
      return;
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = seconds.toString().padStart(2, '0');

  document.getElementById('timer').innerHTML = 
      `${days} Kun ${hours}:${formattedMinutes}:${formattedSeconds}`;
}

setInterval(updateTimer, 1000);
updateTimer();
