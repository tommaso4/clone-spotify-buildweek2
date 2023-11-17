// const token = localStorage.getItem("token");
const token = "BQCl27TGgpgPctuj3vVwciawtm38tvCPCnQd1Nmuo58_PY8jlhmltA3VgOGUZHAzFuNDi00fEJQvd1FDgnjlr_UHiNTHv5KC-EJ3-mZTWi7_oTBG5Vo";
const selectedCategoryIds = [];
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get("userId");

// Function to fetch categories from the Spotify API
function fetchCategories() {
  fetch("https://api.spotify.com/v1/browse/categories", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (Array.isArray(data.categories.items)) {
        const categories = data.categories.items.map((item) => ({
          id: item.id,
          name: item.name,
        }));

        // Function to populate the unique categories list
        function populateUniqueCategoriesList() {
          const uniqueCategoriesList = document.getElementById("uniqueCategoriesList");

          categories.forEach((category) => {
            const listItem = document.createElement("li");
            listItem.textContent = category.name;
            listItem.className = "list-group-item";
            listItem.addEventListener("click", () => {
              if(listItem.classList.contains("list-group-item-clicked")) {
                listItem.classList.remove("list-group-item-clicked")
              } else {
                listItem.classList.add("list-group-item-clicked")
                console.log(category.id);
                handleCategorySelection(category.id);
              }
            });
            
            uniqueCategoriesList.appendChild(listItem);
          });
        }

        // Call the function to populate the list
        populateUniqueCategoriesList();
      } else {
        console.error("The 'categories' property is not an array in the returned data.");
      }
    })
    .catch((error) => {
      console.error("An error occurred in the API request:", error);
    });
}

// Call the function to fetch and display categories
fetchCategories();

// Function to handle category selection
function handleCategorySelection(categoryId) {
  const categoryIndex = selectedCategoryIds.indexOf(categoryId);

  if (categoryIndex === -1) {
    if (selectedCategoryIds.length < 5) {
      selectedCategoryIds.push(categoryId);
    } else {
      alert("You can select a maximum of 5 categories.");
    }
  } else {
    selectedCategoryIds.splice(categoryIndex, 1);
  }
}

// Add an event listener to the "Save Selection" button
const proceedBtn = document.getElementById("proceedBtn");
proceedBtn.addEventListener("click", () => {
  if (selectedCategoryIds.length < 3) {
    alert("You must select at least 3 categories.");
  } else {
    // Store selected category IDs in localStorage before redirecting
    localStorage.setItem("selectedCategoryIds", JSON.stringify(selectedCategoryIds));

    // Send a POST request to update the selected categories
    fetch("http://localhost:3000/update-selected-categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: userId, selectedCategoryIds }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Successfully updated selected categories in the database
          console.log("Selected categories saved successfully.");
          // Redirect to play-audio.html
          window.location.href = "./homepage.html";
        } else {
          console.error("Error:", data.message);
          // Handle the error as needed
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle the error as needed
      });
  }
});
