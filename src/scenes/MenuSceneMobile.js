class MenuSceneMobile extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuSceneMobile' }); //Aqui vamos usar o atributo Key da classe pai
    }
    preload() {
        // Aqui vamos carregar o background do menu
        this.load.image('Nebula1', 'assets/Blue_Nebula_01.png');

    }

    create() {
        // Adicionando o background do menu
        this.add.tileSprite(0, 0, larguraJogo, alturaJogo, 'Nebula1').setOrigin(0, 0);
        
        // Aqui estamos colocando o título do jogo
        const title = this.add.text(this.scale.width / 2, this.scale.height / 3, 'ASTEROID ESCAPE', {
            fontSize: '32px', // Aumentei o tamanho da fonte para melhor visibilidade
            fontFamily: 'Arial',
            color: '#ffffff',
            shadow: { blur: 10, color: '#0066ff', fill: true }
        }).setOrigin(0.5);

        // Aqui vamos criar o botão de início
        const startButton = this.add.text(this.scale.width / 2,this.scale.height / 2 + 90,'Iniciar Jogo',{
                fontSize: '20px',
                fontFamily: 'Arial',
                color: '#ffffff',
                padding: { x: 20, y: 10 },
            })
        .setOrigin(0.5)
        .setInteractive() // Essa função faz o botão se tornar interativo (A caixa definida no padding)
        .on('pointerdown', () => this.startGame()); //Essa  função detecta o click do mouse no botão

       //Aqui vamos crirar o texto de tutorial
        this.add.text(this.scale.width / 2 ,this.scale.height / 2 + 150,'Como jogar: Controle a nave com o touch do celular e escape dos asteroides o quanto você conseguir!',{
            fontSize: '17px',
            fontFamily: 'Arial',
            color: '#ffffff',
            align: 'center',
            padding: { x: 20, y: 10 },
        }).setOrigin(0.5)   

    }
    startGame() {
        // Aqui fazemos a transição para a cena do jogo com um fadeout
        this.cameras.main.fade(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('GameSceneMobile', this.game);
        });
    }


    update() {

    
    }

}
