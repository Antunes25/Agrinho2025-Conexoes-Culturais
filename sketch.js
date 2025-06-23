// === VARIÁVEIS GLOBAIS ===
let berto, claudio;
let ground;
let platforms = [];
let gravity = 1.1;
let showCuriosity = false;
let curiosityIndex = -1;
let curiosityTimer = 0;
let showText = false;
let textTimer = 0;
let urbanTextIndex = 0;
let jumpHeight = -25;
let scene = "fazenda";
let cafeteriaTimer = -1;
let isDialogueActive = false;
let dialogueIndex = 0;
let dialogueTimer = 0;
let dialogueInterval = 3000;
let showFinalMessage = false;
let finalMessageTimer = 0;


let curiosities = [
  "A agricultura familiar usa pequenas áreas de terra, mas produz cerca de 70% dos alimentos que comemos no Brasil! 🍚🥦🍅",
  "As vacas da fazenda são bem cuidadas, alimentadas todos os dias e dão leite fresquinho que é tirado com carinho na ordenha! 🐄🥛🌾",
  "As abelhas ajudam a polinizar as flores e sem elas muitas frutas, como maçã e melancia, não existiriam! 🐝"
];

let urbanText = [
  "Na cidade, o transporte coletivo ajuda milhares de pessoas a se locomoverem todos os dias! 🚌",
  "A arborização urbana melhora a qualidade do ar e proporciona sombra! 🌳🏙️",
  "O trânsito pode ser intenso, por isso é importante respeitar as sinalizações! 🚦"
];

let dialoguesCafeteria1 = [
  //ficou chato
];

let dialoguesCafeteria2 = [
  "Berto: Desculpe o atraso, a cidade tem suas peculiaridades. O trânsito é uma loucura!",
  "Berto: Mas nada se compara ao silêncio do campo e ao cheiro da terra molhada.",
  "Cláudio: Concordo! É bom estar de volta aqui com você.",
  "Berto: Vamos aproveitar o café e descansar um pouco.",
  "Cláudio: Sabe, aprendi umas coisas novas na cidade que talvez você goste.",
  "Berto: Ah é? Conta aí!",
  "Cláudio: Pois é, tem uma feira orgânica toda semana, com muitos alimentos fresquinhos.",
  "Berto: Que ótimo! A agricultura familiar é forte lá também?",
  "Cláudio: Sim! E as pessoas valorizam muito a sustentabilidade e a cultura local.",
  "Berto: Isso é incrível! Precisamos unir o melhor dos dois mundos.",
  "Cláudio: Exato! A troca de conhecimentos pode fazer toda a diferença."
];

let cityCars = [];

// === SETUP ===
function setup() {
  createCanvas(800, 400);

  berto = {
    x: 50,
    y: 300,
    w: 40,
    h: 60,
    velocityY: 0,
    velocityX: 0,
    onGround: false,
    stopped: false
  };

  claudio = {
    x: 50,
    y: height - 80,
    w: 40,
    h: 60,
    velocityY: 0,
    velocityX: 0,
    onGround: false,
    stopped: false
  };

  ground = {
    x: 0,
    y: height - 40,
    w: width,
    h: 40
  };

  platforms = [
    { x: 200, y: ground.y - 100, w: 120, h: 20, triggered: false },
    { x: 400, y: ground.y - 150, w: 120, h: 20, triggered: false },
    { x: 600, y: ground.y - 90, w: 120, h: 20, triggered: false }
  ];

  cityCars = [
  { x: width, y: height - 70, w: 60, h: 20, speed: 2 },
  { x: width + 300, y: height - 100, w: 60, h: 20, speed: 2.5 },
  { x: width + 600, y: height - 50, w: 60, h: 20, speed: 1.8 },
  { x: width + 900, y: height - 80, w: 60, h: 20, speed: 2.2 }
];
}

// === DRAW LOOP ===
function draw() {
  background(135, 206, 250);
  if (scene === "fazenda") drawFarmScene();
  else if (scene === "cafeteria1") drawCafeScene1();
  else if (scene === "cidade") drawCityScene();
  else if (scene === "cafeteria2") drawCafeScene2();
}

// === CENA 1: FAZENDA ===
function drawFarmScene() {
  fill(34, 139, 34);
  rect(ground.x, ground.y, ground.w, ground.h);

 fill(0);
  textSize(16);
  textAlign(LEFT, TOP);
  text("Pressione W para pular", 10, 10);

  if (!berto.stopped) {
    berto.velocityX = keyIsDown(65) ? -5 : keyIsDown(68) ? 5 : 0;
  } else {
    berto.velocityX = 0;
  }

  berto.velocityY += gravity;
  berto.y += berto.velocityY;
  berto.x += berto.velocityX;

  let onPlatform = false;
  for (let plat of platforms) {
    if (berto.x + berto.w > plat.x && berto.x < plat.x + plat.w &&
        berto.y + berto.h > plat.y && berto.y + berto.h < plat.y + plat.h &&
        berto.velocityY >= 0) {
      berto.y = plat.y - berto.h;
      berto.velocityY = 0;
      berto.onGround = true;
      onPlatform = true;

      if (!plat.triggered && !showCuriosity) {
        plat.triggered = true;
        berto.stopped = true;
        showCuriosity = true;
        curiosityIndex = platforms.indexOf(plat);
        curiosityTimer = millis();
      }
    }
  }

  if (!onPlatform && berto.y + berto.h > ground.y) {
    berto.y = ground.y - berto.h;
    berto.velocityY = 0;
    berto.onGround = true;
    if (!showCuriosity) berto.stopped = false;
  }

  fill(139, 69, 19);
  for (let plat of platforms) {
    rect(plat.x, plat.y, plat.w, plat.h);
  }

  drawFarmer(berto.x, berto.y);
  drawAnimals();

  if (showCuriosity && curiosityIndex !== -1) {
    drawTextbox(curiosities[curiosityIndex]);
    if (millis() - curiosityTimer > 4000) {
      showCuriosity = false;
      berto.stopped = false;
    }
  }

  if (berto.x > width) {
    scene = "cafeteria1";
    cafeteriaTimer = millis();
  }
}

// === CENA 2: CAFETERIA (Berto esperando) ===
function drawCafeScene1() {
  background(245, 222, 179);
  textSize(20);
  textAlign(CENTER, CENTER);
  fill(0);
  text("O Cláudio está atrasado...", width / 2, height / 2 - 50);
  text("Berto está esperando... (sozinho)", width / 2, height / 2 + 50);

  if (millis() - dialogueTimer > dialogueInterval && !isDialogueActive) {
    isDialogueActive = true;
    setTimeout(() => {
      showDialogue(dialoguesCafeteria1[dialogueIndex]);
      dialogueIndex++;
      if (dialogueIndex >= dialoguesCafeteria1.length) {
        dialogueIndex = 0;
      }
    }, 1000);
  }

  if (cafeteriaTimer !== -1 && millis() - cafeteriaTimer > 5000) {
    scene = "cidade";
    claudio.x = 50;
    claudio.y = height - 80;
  }
}

// === CENA 3: CIDADE ===
function drawCityScene() {
  background(169, 169, 169);

  // prédios
  fill(120);
  rect(50, height - 150, 60, 150);
  rect(150, height - 200, 60, 200);
  rect(250, height - 180, 60, 180);
  rect(350, height - 220, 60, 220);

  // carros com dist()
  for (let car of cityCars) {
    // calcula a distância entre o centro do Cláudio e o centro do carro
    let d = dist(
      claudio.x + claudio.w / 2,
      claudio.y + claudio.h / 2,
      car.x + car.w / 2,
      car.y + car.h / 2
    );

    // muda a cor do carro se estiver próximo do Cláudio
    if (d < 80) {
      fill(255, 150, 150); // cor mais clara
    } else {
      fill(255, 0, 0); // cor normal
    }

    rect(car.x, car.y, car.w, car.h);
    car.x -= car.speed;

    if (car.x < -car.w) {
      car.x = width;
    }

    // colisão com Cláudio
    if (
      claudio.x + claudio.w > car.x &&
      claudio.x < car.x + car.w &&
      claudio.y + claudio.h > car.y &&
      claudio.y < car.y + car.h
    ) {
      claudio.x = 50;
    }
  }

  // gravidade
  claudio.velocityY += gravity;
  claudio.y += claudio.velocityY;

  if (claudio.y + claudio.h >= ground.y) {
    claudio.y = ground.y - claudio.h;
    claudio.velocityY = 0;
    claudio.onGround = true;
  } else {
    claudio.onGround = false;
  }

  // movimentação
  if (!claudio.stopped) {
    claudio.velocityX = keyIsDown(65) ? -5 : keyIsDown(68) ? 5 : 0;
  } else {
    claudio.velocityX = 0;
  }

  claudio.x += claudio.velocityX;
  drawFarmer(claudio.x, claudio.y);

  // transição para próxima cena
  if (claudio.x > width) {
    claudio.stopped = true;
    claudio.velocityX = 0;
    claudio.velocityY = 0;
    scene = "cafeteria2";
    dialogueIndex = 0;
    dialogueTimer = millis();
  }

  // textos urbanos
  if (!showText && urbanTextIndex < urbanText.length) {
    showText = true;
    textTimer = millis();
  }

  if (showText) {
    drawTextbox(urbanText[urbanTextIndex]);
    if (millis() - textTimer > 3000) {
      showText = false;
      urbanTextIndex++;
    }
  }
}

// === CENA 4: CAFETERIA (Reencontro) ===
function drawCafeScene2() {
  background(245, 222, 179);
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(20);
  text("Berto e Cláudio se reencontram na cafeteria!", width / 2, height / 2 - 80);

  fill(50);
  textSize(14);
  textAlign(LEFT, TOP);
  text("Pressione ESPAÇO para avançar o diálogo", 10, 10);

  if (dialogueIndex < dialoguesCafeteria2.length) {
    drawTextbox(dialoguesCafeteria2[dialogueIndex]);
  } else {
    // Aqui exibe a mensagem final por 5 segundos
    if (finalMessageTimer === 0) {
      finalMessageTimer = millis();
    }
    if (millis() - finalMessageTimer < 5000) {
      drawTextbox("E eles passaram a tarde contando... Trocando conhecimentos culturais");
    } else {
      // Pode reiniciar ou mudar cena, se quiser
    }
  }
}



// === AUXILIARES ===
function drawTextbox(message) {
  fill(255);
  stroke(0);
  strokeWeight(2);
  rect(50, 20, width - 100, 120, 10); // Caixa maior
  noStroke();
  fill(0);
  textAlign(LEFT, TOP);
  textSize(16);
  textWrap(WORD);
  text(message, 65, 30, width - 130); // Texto dentro da caixa maior
}


// Função que desenha o personagem, com roupa distinta conforme a cena
function drawFarmer(x, y, isCity = false) {
  // Cabeça e olhos (mesmo para os dois)
  fill(255, 224, 189);
  ellipse(x + 20, y - 10, 30);
  fill(255);
  ellipse(x + 12, y - 15, 10, 8);
  ellipse(x + 28, y - 15, 10, 8);
  fill(0);
  ellipse(x + 12, y - 15, 4, 4);
  ellipse(x + 28, y - 15, 4, 4);
  noStroke();
  
  if (!isCity) {
    // Berto – fazenda
    fill(200, 30, 30); rect(x, y, 40, 40);
    fill(30, 60, 200); rect(x, y + 40, 40, 20);
    fill(255, 230, 150); ellipse(x + 20, y - 22, 50, 15);
    fill(220, 180, 90); rect(x + 10, y - 35, 20, 15, 3);
  } else {
    // Cláudio – cidade
    fill(100, 180, 255); rect(x, y, 40, 40);
    fill(255); triangle(x + 10, y, x + 20, y - 10, x + 30, y);
    fill(50); rect(x, y + 40, 40, 20);
    fill(139, 69, 19); rect(x, y + 55, 40, 10);
  }
}


function drawAnimals() {
  // Vaca 1
  fill(255); // corpo branco
  ellipse(600, ground.y - 30, 60, 40); // corpo maior e arredondado
  fill(0); // manchas pretas
  ellipse(590, ground.y - 35, 15, 10);
  ellipse(615, ground.y - 30, 10, 15);
  ellipse(605, ground.y - 20, 12, 7);
  fill(255, 224, 189); // cabeça pele clara
  ellipse(600, ground.y - 50, 30, 25);
  fill(0);
  ellipse(590, ground.y - 55, 5, 7); // olhos
  ellipse(610, ground.y - 55, 5, 7);
  fill(255, 192, 203); // orelhas rosa
  ellipse(585, ground.y - 50, 8, 12);
  ellipse(615, ground.y - 50, 8, 12);

  // Vaca 2
  fill(220, 220, 220); // corpo cinza claro
  ellipse(650, ground.y - 30, 60, 40);
  fill(120); // manchas cinza escuro
  ellipse(640, ground.y - 35, 15, 10);
  ellipse(665, ground.y - 30, 10, 15);
  ellipse(655, ground.y - 20, 12, 7);
  fill(255, 224, 189);
  ellipse(650, ground.y - 50, 30, 25);
  fill(0);
  ellipse(640, ground.y - 55, 5, 7);
  ellipse(660, ground.y - 55, 5, 7);
  fill(255, 192, 203);
  ellipse(635, ground.y - 50, 8, 12);
  ellipse(665, ground.y - 50, 8, 12);
}

function showDialogue(message) {
  fill(255);
  stroke(0);
  strokeWeight(2);
  rect(60, 80, width - 120, 100, 10);
  noStroke();
  fill(0);
  textAlign(LEFT, TOP);
  textSize(15);
  textWrap(WORD);
  //nao faz mal dar erro
  text(message, 75, 95, width - 150);
  dialogueTimer = millis(); // Atualiza o tempo do último diálogo
}

function keyPressed() {
  if (scene === "fazenda" && berto.onGround && key === "w") {
    berto.velocityY = jumpHeight;
    berto.onGround = false;
  }
  
  if (scene === "cidade" && claudio.onGround && key === "w") {
    claudio.velocityY = jumpHeight;
    claudio.onGround = false;
  }
  
  // Avançar diálogo na cafeteria 2 com espaço
  if (scene === "cafeteria2" && key === ' ') {
    if (dialogueIndex < dialoguesCafeteria2.length - 1) {
      dialogueIndex++;
      dialogueTimer = millis(); // reinicia o timer para exibir o próximo diálogo
    } else {

    }
  }
}

