function Menu(e) {
    this.menuContainer = e.menuContainer;
    this.menuStatus = "start"; //start/end
    this.gameObj = e.gameObj;
    this.gameObj.menu = this;
    this.init();
}


Menu.prototype.clearMenu = function() {
    TweenLite.to(this.menuContainer, 1, {
        opacity: 0,
        display: "none"
    });

}

Menu.prototype.buildMenu = function() {
    TweenLite.to(this.menuContainer, 0, {
        display: "flex"
    });
    TweenLite.to(".menu-start", 1, {
        opacity: 1
    });
    TweenLite.to(this.menuContainer, 1, {
        opacity: 1,
        delay: 1
    });

}
Menu.prototype.reset = function() {
    this.clearMenu();
    this.gameObj.stopAI();
}

Menu.prototype.init = function(m) {
    this.buildMenu();
    this.generateStartMenu();
}
Menu.prototype.generateEndMenu = function() {
    this.buildMenu();
    setTimeout(() => {
        this.gameObj.init();
        this.gameObj.ai();
    }, 2000);
    this.menuContainer.innerHTML =
        "<div class='menu-start'>" +
        "<div class='menu score'>" + this.gameObj.score + "</div>" +
        "<div class='menu headline'>POINTS</div>" +
        "<div class='menu-end-button'>PLAY AGAIN</div>" +
        "</div>";
    $(".menu-end-button").on("touchstart", (e) => {
        this.gameObj.playSound("btn_click");
        this.reset();
        this.gameObj.init();
    });

}
Menu.prototype.generateStartMenu = function() {
    this.gameObj.init();
    this.gameObj.ai();
    this.menuContainer.innerHTML =
        "<div class='menu-start'>" +
        "<div class='menu-sound'></div>" +
        "<div class='menu brand'>NUMBERS</div>" +
        "<div class='menu-start-button'>START GAME</div>" +
        "</div>";
    $(".menu-start-button").on("touchstart", (e) => {
        this.reset();
        this.gameObj.init();
    });
    $(".menu-sound").on("touchstart", (e) => {
        this.gameObj.toggleSound();
    });
}
