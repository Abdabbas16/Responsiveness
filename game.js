// Initialize Kaboom
kaboom({
    width: 1200,
    height: 1000,
    background: [0, 0, 0],
})

// Game state
let score = 0

// Player movement constants
const SPEED = 300
const JUMP_FORCE = 800

// Add player
const player = add([
    rect(40, 40),
    pos(120, height() - 88),
    color(0, 255, 180),
    area(),
    body(),
    {
        jumpCount: 0,
        maxJumps: 2,
    },
])

// Add score display
const scoreLabel = add([
    text("Score: 0"),
    pos(16, 16),
])

// Add platforms
// Ground platform
add([
    rect(width(), 48),
    pos(0, height() - 48),
    color(255, 255, 255),
    area(),
    solid(),
])

// Floating platforms
add([
    rect(200, 20),
    pos(300, height() - 300),
    color(255, 255, 255),
    area(),
    solid(),
])

add([
    rect(200, 20),
    pos(600, height() - 500),
    color(255, 255, 255),
    area(),
    solid(),
])

add([
    rect(200, 20),
    pos(900, height() - 700),
    color(255, 255, 255),
    area(),
    solid(),
])

// Add moving platform
const movingPlatform = add([
    rect(100, 20),
    pos(400, height() - 400),
    area(),
    solid(),
    color(200, 200, 255),
    {
        moveRight: true,
        speed: 80,
        startX: 400,
    },
])

// Add spikes
function addSpike(x, y) {
    return add([
        rect(20, 20),
        pos(x, y),
        color(255, 255, 0),
        area(),
        "spike",
        rotate(45),
    ])
}

// Add spikes to platforms
const spikes = [
    addSpike(400, height() - 320),
    addSpike(700, height() - 520),
    addSpike(950, height() - 720),
]

// Add enemies
function addEnemy(x, y) {
    return add([
        rect(30, 30),
        pos(x, y),
        color(255, 0, 0),
        area(),
        {
            startX: x,
            speed: 100,
            moveRight: true,
        },
        "enemy"
    ])
}

// Add enemies at different positions
const enemies = [
    addEnemy(300, height() - 340),
    addEnemy(600, height() - 540),
    addEnemy(900, height() - 740),
    addEnemy(400, height() - 440),
    addEnemy(800, height() - 640),
]

// Add bouncing platform
const bouncePad = add([
    rect(60, 20),
    pos(500, height() - 100),
    area(),
    solid(),
    color(255, 150, 150),
    "bouncer",
])

// Add high platforms
add([
    rect(200, 20),
    pos(1000, height() - 850),
    area(),
    solid(),
    color(255, 255, 255),
])

add([
    rect(200, 20),
    pos(700, height() - 900),
    area(),
    solid(),
    color(255, 255, 255),
])

// Move enemies back and forth
onUpdate("enemy", (e) => {
    if (e.moveRight) {
        e.pos.x += e.speed * dt()
        if (e.pos.x > e.startX + 200) e.moveRight = false
    } else {
        e.pos.x -= e.speed * dt()
        if (e.pos.x < e.startX) e.moveRight = true
    }
})

// Move the moving platform
onUpdate(() => {
    if (movingPlatform.moveRight) {
        movingPlatform.pos.x += movingPlatform.speed * dt()
        if (movingPlatform.pos.x > movingPlatform.startX + 300)
            movingPlatform.moveRight = false
    } else {
        movingPlatform.pos.x -= movingPlatform.speed * dt()
        if (movingPlatform.pos.x < movingPlatform.startX)
            movingPlatform.moveRight = true
    }
})

// Basic controls
keyDown("left", () => {
    player.move(-SPEED, 0)
})

keyDown("right", () => {
    player.move(SPEED, 0)
})

// Jump control with double jump
keyPress("space", () => {
    if (player.isGrounded() || player.jumpCount < player.maxJumps) {
        player.jump(JUMP_FORCE)
        player.jumpCount++
    }
})

// Reset jump count when landing
player.onGround(() => {
    player.jumpCount = 0
    // Add score when landing on platforms (not ground)
    if (player.pos.y < height() - 88) {
        score += 10
        scoreLabel.text = "Score: " + score
    }
})

// Handle enemy collision
player.onCollide("enemy", () => {
    player.pos = vec2(120, height() - 88)
    score = 0
    scoreLabel.text = "Score: 0"
    player.jumpCount = 0
})

player.onCollide("spike", () => {
    player.pos = vec2(120, height() - 88)
    score = 0
    scoreLabel.text = "Score: 0"
    player.jumpCount = 0
})

// Super jump on bouncer
player.onCollide("bouncer", () => {
    player.jump(JUMP_FORCE * 1.5)
})

// Keep player in bounds
player.onUpdate(() => {
    // Left and right bounds
    if (player.pos.x < 0) {
        player.pos.x = 0
    }
    if (player.pos.x > width() - 40) {
        player.pos.x = width() - 40
    }

    // Reset if player falls off
    if (player.pos.y > height()) {
        player.pos = vec2(120, height() - 88)
        score = 0
        scoreLabel.text = "Score: 0"
        player.jumpCount = 0
    }
})