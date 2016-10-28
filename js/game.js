
function Game(e) {
    this.time = e.time;
    this.questionElement = e.questionElement;
    this.optionsElement = e.optionsElement;
    this.rightOption = 0;
    this.animationSpeed = e.animationSpeed;
    this.animationDelay = 0.5;
    this.score = 0;
    this.comboDuration = e.comboDuration;
    this.comboMultiplier = e.comboMultiplier;
    this.loseColor = e.loseColor;
    this.winColor = e.winColor;
    this.menu = e.menu;
    this.autoPilot = false;
    this.menu = null;
}

Array.prototype.unique = function() {
    var r = new Array();
    o: for (var i = 0, n = this.length; i < n; i++) {
        for (var x = 0, y = r.length; x < y; x++) {
            if (r[x] == this[i]) {
                return false;
            }
        }
        r[r.length] = this[i];
    }
    return true;
}

Game.prototype.init = function() {
    //Initialize originalTime for normalizing timeline
    this.originalTime = this.time;
    this.comboStart = this.originalTime;
    this.comboMultiplier = 1;
    this.comboDuration = 0;
    this.autoPilot = false;
    this.stopAI();
    this.stopGamePlay();
    this.generateQuestion();
    var thisObj = this;
    //Adding clicks onto game options
    $(document).on('click', '.game-option', function() {
        thisObj.optionSelect(this);
    });
    this.gamePlay = setInterval(function() {
        if (thisObj.time >= 0) {
            thisObj.timeHandler();
            thisObj.comboTimeHandler();
          }
        else {
              if(thisObj.autoPilot){
              thisObj.time = thisObj.originalTime;
              thisObj.init();
            } else {
              thisObj.menu.generateEndMenu();
            }

            //game ended

        }
    }, 1);
};

Game.prototype.ai = function() {
  this.autoPilot = true;
  var thisObj = this;
  this.autoPilotInterval = setInterval(function() {
    var options = document.getElementsByClassName("game-option");
    thisObj.optionSelect(options[thisObj.generateNumber(3)]);
  },1500);
}

Game.prototype.stopAI = function(e){
  clearInterval(this.autoPilotInterval);
}

Game.prototype.stopGamePlay = function(e){
  clearInterval(this.gamePlay);
}

Game.prototype.timeHandler = function(e) {
    var actualWidth = (this.time / this.originalTime) * 100;
    TweenLite.to(".timeline", 0.5, {
        width: actualWidth + "%"
    });
    this.time--;
}

Game.prototype.comboTimeHandler = function() {
    //Error handling
    if(this.currentComboTimer == null){
      return;
    }
    if(this.currentComboTimer === 0){
      //Die animation
      TweenLite.to(".combo-timeline", 0, {
          background: this.loseColor
      });
      TweenLite.to(".combo-timeline", 0, {
          opacity: 0,
          delay:0.5
      });
      this.currentComboTimer = null;
      return;
    }
    var comboEl = document.getElementsByClassName("combo-timeline")[0];
    comboEl.innerHTML = this.comboMultiplier + "X";
    var actualWidth = (this.currentComboTimer / this.comboDuration) * 100;
    TweenLite.to(".combo-timeline", 0.5, {
        width: actualWidth + "%",
        background: this.winColor,
        opacity: 1
    });
    this.currentComboTimer -= 1;
}

Game.prototype.generateNumber = function(m) {
    return Math.floor((Math.random() * m) + 1);
}

Game.prototype.addOption = function(i) {
    this.optionsElement.innerHTML += "<div class='game-option'>" + i + "</div>";
}
Game.prototype.emptyOptions = function() {
    this.optionsElement.innerHTML = "";
}

Game.prototype.generateNumberArray = function() {
    this.options = [];
    this.emptyOptions();
    for (var i = 0; i != 4; i++) {
        var randNr = this.generateNumber(100);
        this.options.push(randNr);
        this.addOption(randNr);
    }
    if (!this.options.unique()) {
        this.generateNumberArray();
    }
}

Game.prototype.generateQuestion = function() {
    this.generateNumberArray();
    this.fadeAnimation();
    this.rightOption = this.generateNumber(3); //Generate random index
    var diffNumber = Math.floor((Math.random() * this.options[this.rightOption]) + 1); //Generate random difference
    var question = diffNumber + " + " + (this.options[this.rightOption] - diffNumber); //Generate question
    this.questionElement.innerHTML = question;

}

Game.prototype.fadeAnimation = function(i) {
    var e = document.getElementsByClassName("game-option");
    for (var i = 0; i != e.length; i++) {
        TweenLite.fromTo(
            e[i],
            this.animationSpeed, {
                ease: Sine.easeOut,
                opacity: 0
            }, {
                ease: Sine.easeOut,
                opacity: 1
            }
        );
    }
}
Game.prototype.looseAnimation = function(e) {
    if (e.id === "dead") {
        return;
    }
    var side = this.generateNumber(2);
    e.id = "dead";
    TweenLite.to(e, 0.2, {
        ease: Sine.easeOut,
        background: this.loseColor,
    });
    if (side === 1) {
        TweenLite.to(e, this.animationSpeed, {
            ease: Expo.easeOut,
            x: "100%",
            delay:this.animationDelay
        });
    } else {
        TweenLite.to(e, this.animationSpeed, {
            ease: Expo.easeOut,
            x: "-100%",
            delay:this.animationDelay
        });
    }
}
Game.prototype.winAnimation = function(e) {
    var options = document.getElementsByClassName("game-option");
    for (var i = 0; i != options.length; i++) {
        if (options[i] != e) {
            this.looseAnimation(options[i]);
        }
    }

    TweenLite.to(e, this.animationSpeed, {
        ease: Sine.easeOut,
        background: "#5ebd65",
        delay: this.animationDelay
    });
}
Game.prototype.addTime = function(t){
  if( (this.time+t) > this.originalTime){
    this.time = this.originalTime;
  } else {
    this.time += t;
  }
}
Game.prototype.calculatePoints = function(){
  if(this.comboStart >= ( this.time - this.comboDuration ) ){
    this.comboMultiplier++;
    this.currentComboTimer = this.comboDuration;
  } else {
    this.currentComboTimer = 0;
    this.comboStart = 0;
    this.comboMultiplier = 1;
  }
  this.score += 1 * this.comboMultiplier;
  this.addTime(300*this.comboMultiplier);
}
Game.prototype.optionSelect = function(e) {
    var awnser = parseInt(e.innerHTML);
    var myElement = this;
    if (awnser == this.options[this.rightOption]) {
        //Add winning animation
        this.animationDelay = 0;
        this.comboStart = this.time;
        this.calculatePoints();
        this.winAnimation(e);
        setTimeout(function() {
            myElement.generateQuestion();
        }, 700);
        return;
    } else {
        this.animationDelay = 0.5;
        this.looseAnimation(e);
        this.currentComboTimer = 0;
        this.comboStart = 0;
        this.comboMultiplier = 1;
        this.addTime(-500)
    }

}
