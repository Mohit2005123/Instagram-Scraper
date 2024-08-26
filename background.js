// In background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "startScrapingFollowers") {
        chrome.scripting.executeScript({
            target: { tabId: sender.tab.id },
            function: scrapeFollowers
        });
    }
    if (request.action === "startScrapingFollowing") {
        chrome.scripting.executeScript({
            target: { tabId: sender.tab.id },
            function: scrapeFollowing
        });
    }
    if (request.action === "captureScreenshot") {
        chrome.tabs.captureVisibleTab(sender.tab.windowId, { format: 'png' }, (dataUrl) => {
            // Trigger the download using the Chrome downloads API
            chrome.downloads.download({
                url: dataUrl,
                filename: request.filename,
                saveAs: true
            }, () => {
                console.log(`Screenshot saved as ${request.filename}`);
                sendResponse({ success: true });
            });
        });

        // Indicate that the response will be sent asynchronously
        return true;
    }
});

function scrapeFollowers() {
    (async () => {
        console.log('Followers scraping is started');
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        const followersButton = document.querySelector('a[href*="followers"]');
        if (followersButton) {
            followersButton.click();
        } else {
            console.error('Followers button not found.');
            return;
        }

        await delay(2000);

        let modal;
        for (let i = 0; i < 20; i++) {
            modal = document.querySelector('div[role="dialog"]');
            if (modal) break;
            await delay(1000);
        }

        if (!modal) {
            console.error('Followers modal not found.');
            return;
        }

        let lastHeight = modal.scrollHeight;
        while (true) {
            modal.scrollTop = modal.scrollHeight;
            await delay(1000);

            let newHeight = modal.scrollHeight;
            if (newHeight === lastHeight) break;
            lastHeight = newHeight;
        }

        const scrollableDiv = modal.querySelector('div[style*="height: auto; overflow: hidden auto;"]');
        if (!scrollableDiv) {
            console.error('Scrollable div not found.');
            return;
        }

        const followers = [];
        const followersItems = scrollableDiv.querySelectorAll('a.x1i10hfl.xjbqb8w.x1ejq31n.xd10rxx.x1sy0etr.x17r0tee.x972fbf.xcfux6l.x1qhh985.xm0m39n.x9f619.x1ypdohk.xt0psk2.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x16tdsg8.x1hl2dhg.xggy1nq.x1a2a7pz.notranslate._a6hd');

        if (followersItems.length === 0) {
            console.error('No followers found. The selector may need adjustment or the content might not be fully loaded.');
        } else {
            followersItems.forEach((anchor) => {
                const username = anchor.innerText.trim();
                const link = anchor.href;
                if (username) {
                    followers.push({
                        username: username,
                        link: link
                    });
                }
            });

            chrome.runtime.sendMessage({ action: "updateFollowerList", followers });
        }
    })();
}

function scrapeFollowing() {
    (async () => {
        console.log('Following scraping started');
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        const followingButton = document.querySelector('a[href*="following"]');
        if (followingButton) {
            followingButton.click();
        } else {
            console.error('Following button not found.');
            return;
        }

        await delay(5000);

        let modal;
        for (let i = 0; i < 20; i++) {
            modal = document.querySelector('div[role="dialog"]');
            if (modal) break;
            await delay(1000);
        }

        if (!modal) {
            console.error('Following modal not found.');
            return;
        }

        let lastHeight = modal.scrollHeight;
        while (true) {
            modal.scrollTop = modal.scrollHeight;
            await delay(1000);

            let newHeight = modal.scrollHeight;
            if (newHeight === lastHeight) break;
            lastHeight = newHeight;
        }

        const scrollableDiv = modal.querySelector('div[style*="height: auto; overflow: hidden auto;"]');
        if (!scrollableDiv) {
            console.error('Scrollable div not found.');
            return;
        }

        const following = [];
        const followingItems = scrollableDiv.querySelectorAll('a.x1i10hfl.xjbqb8w.x1ejq31n.xd10rxx.x1sy0etr.x17r0tee.x972fbf.xcfux6l.x1qhh985.xm0m39n.x9f619.x1ypdohk.xt0psk2.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x16tdsg8.x1hl2dhg.xggy1nq.x1a2a7pz.notranslate._a6hd');

        if (followingItems.length === 0) {
            console.error('No following found. The selector may need adjustment or the content might not be fully loaded.');
        } else {
            followingItems.forEach((anchor) => {
                const username = anchor.innerText.trim();
                const link = anchor.href;
                if (username) {
                    following.push({
                        username: username,
                        link: link
                    });
                }
            });

            chrome.runtime.sendMessage({ action: "updateFollowingList", following });
        }
    })();
}