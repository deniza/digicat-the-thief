Enemy = function(game, x, y) {

	Phaser.Sprite.call(this, game, x, y, 'baddie');

    this.anchor.setTo(0.0, 0.0);
    this.animations.add('stand', [0]);
    this.animations.add('left', [0,1]);
    this.animations.add('right', [2,3]);

    game.physics.enable(this, Phaser.Physics.ARCADE);

    this.reset(x, y);
    this.body.bounce.set(1);

    this.body.velocity.setTo(-200 + Math.random()*400, -200 + Math.random()*400);

    if (this.body.velocity.x >= 0) {
        this.animations.play('right', 3, true);
    }
    else {
        this.animations.play('left', 3, true);
    }

    game.add.existing(this);

};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

//Enemy.prototype.update = function() {
//}

Enemy.prototype.freeze = function() {
    this.body.velocity.setTo(0,0);
}

Enemy.prototype.moveRandom = function() {

    this.body.velocity.setTo(-200 + Math.random()*400, -200 + Math.random()*400);

    if (this.body.velocity.x >= 0) {
        this.animations.play('right', 3, true);
    }
    else {
        this.animations.play('left', 3, true);
    }

}

