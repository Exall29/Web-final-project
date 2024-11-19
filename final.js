function openSidebar() {
    document.getElementById("mySidebar").style.left = "0";
    document.getElementById("mainContent").classList.add("shift");
    document.querySelector(".open-btn").style.display = "none"; // Masque le bouton
}

function closeSidebar() {
    document.getElementById("mySidebar").style.left = "-250px";
    document.getElementById("mainContent").classList.remove("shift");
    document.querySelector(".open-btn").style.display = "block"; // Réaffiche le bouton
}