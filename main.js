var GameStateLevelStart = 0;
var GameStatePlay = 1;
var GameStateGameOver = 2;
var GameStateGameOverWaitingInput = 3;
var GameStateMenu = 4;

var gameState;
var player;
var cursors;
var jumpButton;
var enemyCount = 1;
var diamondCount = 1;
var score = 0;
var lives = 2;
var level = 1;
var playerEmitter;

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.spritesheet('tilemap', 'assets/ground_1x1_bw.png?1', 32, 32);
    game.load.spritesheet('baddie_yellow', 'assets/baddie_yellow.png?1', 32, 32);
    game.load.spritesheet('baddie', 'assets/baddie_bw.png?1', 32, 32);
    game.load.image('heart', 'assets/heart_bw.png?1');
    game.load.image('diamond', 'assets/diamond_bw.png?1');
    game.load.image('chunk', 'assets/chunk.png');
    game.load.audio('sfx', 'assets/fx_mixdown.mp3');
    game.load.audio('bgmusic', ['assets/A_Night_Of_Dizzy_Spells.mp3']);
    game.load.bitmapFont('carrier_command', 'assets/carrier_command.png', 'assets/carrier_command.xml');

}

function create() {

    LevelManager.init(game);
    EnemyManager.init(game);
    UIManager.init(game);
    SoundPlayer.init(game);
    
    game.stage.smoothed = false;
    game.time.advancedTiming = true;

    gameState = GameStateMenu;    

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 100;

	var worldBounds = LevelManager.getWorldBounds();
    game.world.setBounds(worldBounds.x, worldBounds.y, worldBounds.width, worldBounds.height);

    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.scale.refresh();

    playerEmitter = game.add.emitter(0, 0, 200);
    playerEmitter.makeParticles('chunk');
    playerEmitter.minRotation = 0;
    playerEmitter.maxRotation = 0;
    playerEmitter.gravity = 100;
    playerEmitter.bounce.setTo(0.2, 0.2);
    playerEmitter.alpha = 0.3;

	player = new Player(game, 12*32, 15*32);
    game.camera.follow(player);

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    
    showMainMenu();    
    
    UIManager.setUIEventHandler("mainmenu_input", startNewGame);
    UIManager.setUIEventHandler("gameover_input", showMainMenu);

    UIManager.toTop();

    Postprocessing.init(game);
    
}

function showMainMenu() {

    UIManager.hideGameOverScreen();
    UIManager.showMainMenu();

    EnemyManager.killAllEnemies();

    LevelManager.createRandomLevel();
    LevelManager.spawnDiamonds(1);

    var freeSpot = LevelManager.getRandomFreeSpot();
    EnemyManager.spawnEnemy(freeSpot[0]*32, freeSpot[1]*32);

    var playerFreeSpot = LevelManager.getRandomFreeSpot();
    player.reset(playerFreeSpot[0]*32, playerFreeSpot[1]*32);

    SoundPlayer.playBackgroundMusic();

}

function startNewGame() {

    UIManager.hideMainMenu();

    gameState = GameStatePlay;
    enemyCount = 1;
    diamondCount = 1;
    level = 1;
    lives = 2;

    UIManager.setLevel(level);
    UIManager.setLives(lives);

    player.setBlinking(true, 2000);

}

function render() {
}

function update() {

    LevelManager.update();
    EnemyManager.update();

    Postprocessing.update({x:player.x,y:player.y});

    player.updateMovement(cursors);

    if (cursors.up.isDown || jumpButton.isDown){
        playerEmitter.x = player.x;
        playerEmitter.y = player.y;
        playerEmitter.start(true, 1000, null, 1);
    }

    game.physics.arcade.collide(player, LevelManager.blocks);
    game.physics.arcade.collide(playerEmitter, LevelManager.blocks);
    game.physics.arcade.overlap(playerEmitter, EnemyManager.enemies, emitterEnemiesOverlapHandler, null, this);
    game.physics.arcade.collide(EnemyManager.enemies, LevelManager.blocks, enemiesBlocksCollideHandler, enemiesBlocksCollideProcessHandler, this);
    game.physics.arcade.overlap(player, LevelManager.diamonds, playerDiamondsOverlapHandler, playerDiamondsOverlapProcessHandler, this);
    game.physics.arcade.overlap(player, LevelManager.collectedDiamonds, playerCollectedDiamondsOverlapHandler, null, this);
    game.physics.arcade.overlap(player, EnemyManager.enemies, playerEnemiesOverlapHandler, playerEnemiesOverlapProcessHandler, this);

}

function transitionToLevel(nextLevel) {

    gameState = GameStateLevelStart;

    EnemyManager.killAllEnemies();

    LevelManager.setupNextLevel(nextLevel);

    for (var i=0;i<=enemyCount;++i) {

        var freeSpot = LevelManager.getRandomFreeSpot();
        EnemyManager.spawnEnemy(freeSpot[0]*32, freeSpot[1]*32);
        
    }

    EnemyManager.freezeAllEnemies();        

    player.body.velocity.setTo(0,0);

    level = nextLevel;
    ++enemyCount;
    ++diamondCount;

    UIManager.setLevel(nextLevel);

    game.time.events.add(Phaser.Timer.SECOND * 2, function() {
        
        gameState = GameStatePlay;
        EnemyManager.randomizeAllEnemiesMotion();

        player.setFrozen(false);

    });


}

function playerCollectedDiamondsOverlapHandler(player, diamond) {

    LevelManager.handleCollectedDiamond(diamond);

}

function playerDiamondsOverlapProcessHandler (player, diamond) {

    if (gameState != GameStatePlay) {
        return false;
    }
    else {
        return true;
    }


}


function playerDiamondsOverlapHandler (player, diamond) {

    SoundPlayer.play('collect');

    LevelManager.collectDiamond(diamond);

    if (LevelManager.diamonds.countLiving() == 0) {

        game.physics.arcade.gravity.y = 0;

        SoundPlayer.play('nextlevel');

        player.setBlinking(true, 4000);
        player.setFrozen(true);

        transitionToLevel(level+1);

    }

}

function playerEnemiesOverlapProcessHandler (player, enemy) {

    if (gameState != GameStatePlay) {
        return false;        
    }
    else {
        return true;
    }

}

function playerEnemiesOverlapHandler (player, enemy) {

    if (gameState == GameStateGameOver) {
        return;
    }

    if (player.isBlinking() == false) {

        player.setBlinking(true);
        
        if (lives == 0) {
            
            SoundPlayer.play('death');
            
            gameState = GameStateGameOver;

            UIManager.showGameOverScreen();
            SoundPlayer.stopBackgroundMusic();

        }
        else {
            
            SoundPlayer.play('hit');

            EnemyManager.throwEnemyOutOfGamefield(enemy);

            UIManager.setLives(--lives);

        }

        LevelManager.shake();

    }


}

function emitterEnemiesOverlapHandler(playerEmitter, enemy) {

    if ((enemy.colorTween && enemy.colorTween.isRunning == false) || enemy.colorTween == null)  {
        Util.tweenTint(enemy, 0xffffff, 0xff0000, 1000);
    }

}

function enemiesBlocksCollideHandler (enemy, block) {

    if (enemy.body.velocity.x >= 0) {
        enemy.animations.play('right', 3, true);
    }
    else {
        enemy.animations.play('left', 3, true);
    }

}

function enemiesBlocksCollideProcessHandler (enemy, block) {

    if (enemy.isAlive == false) {
        return false;
    }

    if (enemy.body.velocity.x >= 0) {
        enemy.animations.play('right', 3, true);
    }
    else {
        enemy.animations.play('left', 3, true);
    }

}
