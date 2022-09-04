let canvas = document.getElementById("my-canvas");
let ctx = canvas.getContext("2d");

let tileTextures = null;
let resources = [
    "tileset/basic_tile.png",
    "tileset/snow_tile.png",
    "tileset/water_tile.png"
];

let side = 15;
let multiplier = 0;

let scale = 4.65;
let offset = 10;
let depth = 0;
let seed = 0;

function makeLandscape(tiles, x, y, width, height, heightmap = null) {
    const offX = 1;
    const offY = 1;

    let posX = 0;
    let posY = 0;

    for(let i = 0; i < height; i++) {
        for(let j = 0; j < width; j++) {
            let heightOfTile = 1;
            let tileIx = 0;

            if(heightmap) {
                heightOfTile = heightmap[i][j];
            }

            let multfloor = Math.round(multiplier / 2);

            //Last value: 4
            if(heightOfTile > multfloor + 0.1 * multfloor)
                tileIx = 1;
            //Last value: 2.8
            else if(heightOfTile < multfloor / 2 + 0.2 * multfloor) {
                heightOfTile = multfloor / 2 + 0.2 * multfloor;
                tileIx = 2;
            }

            ctx.drawImage(tiles[tileIx], x + posX * offX, y + (posY - heightOfTile * side / 2) * offY, side, side);

            posX += side / 2;
            posY += side / 4;
        }

        posX -= (side / 2) * (width + 1);
        posY -= (side / 4) * (width - 1);
    }
}

function fractalNoise(x, y, scale, depth) {
    let result = 0;

    for(let i = 0; i < depth; i++) {
        result += perlinNoise(x / scale, y / scale, seed);
        scale /= Math.pow(2, i + 1);
    }

    return result;
}

function loadImages(directories) {
    let promises = [];

    for(let dir of directories) {
        let image = new Image();
        image.src = dir;

        let promise = new Promise(resolve => {
            image.onload = () => {
                resolve(image);
            };
        });

        promises.push(promise);
    }

    return Promise.all(promises);
}

async function start() {
    seed = Math.floor(Math.random() * 100);
    tileTextures = await loadImages(resources);

    terrainGen();
}

function terrainGen() {
    seed = Math.floor(Math.random() * 100);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let width = parseInt(document.getElementById("width-field").value);
    let height = parseInt(document.getElementById("height-field").value);
    multiplier = parseInt(document.getElementById("mult-field").value);

    side = parseInt(document.getElementById("block-size-field").value);
    scale = parseFloat(document.getElementById("offset-field").value);

    let heightmap = new Array(height);

    for(let i = 0; i < height; i++) {
        heightmap[i] = new Array(width);
    }

    for(let i = 0; i < height; i++) {
        for(let j = 0; j < width; j++) {
            heightmap[i][j] = (perlinNoise(j / scale + offset, i / scale, seed) + 1) * multiplier / 2;
        }
    }

    makeLandscape(tileTextures, canvas.width / 2, 120, width, height, heightmap);
}