# GRE Word Memorizer

A web-based application designed to help students memorize GRE vocabulary efficiently through an interactive flashcard system.

## Overview

GRE Word Memorizer is a lightweight, browser-based tool that organizes GRE vocabulary into manageable groups. It helps users track their learning progress by marking words as "Known," "Learning," or "New" and provides features like word pronunciation, definitions, examples, and synonyms.

## Features

- **Organized Word Groups**: Access vocabulary organized into multiple groups for structured learning
- **Progress Tracking**: Mark words as "Known" (green), "Learning" (red), or "New" (white)
- **Word Details**: View definitions, example sentences, and synonyms for each word
- **Text-to-Speech**: Hear the pronunciation of each word
- **Shuffle Options**: 
  - Shuffle words within the current group
  - Shuffle words across multiple groups for comprehensive review
- **Statistics**: Track your learning progress with visual statistics
- **Keyboard Shortcuts**: Navigate and mark words quickly with keyboard shortcuts
- **Responsive Design**: Works on desktop and mobile devices
- **Persistent Storage**: Progress is saved in local storage between sessions

## Installation

1. Clone or download this repository
2. Open `index.html` in a modern web browser
3. No server or build process required - it's pure HTML, CSS, and JavaScript!

## How to Use

### Basic Navigation

- Click on any word card to see its definition, example, and synonyms
- Use the dropdown menu to switch between word groups
- Click buttons to shuffle, reset, or manipulate the display

### Marking Words

- Click on a word to select it
- Use the keyboard shortcuts or click multiple times to change its status:
  - **G**: Mark as "Known" (green)
  - **R**: Mark as "Learning" (red)
  - **W**: Mark as "New" (white)

### Keyboard Shortcuts

- **←/→**: Navigate to previous/next word
- **G**: Mark selected word as "Known" (green)
- **R**: Mark selected word as "Learning" (red)
- **W**: Mark selected word as "New" (white)
- **S**: Speak the selected word
- **D**: Toggle word details modal
- **Escape**: Close the details modal

### Additional Controls

- **Shuffle Group**: Randomize the order of words in the current group
- **Shuffle Multiple Groups**: Combine and shuffle words from all groups up to the current one
- **Reset Shuffle**: Return to the original order of words
- **Reset All Marking**: Reset the status of all words in all groups to "New"
- **Reset Current Group**: Reset only the current group's word statuses to "New"

## Recent Updates

### Bug Fixes
- Fixed statistics display issue when changing groups
- Fixed "Reset All Marking" feature to correctly reset all groups, not just the current one
- Improved progress tracking to ensure all words have correct status initialized

## Technical Details

- **Languages**: HTML, CSS, JavaScript
- **Storage**: Uses browser's localStorage API for persistent data
- **Compatibility**: Works on modern browsers that support ES6+ JavaScript
- **Dependencies**: No external libraries required

## File Structure

- `index.html`: Main application HTML
- `styles.css`: Application styling
- `data.js`: GRE vocabulary data structure
- `script.js`: Application logic and functionality

## Contributing

Feel free to fork this repository and submit pull requests for enhancements or additional vocabulary groups.
