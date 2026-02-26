// ===== STORAGE =====
let items = JSON.parse(localStorage.getItem("trackitItems")) || [];

// ===== TOGGLE ADD FORM =====
function toggleForm() {
    const form = document.getElementById("addForm");
    form.style.display = form.style.display === "flex" ? "none" : "flex";
}

// ===== IMAGE PREVIEW =====
document.getElementById("photo").addEventListener("change", function () {
    const file = this.files[0];
    const preview = document.getElementById("preview");

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.style.display = "block";
        };
        reader.readAsDataURL(file);
    }
});

// ===== ADD ITEM =====
function addItem() {
    const name = document.getElementById("itemName").value;
    const location = document.getElementById("location").value;
    const date = document.getElementById("date").value;
    const contact = document.getElementById("contact").value;
    const type = document.getElementById("type").value;
    const description = document.getElementById("description").value;
    const photo = document.getElementById("preview").src;

    if (!name || !location || !date || !contact || !description) {
        alert("Please fill all fields");
        return;
    }

    const newItem = {
        id: Date.now(),
        name,
        location,
        date,
        contact,
        type,
        description,
        photo
    };

    items.unshift(newItem);
    localStorage.setItem("trackitItems", JSON.stringify(items));

    displayItems(items);
    document.getElementById("addForm").style.display = "none";
    alert("Item added successfully!");
}

// ===== DISPLAY ITEMS =====
function displayItems(data) {
    const container = document.getElementById("itemsContainer");
    container.innerHTML = "";

    if (data.length === 0) {
        container.innerHTML = "<p style='text-align:center;'>No items found.</p>";
        return;
    }

    data.forEach(item => {
        const tagClass = item.type === "LOST" ? "lost" : "found";

        container.innerHTML += `
            <div class="card">
                ${item.photo ? `<img src="${item.photo}">` : ""}
                <span class="tag ${tagClass}">${item.type}</span>
                <h3>${item.name}</h3>
                <p><strong>Location:</strong> ${item.location}</p>
                <p><strong>Date:</strong> ${item.date}</p>
                <p>${item.description}</p>
                <p><strong>Contact:</strong> ${item.contact}</p>
            </div>
        `;
    });
}

// ===== FILTER =====
function filterItems(type) {
    if (type === "ALL") {
        displayItems(items);
    } else {
        const filtered = items.filter(item => item.type === type);
        displayItems(filtered);
    }
}

// ===== SEARCH =====
document.getElementById("searchInput").addEventListener("keyup", function () {
    const keyword = this.value.toLowerCase();

    const filtered = items.filter(item =>
        item.name.toLowerCase().includes(keyword) ||
        item.location.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword)
    );

    displayItems(filtered);
});

// ===== CONTACT FORM SUCCESS =====
document.getElementById("contactForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const successMsg = document.getElementById("successMessage");
    successMsg.style.display = "block";

    this.reset();

    setTimeout(() => {
        successMsg.style.display = "none";
    }, 3000);
});

// ===== INITIAL LOAD =====
displayItems(items);
// ===== FETCH STATS =====
async function loadStats() {
    try {
        const res = await fetch("/api/stats");
        const data = await res.json();

        document.getElementById("totalItems").innerText = data.totalItems;
        document.getElementById("recoveredItems").innerText = data.recoveredItems;
        document.getElementById("totalUsers").innerText = data.totalUsers;

    } catch (error) {
        console.log("Error loading stats");
    }
}

loadStats();