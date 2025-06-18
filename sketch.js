let claudio;
let ground;
let platforms = [];
let gravity = 1;
let showText = false;
let urbanTextIndex = 0;
let urbanText = [
  "Você está no centro da cidade, rodeado de prédios e ruas movimentadas.",
  "A cidade tem uma agitação constante, mas há sempre algo interessante para ver.",
  "Os carros parecem não parar, mas há algo de emocionante em estar no meio da cidade!",
];
let textTimer = 0;
let cityCars = [];
let jumpHeight = -15;
let curiosityIndex = -1;
let curiosityTimer = 0;
let showCuriosity = false;
let scene = "fazenda";
let cafeteriaTimer = -1; // Temporizador para controlar o tempo na cafeteria
let isDialogueActive = false;
let dialogues = [
  "Cláudio: A caminhada até o café foi interessante, mas a cidade está muito agitada.",
  "Berto: Sim, a cidade tem suas peculiaridades. O trânsito é uma loucura!",
];
let dialogueIndex = 0;
let dialogueTimer = 0;
let dialogueInterval = 3000; // Tempo entre os diálogos

function setup() {
  createCanvas(800, 400);

  // Configuração de Cláudio
  claudio = {
    x: 50,
    y: height - 80,
    w: 40,
    h: 60,
    velocityY: 0,
    velocityX: 0,
    onGround: false,
    stopped: false,
  };

  // Solo
  ground = {
    x: 0,
    y: height - 40,
    w: width,
    h: 40,
  };

  // Plataformas
  platforms = [
    { x: 200, y: ground.y - 100, w: 120, h: 20, triggered: false },
    { x: 400, y: ground.y - 150, w: 120, h: 20, triggered: false },
    { x: 600, y: ground.y - 90, w: 120, h: 20, triggered: false },
  ];

  // Carros da cidade
  cityCars = [
    { x: width, y: height - 70, w: 60, h: 20, speed: 3 },
    { x: width + 200, y: height - 100, w: 60, h: 20, speed: 4 },
    { x: width + 400, y: height - 50, w: 60, h: 20, speed: 2 },
    { x: width + 600, y: height - 80, w: 60, h: 20, speed: 5 },
  ];
}

function draw() {
  background(169, 169, 169); // Cor do fundo da cidade (mais cinza)

  if (scene === "fazenda") {
    drawFarmScene();
  } else if (scene === "cidade") {
    drawCityScene();
  } else if (scene === "cafeteria") {
    drawCafeScene();
  }
}

// Função para desenhar a cena da fazenda
function drawFarmScene() {
  fill(34, 139, 34); // Cor do solo
  rect(ground.x, ground.y, ground.w, ground.h);

  if (!claudio.stopped) {
    if (keyIsDown(65)) claudio.velocityX = -5;
    else if (keyIsDown(68)) claudio.velocityX = 5;
    else claudio.velocityX = 0;
  } else {
    claudio.velocityX = 0;
  }

  claudio.velocityY += gravity;
  claudio.y += claudio.velocityY;
  claudio.x += claudio.velocityX;

  let onPlatform = false;
  for (let plat of platforms) {
    if (
      claudio.x + claudio.w > plat.x &&
      claudio.x < plat.x + plat.w &&
      claudio.y + claudio.h > plat.y &&
      claudio.y + claudio.h < plat.y + plat.h &&
      claudio.velocityY >= 0
    ) {
      claudio.y = plat.y - claudio.h;
      claudio.velocityY = 0;
      claudio.onGround = true;
      onPlatform = true;

      if (!plat.triggered && !showCuriosity) {
        plat.triggered = true;
        claudio.stopped = true;
        showCuriosity = true;
        curiosityIndex = platforms.indexOf(plat);
        curiosityTimer = millis();
      }
    }
  }

  if (!onPlatform && claudio.y + claudio.h > ground.y) {
    claudio.y = ground.y - claudio.h;
    claudio.velocityY = 0;
    claudio.onGround = true;
    if (!showCuriosity) claudio.stopped = false;
  }

  fill(139, 69, 19); // Cor das plataformas
  for (let plat of platforms) {
    rect(plat.x, plat.y, plat.w, plat.h);
  }

  drawClaudio(claudio.x, claudio.y);

  // Transição para a cidade
  if (claudio.x > width) {
    scene = "cidade";
    claudio.x = 50;
    claudio.y = height - 80;
    cafeteriaTimer = millis(); // Inicia o temporizador para o café
  }

  // Exibe a curiosidade se estiver em uma plataforma
  if (showCuriosity && curiosityIndex !== -1) {
    drawTextbox(urbanText[curiosityIndex]);
    if (millis() - curiosityTimer > 4000) {
      showCuriosity = false;
      claudio.stopped = false;
    }
  }
}

// Função para desenhar a cena da cidade
function drawCityScene() {
  // Desenha prédios
  fill(120);
  rect(50, height - 150, 60, 150); // Prédio 1
  rect(150, height - 200, 60, 200); // Prédio 2
  rect(250, height - 180, 60, 180); // Prédio 3
  rect(350, height - 220, 60, 220); // Prédio 4

  // Desenha e move os carros
  for (let car of cityCars) {
    fill(255, 0, 0);
    rect(car.x, car.y, car.w, car.h); // Desenha o carro
    car.x -= car.speed; // Move o carro para a esquerda

    // Se Cláudio bater no carro, ele retorna ao início
    if (
      claudio.x + claudio.w > car.x &&
      claudio.x < car.x + car.w &&
      claudio.y + claudio.h > car.y &&
      claudio.y < car.y + car.h
    ) {
      claudio.x = 50; // Reinicia a posição de Cláudio
      claudio.y = height - 80;
      claudio.velocityY = 0;
    }

    // Resetando a posição do carro quando ele sai da tela
    if (car.x < -car.w) {
      car.x = width;
    }

    // Se Cláudio pular por cima do carro, exibe a caixa de texto
    if (
      claudio.y < car.y &&
      claudio.x + claudio.w > car.x &&
      claudio.x < car.x + car.w &&
      !showText
    ) {
      showText = true;
      textTimer = millis();
      urbanTextIndex = cityCars.indexOf(car);
    }
  }

  // Cláudio se move com as teclas WASD
  if (!claudio.stopped) {
    if (keyIsDown(65)) claudio.velocityX = -5;
    else if (keyIsDown(68)) claudio.velocityX = 5;
    else claudio.velocityX = 0;
  } else {
    claudio.velocityX = 0;
  }

  claudio.velocityY += gravity;
  claudio.y += claudio.velocityY;
  claudio.x += claudio.velocityX;

  // Cláudio colide com o solo
  if (claudio.y + claudio.h > ground.y) {
    claudio.y = ground.y - claudio.h;
    claudio.velocityY = 0;
    claudio.onGround = true;
  }

  drawClaudio(claudio.x, claudio.y);

  // Exibe a caixa de texto se Cláudio saltar por cima de um carro
  if (showText) {
    drawTextbox(urbanText[urbanTextIndex]);
    if (millis() - textTimer > 3000) {
      showText = false;
    }
  }

  // Quando Cláudio chega no limite da tela, troca para o café
  if (claudio.x > width) {
    scene = "cafeteria";
    claudio.x = 50; // Posição inicial da cafeteria
    claudio.y = height - 80;
    cafeteriaTimer = millis(); // Inicia o temporizador para o café
  }
}

// Função para desenhar a cena do café
function drawCafeScene() {
  background(245, 222, 179); // Cor suave para o fundo

  // Texto de introdução
  fill(0);
  textSize(20);
  textAlign(CENTER, CENTER);
  text(
    "Cláudio e Berto conversam sobre o caminho até ali.",
    width / 2,
    height / 2 - 50
  );

  // Mostrar diálogos de Berto
  if (millis() - dialogueTimer > dialogueInterval && !isDialogueActive) {
    isDialogueActive = true;
    setTimeout(() => {
      showDialogue(dialogues[dialogueIndex]);
      dialogueIndex++;
      if (dialogueIndex >= dialogues.length) {
        dialogueIndex = 0;
      }
    }, 1000);
  }

  // Mudar de cena após 5 segundos
  if (cafeteriaTimer !== -1 && millis() - cafeteriaTimer > 5000) {
    scene = "fazenda"; // Volta para a fazenda após 5 segundos
  }
}

// Função para desenhar Cláudio
function drawClaudio(x, y) {
  fill(30, 144, 255); // Cor do corpo
  rect(x, y, 40, 60, 10); // Corpo de Cláudio

  fill(255, 224, 189); // Cor da cabeça
  ellipse(x + 20, y + 10, 20, 20); // Cabeça

  fill(222, 184, 135); // Cor da camisa
  rect(x + 5, y - 5, 30, 5); // Parte de cima da camisa

  fill(0); // Cor dos detalhes
  ellipse(x + 15, y + 5, 5, 5); // Olho esquerdo
  ellipse(x + 25, y + 5, 5, 5); // Olho direito
  fill(0, 0, 0); // Cor do cabelo
  rect(x + 10, y - 10, 20, 10); // Cabelo
}

// Função para desenhar a caixa de texto
function drawTextbox(message) {
  fill(255);
  stroke(0);
  strokeWeight(2);
  rect(60, 80, width - 120, 140, 10);
  noStroke();
  fill(0);
  textAlign(LEFT, TOP);
  textSize(15);
  textWrap(WORD);
  text(message, 75, 95, width - 150);
}

// Função de pulo de Cláudio
function keyPressed() {
  if (key === " " && claudio.onGround && !claudio.stopped) {
    claudio.velocityY = jumpHeight; // Ajuste para o pulo
  }
}
