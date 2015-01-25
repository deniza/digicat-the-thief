var LevelManager = {};

LevelManager.init = function(game, player) {

	this.game = game;
    this.player = player;
	this.freexy = [];
    this.blocks = game.add.group();
    this.diamonds = game.add.group();
    this.collectedDiamonds = game.add.group();
    this.levelShakeCounter = 0;    

};

LevelManager.getRandomFreeSpot = function() {

    return this.freexy[Math.floor(Math.random()*this.freexy.length)];

}

LevelManager.createRandomLevel = function() {

    delete this.freexy;
    this.freexy = []

    this.blocks.removeAll();
    this.diamonds.removeAll();

    var maxx = 25;
    var maxy = 19;

    for (var yy = 0;yy<maxy;++yy) {
        for (var xx = 0;xx<maxx;++xx) {
                        
            if (xx > 1 && xx < maxx-2 && yy > 1 && yy < maxy-2 && Math.random() < 0.95) {
                this.freexy[this.freexy.length] = [xx,yy];
            }
            else {
                var tile = this.game.add.sprite(xx * 32, yy * 32, 'tilemap', Math.floor(Math.random()*5)+2);
                tile.anchor.setTo(0.0, 0.0);
                this.blocks.add(tile);

                this.game.physics.enable(tile, Phaser.Physics.ARCADE);
                tile.body.immovable = true;
                tile.body.allowGravity = false;

            }
        }
    }

}

LevelManager.getWorldBounds = function() {
    return {x:0, y:0, width: 800, height: 600};
}

LevelManager.spawnDiamonds = function(count) {

    for (var i=0;i<count;++i) {
        
        var freeSpot = LevelManager.getRandomFreeSpot();
        var x = freeSpot[0]*32;
        var y = freeSpot[1]*32;

        var diamond = this.game.add.sprite(x, y, 'diamond');
        diamond.anchor.setTo(0.0, 0.0);
        this.diamonds.add(diamond);

        diamond.scale.setTo(1,1);

        this.game.physics.enable(diamond, Phaser.Physics.ARCADE);
        diamond.body.immovable = true;
        diamond.body.allowGravity = false;

    }


}

LevelManager.setupNextLevel = function(level) {

    var worldBounds = this.getWorldBounds();

    var tw = this.game.add.tween(this.blocks).to( {y:worldBounds.height + 10}, 1000, Phaser.Easing.Cubic.Out);
    tw.onComplete.add(function() {

        this.blocks.removeAll();
        this.diamonds.removeAll();

        LevelManager.createRandomLevel();

        var tw = this.game.add.tween(this.blocks).to( {y:0}, 1000, Phaser.Easing.Cubic.In);
        tw.onComplete.add(function() {

            LevelManager.spawnDiamonds(level);
                        
        },this);

        tw.start();

    }, this);

    tw.start();

}

LevelManager.collectDiamond = function(diamond) {

    this.diamonds.remove(diamond);
    this.collectedDiamonds.add(diamond);

    this.game.add.tween(diamond.scale).to( {x:0.2,y:0.2}, 500, Phaser.Easing.Linear.None, true);
    diamond.timeToRemove = this.game.time.now + 1000;

}

LevelManager.handleCollectedDiamond = function(diamond) {

    if (this.game.time.now > diamond.timeToRemove) {
        
        this.collectedDiamonds.remove(diamond);
        diamond.kill();

    }

}

LevelManager.removeRemoveAllDiamonds = function() {

    this.diamonds.removeAll(true, true);

}

LevelManager.shake = function() {

    this.levelShakeCounter = 20;

}

LevelManager.update = function() {

    this.collectedDiamonds.forEach(function(diamond) {

        var distance = game.math.distance(diamond.x, diamond.y, this.player.x, this.player.y);

        var rotation = game.math.angleBetween(diamond.x, diamond.y, this.player.x, this.player.y);

        var speed = 200;

        diamond.body.velocity.x = Math.cos(rotation) * speed;
        diamond.body.velocity.y = Math.sin(rotation) * speed;

    });

   
    if (this.levelShakeCounter > 0) {

        var rand1 = this.game.rnd.integerInRange(-10,10);
        var rand2 = this.game.rnd.integerInRange(-10,10);
        var worldBounds = this.getWorldBounds();

        this.game.world.setBounds(rand1, rand2, worldBounds.width, worldBounds.height);
        if (--this.levelShakeCounter == 0) {
            this.game.world.setBounds(worldBounds.x, worldBounds.y, worldBounds.width, worldBounds.height);
        }

    }

}
