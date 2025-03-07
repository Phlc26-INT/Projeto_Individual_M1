class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.spawnTime = 5000; // Timer inical de spawn de asteroides omeça com 2 segundos
        this.timeoutId = null; // Variável para armazenar o ID do timeout
    }

    gameControls = {
        over: false,
        current_col_scored: false,
        score: 0,
        restartBt: null
    };
    preload() {
        // ... existing code ...
        
        // Aqui vamos carregar os sprites e imagens do fundo
        this.load.image('nebula1', 'assets/Blue_Nebula_01.png');
        this.load.image('nebula2', 'assets/Blue_Nebula_02.png');
        this.load.image('nebula3', 'assets/Blue_Nebula_03.png');
        this.load.image('nave', 'assets/Nave.png');
        this.load.spritesheet('turbo', 'assets/Turbo.png', { frameWidth: 96, frameHeight: 96 });
        this.load.spritesheet('asteroide', 'assets/Asteroide.png', { frameWidth: 96, frameHeight: 96 });
        this.load.spritesheet('explosao', 'assets/Explosao.png', { frameWidth: 96, frameHeight: 96 });
    }

    create() {
        placar = this.add.text(50, 50, 'Asteróides Evitados:'+ pontuacao, {fontSize:'45px', fill:'#ffffff'});
        pontuacao = 0;
        teclado = this.input.keyboard.createCursorKeys();
        // Aqui vamos criar as camadas de parallax
        this.backgrounds = [];
        nave = this.physics.add.sprite(larguraJogo/2, 600, 'nave').setScale(1.8).setDepth(1).setSize(25,30);
        nave.setCollideWorldBounds(true);
        // Aqui vamos armazenar valores em posições de um vetor para colocarmos no for do parallax 
        const speeds = [0.5, 1, 1.2, 1.4]; 
        // Aqui vamos criar as camadas de parallax com sua velocidade de acordo com o vetor 
        for (let i = 1; i < 4; i++) {
            const bg = this.add.tileSprite(0,0,this.cameras.main.width,this.cameras.main.height,`nebula${i}`);
            bg.setOrigin(0, 0);
            bg.setScrollFactor(0);
            bg.scrollSpeed = speeds[i-1];
            bg.alpha = 0.9; // Aqui vamos definir a transparência para criar efeito de profundidade
            this.backgrounds.push(bg); // Aqui vamos adicionar a camada atual do loop ao vetor de backgrounds para ficar rodando
            this.spawnAsteroides();
        }

    }
    spawnAsteroides() {
        this.criarAsteroides();
        
        // Reduz o tempo para o próximo spawn
        this.spawnTime = Math.max(500, this.spawnTime - 1);
        
        // Agenda o próximo asteroide
        this.timeoutId = setTimeout(() => {
            this.spawnAsteroides();
        }, this.spawnTime);
    }
    criarAsteroides() {
        asteroide = this.physics.add.sprite((Phaser.Math.RND.between(50, 1920)), 20, 'asteroide').setScale(2).setDepth(1).setSize(20,20);
        asteroide.setVelocityX(Phaser.Math.RND.between(-30, 40));
        asteroide.setCollideWorldBounds(true);
        asteroide.setVelocityY(Phaser.Math.RND.between(100, 200));
    }

    update() {

        if (teclado.left.isDown) {
            nave.x -= 3
        } 
      
        if (teclado.right.isDown) {
            nave.x += 3; 
        } 

        if (teclado.down.isDown) {
            nave.y += 3;
        }       
        if (teclado.up.isDown) {
            nave.y -= 3;
            nave.setVelocityY(-1);
        }   

       // Aqui vamos atualizar o parallax vertical
        this.backgrounds.forEach(bg => {
            bg.tilePositionY -= bg.scrollSpeed; // Atualizando a posição da camada de parallax
        });
    }
    
} 