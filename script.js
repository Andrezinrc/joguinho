window.onload = function() {
	let canvas_width = 600;
	let canvas_height = 600;
	const canvas = document.getElementById('canvas');
	const ctx = canvas.getContext('2d');
	let playerX = 50;
	let playerY = 480;
	const pieces = [];
	let score = 0;
	const start_time = new Date();
	let elapsed_time;
	let spacePressed = false;
	let shootX = -100;
	let shootY = -100;
	
	function createPiece() {
	  const posX = Math.floor(Math.random() * canvas_width);
	  const posY = 0;
	  pieces.push({ posX: posX, posY: posY, xdir: -1, ydir: 1 });
	
	  let posX2 = 0;
	  if (pieces.length % 2 == 0) {
		posX2 = canvas_width;
	  } else {
		posX2 = Math.floor(Math.random() * canvas_width);
	  }
	  const posY2 = Math.floor(Math.random() * canvas_height);
	  pieces.push({ posX: posX2, posY: posY2, xdir: posX2 == 0 ? 1 : -1, ydir: 1 });
	}
	
	function drawCircle(x, y, radius, color) {
	  ctx.beginPath();
	  ctx.arc(x, y, radius, 0, Math.PI * 2);
	  ctx.fillStyle = color;
	  ctx.fill();
	  ctx.closePath();
	}
	
	function drawPieces() {
	  pieces.forEach((piece) => {
		drawCircle(Math.floor(piece.posX), Math.floor(piece.posY), 5, 'red');
	  });
	}
	
	function movePieces() {
	  pieces.forEach((piece, index) => {
		const posX = piece.posX + piece.xdir * 10;
		const posY = piece.posY + piece.ydir * 10;
		if (posY > canvas_height - 10 || posX > canvas_width || posX < 0) {
		  pieces.splice(index, 1);
		} else {
		  pieces[index].posX = posX;
		  pieces[index].posY = posY;
		}
		if (posY < 0 || posX > canvas_width || posX < 0) {
		  score += 10;
		}
		if (
		  playerX < piece.posX + 5 &&
		  playerX + 15 > piece.posX &&
		  playerY < piece.posY + 5 &&
		  playerY + 15 > piece.posY
		) {
		  clearInterval(updateInterval);
		  ctx.clearRect(0, 0, canvas.width, canvas.height);
		  ctx.fillStyle = 'white';
		  ctx.font = '30px Arial';
		  ctx.fillText('Você perdeu', canvas.width / 2 - 80, canvas.height / 2 - 15);
		}
	  });
	}
	
	function update() {
	  canvas.width = canvas_width;
	  canvas.height = canvas_height;
	  canvas.style.background = 'black';
	  ctx.fillStyle = 'blue';
	  ctx.beginPath();
	
	  // Modificações para a bolinha amarela
	  ctx.arc(playerX + 7.5, playerY + 7.5, 7.5, 0, 2 * Math.PI);
	  ctx.fillStyle = 'yellow';
	  ctx.fill();
	  ctx.fillStyle = 'lightblue';
	  for (let i = 0; i < 5; i++) {
		ctx.beginPath();
		ctx.arc(playerX + 2.5 - 5 * i, playerY + 9.0 + 5 * i, 7.5 - i * 1.5, 0, 2 * Math.PI);
		ctx.fill();
	  }
	
	  drawPieces();
	  movePieces();
	  createPiece();
	
	  elapsed_time = Math.floor((new Date() - start_time) / 1000);
	  ctx.fillStyle = 'white';
	  ctx.font = '20px Arial';
	  ctx.fillText(`Pontuação: ${score} | Tempo: ${elapsed_time}s`, 10, 20);
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
	
	  shootX += 2;
	  shootY -= 2;
	
	  if (shootX > canvas_width || shootY < 0) {
		shootX = -100;
		shootY = -100;
	  }
	
	  pieces.forEach((piece, index) => {
		if (
		  shootX > piece.posX &&
		  shootX < piece.posX + 5 &&
		  shootY > piece.posY &&
		  shootY < piece.posY + 5
		) {
		  pieces.splice(index, 1);
		  shootX = -100;
		  shootY = -100;
		  score += 50;
		}
	  });
	}
	update();
	const updateInterval = setInterval(function() {
	  canvas_width = Math.min(window.innerWidth - 20, window.innerHeight - 20);
	  canvas_height = canvas_width;
	  update();
	}, 200);
	
	document.addEventListener('keydown', function(event) {
	  switch (event.keyCode) {
		case 38:
		  playerY -= 10;
		  break;
		case 40:
		  playerY += 10;
		  break;
		case 37:
		  playerX -= 10;
		  break;
		case 39:
		  playerX += 10;
		  break;
		case 32:
		  spacePressed = true;
		  break;
	  }
	});
  };