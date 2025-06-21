let playerNames = [];
let results = [];
let bridges = [];
let canvas = document.getElementById("amidakujiCanvas");
let ctx = canvas.getContext("2d");

function setup() {
  const count = Math.max(2, Math.min(5, parseInt(document.getElementById("playerCount").value)));
  const inputsDiv = document.getElementById("inputs");
  inputsDiv.innerHTML = "";
  playerNames = [];
  results = [];

  for (let i = 0; i < count; i++) {
    inputsDiv.innerHTML += `
      <div>
        <input placeholder="名前${i+1}" id="name${i}" />
        <input placeholder="結果${i+1}" id="result${i}" />
      </div>
    `;
  }

  document.getElementById("startButton").style.display = "inline-block";
  clearCanvas();
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function generateBridges(lines, height, spacing) {
  bridges = [];
  for (let y = spacing; y < height - spacing; y += spacing) {
    let bridgeLine = Array(lines).fill(false);
    for (let i = 0; i < lines - 1; i++) {
      if (Math.random() < 0.3) {
        bridgeLine[i] = true;
        i++; // skip next
      }
    }
    bridges.push(bridgeLine);
  }
}

function drawAmidakuji(lines) {
  clearCanvas();
  const spacingX = canvas.width / (lines + 1);
  const spacingY = canvas.height / (bridges.length + 1);

  // draw vertical lines
  for (let i = 0; i < lines; i++) {
    ctx.beginPath();
    ctx.moveTo(spacingX * (i + 1), spacingY);
    ctx.lineTo(spacingX * (i + 1), spacingY * (bridges.length));
    ctx.stroke();
  }

  // draw horizontal bridges
  for (let y = 0; y < bridges.length; y++) {
    for (let x = 0; x < lines - 1; x++) {
      if (bridges[y][x]) {
        const x1 = spacingX * (x + 1);
        const x2 = spacingX * (x + 2);
        const yPos = spacingY * (y + 1);
        ctx.beginPath();
        ctx.moveTo(x1, yPos);
        ctx.lineTo(x2, yPos);
        ctx.stroke();
      }
    }
  }
}

function tracePath(startIndex) {
  const spacingX = canvas.width / (playerNames.length + 1);
  const spacingY = canvas.height / (bridges.length + 1);

  let x = startIndex;
  ctx.strokeStyle = "red";
  ctx.beginPath();
  ctx.moveTo(spacingX * (x + 1), spacingY);

  for (let y = 0; y < bridges.length; y++) {
    const yPos = spacingY * (y + 1);
    if (x < playerNames.length - 1 && bridges[y][x]) {
      x++;
    } else if (x > 0 && bridges[y][x - 1]) {
      x--;
    }
    ctx.lineTo(spacingX * (x + 1), yPos);
  }
  ctx.stroke();
  return x;
}

async function startAmidakuji() {
  playerNames = [];
  results = [];
  const count = document.getElementById("inputs").children.length;

  for (let i = 0; i < count; i++) {
    const name = document.getElementById("name" + i).value || `プレイヤー${i+1}`;
    const result = document.getElementById("result" + i).value || "？";
    playerNames.push(name);
    results.push(result);
  }

  generateBridges(playerNames.length, canvas.height, 30);
  drawAmidakuji(playerNames.length);

  document.getElementById("resultDisplay").innerHTML = "";

  for (let i = 0; i < playerNames.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 800));
    const goalIndex = tracePath(i);
    const name = playerNames[i];
    const result = results[goalIndex];
    document.getElementById("resultDisplay").innerHTML += `🎉 ${name} → ${result}<br>`;
  }

  ctx.strokeStyle = "black";
}
