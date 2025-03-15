// API keys for external services (weather, news, and Wikipedia)
const apiKeyWeather = 'YOUR_OPENWEATHERMAP_API_KEY';
const apiKeyNews = 'YOUR_NEWSAPI_KEY';
const wikiEndpoint = 'https://en.wikipedia.org/w/api.php';

// Function to send a message to the chat box
function addMessage(message, sender = 'bot') {
    const chatBox = document.getElementById('chat-box');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add(sender);
    messageDiv.textContent = message;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to handle user input
function handleUserInput() {
    const userInput = document.getElementById('user-input').value.trim();
    if (userInput) {
        addMessage(userInput, 'user');
        document.getElementById('user-input').value = '';

        // Simple NLP to determine the type of query
        if (userInput.toLowerCase().includes("weather")) {
            getWeatherInfo(userInput);
        } else if (userInput.toLowerCase().includes("news")) {
            getCurrentNews();
        } else if (userInput.toLowerCase().includes("tell me about")) {
            getGeneralKnowledge(userInput);
        } else {
            addMessage("Sorry, I didn't understand that. Try asking something like 'What's the weather?' or 'Tell me about AI'.", 'bot');
        }
    }
}

// Function to fetch weather information using OpenWeatherMap
function getWeatherInfo(query) {
    const city = query.split("weather in ")[1] || "London"; // Default to London if no city is specified
    addMessage(`Fetching weather data for ${city}...`, 'bot');
    
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKeyWeather}&units=metric`)
        .then(response => response.json())
        .then(data => {
            if (data.main) {
                addMessage(`The current temperature in ${city} is ${data.main.temp}°C.`, 'bot');
            } else {
                addMessage("Sorry, I couldn't find weather data for that city.", 'bot');
            }
        })
        .catch(() => addMessage("Error fetching weather data.", 'bot'));
}

// Function to fetch current news using NewsAPI
function getCurrentNews() {
    addMessage("Fetching the latest news for you...", 'bot');
    
    fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKeyNews}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'ok' && data.articles.length > 0) {
                let newsSummary = "Here are the latest headlines:\n";
                data.articles.slice(0, 3).forEach(article => {
                    newsSummary += `- ${article.title}\n`;
                });
                addMessage(newsSummary, 'bot');
            } else {
                addMessage("Sorry, I couldn't fetch the news.", 'bot');
            }
        })
        .catch(() => addMessage("Error fetching news.", 'bot'));
}

// Function to fetch general knowledge from Wikipedia
function getGeneralKnowledge(query) {
    const topic = query.split("tell me about ")[1] || "AI"; // Default to "AI" if no topic is specified
    addMessage(`Searching for information about "${topic}"...`, 'bot');

    fetch(`${wikiEndpoint}?action=query&format=json&prop=extracts&exintro&explaintext&titles=${topic}`)
        .then(response => response.json())
        .then(data => {
            const pages = data.query.pages;
            const page = pages[Object.keys(pages)[0]];
            if (page && page.extract) {
                addMessage(page.extract, 'bot');
            } else {
                addMessage("Sorry, I couldn't find any information on that topic.", 'bot');
            }
        })
        .catch(() => addMessage("Error fetching information.", 'bot'));
}
