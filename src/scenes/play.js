class Play extends Phaser.Scene {
    constructor(){
        super("playScene");     
    }
    preload() {

        this.load.image('mouse', './assets/Mouse.png'); //load mouse

        this.load.image('cheese1', './assets/cheese1.png'); //load cheeses x3
        this.load.image('cheese2', './assets/cheese2.png');
        this.load.image('cheese3', './assets/cheese3.png');

        
        this.load.image('background', './assets/Background.png'); //load backgorund

        this.load.image('gameOverBG', './assets/GameOver.png'); //load Game Over backgorund

        this.load.spritesheet('explosion', './assets/ExplosionSheet.png', {frameWidth: 60, frameHeight: 35, startFrame: 0, endFrame: 9}); //explosion spritesheet

        //this.load.spritesheet('c1shake', './assets/Cheese1SpriteSheet.png', {frameWidth: 64, frameHeight: 45, startFrame:0, endFrame: 5});
    }

    create() {
        //backgorund
        
        this.starfield = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'background').setOrigin(0, 0);
        
        //beige UI
        this.add.rectangle(0, borderUIsize + borderPadding, game.config.width, borderUIsize * 2, 0xfcf5c7).setOrigin(0, 0);

        // white borders
        this.add.rectangle(0, -20, game.config.width, borderUIsize, 0x52b788).setOrigin(0 ,0);
        this.add.rectangle(0, game.config.height - borderUIsize, game.config.width, borderUIsize, 0xb07d62).setOrigin(0 ,0);
        this.add.rectangle(-20, 0, borderUIsize, game.config.height, 0x52b788).setOrigin(0 ,0);
        this.add.rectangle(game.config.width - borderUIsize + 20, 0, borderUIsize, game.config.height, 0x52b788).setOrigin(0 ,0);

        //add cheese x3
        this.ship01 = new Spaceship(this, game.config.width + borderUIsize*6, borderUIsize*4, 'cheese1', 0, 30).setOrigin(0.0);
        this.ship02 = new Spaceship(this, game.config.width + borderUIsize*3, borderUIsize*5 +borderPadding*2, 'cheese3', 0, 20).setOrigin(0.0);
        this.ship03 = new Spaceship(this, game.config.width, borderUIsize*6 + borderPadding*4, 'cheese2', 0, 10).setOrigin(0.0);

        //add mouse
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUIsize - borderPadding, 'mouse').setOrigin(0.5, 0);

        //define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        this.anims.create({
            key: 'explode', 
            frames: this.anims.generateFrameNumbers('explosion', {
                start: 0,
                end: 9,
                first: 0
            }),
            frameRate: 30
        });

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        let munchConfig = {
            fontFamily: 'Arial',
            fontSize: '32px',
            backgroundColor: '#43aa8b',
            color: '#FFFFFF',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 0
        }
        //show munch text
        //this.add.text(game.config.width/2, game.config.height/4.2 - borderUIsize - borderPadding, 'MUNCH', munchConfig).setOrigin(0.5);

        // initialize score
        this.p1Score = 0;
        this.highscore = 0;

          // display score
        let scoreConfig = {
            fontFamily: 'Arial',
            fontSize: '28px',
            color: '#43aa8b',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 0
        }

        let titleConfig = {
            fontFamily: 'Arial',
            fontweight: 'bold',
            fontSize: '38px',
            color: '#000000',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 0
        }
        this.add.text(borderUIsize + borderPadding*3.5, borderUIsize + borderPadding*4, 'Score: ', scoreConfig).setOrigin(0.5);
        this.scoreLeft = this.add.text(borderUIsize + borderPadding*9.5, borderUIsize + borderPadding*2.2, this.p1Score, scoreConfig);
        
        // GAME OVER flag
        this.gameOver = false;
        
        // play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
        this.GameOverBG = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'gameOverBG').setOrigin(0, 0);

        this.add.text(game.config.width/2, game.config.height/3 - borderUIsize - borderPadding, 'GAME OVER', titleConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2.5, 'Highscore: ' + this.highscore, scoreConfig).setOrigin(0.5); scoreConfig.backgroundColor = '#ffee93'; scoreConfig.color = '#000';
        
        this.add.text(game.config.width/2, game.config.height/2 + 90, 'Press (R) to Restart or <- for Menu', scoreConfig).setOrigin(0.5);
        
        this.gameOver = true;}, null, this);

        //add timer countdown
        this.timeCount = this.add.text(borderUIsize + borderPadding*50, borderUIsize + borderPadding*2.2, '', scoreConfig);

        //display clock time
        this.add.text(borderUIsize + borderPadding*45, borderUIsize + borderPadding*4, 'Time: ', scoreConfig).setOrigin(0.5);
    }

    update() {
          // check key input for restart
        this.starfield.tilePositionX -= 4; //update tile sprite
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        let munchConfig = {
            fontFamily: 'Arial',
            fontSize: '32px',
            backgroundColor: '#43aa8b',
            color: '#FFFFFF',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 0
        }

        if (!this.gameOver) {               
            this.p1Rocket.update(); //update p1 rocket
            //update spaceship x3
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
            
            this.p1Rocket.update();         // update mouse sprite
            this.ship01.update();           // update cheeses (x3)
            this.ship02.update();
            this.ship03.update();

            this.timeCount.setText((game.settings.gameTimer/1000) - Math.floor(this.clock.getElapsedSeconds())); //countdown clock
        } 
        
        if(this.checkCollision(this.p1Rocket, this. ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if(this.checkCollision(this.p1Rocket, this. ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if(this.checkCollision(this.p1Rocket, this. ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }

    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }
    
    shipExplode(ship) {
        //hide ship temp.
        ship.alpha = 0;

        //create explosion
        let boom = this.add.sprite(ship.x, ship.y, 'explosion'). setOrigin(0,0);
        boom.anims.play('explode');
        boom.on('animationcomplete', () => {
            ship.reset();
            ship.alpha = 1;
            boom.destroy();
        });

        // score add and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;

        if(this.p1Score > this.highscore) {
            this.highscore = this.p1Score;
        }

        this.sound.play('sfx_explosion');
    }
}