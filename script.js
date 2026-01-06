// DOM Elements
const searchBtn = document.getElementById('search-btn');
const userInput = document.getElementById('user-input');
const noResults = document.getElementById('no-results');

// Profile Elements
const avatar = document.querySelector('.avatar');
const userName = document.getElementById('name');
const userLogin = document.getElementById('username');
const joinDate = document.getElementById('date');
const bio = document.getElementById('bio');
const repoCount = document.getElementById('repos');
const followerCount = document.getElementById('followers');
const followingCount = document.getElementById('following');
const locationElem = document.getElementById('location');
const twitterElem = document.getElementById('twitter');
const websiteElem = document.getElementById('website');
const companyElem = document.getElementById('company');

// Event Listeners
searchBtn.addEventListener('click', () => {
    const user = userInput.value;
    if (user) {
        getUserData(user);
    }
});

// Allow pressing "Enter" key to search
userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const user = userInput.value;
        if (user) {
            getUserData(user);
        }
    }
});

// Hide error message when user starts typing again
userInput.addEventListener('input', () => {
    noResults.style.display = 'none';
});

// API Fetch Function
async function getUserData(username) {
    try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        
        if (!response.ok) {
            noResults.style.display = 'block';
            return;
        }

        const data = await response.json();
        updateUI(data);

    } catch (error) {
        console.error(error);
    }

    // Add this inside getUserData(), right after updateUI(data);
getRepos(username); 

// Add this new function at the bottom of the file
async function getRepos(username) {
    const reposEl = document.getElementById('repos-list');
    
    try {
        // Fetch top 5 repos sorted by latest creation
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=created&per_page=5`);
        const data = await response.json();

        reposEl.innerHTML = '<h3>Latest Repositories</h3>'; // Reset header
        
        data.forEach(repo => {
            const repoEl = document.createElement('a');
            repoEl.classList.add('repo');
            repoEl.href = repo.html_url;
            repoEl.target = '_blank';
            
            repoEl.innerHTML = `
                <span class="repo-name">${repo.name}</span>
                <span class="repo-stars"><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
            `;
            
            reposEl.appendChild(repoEl);
        });

    } catch (err) {
        console.error("Problem fetching repos", err);
    }
}

// Update UI Function
function updateUI(user) {
    // 1. Avatar & Names
    avatar.src = user.avatar_url;
    userName.innerText = user.name || user.login;
    userLogin.innerText = `@${user.login}`;
    userLogin.href = user.html_url;

    // 2. Date Formatting (e.g., 2023-01-01 -> 1 Jan 2023)
    const date = new Date(user.created_at);
    const dateOption = { day: 'numeric', month: 'short', year: 'numeric' };
    joinDate.innerText = `Joined ${date.toLocaleDateString('en-GB', dateOption)}`;

    // 3. Bio (Handle Null)
    bio.innerText = user.bio ? user.bio : "This profile has no bio";

    // 4. Stats
    repoCount.innerText = user.public_repos;
    followerCount.innerText = user.followers;
    followingCount.innerText = user.following;

    // 5. Links & Info (Handle Null/Empty values safely)
    checkNull(locationElem, user.location);
    checkNull(twitterElem, user.twitter_username);
    checkNull(companyElem, user.company);
    
    // Website link logic
    if (user.blog) {
        websiteElem.href = user.blog.startsWith('http') ? user.blog : `https://${user.blog}`;
        websiteElem.innerText = user.blog;
        websiteElem.parentElement.style.opacity = 1;
    } else {
        websiteElem.href = "#";
        websiteElem.innerText = "Not Available";
        websiteElem.parentElement.style.opacity = 0.5;
    }
}

// Helper to handle null values for simple text elements
function checkNull(element, value) {
    if (value && value !== "") {
        element.innerText = value;
        element.parentElement.style.opacity = 1;
    } else {
        element.innerText = "Not Available";
        element.parentElement.style.opacity = 0.5;
    }
}
}


