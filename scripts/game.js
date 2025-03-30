let score = JSON.parse(localStorage.getItem('score'));

const coinSoundEffect = new Audio("./coin.mp3")

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const resetScoreButtonElement = document.querySelector('.js-reset-score')
resetScoreButtonElement.addEventListener('click', () => {
            score = 0;
            localStorage.removeItem('score')
            renderScore(score)
        })

if (score === null) {
    score = 0;
}

function renderScore (score) {document.querySelector('.js-score')
.innerHTML = `Punteggio: ${score}`
}

renderScore(score)

const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 30,
    speed: 5,
    dx: 0,
    dy: 0
};

const keys = {};
const coins = [];

document.addEventListener("keydown", (e) => keys[e.key] = true);
document.addEventListener("keyup", (e) => keys[e.key] = false);

function spawnCoin() {
    const coin = {
        x: Math.random() * (canvas.width - 10),
        y: Math.random() * (canvas.height - 10),
        size: 15
    };
    coins.push(coin);
}

for (let i = 0; i < 10; i++) {
    spawnCoin();
}

function randomScoreTime() {
    return Math.random() * 10000
}

function update() {
    if (keys['ArrowUp']) player.dy = -player.speed;
    else if (keys['ArrowDown']) player.dy = player.speed;
    else player.dy = 0;

    if (keys['ArrowLeft']) player.dx = -player.speed;
    else if (keys['ArrowRight']) player.dx = player.speed;
    else player.dx = 0;

    player.x += player.dx;
    player.y += player.dy;

    if (player.x < 0) player.x = 0;
    if (player.y < 0) player.y = 0;
    if (player.x + player.size > canvas.width) player.x = canvas.width - player.size;
    if (player.y + player.size > canvas.height) player.y = canvas.height - player.size;

    for (let i = 0; i < coins.length; i++) {
        const coin = coins[i];
        if (
            player.x < coin.x + coin.size &&
            player.x + player.size > coin.x &&
            player.y < coin.y + coin.size &&
            player.y + player.size > coin.y
        ) {
            coins.splice(i, 1);
            score++; 
            renderScore(score);
            localStorage.setItem('score', JSON.stringify(score))

          if (!coinSoundEffect.paused) {
              coinSoundEffect.pause();
              coinSoundEffect.currentTime = 0;
          }

            coinSoundEffect.play();

            setTimeout(() => {
                spawnCoin()
            }, randomScoreTime());
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(player.x, player.y, player.size, player.size);

    ctx.fillStyle = "orange";
    coins.forEach(coin => {
        ctx.beginPath();
        ctx.arc(coin.x + coin.size / 2, coin.y + coin.size / 2, coin.size / 2, 0, Math.PI * 2);
        ctx.fill();
    });
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();