// 1. SETTINGS: Set your Classroom Center (Get from Google Maps)
const TARGET_LAT = 18.729484; 
const TARGET_LON = 73.665344;
const RADIUS = 0.0005; // Approx 50 meters

const statusText = document.getElementById('status-text');
const locationData = document.getElementById('location-data');

// 2. INITIALIZE SCANNER
function onScanSuccess(decodedText) {
    if (decodedText === "ROOM_302_IT") {
        html5QrcodeScanner.clear(); // Stop camera
        statusText.innerText = "QR Verified! Checking Geofence...";
        statusText.style.color = "orange";
        verifyLocation();
    } else {
        statusText.innerText = "Invalid QR Code!";
        statusText.style.color = "red";
    }
}

// 3. GEOFENCING LOGIC
function verifyLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;

            const latDist = Math.abs(userLat - TARGET_LAT);
            const lonDist = Math.abs(userLon - TARGET_LON);

            if (latDist < RADIUS && lonDist < RADIUS) {
                // SUCCESS
                statusText.innerText = "✅ Attendance Marked Successfully!";
                statusText.style.color = "green";
                locationData.innerHTML = <p>Verified at: ${userLat.toFixed(4)}, ${userLon.toFixed(4)}</p>;
            } else {
                // OUTSIDE RANGE
                statusText.innerText = "❌ Verification Failed: Outside Room 302";
                statusText.style.color = "red";
                locationData.innerHTML = <p>You are too far from the classroom.</p>;
            }
        }, (error) => {
            statusText.innerText = "Location Error: Please enable GPS.";
        });
    }
}

let html5QrcodeScanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
html5QrcodeScanner.render(onScanSuccess);
