// main.js

let items = [];

// Load items from server when page opens
window.onload = async function () {
    await loadItems();
};

// Fetch all items from backend
async function loadItems() {
    try {
        const res = await fetch("/items");
        items = await res.json();
        displayItems(items);
    } catch (err) {
        console.error("Failed to load items:", err);
    }
}

// Display items
function displayItems(filteredItems) {
    const container = document.getElementById("itemsContainer");
    container.innerHTML = "";

    filteredItems.forEach(item => {
        container.innerHTML += `
            <div class="card">
                ${item.photo ? `
                    <img src="${item.photo}" class="thumbnail">
                ` : ""}

                <h3>${item.name}</h3>
                <p><strong>Location:</strong> ${item.location}</p>
                <p>${item.description}</p>

                ${item.photo ? `
                    <a href="/view-photo/${item.id}">
                        <button class="btn-primary">📷 View Photo</button>
                    </a>
                ` : ""}

                <br><br>
                <span class="tag ${item.type.toLowerCase()}">${item.type}</span>
            </div>
        `;
    });
    console.log(item);
}

// Upload photo to backend
async function uploadPhoto(file) {
    const formData = new FormData();
    formData.append("photo", file);

    const res = await fetch("/upload", {
        method: "POST",
        body: formData
    });

    const data = await res.json();
    return data.photoPath;
}

// Add item (Save button)
async function addItem() {
    const name = document.getElementById("itemName").value;
    const location = document.getElementById("location").value;
    const date = document.getElementById("date").value;
    const contact = document.getElementById("contact").value;
    const type = document.getElementById("type").value;
    const description = document.getElementById("description").value;
    const photoInput = document.getElementById("photo");

    if (!name || !location) {
        alert("Please fill Name and Location");
        return;
    }

    let photoPath = "";

    // Upload photo first
    if (photoInput.files[0]) {
        photoPath = await uploadPhoto(photoInput.files[0]);
    }

    // Save item to backend
    const res = await fetch("/save-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name,
            location,
            date,
            contact,
            type,
            description,
            photo: photoPath
        })
    });

    const data = await res.json();

    if (data.success) {
        await loadItems(); // reload items from server
        document.getElementById("addForm").reset();
        document.getElementById("preview").style.display = "none";
    } else {
        alert("Error saving item");
    }
}

// Filter
function filterItems(type) {
    if (type === "ALL") {
        displayItems(items);
    } else {
        displayItems(items.filter(item => item.type === type));
    }
}

// Toggle form
function toggleForm() {
    const form = document.getElementById("addForm");
    form.style.display = form.style.display === "flex" ? "none" : "flex";
}

// Search
document.getElementById("searchInput").addEventListener("keyup", function () {
    const value = this.value.toLowerCase();
    displayItems(items.filter(item =>
        item.name.toLowerCase().includes(value)
    ));
});

// Photo preview
document.getElementById("photo").addEventListener("change", function () {
    const preview = document.getElementById("preview");

    if (this.files[0]) {
        preview.src = URL.createObjectURL(this.files[0]);
        preview.style.display = "block";
    } else {
        preview.src = "";
        preview.style.display = "none";
    }
});