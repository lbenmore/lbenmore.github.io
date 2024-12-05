const DEFAULT_IMAGE_DIMENSIONS = {
    dx: 0,
    dy: 0,
    dw: 0,
    dh: 0,
    sx: 0,
    sy: 0,
    sw: 0,
    sh: 0,
}

export default class Canvas {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.canvas.id = '_' + Math.round(Math.random() * +new Date());

        this.applyProperties();
    }

    applyProperties(properties) {
        for (const property in properties) {
            this.ctx[property] = properties[property];
        }
    }

    applyImage(img, properties, dimensions) {
        const imgDimensions = Object.assign(DEFAULT_IMAGE_DIMENSIONS, dimensions);
        const { width, height } = img;

        if (!imgDimensions.sw) imgDimensions.sw = width;
        if (!imgDimensions.sh) imgDimensions.sh = height;
        if (!imgDimensions.dw) imgDimensions.dw = width;
        if (!imgDimensions.dh) imgDimensions.dh = height;

        this.canvas.width = width;
        this.canvas.height = height;

        if (properties) {
            this.applyProperties(properties);
        }

        this.ctx.drawImage(
            img,
            imgDimensions.sx,
            imgDimensions.sy,
            imgDimensions.sw,
            imgDimensions.sh,
            imgDimensions.dx,
            imgDimensions.dy,
            imgDimensions.dw,
            imgDimensions.dh,
        );
    }
}