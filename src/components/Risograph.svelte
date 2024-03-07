<script>


export let vh;
let el;
/**
 * Convert an angle to degrees.
 * @param {String} angle Value of an angle in CSS syntax (e.g.: 90deg, -50rad, 10grad, -0.25turn)
 * @return {Number} Angle value expressed in degrees
 */
 function parseDegrees(angle) {
	if (angle.toLowerCase().includes("grad")) {
		return (parseFloat(angle.replace("grad", "")) * 180) / 200;
	}
	if (angle.toLowerCase().includes("rad")) {
		return (parseFloat(angle.replace("rad", "")) * 180) / Math.PI;
	}
	if (angle.toLowerCase().includes("turn")) {
		return parseFloat(angle.replace("turn", "")) * 360;
	}
	return parseFloat(angle.toString().replace("deg", ""));
}

/**
 * Retrieve an angle value as degrees in the [0;360[ range
 * @param {String} ang The angle value
 * @return {Number} The degree value contained within the [0;360[ range
 * */
function singleCycleDegrees(ang) {
	const baseDeg = parseDegrees(ang) % 360;
	const deg = (baseDeg < 0) ? 360 - Math.abs(baseDeg) : baseDeg;
	return deg;
}

/**
 * Convert degrees to radians
 * @param {Number} deg Angle in degrees
 * @return {Number} Angle in radians
*/
function degreesToRadians(deg) {
	return deg * Math.PI / 180;
}

/**
 * Apply an easing to a value
 * @source https://gist.github.com/gre/1650294
 * @param {Number} value Number between 0 and 1
 * @param {?String} type Easing type
 * @return {Number} Eased value
*/
function easeValue(value, type = 'easeInOutQuad') {
	const easingFunctions = {
		// no easing, no acceleration
		linear: t => t,
		// accelerating from zero velocity
		easeInQuad: t => t*t,
		// decelerating to zero velocity
		easeOutQuad: t => t*(2-t),
		// acceleration until halfway, then deceleration
		easeInOutQuad: t => t<.5 ? 2*t*t : -1+(4-2*t)*t,
		// accelerating from zero velocity 
		easeInCubic: t => t*t*t,
		// decelerating to zero velocity 
		easeOutCubic: t => (--t)*t*t+1,
		// acceleration until halfway, then deceleration 
		easeInOutCubic: t => t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1,
		// accelerating from zero velocity 
		easeInQuart: t => t*t*t*t,
		// decelerating to zero velocity 
		easeOutQuart: t => 1-(--t)*t*t*t,
		// acceleration until halfway, then deceleration
		easeInOutQuart: t => t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t,
		// accelerating from zero velocity
		easeInQuint: t => t*t*t*t*t,
		// decelerating to zero velocity
		easeOutQuint: t => 1+(--t)*t*t*t*t,
		// acceleration until halfway, then deceleration 
		easeInOutQuint: t => t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t
	};
	// If the provided type is invalid, use a default instead
	if (typeof type !== 'string' || !easingFunctions.hasOwnProperty(type)) { type = 'easeInOutQuint'; }
	return easingFunctions[ type ](value);
}

/**
 * Round a number to a specified decimal precision
 * @param {Number} number The number to round
 * @param {Number} precision Positive integer  specifying the number of decimal places to show
 * @return {Number} Rounded number
*/
function round(number, precision = 3) {
	return parseFloat(number.toFixed(precision));
}

/**
 * Clamp a number in a range
 * @param {Number} number The number to clamp
 * @param {Number} min The minimum value to return
 * @param {Number} max The maximum value to return
 * @return {Number} The clamped number
 */
function clamp(number, min = 0, max = 1) {
	return Math.min(max, Math.max(min, number));
}

/**
 * Remap a number from one boundary to another
 * @param {Number} number Initial number to map to a new boundaries
 * @param {Number} in_min The initial number's lower boundary
 * @param {Number} in_max The initial number's upper boundary
 * @param {Number} out_min The final number's lower boundary
 * @param {Number} out_max The final number's upper boundary
 * @return {Number} Remapped number
 */
function remapNumber(number, in_min, in_max, out_min, out_max) {
	return (number - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

/* Math magic below */
function getPoint(x, y, rad) {
	// Division by 0 is bad
	if (x === 0) { return 1; }

	return Math.hypot(x, y) * Math.cos(Math.atan(y/x) - rad);
}

function getShape(w, h, rad) {
	return Math.hypot(w, h) * Math.cos(Math.atan(h/w) - rad);
}

/** Return the progression of a point along a gradient angle within a canvas */
function pointProgressAlongGradient(x, y, w, h, rad, quarterTurns) {		
	// Flip the geometry if the canvas is turned by 0 or 0.5 turns
	if (quarterTurns === 0 || quarterTurns === 2) {
		[x, y] = [y, x];
		[w, h] = [h, w];
	}

	// Invert the horizontal pixel coordinates if the canvas is turned by 0.25 or 0.75 turns
	if (quarterTurns === 0 || quarterTurns === 3) {
		x = w - x;
	}

	// Invert the vertical pixel coordinates if the canvas is turned by 0.5 or 0.75 turns
	if (quarterTurns === 2 || quarterTurns === 3) {
		y = h - y;
	}

	const point = getPoint(x, y, rad);
	const shape = getShape(w, h, rad);
	return round(point/shape, 6);
}

function getCanvas() {
    return document.querySelector('.risograph, canvas');
}

function generateRisograph() {
    const canvas = el;//getCanvas();
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
	const mainHue = Math.floor(Math.random() * 360);
	const isGrayscale = Math.random() > 0.92; // Small chance to be grayscale
	const mainSaturation = isGrayscale ? 0 : Math.ceil(remapNumber(Math.random(), 0, 1, 75, 100));
	const mainLightness = isGrayscale ? 100 : Math.ceil(remapNumber(Math.random(), 0, 1, 50, 90));
	const compHueDelta = Math.ceil(remapNumber(Math.random(), 0, 1, 25, 75));
	const compHueDir = (Math.random() >= 0.5 ? 1 : -1); // Randomise the hue offset direction
	const compHue = mainHue + (compHueDelta * compHueDir) % 360; // Stick to 360 degrees
	const compSaturation = isGrayscale ? 0 : Math.ceil(remapNumber(Math.random(), 0, 1, 45, 90));
	const compLightness = isGrayscale ? 0 : Math.ceil(remapNumber(Math.random(), 0, 1, 15, 35));
    const color = `#111111`;
    const compColor = `rgba(255,255,255,0)`;
    const angle = `0deg`;

    // Define coordinate system			
    const deg = singleCycleDegrees(angle);
    const degMod = deg % 90;
    const quarterTurns = Math.floor(deg / 90);
    const rad = degreesToRadians(deg);
    const radMod = degreesToRadians(degMod);
    const canvasRotation = (quarterTurns - 1) * Math.PI/2;
	
	// Set custom properties
	document.documentElement.style.setProperty('--risograph-hue', mainHue);
	document.documentElement.style.setProperty('--risograph-grayscale', isGrayscale ? '1' : '0');
	document.documentElement.style.setProperty('--risograph-color', color);
	document.documentElement.style.setProperty('--risograph-comp', compColor);
	document.documentElement.style.setProperty('--risograph-angle', angle);

    // const color = `#111111`;
    // const compColor = `rgba(255,255,255,0)`;
    // const angle = `0deg`;



	// Clear all pixels
	ctx.clearRect(0, 0, width, height);

    // Define the color for all operations
    ctx.fillStyle = color;

    for (let y = 0 ; y < height ; y++) {
        for (let x = 0 ; x < width ; x++) {	
            const randomFactor = round(Math.random(), 6);
            const prog = clamp(pointProgressAlongGradient(x, y, width, height, radMod, quarterTurns), 0, 1);
            const progDelta = 1 - prog;
            const alpha = round(easeValue(randomFactor * progDelta), 6);
			const dotSize = 1; // 1 + Math.floor(Math.random() * 2); // Use uncommented for chunky noise!

            ctx.globalAlpha = alpha;
            ctx.fillRect(x, y, dotSize, dotSize);
        }
    }
};
    if(el){
        generateRisograph();
    }
    
    // document.querySelector('button').addEventListener('click', generateRisograph);
</script>

<div class="opener-wrapper" style="height:{vh*.5}px;">
    <div class="noise"></div>
    <div class="bottom-grad"></div>
    <div class="opener">
        <canvas bind:this={el} class="risograph" width="400" height="400"></canvas>
    </div>
</div>




<style>

    .noise {
        background: url(assets/noise-light.png);
        top: 0;
        left: 0;
        width: 100%;
        position: absolute;
        height: 100%;
        display: none;
        opacity: 0.3;
        z-index: 100000000000;
    }

    .bottom-grad {
        background: linear-gradient(0deg, rgba(25,25,25,.72) 0%, rgba(255,255,255,0) 100%);
        width: 100%;
        height: 50%;
        z-index: 1000000;
        position: absolute;
        bottom: 0;
    }

    .opener-wrapper {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 1000px;
    }
    .opener {
        --body-bg: #161616;
        --box-bg: var(--body-bg);
        --risograph-hue: 0;
        --risograph-grayscale: 0;	
        --risograph-color: #161616;
        --risograph-comp: rgba(255,255,255,0);
        --risograph-angle: 0deg;
        --demo-size: min(75vmin, 400px);
        filter: brightness(.5);
        height: 100%;
        width: 100%;
}

.risograph {
	width: 100%;
	height: 100%;
	background: var(--risograph-comp) linear-gradient(var(--risograph-angle), #161616 30%, #161616 22.5%, 80%, transparent 100%) no-repeat 100% 50% / 100% 100%
}

</style>