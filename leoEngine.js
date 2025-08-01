//Variáveis
var canvas = Element;
var ctx = CanvasRenderingContext2D;
console.log("START LeoWebEngine 0.0.0.1");

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
	}
}
class Alarm extends IEvent {
	constructor(argOwner) {
		super(argOwner);
		this.logic = function() {};
	}
	execute() {
		this.logic.call(this.owner);
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
		this.img.addEventListener("load",(e)=>{
			super.ok();
		})
		this.img.src = argImg;
		this.img.style.display = "none";
		document.body.appendChild(this.img);
		
		textures.push(this);
		console.log("TEX "+argImg);
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
		if (typeof argImg == "string") {
			let newTex = new Texture(argImg);
			argImg = newTex;
			newTex.img.onload = ()=>{ this.definirTex(argImg,argPos,argW,argH); }
		} else {
			this.definirTex(argImg);
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
	
	definirTex(argTex,argPos,argW,argH) {
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
		console.log("SPR "+this.img.src);
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
		this.alarm = Array.from({length:12}, () => -1);
		this.alarmFunc = Array.from({length:12}, () => new Alarm(this));
		this.selfDraw = true;

		console.log("INST "+instances.length);
		instances.push(this);
		super.ok();
	}
	get x() { return this.pos.x; }
	set x(value) { this.pos.x = value; }
	get y() { return this.pos.y; }
	set y(value) { this.pos.y = value; }
	
	setAlarm(argAlarm,argFunction) {
		this.alarmFunc[argAlarm].logic = argFunction;
	}

	logic() {
		//Lógica adicionada posteriormente dinamicamente.
	}
	innerLogic() {
		this.x += this.hspeed;
		this.y += this.vspeed;
		for (let i = 0; i < 12; i++) {
			this.alarm[i]--;
			if (this.alarm[i] == 0) {
				//console.log("Chamando alarm "+i);
				this.alarmFunc[i].execute();
			}
		}
	}
	draw() {
		if (this.selfDraw) {
			drawSprite(this.sprite,this.x,this.y);
		}
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

		canvas = this.canvas;
		ctx = this.ctx;

		this.setFramerateLimit(60);
	}
	logic() {
		//Atualizar posteriormente;
	}
	draw() {
		//Atualizar posteriormente;
	}
	setFramerateLimit(argFrameRate) {
		this.update = setInterval(()=>{
			if (loader.check()) {
				try {
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
						instance.draw();
					}
				} catch (error) {
					clearInterval(this.update);
					console.error(error);
					let showError = document.createElement("dialog");
					showError.classList.add("error");
					let titleError = document.createElement("h1");
					titleError.innerHTML = error.message;
					let stackError = document.createElement("pre");
					stackError.innerHTML = error.stack;
					showError.appendChild(titleError);
					showError.appendChild(stackError);
					document.body.appendChild(showError);
					showError.showModal();
				}
			}
		},1000 / argFrameRate);
		console.log("FPS "+argFrameRate);
	}
}

//Funções
/**Draws a sprite image onto the canvas at the specified coordinates. 
 * @param {Sprite} argSprite - The sprite object containing image and source rectangle properties.
 * @param {int} argX - The x-coordinate on the canvas where the sprite will be drawn.
 * @param {int} argY - The y-coordinate on the canvas where the sprite will be drawn.
 */
function drawSprite(argSprite,argX,argY) {
	ctx.drawImage(
		argSprite.img,
		argSprite.x, argSprite.y, argSprite.w, argSprite.h,
		argX, argY, argSprite.w, argSprite.h
	);
};
function drawLine(argPos1,argPos2) {
	ctx.beginPath();
	ctx.moveTo(argPos1.x,argPos1.y);
	ctx.lineTo(argPos2.x,argPos2.y);
	ctx.stroke();
}
function createWindow(argW,argH,argTitle="") {
	let newWindow = new RenderWindow(argW,argH,argTitle);
	return newWindow;
}
function keyboardCheck(argKey) {
	if (!(argKey in keys)) {
		keys[argKey] = false;
		console.log("KEY "+argKey);
	}
	return keys[argKey];
}
var keys=new Object();
window.addEventListener("keydown",(e)=>{
	keys[e.code] = true;
});
window.addEventListener("keyup",(e)=>{
	keys[e.code] = false;
});
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