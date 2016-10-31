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
    this.originalTime = e.time;
    this.currentComboTimer = 0;
    this.timeAddedOnWin = e.timeAddedOnWin;
    this.level = 1;
    this.penaltyTime = e.penaltyTime;
    this.sounds = true;
}
Game.prototype.reset = function() {
    this.autoPilot = false;
    this.resetCombo();
    this.stopAI();
    this.stopGamePlay();
    this.level = 1;
    this.score = 0;
}
Game.prototype.resetCombo = function() {
    this.comboStart = 0;
    this.comboMultiplier = 1;
    this.currentComboTimer = 0;

}

Game.prototype.init = function() {
    this.reset();
    //For ios
    this.time = this.originalTime;
    this.generateQuestion();
    //Adding clicks onto game options
    $(document).unbind().on('touchstart', '.game-option', (e) => {
        this.playSound("btn_click");
        this.optionSelect(e.target);

    });
    this.gamePlay = setInterval(() => {
        if (this.time == null) {
            this.stopGamePlay();
            this.init();
        }
        if (this.time >= 0) {
            this.timeHandler();
            this.comboTimeHandler();
        } else {
            this.stopGamePlay();
            this.time = 0; //Smooth animation
            this.timeHandler();
            if (this.autoPilot) {
                this.time = this.originalTime;
                this.init();
                this.ai();
            } else {
                this.menu.generateEndMenu();
            }
        }
    }, 1);
};

Game.prototype.ai = function() {
    this.autoPilot = true;
    this.autoPilotInterval = setInterval(() => {
        var options = document.getElementsByClassName("game-option");
        var options = document.getElementsByClassName("game-option");
        var number = this.generateNumber(3);
        if(options[number].id != "dead"){
          this.optionSelect(options[number]);
        }
    }, 1500);
}

Game.prototype.stopAI = function(e) {
    this.autoPilot = false;
    clearInterval(this.autoPilotInterval);
}

Game.prototype.stopGamePlay = function(e) {
    clearInterval(this.gamePlay);
}

Game.prototype.timeHandler = function(e) {
    var actualWidth = (this.time / this.originalTime) * 100;
    TweenLite.to(".timeline", 0.1, {
        width: actualWidth + "%"
    });
    this.time -= this.level;
}

Game.prototype.comboTimeHandler = function() {
    //Error handling
    if (this.currentComboTimer == null) {
        return;
    }
    if (this.currentComboTimer == 0) {
        //Die animation
        this.currentComboTimer = null;
        TweenLite.to(".combo-timeline", 0, {
            background: this.loseColor
        });
        TweenLite.to(".combo-timeline", 0, {
            opacity: 0,
            delay: 0.5
        });
        this.resetCombo();
        return;
    }
    var comboEl = document.getElementsByClassName("combo-timeline")[0];
    comboEl.innerHTML = this.comboMultiplier + "X";
    var actualWidth = (this.currentComboTimer / this.comboDuration) * 100;
    TweenLite.to(".combo-timeline", 0.1, {
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
            delay: this.animationDelay
        });
    } else {
        TweenLite.to(e, this.animationSpeed, {
            ease: Expo.easeOut,
            x: "-100%",
            delay: this.animationDelay
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
Game.prototype.addTime = function(t) {
    if ((this.time + t) > this.originalTime) {
        this.time = this.originalTime;
    } else {
        this.time += t;
    }
}
Game.prototype.calculatePoints = function() {
    if (Math.abs(this.comboStart - this.comboDuration) < this.time && this.comboStart > 0) {
        this.playSound("combo");
        this.comboMultiplier += 1;
        this.currentComboTimer = this.comboDuration;
    } else {
        this.resetCombo();
    }
    this.score += 1 * this.comboMultiplier;
    this.level += 0.1;
    this.addTime(this.timeAddedOnWin * this.comboMultiplier); //Change to variable
}
Game.prototype.optionSelect = function(e) {
    var awnser = parseInt(e.innerHTML);
    if (awnser == this.options[this.rightOption]) {
        this.animationDelay = 0;
        this.comboStart = this.time;
        this.calculatePoints();
        this.winAnimation(e);
        setTimeout(() => {
            this.generateQuestion();
        }, 700);
        return;
    } else {
        if(this.comboMultiplier > 1) {
          this.playSound("combo_drop");;
        }
        this.animationDelay = 0.5;
        this.looseAnimation(e);
        this.addTime(-this.penaltyTime);
        this.resetCombo();
    }

}

//Create a separate prototype for this
Game.prototype.playSound = function(e) {
    if (!this.autoPilot && this.sounds) {
        document.getElementById(e).play();
    }

}

Game.prototype.toggleSound = function() {
  if(this.sounds){
  document.getElementById('background_music').muted = true;
  $(".menu-sound").text("PLAY SOUNDS");
  this.sounds = false;
} else {
  this.sounds = true;
  $(".menu-sound").text("MUTE");
  document.getElementById('background_music').muted = false;
}
}
