export class Texture {
    src: string;
    gl: WebGLRenderingContext;

    constructor(src: string, gl: WebGLRenderingContext) {
        this.src = src;
        this.gl = gl;
    }

    loadImage() {
        return new Promise<HTMLImageElement>((res, rej) => {
            const img = new Image();
            img.onload = () => res(img);
            img.onerror = rej;
            img.src = this.src;
        });
    }

    async init() {
        const { gl } = this;
        const img = await this.loadImage();
        const tex = this.gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, tex);

        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            img
        );

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    }
}
