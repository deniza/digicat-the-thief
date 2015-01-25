var EnemyManager = {};

EnemyManager.init = function(game) {	
	this.game = game;
	this.enemies = game.add.group();
    this.enemiesArray = new Array();
};

EnemyManager.spawnEnemy = function(x, y) {

	var enemy = new Enemy(this.game, x, y);
	enemy.isAlive = true;

    this.enemies.add(enemy);
    this.enemiesArray.push(enemy);

};

EnemyManager.killAllEnemies = function() {

    for (var i=0;i<this.enemiesArray.length;++i) {
        var enemy = this.enemiesArray[i];
        enemy.destroy();
    }

};

EnemyManager.freezeAllEnemies = function() {

    this.enemies.forEach(function(enemy) {
        
        if (enemy.isAlive == true) {
            enemy.freeze();    
        }
        

    }, this);

};

EnemyManager.randomizeAllEnemiesMotion = function() {

    this.enemies.forEach(function(enemy) {
    
        enemy.moveRandom();
    
    }, this);

};

EnemyManager.throwEnemyOutOfGamefield = function(enemy) {

    enemy.isAlive = false;
    enemy.body.angularVelocity = 100;

    enemy.body.velocity.setTo(-10 + Math.random()*20 , 200);
    enemy.animations.play('stand');

};

EnemyManager.throwAllEnemiesOutOfGamefield = function() {

    this.enemies.forEach(function(enemy) {

        EnemyManager.throwEnemyOutOfGamefield(enemy);
	
    }, this);

};

EnemyManager.update = function() {

    for (var i=0;i<this.enemiesArray.length;++i) {

        var enemy = this.enemiesArray[i];

        if (enemy.isAlive == false) {
            if (enemy.y < -50 || enemy.y > this.game.height + 50 || enemy.x < -50 || enemy.x > this.game.width + 50) {
                enemy.destroy();
            }
        }

    }
    
}

