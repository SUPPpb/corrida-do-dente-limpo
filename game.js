const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 400,
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [Inicio, Jogo, Fim]
};

const game = new Phaser.Game(config);

function carregarSprite(scene, nome) {
    scene.load.image(nome, `assets/${nome}.png`);
}

class Inicio extends Phaser.Scene {
    constructor() {
        super('Inicio');
    }

    preload() {
        carregarSprite(this, 'fundo');
        carregarSprite(this, 'dentista');
    }

    create() {
        this.add.image(400, 200, 'fundo');
        this.add.image(200, 300, 'dentista').setScale(0.6);

        const texto = this.add.text(400, 100, 'Olá! Parabéns por cuidar do seu sorriso!\nVamos jogar?', {
            font: '24px Arial',
            fill: '#000'
        });
        texto.setOrigin(0.5);

        const botao = this.add.text(400, 300, 'Começar', {
            font: '32px Arial',
            fill: '#fff',
            backgroundColor: '#28a745',
            padding: { x: 10, y: 10 }
        }).setInteractive();
        botao.setOrigin(0.5);

        botao.on('pointerdown', () => {
            this.scene.start('Jogo');
        });
    }
}

class Jogo extends Phaser.Scene {
    constructor() {
        super('Jogo');
    }

    preload() {
        ['fundo', 'dentinho', 'escova', 'fio_dental', 'pasta', 'cárie'].forEach(nome => carregarSprite(this, nome));
    }

    create() {
        this.add.image(400, 200, 'fundo');

        this.dentinho = this.physics.add.sprite(100, 300, 'dentinho').setScale(0.5);
        this.dentinho.setCollideWorldBounds(true);

        this.teclas = this.input.keyboard.createCursorKeys();

        this.itens = this.physics.add.group();
        this.caries = this.physics.add.group();

        this.pontuacao = 0;
        this.textoPontuacao = this.add.text(10, 10, 'Pontuação: 0', { font: '20px Arial', fill: '#000' });

        this.tempoItem = this.time.addEvent({
            delay: 1000,
            callback: this.gerarItem,
            callbackScope: this,
            loop: true
        });

        this.tempoCarie = this.time.addEvent({
            delay: 1500,
            callback: this.gerarCarie,
            callbackScope: this,
            loop: true
        });

        this.physics.add.overlap(this.dentinho, this.itens, this.coletarItem, null, this);
        this.physics.add.overlap(this.dentinho, this.caries, this.baterCarie, null, this);
    }

    update() {
        if (this.teclas.space.isDown && this.dentinho.body.touching.down) {
            this.dentinho.setVelocityY(-350);
        }
    }

    gerarItem() {
        const itens = ['escova', 'fio_dental', 'pasta'];
        const tipo = Phaser.Utils.Array.GetRandom(itens);
        const item = this.itens.create(800, Phaser.Math.Between(200, 350), tipo);
        item.setVelocityX(-200);
        item.setScale(0.5);
    }

    gerarCarie() {
        const carie = this.caries.create(800, 350, 'cárie');
        carie.setVelocityX(-250);
        carie.setScale(0.4);
    }

    coletarItem(dentinho, item) {
        item.destroy();
        this.pontuacao += 10;
        this.textoPontuacao.setText('Pontuação: ' + this.pontuacao);
        if (this.pontuacao >= 50) {
            this.scene.start('Fim');
        }
    }

    baterCarie() {
        this.scene.start('Fim');
    }
}

class Fim extends Phaser.Scene {
    constructor() {
        super('Fim');
    }

    preload() {
        carregarSprite(this, 'fundo');
        carregarSprite(this, 'dentista_final');
    }

    create() {
        this.add.image(400, 200, 'fundo');
        this.add.image(200, 300, 'dentista_final').setScale(0.6);

        const texto = this.add.text(400, 100, 'Você arrasou!\nSeu sorriso está protegido!', {
            font: '24px Arial',
            fill: '#000'
        });
        texto.setOrigin(0.5);

        const botao = this.add.text(400, 300, 'Jogar de novo', {
            font: '32px Arial',
            fill: '#fff',
            backgroundColor: '#007bff',
            padding: { x: 10, y: 10 }
        }).setInteractive();
        botao.setOrigin(0.5);

        botao.on('pointerdown', () => {
            this.scene.start('Inicio');
        });
    }
}

