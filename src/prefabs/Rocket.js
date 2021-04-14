//Rocket Player Prefab
class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);

        this.sfxRocket = scene.sound.add('sfx_rocket'); // add rocket sfx

        this.isFiring = false;  //track rocket firing status
        this.moveSpeed = 2;  //pixels per frame
    }
    
    update() {
        //left/right movement
        if(!this.isFiring) {
            if(keyLEFT.isDown && this.x >= borderUIsize + this.width) {
                this.x -= this.moveSpeed;
            } else if (keyRIGHT.isDown && this.x <= game.config.width - borderUIsize - this.width){
                this.x += this.moveSpeed;
            }
        }
        // fire button
        if (Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring) {
            this.isFiring = true;
            this.sfxRocket.play();  // play sfx
        }
        //if F, move rocket up
        if(this.isFiring && this.y >= borderUIsize*3 + borderPadding) {
            this.y -= this.moveSpeed;
        }
        //reset if missed
        if(this.y <= borderUIsize*3 + borderPadding) {
            this.reset();
        }
    }

    //reset rocket to ground
    reset() {
        this.isFiring = false;
        this.y = game.config.height - borderUIsize - borderPadding;
    }
}