function openConsultationForm(nutritionistId) {
    const modal = document.getElementById("appointmentModal");
  
    // Reset form to clear any old input
    const form = document.getElementById("consultationForm");
    form.reset();
  
    // Set nutritionist ID
    document.getElementById("nutritionistIdInput").value = nutritionistId;
  
    // Show modal centered
    modal.style.display = "flex";
  }
  
  function closeConsultationForm() {
    const modal = document.getElementById("appointmentModal");
  
    // Optional: reset form when closing (optional)
    document.getElementById("consultationForm").reset();
  
    // Hide modal
    modal.style.display = "none";
  }
  
  // 💡 Add this at the bottom of your script or HTML file
  // So modal doesn't appear automatically when page loads or on dashboard reload
  window.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("appointmentModal");
    modal.style.display = "none"; // Always hide it on initial load
  });
  
  
  
document.addEventListener("DOMContentLoaded", function () {
    console.log("📌 Dashboard Loaded");

    // ✅ Get user data from localStorage
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        alert("Unauthorized! Please log in first.");
        window.location.href = "login.html";
        return;
    }

    // ✅ Fetch user profile from backend and display
    fetch(`http://localhost:5000/api/userprofile/${user.id}`)
        .then(res => res.json())
        .then(profile => {
            document.getElementById("userName").textContent = user.name || "N/A";
            document.getElementById("userAge").textContent = profile.age || "N/A";
            document.getElementById("userWeight").textContent = profile.weight || "N/A";
            document.getElementById("userHeight").textContent = profile.height || "N/A";
            document.getElementById("userGoal").textContent = profile.health_goals || "N/A";
        })
        .catch(err => {
            console.error("Error fetching user profile:", err);
            alert("Failed to load profile details.");
        });

    // ✅ Function to fetch all nutritionists
    function fetchAllNutritionists() {
        fetch(`http://localhost:5000/api/nutritionists?userId=${user.id}`)
            .then(response => response.json())
            .then(data => {
                const container = document.getElementById("nutritionistsContainer");
                container.innerHTML = "";

                if (!data.nutritionists || data.nutritionists.length === 0) {
                    container.innerHTML = "<p>No matching nutritionists found.</p>";
                    return;
                }

                data.nutritionists.forEach(nutritionist => {
                    const card = document.createElement("div");
                    card.classList.add("nutritionist-card");
                    card.innerHTML = `
                        <h3>${nutritionist.name}</h3>
                        <p><strong>Experience:</strong> ${nutritionist.experience} years</p>
                        <p><strong>Languages:</strong> ${nutritionist.languages}</p>
                        <p><strong>Specialization:</strong> ${nutritionist.specialization}</p>
                        <p><strong>Location:</strong> ${nutritionist.location}</p>
                        <p><strong>Contact:</strong> ${nutritionist.contact}</p>
                         <!-- 👇 Book Consultation Button -->
                     <!-- Book Consultation Button with Inline CSS -->
    <button class="book-btn" onclick="openConsultationForm(${nutritionist.id})">
    Book Consultation
</button>


                    `;
                    container.appendChild(card);
                });
            })
            .catch(error => console.error("❌ Error fetching nutritionists:", error));
    }

    // ✅ Fetch all nutritionists on page load
    fetchAllNutritionists();

    // ✅ Apply Filters Button Click
    document.getElementById("applyFilters").addEventListener("click", function () {
        const language = document.getElementById("languageFilter").value;
        const specialization = document.getElementById("specializationFilter").value;
        const experience = document.getElementById("experienceFilter").value;

        const filters = { language, specialization, experience };

        fetch("http://localhost:5000/api/nutritionists/filter", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(filters),
        })
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById("filteredNutritionistsContainer");
            container.innerHTML = "";

            if (!data.nutritionists || data.nutritionists.length === 0) {
                container.innerHTML = "<p>No nutritionists found with the selected filters.</p>";
                return;
            }

            data.nutritionists.forEach(nutritionist => {
                const card = document.createElement("div");
                card.classList.add("nutritionist-card");
                card.innerHTML = `
                    <h3>${nutritionist.name}</h3>
                    <p><strong>Experience:</strong> ${nutritionist.experience} years</p>
                    <p><strong>Languages:</strong> ${nutritionist.languages}</p>
                    <p><strong>Specialization:</strong> ${nutritionist.specialization}</p>
                    <p><strong>Location:</strong> ${nutritionist.location}</p>
                    <p><strong>Contact:</strong> ${nutritionist.contact}</p>
                    <!-- 👇 Book Consultation Button -->
                    <button class="book-btn" onclick="openConsultationForm(${nutritionist.id})">
                              Book Consultation
                       </button>
                `;
                container.appendChild(card);
            });
        })
        .catch(error => console.error("❌ Error fetching filtered nutritionists:", error));
    });

    // ✅ Reset Filters Button Click
    document.getElementById("resetFilters").addEventListener("click", function () {
        document.getElementById("languageFilter").value = "";
        document.getElementById("specializationFilter").value = "";
        document.getElementById("experienceFilter").value = "";

        document.getElementById("filteredNutritionistsContainer").innerHTML = "";

        fetchAllNutritionists();
    });

    // ✅ Update Details Button Click
    document.getElementById("updateDetails").addEventListener("click", function () {
        if (user && user.id) {
            localStorage.setItem("userId", user.id);
            localStorage.setItem("isUpdatingProfile", "true");
        }

        window.location.href = "profile.html";
    });

    // delete profile button

    document.getElementById("deleteProfileBtn").addEventListener("click", async () => {
        const userId = localStorage.getItem("userId");
      
        if (userId && confirm("Are you sure you want to delete your profile?")) {
          try {
            const response = await fetch(`http://localhost:5000/api/userprofile/${userId}`, {
              method: "DELETE",
            });
      
            if (response.ok) {
              alert("Profile deleted successfully.");
              localStorage.clear();
              window.location.href = "/index.html"; // or your login/home page
            } else {
              alert("Failed to delete profile.");
            }
          } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong.");
          }
        }
      });
     



      
    // ✅ Logout
    document.getElementById("logout").addEventListener("click", () => {
        localStorage.clear();
        window.location.href = "login.html";
    });
});
