document.getElementById("scrapeBtn").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: scrapeFollowers
        });
    });
});
document.getElementById("scrapeFollowingBtn").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: scrapeFollowing
        });
    });
});
document.getElementById("visitPostsBtn").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: visitMyPosts
        });
    });
});
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "updateFollowerList" && request.followers) {
        const followerList = document.getElementById("followerList");
        followerList.innerHTML = ""; // Clear previous list

        request.followers.forEach(follower => {
            const li = document.createElement("li");
            const link = document.createElement("a");
            
            // Set text and href for the link
            link.textContent = follower.username;
            link.href = follower.link;
            link.target = "_blank"; // Open link in a new tab

            // Append the link to the list item
            li.appendChild(link);
            followerList.appendChild(li);
        });

        // Trigger the download of followers as a .txt file
        downloadTextFile(request.followers, 'Instafollowers.txt');
    }
    if (request.action === "updateFollowingList" && request.following) {
        const followingList = document.getElementById("followerList");
        followingList.innerHTML = ""; // Clear previous list

        request.following.forEach(user => {
            const li = document.createElement("li");
            const link = document.createElement("a");
            
            // Set text and href for the link
            link.textContent = user.username;
            link.href = user.link;
            link.target = "_blank"; // Open link in a new tab

            // Append the link to the list item
            li.appendChild(link);
            followingList.appendChild(li);
        });

        // Trigger the download of following as a .txt file
        downloadTextFile(request.following, 'Instafollowings.txt');
    }
});


// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.action === "updateFollowingList" && request.following) {
//         const followingList = document.getElementById("followerList");
//         followingList.innerHTML = ""; // Clear previous list

//         request.following.forEach(user => {
//             const li = document.createElement("li");
//             const link = document.createElement("a");
            
//             // Set text and href for the link
//             link.textContent = user.username;
//             link.href = user.link;
//             link.target = "_blank"; // Open link in a new tab

//             // Append the link to the list item
//             li.appendChild(link);
//             followingList.appendChild(li);
//         });

//         // Trigger the download of following as a .txt file
//         console.log(request.following);
//         downloadFollowingAsTextFile(request.following);
//     }
// });


function scrapeFollowers() {
    // This sends a message to the background script to start scraping
    chrome.runtime.sendMessage({ action: "startScrapingFollowers" });
}
function scrapeFollowing(){
    chrome.runtime.sendMessage({action:'startScrapingFollowing'});
}
function downloadTextFile(users, filename){
    const textContent= users.map(f => `${f.username} : ${f.link}`).join('\n');
    // Create a Blob from the text content
    const blob= new Blob([textContent], {type:'text/plain'});
    const url= URL.createObjectURL(blob);
    chrome.downloads.download({
        url:url,
        filename:filename,
        saveAs: true
    }, ()=>{
        URL.revokeObjectURL(url); // This is to clean up object URL after download
    });
}
function downloadFollowersAsTextFile(followers) {
    const textContent = followers.map(f => `${f.username}: ${f.link}`).join('\n');
    
    // Create a Blob from the text content
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    // Trigger the download using the Chrome downloads API
    chrome.downloads.download({
        url: url,
        filename: 'followers.txt',
        saveAs: true
    }, () => {
        URL.revokeObjectURL(url); // Clean up the object URL after download
    });
}

// function visitMyPosts() {
//     (async () => {
//         console.log('Visiting each post on your Instagram profile');

//         // Function to delay execution
//         const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

//         // Function to capture and download a screenshot via background script
//         async function captureAndDownloadScreenshot(filename) {
//             return new Promise((resolve, reject) => {
//                 chrome.runtime.sendMessage(
//                     { action: "captureScreenshot", filename: filename },
//                     (response) => {
//                         if (response && response.success) {
//                             resolve();
//                         } else {
//                             reject("Screenshot failed");
//                         }
//                     }
//                 );
//             });
//         }

//         // Get all posts on your profile
//         const posts = document.querySelectorAll('._aagw');
//         const totalPosts = posts.length;

//         for (let i = 0; i < totalPosts; i++) {
//             const postLink = posts[i];
            
//             // Visit the post by clicking on the link
//             postLink.click();
            
//             // Wait for the post to load
//             await delay(2000);

//             // Take a screenshot of the post
//             await captureAndDownloadScreenshot(`post-${i + 1}.png`);

//             // Handle carousel posts by clicking the "Next" button if it exists
//             let nextButton = document.querySelector('button[aria-label="Next"]');
//             while (nextButton) {
//                 nextButton.click();
//                 console.log('Clicked Next in carousel');
                
//                 // Wait for the next item in the carousel to load
//                 await delay(2000);

//                 // Take a screenshot of the current part of the carousel
//                 await captureAndDownloadScreenshot(`post-${i + 1}-carousel-part.png`);
//                 // Recheck for the Next button
//                 nextButton = document.querySelector('button[aria-label="Next"]');
//             }

//             // Log that the post was visited
//             console.log(`Visited post ${i + 1} of ${totalPosts}`);

//             // Wait for a moment before navigating back
//             await delay(2000);

//             // Go back to the profile page
//             window.history.back();

//             // Wait for the profile page to load
//             await delay(2000);
//         }

//         console.log('Finished visiting all posts.');
//     })();
// }

function visitMyPosts() {
    (async () => {
        console.log('Visiting each post on your Instagram profile');

        // Function to delay execution
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        // Prompt user for folder name
        const folderName = prompt("Enter a folder name to store screenshots:", "Instagram_Posts");
        if (!folderName) {
            console.error("Folder name was not provided. Cancelling operation.");
            return;
        }

        // Function to capture and download a screenshot via background script
        async function captureAndDownloadScreenshot(filename) {
            return new Promise((resolve, reject) => {
                chrome.runtime.sendMessage(
                    { action: "captureScreenshot", filename: `${folderName}/${filename}` },
                    (response) => {
                        if (response && response.success) {
                            resolve();
                        } else {
                            reject("Screenshot failed");
                        }
                    }
                );
            });
        }

        // Get all posts on your profile
        const posts = document.querySelectorAll('._aagw');
        const totalPosts = posts.length;

        for (let i = 0; i < totalPosts; i++) {
            const postLink = posts[i];
            
            // Visit the post by clicking on the link
            postLink.click();
            
            // Wait for the post to load
            await delay(2000);

            // Take a screenshot of the post
            let count=1;
            await captureAndDownloadScreenshot(`post-${i + 1}.${count}.png`);

            // Handle carousel posts by clicking the "Next" button if it exists
            let nextButton = document.querySelector('button[aria-label="Next"]');
            while (nextButton) {
                nextButton.click();
                console.log('Clicked Next in carousel');
                
                // Wait for the next item in the carousel to load
                await delay(2000);
                count++;
                // Take a screenshot of the current part of the carousel
                await captureAndDownloadScreenshot(`post-${i+1}.${count}.png`);
                // Recheck for the Next button
                nextButton = document.querySelector('button[aria-label="Next"]');
            }

            // Log that the post was visited
            console.log(`Visited post ${i + 1} of ${totalPosts}`);

            // Wait for a moment before navigating back
            await delay(2000);

            // Go back to the profile page
            window.history.back();

            // Wait for the profile page to load
            await delay(2000);
        }

        console.log('Finished visiting all posts.');
    })();
}