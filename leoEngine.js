//Variáveis
var canvas = Element;
var ctx = CanvasRenderingContext2D;
console.log("START LeoWebEngine 0.0.0.1");
const C = {
	BLACK:		"#000000",
	GRAY:		"#808080",
	GREY:		"#808080",
	SILVER:		"#C0C0C0",
	WHITE:		"#FFFFFF",
	MAROON:		"#800000",
	RED:		"#FF0000",
	BROWN:		"#A52A2A",
	ORANGE:		"#FFA500",
	OLIVE:		"#808000",
	YELLOW:		"#FFFF00",
	GREEN:		"#008000",
	LIME:		"#00FF00",
	TEAL:		"#008080",
	AQUA:		"#00FFFF",
	NAVY:		"#000080",
	BLUE:		"#0000FF",
	PURPLE:		"#800080",
	FUCHSIA:	"#FF00FF",
};
const AL = {
	LEFT: "left",
	CENTER: "center",
	RIGHT: "right",
	TOP: "top",
	MIDDLE: "middle",
	BOTTOM: "bottom",
	NONE: "none"
}
const PR = {
	LINELIST: "linelist",
	LINESTRIP: "linestrip",
	TRIANGLELIST: "trianglelist",
	TRIANGLESTRIP: "trianglestrip",
	TRIANGLEFAN: "trianglefan",
	POINTLIST: "pointlist",
	VERTEXMESH: "vertexmesh",
}
const VK = {
	LEFT: "ArrowLeft",
	RIGHT: "ArrowRight",
	UP: "ArrowUp",
	DOWN: "ArrowDown"
}
const MB = {
	LEFT: 0,
	MIDDLE: 1,
	RIGHT: 2
};
//Classes
class Loader {
	constructor() {
		this.loaders = 0;
		this.run = false;
		this.norun = true;
		setTimeout(()=>{this.isRunning()},500);
	}
	isRunning() {
		if ((!this.run) && (this.norun)) {
			console.warn("Engine successfully loaded but no Render Window detected.");
		}
	}
	check() {
		this.norun = false;
		if ((this.loaders == 0) && (!this.run)) {
			this.run = true;
			console.info("RUN - "+resources.length+" resources loaded");
		}
		return this.run;
	}
	add() {
		this.loaders++;
	}
	ok() {
		this.loaders--;
	}
}
const loader = new Loader();
var resources = [];
class Resource {
	constructor() {
		this.loaded = false;
		loader.add();
		resources.push(this);
	}
	ok() {
		if (!this.loaded) {
			this.loaded = true;
			loader.ok();
		}
	}
}
class IEvent {
	constructor(argOwner) {
		this.owner = argOwner;
		this.owner.IEvents.push(this);
		this.logic = function() {};
	}
	execute() {
		this.logic.call(this.owner);
	}
}
class Alarm extends IEvent {
	constructor(argOwner) {
		super(argOwner);
	}
}
class MouseClick extends IEvent {
	constructor(argOwner) {
		super(argOwner);
	}
}

class Vec2 {
	constructor(argX = 0,argY = 0) {
		this.x = argX;
		this.y = argY;
	}
}
var textures = [];
class Texture extends Resource {
	constructor(argImg) {
		super();

		this.img = document.createElement("img");
		this.img.style.display = "none";
		document.body.appendChild(this.img);
		
		this._onLoadCallbacks = [];
		
		this.img.addEventListener("load",(e)=>{
			super.ok();
			for (let cb of this._onLoadCallbacks) {
				cb(this);
			}
		})
		this.img.src = argImg;
		
		textures.push(this);
		console.log("TEX "+argImg);
	}
	
	onLoad(cb) {
		if (this.img.complete && this.img.naturalWidth > 0) {
			cb(this);
		} else {
			this._onLoadCallbacks.push(cb);
		}
	}
}
var sprites = [];
class Sprite extends Resource {
	constructor(argImg,argPos=new Vec2(),argW=-1,argH=-1) {
		super();

		this.tex = null;
		this.pos = argPos;
		this.w = argW;
		this.h = argH;
		this.xOrigin = 0;
		this.yOrigin = 0;
		this._vxOrigin = AL.LEFT;
		this._vyOrigin = AL.TOP;

		if (typeof argImg == "string") {
			let newTex = new Texture(argImg);
			newTex.onLoad((tex) => {
				this.setTex(tex,argPos,argW,argH);
			});
			this.tex = newTex;
		} else if (argImg instanceof Texture) {
			argImg.onLoad((tex) => {
				this.setTex(tex, argPos, argW, argH);
			});
			this.tex = argImg;
		} else {
			this.setTex(argImg,argPos,argW,argH);
		}

		sprites.push(this);
		super.ok();
	}
	get x() { return this.pos.x; }
	set x(value) { this.pos.x = value; }
	get y() { return this.pos.y; }
	set y(value) { this.pos.y = value; }
	get width() { return this.w; }
	set width(value) { this.w = value; }
	get height() { return this.h; }
	set height(value) { this.h = value; }
	get img() { return this.tex.img; }
	set img(value) { this.tex.img = value; }
	
	setTex(argTex,argPos,argW,argH) {
		this.tex = argTex;
		this.pos = argPos;
		this.w = argW;
		this.h = argH;
		if (this.w == -1) {
			this.w = this.img.width;
		}
		if (this.h == -1) {
			this.h = this.img.height;
		}
		this.setOrigin(this._vxOrigin,this._vyOrigin);
		console.log("SPR "+this.img.src);
	}
	setOrigin(argX,argY) {
		if (typeof argX == "number") {
			this.xOrigin = argX;
			this._vxOrigin = AL.NONE;
		} else {
			this._vxOrigin = argX;
			switch (this._vxOrigin) {
				case AL.LEFT: this.xOrigin = 0; break;
				case AL.CENTER: this.xOrigin = this.w / 2; break;
				case AL.RIGHT: this.xOrigin = this.w; break;
				case AL.NONE: break;
				default: throw new Error("Invalid horizontal alignment value!");
			}
		}
		if (typeof argY == "number") {
			this.yOrigin = argY;
			this._vyOrigin = AL.NONE;
		} else {
			this._vyOrigin = argY;
			switch (this._vyOrigin) {
				case AL.TOP: this.yOrigin = 0; break;
				case AL.MIDDLE: this.yOrigin = this.h / 2; break;
				case AL.BOTTOM: this.yOrigin = this.h; break;
				case AL.NONE: break;
				default: throw new Error("Invalid vertical alignment value!");
			}
		}
	}
}

var instances = [];
/** Classe que representa tudo que precisar de algum tipo de processamento lógico
 * @param {Sprite} argSprite A sprite que representa esta instância
 * @param {Vec2} argPos A posição desta instância na cena
 */
class Instance extends Resource {
	constructor(argSprite,argPos = new Vec2()) {
		super();

		this.sprite = argSprite;
		this.pos = argPos;
		this.hspeed = 0;
		this.vspeed = 0;
		this.imageXScale = 1;
		this.imageYScale = 1;
		this.imageAngle = 0;
		this.imageBlend = C.WHITE;
		this.imageAlpha = 1;
		this.IEvents = [];
		this.alarm = Array.from({length:12}, () => -1);
		this._alarmFunc = Array.from({length:12}, () => new Alarm(this));
		this._mouseB = Array.from({length: 3}, () => new MouseClick(this));
		this.visible = true;

		console.log("INST "+instances.length);
		instances.push(this);
		super.ok();
	}
	get x() { return this.pos.x; }
	set x(value) { this.pos.x = value; }
	get y() { return this.pos.y; }
	set y(value) { this.pos.y = value; }
	
	setAlarm(argAlarm,argFunction = function() {}) {
		this._alarmFunc[argAlarm].logic = argFunction;
	}

	setMouseButton(argMouseButton,argFunction = function() {}) {
		this._mouseB[argMouseButton].logic = argFunction;
	}

	logic() {
		//Lógica adicionada posteriormente dinamicamente.
	}
	innerLogic() {
		this.x += this.hspeed;
		this.y += this.vspeed;

		for (let i = 0; i < 3; i++) {
			if (mouseCheckPos(i,new Vec2(this.x - this.sprite.xOrigin,this.y - this.sprite.yOrigin),new Vec2(this.x - this.sprite.xOrigin + this.sprite.width, this.y - this.sprite.yOrigin + this.sprite.height))) {
				this._mouseB[i].execute();
			}
		}

		for (let i = 0; i < 12; i++) {
			this.alarm[i]--;
			if (this.alarm[i] == 0) {
				//console.log("Chamando alarm "+i);
				this._alarmFunc[i].execute();
			}
		}
	}
	draw() {
		//drawSprite(this.sprite,this.x,this.y);
		drawSpriteExt(
			this.sprite,
			this.x, this.y,
			this.imageXScale, this.imageYScale,
			this.imageAngle, this.imageBlend, this.imageAlpha); // Função padrão de draw, para a instância desenhar a própria imagem com suas variáveis reservadas
		// Para mudar este comportamento, basta gravar uma nova função em draw.
	}
}

class RenderWindow {
	constructor(argW,argH,argTitle) {
		this.canvas = document.createElement("canvas");
		this.w = argW;
		this.h = argH;
		this.canvas.width = this.w;
		this.canvas.height = this.h;
		this.ctx = this.canvas.getContext("2d");
		document.body.appendChild(this.canvas);
		this.update = null;
		this.clearDraw = true;
		
		let title = document.getElementsByTagName("title");
		if (title.length == 0) {
			title = document.createElement("title");
			document.head.appendChild(title);
		} else {
			title = title[0];
		}
		title.innerText = argTitle;

		showWindow(this);

		this.setFramerateLimit(60);
	}
	preInnerLogic() {
		//Nada ainda!
	}
	preLogic() {
		//Atualizar posteriormente;
	}
	logic() {
		//Atualizar posteriormente;
	}
	innerLogic() {
		//Nada ainda!
	}
	postInnerLogic() {
		//Reseta o delta mouse
		md.x = 0;
		md.y = 0;
	}
	draw() {
		//Atualizar posteriormente;
	}
	setFramerateLimit(argFrameRate) {
		this.update = setInterval(()=>{
			if (loader.check()) {
				try {
					this.preInnerLogic();
					this.preLogic();
					for (let instance of instances) {
						instance.logic();
						instance.innerLogic();
					}
					this.logic();
					if (this.clearDraw) {
						this.ctx.clearRect(0,0,this.w,this.h);
					}
					this.draw();
					for (let instance of instances) {
						if (instance.visible) { // Chama o evento draw() das instâncias automaticamente somente se elas estiverem marcadas como visível (padrão)
							instance.draw();
						}
					}
					this.postInnerLogic();
				} catch (error) {
					clearInterval(this.update);
					showError(error);
				}
			}
		},1000 / argFrameRate);
		console.log("FPS "+argFrameRate);
	}
}

//Funções
/**
 * Desenha uma sprite no canvas nas coordenadas especificadas.
 * @param {Sprite} argSprite - Sprite a ser desenhada.
 * @param {number} argX - Posição X na tela.
 * @param {number} argY - Posição Y na tela.
 */
function drawSprite(argSprite,argX,argY) {
	ctx.drawImage(
		argSprite.img,
		argSprite.x, argSprite.y, argSprite.w, argSprite.h,
		argX - argSprite.xOrigin, argY - argSprite.yOrigin, argSprite.w, argSprite.h
	);
};
function drawSpriteTiled(argSprite,argX,argY) {
	let x = argX - argSprite.xOrigin;
	let y = argY - argSprite.yOrigin;
	for (let i = 0; i < canvas.width; i += argSprite.w) {
		for (let j = 0; j < canvas.height; j += argSprite.h) {
			ctx.drawImage(
				argSprite.img,
				argSprite.x, argSprite.y, argSprite.w, argSprite.h,
				i + x, j + y, argSprite.w, argSprite.h
			);
		}
	}
}
/**
 * Desenha uma sprite com parâmetros estendidos (escala, rotação, blend, alpha).
 * @param {Sprite} argSprite - Sprite a ser desenhada.
 * @param {number} argX - Posição X na tela.
 * @param {number} argY - Posição Y na tela.
 * @param {number} argScaleX - Escala horizontal.
 * @param {number} argScaleY - Escala vertical.
 * @param {number} argRot - Rotação em graus.
 * @param {string} argBlend - Cor de blend (hex).
 * @param {number} argAlpha - Transparência (0-1).
 */
function drawSpriteExt(argSprite, argX, argY, argScaleX = 1, argScaleY = 1, argRot = 0, argBlend = C.WHITE, argAlpha = 1) {
    ctx.save();
    ctx.translate(argX, argY);
    ctx.rotate(argRot * -Math.PI / 180);
    ctx.scale(argScaleX, argScaleY);
    ctx.globalAlpha = argAlpha;

    if (argBlend && argBlend !== C.WHITE) {
        // Canvas auxiliar
        let tempCanvas = document.createElement("canvas");
        tempCanvas.width = argSprite.w;
        tempCanvas.height = argSprite.h;
        let tempCtx = tempCanvas.getContext("2d");

        // Desenha a imagem
        tempCtx.drawImage(
            argSprite.img,
            argSprite.x, argSprite.y, argSprite.w, argSprite.h,
            0, 0, argSprite.w, argSprite.h
        );

        // Aplica o blend apenas nos pixels da imagem
        tempCtx.globalCompositeOperation = "multiply";
        tempCtx.fillStyle = argBlend;
        tempCtx.fillRect(0, 0, argSprite.w, argSprite.h);

        // Volta ao modo normal e desenha no contexto principal
        ctx.drawImage(
            tempCanvas,
            -argSprite.xOrigin, -argSprite.yOrigin, argSprite.w, argSprite.h
        );
    } else {
        ctx.drawImage(
            argSprite.img,
            argSprite.x, argSprite.y, argSprite.w, argSprite.h,
            0-argSprite.xOrigin, 0-argSprite.yOrigin, argSprite.w, argSprite.h
        );
    }

    ctx.restore();
}
// Desenhar uma sprite com todos os parâmetros possíveis ajustáveis, desde o ponto XY até o ponto de origem e o ponto de destino, inclusive o ponto de offset para rotação e escala.
function drawSpriteGeneral(argSprite, argPS1, argPS2, argPD1, argPD2, argScaleX = 1, argScaleY = 1, argRot = 0, argBlend = C.WHITE, argAlpha = 1) {
	ctx.save();
	//ctx.translate(argPD1.x, argPD1.y);
	ctx.rotate(argRot);
	//ctx.scale(argScaleX, argScaleY);
	ctx.globalAlpha = argAlpha;

	if (argBlend && argBlend !== C.WHITE) {

		/* Blend ainda não funciona!
		// Canvas auxiliar
		let tempCanvas = document.createElement("canvas");
		tempCanvas.width = argSprite.w;
		tempCanvas.height = argSprite.h;
		let tempCtx = tempCanvas.getContext("2d");

		// Desenha a imagem
		tempCtx.drawImage(
			argSprite.img,
			argSprite.x, argSprite.y, argSprite.w, argSprite.h,
			0, 0, argSprite.w, argSprite.h
		);

		// Aplica o blend apenas nos pixels da imagem
		tempCtx.globalCompositeOperation = "multiply";
		tempCtx.fillStyle = argBlend;
		tempCtx.fillRect(0, 0, argSprite.w, argSprite.h);

		// Volta ao modo normal e desenha no contexto principal
		ctx.drawImage(
			tempCanvas,
			-argP1.x + argP2.x, -argP1.y + argP2.y, argSprite.w, argSprite.h
		);
		*/
	} else {
		ctx.drawImage(
			argSprite.img,
			argPS1.x, argPS1.y, argPS2.x - argPS1.x, argPS2.y - argPS1.y,
			argPD1.x, argPD1.y, (argPD2.x - argPD1.x) * argScaleX, (argPD2.y - argPD1.y) * argScaleY
		);
	}

	ctx.restore();

}

function drawLine(argPos1,argPos2) {
	ctx.beginPath();
	ctx.moveTo(argPos1.x,argPos1.y);
	ctx.lineTo(argPos2.x,argPos2.y);
	ctx.stroke();
}
var _PRDraw = null;
var _vertices = [];
/**
 * Inicia o desenho de um primitivo
 * @param {PR} argPR Formato de desenho do primitivo
 */
function drawPrimitiveBegin(argPR) {
	_PRDraw = argPR;
	ctx.beginPath();
}
function drawVertex(argPos) {
	argPos.x = Math.floor(argPos.x);
	argPos.y = Math.floor(argPos.y);
	argPos.x -= 0.5;
	argPos.y -= 0.5;
	_vertices.push(argPos);
}
function drawPrimitiveEnd() {
	switch (_PRDraw) {
		case PR.LINELIST:
			// Desenha pares de vértices como linhas independentes
			for (let i = 0; i < _vertices.length - 1; i += 2) {
				ctx.moveTo(_vertices[i].x, _vertices[i].y);
				ctx.lineTo(_vertices[i + 1].x, _vertices[i + 1].y);
			}
			ctx.stroke();
			break;
		case PR.LINESTRIP:
			// Desenha uma linha conectando todos os vértices em sequência
			if (_vertices.length > 1) {
				ctx.moveTo(_vertices[0].x, _vertices[0].y);
				for (let i = 1; i < _vertices.length; i++) {
					ctx.lineTo(_vertices[i].x, _vertices[i].y);
				}
				ctx.stroke();
			}
			break;
		case PR.TRIANGLELIST:
			// Desenha triângulos independentes a cada grupo de 3 vértices
			for (let i = 0; i < _vertices.length - 2; i += 3) {
				ctx.beginPath();
				ctx.moveTo(_vertices[i].x, _vertices[i].y);
				ctx.lineTo(_vertices[i + 1].x, _vertices[i + 1].y);
				ctx.lineTo(_vertices[i + 2].x, _vertices[i + 2].y);
				ctx.closePath();
				ctx.fill();
			}
			break;
		case PR.TRIANGLESTRIP:
			// Desenha triângulos conectados em strip
			for (let i = 0; i < _vertices.length - 2; i++) {
				ctx.beginPath();
				ctx.moveTo(_vertices[i].x, _vertices[i].y);
				ctx.lineTo(_vertices[i + 1].x, _vertices[i + 1].y);
				ctx.lineTo(_vertices[i + 2].x, _vertices[i + 2].y);
				ctx.closePath();
				ctx.fill();
			}
			break;
		case PR.TRIANGLEFAN:
			// Desenha triângulos conectados em fan
			if (_vertices.length > 2) {
				for (let i = 1; i < _vertices.length - 1; i++) {
					ctx.beginPath();
					ctx.moveTo(_vertices[0].x, _vertices[0].y);
					ctx.lineTo(_vertices[i].x, _vertices[i].y);
					ctx.lineTo(_vertices[i + 1].x, _vertices[i + 1].y);
					ctx.closePath();
					ctx.fill();
				}
			}
			break;
		case PR.POINTLIST:
			// Desenha pontos
			for (let v of _vertices) {
				ctx.beginPath();
				ctx.arc(v.x, v.y, 2, 0, Math.PI * 2);
				ctx.fill();
			}
			break;
		case PR.VERTEXMESH:
			ctx.beginPath();
			ctx.moveTo(_vertices[0].x, _vertices[0].y);
			for (let i = 1; i < _vertices.length; i++) {
				ctx.lineTo(_vertices[i].x, _vertices[i].y);
			}
			ctx.closePath();
			ctx.fill();
			break;
		default:
			break;
	}
	_vertices = [];
}
var _color = "#000000";
/**
 * Define a cor para funções de desenho
 * @param {string} argC A cor (em hex) para definir futuras funções de desenho
 */
function drawSetColor(argC) {
	_color = argC;
	ctx.fillStyle = _color;
	ctx.strokeStyle = _color;
}
function makeColorRGB(argR, argG, argB) {
	let r = Math.max(0, Math.min(255, argR));
	let g = Math.max(0, Math.min(255, argG));
	let b = Math.max(0, Math.min(255, argB));
	return "#" + ((1 << 24) + (r << 16) + (g << 8) + b)
		.toString(16)
		.slice(1)
		.toUpperCase();
}
function createWindow(argW,argH,argTitle="") {
	let newWindow = new RenderWindow(argW,argH,argTitle);
	return newWindow;
}
function showWindow(argWindow) {
	//Registro global
	canvas = argWindow.canvas;
	ctx = argWindow.ctx;

	//Registro de eventos de mouse
	canvas.addEventListener("mousedown",(e)=>{
		mButtons[e.button].press = true;
		mButtons[e.button].pos.x = e.offsetX;
		mButtons[e.button].pos.y = e.offsetY;
	});
	canvas.addEventListener("mouseup",(e)=>{
		mButtons[e.button].press = false;
		mButtons[e.button].pos.x = e.offsetX;
		mButtons[e.button].pos.y = e.offsetY;
	});
	canvas.addEventListener("mousemove",(e)=>{
		m.x = e.offsetX;
		m.y = e.offsetY;
		md.x = e.movementX;
		md.y = e.movementY;
	});
	canvas.addEventListener("mouseleave",(e)=>{
		mButtons[e.button].press = false;
	});
}
/**
 * Exibe o diálogo de erro.
 * @param {Error} argError O erro throwable. A função exibirá na console e exibirá na janela como um modal.
 */
function showError(argError) {
	console.error(argError);
	let dialogError = document.createElement("dialog");
	dialogError.classList.add("error");
	let titleError = document.createElement("h1");
	titleError.innerHTML = argError.message;
	let stackError = document.createElement("pre");
	stackError.innerHTML = argError.stack;
	dialogError.appendChild(titleError);
	dialogError.appendChild(stackError);
	document.body.appendChild(dialogError);
	dialogError.showModal();
}
window.addEventListener("error",(e)=>{
	showError(e);
});






//#region Input

//#region Teclado
var keys = new Object();
function keyboardCheck(argKey) {
	if (!(argKey in keys)) {
		keys[argKey] = false;
		console.log("KEY "+argKey);
	}
	return keys[argKey];
}
//Registro de eventos de teclado na página
window.addEventListener("keydown",(e)=>{
	keys[e.code] = true;
});
window.addEventListener("keyup",(e)=>{
	keys[e.code] = false;
});
//#endregion
//#region Mouse
var mButtons = new Object();
var m = new Vec2(-1,-1);
var md = new Vec2(0,0);
function mouseCheck(argButton) {
	if (!(argButton in mButtons)) {
		mButtons[argButton] = {
			press: false,
			pos: new Vec2(-1,-1)
		};
		console.log("MBUTTON "+argButton);
	}
	return mButtons[argButton].press;
}
function mouseGetPos() {
	return m;
}
function mouseCheckPos(argButton,argPos1,argPos2) {
	if (!(argButton in mButtons)) {
		mButtons[argButton] = {
			press: false,
			pos: new Vec2(-1,-1)
		};
		console.log("MBUTTON "+argButton);
	}
	let btn = mButtons[argButton];
	let minX = Math.min(argPos1.x, argPos2.x);
	let maxX = Math.max(argPos1.x, argPos2.x);
	let minY = Math.min(argPos1.y, argPos2.y);
	let maxY = Math.max(argPos1.y, argPos2.y);
	let checkpos = btn.pos.x >= minX && btn.pos.x <= maxX && btn.pos.y >= minY && btn.pos.y <= maxY;
	return (checkpos && mButtons[argButton].press);
}
//Registro prévio de botões do mouse
mouseCheckPos(0,-1,-1);
mouseCheckPos(1,-1,-1);
mouseCheckPos(2,-1,-1);
//#endregion

//#endregion

//Preparo da HUD da LeoEngine
const leoEngineCSS = document.createElement("link");
leoEngineCSS.href = "leoEngine.css";
leoEngineCSS.rel = "stylesheet";
leoEngineCSS.type = "text/css";
const scripts = document.getElementsByTagName("script");
let engineScriptSrc = "";
for (let script of scripts) {
	if (script.src && script.src.includes("leoEngine.js")) {
		engineScriptSrc = script.src;
		break;
	}
}
if (engineScriptSrc) {
	const pathParts = engineScriptSrc.split("/");
	pathParts.pop(); // remove 'leoEngine.js'
	const relativePath = pathParts.join("/");
	leoEngineCSS.href = relativePath + "/leoEngine.css";
}
document.head.appendChild(leoEngineCSS);