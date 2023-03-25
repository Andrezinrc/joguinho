window.onload = function() {
	//Seleciona o canvas pela ID
	const canvas = document.getElementById("canvas");

	//Obtém o contexto 2D do canvas
	const ctx = canvas.getContext("2d");

	//Define a largura do canvas como 100% da largura da janela interna (vertices descontados)
	var canvas_width = window.innerWidth - 20;

	//Define a altura do canvas igual à sua largura
	var canvas_height = canvas_width;

	//Define as coordenadas iniciais do jogador
	var playerX = 50;
	var playerY = 480;

	//Define a variável para armazenar as peças do jogo
	var pieces = [];

	//Define a pontuação inicial
	var score = 0;

	//Obtém o horário de início do jogo
	var start_time = new Date();

	//Define a variável para armazenar o tempo decorrido
	var elapsed_time;

	//Variáveis para atirar bolinha amarela
	var spacePressed = false;
	var shootX = -100;
	var shootY = -100;

	//Função para criar nova peça 
	function createPiece() {
		//Define a posição X aleatória da primeira peça
		var posX = Math.floor(Math.random() * canvas_width);

		//Define a posição Y inicial da primeira peça
		var posY = 0;

		//Adiciona a primeira peça ao array de peças
		pieces.push({ posX: posX, posY: posY, xdir: -1, ydir: 1 });

		//Define a posição X da segunda peça
		var posX2 = 0;

		//Se o tamanho do array de peças for par, a segunda peça é criada na borda direita do canvas
		if (pieces.length % 2 == 0) {
			posX2 = canvas_width;
		}
		//Se o tamanho do array de peças for ímpar, a segunda peça é criada em um local aleatório do canvas
		else {
			posX2 = Math.floor(Math.random() * canvas_width);
		}

		//Define a posição Y aleatória da segunda peça
		var posY2 = Math.floor(Math.random() * canvas_height);

		//Adiciona a segunda peça ao array de peças
		pieces.push({ posX: posX2, posY: posY2, xdir: posX2 == 0 ? 1 : -1, ydir: 1 });
	}

	//Função para desenhar um círculo 
	function drawCircle(x, y, radius) {
		ctx.beginPath();
	  	ctx.arc(x, y, radius, 0, Math.PI * 2);
	  	ctx.fillStyle = "red";
	  	ctx.fill();
	  	ctx.closePath();
	}

	//Função para desenhar todas as peças do jogo
	function drawPieces() {
		for (var i = 0; i < pieces.length; i++) {
			drawCircle(Math.round(pieces[i].posX), Math.round(pieces[i].posY), 5);
		}
	}

	//Função para mover todas as peças do jogo
	function movePieces() {
		for (var i = 0; i < pieces.length; i++) {
			//Calcula a nova posição da peça com base na sua direção (velocidade)
			var posX = pieces[i].posX + pieces[i].xdir * 10;
			var posY = pieces[i].posY + pieces[i].ydir * 10;

			//Se a peça atingiu a borda inferior ou lateral do canvas, é removida do array
			if (posY > canvas_height - 10 || posX > canvas_width || posX < 0) {
		  		pieces.splice(i, 1);
			}
			//Se a peça ainda está dentro do canvas, atualiza sua posição
			else {
		  		pieces[i].posX = posX;
		  		pieces[i].posY = posY;
			}

			//Se a peça atravessou a borda superior ou lateral do canvas, adiciona 10 pontos à pontuação
			if (posY < 0 || posX > canvas_width || posX < 0) {
		  		score += 10;
			}

			//Se o jogador colidiu com alguma peça, o intervalo de atualização é interrompido, e uma mensagem é exibida no canvas
			if (playerX < pieces[i].posX + 5 &&
		  		playerX + 15 > pieces[i].posX &&
		  		playerY < pieces[i].posY + 5 &&
		  		playerY + 15 > pieces[i].posY) {
		  		clearInterval(updateInterval);
		  		ctx.clearRect(0, 0, canvas.width, canvas.height);
		  		ctx.fillStyle = "white";
		  		ctx.font = "30px Arial";
		  		ctx.fillText("Você perdeu", canvas.width / 2 - 80, canvas.height / 2 - 15);
			}
		}
	}

	//Função para atualizar todos os elementos do jogo
	function update() {
		//Atualiza as dimensões do canvas
		canvas.width = canvas_width;
		canvas.height = canvas_height;

		//Define a cor de fundo do canvas
		canvas.style.background = "black";

		//Desenha o jogador
		ctx.fillStyle = "blue";
		ctx.beginPath();
		ctx.arc(playerX + 7.5, playerY + 7.5, 7.5, 0, 2 * Math.PI);
		ctx.fill();

		ctx.fillStyle = "lightblue";
		for (let i = 0; i < 5; i++) {
			ctx.beginPath();
			ctx.arc(playerX + 2.5 - 5 * i, playerY + 9.0 + 5* i, 7.5 - i * 1.5, 0, 2 * Math.PI);
			ctx.fill();
		}

		//Desenha todas as peças do jogo
	  	drawPieces();

	  	//Move todas as peças do jogo
	  	movePieces();

	  	//Cria uma nova peça a cada atualização
	  	createPiece();

	  	//Calcula o tempo decorrido desde o início do jogo
	  	elapsed_time = Math.floor((new Date() - start_time) / 1000);

	  	//Escreve a pontuação e o tempo decorrido no canvas
	  	ctx.fillStyle = "white";
	  	ctx.font = "20px Arial";
	  	ctx.fillText("Pontuação: " + score + " | Tempo: " + elapsed_time + "s", 10, 20);

	  	//Desenha a bolinha amarela
	  	ctx.fillStyle = "yellow";
	  	ctx.beginPath();
	  	ctx.arc(shootX, shootY, 3, 0, 2 * Math.PI);
	  	ctx.fill();

	  	//Move a bolinha amarela na diagonal de cima para baixo
	  	shootX += 2;
	  	shootY -= 2;

	  	//Remove a bolinha amarela caso ela saia do canvas
	  	if (shootX > canvas_width || shootY < 0) {
	  		shootX = -100;
	  		shootY = -100;
	  	}

	  	//Verifica se a bolinha amarela colidiu com alguma peça
	  	for (var i = 0; i < pieces.length; i++) {
	  		if (shootX > pieces[i].posX &&
	  		shootX < pieces[i].posX + 5 &&
	 		shootY > pieces[i].posY &&
	  		shootY < pieces[i].posY + 5) {
	  			//Remove a peça e a bolinha amarela
	  			pieces.splice(i, 1);
	  			shootX = -100;
	  			shootY = -100;
	  			score += 50;
	  		}
	  	}
	}

	//Define um intervalo de atualização do jogo (200ms)
	var updateInterval = setInterval(function() {
		//Atualiza as dimensões do canvas de acordo com o tamanho da janela interna
		canvas_width = Math.min(window.innerWidth - 20, window.innerHeight - 20);

		canvas_height = canvas_width;

		//Chama a função "update" para atualizar todos os elementos do jogo
		update();
	}, 200);

	//Adiciona um listener para capturar as teclas pressionadas pelo jogador
	document.addEventListener("keydown", function(event) {
		switch (event.keyCode) {
			//Seta para cima (move o jogador para cima)
			case 38:
				playerY -= 10;
				break;
			//Seta para baixo (move o jogador para baixo)
			case 40:
				playerY += 10;
				break;
			//Seta para a esquerda (move o jogador para a esquerda)
			case 37:
				playerX -= 10;
				break;
			//Seta para a direita (move o jogador para a direita)
			case 39:
				playerX += 10;
				break;
			//Tecla "espaço" (atira bolinha amarela)
			case 32:
				shootX = playerX + 7.5;
				shootY = playerY - 7.5;
				break;
	  		//Ignora outras teclas
	  		default:
	  			return;
		}
	});

	
}