let balls = [];
let colors = ['#33B5E5', '#0099CC', '#AA66CC', '#9933CC', '#99CC00',
    '#669900', '#FFBB33', '#FF8800', '#FF4444', '#CC0000'];

window.onload = () => {
    let canvas = document.getElementById('canvas');
    let context = canvas.getContext('2d');

    WINDOW_WIDTH = document.documentElement.clientWidth - 20;
    WINDOW_HEIGHT = document.documentElement.clientHeight - 20;

    MARGIN_LEFT = Math.round(WINDOW_WIDTH / 10);
    MARGIN_TOP = Math.round(WINDOW_HEIGHT / 5);
    RADIUS = Math.round(WINDOW_WIDTH * 4 / 5 / 108) - 1;

    canvas.width = WINDOW_WIDTH;
    canvas.height = WINDOW_HEIGHT;

    let d = new Date();
    curTime = normalizeTime(String(d.getHours()), String(d.getMinutes()), String(d.getSeconds()));

    setInterval(() => {
        render(context);
        update(context);
    }, 50)
}

const render = (cxt) => {
    cxt.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT)
    renderDigit(MARGIN_LEFT, MARGIN_TOP, curTime[0], cxt);
    renderDigit(MARGIN_LEFT + 15 * (RADIUS + 1), MARGIN_TOP, curTime[1], cxt);
    renderDigit(MARGIN_LEFT + 30 * (RADIUS + 1), MARGIN_TOP, 10, cxt);
    renderDigit(MARGIN_LEFT + 39 * (RADIUS + 1), MARGIN_TOP, curTime[2], cxt);
    renderDigit(MARGIN_LEFT + 54 * (RADIUS + 1), MARGIN_TOP, curTime[3], cxt);
    renderDigit(MARGIN_LEFT + 69 * (RADIUS + 1), MARGIN_TOP, 10, cxt);
    renderDigit(MARGIN_LEFT + 78 * (RADIUS + 1), MARGIN_TOP, curTime[4], cxt);
    renderDigit(MARGIN_LEFT + 93 * (RADIUS + 1), MARGIN_TOP, curTime[5], cxt)

    for(let i = 0; i < balls.length; i++) {
        cxt.fillStyle = balls[i].color;
        cxt.beginPath();
        cxt.arc(balls[i].x, balls[i].y, RADIUS, 0, 2 * RADIUS * Math.PI);
        cxt.fill()
    }
}

const update = (cxt) => {
    let d = new Date();
    let nextTime = normalizeTime(String(d.getHours()), String(d.getMinutes()), String(d.getSeconds()));
    if(nextTime !== curTime){
        if (nextTime[0] !== curTime[0]) {
            addBall(MARGIN_LEFT, MARGIN_TOP, nextTime[0])
        }
        if (nextTime[1] !== curTime[1]) {
            addBall(MARGIN_LEFT + 15 * (RADIUS + 1), MARGIN_TOP, nextTime[1])
        }
        if (nextTime[2] !== curTime[2]) {
            addBall(MARGIN_LEFT + 39 * (RADIUS + 1), MARGIN_TOP, nextTime[2])
        }
        if (nextTime[3] !== curTime[3]) {
            addBall(MARGIN_LEFT + 54 * (RADIUS + 1), MARGIN_TOP, nextTime[3])
        }
        if (nextTime[4] !== curTime[4]) {
            addBall(MARGIN_LEFT + 78 * (RADIUS + 1), MARGIN_TOP, nextTime[4])
        }
        if (nextTime[5] !== curTime[5]) {
            addBall(MARGIN_LEFT + 93 * (RADIUS + 1), MARGIN_TOP, nextTime[5])
        }
        curTime = nextTime
        render(cxt, nextTime)
    }
    updateBalls();
}

const updateBalls = () => {
    let cnt = 0;
    for(let i = 0; i < balls.length; i++) {
        balls[i].x += balls[i].vx;
        balls[i].y += balls[i].vy;
        balls[i].vy += balls[i].g;
        // 碰撞检测
        if (balls[i].y >= WINDOW_HEIGHT - RADIUS) {
            balls[i].y = WINDOW_HEIGHT - RADIUS;
            balls[i].vy = -balls[i].vy * 0.6;
        }
        // 小球过了左边缘且没过右边缘
        if (balls[i].x + RADIUS > 0 && balls[i].x - RADIUS < WINDOW_WIDTH) {
            balls[cnt++] = balls[i];
        }
    }
    while(balls.length > Math.min(400, cnt)) {
        balls.pop();
    }
}

const normalizeTime = (h, m, s) => {
    if (h < 10) {
        h = '0' + h
    }
    if (m < 10) {
        m = '0' + m
    }
    if (s < 10) {
        s = '0' + s
    }
    return h + m + s
}

const addBall = (x, y, num) => {
    for(let i = 0; i < digit[num].length; i++) {
        for(let j = 0; j < digit[num][i].length; j++) {
            if (digit[num][i][j] === 1) {
                let singBall = {
                    x: x + j * 2 * (RADIUS + 1) + (RADIUS + 1),
                    y: y + i * 2 * (RADIUS + 1) + (RADIUS + 1),
                    g: 1.5 + Math.random(),
                    // 水平方向随机速度
                    vx: Math.pow(-1, Math.ceil(Math.random() * 1000)) * Math.ceil(Math.random() * 5),
                    vy: -5,
                    color: colors[Math.floor(Math.random() * colors.length)]
                };
                balls.push(singBall)
            }
        }
    }
}

const renderDigit = (x, y, num, cxt) => {
    cxt.fillStyle = "rgb(0, 102, 153)";

    for(let i = 0; i < digit[num].length; i++) {
        for(let j = 0; j < digit[num][i].length; j++) {
            if (digit[num][i][j] === 1) {
                cxt.beginPath();
                cxt.arc(x + j * 2 * (RADIUS + 1) + (RADIUS + 1), y + i * 2 * (RADIUS + 1) + (RADIUS + 1),
                    RADIUS, 0, 2 * Math.PI);
                cxt.fill()
            }
        }
    }
}