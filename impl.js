//Original Perlin noise permutation
const perm = [
    151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 
    103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 
    26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 
    87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 
    77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 
    46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 
    187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 
    198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 
    255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 
    170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 
    172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 
    104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 
    241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 
    157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 
    93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180
];

const Point = function(x, y) {
    this.x = x;
    this.y = y;
}

//Linear interpolation
function lerp(v1, v2, n) {
    if(n < 0.0) return v1;
    if(n > 1.0) return v2;

    return v1 + n * (v2 - v1);
}

//Cubic interpolation(po-gladko stava s kubichnata)
function lerp2(v1, v2, n) {
    return (v2 - v1) * (3.0 - n * 2.0) * n * n + v1;
}

Point.prototype.add = function(v2) {
    return new Point(this.x + v2.x, this.y + v2.y);
}

Point.prototype.sub = function(v2) {
    return new Point(this.x - v2.x, this.y - v2.y);
}

Point.prototype.dot = function(v2) {
    return this.x * v2.x + this.y * v2.y;
}

function makeVector(_angle = null, magnitude = 1) {
    let angle = null;

    if(_angle) {
        angle = _angle * Math.PI / 180;
    } else {
        angle = 0;
    }

    return new Point(Math.cos(angle) * magnitude, Math.sin(angle) * magnitude);
}

function perlinNoise(x, y, seed) {
    let gridX = Math.floor(x);
    let gridY = Math.floor(y);

    let ix = (gridX + seed) % 255;
    let iy = (gridY + seed) % 255;

    let origin = new Point(x, y);

    let wx = x - gridX;
    let wy = y - gridY;

    let corners = [
        new Point(gridX, gridY),
        new Point(gridX + 1, gridY),
        new Point(gridX, gridY + 1),
        new Point(gridX + 1, gridY + 1)
    ];

    let gradients = [
        makeVector(perm[(perm[ix] + iy) % perm.length]),
        makeVector(perm[(perm[ix + 1] + iy) % perm.length]),
        makeVector(perm[(perm[ix] + iy + 1) % perm.length]),
        makeVector(perm[(perm[ix + 1] + iy + 1) % perm.length])
    ];

    let offsets = corners.map(x => origin.sub(x));

    let dots = [];

    for(let i = 0; i < corners.length; i++) {
        let dotProduct = gradients[i].dot(offsets[i]);
        
        dots.push(dotProduct);
    }

    let int1 = lerp2(dots[0], dots[1], wx);
    let int2 = lerp2(dots[2], dots[3], wx);

    let res = lerp2(int1, int2, wy);

    return res;
}