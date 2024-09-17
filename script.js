let selectText = document.getElementById("selectText");
let dropDown = document.querySelector(".dropdown");
let CountryContainer = document.querySelector(".country-container");
const searchInput = document.getElementById("search");
let CountryArray = [];
let countryBoxes;

document.querySelectorAll(".select-box li").forEach((li) => {
  li.addEventListener("click", (e) => {
    removePreviousCountry();
    let region = e.target.innerText;
    selectText.innerHTML = region;

    if (region !== "Remove filter") {
      filterByRegion(CountryArray, region).forEach(displayCountry);
    } else {
      CountryArray.forEach(displayCountry);
      selectText.innerHTML = "Filter by region";
    }
    countryBoxes = document.querySelectorAll(".country-box");
  });
});

function filterByRegion(data, region) {
  return data.filter((country) => country.region === region);
}

dropDown.addEventListener("click", () => {
  dropDown.classList.toggle("active");
});

document.addEventListener("click", (event) => {
  if (!dropDown.contains(event.target)) {
    dropDown.classList.remove("active");
  }
});

searchInput.addEventListener("input", () => {
  const searchValue = searchInput.value.toLowerCase().trim();
  countryBoxes.forEach((box) => {
    const countryName = box.querySelector("h1").textContent.toLowerCase();
    const capitalName = box
      .querySelector("p:nth-of-type(3) span")
      .textContent.toLowerCase();
    box.style.display =
      countryName.includes(searchValue) || capitalName.includes(searchValue)
        ? ""
        : "none";
  });
});

async function fetchCountries(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching the URL:", error);
    alert(error);
  }
}

fetchCountries("https://restcountries.com/v3.1/all").then((data) => {
  removePreviousCountry();
  CountryArray = data;
  CountryArray.forEach(displayCountry);
  setTimeout(
    () => (countryBoxes = document.querySelectorAll(".country-box")),
    500
  );
});

function displayCountry(country) {
  const box = `
    <div class="country-box show" data-country="${country.name.common}">
        <div class="flag-img">
            <img src="${country.flags.svg}" alt="Flag of ${
    country.name.common
  }">
        </div>
        <div class="more-details">
            <h1>${country.name.common}</h1>
            <p>Population: <span>${country.population.toLocaleString()}</span></p>
            <p>Region: <span>${country.region}</span></p>
            <p>Capital: <span>${country.capital?.[0] || "N/A"}</span></p>
        </div>
    </div>`;

  CountryContainer.insertAdjacentHTML("beforeend", box);

  // Add click event to redirect to details page
  const newBox = CountryContainer.querySelector(".country-box:last-child");
  newBox.addEventListener("click", () => {
    // Redirect to a details page with the country name as a URL parameter
    window.location.href = `details.html?country=${encodeURIComponent(
      country.name.common
    )}`;
  });
}

function removePreviousCountry() {
  CountryContainer.innerHTML = "";
}

