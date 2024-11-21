import { auth } from './firebaseConfig.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { auth } from "./firebaseConfig.js";
import { uploadFile } from "./fileHandler.js";
// Firebase User Registration
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const email = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            
            // Check if the user data is successfully stored in the backend
            if (userCredential) {
                alert('Registration successful!');
                window.location.href = "profile.html";
                //TODO handle this to update to profile.html
            } else {
                throw new Error("Registration failed: Data not saved in backend.");
            }
        } catch (error) {
            console.error("Error registering user:", error.message);

            // Handle Firebase-specific errors or network errors
            if (error.code === 'auth/network-request-failed') {
                alert("Network error. Please check your internet connection and try again.");
            } else if (error.code === 'auth/email-already-in-use') {
                alert("The email is already in use. Please use a different email.");
            } else if (error.code === 'auth/invalid-email') {
                alert("Invalid email format. Please enter a valid email.");
            } else if (error.code === 'auth/weak-password') {
                alert("Weak password. Please enter a stronger password.");
            } else {
                alert("Registration failed. Please try again later.");
            }
        }
    });
    }
    // Firebase User Login
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const email = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);

            // Check if the user is successfully authenticated
            if (userCredential) {
                alert('Login successful!');
                window.location.href = "profile.html";
            }
        } catch (error) {
            console.error("Error logging in:", error.message);
            // Handle specific error messages
            if (error.code === 'auth/user-not-found') {
                alert("User not found. Please check your email or register.");
            } else if (error.code === 'auth/wrong-password') {
                alert("Incorrect password. Please try again.");
            } else if (error.code === 'auth/network-request-failed') {
                alert("Network error. Please check your internet connection and try again.");
            } else {
                alert("An error occurred during login. Please try again later.");
            }
        }
    });
}
const homeButton = document.getElementById('home-button');
if (homeButton) {
    homeButton.addEventListener('click', () => {
        window.location.href = "index.html";
    });
}

document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("wholesaling.html")) {
        const section = document.querySelector("section");
        const button = document.createElement("button");
        button.textContent = "Learn More";
        section.appendChild(button);

        button.addEventListener("click", () => {
            alert("More wholesaling details coming soon!");
        });
    }
});

// Logout functionality
const logoutButton = document.getElementById('logout');
if (logoutButton) {
    logoutButton.addEventListener('click', async function () {
        try {
            await signOut(auth);
            alert('You have been logged out.');
            window.location.href = "index.html";
        } catch (error) {
            console.error("Error logging out:", error.message);
            // Handle specific error messages
            if (error.code === 'auth/network-request-failed') {
                alert("Network error. Please check your internet connection and try again.");
            } else {
                alert("An error occurred during logout. Please try again later.");
            }
        }
    });
}
// Update navigation link based on authentication state
document.addEventListener("DOMContentLoaded", () => {
    onAuthStateChanged(auth, (user) => {
        const authLink = document.getElementById('auth-link');
        const userDisplay = document.getElementById('user-display');
        const profileUsername = document.getElementById('profile-username'); // Only on profile page

        console.log("Auth state changed:", user ? `User logged in as ${user.email}` : "No user logged in");

        if (authLink) {
            if (user) {
                // User is logged in; update navigation and display
                authLink.innerHTML = `<a href="profile.html">Profile</a>`;
                
                if (userDisplay) {
                    userDisplay.textContent = `Logged in as: ${user.email}`;
                }

                // Display user email on profile page if profileUsername element is found
                if (profileUsername) {
                    profileUsername.textContent = `Logged in as: ${user.email}`;
                    console.log("Displaying user email on profile page:", user.email);
                }
            } else {
                // User is not logged in; reset navigation and profile display
                authLink.innerHTML = `<a href="auth.html">Login/Register</a>`;
                
                if (userDisplay) {
                    userDisplay.textContent = '';
                }
                
                if (profileUsername) {
                    profileUsername.textContent = 'You are not logged in.';
                    console.log("User is not logged in; displaying default message on profile page.");
                }
            }
        }
    });
});

const properties = [
    {
        id: 1,
        location: 'Example Location',
        price: 150000,
        bedrooms: 3,
        type: 'house',
        boundaryCoords: [[51.505, -0.09], [51.51, -0.1], [51.51, -0.12]] // Sample coordinates
    },
    {
        id: 2,
        location: 'Another Location',
        price: 300000,
        bedrooms: 4,
        type: 'condo',
        boundaryCoords: [[51.515, -0.11], [51.52, -0.1], [51.52, -0.13]]
    }
    // Add more properties as needed
];
// Handle Form Submission for Advanced Property Search
const advancedSearchForm = document.getElementById('advanced-search');
if (advancedSearchForm) {
    advancedSearchForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const locationInput = document.getElementById('location').value.toLowerCase();
        const maxPrice = parseInt(document.getElementById('price').value);
        const bedrooms = document.getElementById('bedrooms').value;
        const propertyType = document.getElementById('property-type').value;

        const filteredProperties = properties.filter(property => {
            return (
                (!locationInput || property.location.toLowerCase().includes(locationInput)) &&
                (!maxPrice || property.price <= maxPrice) &&
                (bedrooms === 'any' || property.bedrooms === parseInt(bedrooms)) &&
                (propertyType === 'all' || property.type === propertyType)
            );
        });

        displayPropertiesOnMap(filteredProperties);
    });
}
let map;
// Initialize the map once the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    map = L.map('map').setView([51.505, -0.09], 5);  // Ensure this ID 'map' matches your HTML map container
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    console.log("Map initialized:", map);  // Log map to confirm initialization
});

document.addEventListener("DOMContentLoaded", () => {
    // Initialize map and ensure the container ID 'map' exists
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
        map = L.map('map').setView([51.505, -0.09], 5);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        console.log("Map initialized:", map);  // Confirm map initialization
    } else {
        console.error("Map container with ID 'map' not found.");
    }
});

// Function to display properties on the map
function displayPropertiesOnMap(properties) {
    // Ensure map is initialized before proceeding
    if (!map) {
        console.error("Map is not initialized. Cannot display properties.");
        return;
    }

    // Clear existing layers on the map
    map.eachLayer((layer) => {
        if (layer instanceof L.Marker || layer instanceof L.Polygon) {
            map.removeLayer(layer);
        }
    });

    // Add new property polygons to the map
    properties.forEach(property => {
        const propertyPolygon = L.polygon(property.boundaryCoords, {
            color: 'blue',
            weight: 2,
            fillOpacity: 0.2
        }).addTo(map);

        propertyPolygon.bindPopup(`
            <strong>Property ID:</strong> ${property.id}<br>
            <strong>Price:</strong> $${property.price}<br>
            <strong>Bedrooms:</strong> ${property.bedrooms}
        `);
    });
    
    let currentUser = null;
    
    // Ensure the user is authenticated
    auth.onAuthStateChanged((user) => {
        if (user) {
            currentUser = user;
            console.log("User signed in:", user.email);
        } else {
            alert("Please sign in to access the file system.");
            window.location.href = "/login.html";
        }
    });
    
    // Handle file upload
    document.getElementById("uploadButton").addEventListener("click", async () => {
        const fileInput = document.getElementById("fileInput");
        const descriptionInput = document.getElementById("description");
        const file = fileInput.files[0];
        const description = descriptionInput.value;
    
        if (!file || !currentUser) {
            alert("Please select a file and ensure you're logged in.");
            return;
        }
    
        try {
            await uploadFile(currentUser.uid, file, description);
            alert("File uploaded successfully!");
        } catch (error) {
            alert("File upload failed!");
        }
    });
    

    
}
