// Firebase configuration - REPLACE WITH YOUR ACTUAL CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyBoCfjXbgxvwWuUowIL9hAlhOOCrD10h1s",
  authDomain: "movie-8b28e.firebaseapp.com",
  projectId: "movie-8b28e",
  storageBucket: "movie-8b28e.appspot.com", // Corrected from firebasestorage.app based on typical Firebase config
  messagingSenderId: "304129310229",
  appId: "1:304129310229:web:2f4cc3447e9b2fac75d81c",
  databaseURL: "https://movie-8b28e-default-rtdb.firebaseio.com" // Added common databaseURL format
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

console.log("Firebase initialized (with placeholder config).");

// --- Functions for index.html ---

// Function to save movie review data to Firebase
function saveMovieReview(movieTitle, rating, reviewText) { // posterUrl removed from parameters
  console.log("Attempting to save review for:", movieTitle, rating, reviewText); // posterUrl removed
  if (!movieTitle || !rating) {
    alert("Movie title and rating are required!");
    return;
  }
  const newMovieReviewRef = database.ref('movieReviews').push();
  newMovieReviewRef.set({
    title: movieTitle,
    // poster: posterUrl, // REMOVE THIS LINE
    rating: rating,
    review: reviewText,
    timestamp: Date.now()
  })
  .then(() => {
    console.log("Movie review saved successfully!");
    alert("Movie review saved!");
  })
  .catch((error) => {
    console.error("Error saving movie review: ", error);
    alert("Error saving review. Check console for details.");
  });
}

// --- Functions for index.html (continued) ---

// Modify the saveMovieReview function slightly to use the hidden posterUrl field.
// And ensure the tempSubmit button is handled for now.
// The actual form submission logic will be refined later.

const addReviewForm = document.getElementById('addReviewForm');
if (addReviewForm) {
  addReviewForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent actual form submission for now

    const title = document.getElementById('movieTitle').value;
    // const poster = document.getElementById('posterUrl').value; // REMOVED

    const ratingElement = document.querySelector('input[name="rating"]:checked');
    if (!ratingElement) {
        alert("Please select a rating.");
        return;
    }
    const rating = ratingElement.value;

    const reviewText = document.getElementById('reviewText').value;

    // if (!poster) { ... } // ENTIRE BLOCK REMOVED

    saveMovieReview(title, rating, reviewText); // Call saveMovieReview without poster

    addReviewForm.reset();
    // document.getElementById('posterPreview').style.display = 'none'; // REMOVED
    // document.getElementById('posterUrl').value = ''; // REMOVED
    const charCounter = document.getElementById('charCounter'); // Keep this if it exists
    if (charCounter) { // Reset character counter display
        const MAX_CHARS = 150; // Or get this from a global const if defined elsewhere
        charCounter.textContent = `0/${MAX_CHARS} characters`;
    }
  });
}

const reviewTextArea = document.getElementById('reviewText');
const charCounter = document.getElementById('charCounter');
const MAX_CHARS = 150;

if (reviewTextArea && charCounter) {
    reviewTextArea.addEventListener('input', () => {
        const currentLength = reviewTextArea.value.length;
        charCounter.textContent = `${currentLength}/${MAX_CHARS} characters`;

        if (currentLength > MAX_CHARS) {
            // This is an additional safeguard, maxlength attribute should primarily handle it
            reviewTextArea.value = reviewTextArea.value.substring(0, MAX_CHARS);
            charCounter.textContent = `${MAX_CHARS}/${MAX_CHARS} characters (limit reached)`;
        }
    });
}

// --- Functions for search.html ---

// Helper function to display reviews in the container
function displayReviews(reviewsData, container) {
    container.innerHTML = ''; // Clear previous results
    if (reviewsData && Object.keys(reviewsData).length > 0) {
        for (const key in reviewsData) {
            const review = reviewsData[key];
            const reviewElement = document.createElement('div');
            reviewElement.classList.add('review-item'); // For styling
            // Ensure review.poster is no longer referenced
            reviewElement.innerHTML = `
              <h3>${review.title}</h3>
              <p>Rating: ${review.rating} stars</p>
              <p>Review: ${review.review}</p>
              <small>Reviewed on: ${new Date(review.timestamp).toLocaleDateString()}</small>
                <hr>
            `;
            container.appendChild(reviewElement);
        }
    } else {
        container.innerHTML = '<p>No reviews found matching your criteria.</p>';
    }
}

// Function to fetch and display ALL movie reviews
function fetchAllMovieReviews() {
    console.log("Fetching all movie reviews...");
    const reviewsRef = database.ref('movieReviews').orderByChild('timestamp'); // Order by timestamp
    const reviewsContainer = document.getElementById('reviewsContainer');

    if (!reviewsContainer) {
        console.log("reviewsContainer not found in search.html.");
        return;
    }

    reviewsRef.on('value', (snapshot) => {
        displayReviews(snapshot.val(), reviewsContainer);
    }, (error) => {
        console.error("Error fetching all reviews: ", error);
        reviewsContainer.innerHTML = '<p>Error loading reviews.</p>';
    });
}

// Function to search movie reviews by title (case-insensitive)
function searchMovieReviews(searchTerm) {
    console.log("Searching for reviews with term:", searchTerm);
    const reviewsContainer = document.getElementById('reviewsContainer');
    if (!reviewsContainer) return;

    if (!searchTerm || searchTerm.trim() === "") {
        fetchAllMovieReviews(); // If search term is empty, show all
        return;
    }

    reviewsContainer.innerHTML = '<p>Searching...</p>'; // Feedback to user
    const reviewsRef = database.ref('movieReviews').orderByChild('title');

    reviewsRef.on('value', (snapshot) => {
        const allReviews = snapshot.val();
        const filteredReviews = {};
        if (allReviews) {
            for (const key in allReviews) {
                if (allReviews[key].title.toLowerCase().includes(searchTerm.toLowerCase())) {
                    filteredReviews[key] = allReviews[key];
                }
            }
        }
        displayReviews(filteredReviews, reviewsContainer);
    }, (error) => {
        console.error("Error searching reviews: ", error);
        reviewsContainer.innerHTML = '<p>Error searching reviews.</p>';
    });
}

// --- Event listeners for search.html ---
// Ensure this part of the script runs only on search.html or check for element existence

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const reviewsContainerGlobal = document.getElementById('reviewsContainer'); // Used to check if we are on search.html

if (reviewsContainerGlobal) { // If reviewsContainer exists, we are likely on search.html
    // Initial load of all reviews
    fetchAllMovieReviews();

    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const searchTerm = searchInput.value;
            searchMovieReviews(searchTerm);
        });
    }

    if (searchInput) {
        // Optional: Allow search on Enter key press
        searchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                const searchTerm = searchInput.value;
                searchMovieReviews(searchTerm);
            }
        });
    }

    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
            searchInput.value = '';
            fetchAllMovieReviews(); // Show all reviews
        });
    }
}
