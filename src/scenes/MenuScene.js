class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }
    preload() {
        // Carregando as imagens da nebulosa
        this.load.image('nebula1', 'assets/Blue_Nebula_01.png');
        this.load.image('nebula2', 'assets/Blue_Nebula_02.png');
        this.load.image('nebula3', 'assets/Blue_Nebula_03.png');
    }

    create() {
        // Adicionando o background    
        this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'nebula1').setOrigin(0, 0);
        // Título do jogo
        const title = this.add.text(
            this.scale.width / 2,
            this.scale.height / 3,
            'ASTEROID ESCAPE',
            {
                fontSize: '55px',
                fontFamily: 'Arial',
                color: '#ffffff',
                shadow: { blur: 10, color: '#0066ff', fill: true }
            }
        ).setOrigin(0.5);

        // Botão de início
        const startButton = this.add.text(
            this.scale.width / 2,
            this.scale.height / 2 + 90,
            'Iniciar Jogo',
            {
                fontSize: '32px',
                fontFamily: 'Arial',
                color: '#ffffff',
                padding: { x: 20, y: 10 },
            })
        .setOrigin(0.5)
        .setInteractive()
        .on('pointerover', () => startButton.setScale(1.1))
        .on('pointerout', () => startButton.setScale(1))
        .on('pointerdown', () => this.startGame());

    }
    startGame() {
        // Transição para a cena do jogo
        this.cameras.main.fade(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('GameScene', this.game);
        });
    }


    update() {

    
    }

}
