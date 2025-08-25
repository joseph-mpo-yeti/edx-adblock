let disableAdInterval = null;
let clickCount = localStorage.getItem("VTR_IN_COURSE_MODAL_NEXT_CLICK_COUNT");

chrome.storage.local.get(["adblockEnabled"], function(result){
    if(result.adblockEnabled){
        disableAdInterval = setInterval(disableAds, 250)
    }
})

function getBanner() {
    // Create the banner element
    let banner = document.createElement('div');
    banner.setAttribute("id", "edx-blocker-banner");
    banner.classList.add("p-2.5")
    
    // Create the content
    banner.innerHTML = `
        <h2 class="upgrade-notification-header">Just chill and learn!</h2>
        <p class="upgrade-notification-message">We've removed the promotional content so you can focus on your learning materials without distractions.</p>
    `;

    return banner;
}

function disableAds(){
    localStorage.setItem("VTR_IN_COURSE_MODAL_NEXT_CLICK_COUNT", 1)
    let component = document.getElementById("courseHome-upgradeNotification");
    if(component) {
        component.childNodes.forEach(function(node){
            if(node.getAttribute("id") !== "edx-blocker-banner"){
                node.setAttribute("style", "display: none !important;");
            }
        });
        let blockElement = document.getElementById("edx-blocker-banner")
        if( blockElement === null || blockElement === undefined){
            component.appendChild(getBanner());
        }
    }
}

function reset(){
    localStorage.setItem("VTR_IN_COURSE_MODAL_NEXT_CLICK_COUNT", clickCount);
    let component = document.getElementById("courseHome-upgradeNotification");
    if(component) {
        component.childNodes.forEach(function(node){
            if(node.getAttribute("id") !== "edx-blocker-banner"){
                node.setAttribute("style", "display: block;");
            }
        });
        let blockElement = document.getElementById("edx-blocker-banner");
        if( blockElement !== null || blockElement !== undefined){
            blockElement.remove();
        }
    }
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    console.log(message);
    if(message.adblockEnabled){
        disableAdInterval = setInterval(disableAds, 250);
    } else {
        clearInterval(disableAdInterval);
        reset();
    }
    sendResponse(true);
})