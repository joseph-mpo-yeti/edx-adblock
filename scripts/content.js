localStorage.setItem("VTR_IN_COURSE_MODAL_NEXT_CLICK_COUNT", 1)

setInterval(function(){
    localStorage.setItem("VTR_IN_COURSE_MODAL_NEXT_CLICK_COUNT", 1)
    var component = document.getElementById("courseHome-upgradeNotification");
    if(component) {
        component.childNodes.forEach(function(node){
            if(node.getAttribute("id") !== "edx-blocker-banner"){
                node.setAttribute("style", "display: none !important;");
            }
        });
        var blockElement = document.getElementById("edx-blocker-banner")
        if( blockElement === null || blockElement === undefined){
            component.appendChild(getBanner());
        }
    }
}, 250);


function getBanner() {
    // Create the banner element
    var banner = document.createElement('div');
    banner.setAttribute("id", "edx-blocker-banner");
    banner.classList.add("p-2.5")
    
    // Create the content
    banner.innerHTML = `
        <h2 class="upgrade-notification-header">Just chill and learn!</h2>
        <p class="upgrade-notification-message">We've removed the promotional content so you can focus on your learning materials without distractions.</p>
    `;

    return banner;
}