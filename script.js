// Main JavaScript functionality for the GRE Word Memorizer app

// Global variables
let currentGroup = "Group 1";
let selectedWordIndex = -1;
let groups = Object.keys(wordData);
let currentWords = [...wordData[currentGroup]];
let userProgress = {};
let inMixedMode = false; // Track if we're in mixed mode

// DOM elements
const wordContainer = document.getElementById('wordContainer');
const groupSelector = document.getElementById('groupSelector');
const groupDropdown = document.getElementById('groupDropdown');
const modal = document.getElementById('wordModal');
const modalWord = document.getElementById('modalWord');
const modalDefinition = document.getElementById('modalDefinition');
const modalExample = document.getElementById('modalExample');
const modalSynonyms = document.getElementById('modalSynonyms');
const closeModal = document.querySelector('.close');

// Initialize the app
function initializeApp() {
    loadUserProgress();
    populateGroupDropdown();
    displayWords(currentGroup);
    updateGroupStats(); // Add statistics display
    setupEventListeners();
}

// Load user progress from local storage
function loadUserProgress() {
    const savedProgress = localStorage.getItem('greWordProgress');
    if (savedProgress) {
        userProgress = JSON.parse(savedProgress);
        
        // Ensure all groups and words have progress entries
        initializeAllGroupsProgress();
    } else {
        // Initialize empty progress for each group
        initializeAllGroupsProgress();
    }
}

// Initialize progress for all groups and words
function initializeAllGroupsProgress() {
    groups.forEach(group => {
        if (!userProgress[group]) {
            userProgress[group] = {};
        }
        
        // Make sure every word has a status
        wordData[group].forEach(word => {
            if (!userProgress[group][word.word]) {
                userProgress[group][word.word] = { status: 'white' };
            }
        });
    });
}

// Save user progress to local storage
function saveUserProgress() {
    localStorage.setItem('greWordProgress', JSON.stringify(userProgress));
}

// Populate the group dropdown menu
function populateGroupDropdown() {
    groupDropdown.innerHTML = '';
    groups.forEach(group => {
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = group;
        link.addEventListener('click', () => {
            changeGroup(group);
        });
        groupDropdown.appendChild(link);
    });
}

// Change the current group
function changeGroup(group) {
    currentGroup = group;
    groupSelector.textContent = group;
    currentWords = [...wordData[group]];
    selectedWordIndex = -1;
    inMixedMode = false; // Reset mixed mode when changing groups
    
    // Ensure all words in this group have a progress entry
    if (!userProgress[group]) {
        userProgress[group] = {};
    }
    
    wordData[group].forEach(wordObj => {
        if (!userProgress[group][wordObj.word]) {
            userProgress[group][wordObj.word] = { status: 'white' };
        }
    });
    
    displayWords(group);
    updateGroupStats(); // Update statistics when changing groups
}

// Display words for the selected group
function displayWords(group) {
    wordContainer.innerHTML = '';
    
    currentWords.forEach((wordObj, index) => {
        const wordCard = document.createElement('div');
        wordCard.className = 'word-card';
        
        // Find which group this word belongs to
        let wordGroup = group;
        if (inMixedMode) {
            for (const g of groups) {
                if (wordData[g].some(w => w.word === wordObj.word)) {
                    wordGroup = g;
                    break;
                }
            }
        }
        
        // Apply saved status if available
        if (userProgress[wordGroup] && userProgress[wordGroup][wordObj.word]) {
            const status = userProgress[wordGroup][wordObj.word].status;
            if (status) {
                wordCard.classList.add(status);
            }
        }
        
        wordCard.dataset.index = index;
        wordCard.dataset.word = wordObj.word;
        wordCard.dataset.group = wordGroup;
        
        const wordText = document.createElement('div');
        wordText.className = 'word-text';
        wordText.textContent = wordObj.word;
        
        wordCard.appendChild(wordText);
        
        // Add event listeners to word card
        wordCard.addEventListener('click', () => {
            selectWord(index);
            showWordDetails(wordObj);
        });
        
        wordContainer.appendChild(wordCard);
    });
}

// Select a word and make it active
function selectWord(index) {
    // Remove selection from previously selected word
    const previouslySelected = document.querySelector('.word-card.selected');
    if (previouslySelected) {
        previouslySelected.classList.remove('selected');
    }
    
    selectedWordIndex = index;
    
    // Add selection to newly selected word
    const selectedCard = document.querySelector(`.word-card[data-index="${index}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
        
        // Add this line to scroll the selected word into view
        selectedCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Add a quick animation to make selection more noticeable
        selectedCard.classList.add('pulse-animation');
        setTimeout(() => {
            selectedCard.classList.remove('pulse-animation');
        }, 500);
    }
}

// Show word details in the modal
function showWordDetails(wordObj) {
    modalWord.textContent = wordObj.word;
    modalDefinition.textContent = wordObj.definition;
    modalExample.textContent = wordObj.example;
    modalSynonyms.textContent = `Synonyms: ${wordObj.synonyms}`;
    
    modal.style.display = 'block';
}

// Mark a word with a specific status
function markWord(status) {
    if (selectedWordIndex === -1) return;
    
    const wordObj = currentWords[selectedWordIndex];
    const selectedCard = document.querySelector(`.word-card[data-index="${selectedWordIndex}"]`);
    
    if (selectedCard) {
        // Remove existing status classes
        selectedCard.classList.remove('green', 'red', 'white');
        
        // Add new status class
        selectedCard.classList.add(status);
        
        // Determine the correct group for this word
        let wordGroup = currentGroup;
        if (inMixedMode) {
            wordGroup = selectedCard.dataset.group;
        }
        
        // Update user progress
        if (!userProgress[wordGroup]) {
            userProgress[wordGroup] = {};
        }
        
        userProgress[wordGroup][wordObj.word] = { status };
        saveUserProgress();
        updateGroupStats(); // Update statistics when marking a word
    }
}

// Speak the word using speech synthesis
function speakWord() {
    if (selectedWordIndex === -1) return;
    
    const wordObj = currentWords[selectedWordIndex];
    const utterance = new SpeechSynthesisUtterance(wordObj.word);
    speechSynthesis.speak(utterance);
}

// Shuffle words within the current group
function shuffleCurrentGroup() {
    currentWords = [...currentWords].sort(() => Math.random() - 0.5);
    inMixedMode = false;
    displayWords(currentGroup);
    updateGroupStats(); // Update statistics after shuffling
}

// Shuffle words across multiple groups
function shuffleMultipleGroups() {
    // Find the current group index
    const currentGroupIndex = groups.indexOf(currentGroup);
    let allWords = [];
    
    // Collect words from groups up to the current one
    for (let i = 0; i <= currentGroupIndex; i++) {
        allWords = allWords.concat(wordData[groups[i]]);
    }
    
    // Shuffle all words
    currentWords = [...allWords].sort(() => Math.random() - 0.5);
    
    // Set mixed mode flag
    inMixedMode = true;
    
    // Update UI to show we're in a special shuffle mode
    groupSelector.textContent = `Mixed: Groups 1-${currentGroupIndex + 1}`;
    
    // Display the shuffled words
    displayWords(currentGroup);
    
    // Update stats for mixed mode
    updateGroupStats();
}

// Reset the shuffle and go back to original order
function resetShuffle() {
    currentWords = [...wordData[currentGroup]];
    inMixedMode = false;
    displayWords(currentGroup);
    updateGroupStats(); // Update statistics after reset
}

// Reset ALL marking in ALL groups
function resetAllMarking() {
    // Reset ALL groups regardless of current mode
    groups.forEach(group => {
        if (wordData[group]) {
            wordData[group].forEach(word => {
                if (!userProgress[group]) {
                    userProgress[group] = {};
                }
                userProgress[group][word.word] = { status: 'white' };
            });
        }
    });
    
    saveUserProgress();
    displayWords(currentGroup);
    updateGroupStats(); // Update statistics when resetting marking
}

// Reset marking for the current day/group
function resetCurrentDay() {
    // Reset only the current group
    const words = wordData[currentGroup];
    
    // Reset user progress for current group
    words.forEach(word => {
        if (!userProgress[currentGroup]) {
            userProgress[currentGroup] = {};
        }
        userProgress[currentGroup][word.word] = { status: 'white' };
    });
    
    saveUserProgress();
    displayWords(currentGroup);
    updateGroupStats(); // Update statistics when resetting current day
}

// Navigate to the next word
function navigateNext() {
    if (selectedWordIndex < currentWords.length - 1) {
        selectWord(selectedWordIndex + 1);
    }
}

// Navigate to the previous word
function navigatePrevious() {
    if (selectedWordIndex > 0) {
        selectWord(selectedWordIndex - 1);
    }
}

// Calculate and display group statistics
function updateGroupStats() {
    // First check if stats element exists, if not create it
    let statsElement = document.getElementById('groupStats');
    if (!statsElement) {
        statsElement = document.createElement('div');
        statsElement.id = 'groupStats';
        statsElement.className = 'group-stats';
        
        // Insert it after the instructions div
        const instructions = document.querySelector('.instructions');
        instructions.parentNode.insertBefore(statsElement, instructions.nextSibling);
    }
    
    // Initialize stats object
    const stats = { green: 0, red: 0, white: 0 };
    
    if (inMixedMode) {
        // For mixed mode, count across all relevant groups
        const currentGroupIndex = groups.indexOf(currentGroup);
        
        // Get all unique words in the current display
        const uniqueWords = new Set();
        currentWords.forEach(word => uniqueWords.add(word.word));
        
        // Count the statistics for these words from their respective groups
        uniqueWords.forEach(wordText => {
            let wordGroup = null;
            
            // Find which group this word belongs to
            for (let i = 0; i <= currentGroupIndex; i++) {
                const group = groups[i];
                if (wordData[group].some(w => w.word === wordText)) {
                    wordGroup = group;
                    break;
                }
            }
            
            if (wordGroup && userProgress[wordGroup] && userProgress[wordGroup][wordText]) {
                const status = userProgress[wordGroup][wordText].status || 'white';
                stats[status]++;
            } else {
                stats.white++; // Default to white if no status is found
            }
        });
    } else {
        // For single group mode, just count that group
        if (userProgress[currentGroup]) {
            // Get all words in the current group
            const groupWords = wordData[currentGroup].map(word => word.word);
            
            // Count status for each word
            groupWords.forEach(wordText => {
                if (userProgress[currentGroup][wordText]) {
                    const status = userProgress[currentGroup][wordText].status || 'white';
                    stats[status]++;
                } else {
                    stats.white++; // Default to white if no status is found
                }
            });
        } else {
            // If no user progress for this group, all words are white
            stats.white = wordData[currentGroup].length;
        }
    }
    
    // Create stats HTML
    statsElement.innerHTML = `
        <div class="stat-item green-stat">Known: ${stats.green}</div>
        <div class="stat-item red-stat">Learning: ${stats.red}</div>
        <div class="stat-item white-stat">New: ${stats.white}</div>
        <div class="stat-item total-stat">Total: ${stats.green + stats.red + stats.white}</div>
    `;
}

// Setup event listeners
function setupEventListeners() {
    // Close modal when clicking the X
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    // Close modal when clicking outside of it
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Button event listeners
    document.getElementById('shuffleGroup').addEventListener('click', shuffleCurrentGroup);
    document.getElementById('shuffleMultiple').addEventListener('click', shuffleMultipleGroups);
    document.getElementById('resetShuffle').addEventListener('click', resetShuffle);
    document.getElementById('resetMarking').addEventListener('click', resetAllMarking);
    document.getElementById('resetDay').addEventListener('click', resetCurrentDay);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (event) => {
        // Ignore keyboard shortcuts when typing in an input field
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return;
        }
        
        switch (event.key.toLowerCase()) {
            case 'arrowleft':
                navigatePrevious();
                break;
            case 'arrowright':
                navigateNext();
                break;
            case 'g':
                markWord('green');
                break;
            case 'r':
                markWord('red');
                break;
            case 'w':
                markWord('white');
                break;
            case 's':
                speakWord();
                break;
            case 'd':
                if (modal.style.display === 'block') {
                    // Close modal if it's open
                    modal.style.display = 'none';
                } else if (selectedWordIndex !== -1) {
                    // Show details if modal is closed and a word is selected
                    showWordDetails(currentWords[selectedWordIndex]);
                }
                break;
            case 'escape':
                // Close modal with Escape key
                if (modal.style.display === 'block') {
                    modal.style.display = 'none';
                }
                break;
        }
    });
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeApp);
