// input container
function toggleDropdown() {
    const dropdown = document.getElementById("dropdown");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
  }
  
  window.onclick = function(event) {
    if (!event.target.matches('.custom-input')) {
      const dropdown = document.getElementById("dropdown");
      if (dropdown.style.display === "block") {
        dropdown.style.display = "none";
      }
    }
  }