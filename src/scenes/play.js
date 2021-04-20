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

        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});    

        //load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {
            frameWidth: 64,
            frameWidth: 32,
            startFrame: 0,
            endFrame: 9
        });
    }

    create() {
        //backgorund
        this.starfield = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'background').setOrigin(0, 0);
        
        //beige UI
        this.add.rectangle(0, borderUIsize + borderPadding, game.config.width, borderUIsize * 2, 0xfcf5c7).setOrigin(0, 0);


        //white borders
        //this.add.rectangle(0, 0, game.config.width, borderUIsize, 0xFFFFFF).setOrigin(0, 0);
        //this.add.rectangle(0, game.config.height - borderUIsize, game.config.width, borderUIsize, 0xFFFFFF).setOrigin(0, 0);
        
        //this.add.rectangle(0, 0, borderUIsize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        //this.add.rectangle(game.config.width - borderUIsize, 0, borderUIsize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        //this.add.text(20, 20, "Rocket Patrol Play");

        //add cheese x3
        this.ship01 = new Spaceship(this, game.config.width + borderUIsize*6, borderUIsize*4, 'cheese1', 0, 30).setOrigin(0.0);
        this.ship02 = new Spaceship(this, game.config.width + borderUIsize*3, borderUIsize*5 +borderPadding*2, 'cheese3', 0, 20).setOrigin(0.0);
        this.ship03 = new Spaceship(this, game.config.width, borderUIsize*6 + borderPadding*4, 'cheese2', 0, 10).setOrigin(0.0);

        //add mouse
        //this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUIsize - borderPadding, 'rocket').setOrigin(0.5, 0);
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

        // initialize score
        this.p1Score = 0;
          // display score
        let scoreConfig = {
            fontFamily: 'Arial',
            fontSize: '28px',
            //backgroundColor: '#43aa8b',
            color: '#43aa8b',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 100
        }
        this.add.text(borderUIsize + borderPadding*1.5, borderUIsize + borderPadding*4, 'Score: ', scoreConfig).setOrigin(0.5);
        this.scoreLeft = this.add.text(borderUIsize + borderPadding, borderUIsize + borderPadding*2.2, this.p1Score, scoreConfig);
        
        // GAME OVER flag
        this.gameOver = false;
        
        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
        this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or <- for Menu', scoreConfig).setOrigin(0.5);this.gameOver = true;}, null, this);

        //display clock time
        this.add.text(borderUIsize + borderPadding*45, borderUIsize + borderPadding*4, 'Time: ', scoreConfig).setOrigin(0.5);
        this.clockDisplay = this.add.text(borderUIsize + borderPadding*30, borderUIsize + borderPadding*2.2, this.clock, scoreConfig);
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

        if (!this.gameOver) {               
            this.p1Rocket.update(); //update p1 rocket
            //update spaceship x3
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
            
            this.p1Rocket.update();         // update rocket sprite
            this.ship01.update();           // update spaceships (x3)
            this.ship02.update();
            this.ship03.update();
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

        this.sound.play('sfx_explosion');
    }
}