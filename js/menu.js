function Menu(e) {
  this.menuContainer = e.menuContainer;
  this.menuStatus = "start"; //start/end
  this.gameObj = e.gameObj;
  this.gameObj.menu = this;
  this.generateStartMenu();
}

Menu.prototype.init = function() {
  console.log("init");
}


Menu.prototype.clearMenu = function() {
  TweenLite.to(".menu-start", 1, {
    opacity: 0
  });
TweenLite.to(this.menuContainer, 1, {
      opacity: 0,
      display : "none",
      delay: 1
  });

}
Menu.prototype.generateEndMenu = function() {
  this.gameObj.stopGamePlay();
  this.generateStartMenu();
}
Menu.prototype.generateStartMenu = function() {
  this.gameObj.init();
  this.gameObj.ai();
  var myObj = this;
  $(document).on('click', '.menu-start-button', function() {
      myObj.clearMenu();
      myObj.gameObj.init();
  });
  this.menuContainer.innerHTML =
  "<div class='menu-start'>"
  +"<div class='menu headline'>NUMBERS</div>"
  +"<div class='menu-start-button'>START</div>"
  +"</div>";
}
