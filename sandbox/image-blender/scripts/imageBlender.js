import Canvas from "./canvas.js";
import imageFromFile from "./imageFromFile.js";
import ImageBlenderControls from "./imageBlenderControls.js";

export default class ImageBlender {
    constructor(options) {
        this.options = options;
        this.canvas = undefined;
        this.img = undefined;
        this.width = 0;
        this.height = 0;
        this.layers = Array(2);
        this.controls = new ImageBlenderControls(() => {
            this.updateCanvas();
        });
    }

    resetCanvas() {
        this.canvas.ctx.clearRect(0, 0, this.width, this.height);
        this.layers = Array(2);
    }

    async updateCanvas() {
        const { filter, globalCompositeOperation } = this.controls;

        this.resetCanvas();

        if (!!filter || (!filter && !globalCompositeOperation)) {
            await this.createLayer(0, { filter });
        }

        if (!!globalCompositeOperation) {
            this.canvas.ctx.globalCompositeOperation = globalCompositeOperation;
            await this.createLayer(1);
        }

        this.layers.filter(layer => !!layer).forEach((layer) => {
            /* this.canvas.applyImage(layer.canvas); // not sure why this doesn't work */
            this.canvas.ctx.drawImage(layer.canvas, 0, 0);
        });
    }

    async createLayer(index, options) {
        const layer = await this.createCanvas();
        layer.applyImage(this.img, options);
        this.layers[index] = layer;
    }

    setCanvas(canvas) {
        this.canvas = canvas;
    }

    setImg(img) {
        const { width, height } = img;

        this.img = img;
        this.width = width;
        this.height = height;
    }

    getCanvasDataUrl() {
        return this.canvas.canvas
            .toDataURL('image/png')
            .replace('image/png', 'image/octet-stream');
    }

    async createCanvas(options) {
        return new Canvas(options);
    }

    async init() {
        this.setCanvas(await this.createCanvas());

        if (this.options.file) {
            const img = await imageFromFile(this.options.file);
            this.setImg(img);
        } else if (this.options.img) {
            this.setImg(this.options.img);
        }

        this.canvas.applyImage(this.img);
    }
}