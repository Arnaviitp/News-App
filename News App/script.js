const API_KEY = "d967f5a37053448fb4e553c62d53d64a";
let page = 1;
let query = "India"; // Default query to India news
let category = "";
let loading = false;

const newsContainer = document.getElementById("news-container");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("search");
const darkModeToggle = document.getElementById("darkModeToggle");
const categoryButtons = document.querySelectorAll(".category-btn");

// Slider elements
const slider = document.getElementById("slider");
const prevSlideBtn = document.getElementById("prevSlide");
const nextSlideBtn = document.getElementById("nextSlide");
let currentSlide = 0;
let sliderInterval;

// Fetch Top Stories (India)
async function fetchTopStories() {
    const url = `https://newsapi.org/v2/everything?q=India&page=1&pageSize=5&sortBy=publishedAt&apiKey=${API_KEY}`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.articles.length > 0) {
            displayTopStories(data.articles.slice(0, 5));
        } else {
            slider.innerHTML = "<div class='slide'><h2>No top stories found.</h2></div>";
        }
    } catch (error) {
        console.error("Failed to load top stories:", error);
    }
}

function displayTopStories(articles) {
    slider.innerHTML = "";
    articles.forEach((article) => {
        const slide = document.createElement("div");
        slide.classList.add("slide");
        slide.style.backgroundImage = `url('${article.urlToImage || "https://via.placeholder.com/800x300"}')`;
        slide.innerHTML = `<h2><a href="${article.url}" target="_blank" style="color:white;text-decoration:none;">${article.title}</a></h2>`;
        slider.appendChild(slide);
    });

    startSlider();
}

function startSlider() {
    const totalSlides = slider.children.length;
    clearInterval(sliderInterval);
    sliderInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    }, 5000);

    prevSlideBtn.onclick = () => {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    };

    nextSlideBtn.onclick = () => {
        currentSlide = (currentSlide + 1) % totalSlides;
        slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    };
}

// Fetch News
async function fetchNews(reset = false) {
    if (loading) return;
    loading = true;

    const keyword = query + (category ? ` ${category}` : "");
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(keyword)}&page=${page}&pageSize=10&sortBy=publishedAt&apiKey=${API_KEY}`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (reset) newsContainer.innerHTML = "";
        displayNews(data.articles);
    } catch (error) {
        newsContainer.innerHTML = "<p>Failed to fetch news.</p>";
    }

    loading = false;
}

function displayNews(articles) {
    if (!articles || articles.length === 0) {
        newsContainer.innerHTML += "<p>No more news found.</p>";
        return;
    }

    articles.forEach(article => {
        const card = document.createElement("div");
        card.classList.add("news-card");

        card.innerHTML = `
            <img src="${article.urlToImage || 'https://via.placeholder.com/300'}" alt="News Image">
            <div class="content">
                <h2>${article.title}</h2>
                <p>${article.description || ""}</p>
                <a href="${article.url}" target="_blank">Read More</a>
            </div>
        `;

        newsContainer.appendChild(card);
    });
}

// Search event
searchBtn.addEventListener("click", () => {
    query = searchInput.value.trim() || "India";
    category = ""; 
    setActiveCategory("");
    page = 1;
    fetchNews(true);
});

// Category filter
categoryButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        category = btn.getAttribute("data-category");
        query = "India"; // Always focus on India news
        searchInput.value = "";
        page = 1;
        setActiveCategory(category);
        fetchNews(true);
    });
});

function setActiveCategory(cat) {
    categoryButtons.forEach(btn => btn.classList.remove("active"));
    document.querySelector(`.category-btn[data-category="${cat}"]`).classList.add("active");
}

// Infinite scrolling
window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !loading) {
        page++;
        fetchNews();
    }
});

// Dark mode toggle
darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    darkModeToggle.textContent = document.body.classList.contains("dark") ? "☀️ Light Mode" : "🌙 Dark Mode";
});

// Load default news and slider
fetchTopStories();
fetchNews();
