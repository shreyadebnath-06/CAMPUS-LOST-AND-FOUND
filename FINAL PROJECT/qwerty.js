// ============================================================
//  Campus Lost & Found — qwerty.js
//  Simple, beginner-friendly JavaScript. No frameworks needed.
// ============================================================


// ── 1. FILTER BUTTONS ───────────────────────────────────────
// Decides which category an item card belongs to
// based on the card's name text.

function getCategoryFromCard(card) {
  var name = card.querySelector(".card-name").textContent.toLowerCase();

  if (name.includes("macbook") || name.includes("laptop") ||
      name.includes("earbuds") || name.includes("phone") ||
      name.includes("wireless") || name.includes("spectacles")) {
    return "electronics";
  }
  if (name.includes("backpack") || name.includes("bag") || name.includes("bottle")) {
    return "bags";
  }
  if (name.includes("key")) {
    return "keys";
  }
  if (name.includes("jacket") || name.includes("shirt") ||
      name.includes("umbrella") || name.includes("hoodie")) {
    return "clothing";
  }
  if (name.includes("id") || name.includes("card") ||
      name.includes("document") || name.includes("passport")) {
    return "documents";
  }
  return "other";
}

// Grab all filter buttons and all item cards
var filterButtons = document.querySelectorAll(".filter-btn");
var itemCards    = document.querySelectorAll(".item-card");

// When a filter button is clicked:
filterButtons.forEach(function (btn) {
  btn.addEventListener("click", function () {

    // 1) Remove "active" from every button, add it only to the clicked one
    filterButtons.forEach(function (b) { b.classList.remove("active"); });
    btn.classList.add("active");

    // 2) Get the filter text (e.g. "Electronics", "All")
    var filter = btn.textContent.trim().toLowerCase();

    // 3) Show or hide each card depending on its category
    itemCards.forEach(function (card) {
      if (filter === "all") {
        card.style.display = "";          // show everything
      } else {
        var category = getCategoryFromCard(card);
        card.style.display = (category === filter) ? "" : "none";
      }
    });
  });
});


// ── 2. SEARCH BAR ───────────────────────────────────────────
// Filters cards in real-time as the user types,
// or when the Search button is clicked.

var searchInput = document.querySelector(".search-bar input");
var searchBtn   = document.querySelector(".search-bar button");

function doSearch() {
  var query = searchInput.value.trim().toLowerCase();

  // Reset filter buttons to "All" whenever a search runs
  filterButtons.forEach(function (b) { b.classList.remove("active"); });
  filterButtons[0].classList.add("active");

  itemCards.forEach(function (card) {
    var name    = card.querySelector(".card-name").textContent.toLowerCase();
    var loc     = card.querySelector(".card-loc").textContent.toLowerCase();
    var details = card.querySelector(".card-hover-details").textContent.toLowerCase();

    // If query is empty, show all; otherwise show only matching cards
    if (query === "" || name.includes(query) || loc.includes(query) || details.includes(query)) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });
}

// Search live as the user types
searchInput.addEventListener("input", doSearch);

// Search when button is clicked
searchBtn.addEventListener("click", doSearch);

// Also search when the user presses Enter
searchInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") doSearch();
});


// ── 3. IMAGE UPLOAD PREVIEW ─────────────────────────────────
// When a photo is selected, show a small preview
// inside the upload card instead of the camera icon.

function setupImagePreview(inputId) {
  var input = document.getElementById(inputId);
  if (!input) return; // safety check

  input.addEventListener("change", function () {
    var file = input.files[0];
    if (!file) return;

    var reader = new FileReader();

    reader.onload = function (e) {
      // Find the preview box inside the same label as this input
      var label      = input.closest("label");
      var previewBox = label.querySelector(".upload-preview-wrap");
      var subText    = label.querySelector(".upload-card-sub");

      // Replace camera icon with the chosen image
      previewBox.innerHTML = '<img src="' + e.target.result + '" alt="Preview" />';

      // Show the file name below
      if (subText) subText.textContent = file.name;
    };

    reader.readAsDataURL(file); // triggers reader.onload above
  });
}

setupImagePreview("photoUpload");      // Report Lost form
setupImagePreview("foundPhotoUpload"); // Report Found form


// ── 4. FORM SUBMISSION MESSAGES ─────────────────────────────
// When a Submit button is clicked:
//   - Check that at least the first field isn't empty
//   - Show a success message
//   - Clear all fields in that form

function setupFormSubmit(formSelector, successMessage) {
  var form = document.querySelector(formSelector);
  if (!form) return; // safety check

  var btn = form.querySelector(".btn-submit");
  if (!btn) return;

  btn.addEventListener("click", function () {

    // Find the first text input and make sure it isn't blank
    var firstInput = form.querySelector("input[type='text']");
    if (!firstInput || firstInput.value.trim() === "") {
      alert("⚠️ Please fill in at least the item name before submitting.");
      return;
    }

    // Show the success message
    alert(successMessage);

    // Clear all inputs, dropdowns, and text areas in this form
    form.querySelectorAll("input, select, textarea").forEach(function (el) {
      el.value = "";
    });

    // Reset the image preview back to the camera icon
    form.querySelectorAll(".upload-preview-wrap").forEach(function (wrap) {
      wrap.innerHTML =
        '<div class="upload-placeholder">' +
          '<span class="upload-cam-icon">📷</span>' +
          '<span class="upload-cta">Add Photo</span>' +
        '</div>';
    });
    form.querySelectorAll(".upload-card-sub").forEach(function (sub) {
      sub.textContent = "Click to browse your files";
    });
  });
}

setupFormSubmit(
  ".report-form",
  "✅ Your lost item has been reported! We'll let you know if it gets found."
);
setupFormSubmit(
  ".found-form",
  "✅ Thank you for turning it in! The item has been listed so the owner can claim it."
);
setupFormSubmit(
  ".retrieve-form",
  "✅ Claim request submitted! Please visit the Lost & Found Office with your Student ID."
);


// ── 5. ACTIVE NAV LINK ON SCROLL ────────────────────────────
// Highlights the correct nav link as the user scrolls
// through different sections of the page.

var navLinks = document.querySelectorAll(".nav-right a");
var sections = document.querySelectorAll("section[id]");

window.addEventListener("scroll", function () {
  var scrollPos = window.scrollY + 120; // 120px offset for the sticky nav height

  sections.forEach(function (section) {
    var top    = section.offsetTop;
    var bottom = top + section.offsetHeight;

    if (scrollPos >= top && scrollPos < bottom) {
      // Remove highlight from all links
      navLinks.forEach(function (link) {
        link.style.color  = "";
        link.style.fontWeight = "";
      });

      // Highlight the link that matches this section's id
      var activeLink = document.querySelector('.nav-right a[href="#' + section.id + '"]');
      if (activeLink) {
        activeLink.style.color      = "#1E90C8";
        activeLink.style.fontWeight = "700";
      }
    }
  });
});
