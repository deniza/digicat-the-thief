UIManager = {}

UIManager.init = function(game) {

	this.game = game;
	this.container = game.add.group();
    this.container.fixedToCamera = true;

	UIManager.initMainMenu();
	UIManager.initGameOverScreen();
	UIManager.initGameHUD();

	game.input.keyboard.addCallbacks(this, onKeyDown);

}

function onKeyDown(keyEvent) {
	
	if (keyEvent.keyCode == 32) {
		//space is down		
		
		if (this.mainmenu.visible) {
			this.mainmenu_input_handler();
		}
		else
		if (this.gameover.visible && this.goverinstructions.visible) {
			this.gameover_input_handler();
		}
	}


}

UIManager.toTop = function() {
	//this.container.parent.add(this.container);
}

UIManager.initGameOverScreen = function() {

    var game = this.game;
    var gameover = game.add.group();
    this.container.add(gameover);
    
    var gog = game.add.graphics(0, 0);
    gog.alpha = 0.7;

    //gog.beginFill(0xaa2200);
    gog.beginFill(0xaa55aa);
    gog.drawRect(0, game.world.centerY - 50, game.width, 100);
    gog.endFill();
    gameover.add(gog);

    var gameOverLabel = game.add.bitmapText(game.world.centerX - 140, game.world.centerY - 15, 'carrier_command', "GAME OVER", 16*2);
    gameover.add(gameOverLabel);

    var instructionsStr = "PRESS [SPACE]";
    var instructions = game.add.bitmapText(game.world.centerX - 100, game.world.centerY + 30, 'carrier_command', instructionsStr, 16);
    gameover.add(instructions);

    gameover.visible = false;

    this.goverinstructions = instructions;
    this.gameover = gameover;

}

UIManager.initMainMenu = function() {

    var game = this.game;
    var mainmenu = game.add.group();
    this.container.add(mainmenu);
        
    var menug = game.add.graphics(0, 0);
    menug.alpha = 0.7;

    //menug.beginFill(0xaa2200);
    menug.beginFill(0xaa55aa);
    menug.drawRect(0, game.world.centerY - 80, game.width, 150);
    menug.endFill();
    mainmenu.add(menug);

    var menuCaption = game.add.bitmapText(game.world.centerX - 320, game.world.centerY - 60, 'carrier_command', "Digicat The Thief", 16*2);
    mainmenu.add(menuCaption);

    var instructionsStr1 = "MOVE: Left,Right,Down THRUST: Space";
    var instructions1 = game.add.bitmapText(game.world.centerX - 330, game.world.centerY, 'carrier_command', instructionsStr1, 16);
    mainmenu.add(instructions1);

    var instructionsStr2 = "PRESS [SPACE] TO START";
    var instructions2 = game.add.bitmapText(game.world.centerX - 200, game.world.centerY + 40, 'carrier_command', instructionsStr2, 16);
    mainmenu.add(instructions2);

    mainmenu.visible = false;

    this.mainmenu = mainmenu;

}

UIManager.initGameHUD = function() {

	var game = this.game;

    var heart = game.add.sprite(0,0, 'heart');
    heart.anchor.setTo(0.5,0.5);
    heart.scale.setTo(0.8,0.8);
    heart.x = 720;
    heart.y = 16;

    var livesLabel = game.add.bitmapText(game.world.centerX, game.world.centerY, 'carrier_command', "x"+lives, 16);
    livesLabel.x = 740;
    livesLabel.y = 8;
    livesLabel.stroke = "#000000";
    livesLabel.strokeThickness = 10;

    var graphics = game.add.graphics(0, 0);

    //graphics.beginFill(0xaa2200);
    graphics.beginFill(0xaa55aa);
    graphics.drawRect(0, 0, game.width, 30);
    graphics.endFill();

    var levelLabel = game.add.bitmapText(game.world.centerX - 60, 8, 'carrier_command', "LEVEL 1", 16);

    levelLabel.tint = 0xffffff;
    levelLabel.dirty = true;

    this.livesLabel = livesLabel;
    this.levelLabel = levelLabel;

    this.container.add(graphics);
    this.container.add(livesLabel);
    this.container.add(levelLabel);
    this.container.add(heart);

}

UIManager.hideMainMenu = function() {

	this.mainmenu.visible = false;

}

UIManager.showMainMenu = function() {

	this.mainmenu.visible = true;

}

UIManager.hideGameOverScreen = function() {

	this.gameover.visible = false;

}

UIManager.showGameOverScreen = function() {

	this.gameover.visible = true;
	this.goverinstructions.visible = false;

    this.game.time.events.add(Phaser.Timer.SECOND * 2, function() {

        this.goverinstructions.visible = true;

    }, this);

}

UIManager.setLevel = function(level) {
	this.levelLabel.setText("LEVEL "+level);
}

UIManager.setLives = function(lives) {
	this.livesLabel.setText("x"+lives);
}

UIManager.setUIEventHandler = function(eventName, func) {

	if (eventName == "gameover_input") {
		this.gameover_input_handler = func;
	}
	else
	if (eventName == "mainmenu_input") {
		this.mainmenu_input_handler = func;
	}

}

UIManager.update = function() {


}

