window.onload = function() {
	const canvas = document.getElementById("canvas");
	const ctx = canvas.getContext("2d");
	var canvas_width = Math.min(window.innerWidth - 20, window.innerHeight - 20); // Largura do canvas.
	var canvas_height = canvas_width; // Altura do canvas.
	var playerX = 50; // Posição inicial do quadrado.
	var playerY = 480; // Posição inicial do quadrado.
	var pieces = []; // Lista de peças.
	var score = 0; // Pontuação inicial.
	var start_time = new Date(); // Tempo inicial de jogo.
	var elapsed_time;

	// Função que cria uma peça com uma posição aleatória no topo da tela.
	function createPiece() {
		var posX = Math.floor(Math.random() * canvas_width);
		var posY = 0;
		pieces.push({ posX: posX, posY: posY, xdir: -1, ydir: 1 });
	}

	// Função que desenha as peças a partir da lista de peças.
	function drawPieces() {
		ctx.fillStyle = "red";
		for (var i = 0; i < pieces.length; i++) {
			ctx.fillRect(pieces[i].posX, pieces[i].posY, 10, 10);
		}
	}

	// Função que movimenta as peças e verifica colisões.
	function movePieces() {
		for (var i = 0; i < pieces.length; i++) {
			var posX = pieces[i].posX + pieces[i].xdir * 10;
			var posY = pieces[i].posY + pieces[i].ydir * 10;

			if (posY > canvas_height - 10) {
				pieces.splice(i, 1);
			} else {
				pieces[i].posX = posX;
				pieces[i].posY = posY;
			}

			// Incrementa a pontuação se a peça sair da tela.
			if (posY > canvas_height) {
				score += 10;
			}

			// Verifica colisão entre o jogador e a peça.
			if (playerX < pieces[i].posX + 10 &&
				playerX + 10 > pieces[i].posX &&
				playerY < pieces[i].posY + 10 &&
				playerY + 10 > pieces[i].posY) {
				clearInterval(updateInterval);
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.fillStyle = "white";
				ctx.font = "30px Arial";
				ctx.fillText("Você perdeu", canvas.width/2 - 80, canvas.height/2 - 15);
			}
		}
	}

	// Função que atualiza o jogo.
	function update() {
		canvas.width = canvas_width;
		canvas.height = canvas_height;
		canvas.style.background = "black";
		ctx.fillStyle = "blue";
		ctx.fillRect(playerX, playerY, 10, 10);
		drawPieces();
		movePieces();
		createPiece();
		elapsed_time = Math.floor((new Date() - start_time) / 1000);
		ctx.fillStyle = "white";
		ctx.font = "20px Arial";
		ctx.fillText("Pontuação: " + score + " | Tempo: " + elapsed_time + "s", 10, 20);
	}

	// Intervalo de atualização do jogo.
	var updateInterval = setInterval(function() {
		canvas_width = Math.min(window.innerWidth - 20, window.innerHeight - 20);
		canvas_height = canvas_width;
		update();
	}, 200);

	// Eventos de teclado.
	document.addEventListener("keydown", function(event) {
		switch (event.keyCode) {
			case 38: // Tecla para cima.
				playerY -= 10;
				break;
			case 40: // Tecla para baixo.
				playerY += 10;
				break;
			case 37: // Tecla para a esquerda.
				playerX -= 10;
				break;
			case 39: // Tecla para a direita.
				playerX += 10;
				break;
			default:
				return;
		}
	});

	// Estilo do canvas.
	canvas.style.position = "absolute";
	canvas.style.left = "0";
	canvas.style.top = "0";
	canvas.style.bottom = "0";
	canvas.style.right = "0";
}