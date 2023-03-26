window.onload = function() {
    // definindo as dimensões do canvas
    let canvas_width = 600;
    let canvas_height = 600;

    // obtendo o canvas e o objeto de contexto
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    // definindo as coordenadas iniciais do jogador e o número de vidas
    let playerX = 50;
    let playerY = 480;
    let lives = 3;

    // mantém controle das peças em movimento e dos power-ups
    const pieces = [];
    const powerUps = [];

    // probabilidade de um power-up aparecer
    let powerUpDropChance = 0.05

    // guardando a pontuação atual
    let score = 0;

    // define a velocidade de movimento do jogador
    let playerSpeed = 10;

    // tempo de início do jogo e tempo passado desde o início
    let start_time = new Date();
    let elapsed_time;

    // se a barra de espaço está pressionada ou não
    let spacePressed = false;
    
    //Define a bolinha do usuario, que cresce com a quantidade de bolinhas roxas pegas
    let userBalls = [
        {
            posX:playerX, 
            posY:playerY, 
            radius: 2.5
        }
    ];

    // coordenadas verticais e horizontais do tiro
    let shootX = -100;
    let shootY = -100;

    // controle do power-up
    let powerTime = 0;
    let powerActive = false;
    const powerDuration = 5;

    // cria uma nova peça
    function createPiece() {
        // posições x e y aleatórias
        let posX = Math.floor(Math.random() * canvas_width);
        const posY = 0;

        // adiciona a peça ao array
        pieces.push({ posX: posX, posY: posY, xdir: -1, ydir: 1 });

        let posX2 = 0;
        if (pieces.length % 2 == 0) {
            posX2 = canvas_width;
        } else {
            posX2 = Math.floor(Math.random() * canvas_width);
        }

        // adiciona uma segunda peça se o número atual de peças é par
        const posY2 = Math.floor(Math.random() * canvas_height);
        pieces.push({ posX: posX2, posY: posY2, xdir: posX2 == 0 ? 1 : -1, ydir: 1 });

        // tenta adicionar um power-up aleatório
        if (Math.random() < powerUpDropChance) {
            posX = Math.floor(Math.random() * canvas_width);
            powerUps.push({ posX: posX, posY: posY, xdir: -2, ydir: 2, type: Math.floor(Math.random() * 3) });
        }
    }

    // atualiza o tamanho das bolinhas do usuário de acordo com a quantidade de bolinhas roxas coletadas
    function updateUserSize() {
        if (score >= 50 && userBalls.length === 1) {
            userBalls.push({
              posX:playerX, 
              posY:playerY, 
              radius: 5 
            });
        } else if(score >= 100 && userBalls.length === 2){
            userBalls.push({
              posX:playerX, 
              posY:playerY, 
              radius: 7.5
            });
        } else if(score >= 200 && userBalls.length === 3){
            userBalls.push({
              posX:playerX, 
              posY:playerY, 
              radius: 10 
            });
        }
    }

    // desenha um círculo no canvas
    function drawCircle(x, y, radius, color) {
        ctx.beginPath();
        if (powerActive) {
            ctx.arc(x, y, radius + 5, 0, Math.PI * 2);
        } else {
            ctx.arc(x, y, radius, 0, Math.PI * 2);
        }
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
    }

    // desenha todas as peças e power-ups atualmente em movimento
    function drawPieces() {
        pieces.forEach((piece) => {
            drawCircle(Math.floor(piece.posX), Math.floor(piece.posY), 5, 'red');
        });

        powerUps.forEach((powerUp) => {
            if(powerUp.type == 0){
                drawCircle(Math.floor(powerUp.posX), Math.floor(powerUp.posY), 5, 'green');
            } else if(powerUp.type == 1){
                drawCircle(Math.floor(powerUp.posX), Math.floor(powerUp.posY), 7.5, 'yellow');
            } else {
                drawCircle(Math.floor(powerUp.posX), Math.floor(powerUp.posY), 5, 'purple');
            }
        });
        
        userBalls.forEach((ball) => {
            drawCircle(ball.posX, ball.posY, ball.radius, 'blue');
        });
    }

    // define a largura e altura da barra de vida
    const barWidth = 200;
    const barHeight = 20;

    // desenha a barra de vida do jogador
    function drawLifeBar() {
        ctx.fillStyle = 'white';
        ctx.fillRect(playerX - 10, playerY - 30, barWidth, barHeight);
        ctx.fillStyle = 'green';
        ctx.fillRect(playerX - 10, playerY - 30, barWidth * (lives / 3), barHeight);
    }

    // movimenta as peças e trata das colisões
    function movePieces() {
        pieces.forEach((piece, index) => {
            const posX = piece.posX + piece.xdir * 10;
            const posY = piece.posY + piece.ydir * 10;

            // remove a peça se ela cair da tela ou atingir a parte superior
            if (posY > canvas_height - 10 || posX > canvas_width || posX < 0) {
                pieces.splice(index, 1);
            } else {
                pieces[index].posX = posX;
                pieces[index].posY = posY;
            }

            // aumenta a pontuação se a peça atinge a parte superior da tela
            if (posY < 0 || posX > canvas_width || posX < 0) {
                score += 10;
            }

            // lida com as colisões entre as bolinhas do usuário e as peças
            userBalls.forEach((ball, indexBall) => {
                const distance = Math.sqrt(
                    (Math.abs(ball.posX - piece.posX) ** 2) + 
                    (Math.abs(ball.posY - piece.posY) ** 2)
                );
                    
                if(distance < ball.radius + 5){
                    // remove a peça se colidir com a bolinha do usuário
                    pieces.splice(index, 1);
                    
                    score += 10;                    
                    
                    // aumenta o tamanho da bolinha do usuário
                    userBalls[indexBall].radius += 1
                    updateUserSize();
                }
            });
        });

        // move e remove os power-ups
        powerUps.forEach((powerUp, index) => {
            const posX = powerUp.posX + powerUp.xdir * 5;
            const posY = powerUp.posY + powerUp.ydir * 5;
            if (posY > canvas_height - 10 || posX > canvas_width || posX < 0) {
                powerUps.splice(index, 1);
            } else {
                powerUps[index].posX = posX;
                powerUps[index].posY = posY;
            }

            // remove o power-up se o jogador o atingir
            if (
                playerX < powerUp.posX + 5 &&
                playerX + 15 > powerUp.posX &&
                playerY < powerUp.posY + 5 &&
                playerY + 15 > powerUp.posY
            ) {
                powerUps.splice(index, 1);
                if (powerUp.type == 0) {
                    powerActive = true;
                    powerTime = Date.now();
                } else if (powerUp.type == 1) {
                    setTimeout(() => {
                        playerSpeed = 10;
                    }, 10000);
                    playerSpeed = 20;
                } else if(powerUp.type == 2){
                    lives += 1;
                }
            }
        });
    }

    // desenha o jogo na tela
    function update() {
        canvas.width = canvas_width;
        canvas.height = canvas_height;

        // preenche o fundo do canvas
        canvas.style.background = 'black';

        // desenha o jogador e o número de vidas restantes
        for(let i=0; i<lives; i++){
            ctx.fillStyle = 'blue';
            ctx.beginPath();

            // adiciona um novo personagem
            ctx.arc(playerX + i*20 + 22.5, playerY + 7.5, 7.5, 0, 2 * Math.PI);
            ctx.fillStyle = 'blue';
            ctx.fill();
        }
    
        // desenha as peças e movimenta tudo
        drawPieces(); 
        movePieces();  
        createPiece();

        // verifica se o power-up está ativo e por quanto tempo
        if (powerActive) {
            let elapsedSeconds = Math.floor((Date.now() - powerTime) / 1000);
            if (elapsedSeconds >= powerDuration) {
                powerActive = false;
            }
        }

        // exibe a pontuação e o tempo atual
        elapsed_time = Math.floor((new Date() - start_time) / 1000);
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.fillText(`Pontuação: ${score} | Tempo: ${elapsed_time}s`, 10, 20);

        // desenha o tiro se a barra de espaço foi pressionada
        ctx.fillStyle = 'yellow';
        if (shootX == -100 && spacePressed) {
            spacePressed = false;
            let timeBetweenShots = 50;
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    shootX = playerX + 7.5;
                    shootY = playerY - 7.5;
                }, timeBetweenShots * i);
            }
        }
        ctx.beginPath();
        ctx.arc(shootX, shootY, 3, 0, 2 * Math.PI);
        ctx.fill();

        // movimenta o tiro e o remove se ele sair da tela
        shootX += 2;
        shootY -= 2;
        if (shootX > canvas_width || shootY < 0) {
            shootX = -100;
            shootY = -100;
        }
    }

    update();

    // atualiza o jogo a cada 200ms
    const updateInterval = setInterval(function () {
        canvas_width = Math.min(window.innerWidth - 20, window.innerHeight - 20);
        canvas_height = canvas_width;
        update();
    }, 200);

    // movimenta o jogador de acordo com as teclas pressionadas pelo usuário
    document.addEventListener('keydown', function (event) {
        switch (event.keyCode) {
            case 38:
                playerY -= playerSpeed;
                break;
            case 40:
                playerY += playerSpeed;
                break;
            case 37:
                playerX -= playerSpeed;
                break;
            case 39:
                playerX += playerSpeed;
                break;
            case 32:
                spacePressed = true;
                break;
        }
    });
};