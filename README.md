# Instagram Scraper Chrome Extension

This Chrome extension allows you to scrape followers and following lists from an Instagram profile, download them as `.txt` files, and visit each post on your profile to take screenshots automatically.

## Getting Started

### Prerequisites

- **Google Chrome** browser installed on your computer.
- **Basic knowledge of using Chrome Developer Tools**.

### Installation

1. **Clone or Download the Repository**
   - Clone the repository using Git:
     ```bash
     git clone https://github.com/yourusername/instagram-scraper-extension.git
     ```
   - Or download the repository as a ZIP file and extract it.

2. **Load the Extension into Chrome**

   1. Open Chrome and navigate to the Extensions page:
      - Type `chrome://extensions/` in the Chrome address bar and press Enter.
      
   2. Enable **Developer mode**:
      - Toggle the switch in the upper-right corner of the Extensions page.

   3. Click the **Load unpacked** button:
      - This button will allow you to load the extension from a directory.

   4. Select the directory where you cloned or extracted the repository:
      - Navigate to the folder that contains the `manifest.json` file and click **Select Folder**.

   5. The extension should now appear in your list of extensions.

### Usage

1. **Open Instagram**:
   - Navigate to [Instagram](https://www.instagram.com/) and log in to your account.

2. **Open the Extension**:
   - Click on the Instagram Scraper extension icon in the Chrome toolbar.

3. **Scrape Followers**:
   - Scroll down to make sure all your followers are loaded
   - Click the "Scrape Followers" button to scrape the list of your followers. The list will be downloaded as a `.txt` file.

4. **Scrape Following**:
   - Scroall down to make sure all people you are following are loaded
   - Click the "Scrape Following" button to scrape the list of accounts you are following. The list will be downloaded as a `.txt` file.

5. **Visit Posts and Capture Screenshots**:
   - Click the "Visit Posts" button to automatically visit each post on your Instagram profile and capture screenshots. Screenshots will be saved to a specified folder.

### Troubleshooting

- **Extension Not Appearing**:
  - Ensure that Developer mode is enabled and that you've selected the correct directory containing the `manifest.json` file.
  
- **Unable to Download `.txt` Files**:
  - Ensure you have given the necessary permissions in the `manifest.json` and that Chrome's download settings are properly configured.

- **Screenshots Not Saving**:
  - Verify that the screenshot functionality is correctly configured and that the required permissions are granted in the `manifest.json`.

### Permissions

This extension requires the following permissions:

- `activeTab`: To interact with the currently active tab.
- `downloads`: To save the scraped data and screenshots to your computer.
- `scripting`: To execute scripts in the context of the webpage.

### Development

To make changes or contribute:

1. Clone the repository.
2. Make changes to the codebase.
3. Reload the extension in Chrome by clicking the reload button next to your extension on the `chrome://extensions/` page.

