class SoundLightRays {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            origin: "left",
            color: "#ffffff",
            speed: 2.2,
            spread: 0.2,
            length: 1.8,
            fadeDistance: 0.9,
            saturation: 0.1,
            mouseInfluence: 0.3,
            noiseAmount: 0.1,
            distortion: 0.05,
            sweepAmount: 0,
            sweepSpeed: 0.3,
            ...options,
        };
        this.canvas = document.createElement("canvas");
        this.gl = null;
        this.program = null;
        this.uniforms = {};
        this.frameId = null;
        this.isRunning = false;
        this.mouse = { x: 0.5, y: 0.5 };
        this.smoothMouse = { x: 0.5, y: 0.5 };

        this.resize = this.resize.bind(this);
        this.render = this.render.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
    }

    init() {
        if (!this.container) return;

        this.canvas.setAttribute("aria-hidden", "true");
        this.container.appendChild(this.canvas);
        this.gl = this.canvas.getContext("webgl", {
            alpha: true,
            antialias: false,
            premultipliedAlpha: false,
        });

        if (!this.gl) {
            this.container.classList.add("is-webgl-unavailable");
            return;
        }

        this.createProgram();
        this.resize();
        window.addEventListener("resize", this.resize);
        window.addEventListener("mousemove", this.handleMouseMove);

        this.observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    this.start();
                } else {
                    this.stop();
                }
            },
            { threshold: 0.05 }
        );
        this.observer.observe(this.container);
    }

    createProgram() {
        const gl = this.gl;
        const vertexShader = this.compileShader(
            gl.VERTEX_SHADER,
            `
attribute vec2 position;
varying vec2 vUv;

void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
}
`
        );
        const fragmentShader = this.compileShader(
            gl.FRAGMENT_SHADER,
            `
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
uniform vec2 rayPos;
uniform vec2 rayDir;
uniform vec3 raysColor;
uniform float raysSpeed;
uniform float lightSpread;
uniform float rayLength;
uniform float fadeDistance;
uniform float saturation;
uniform vec2 mousePos;
uniform float mouseInfluence;
uniform float noiseAmount;
uniform float distortion;

varying vec2 vUv;

float noise(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord, float seedA, float seedB, float speed) {
    vec2 sourceToCoord = coord - raySource;
    vec2 dirNorm = normalize(sourceToCoord);
    float cosAngle = dot(dirNorm, rayRefDirection);
    float distortedAngle = cosAngle + distortion * sin(iTime * 2.0 + length(sourceToCoord) * 0.01) * 0.2;
    float spreadFactor = pow(max(distortedAngle, 0.0), 1.0 / max(lightSpread, 0.001));
    float distance = length(sourceToCoord);
    float maxDistance = iResolution.x * rayLength;
    float lengthFalloff = clamp((maxDistance - distance) / maxDistance, 0.0, 1.0);
    float fadeFalloff = clamp((iResolution.x * fadeDistance - distance) / (iResolution.x * fadeDistance), 0.5, 1.0);
    float baseStrength = clamp(
        (0.45 + 0.15 * sin(distortedAngle * seedA + iTime * speed)) +
        (0.3 + 0.2 * cos(-distortedAngle * seedB + iTime * speed)),
        0.0,
        1.0
    );

    return baseStrength * lengthFalloff * fadeFalloff * spreadFactor;
}

void main() {
    vec2 coord = vec2(gl_FragCoord.x, iResolution.y - gl_FragCoord.y);
    vec2 finalRayDir = rayDir;

    if (mouseInfluence > 0.0) {
        vec2 mouseScreenPos = mousePos * iResolution.xy;
        vec2 mouseDirection = normalize(mouseScreenPos - rayPos);
        finalRayDir = normalize(mix(rayDir, mouseDirection, mouseInfluence));
    }

    float raysA = rayStrength(rayPos, finalRayDir, coord, 36.2214, 21.11349, 1.5 * raysSpeed);
    float raysB = rayStrength(rayPos, finalRayDir, coord, 22.3991, 18.0234, 1.1 * raysSpeed);
    float strength = raysA * 0.5 + raysB * 0.4;

    if (noiseAmount > 0.0) {
        float n = noise(coord * 0.01 + iTime * 0.1);
        strength *= 1.0 - noiseAmount + noiseAmount * n;
    }

    float brightness = 1.0 - (coord.y / iResolution.y);
    vec3 color = vec3(strength);
    color.r *= 0.1 + brightness * 0.8;
    color.g *= 0.3 + brightness * 0.6;
    color.b *= 0.5 + brightness * 0.5;
    color *= raysColor;

    if (saturation != 1.0) {
        float gray = dot(color, vec3(0.299, 0.587, 0.114));
        color = mix(vec3(gray), color, saturation);
    }

    gl_FragColor = vec4(color * 1.9, clamp(strength * 1.42, 0.0, 0.9));
}
`
        );

        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            throw new Error(gl.getProgramInfoLog(program));
        }

        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        gl.useProgram(program);

        const position = gl.getAttribLocation(program, "position");
        gl.enableVertexAttribArray(position);
        gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

        this.program = program;
        this.uniforms = {
            iTime: gl.getUniformLocation(program, "iTime"),
            iResolution: gl.getUniformLocation(program, "iResolution"),
            rayPos: gl.getUniformLocation(program, "rayPos"),
            rayDir: gl.getUniformLocation(program, "rayDir"),
            raysColor: gl.getUniformLocation(program, "raysColor"),
            raysSpeed: gl.getUniformLocation(program, "raysSpeed"),
            lightSpread: gl.getUniformLocation(program, "lightSpread"),
            rayLength: gl.getUniformLocation(program, "rayLength"),
            fadeDistance: gl.getUniformLocation(program, "fadeDistance"),
            saturation: gl.getUniformLocation(program, "saturation"),
            mousePos: gl.getUniformLocation(program, "mousePos"),
            mouseInfluence: gl.getUniformLocation(program, "mouseInfluence"),
            noiseAmount: gl.getUniformLocation(program, "noiseAmount"),
            distortion: gl.getUniformLocation(program, "distortion"),
        };

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
        gl.clearColor(0, 0, 0, 0);
    }

    compileShader(type, source) {
        const gl = this.gl;
        const shader = gl.createShader(type);

        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw new Error(gl.getShaderInfoLog(shader));
        }

        return shader;
    }

    resize() {
        if (!this.gl || !this.program) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const width = Math.max(1, Math.floor(this.container.clientWidth * dpr));
        const height = Math.max(1, Math.floor(this.container.clientHeight * dpr));

        if (this.canvas.width !== width || this.canvas.height !== height) {
            this.canvas.width = width;
            this.canvas.height = height;
        }

        this.gl.viewport(0, 0, width, height);
        this.updateUniforms();
    }

    updateUniforms() {
        const gl = this.gl;
        const { color, speed, spread, length, fadeDistance, saturation, mouseInfluence, noiseAmount, distortion } = this.options;
        const [r, g, b] = SoundLightRays.hexToRgb(color);
        const { anchor, dir } = this.getLightPlacement(0);

        gl.useProgram(this.program);
        gl.uniform2f(this.uniforms.iResolution, this.canvas.width, this.canvas.height);
        gl.uniform2f(this.uniforms.rayPos, anchor[0], anchor[1]);
        gl.uniform2f(this.uniforms.rayDir, dir[0], dir[1]);
        gl.uniform3f(this.uniforms.raysColor, r, g, b);
        gl.uniform1f(this.uniforms.raysSpeed, speed);
        gl.uniform1f(this.uniforms.lightSpread, spread);
        gl.uniform1f(this.uniforms.rayLength, length);
        gl.uniform1f(this.uniforms.fadeDistance, fadeDistance);
        gl.uniform1f(this.uniforms.saturation, saturation);
        gl.uniform1f(this.uniforms.mouseInfluence, mouseInfluence);
        gl.uniform1f(this.uniforms.noiseAmount, noiseAmount);
        gl.uniform1f(this.uniforms.distortion, distortion);
    }

    start() {
        if (this.isRunning || !this.gl) return;

        this.isRunning = true;
        this.frameId = requestAnimationFrame(this.render);
    }

    stop() {
        this.isRunning = false;

        if (this.frameId) {
            cancelAnimationFrame(this.frameId);
            this.frameId = null;
        }
    }

    render(time) {
        if (!this.isRunning || !this.gl) return;

        const gl = this.gl;
        const smoothing = 0.86;

        this.smoothMouse.x = this.smoothMouse.x * smoothing + this.mouse.x * (1 - smoothing);
        this.smoothMouse.y = this.smoothMouse.y * smoothing + this.mouse.y * (1 - smoothing);

        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(this.program);
        gl.uniform1f(this.uniforms.iTime, time * 0.001);
        this.updateAnimatedPlacement(time * 0.001);
        gl.uniform2f(this.uniforms.mousePos, this.smoothMouse.x, this.smoothMouse.y);
        gl.drawArrays(gl.TRIANGLES, 0, 3);

        this.frameId = requestAnimationFrame(this.render);
    }

    handleMouseMove(event) {
        const rect = this.container.getBoundingClientRect();

        if (!rect.width || !rect.height) return;

        this.mouse.x = (event.clientX - rect.left) / rect.width;
        this.mouse.y = (event.clientY - rect.top) / rect.height;
    }

    updateAnimatedPlacement(time) {
        const { anchor, dir } = this.getLightPlacement(time);

        this.gl.uniform2f(this.uniforms.rayPos, anchor[0], anchor[1]);
        this.gl.uniform2f(this.uniforms.rayDir, dir[0], dir[1]);
    }

    getLightPlacement(time) {
        const placement = SoundLightRays.getAnchorAndDir(this.options.origin, this.canvas.width, this.canvas.height);
        const sweepAmount = this.options.sweepAmount || 0;

        if (sweepAmount <= 0) return placement;

        const sweep = Math.sin(time * this.options.sweepSpeed) * sweepAmount;

        return {
            anchor: [placement.anchor[0], placement.anchor[1] + this.canvas.height * sweep],
            dir: SoundLightRays.normalize([placement.dir[0], placement.dir[1] - sweep * 0.42]),
        };
    }

    static hexToRgb(hex) {
        const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

        if (!match) return [1, 1, 1];

        return [parseInt(match[1], 16) / 255, parseInt(match[2], 16) / 255, parseInt(match[3], 16) / 255];
    }

    static normalize(vector) {
        const length = Math.hypot(vector[0], vector[1]) || 1;

        return [vector[0] / length, vector[1] / length];
    }

    static getAnchorAndDir(origin, width, height) {
        const outside = 0.2;

        switch (origin) {
            case "top-left":
                return { anchor: [0, -outside * height], dir: [0, 1] };
            case "top-right":
                return { anchor: [width, -outside * height], dir: [0, 1] };
            case "right":
                return { anchor: [(1 + outside) * width, 0.5 * height], dir: [-1, 0] };
            case "bottom-left":
                return { anchor: [0, (1 + outside) * height], dir: [0, -1] };
            case "bottom-center":
                return { anchor: [0.5 * width, (1 + outside) * height], dir: [0, -1] };
            case "bottom-right":
                return { anchor: [width, (1 + outside) * height], dir: [0, -1] };
            case "left":
            default:
                return { anchor: [-outside * width, 0.5 * height], dir: [1, 0] };
        }
    }
}

window.SoundLightRays = SoundLightRays;
