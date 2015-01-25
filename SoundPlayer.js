SoundPlayer = {};

SoundPlayer.init = function(game) {

    var sfx = game.add.audio('sfx');
    sfx.allowMultiple = true;

    sfx.addMarker('alien death', 1, 1.0);
    sfx.addMarker('boss hit', 3, 0.5);
    sfx.addMarker('nextlevel', 4, 2.2);
    sfx.addMarker('meow', 8, 0.5);
    sfx.addMarker('collect', 9, 0.1);
    sfx.addMarker('ping', 10, 1.0);
    sfx.addMarker('death', 12, 4.2);
    sfx.addMarker('hit', 17, 1.0);
    sfx.addMarker('squit', 19, 0.3);

    var music = game.add.audio('bgmusic', 1, true);
    music.autoplay = false;

    this.sfx = sfx;
    this.music = music;
	
}

SoundPlayer.play = function(sfxkey) {

    this.sfx.play(sfxkey);

}

SoundPlayer.playBackgroundMusic = function() {

    if (this.music.isDecoded) {
        this.music.fadeIn(5000, true);
    }
    else {
        this.music.onDecoded.add(function() {
            this.music.fadeIn(5000, true);
        }, this);        
    }

}

SoundPlayer.stopBackgroundMusic = function() {

    this.music.fadeTo(2000, 0.3);

}