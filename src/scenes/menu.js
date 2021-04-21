class Menu extends Phaser.Scene {
    constructor(){
        super("menuScene");
    }
    preload() {
        // load audio
        this.load.audio('sfx_mouse', './assets/Start.wav');

        this.load.audio('s1', './assets/S1.wav');
        this.load.audio('s2', './assets/S2.wav');
        this.load.audio('s3', './assets/S3.wav');
        this.load.audio('s4', './assets/S4.wav');

        this.load.audio('start', './assets/StartChime.wav');

        this.load.image('menu', './assets/Menu.png'); //load backgorund
    }

    create() {
        let titleConfig = {
            fontFamily: 'Arial',
            fontweight: 'bold',
            fontSize: '36px',
            color: '#FFFFFF',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 0
        }
        let menuConfig = {
            fontFamily: 'Arial',
            fontSize: '30px',
            color: '#FFFFFF',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 0
        }

        this.menuBG = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'menu').setOrigin(0, 0);

        //show menu text
        this.add.text(game.config.width/2, game.config.height/3 - borderUIsize - borderPadding, 'Munchy the Chunky Mouse', titleConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/1.7, 'Use <- -> arrows to move & (F) to fire', menuConfig).setOrigin(0.5); menuConfig.backgroundColor = '#ffee93'; menuConfig.color = '#000';
        this.add.text(game.config.width/2, game.config.height/2 + borderUIsize*4 + borderPadding, 'Press <- for Novice or -> for Expert', menuConfig).setOrigin(0.5);
        
        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
          // easy mode
          game.settings = {
            spaceshipSpeed: 3,
            gameTimer: 60000    
          }
          this.sound.play('start', { volume: 0.05 });
          this.scene.start('playScene');    
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
          // hard mode
          game.settings = {
            spaceshipSpeed: 4,
            gameTimer: 45000    
          }
          this.sound.play('start', { volume: 0.05 });
          this.scene.start('playScene');    
        }
    }
}