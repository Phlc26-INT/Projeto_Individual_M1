class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.spawnTime = 1500; // Timer de spawn de asteroides definido em 1.5 segundos
        this.asteroides = []; // Array para armazenar todos os asteroides
    }
    //Aqui vamos armazenar o estado do jogo, especificamente se acabou e definir o botão de restart
    gameControls = {
        over: false,
        restartBt: null
    };
    preload() {
        
        // Aqui vamos carregar os sprites e imagens do fundo
        this.load.image('nebula1', 'assets/Blue_Nebula_01.png');
        this.load.image('nebula2', 'assets/Blue_Nebula_02.png');
        this.load.image('nebula3', 'assets/Blue_Nebula_03.png');
        this.load.image('nave', 'assets/Nave.png');
        this.load.image('asteroide', 'assets/Asteroide.png');
        this.load.spritesheet('explosao', 'assets/Explosao.png', { frameWidth: 96, frameHeight: 96 });
        this.load.image('GameOver', 'assets/GameOver.png');
    }

    create() {
        //Aqui vamos definir o placar, que será por tempo de seobrevivência. A cada segundo, 1 ponto será somado
        this.time.addEvent({
            delay: 1000, // 1000ms = 1 segundo
            callback: () => {
                if (!this.gameControls.over) { // Só aumenta se o jogo não acabou
                    pontuacao += 1;
                    placar.setText('Pontuação: ' + pontuacao);
                }
            },
            loop: true // Faz o timer repetir indefinidamente
        });
        pontuacao = 0; //Definimos o placar e zeramos ele.
        placar = this.add.text(1450, 50, 'Pontuação:'+ pontuacao, {fontSize:'60px', fill:'#FFFFFF'}).setDepth(2); //Aqui estamos adicionando o placar
        teclado = this.input.keyboard.createCursorKeys(); // Aqui estamos capturando as teclas do teclado

        //Aqui criamos o botão de reiniciar jogo, que só aparecerá se o jogador perder
        this.gameControls.restartBt = this.add.text(this.scale.width / 2,this.scale.height / 2 + 300,'Reiniciar Jogo',{
            fontSize: '40px',
            fontFamily: 'Arial',
            color: '#FFFFFF',
            padding: { x: 20, y: 10 },
        })
        .setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => this.restart()); //Aqui definimos que ao clicar no botão reiniciar a função restart será chamada

        // Aqui vamos criar as camadas de parallax
        this.backgrounds = [];
        nave = this.physics.add.sprite(larguraJogo/2, 600, 'nave').setScale(1.9).setDepth(1).setSize(30,30);
        nave.body.setSize(30,30,true);
        nave.setCollideWorldBounds(true);

        // Aqui vamos armazenar valores em posições de um vetor para colocarmos no for do parallax 
        const speeds = [0.5, 1, 1.2]; 

        // Aqui vamos criar as camadas de parallax com sua velocidade de acordo com o vetor 
        for (let i = 1; i < 4; i++) {
            const bg = this.add.tileSprite(0,0,this.cameras.main.width,this.cameras.main.height,`nebula${i}`);
            bg.setOrigin(0, 0);
            bg.setScrollFactor(0);
            bg.scrollSpeed = speeds[i-1]; //Define a velocidade personalizada para o background nebula[i]
            bg.alpha = 0.9; // Define a transparência do background
            this.backgrounds.push(bg); // Salvamos a camada do background em uma posição no vetor para manipularmos o parallax no update
        }
        //Aqui verificamos se há colisão entre nave e asteroide
        this.physics.add.overlap(nave, this.asteroides, this.hitAsteroide, null, this);

        this.spawnAsteroides(); // Chamamos a função para spawnar os asteroides

        //Aqui criamos a animação de explosão da nave
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosao', { start: 0, end: 6 }),
            frameRate: 9,
            repeat: 3
        });
        
    }


    update() {

        //Essa função serve para parar o update caso o jogo tenha terminado
        if (this.gameControls.over) {
            return;

        //Todos os ifs abaixo são para criar a movimentação das setas do teclado
        }
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
            nave.setVelocityY(-4);
        }   
       // Aqui vamos atualizar o parallax vertical
        this.backgrounds.forEach(bg => {
            bg.tilePositionY -= bg.scrollSpeed; // Atualizando a posição da camada de parallax na vertical
        });
    }

    //Essa é a função que reinicia o jogo quando o botão restart é clicado
    restart() {
        if (this.gameControls.over) {
            pontuacao = 0;
            this.gameControls.over = false;
            this.scene.restart();
        }
    }
    //Essa função serve para criar um intervalo entre os spwans de asteroides, com os valores definidos no constructor da classe
    spawnAsteroides() {
        this.criarAsteroides();
        // Agenda o próximo asteroide
        this.timeoutId = setTimeout(() => {
            this.spawnAsteroides();
        }, this.spawnTime);
    }

    // Aqui definimos a função para criar os asteroides
    criarAsteroides() {
        var asteroide = this.physics.add.sprite(Phaser.Math.RND.between(50, 1920),20,'asteroide').setScale(2).setDepth(1).setSize(20,20);
        asteroide.setVelocityX(Phaser.Math.RND.between(-80, 80));
        asteroide.setVelocityY(Phaser.Math.RND.between(100, 200));
        asteroide.setCollideWorldBounds(false);
        this.asteroides.push(asteroide); // Adiciona ao array de asteroides para que todos sejam entidades colidíveis


    }

    //Essa e a função que vai notificar o game over, pois ela só é chamada quando o jogador bate em um asteroide
    hitAsteroide() {
        //Aqui vamos definir a variável de game over como true para que o jogo pare de rodar e também vamos aplicar a animação de explosão
        this.gameControls.over = true;
        nave.anims.play('explode');
        this.physics.pause();
        
        // Limpa todos os asteroides da tela que estavam no array
        this.asteroides.forEach(ast => ast.destroy());
        this.asteroides = [];
        
        //Aqui vamos limpar o timer do spawn de asteroides para voltar ao padrão
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
        // Aqui vamos criar a tela de game over
        this.add.image(this.scale.width / 2, this.scale.height / 2 - 100, 'GameOver')
            .setScale(.2)
            .setDepth(2);
        //Aqui vamos tornar visível o botão de restart
        this.gameControls.restartBt.setDepth(2);
        this.gameControls.restartBt.visible = true;
    }
    
} 