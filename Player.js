Player = function(game, x, y) {

	this.blinking = false;
    this.blinkCounter = 5;
    this.blinkEndTime = 0;
    this.isFrozen = false;

    Phaser.Sprite.call(this, game, x, y, 'baddie_yellow');

	this.anchor.setTo(0.5, 0.5);
    this.animations.add('runleft',[0,1],5,true);
    this.animations.add('runright',[2,3],5,true);
    this.animations.play('runright');

    game.physics.enable(this, Phaser.Physics.ARCADE);
    
    this.body.collideWorldBounds = true;
    //player.body.bounce.y = 0.2;
    this.body.drag.setTo(1000,100);
    this.body.maxVelocity.setTo(250,250);
    this.body.gravity.y = 300;
    this.body.setSize(28,28,0.5,0.5);

    game.add.existing(this);

};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {

    if (this.isBlinking()) {

        if (--this.blinkCounter == 0) {
            this.renderable = !this.renderable;
            this.blinkCounter = 5;
        }

        if (this.game.time.now > this.blinkEndTime) {
            this.setBlinking(false);
            this.renderable = true;
        }

    }

}

Player.prototype.updateMovement = function(cursors) {

    this.body.acceleration.x = 0;
    this.body.acceleration.y = 0;

    if (this.isFrozen) {

        this.body.velocity.setTo(0,0);

    }
    else {

        if (cursors.left.isDown) {

            this.body.acceleration.x = -1500;
            if (this.animations.name != 'runleft') {
                this.animations.play('runleft');    
            }

        }
        else
        if (cursors.right.isDown) {

            this.body.acceleration.x = 1500;
            if (this.animations.name != 'runright') {
                this.animations.play('runright');    
            }
            
        }

        if (cursors.up.isDown || jumpButton.isDown) {            
            this.body.acceleration.y = -1500;
        }
        
        if (cursors.down.isDown) {
            this.body.acceleration.y = 1500;
        }


    }


}

Player.prototype.setBlinking = function(enable, time) {
    this.blinking = enable;
    if (enable) {
        this.blinkCounter = 5;

        time = time || 3000;

        this.blinkEndTime = this.game.time.now + time;
    }
};

Player.prototype.isBlinking = function() {
    return this.blinking;
};

Player.prototype.setFrozen = function(enable) {
    this.isFrozen = enable;
}