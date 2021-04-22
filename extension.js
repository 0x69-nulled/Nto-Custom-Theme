// ==UserScript==
// @name         Custom Nulled Theme
// @namespace    Nulled
// @version      1.3.01
// @description  Custom Theme for Nulled.to
// @Author       0x69
// @include      *nulled.to*
// @match        https://www.nulled.to/
// @require      https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.4.5/socket.io.min.js
// @updateURL	 https://raw.githubusercontent.com/0x69-nulled/Nto-Custom-Theme/main/extension.js
// @downloadURL  https://raw.githubusercontent.com/0x69-nulled/Nto-Custom-Theme/main/extension.js
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// ==/UserScript==

const socket = io.connect("https://chat-ssl2.nulled.to:443", {forceNew: !0});

const newColors = {
    "vip": "#d276c3",
    "aqua": "#2096fb",
    "nova": "#e8720c",
    "contrib": "#ffdf3f",
    "royal": "#99bedf",
    "banned": "red",
}

var userName;
var uid;
var customItemsCSS;

// custom css
GM_addStyle(`
    .nova {
        color: ${newColors.nova} !important;
        text-shadow: 0.75px 0.75px 7px #D56928 !important;
    }
    .aqua {
        color: ${newColors.aqua} !important;
        text-shadow: 0.75px 0.75px 7px #0059ff !important;
    }
    .staff:before {
        content: '⭐️';
    }
    *[style*="color: #a6c728;"]:before {
        content: '🦽';
    }
    .reverser {
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        color: #ffffff !important;
        font-weight: 700;
        text-shadow: 0px 0px 8px #00ff348f;
        background-image: linear-gradient(0deg, rgb(110, 190, 255) 0%, rgba(27,206,112,1) 100%);
    }
    *[style*="color: #99bedf;"] {
        color: ${newColors.royal} !important;
    }
    *[style*="color:#ffdf00"]{
        color: ${newColors.contrib} !important;
    }
    *[style*="color:#E140C7"]{
        color: ${newColors.vip} !important;
    }
    s, s * {
        color: ${newColors.banned} !important;
    }
    .sixYears {
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        color: #ff0000;
        font-weight: bolder;
        text-shadow: 0px 0px 5px #00FF00;
        background-image: linear-gradient(60deg, #00fff7 0%, #91ff00 100%, #fff);
        background-size: cover;
        animation: sixYearAnim 5s infinite;
    }
    @keyframes sixYearAnim {
        0% {
            filter: hue-rotate(-80deg);
        }

        50% {
            filter: hue-rotate(175deg);
        }

        100% {
            filter: hue-rotate(-80deg);
        }
    }
    .titleStyle {
        color: #000;
        text-shadow: 2px 2px 7px #aaa;
    }
    /* CORONA LINK AWARNESS */
    *[href*="corona.php?action=infect"]:before, *[href*="corona.php?action=infect"]:after {
        background-color: red !important;
        color: yellow !important;
        content: "WARNING CORONA LINK";
    }

    .itemDisplay {
        background-size: cover;
        display: inline-block;
        width: 14px;
        height: 14px;
        margin: 2em;
    }

`);

// set items css
fetch('https://raw.githubusercontent.com/0x69-nulled/Nto-Custom-Theme/main/settings.json')
.then(e => e.json())
.then(data => {
    customItemsCSS = data.items;
})


// init blocked users
let auxBUsers = GM_getValue("blockedUsers");
if (auxBUsers === undefined) {
    let aux = []
    GM_setValue("blockedUsers", JSON.stringify(aux));
}

// Function to block someone
function addBlocked(userBlocked) {
    let blockedUsers = JSON.parse(GM_getValue("blockedUsers"));
    blockedUsers.push(userBlocked);
    GM_setValue("blockedUsers", JSON.stringify(blockedUsers));
}

function removeBlocked(userBlocked) {
    let blockedUsers = JSON.parse(GM_getValue("blockedUsers"));
    blockedUsers.splice(blockedUsers.indexOf(userBlocked), 1);
    GM_setValue("blockedUsers", JSON.stringify(blockedUsers));
}

const head = document.querySelector("head");

// use custom font
let FontPrimary = document.createElement('link');
FontPrimary.rel = "stylesheet"
FontPrimary.href = "https://fonts.googleapis.com/css?family=Rubik"

let titleFont = document.createElement('link');
titleFont.rel = "stylesheet"
titleFont.href = "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@1,600&display=swap"

let styleTag = document.createElement('style');
styleTag.type = "text/css";
styleTag.innerHTML = "*{font-family: 'Rubik';} h1{font-family: 'Poppins', sans-serif}";

head.appendChild(FontPrimary);
head.appendChild(titleFont);
head.appendChild(styleTag);

window.onload = () => {

    // set user
    let userLink = document.querySelector("#user_link")
    if(userLink){
        userName = userLink.href.replace(/.*-/g, "");
        uid = userLink.href.match(/nulled.to\/user\/(\d*)-/)[1];
    }

    console.log({ "username": userName, "uid": uid });

    // enable top credit
    const ranking = document.querySelector("#index_stats > div.ipsBlockOuter.__xXblack20friday");
    if (ranking) {
        ranking.style.display = "block";
        ranking.querySelector("p").style.display = "none";
        ranking.querySelector("h3").textContent = "Top Credits";
        ranking.style.fontWeight = "bold"
    }


    // change header logo to text
    const headerSection = document.querySelector("#branding > div.wrapper > div > a");
    if (headerSection) {
        headerSection.querySelector("img").remove();
        let newHeader = document.createElement('h1');
        newHeader.textContent = "NULLED";
        newHeader.style.fontSize = "9em";
        newHeader.style.fontFamily = 'Poppins';
        newHeader.addClassName("titleStyle");
        headerSection.appendChild(newHeader);
        document.getElementsByClassName("header-bg")[0].style = "background: url(https://i.imgur.com/fLrecFf.png)";
        document.getElementsByClassName("header-bg")[0].style.opacity = 0.5;
    }


    // fix fucking like counter
    const reputation = document.querySelector("#index_stats > div.ipsBlockOuter > div:nth-child(3) > span > div");
    if (reputation) {
        reputation.style.marginRight = "0px";
    }


    // Connected now
    const appendHere = document.querySelector("#boardStats > div.online-list-container > div.onlineNow")
    if (appendHere) {
        const userList = document.querySelector("#boardStats > div.online-list-container > div.onlineList")
        const structure = document.createElement('ol');

        const staffs = userList.querySelectorAll(".staff").length;
        const staffLi = document.createElement('li');
        staffLi.addClassName("staff");
        staffLi.textContent = "Staff connected: " + staffs;

        const godlys = userList.querySelectorAll(".godly_new").length;
        const godlyLi = document.createElement('li');
        godlyLi.addClassName("godly_new")
        godlyLi.textContent = "Godly connected: " + godlys;

        const legendarys = userList.querySelectorAll(".legendary").length;
        const legendaryLi = document.createElement('li');
        legendaryLi.addClassName("legendary")
        legendaryLi.style = "display: inline-block";
        legendaryLi.textContent = "Legendary connected: " + legendarys;

        const royals = document.querySelectorAll('*[style*="color: #99bedf;"]').length;
        const royalLi = document.createElement('li');
        royalLi.style.color = newColors.royal;
        royalLi.textContent = "Royals connected: " + royals;

        const contributors = userList.querySelectorAll('*[style*="color:#ffdf00"]').length;
        const contribLi = document.createElement('li');
        contribLi.style.color = newColors.contrib;
        contribLi.textContent = "Contributors connected: " + contributors;

        const novas = userList.querySelectorAll(".nova").length;
        const novaLi = document.createElement('li');
        novaLi.addClassName("nova")
        novaLi.textContent = "Nova connected: " + novas;

        const aquas = userList.querySelectorAll(".aqua").length;
        const aquaLi = document.createElement('li');
        aquaLi.addClassName("aqua")
        aquaLi.textContent = "Aqua connected: " + aquas;

        const vips = document.querySelectorAll('*[style*="color:#E140C7"]').length;
        const vipsLi = document.createElement('li');
        vipsLi.style.color = newColors.vip;
        vipsLi.textContent = "Vips connected: " + vips;

        const plebs = document.querySelectorAll('*[style*="color:#CCCCCC"]').length;
        const plebsLi = document.createElement('li');
        plebsLi.style.color = "#CCCCCC";
        plebsLi.textContent = "plebs connected: " + plebs;

        const bots = document.querySelector("#boardStats > div.online-list-container > div.profile_usertitle.hide-mobile").textContent.split(" ")[3]
        const botsLi = document.createElement('li');
        botsLi.textContent = "Bots ddosing nulled: " + bots + " ";
        botsLi.style = "display: inline-block";
        const kapp = document.createElement('img');
        kapp.src = "https://static.nulled.to/public/style_emoticons/default/kapp_v2.png";
        botsLi.appendChild(kapp);


        structure.appendChild(document.createElement("br"));
        structure.appendChild(staffLi);
        structure.appendChild(godlyLi);
        structure.appendChild(legendaryLi);
        structure.appendChild(royalLi);
        structure.appendChild(contribLi);
        structure.appendChild(novaLi);
        structure.appendChild(aquaLi);
        structure.appendChild(vipsLi);
        structure.appendChild(plebsLi)
        structure.appendChild(botsLi);

        appendHere.appendChild(structure);

    }

    // 5 year tag
    const users = document.querySelectorAll("div.user_details")
    if(users) {
        users.forEach(user => {
            if (((new Date() - new Date(user.querySelector("div.user_details > div.pu-fields > div:nth-child(3) > div.pu-content > span").textContent)) / 31536000000) >= 6) {
                let tag = user.querySelector("div.user_details > div.postbit-info");
                let text = tag.querySelector("span");
                text.textContent = "SIX YEARS REGISTERED";
                text.removeClassName("t");
                text.addClassName("sixYears");
            }
        })
    }

    // sb notification
    // first "if" makes it work only on the SB page as if you have alot of nulled pages searching threads you dont want to recive multiple notifications from each and every page you have open
    if (window.location.pathname == "/" || window.location.hash.search("#!") == 0) {
        function changeButton(toggleButton) {
            let notification = GM_getValue("notification");
            if(notification) {
                toggleButton.setAttribute('content', "Disable SB Notifications");
                toggleButton.innerHTML = "Disable SB Notifications";
                toggleButton.style.color = "red";
            }
            else {
                toggleButton.setAttribute('content', "Toggle SB Notifications");
                toggleButton.innerHTML = "Toggle SB Notifications";
                toggleButton.style.color = "green";
            }
        }

        // sb notifier toggle
        const memberBlock = document.querySelector("#user_bar > div > div > div.memberblock");
        if(memberBlock) {
            let toggleButton = document.createElement('button');
            let notification = GM_getValue("notification");
            toggleButton.onclick = function () {
                notification = GM_getValue("notification");
                GM_setValue("notification", !notification);
                changeButton(toggleButton);
            }

            changeButton(toggleButton);

            memberBlock.insertBefore(toggleButton, document.querySelector("#user_bar > div > div > div.memberblock").firstChild);
        }

        socket.emit("authenticate");

        socket.emit("subscribe", {
            channelName: "general"
        });

        socket.on("message", function(event) {
            let notification = GM_getValue("notification");
            if(notification && event.data.message.text.includes("@" + userName) && event.data.message.user.username !== userName) {
                const messageSent = event.data.message.text;
                notifyMe(event.data.message.user.username, messageSent);
            }
        });

        // sb modifications
        let memeBox = document.querySelector("#shoutbox > div.shoutbox-content");
        if(memeBox) {
            const memeBoxMessages = memeBox.querySelector("div.messages");

            // Init to remove first messages
            let blockedUsers = JSON.parse(GM_getValue("blockedUsers"));
            if(blockedUsers){
                for (var child of memeBoxMessages.getElementsByClassName("entry")) {
                    let message = child.getElementsByClassName("field cell-author")[0];
                    if(message != "" && blockedUsers.find((element) => { return element.toLowerCase() == message.innerText.toLocaleLowerCase()})){
                        child.style.display = "none";
                    }
                }
            }

            // Create observer
            var observer = new MutationObserver(function(mutationList) {
                let blockedUsers = JSON.parse(GM_getValue("blockedUsers"));
                if(blockedUsers){
                    for (var mutation of mutationList) {
                        for (var child of mutation.addedNodes) {
                            let message = child.getElementsByClassName("field cell-author")[0];
                            if(message != "" && blockedUsers.find((element) => { return element.toLowerCase() == message.innerText.toLocaleLowerCase()})){
                                child.style.display = "none";
                            }
                        }
                    }
                }
            });

            // Set observer
            observer.observe(memeBoxMessages, {childList: true});

            // Add tab for blocked users
            const sbTabs = document.querySelector("ul#menutabs");
            const blockedUsersTab = document.createElement("li");
            blockedUsersTab.innerHTML = '<a href="#"><i class="fa fa-bomb"></i>&nbsp;Block user on sb</a>';
            blockedUsersTab.onclick = function() {
                var userToBlock = prompt("Who do you want to block", "");
                if (userToBlock == null || userToBlock == "") {
                }
                else {
                    addBlocked(userToBlock);
                }
            }
            const blockedUsersPage = document.createElement("li");
            blockedUsersPage.innerHTML = '<a target="_blank" href="https://nulled.to/blockedUsers"><i class="fa fa-bone"></i>&nbsp;Users blocked</a>';
            sbTabs.appendChild(blockedUsersTab);
            sbTabs.appendChild(blockedUsersPage);
        }

    } else if (window.location.pathname.toLowerCase() == '/blockedusers') {
        document.title = "Users blocked - Nulled";
        const title = document.querySelector("#content > h1");
        const removeElement = document.querySelector("#content > div.ipsBox");
        if(title && removeElement) {
            let auxBUsers = JSON.parse(GM_getValue("blockedUsers"));
            title.innerText = "Blocked users (" + auxBUsers.length + ")";
            title.style.fontSize = "2em";

            removeElement.innerHTML = "";

            const userUL = document.createElement("ul");

            for(let user of auxBUsers) {
                let userLi = document.createElement("li");
                userLi.style.fontSize = "1.5em";
                userLi.innerHTML = " " + user;
                let buttonUnBlock = document.createElement("a");
                buttonUnBlock.href = "#";
                let iconUnBlock = document.createElement("i");
                iconUnBlock.addClassName("fa fa-unlock");
                iconUnBlock.onclick = () => {
                    removeBlocked(user);
                    userLi.style.textDecoration = "line-through";
                    userLi.style.color = "red";
                }
                buttonUnBlock.appendChild(iconUnBlock);
                userLi.insertBefore(buttonUnBlock, userLi.firstChild);
                userUL.appendChild(userLi);
            }

           removeElement.appendChild(userUL);
        }
    } else if (window.location.pathname.toLowerCase() == '/credits.php' && window.location.search.toLowerCase() == '?action=items') {
        let ownedItemsDiv = document.querySelector('#credits_content > div > div:last-child');
        let itemsDiv = ownedItemsDiv.querySelector('.infoBox');
        let text = document.createElement('p');
        text.textContent = "Url to custom Item (.png / .jpg / .jpeg / .gif): ";
        let urlInput = document.createElement('input');
        let submitButton = document.createElement('button');
        let currentItem = document.createElement('img');
        currentItem.src = GM_getValue("linkCustomItem");
        currentItem.classList.add('itemDisplay');
        submitButton.textContent = "Set";
        itemsDiv.textContent = "";
        itemsDiv.insertBefore(urlInput, itemsDiv.firstChild);
        itemsDiv.insertBefore(text, itemsDiv.firstChild);
        itemsDiv.append(submitButton);
        itemsDiv.insertBefore(currentItem, itemsDiv.firstChild);

        submitButton.onclick = () => {
            GM_setValue("linkCustomItem", urlInput.value);
            currentItem.src = urlInput.value;
        }
    }


    // Function I stole from https://developer.mozilla.org/
    function notifyMe(user, message) {

        if (!("Notification" in window)) {
            alert("This browser doesn't support push notifications");
        }

        else if (Notification.permission === "granted") {
            // Si esta correcto lanzamos la notificación
            var notification = new Notification(`Mention by: ${user}`, {
                body: message,
            });
        }

        else if (Notification.permission !== 'denied') {
            Notification.requestPermission(function (permission) {
                if (permission === "granted") {
                    var notification = new Notification(`Mention by: ${user}`, {
                        body: message,
                    });
                }
            });
        }
    }

    // made by 0x69
    const memberBlock = document.querySelector("#user_bar > div > div > div.memberblock");
    if (memberBlock) {
        let madeby = document.createElement('div');
        madeby.addClassName("navitem");
        madeby.id = "madeby";
        let link = document.createElement('a');
        link.href = "https://www.nulled.to/user/158134-";
        link.addClassName("godly_new");
        link.text = "Theme by 0x69";
        link.setAttribute('target', '_blank');
        madeby.appendChild(link);
        memberBlock.insertBefore(madeby, document.querySelector("#user_bar > div > div > div.memberblock").firstChild);
    }


    // Set custom items
    if (customItemsCSS) {
        document.head.appendChild(getItemsCSS(Object.entries(customItemsCSS)));
    }

}

const getItemsCSS = ( items ) => {

    if (items.length == 0 || items == undefined) return;
    let customItem = document.createElement('style');

    for (let i = 0; i < items.length; i++) {
        customItem.appendChild(document.createTextNode(`
        a[hovercard-id*="${items[i][0]}"]:after, a[href="/user/${items[i][0]}-"]:after {
            background-image: url('${items[i][1]}');
            background-size: 14px 14px;
            margin-left: 5px;
            margin-top: -2px;
            vertical-align: middle;
            display: inline-block;
            width: 14px;
            height: 14px;
            content: '';
        }
        `));
    }
    return customItem;
}
