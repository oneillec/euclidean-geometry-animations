//
// vivio.js
//
// vivio runtime
//
// Copyright (C) 2015 - 2018 jones@scss.tcd.ie
//
// 25/06/15	initial prototype
// 08/06/16	multiple players in a web page + namespace
// 30/06/16 multiple layers
// 07/07/16 move execute state and code to generated code module
// 11/07/16 added destroy, moveToFront, moveToBack, moveAfter and moveBefore
// 12/09/16 modified callEventHandler execute wait and non-wait functions
// 01/11/16 avoid using default values for parameters as not handled by IE
// 01/11/16 temporary work around for IE as it doesn't implement Path2D
// 03/01/17 contextMenu
// 11/07/17 GRAB
// 12/07/17	Bezier and Spline
// 14/07/17 clipping
// 20/07/17 args and cookies
// 24/07/17 line caps
// 08/08/17 Arc, Bezier, Pie and Spline
// 09/08/17 TxtOffTracker, RoundedTracker
// 05/09/17 brushes
// 07/09/17 pens
// 14/09/17 fonts
// 26/10/17 global event handlers
//

//
// tested with Firefox, Chrome, Opera, IE and Safari
//
// NB: JavaScript default parameter values not uses as not supported by IE
//

"use strict";

function VPlayer(canvasID, VCode, args) {


	// exported Vivio constants

	const VERSION				= "VivioJS 17.11";	// year.month

	const RT					= 0x80000000;		// {joj 6/7/17}

	// colour constants

	const BLACK					= 0xff000000;
	const BLUE					= 0xff0000ff;
	const CYAN					= 0xff00ffff;
	const GRAY32				= 0xff202020;
	const GRAY64				= 0xff404040;
	const GRAY96				= 0xff606060;
	const GRAY128				= 0xff808080;
	const GRAY160				= 0xffa0a0a0;
	const GRAY192				= 0xffc0c0c0;
	const GRAY224				= 0xffe0e0e0;
	const GREEN					= 0xff00ff00;
	const MAGENTA				= 0xffff00ff;
	const RED					= 0xffff0000;
	const WHITE					= 0xffffffff;
	const YELLOW				= 0xffffff00;

	// gobj constants

	const RELATIVE				= 0x00000000;		// relative to previous point
	const ABSOLUTE				= 0x00000001;		// absolute
	const CLOSED				= 0x00000020;		// closed Arc, Bezier or Spline
	const NOATTACH				= 0x00000040;		// NOATTACH
	const PIE					= 0x10000000;		// Pie or Arc {joj 8/8/17}
	const HITINVISIBLE			= 0x20000000;		// {joj 13/7/17}
	const HITWINDOW				= 0x40000000;		// {joj 15/7/17}

	const HCENTRE				= 0x0000;
	const HLEFT					= 0x0100;
	const HRIGHT				= 0x0200;
	const HMASK					= 0x0300
	const VCENTRE				= 0x0000;
	const VTOP					= 0x0400;
	const VBOTTOM				= 0x0800;
	const VMASK					= 0x0c00;

	// pen constants

	const NULLPEN				= 0;				// type
	const SOLIDPEN				= 1;
	const IMAGEPEN				= 2;

	const SOLID                 = 0;				// style
	const DASH                  = 1;
	const DOT                   = 2;
	const DASH_DOT              = 3;
	const DASH_DOT_DOT          = 4;
	const MAX_STYLE				= 4;				// {joj 7/9/17}

	const BUTT_START			= 0;				// {joj 24/7/17}
	const ROUND_START			= 1;
	const SQUARE_START			= 2;
	const ARROW40_START			= 3;
	const ARROW60_START			= 4;
	const ARROW90_START			= 5;
	const CIRCLE_START			= 6;

	const BUTT_END				= 0 << 16;			// {joj 12/9/17}
	const ROUND_END				= 1 << 16;
	const SQUARE_END			= 2 << 16;
	const ARROW40_END			= 3 << 16;
	const ARROW60_END			= 4 << 16;
	const ARROW90_END			= 5 << 16;
	const CIRCLE_END			= 6 << 16;
	const MAX_CAP				= 6;

	const BEVEL_JOIN			= 0 << 8;			// {joj 12/9/17
	const ROUND_JOIN			= 1 << 8
	const MITRE_JOIN			= 2 << 8;
	const MAX_JOIN				= 2;

	// brush constants

	const NULLBRUSH				= 0;				// {joj 5/9/17}
	const SOLIDBRUSH			= 1;				// {joj 5/9/17}
	const IMAGEBRUSH			= 2;				// {joj 5/9/17}
	const GRADIENTBRUSH			= 3;				// {joj 5/9/17}
	const RADIALBRUSH			= 4;				// {joj 5/9/17}

	// font constants

	const BOLD          		= 1;
	const ITALIC        		= 2;
	const UNDERLINE     		= 4;
	const STRIKETHROUGH 		= 8;
	const SMALLCAPS     		= 16;

	// event consants

	const MM					= 0;				// {joj 11/7/17}
	const MB      				= 1;				// {joj 11/7/17}
	const KEY    				= 2;				// {joj 11/7/17}

	const MB_LEFT				= 0x0001;
	const MB_RIGHT      		= 0x0002;
	const MB_MIDDLE    			= 0x0004;
	const MB_SHIFT      		= 0x0010;
	const MB_CTRL       		= 0x0020;
	const MB_ALT				= 0x0040;

	// internal constants

	const INFOFONTH 			= 14;				// info font height
	const NLAYER				= 4;				// max number of layers
	const NMBB					= 4;				// max number of mbbs
	const SST					= 1024;				// default save state ticks

	const TRACKER				= 0;				// tracker event
	const RESUMETHREAD			= 1;				// resume thread event
	const ASYNC					= 2;				// async event

	const PLAY					= 0;				// PLAY mode
	const SINGLESTEP			= 1;				// SINGLESTEP mode
	const SNAPTOCHKPT			= 2;				// SNAPTOCHKPT mode

	const UPDATE				= 1;				// update
	const UPDATEMEMBERS			= 2;				// update group members
	const UPDATEGOBJSLEN		= 4;				// update gobjs length
	const UPDATEGOBJS			= 8;				// update gobjs (gobj deleted or order changed)
	const UPDATEALL				= 16;				// redraw all gobjs or all gobjs on a layer {joj 16/7/17}
	const FIREMOVED				= 1 << 8;			// fire event moved handler

	const REMEMBER				= 1;				// remember event flag
	const PROPAGATE				= 2;				// propagate event flag

	const $EPATH				= 0;				// $E
	const $RPATH				= 1;				// $R

	var layer = [];									// layers
	var nlayer = 0;									// number of layers
	var canvas;										// canvas
	var ctx;										// canvas context
	var inCanvas = 0;								// {joj 16/7/17}

	var overlay = 0;								// overlay canvas for displaying Mbbs
	var overlayCtx = 0;								// overlay context for drawing Mbbs

	var tick = 0;									// animation tick
	var asyncPhase = 0;								// animation phase
	var startTick = 0;								// start tick
	var startTimeStamp;								// start timeStamp
	var tps = 50;									// ticks per second
	var timer = 0;									// animation timer
	var dir = 1;									// -1:backwards 1:forwards
	var infoTipTimer = 0;							//
	var eventQ = 0;									// eventQ
	var asyncEventQ = [];							// asyncEventQ
	var saveEventQ = 0;								// saved event Q
	var playZero = 0;								// play Zero
	var playMode = PLAY;							// play mode
	var lastAsyncEvent = 0;							// last ASYNC event

	var vx;											// viewport x
	var vy;											// viewport y
	var vw;											// viewport width
	var vh;											// viewport height
	var keepAspectRatio;							// viewport keep aspect ratio

	var sx = 1;										// viewport transform
	var sy = 1;										//
	var tx = 0;										//
	var ty = 0;										//
	var t2D = new T2D();							//

	var hit = 0;									//

	var mouseX;										//
	var mouseY;										//
	var contextMenu = 0;							// context menu
	var grab = 0;									//

	var bgBrush = 0;								// background brush
	var bgPen = 0;									// background pen

	var $g = [];									// global variables
	var pens = [];									// pens
	var brushes = [];								// brushes
	var fonts = [];									// fonts
	var vobjs = [];									// vobjs
	var aobjs = [];									// aobjs
	var threads = [];								// threads
	var arg = [];									// arg
	var handler = [];								// global event handlers

	var sst = SST;									// save state every sst ticks (only when going backwards)
	var checkPt = [];								// checkPoints
	var savedState = [];							// saved state
	var atCheckPoint = 0;							// at a checkPoint

	var showStats = 0;								// show Stats
	var showMbbs = 0;								// show Mbbs

	var etStart = 0;								// elapsed time start
	var etf = 0;									// elapsed time forward
	var etb = 0;									// elapsed time backward
	var rtLast = 0;									// run time last frame
	var dtLast = 0;									// draw time last frame
	var nff = 0;									// number of frames forward
	var nfb = 0;									// number of frames backward
	var rtStart = 0;								// run time start
	var rtf = 0;									// run time forward
	var rtb = 0;									// run time backward
	var dtf = 0;									// draw time forward
	var dtb = 0;									// draw time backward

	var isChrome = 0;								// is Chrome
	var isFF = 0;									// is FireFox
	var useSessionStorage = 0;						// use session storage

	var testFlag = 0;								// {joj 28/9/17}

	if (args)										// {joj 20/10/16}
		getArgs();									// get args here {joj 20/10/16}
	getCookies();									// {joj 20/7/17}

	// LayerState constructor
	function LayerState(tick, next) {
		this.tick = tick;	// asyncPhase will be 0
		this.next = next;	// linked list
	}

	//
	// Layer constructor
	//
	// creates a new layer (canvas)
	// zIndex one higher than previous layer
	//
	// the following applies to all animations as even a single layer animation can have an
	// overlay canvas for displaying mbbs.
	//
	// if animation is 100% (fills page), canvas effectively appended as a child of document body
	// if animation not 100% (part of the web page), canvas should be within a <div> element
	// and canvas appended as a child of the <div> element.
	//
	// <div style="position:relative;">
	//   <!-- tabindex needed for keyboard input -->
	//	 <canvas id="canvas" tabindex = "1" style="width:95%; height:500; overflow:hidden; display:block;">
	//	   No canvas support
	//   </canvas>
	// </div>
	//
	function Layer() {
		this.oldMbbs = new Mbbs();					// oldMbbs
		this.mbbs = new Mbbs();						// mbbs
		this.gobjs = [];							// gobjs
		this.savedState = 0;
		this.created = 2*tick + asyncPhase;
		this.lastUpdated = 0;
		this.lastReorder = 0;
		this.opacity = 1;							// {joj 2/10/16}
		this.flags = 0;								// {joj 17/10/16}
		if (nlayer == 0) {
			this.canvas = canvas;
			this.ctx = ctx;
		} else {
			this.canvas = document.createElement("canvas");
			this.canvas.style.width = canvas.style.width;		// this way keeps IE happy
			this.canvas.style.height = canvas.style.height;
			this.canvas.style.position = "absolute";
			this.canvas.style.zIndex = canvas.style.zIndex + nlayer;
			this.canvas.style.pointerEvents = "none";
			this.canvas.style.overflow = "hidden";
			this.canvas.style.display = "block";
			this.canvas.style.left = canvas.offsetLeft + "px";
			this.canvas.style.top = canvas.offsetTop + "px";
			this.canvas.width = canvas.width;
			this.canvas.height = canvas.height;
			canvas.parentNode.appendChild(this.canvas); // expects to append to <body> or <div> element
			this.ctx = this.canvas.getContext("2d");
		}
		layer[nlayer] = this;
		nlayer++;
		//console.log("zIndex=" + layer[nlayer - 1].canvas.style.zIndex);
	}

	// Layer.add
	Layer.prototype.add = function(gobj) {
		this.firstUpdate();
		this.gobjs.push(gobj);
		this.lastUpdate = 2*tick + asyncPhase;
	}

	// Layer.firstUpdate
	Layer.prototype.firstUpdate = function() {
		if (playZero == 0 && this.savedState == 0 && this.created == 0)
			this.save(0);
	}

	// Layer.update
	Layer.prototype.update = function(updFlags) {
		if (updFlags === undefined)
			updFlags = 0;
		this.updated |= (updFlags | UPDATE);
		this.lastUpdate = 2*tick + asyncPhase;
	}

	// Layer.moveToBack
	Layer.prototype.moveToBack = function(gobj) {
		//console.log("moveToBack");
		this.firstUpdate();
		this.gobjs.splice(this.gobjs.indexOf(gobj), 1);	// remove gobj
		this.gobjs.unshift(gobj);						// add to front
		this.lastReorder = 2*tick + asyncPhase;			// remember when gobjs last reordered
	}

	// Layer.moveToFront
	Layer.prototype.moveToFront = function(gobj) {
		//console.log("moveToFront");
		this.firstUpdate();
		this.gobjs.splice(this.gobjs.indexOf(gobj), 1);	// remove gobj
		this.gobjs.push(gobj);							// add to end
		this.lastReorder = 2*tick + asyncPhase;			// remember when gobjs last reordered
	}

	// Layer.save
	Layer.prototype.save = function(saveTick) {
		let b = saveTick == 0 || this.lastUpdate > 2*this.savedState.tick;
		if (b || this.lastReorder > 2*this.savedState.tick) {
			//console.log("Layer.save saveTick=" + saveTick);
			this.savedState = new LayerState(saveTick, this.savedState);
			if (b) {
				this.savedState.gobjs = this.gobjs.slice();	// make a copy
			} else {
				this.savedState.length = this.gobjs.length;
			}
			this.savedState.lastUpdate = this.lastUpdate;
			this.savedState.lastReorder = this.lastReorder;
		}
	}

	// Layer.restore
	Layer.prototype.restore = function(restoreTick) {
		while (this.savedState) {
			if (this.savedState.tick <= restoreTick) {
				if (this.savedState.gobjs) {
					this.gobjs.length = 0;	// reuse gobjs
					for (let i = 0; i < this.savedState.gobjs.length; i++)	// copy each gobj
						this.gobjs[i] = this.savedState.gobjs[i];
				} else {
					this.gobjs.length = this.savedState.length;
				}
				this.lastUpdate = this.savedState.lastUpdate;
				this.lastReorder = this.savedState.lastReorder;
				break;
			}
			this.savedState = this.savedState.next;
		}
	}

	// Layer.setOpacity
	Layer.prototype.setOpacity = function(opacity, nsteps, interval, wait) {
	//console.log("Layer.setOpacity(" + opacity + ")");
		if (nsteps === undefined)
			nsteps = 0;
		if (interval === undefined)
			interval = 1;
		if (wait === undefined)
			wait = 0;
		if ((this.opacity == opacity) && (wait == 0))
			return 0;
		if (nsteps == 0 || interval <= 0) {
			this.firstUpdate();
			//this.canvas.style.visibility = opacity ? "visible" : "hidden";
			this.opacity = opacity;
			this.flags |= UPDATEALL;
			//this.update(UPDATEALL);
			return 0;
		}
		//new OpacityTracker(this, opacity, nsteps, interval, wait);
		return wait;
	}

	// TrackerEvent constructor
	function TrackerEvent(tick, tracker) {
		//console.log("TrackerEvent tick=" + tick);
		this.tick = tick | 0;		// make sure tick is an integer
		this.typ = 0;				// tracker:0 thread:1: async:2
		this.tracker = tracker;
		this.next = 0;
	}

	// Event constructor
	function Event(tick, thread) {
		this.tick = tick | 0;		// make sure tick is an integer
		this.typ = 1;				// tracker:0 thread:1: async:2
		this.thread = thread;
		this.next = 0;
	}

	// AsyncEvent constructor
	function AsyncEvent(tick, handler) {
		//console.log("new AsyncEvent tick=" + tick + " ", handler);
		this.tick = tick | 0;		// make sure tick is an integer
		this.typ = 2;				// tracker:0 thread:1: async:2
		this.handler = handler;
	}

	// addToEventQ
	function addToEventQ(ev) {
		let e = eventQ;
		let ee = 0;
		while (e) {
			if (e.tick > ev.tick || ((e.tick == ev.tick) && (e.typ > ev.typ)))
				break;
			ee = e;
			e = e.next;
		}
		if (ee) {
			ev.next = e;
			ee.next = ev;
		} else {
			ev.next = eventQ;
			eventQ = ev;
		}
	}

	//
	// removeFutureAsyncEvents
	//
	// remove future ASYNC events from eventQ and asyncEventQ
	//
	function removeFutureAsyncEvents() {
		//console.log("removeFutureAsyncEvents");
		let e = eventQ;
		let ee = 0;
		while (e) {
			if ((e.typ == ASYNC) && (e.tick >= tick)) {
				if (ee) {
					ee.next = e.next;
				} else {
					eventQ = e.next;
				}
			} else {
				ee = e;
			}
			e = e.next;
		}
		//console.log("BEFORE asyncEventQ length=" + asyncEventQ.length);
		asyncEventQ.splice(asyncEventQ.indexOf(lastAsyncEvent) + 1);
		//console.log("AFTER asyncEventQ length=" + asyncEventQ.length);
	}

	// addToAsyncEventQ
	function addToAsyncEventQ(e) {
		asyncEventQ.push(e);
		lastAsyncEvent = e;
	}

	//
	// ThreadState constructor
	//
	// a main thread is created initially
	// new threads are created by fork
	// the global variable points to the thread that is currently running
	// the global variable threads contains the list of threads
	// when a thread is executed, its members pc, fp etc are copied to the variables of the same name
	// on thread switch the state is saved in the thread and loaded from the next thread
	// each thread has its own stack
	//
	function ThreadState(next) {
		this.tick = tick;	// asyncPhase will be 0
		this.next = next;	// linked list
	}

	// Thread constructor
	function Thread(pc, obj) {
		//console.log("new Thread");
		if (obj === undefined)
			obj = 0;
		this.pc = pc;
		this.fp = -1;
		this.sp = -1;
		this.acc = obj;
		this.obj = this.acc;
		this.stack = [];
		this.savedState = 0;
		this.created = 2*tick + asyncPhase;
		this.flags = PROPAGATE;		// set by event handlers
		threads.push(this);
	}

	// Thread.save
	Thread.prototype.save = function() {
		this.savedState = new ThreadState(this.savedState);
		this.savedState.pc = this.pc;
		this.savedState.fp = this.fp;
		this.savedState.sp = this.sp;
		this.savedState.acc = this.acc;
		this.savedState.obj = this.obj;
		this.savedState.stack = this.stack.slice(0);			// copy stack
	}

	// Thread.restore
	Thread.prototype.restore = function(toTick) {
		while (this.savedState) {
			if (this.savedState.tick <= toTick) {
				this.pc = this.savedState.pc;
				this.fp = this.savedState.fp;
				this.sp = this.savedState.sp;
				this.acc = this.savedState.acc;
				this.obj = this.savedState.obj;
				this.stack.length = 0;
				for (let i = 0; i < this.savedState.stack.length; i++)	// reuse...
					this.stack[i] = this.savedState.stack[i];			// this.stack
				break;
			}
			this.savedState = this.savedState.next;
		}
	}

	// terminateThread
	function terminateThread(thread) {
		if (savedState && thread.created > 2*savedState.tick)
			threads.splice(threads.indexOf(thread), 1);				// remove thread
	}

	// executeRT
	function executeRT(thread) {									// {joj 6/7/17}
		execute(thread);
		drawChanges();
	}

	// addWaitToEventQ
	function addWaitToEventQ(ticks, thread) {
		if (ticks & RT) {											// {joj 6/7/17} real time event
			setTimeout(executeRT, ticks & ~RT, thread);
		} else {
			addToEventQ(new Event(tick + ticks, thread));
		}
	}

	//
	// callEventHandler(pc, [obj, [args]])
	//
	// pc can be a JavaScript function or the pc of a function in execute
	//
	function callEventHandler(pc, obj) {
		//console.log("callEventHandler pc=", pc, " obj=" + obj);
		if (obj === undefined)
			obj = 0;
		let r = 0;
		if (typeof pc == "function") { 							// {joj 12/9/16}
			let args = [];
			for (let i = 2; i < arguments.length; i++)
				args.push(arguments[i]);
			r = pc.apply(obj, args);
		} else {
			let ehThread = new Thread(pc, obj);					// create new event handler thread
			let l = arguments.length - 1;						// number of arguments
			for (let i = l; i >= 2; i--)						// push parameters...
				ehThread.stack[++ehThread.sp] = arguments[i];	// onto stack
			ehThread.stack[++ehThread.sp] = -1;					// dummy return address used to terminate thread
			execute(ehThread);									// execute thread
			r = ehThread.flags;									// return flags
		}
		playAddedEvents();										// play events added by handler (eg fork) {joj 22/11/17}
		return r;
	}

	// fork(newpc, [obj = 0, [args]])
	function fork(pc, obj) {
		//console.log("fork pc=" + pc);
		if (obj === undefined)
			obj = 0;
		let fThread = new Thread(pc, obj);					// create new thread
		let l = arguments.length - 1;						// get number of arguments
		for (let i = l; i >= 2; i--)						// push parameters...
			fThread.stack[++fThread.sp] = arguments[i];		// onto stack right to left
		fThread.stack[++fThread.sp] = -1;					// dummy return address used to terminate thread
		addToEventQ(new Event(tick, fThread));				// NB: tick
	}

	//
	// Mbb constructor
	//
	// keep normalised
	//	x0 <= x1 and y0 <= y1
	// 	x0, x1, y0, y1 rounded to nearest integer
	//
	function Mbb() {
		if (arguments.length == 1) {			// mbb(mbb1)
			this.x0 = arguments[0].x0;
			this.y0 = arguments[0].y0;
			this.x1 = arguments[0].x1;
			this.y1 = arguments[0].y1;
		} else if (arguments.length == 4) {		// mbb(x0, y0, x1, y1)
			this.x0 = Math.round(arguments[0] <= arguments[2] ? arguments[0] : arguments[2]);
			this.y0 = Math.round(arguments[1] <= arguments[3] ? arguments[1] : arguments[3]);
			this.x1 = Math.round(arguments[0] <= arguments[2] ? arguments[2] : arguments[0]);
			this.y1 = Math.round(arguments[1] <= arguments[3] ? arguments[3] : arguments[1]);
		} else {
			this.x0 = 0;						// mbb()
			this.y0 = 0;
			this.x1 = 0;
			this.y1 = 0;
		}
	}

	// Mbb.add
	Mbb.prototype.add = function() {
		let x0, y0, x1, y1;
		if (arguments.length == 1) {			// mbb.add(mbb1)
			x0 = arguments[0].x0;
			y0 = arguments[0].y0;
			x1 = arguments[0].x1;
			y1 = arguments[0].y1;
		} else if (arguments.length == 4) {		// mbb.add(x0, y0, x1, y1)
			x0 = Math.round(arguments[0] <= arguments[2] ? arguments[0] : arguments[2]);
			y0 = Math.round(arguments[1] <= arguments[3] ? arguments[1] : arguments[3]);
			x1 = Math.round(arguments[0] <= arguments[2] ? arguments[2] : arguments[0]);
			y1 = Math.round(arguments[1] <= arguments[3] ? arguments[3] : arguments[1]);
		}
		if (x0 < this.x0)
			this.x0 = x0;
		if (y0 < this.y0)
			this.y0 = y0;
		if (x1 > this.x1)
			this.x1 = x1;
		if (y1 > this.y1)
			this.y1 = y1;
	}

	// Mbb.addPt
	Mbb.prototype.addPt = function(x, y) {
		if (x < this.x0)
			this.x0 = Math.round(x);
		if (y < this.y0)
			this.y0 = Math.round(y);
		if (x > this.x1)
			this.x1 = Math.round(x);
		if (y > this.y1)
			this.y1 = Math.round(y);
	}

	// Mbb.area
	Mbb.prototype.area = function() {
		return (this.x1 - this.x0) * (this.y1 - this.y0);
	}

	// Mbb.height
	Mbb.prototype.height = function() {
		return this.y1 - this.y0;
	}

	//
	// Mbb.inflate
	//
	// NB: deflate if dx/dy negative
	//
	Mbb.prototype.inflate = function(dx, dy) {
		if (dy === undefined)
			dy = dx;
		this.x0 -= dx;
		this.y0 -= dy;
		this.x1 += dx;
		this.y1 += dy;
		return this;
	}

	// Mbb.isEmpty
	Mbb.prototype.isEmpty = function() {
		return this.x0 == 0 && this.y0 == 0 && this.x1 == 0 && this.y1 == 0;
	}

	// Mbb.set
	Mbb.prototype.set = function() {
		Mbb.apply(this, arguments);
	}

	// Mbb.toString
	Mbb.prototype.toString = function() {
		return "mbb x0=" + this.x0 + " y0=" + this.y0 + " x1=" + this.x1 + " y1=" + this.y1;
	}

	// Mbb.width
	Mbb.prototype.width = function() {
		return this.x1 - this.x0;
	}

	//
	// Mbbs constructor
	//
	// keeps track of upto NMBB areas of screen to be updated
	// mbbs clipped to canvas
	//
	function Mbbs() {
		this.nmbb = 0;
		this.mbb = [];
		for (let i = 0; i < NMBB + 1; i++)		// pre-allocate (for speed?)
			this.mbb[i] = new Mbb();			// extra mbb used by add
		this.mbbu = new Mbb();					// pre-allocate (for speed?)
	}

	// Mbbs.add
	Mbbs.prototype.add = function(mbb) {
		if (mbb.isEmpty())						// quick return if mbb empty
			return;
		this.mbb[this.nmbb].set(mbb);			// copy mbb
		if (this.mbb[this.nmbb].x0 < 0)			// clip mbb to canvas
			this.mbb[this.nmbb].x0 = 0;
		if (this.mbb[this.nmbb].y0 < 0)
			this.mbb[this.nmbb].y0 = 0;
		if (this.mbb[this.nmbb].x1 > canvas.width)
			this.mbb[this.nmbb].x1 = canvas.width;
		let h = (showStats) ? canvas.height - INFOFONTH - 4 : canvas.height;
		if (this.mbb[this.nmbb].y1 > h)
			this.mbb[this.nmbb].y1 = h;
		if (++this.nmbb == 1)					// return if only one mbb
			return;
		let da = Number.MAX_VALUE;
		let index1, index2
		for (let i = 0; i < this.nmbb; i++) {
			for (let j = i + 1; j < this.nmbb; j++) {
				this.mbbu.set(this.mbb[i]);
				this.mbbu.add(this.mbb[j]);
				let da1 = this.mbbu.area() - this.mbb[i].area() - this.mbb[j].area();
				if (da1 < da) {
					da = da1;
					index1 = i;
					index2 = j;
				}
			}
		}
		if (da > 0 && this.nmbb <= NMBB)
			return;
		this.nmbb--;
		this.mbb[index1].add(this.mbb[index2]);
		this.mbb[index2].set(this.mbb[this.nmbb]);
	}

	//
	// Mbbs.draw
	//
	// draw:0 clear draw:1 draw
	// pixel offset of 0.5 so line is drawn anti-aliased (a pixel wide)
	//
	Mbbs.prototype.draw = function(draw) {
		overlayCtx.save();
		if (draw) {
			overlayCtx.strokeStyle = "#808080";
			for (let i = 0; i < this.nmbb; i++)
				overlayCtx.strokeRect(this.mbb[i].x0 + 0.5, this.mbb[i].y0 + 0.5, this.mbb[i].width(), this.mbb[i].height());
		} else {
			for (let i = 0; i < this.nmbb; i++)
				overlayCtx.clearRect(this.mbb[i].x0, this.mbb[i].y0, this.mbb[i].width() + 1, this.mbb[i].height() + 1);

		}
		overlayCtx.restore();
	}

	// Mbbs.overlap
	Mbbs.prototype.overlap = function(mbb) {
		for (let i = 0; i < this.nmbb; i++) {
			if (this.mbb[i].x0 < mbb.x1 && this.mbb[i].x1 > mbb.x0 && this.mbb[i].y0 < mbb.y1 && this.mbb[i].y1 > mbb.y0)
				return 1;
		}
		return 0;
	}

	// Mbbs.toString
	Mbbs.prototype.toString = function() {
		let str = "";
		for (let i = 0; i < this.nmbb; i++)
			str += "Mbbs:" + i + " " + this.mbb[i].toString() + "\n";
		return str;
	}

	// clearMbbs
	function clearMbbs() {
		if (showMbbs) {
			for (let i = 0; i < nlayer; i++)
				layer[i].oldMbbs.draw(0);
		}
	}

	// drawMbbs
	function drawMbbs() {
		if (showMbbs) {
			for (let i = 0; i < nlayer; i++)
				layer[i].oldMbbs.draw(1);
		}
	}

	// swapMbbs
	function swapMbbs(draw) {
		for (let i = 0; i < nlayer; i++) {
			let tmp = layer[i].oldMbbs;
			layer[i].oldMbbs = layer[i].mbbs;
			layer[i].mbbs = tmp;
			layer[i].mbbs.nmbb = 0;
		}
	}

	//
	// createOverlay
	//
	// create ONLY when needed
	// see Layer comments
	//
	function createOverlay() {
		if (overlay == 0) {
			overlay = document.createElement("canvas");
			//overlay.style = "width:" + canvas.style.width + "; height:" + canvas.style.height;
			overlay.style.width = canvas.style.width;		// this way keeps IE happy
			overlay.style.height = canvas.style.height;
			overlay.style.position = "absolute";
			overlay.style.zIndex = canvas.style.zIndex + NLAYER;
			//console.log("overlay zIndex=" + overlay.style.zIndex);
			overlay.style.pointerEvents = "none";
			overlay.style.overflow = "hidden";
			overlay.style.display = "block";
			overlay.style.left = canvas.offsetLeft + "px";
			overlay.style.top = canvas.offsetTop + "px";
			overlay.width = canvas.width;
			overlay.height = canvas.height;
			canvas.parentNode.appendChild(overlay); // expects to append to a <body> or <div> element
			overlayCtx = overlay.getContext("2d");
		}
	}

	// VObjState constructor
	function VObjState(next) {
		this.tick = tick;	// asyncPhase will be 0
		this.next = next;	// linked list
	}

	//
	// VObj constructor
	//
	// savedState property NOT enumerable so it will NOT be saved by VObj.save()
	//
	function VObj() {
		this.created = 2*tick + asyncPhase;
		//this.savedState = 0;
		Object.defineProperty(this, "savedState", {value:0, writable:1});
		vobjs.push(this);
	}

	// VObj.save
	VObj.prototype.save = function() {
		this.savedState = new VObjState(this.savedState);
		for (let prop in this) {
			if (this.hasOwnProperty(prop)) {
				//console.log("VObj.save saving prop=" + prop);
				this.savedState[prop] = this[prop];
			}
		}
	}

	// VObj.restore
	VObj.prototype.restore = function(tick) {
		while (this.savedState) {
			if (this.savedState.tick <= tick) {
				for (let prop in this) {
					if (this.hasOwnProperty(prop)) {
						//console.log("VObj.restore restoring prop=" + prop);
						this[prop] = this.savedState[prop];
					}
				}
				break;
			}
			this.savedState = this.savedState.next;
		}
	}

	//
	// ArrayState constructor
	//
	// decided not to derive from ArrayObj
	// pragmatic approach initially
	//
	function ArrayState(next) {
		this.tick = tick;	// asyncPhase will be 0
		this.next = next;	// linked list
	}

	// newArrayHelper
	function newArrayHelper(a, index, indices) {
		for (let i = 0; i < indices[index]; i++)
			a[i] = new Array(indices[index + 1]);
		if (index == indices.length - 1)
			return;
		for (let i = 0; i < indices[index]; i++)
			newArrayHelper(a[i], index + 1, indices);
	}

	//
	// newArray
	//
	// handles 1 and 2d arrays directly
	// otherwise created recursively using newArrayHelper
	// savedState not enumerable
	//
	function newArray() {
		//console.log("newArray");
		let a = new Array(arguments[0]);
		if (arguments.length > 1) {
			for (let i = 0; i < arguments[0]; i++)
				a[i] = new Array(arguments[1]);
		}
		if (arguments.length > 2)
			for (let i = 0; i < arguments[0]; i++)
				newArrayHelper(a[i], 1, arguments);
		Object.defineProperty(a, "savedState", {value:0, writable:1});	// {joj 5/8/17}
		aobjs.push(a);
		return a;
	}

	// saveArray
	function saveArray(a) {
		//console.log("saveArray() tick=", tick);
		a.savedState = new ArrayState(a.savedState);
		a.savedState.a = a.slice(0);								// copy a
	}

	// restoreArray
	function restoreArray(a, toTick) {
		//console.log("restoreArray toTick=" + toTick);
		while (a.savedState) {
			if (a.savedState.tick <= toTick) {						//
				a.length = 0;										// resuse...
				for (let i = 0; i < a.savedState.a.length; i++)		// a
					a[i] = a.savedState.a[i];						//
				break;
			}
			a.savedState = a.savedState.next;
		}
	}

	// SavedState constructor
	function SavedState() {
		this.tick = tick;											// asyncPhase will be 0
		this.next = savedState;										// linked list
		this.sst = sst;
	}

	// saveState
	function saveState() {
		//console.log("saveState() tick=" + tick);
		savedState = new SavedState();
		savedState.g = $g.slice(0);									// copy globals
		if (playZero == 0) {
			for (let i = 0; i < pens.length; i++)					// save pens
				pens[i].save(tick);
			for (let i = 0; i < brushes.length; i++)				// save brushes
				brushes[i].save(tick);
			for (let i = 0; i < fonts.length; i++)					// save fonts
				fonts[i].save(tick);
			for (let i = 0; i < nlayer; i++) {						// save layers
				let gobjs = layer[i].gobjs;
				for (let j = 0; j < gobjs.length; j++)				// save gobjs
					gobjs[j].save(tick);
				layer[i].save(tick);								// save layer
			}
		}
		for (let i = 0; i < vobjs.length; i++)						// save vobjs
			vobjs[i].save();
		for (let i = 0; i < aobjs.length; i++)						// save aobjs
			saveArray(aobjs[i]);
		savedState.thread = suspendThread();						// save thread and thread state
		for (let i = 0; i < threads.length; i++)					// save threads
			threads[i].save();
		savedState.eventQ = 0;
		let e = eventQ;
		let nee = 0;
		while (e) {
			let ne;
			if (e.typ == TRACKER)	{								// tracker
				ne = new TrackerEvent(e.tick, e.tracker);			// copy and...
				e.tracker.save();									// save TRACKER event
			} else if (e.typ == RESUMETHREAD) {						// copy RESUMETHREAD event
				ne = new Event(e.tick, e.thread);					// CHECK e.thread or thread
			}														// skip async events
			if (nee == 0) {
				savedState.eventQ = ne;
			} else {
				nee.next = ne;
			}
			e = e.next;
			nee = ne;
		}
		savedState.lastAsyncEvent = lastAsyncEvent;
	}

	// restoreState
	function restoreState(restoreTick) {
		while (savedState) {
			if (savedState.tick <= restoreTick)
				break;
			savedState = savedState.next;
		}
		//console.log("restoreState(" + restoreTick + ") from savedState.tick=" + savedState.tick);
		tick = savedState.tick;
		sst = savedState.sst;
		for (let i = 0; i < checkPt.length; i++) {
			if (checkPt[i] > tick) {
				checkPt.splice(i);
				break;
			}
		}
		$g.length = 0;
		for (let i = 0; i < savedState.g.length; i++)			// restore globals
			$g[i] = savedState.g[i];
		for (let i = 0; i < pens.length; i++)					// restore pens
			pens[i].restore(tick);
		for (let i = 0; i < brushes.length; i++)				// restore brushes
			brushes[i].restore(tick);
		for (let i = 0; i < fonts.length; i++)					// restore fonts
			fonts[i].restore(tick);
		for (let i = 0; i < nlayer; i++) {						// restore layers
			let gobjs = layer[i].gobjs;
			for (let j = 0; j < gobjs.length; j++) {			// restore gobjs
				if (gobjs[j].created > 2*tick) {				// if created after tick...
					layer[i].mbbs.add(gobjs[j].mbb);			// add mbb to layer mbbs...
				} else {										// so area of screen cleared...
					gobjs[j].restore();							// otherwise restore gobj
				}
			}
			layer[i].restore(tick);								// restore layer
		}
		for (let i = 0; i < vobjs.length ; i++) {				// restore vobjs
			if (vobjs[i].created > 2*tick) {					// remove vobjs created after tick
				vobjs.splice(i);
				break;
			} else {
				vobjs[i].restore(tick);							// restore vobjs if created on or before tick
			}
		}
		for (let i = 0; i < aobjs.length; i++)					// restore aobjs
			restoreArray(aobjs[i], tick);
		for (let i = threads.length - 1; i >= 0; i--) {			// restore threads
			if (threads[i].created > 2*tick) {					// remove thread created after tick
				threads.splice(i);
				continue;
			}
			threads[i].restore(tick);							// restore threads created on or before tick
		}
		//console.log("restoreB threads.length=" + threads.length);
		resumeThread(savedState.thread);						// resume thread
		eventQ = 0;												// restore eventQ
		let e = savedState.eventQ;
		let nee = 0;
		while (e) {
			let ne = 0;
			if (e.typ == TRACKER) {								// tracker
				//console.log("restore TRACKER event tick=" + e.tick);
				ne = new TrackerEvent(e.tick, e.tracker);
				e.tracker.restore(tick);						// restore tracker event
			} else if (e.typ == RESUMETHREAD) {					// restore RESUMETHREAD event
				//console.log("restore RESUMETHREAD event tick=" + e.tick);
				ne = new Event(e.tick, e.thread);
			}													// skip async events
			if (nee == 0) {
				eventQ = ne;
			} else {
				nee.next = ne;
			}
			nee = ne;
			e = e.next;
		}
		for (let i = 0; i < asyncEventQ.length; i++) {			// process asyncEventQ
			if (asyncEventQ[i].tick >= tick) {					// transfer while >= tick
				addToEventQ(asyncEventQ[i]);					// transfer event from asyncEventQ to eventQ
			}
		}
		lastAsyncEvent = savedState.lastAsyncEvent;
	}

	// TrackerState constructor
	function TrackerState(next) {
		this.tick = tick;	// asyncPhase will be 0
		this.next = next;	// linked list
	}

	//
	// ArcRotateTracker constructor
	//
	// NB: v used to select startAngle (v == 0) or spanAngle (v == 1)
	// NB: nsteps, interval and wait will be defined
	// NB: ddTheta reduces the accumulation of errors
	//
	function ArcRotateTracker(g, v, theta, nsteps, interval, wait) {
		this.g = g;
		this.v = v;
		this.dTheta = theta;
		this.ddTheta = 0;
		this.nsteps = nsteps;
		this.interval = interval;
		this.wait = wait;
		if (wait)
			this.thread = waitTracker();
		this.step = 0;
		this.savedState = 0;
		addToEventQ(new TrackerEvent(tick + this.interval, this));
	}

	// ArcRotateTracker.save
	ArcRotateTracker.prototype.save = function() {
		this.savedState = new TrackerState(this.savedState);
		this.savedState.step = this.step;
		this.savedState.ddTheta = this.ddTheta;
	}

	// ArcRotateTracker.restore
	ArcRotateTracker.prototype.restore = function() {
		while (this.savedState) {
			if (this.savedState.tick <= tick) {
				this.step = this.savedState.step;
				this.ddTheta = this.savedState.ddTheta;
				return;
			}
			this.savedState = this.savedState.next;
		}
	}

	// ArcRotateTracker.action
	ArcRotateTracker.prototype.action = function() {
		this.step++;
		let nddTheta = this.step * this.dTheta / this.nsteps;
		if (nddTheta != this.ddTheta) {
			this.g.firstUpdate();
			if (this.v) {
				this.g.spanAngle += nddTheta - this.ddTheta;
			} else {
				this.g.startAngle += nddTheta - this.ddTheta;
			}
			this.g.update();
			this.ddTheta = nddTheta;
		}
		if (this.step < this.nsteps) {
			addToEventQ(new TrackerEvent(tick + this.interval, this));
		} else if (this.wait) {
			execute(this.thread);
		}
	}

	//
	// RGBATracker constructor
	//
	// NB: nsteps, interval and wait will be valid
	// NB: ddR0 to reduce the accumulation of errors
	//
	function RGBATracker(brush, rgba0, rgba1, nsteps, interval, wait) {
		this.brush = brush;
		this.b = (rgba1 === undefined) ? 0 : 1;
		this.dR0 = (rgba0 >> 16 & 0xff) - (brush.rgba0 >> 16 & 0xff);		// NB: integer
		this.dG0 = (rgba0 >> 8 & 0xff) - (brush.rgba0 >> 8 & 0xff);
		this.dB0 = (rgba0 & 0xff) - (brush.rgba0 & 0xff);
		this.dA0 = (rgba0 >> 24 & 0xff) - (brush.rgba0 >> 24 & 0xff);
		this.ddA0 = 0;
		this.ddR0 = 0;
		this.ddG0 = 0;
		this.ddB0 = 0;
		if (this.b) {
			this.dR1 = (rgba1 >> 16 & 0xff) - (brush.rgba1 >> 16 & 0xff);	// NB: integer
			this.dG1 = (rgba1 >> 8 & 0xff) - (brush.rgba1 >> 8 & 0xff);
			this.dB1 = (rgba1 & 0xff) - (brush.rgba1 & 0xff);
			this.dA1 = (rgba1 >> 24 & 0xff) - (brush.rgba1 >> 24 & 0xff);
			this.ddR1 = 0;
			this.ddG1 = 0;
			this.ddB1 = 0;
			this.ddA1 = 0;
		}
		this.nsteps = nsteps;
		this.interval = interval;
		this.wait = wait;
		if (wait)
			this.thread = waitTracker();
		this.step = 0;
		this.savedState = 0;
		addToEventQ(new TrackerEvent(tick + this.interval, this));
	}

	// RGBATracker.save
	RGBATracker.prototype.save = function() {
		this.savedState = new TrackerState(this.savedState);
		this.savedState.step = this.step;
		this.savedState.ddR0 = this.ddR0;
		this.savedState.ddG0 = this.ddG0;
		this.savedState.ddB0 = this.ddB0;
		this.savedState.ddA0 = this.ddA0;
		if (this.b) {
			this.savedState.ddR1 = this.ddR1;
			this.savedState.ddG1 = this.ddG1;
			this.savedState.ddB1 = this.ddB1;
			this.savedState.ddA1 = this.ddA1;
		}
	}

	// RGBATracker.restore
	RGBATracker.prototype.restore = function() {
		while (this.savedState) {
			if (this.savedState.tick <= tick) {
				this.step = this.savedState.step;
				this.ddR0 = this.savedState.ddR0;
				this.ddG0 = this.savedState.ddG0;
				this.ddB0 = this.savedState.ddB0;
				this.ddA0 = this.savedState.ddA0;
				if (this.b) {
					this.ddR1 = this.savedState.ddR1;
					this.ddG1 = this.savedState.ddG1;
					this.ddB1 = this.savedState.ddB1;
					this.ddA1 = this.savedState.ddA1;
				}
				return;
			}
			this.savedState = this.savedState.next;
		}
	}

	// RGBATracker.action
	RGBATracker.prototype.action = function() {
		this.step++;
		let nddR0 = this.step*this.dR0/this.nsteps | 0;		// NB: integer
		let nddG0 = this.step*this.dG0/this.nsteps | 0;
		let nddB0 = this.step*this.dB0/this.nsteps | 0;
		let nddA0 = this.step*this.dA0/this.nsteps | 0;
		if (this.b) {
			var nddR1 = this.step*this.dR1/this.nsteps | 0;	// NB: var for function scope
			var nddG1 = this.step*this.dG1/this.nsteps | 0;
			var nddB1 = this.step*this.dB1/this.nsteps | 0;
			var nddA1 = this.step*this.dA1/this.nsteps | 0;
		}
		let b0 = (nddR0 != this.ddR0) || (nddG0 != this.ddG0) || (nddB0 != this.ddB0) || (nddA0 != this.ddA0);
		let b1 = this.b && ((nddR1 != this.ddR1) || (nddG1 != this.ddG1) || (nddB1 != this.ddB1) || (nddA1 != this.ddA1));
		if (b0 || b1) {
			this.brush.firstUpdate();
			if (b0) {
				let r = ((this.brush.rgba0 >> 16) & 0xff) + (nddR0 - this.ddR0);
				let g = ((this.brush.rgba0 >> 8) & 0xff) + (nddG0 - this.ddG0);
				let b = (this.brush.rgba0 & 0xff) + (nddB0 - this.ddB0);
				let a = ((this.brush.rgba0 >> 24) & 0xff) + (nddA0 - this.ddA0);
				this.brush.rgba0 = (a << 24) + (r << 16) + (g << 8) + b;
				this.ddR0 = nddR0;
				this.ddG0 = nddG0;
				this.ddB0 = nddB0;
				this.ddA0 = nddA0;
			}
			if (b1) {
				let r = ((this.brush.rgba1 >> 16) & 0xff) + (nddR1 - this.ddR1);
				let g = ((this.brush.rgba1 >> 8) & 0xff) + (nddG1 - this.ddG1);
				let b = (this.brush.rgba1 & 0xff) + (nddB1 - this.ddB1);
				let a = ((this.brush.rgba1 >> 24) & 0xff) + (nddA1 - this.ddA1);
				this.brush.rgba1 = (a << 24) + (r << 16) + (g << 8) + b;
				this.ddR1 = nddR1;
				this.ddG1 = nddG1;
				this.ddB1 = nddB1;
				this.ddA1 = nddA1;
			}
			if (this.brush.type == SOLIDBRUSH) {
				this.brush.fillStyle = toRGBA(this.brush.rgba0);
			} else if (this.brush.type == GRADIENTBRUSH) {
				this.brush.fillStyle = ctx.createLinearGradient(this.brush.x0, this.brush.y0, this.brush.x1, this.brush.y1);	// need to re-create fillStyle
				this.brush.fillStyle.addColorStop(1, toRGBA(this.brush.rgba1));
				this.brush.fillStyle.addColorStop(0, toRGBA(this.brush.rgba0));
			} else {
				this.brush.fillStyle = ctx.createRadialGradient(this.brush.x0, this.brush.y0, this.brush.r0, this.brush.x1, this.brush.y1, this.brush.r1);
				this.brush.fillStyle.addColorStop(0, toRGBA(this.brush.rgba0));
				this.brush.fillStyle.addColorStop(1, toRGBA(this.brush.rgba1));
			}
			this.brush.update();
		}
		if (this.step < this.nsteps) {
			addToEventQ(new TrackerEvent(tick + this.interval, this));
		} else if (this.wait) {
			execute(this.thread);
		}
	}

	//
	// FlashTracker constructor
	//
	// NB: nsteps, interval and wait will be defined
	function FlashTracker(g, pen1, brush1, nsteps, interval, wait) {
		//console.log("new FlashTracker tick=" + tick);
		this.g = g;
		this.pen0 = g.pen;
		this.pen1 = pen1;
		this.brush0 = g.brush;
		this.brush1 = brush1;
		this.nsteps = nsteps;
		this.interval = interval;
		this.wait = wait;
		if (wait)
			this.thread = waitTracker();
		this.step = 0;
		this.savedState = 0;
		addToEventQ(new TrackerEvent(tick + this.interval, this));
	}

	// FlashTracker.save
	FlashTracker.prototype.save = function() {
		this.savedState = new TrackerState(this.savedState);
		this.savedState.step = this.step;
	}

	// FlashTracker.restore
	FlashTracker.prototype.restore = function(tick) {
		while (this.savedState) {
			if (this.savedState.tick <= tick) {
				this.step = this.savedState.step;
				//console.log("FlashTracker restore step=" + this.step);
				return;
			}
			this.savedState = this.savedState.next;
		}
	}

	// FlashTracker.action
	FlashTracker.prototype.action = function() {
		this.step++;
		this.g.firstUpdate();
		this.g.setPen((this.step & 1) ? this.pen1 : this.pen0);			// g.update() called
		this.g.setBrush((this.step & 1) ? this.brush1 : this.brush0);	// g.update() called
		if (this.step < 2*this.nsteps) {
			addToEventQ(new TrackerEvent(tick + this.interval, this));
		} else if (this.wait) {
			//console.log("FlashTracker complete tick=" + tick);
			execute(this.thread);
		}
	}

	//
	// FontSzTracker constructor
	//
	// NB: nsteps, interval and wait will be defined
	// NB: ddSz reduces the accumulation of errors
	function FontSzTracker(font, dsz, nsteps, interval, wait) {
		this.font = font;
		this.dSz = dsz;
		this.ddSz = 0;
		this.nsteps = nsteps;
		this.interval = interval;
		this.wait = wait;
		if (wait)
			this.thread = waitTracker();
		this.step = 0;
		this.savedState = 0;
		addToEventQ(new TrackerEvent(tick + interval, this));
	}

	// FontSzTracker.save
	FontSzTracker.prototype.save = function() {
		this.savedState = new TrackerState(this.savedState);
		this.savedState.step = this.step;
		this.savedState.ddSz = this.ddSz;
	}

	// FontSzTracker.restore
	FontSzTracker.prototype.restore = function(tick) {
		while (this.savedState) {
			if (this.savedState.tick <= tick) {
				this.step = this.savedState.step;
				this.ddSz = this.savedState.ddSz;
				return;
			}
			this.savedState = this.savedState.next;
		}
	}

	// FontSzTracker.action
	FontSzTracker.prototype.action = function() {
		this.step++;
		let nddSz = this.step*this.dSz/this.nsteps;
		if (nddSz != this.ddSz) {
			this.font.firstUpdate();
			this.font.sz += (nddSz - this.ddSz);
			this.font.update();
			this.ddSz = nddSz;
		}
		if (this.step < this.nsteps) {
			addToEventQ(new TrackerEvent(tick + this.interval, this));
		} else if (this.wait) {
			execute(this.thread);
		}
	}

	//
	// OpacityTracker constructor
	//
	// NB: nsteps, interval and wait will be defined
	// NB: ddOpacity reduces the accumulation of errors
	function OpacityTracker(g, opacity, nsteps, interval, wait) {
		//console.log("new OpacityTracker tick=" + tick);
		this.g = g;
		this.dOpacity = opacity - g.opacity;	// relative
		this.ddOpacity = 0;
		this.nsteps = nsteps;
		this.interval = interval;
		this.wait = wait;
		if (wait)
			this.thread = waitTracker();
		this.step = 0;
		this.savedState = 0;
		addToEventQ(new TrackerEvent(tick + this.interval, this));
	}

	// OpacityTracker.save
	OpacityTracker.prototype.save = function() {
		this.savedState = new TrackerState(this.savedState);
		this.savedState.step = this.step;
		this.savedState.ddOpacity = this.ddOpacity
	}

	// OpacityTracker.restore
	OpacityTracker.prototype.restore = function(tick) {
		while (this.savedState) {
			if (this.savedState.tick <= tick) {
				this.step = this.savedState.step;
				this.ddOpacity = this.savedState.ddOpacity;
				return;
			}
			this.savedState = this.savedState.next;
		}
	}

	// OpacityTracker.action
	OpacityTracker.prototype.action = function() {
		this.step++;
		let nddOpacity = this.step * this.dOpacity / this.nsteps;
		//console.log("opacity=" + (this.g.opacity + nddOpacity - this.ddOpacity));
		if (nddOpacity != this.ddOpacity) {
			this.g.firstUpdate();
			this.g.opacity += nddOpacity - this.ddOpacity;
			if (this.g.opacity < 0) {
				this.g.opacity = 0;
			} else if (this.g.opacity > 1) {
				this.g.opacity = 1;
			}
			this.g.update(UPDATEMEMBERS);
			this.ddOpacity = nddOpacity;
		}
		if (this.step < this.nsteps) {
			addToEventQ(new TrackerEvent(tick + this.interval, this));
		} else if (this.wait) {
			//console.log("OpacityTracker complete tick=" + tick);
			execute(this.thread);
		}
	}

	// PenRGBATracker
	//
	// NB: nsteps, interval and wait will be defined
	// NB: ddR, ddG and ddB reduce the accumulation of errors
	//
	function PenRGBATracker(pen, rgba, nsteps, interval, wait) {
		this.pen = pen;
		this.dA = (rgba >> 24 & 0xff) - (pen.rgba >> 24 & 0xff);	// NB: integer
		this.dR = (rgba >> 16 & 0xff) - (pen.rgba >> 16 & 0xff);
		this.dG = (rgba >> 8 & 0xff) - (pen.rgba >> 8 & 0xff);
		this.dB = (rgba & 0xff) - (pen.rgba & 0xff);
		this.ddA = 0;
		this.ddR = 0;
		this.ddG = 0;
		this.ddB = 0;
		this.nsteps = nsteps;
		this.interval = interval;
		this.wait = wait;
		if (wait)
			this.thread = waitTracker();
		this.step = 0;
		this.savedState = 0;
		addToEventQ(new TrackerEvent(tick + this.interval, this));
	}

	// PenRGBATracker.save
	PenRGBATracker.prototype.save = function() {
		this.savedState = new TrackerState(this.savedState);
		this.savedState.step = this.step;
		this.savedState.ddR = this.ddR;
		this.savedState.ddG = this.ddG;
		this.savedState.ddB = this.ddB;
		this.savedState.ddA = this.ddA;

	}

	// PenRGBATracker.restore
	PenRGBATracker.prototype.restore = function(tick) {
		while (this.savedState) {
			if (this.savedState.tick <= tick) {
				this.step = this.savedState.step;
				this.ddR = this.savedState.ddR;
				this.ddG = this.savedState.ddG;
				this.ddB = this.savedState.ddB;
				this.ddA = this.savedState.ddA;
				return;
			}
			this.savedState = this.savedState.next;
		}
	}

	// PenRGBATracker.action
	PenRGBATracker.prototype.action = function() {
		this.step++;
		let nddR = this.step*this.dR/this.nsteps | 0;	// NB: integer
		let nddG = this.step*this.dG/this.nsteps | 0;
		let nddB = this.step*this.dB/this.nsteps | 0;
		let nddA = this.step*this.dA/this.nsteps | 0;
		if ((nddR != this.ddR) || (nddG != this.ddG) || (nddB != this.ddB) || (nddA != this.ddA)) {
			this.pen.firstUpdate();
			let r = ((this.pen.rgba >> 16) & 0xff) + (nddR - this.ddR);
			let g = ((this.pen.rgba >> 8) & 0xff) + (nddG - this.ddG);
			let b = (this.pen.rgba & 0xff) + (nddB - this.ddB);
			let a = ((this.pen.rgba >> 24) & 0xff) + (nddA - this.ddA);
			this.pen.rgba = (a << 24) + (r << 16) + (g << 8) + b;
			this.pen.strokeStyle = toRGBA(this.pen.rgba);
			this.ddR = nddR;
			this.ddG = nddG;
			this.ddB = nddB
			this.ddA = nddA;
			this.pen.update();
		}
		if (this.step < this.nsteps) {
			addToEventQ(new TrackerEvent(tick + this.interval, this));
		} else if (this.wait) {
			execute(this.thread);
		}
	}

	// PenWidthTracker
	//
	// NB: nsteps, interval and wait will be defined
	// NB: ddWidth reduces the accumulation of errors
	//
	function PenWidthTracker(pen, width, nsteps, interval, wait) {
		this.pen = pen;
		this.dWidth = width - pen.width;	// relative
		this.ddWidth = 0;
		this.nsteps = nsteps;
		this.interval = interval;
		this.wait = wait;
		if (wait)
			this.thread = waitTracker();
		this.step = 0;
		this.savedState = 0;
		addToEventQ(new TrackerEvent(tick + this.interval, this));
	}

	// PenWidthTracker.save
	PenWidthTracker.prototype.save = function() {
		this.savedState = new TrackerState(this.savedState);
		this.savedState.step = this.step;
		this.savedState.ddWith = this.ddWidth;
	}

	// PenWidthTracker.restore
	PenWidthTracker.prototype.restore = function(tick) {
		while (this.savedState) {
			if (this.savedState.tick <= tick) {
				this.step = this.savedState.step;
				this.ddWIdth = this.savedState.ddWidth;
				return;
			}
			this.savedState = this.savedState.next;
		}
	}

	// PenWidthTracker.action
	PenWidthTracker.prototype.action = function() {
		this.step++;
		let w = this.dWidth * this.step / this.nsteps;
		if (w != this.ddWidth) {
			this.pen.firstUpdate();
			this.pen.width += (w - this.ddWidth);
			this.pen.update();
			this.ddWidth = w;
		}
		if (this.step < this.nsteps) {
			addToEventQ(new TrackerEvent(tick + this.interval, this));
		} else if (this.wait) {
			execute(this.thread);
		}
	}

	// PointTracker
	//
	// NB: nsteps, interval and wait will be defined
	// NB: ddx and ddy reduce the accumulation of errors
	//
	function PointTracker(g, n, dx, dy, nsteps, interval, wait) {
		this.g = g;
		this.n = n;
		this.dx = dx;
		this.dy = dy;
		this.ddx = 0;
		this.ddy = 0;
		this.nsteps = nsteps;
		this.interval = interval;
		this.wait = wait;
		if (wait)
			this.thread = waitTracker();
		this.step = 0;
		this.savedState = 0;
		addToEventQ(new TrackerEvent(tick + this.interval, this));
	}

	// PointTracker.save
	PointTracker.prototype.save = function() {
		this.savedState = new TrackerState(this.savedState);
		this.savedState.step = this.step;
		this.savedState.ddx = this.ddx;
		this.savedState.ddy = this.ddy;
	}

	// PointTracker.restore
	PointTracker.prototype.restore = function(tick) {
		while (this.savedState) {
			if (this.savedState.tick <= tick) {
				this.step = this.savedState.step;
				this.ddx = this.savedState.ddx;
				this.ddy = this.savedState.ddy;
				return;
			}
			this.savedState = this.savedState.next;
		}
	}

	// PointTracker.action
	PointTracker.prototype.action = function() {
		this.step++;
		let nddx = this.step * this.dx / this.nsteps;
		let nddy = this.step * this.dy / this.nsteps;
		if (nddx || nddy) {
			this.g.firstUpdate();
			this.g.ptx[this.n] += nddx - this.ddx;
			this.g.pty[this.n] += nddy - this.ddy;
			this.g.calculateMinMax();
			this.g.update();
			this.ddx = nddx;
			this.ddy = nddy;
		}
		if (this.step < this.nsteps) {
			addToEventQ(new TrackerEvent(tick + this.interval, this));
		} else if (this.wait) {
			execute(this.thread);
		}
	}

	// RotateTracker
	//
	// NB: nsteps, interval and wait will be defined
	// NB: ddTheta reduces the accumulation of errors
	//
	function RotateTracker(g, dTheta, nsteps, interval, wait) {
		this.g = g;
		this.dTheta = dTheta;
		this.ddTheta = 0;
		this.nsteps = nsteps;
		this.interval = interval;
		this.wait = wait;
		if (wait)
			this.thread = waitTracker();
		this.step = 0;
		this.savedState = 0;
		addToEventQ(new TrackerEvent(tick + this.interval, this));
	}

	// RotateTracker.save
	RotateTracker.prototype.save = function() {
		this.savedState = new TrackerState(this.savedState);
		this.savedState.step = this.step;
		this.savedState.ddTheta = this.ddTheta;
	}

	// RotateTracker.restore
	RotateTracker.prototype.restore = function(tick) {
		while (this.savedState) {
			if (this.savedState.tick <= tick) {
				this.step = this.savedState.step;
				this.ddTheta = this.savedState.ddTheta;
				return;
			}
			this.savedState = this.savedState.next;
		}
	}

	// RotateTracker.action
	RotateTracker.prototype.action = function() {
		this.step++;
		let nddTheta = this.step * this.dTheta / this.nsteps;
		if (nddTheta != this.ddTheta) {
			this.g.firstUpdate();
			this.g.theta += nddTheta - this.ddTheta;
			this.g.setT2D();
			this.g.update(UPDATEMEMBERS);
			this.ddTheta = nddTheta;
		}
		if (this.step < this.nsteps) {
			addToEventQ(new TrackerEvent(tick + this.interval, this));
		} else if (this.wait) {
			execute(this.thread);
		}
	}

	// RoundedTracker
	//
	// NB: nsteps, interval and wait will be defined
	//
	function RoundedTracker(g, rx, ry, nsteps, interval, wait) {
		this.g = g;
		this.dRx = (rx - g.rx) / nsteps;
		this.dRy = (ry - g.ry) / nsteps;
		this.nsteps = nsteps;
		this.interval = interval;
		this.wait = wait;
		if (wait)
			this.thread = waitTracker();
		this.step = 0;
		this.savedState = 0;
		addToEventQ(new TrackerEvent(tick + this.interval, this));
	}

	// RoundedTracker.save
	RoundedTracker.prototype.save = function() {
		this.savedState = new TrackerState(this.savedState);
		this.savedState.dRx = this.dRx;
		this.savedState.dRy = this.dRy;
		this.savedState.step = this.step;
	}

	// RoundedTracker.restore
	RoundedTracker.prototype.restore = function(tick) {
		while (this.savedState) {
			if (this.savedState.tick <= tick) {
				this.dRx = this.savedState.dRx;
				this.dRy = this.savedState.dRy;
				this.step = this.savedState.step;
				return;
			}
			this.savedState = this.savedState.next;
		}
	}

	// RoundedTracker.action
	RoundedTracker.prototype.action = function() {
		this.step++;
		this.g.firstUpdate();
		this.g.rx += this.dRx;
		this.g.ry += this.dRy;
		this.g.update();
		if (this.step < this.nsteps) {
			addToEventQ(new TrackerEvent(tick + this.interval, this));
		} else if (this.wait) {
			execute(this.thread);
		}
	}

	// ScaleTracker
	//
	// NB: nsteps, interval and wait will be defined
	// TODO: reduce the accumulation of errors
	//
	function ScaleTracker(g, sx, sy, nsteps, interval, wait) {
		this.g = g;
		this.sx = sx;
		this.sy = sy;
		this.nsteps = nsteps;
		this.interval = interval;
		this.wait = wait;
		if (wait)
			this.thread = waitTracker();
		this.step = 0;
		this.savedState = 0;
		addToEventQ(new TrackerEvent(tick + this.interval, this));
	}

	// ScaleTracker.save
	ScaleTracker.prototype.save = function() {
		this.savedState = new TrackerState(this.savedState);
		this.savedState.step = this.step;
	}

	// ScaleTracker.restore
	ScaleTracker.prototype.restore = function(tick) {
		while (this.savedState) {
			if (this.savedState.tick <= tick) {
				this.step = this.savedState.step;
				return;
			}
			this.savedState = this.savedState.next;
		}
	}

	// ScaleTracker.action
	ScaleTracker.prototype.action = function() {
		this.step++;
		this.g.firstUpdate();
		this.g.sx *= Math.pow(this.sx, 1/this.nsteps);
		this.g.sy *= Math.pow(this.sy, 1/this.nsteps);
		this.g.setT2D();
		this.g.update(UPDATEMEMBERS);
		if (this.step < this.nsteps) {
			addToEventQ(new TrackerEvent(tick + this.interval, this));
		} else if (this.wait) {
			execute(this.thread);
		}
	}

	// SizeTracker
	//
	// NB: nsteps, interval and wait will be defined
	//
	//function SizeTracker(g, sx, sy, nsteps, interval, wait) {
	//	this.g = g;
	//	this.dsx = (sx - g.sx) / nsteps;
	//	this.dsy = (sy - g.sy) / nsteps;
	//	this.nsteps = nsteps;
	//	this.interval = interval;
	//	this.wait = wait;
	//	if (wait)
	//		this.thread = waitTracker();
	//	this.step = 0;
	//	this.savedState = 0;
	//	addToEventQ(new TrackerEvent(tick + this.interval, this));
	//}

	//SizeTracker.prototype.save = function() {
	//	this.savedState = new TrackerState(this.savedState);
	//	this.savedState.step = this.step;
	//}

	//SizeTracker.prototype.restore = function(tick) {
	//	while (this.savedState) {
	//		if (this.savedState.tick <= tick) {
	//			this.step = this.savedState.step;
	//			return;
	//		}
	//		this.savedState = this.savedState.next;
	//	}
	//}

	//SizeTracker.prototype.action = function() {
	//	this.step++;
	//	this.g.firstUpdate();
	//	this.g.sx += this.dsx;
	//	this.g.sy += this.dsy;
	//	this.g.setT2D();
	//	this.g.update(UPDATEMEMBERS);
	//	if (this.step < this.nsteps) {
	//		addToEventQ(new TrackerEvent(tick + this.interval, this));
	//	} else if (this.wait) {
	//		execute(this.thread);
	//	}
	//}

	// TxtOffTracker
	//
	// NB: nsteps, interval and wait will be defined
	//
	function TxtOffTracker(g, txtOffX, txtOffY, nsteps, interval, wait) {
		this.g = g;
		this.dTxtOffX = (txtOffX - g.txtOffX) / nsteps;
		this.dTxtOffY = (txtOffY - g.txtOffY) / nsteps;
		this.nsteps = nsteps;
		this.interval = interval;
		this.wait = wait;
		if (wait)
			this.thread = waitTracker();
		this.step = 0;
		this.savedState = 0;
		addToEventQ(new TrackerEvent(tick + this.interval, this));
	}

	// TxtOffTracker.save
	TxtOffTracker.prototype.save = function() {
		this.savedState = new TrackerState(this.savedState);
		this.savedState.dTxtOffX = this.dTxtOffX;
		this.savedState.dTxtOffY = this.dTxtOffY;
		this.savedState.step = this.step;
	}

	// TxtOffTracker.restore
	TxtOffTracker.prototype.restore = function(tick) {
		while (this.savedState) {
			if (this.savedState.tick <= tick) {
				this.dTxtOffX = this.savedState.dTxtOffX;
				this.dTxtOffY = this.savedState.dTxtOffY;
				this.step = this.savedState.step;
				return;
			}
			this.savedState = this.savedState.next;
		}
	}

	// TxtOffTracker.action
	TxtOffTracker.prototype.action = function() {
		this.step++;
		this.g.firstUpdate();
		this.g.txtOffX += this.dTxtOffX;
		this.g.txtOffY += this.dTxtOffY;
		this.g.update();
		if (this.step < this.nsteps) {
			addToEventQ(new TrackerEvent(tick + this.interval, this));
		} else if (this.wait) {
			execute(this.thread);
		}
	}

	// TranslateTracker
	//
	// NB: nsteps, interval and wait will be defined
	// NB: ddx and ddy reduce the accumulation of errors
	//
	function TranslateTracker(g, dx, dy, nsteps, interval, wait) {
		//console.log("new TranslateTracker tick=" + tick);
		this.g = g;
		this.dx = dx;
		this.dy = dy;
		this.ddx = 0;
		this.ddy = 0;
		this.nsteps = nsteps;
		this.interval = interval;
		this.wait = wait;
		if (wait)
			this.thread = waitTracker();
		this.step = 0;
		this.savedState = 0;
		addToEventQ(new TrackerEvent(tick + this.interval, this));
	}

	// TranslateTracker.save
	TranslateTracker.prototype.save = function() {
		this.savedState = new TrackerState(this.savedState);
		this.savedState.step = this.step;
		this.savedState.ddx = this.ddx;
		this.savedState.ddy = this.ddy;
	}

	// TranslateTracker.restore
	TranslateTracker.prototype.restore = function(tick) {
		while (this.savedState) {
			if (this.savedState.tick <= tick) {
				this.step = this.savedState.step;
				this.ddx = this.savedState.ddx;
				this.ddy = this.savedState.ddy;
				return;
			}
			this.savedState = this.savedState.next;
		}
	}

	// TranslateTracker.action
	TranslateTracker.prototype.action = function() {
		this.step++;
		let nddx = this.step * this.dx / this.nsteps;
		let nddy = this.step * this.dy / this.nsteps;
		if (nddx || nddy) {
			this.g.firstUpdate();
			this.g.tx += nddx - this.ddx;
			this.g.ty += nddy - this.ddy;
			this.g.setT2D();
			this.g.update(FIREMOVED | UPDATEMEMBERS);
			this.ddx = nddx;
			this.ddy = nddy;
		}
		if (this.step < this.nsteps) {
			addToEventQ(new TrackerEvent(tick + this.interval, this));
		} else if (this.wait) {
			//console.log("TranslateTracker complete tick=" + tick);
			execute(this.thread);
		}
	}

	// TranslatePinTracker
	//
	// NB: nsteps, interval and wait will be defined
	// NB: ddx and ddy reduce the accumulation of errors
	//
	function TranslatePinTracker(g, dx, dy, nsteps, interval, wait) {
		//console.log("new TranslatePinTracker tick=" + tick);
		this.g = g;
		this.dx = dx;
		this.dy = dy;
		this.ddx = 0;
		this.ddy = 0;
		this.nsteps = nsteps;
		this.interval = interval;
		this.wait = wait;
		if (wait)
			this.thread = waitTracker();
		this.step = 0;
		this.savedState = 0;
		addToEventQ(new TrackerEvent(tick + this.interval, this));
	}

	// TranslatePinTracker.save
	TranslatePinTracker.prototype.save = function() {
		this.savedState = new TrackerState(this.savedState);
		this.savedState.step = this.step;
		this.savedState.ddx = this.ddx;
		this.savedState.ddy = this.ddy;
	}

	// TranslatePinTracker.restore
	TranslatePinTracker.prototype.restore = function(tick) {
		while (this.savedState) {
			if (this.savedState.tick <= tick) {
				this.step = this.savedState.step;
				this.ddx = this.savedState.ddx;
				this.ddy = this.savedState.ddy;
				return;
			}
			this.savedState = this.savedState.next;
		}
	}

	// TranslatePinTracker.action
	TranslatePinTracker.prototype.action = function() {
		this.step++;
		let nddx = this.step * this.dx / this.nsteps;
		let nddy = this.step * this.dy / this.nsteps;
		if (nddx || nddy) {
			this.g.firstUpdate();
			this.g.pinx += nddx - this.ddx;
			this.g.piny += nddy - this.ddy;
			this.g.setT2D();
			this.g.update(FIREMOVED | UPDATEMEMBERS);
			this.ddx = nddx;
			this.ddy = nddy;
		}
		if (this.step < this.nsteps) {
			addToEventQ(new TrackerEvent(tick + this.interval, this));
		} else if (this.wait) {
			//console.log("TranslatePinTracker complete tick=" + tick);
			execute(this.thread);
		}
	}

	// PBFState constructor
	//
	// used by Pen, Brush and Font
	//
	function PBFState (tick, next) {
		this.tick = tick;	// asyncPhase will be 0
		this.next = next;	// linked list
	}

	// PBF constructor
	//
	// Pen, Brush and Font "derived from" PBF
	//
	function PBF() {
		// nothing to do
	}

	// PBF.add
	PBF.prototype.add = function(gobj) {
		if (this.gobjs)
			this.gobjs.push(gobj);
	}

	// PBF.remove
	PBF.prototype.remove = function(gobj) {
		if (this.gobjs)
			this.gobjs.splice(this.gobjs.indexOf(gobj), 1);		// gobjs updated in place
	}

	// PBF.save
	PBF.prototype.save = function(tick) {
		if (this.savedState == 0 || this.lastUpdate > this.savedState.tick) {
			this.savedState = new PBFState(tick, this.savedState);
			this.saveState();
		}
	}

	// PBF.restore
	PBF.prototype.restore = function(tick) {
		while (this.savedState) {
			if (this.savedState.tick <= tick) {
				this.restoreState();
				this.gobjs = 0;
				return;
			}
			this.savedState = this.savedState.next;
		}
	}

	// PBF.firstUpdate
	PBF.prototype.firstUpdate = function() {
		if (playZero == 0 && this.savedState == 0 && this.created == 0)
			this.save(0);
	}

	// PBF.updateGObjs
	PBF.prototype.updateGObjs = function(gobj) {
		if (this.match(gobj)) {
			gobj.update();
			this.gobjs.push(gobj);
		}
		if (gobj.gobjs) {
			for (let i = 0; i < gobj.gobjs.length; i++)
				this.updateGObjs(gobj.gobjs[i]);
		}
	}

	// PBF.update
	PBF.prototype.update = function() {
		this.lastUpdate = 2*tick + asyncPhase;
		if (this.gobjs) {
			for (let i = 0; i < this.gobjs.length; i++)
				this.gobjs[i].update();
		} else {
			this.gobjs = [];
			this.updateGObjs($g[0]);
		}
	}

	// Pen constructor
	//
	// This description also applies to Brush and Font.
	//
	// Code is shared by deriving Pen, Brush and Font from PBF.
	//
	// A Pen has a number of properties (eg colour and width). If a Pen property
	// is changed, all GObjs drawn with the Pen must be marked as updated
	// so they will be redrawn. The implementation is optimised on the
	// assumption that the Pen properties normally remain constant. Initially,
	// a Pen doesn't keep a list of gobjs that are drawn using it, but if a Pen
	// property is changed, this list of gobjs is generated dynamically by
	// scanning all GObjs. The gobjs list can then be used thereafter
	// to update the GObjs drawn with the Pen more efficiently. When
	// gobj.setPen is called, the gobj is removed from the the old Pen gobjs
	// list and added to the new Pen gobjs list if they exist.
	//
	// Pen changed is recorded in lastUpdate, so that it can be saved or otherwise
	// Pen is state only saved when first updated.
	//
	function Pen() {
		this.type = NULLPEN;
		this.options =0;
		this.style = 0;
		this.width = 0;
		this.rgba = 0;
		this.url = "";
		this.caps = 0;
		this.ss = 0;
		this.se = 0;
		this.strokeStyle = "";
		this.savedState = 0;
		this.created = 2*tick + asyncPhase;
		this.lastUpdate = 2*tick + asyncPhase;
		this.gobjs = 0;
		pens.push(this);
	}
	Pen.prototype = Object.create(PBF.prototype);

	// NullPen constructor
	function NullPen() {
		Pen.apply(this);
	}
	NullPen.prototype = Object.create(Pen.prototype);

	// SolidPen constructor
	function SolidPen(style, width, rgba, caps, ss, se) {
		Pen.apply(this);
		this.type = SOLIDPEN;
		this.style = (style === undefined) ? 0 : style;
		this.width = (width === undefined) ? 1 : width;
		this.rgba = (rgba === undefined) ? BLACK : rgba;
		this.caps = (caps === undefined) ? 0 : caps;
		this.ss = (ss === undefined) ? 2 : ss;
		this.se = (se === undefined) ? 2 : se;
		this.strokeStyle = toRGBA(this.rgba);
	}
	SolidPen.prototype = Object.create(Pen.prototype);

	// penPatternLoaded
	//
	// handles the asychronous loading of brush patterns
	//
	function penPatternLoaded() {
		//console.log("penPatternLoaded loaded");
		if (this.pen.type == IMAGEPEN) {	//  make sure brush type hasn't changed before image loaded
			this.pen.strokeStyle = ctx.createPattern(this, "repeat");
			this.pen.update();	// update objects drawn with brush
			asyncPhase = 1;
			drawChanges();		// clears asyncPhase {joj 28/11/17}
		}
	}

	// ImagePen constructor
	function ImagePen(options, style, width, url, caps, ss, se) {
		Pen.apply(this);
		this.type = IMAGEPEN;
		this.options = options;
		this.style = style;
		this.width = width;
		this.rgba = 0;
		this.url = url;
		this.caps = (caps === undefined) ? 0 : caps;
		this.ss = (ss === undefined) ? 2 : ss; 			// startCapScale
		this.se = (se === undefined) ? 2 : se;			// endCapScale
		this.image = new window.Image();
		this.image.pen = this;
		this.image.onload = penPatternLoaded;
		this.image.src = url;
	}
	ImagePen.prototype = Object.create(Pen.prototype);

	// Pen.setNull
	Pen.prototype.setNull = function() {
		if (this.type != NULLPEN) {
			this.firstUpdate();
			this.type = NULLPEN;
			this.options = 0;
			this.style = 0;
			this.width = 0;
			this.rgba = 0;
			this.url = "";
			this.caps = 0;
			this.ss = 0;
			this.se = 0;
			this.update();
		}
		return this;
	}

	// Pen.setSolid
	Pen.prototype.setSolid = function(style, width, rgba, caps, ss, se) {
		style = (style === undefined) ? 0 : style > MAX_STYLE ? 0 : style;
		width = (width === undefined) ? 1 : width;
		rgba = (rgba === undefined) ? 0 : rgba;
		caps = (caps === undefined) ? 0 : caps;
		ss = (ss === undefined) ? 2 : ss;
		se = (se === undefined) ? 2 : se;
		if ((this.type != SOLIDPEN) || (this.style != style) || (this.width != width) || (this.rgba != rgba) || (this.caps != caps) || (this.ss != ss) || (this.se != se)) {
			this.firstUpdate();
			this.type = SOLIDPEN;
			this.options = 0;
			this.style = style;
			this.width = width;
			this.rgba = rgba;
			this.url = "";
			this.caps = caps;
			this.ss = ss;
			this.se = se;
			this.update();
		}
		return this;
	}

	// Pen.setImage
	Pen.prototype.setImage = function(options, style, width, url, caps, ss, se) {
		caps = (caps === undefined) ? 0 : caps;
		ss = (ss === undefined) ? 2 : ss;
		se = (se === undefined) ? 2 : se;
		if ((this.type != IMAGEPEN) || (this.options != options) || (this.style != style) || (this.width != width) || (this.url != url) || (this.caps != caps) || (this.ss != ss) || (this.se != se)) {
			this.firstUpdate();
			this.type = IMAGEPEN;
			this.options = options;
			this.style = style;
			this.width = width;
			this.rgba = 0;
			this.url = url;
			this.caps = caps;
			this.ss = ss;
			this.se = se;
			this.update();
		}
		return this;
	}

	// Pen.saveState
	Pen.prototype.saveState = function() {
		this.savedState.type = this.type;
		this.savedState.options = this.options;
		this.savedState.style = this.style;
		this.savedState.width = this.width;
		this.savedState.rgba = this.rgba;
		this.savedState.url = this.url;
		this.savedState.caps = this.caps;
		this.savedState.startCapScale = this.startCapScale;
		this.savedState.endCapScale = this.endCapScale;
	}

	// Pen.restoreState
	Pen.prototype.restoreState = function() {
		this.type = this.savedState.type;
		this.options = this.savedState.options;
		this.style = this.savedState.style;
		this.width = this.savedState.width;
		this.rgba = this.savedState.rgba;
		this.url = this.savedState.url;
		this.caps = this.savedState.caps;
		this.startCapScale = this.savedState.startCapScale;
		this.endCapScale = this.savedState.endCapScale;
	}

	// Pen.getType
	Pen.prototype.getType = function() { return this.type }

	// Pen.getOptions
	Pen.prototype.getOptions = function() { return this.options }

	// Pen.getStyle
	Pen.prototype.getStyle = function() { return this.style }

	// Pen.getWidth
	Pen.prototype.getWidth = function() { return this.width }

	// Pen.getRGBA
	Pen.prototype.getRGBA = function() { return this.rgba }

	// Pen.getURL
	Pen.prototype.getURL = function() { return this.url }

	// Pen.getCaps
	Pen.prototype.getCaps = function() { return this.caps }

	// Pen.getStartCapScale
	Pen.prototype.getStartCapScale = function() { return this.ss }

	// Pen.getEndCapScale
	Pen.prototype.getEndCapScale = function() { return this.se }

	// Pen.match helper
	Pen.prototype.match = function(gobj) { return gobj.pen == this }

	// Pen.setWidth
	Pen.prototype.setWidth = function(width, nsteps, interval, wait) {
		if (nsteps === undefined)
			nsteps = 0;
		if (interval === undefined)
			interval = 1;
		if (wait === undefined)
			wait = 0;
		if ((this.width == width) && (wait == 0))
			return 0;
		if (nsteps == 0 || interval <= 0) {
			this.firstUpdate();
			this.width = width;
			this.update();
			return 0;
		}
		new PenWidthTracker(this, width, nsteps, interval, wait);
		return wait;
	}

	// Pen.setRGBA
	Pen.prototype.setRGBA = function(rgba, nsteps, interval, wait) {
		if (this.type != SOLIDPEN)
			return 0;
		if (nsteps === undefined)
			nsteps = 0;
		if (interval === undefined)
			interval = 1;
		if (wait === undefined)
			wait = 0;
		if ((this.rgba == rgba) && (wait == 0))
			return 0;
		if (nsteps == 0 || interval <= 0) {
			this.firstUpdate();
			this.rgba = rgba;
			this.strokeStyle = toRGBA(rgba);
			this.update();
			return 0;
		}
		new PenRGBATracker(this, rgba, nsteps, interval, wait);
		return wait;
	}

	var defaultPen = new SolidPen();

	// Brush constructor
	function Brush() {
		this.type = NULLBRUSH;
		this.options = 0;
		this.rgba0 = 0;
		this.rgba1 = 0;
		this.url = "";
		this.x0 = 0;
		this.y0 = 0;
		this.r0 = 0;
		this.x1 = 0;
		this.y1 = 0;
		this.r1 = 0;
		this.fillStyle = "";
		this.savedState = 0;
		this.created = 2*tick + asyncPhase;
		this.updated = 1;
		this.lastUpdate = 2*tick + asyncPhase;
		this.gobjs = 0;
		brushes.push(this);
	}
	Brush.prototype = Object.create(PBF.prototype);

	// NullBrush constructor
	function NullBrush() {
		Brush.apply(this);
	}
	NullBrush.prototype = Object.create(Brush.prototype);

	// SolidBrush constructor
	function SolidBrush(rgba) {
		Brush.apply(this);
		this.type = SOLIDBRUSH;
		this.rgba0 = rgba || 0;
		this.fillStyle = toRGBA(this.rgba0);
	}
	SolidBrush.prototype = Object.create(Brush.prototype);

	// ImageBrush constructor
	function ImageBrush(options, url) {
		Brush.apply(this);
		this.type = IMAGEBRUSH;
		this.options = options;
		this.url = url;
		this.image = new window.Image();
		this.image.patternBrush = this;
		this.image.onload = brushPatternLoaded;
		this.image.src = url;
	}
	ImageBrush.prototype = Object.create(Brush.prototype);

	// GradientBrush constructor
	function GradientBrush(options, x0, y0, x1, y1, rgba0, rgba1) {
		Brush.apply(this);
		this.type = GRADIENTBRUSH;
		this.options = options;
		this.x0 = x0;
		this.y0 = y0;
		this.x1 = x1;
		this.y1 = y1;
		this.rgba0 = rgba0;
		this.rgba1 = rgba1;
		this.fillStyle = ctx.createLinearGradient(x0, y0, x1, y1);
		this.fillStyle.addColorStop(0, toRGBA(rgba0));
		this.fillStyle.addColorStop(1, toRGBA(rgba1));
	}
	GradientBrush.prototype = Object.create(Brush.prototype);

	// RadialBrush constructor
	function RadialBrush(options, x0, y0, r0, x1, y1, r1, rgba0, rgba1) {
		Brush.apply(this);
		this.type = RADIALBRUSH;
		this.options = options;
		this.x0 = x0;
		this.y0 = y0;
		this.r0 = r0;
		this.x1 = x1;
		this.y1 = y1;
		this.r1 = r1;
		this.rgba0 = rgba0;
		this.rgba1 = rgba1;
		this.fillStyle = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
		this.fillStyle.addColorStop(0, toRGBA(rgba0));
		this.fillStyle.addColorStop(1, toRGBA(rgba1));
	}
	RadialBrush.prototype = Object.create(Brush.prototype);

	// Brush.setNull
	Brush.prototype.setNull = function() {
		if (this.type != NULLBRUSH) {
			this.firstUpdate();
			this.type = NULLBRUSH;
			this.options = 0;
			this.rgba0 = 0;
			this.rgba1 = 0;
			this.url = "";
			this.x0 = 0;
			this.y0 = 0;
			this.r0 = 0;
			this.x1 = 0;
			this.y1 = 0;
			this.r1 = 0;
			this.fillStyle = toRGBA(this.rgba0);
			this.update();
		}
		return this
	}

	// Brush.setSolid
	Brush.prototype.setSolid = function(rgba) {
		if ((this.type != SOLIDBRUSH) || (this.rgba0 != rgba)) {
			this.firstUpdate();
			this.type = SOLIDBRUSH;
			this.options = 0;
			this.rgba0 = rgba;
			this.rgba1 = 0;
			this.url = "";
			this.x0 = 0;
			this.y0 = 0;
			this.r0 = 0;
			this.x1 = 0;
			this.y1 = 0;
			this.r1 = 0;
			this.fillStyle = toRGBA(rgba);
			this.update();
		}
		return this
	}

	// Brush.setImage
	Brush.prototype.setImage = function(options, url) {
		if ((this.type != IMAGEBRUSH) || (this.options != options) || (this.url != url)) {
			this.firstUpdate();
			this.type = IMAGEBRUSH;
			this.options = options;
			this.rgba0 = 0;
			this.rgba1 = 0;
			this.url = url;
			this.x0 = 0;
			this.y0 = 0;
			this.r0 = 0;
			this.x1 = 0;
			this.y1 = 0;
			this.r1 = 0;
			this.image = new window.Image();
			this.image.patternBrush = this;
			this.image.onload = brushPatternLoaded;
			this.image.src = url;
		}
		return this
	}

	// Brush.setGradient
	Brush.prototype.setGradient = function(options, x0, y0, x1, y1, rgba0, rgba1) {
		if ((this.type != GRADIENTBRUSH) || (this.options != options) || (this.x0 != x0) || (this.y0 != y0) || (this.x1 != x1) || (this.y1 != y1) || (this.rgba0 != rgba0) || (this.rgba1 != rgba1)) {
			this.firstUpdate();
			this.type = GRADIENTBRUSH;
			this.options = options;
			this.rgba0 = rgba0;
			this.rgba1 = rgba1;
			this.url = "";
			this.x0 = x0;
			this.y0 = y0;
			this.r0 = 0;
			this.x1 = x1;
			this.y1 = y1;
			this.r1 = 0;
			this.fillStyle = ctx.createLinearGradient(x0, y0, x1, y1);
			this.fillStyle.addColorStop(0, toRGBA(rgba0));
			this.fillStyle.addColorStop(1, toRGBA(rgba1));
			this.update();
		}
		return this
	}

	// Brush.setRadial
	Brush.prototype.setRadial = function(options, x0, y0, r0, x1, y1, r1, rgba0, rgba1) {
		if ((this.type != GRADIENTBRUSH) || (this.options != options) || (this.x0 != x0) || (this.y0 != y0) || (this.r0 != r0) || (this.x1 != x1)|| (this.y1 != y1) || (this.r1 != r1) || (this.rgba0 != rgba0) || (this.rgba1 != rgba1)) {
			this.firstUpdate();
			this.type = RADIALBRUSH;
			this.options = options;
			this.rgba0 = rgba0;
			this.rgba1 = rgba1;
			this.url = "";
			this.x0 = x0;
			this.y0 = y0;
			this.r0 = r0;
			this.x1 = x1;
			this.y1 = y1;
			this.r1 = r1;
			this.fillStyle = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
			this.fillStyle.addColorStop(0, toRGBA(rgba0));
			this.fillStyle.addColorStop(1, toRGBA(rgba1));
			this.update();
		}
		return this
	}

	// Brush.getType
	Brush.prototype.getType = function() { return this.type }

	// Brush.getRGBA
	Brush.prototype.getRGBA = function() { return this.rgba0 }

	// Brush.getOptions
	Brush.prototype.getOptions = function() { return this.options }

	// Brush.getURL
	Brush.prototype.getURL = function() { return this.url }

	// Brush.getX0
	Brush.prototype.getX0 = function() { return this.x0 }

	// Brush.getY0
	Brush.prototype.getY0 = function() { return this.y0 }

	// Brush.getR0
	Brush.prototype.getR0 = function() { return this.r0 }

	// Brush.getX1
	Brush.prototype.getX1 = function() { return this.x1 }

	// Brush.getY1
	Brush.prototype.getY1 = function() { return this.y1 }

	// Brush.getR1
	Brush.prototype.getR1 = function() { return this.r1 }

	// Brush.getRGBA0
	Brush.prototype.getRGBA0 = function() { return this.rgba0 }

	// Brush.getRGBA1
	Brush.prototype.getRGBA1 = function() { return this.rgba1 }

	// Brush.match helper
	Brush.prototype.match = function(gobj) { return gobj.brush === this }

	// Brush.saveState
	Brush.prototype.saveState = function() {
		this.savedState.type = this.type;
		this.savedState.options = this.options;
		this.savedState.rgba0 = this.rgba0;
		this.savedState.rgba0 = this.rgba1;
		this.savedState.url = this.url;
		this.savedState.x0 = this.x0;
		this.savedState.y0 = this.y0;
		this.savedState.r0 = this.r0;
		this.savedState.x1 = this.x1;
		this.savedState.y1 = this.y1;
		this.savedState.r1 = this.r1;
		this.savedState.fillStyle = this.fillStyle;
	}

	// Brush.restoreState
	Brush.prototype.restoreState = function() {
		this.type = this.savedState.type;
		this.options = this.savedState.options;
		this.rgba0 = this.savedState.rgba0;
		this.rgba1 = this.savedState.rgba1;
		this.url = this.savedState.url;
		this.x0 = this.savedState.x0;
		this.y0 = this.savedState.y0;
		this.r0 = this.savedState.r0;
		this.x1 = this.savedState.x1;
		this.y1 = this.savedState.y1;
		this.r1 = this.savedState.r1;
		this.fillStyle = this.savedState.fillStyle;
	}

	// Brush.setRGBA
	Brush.prototype.setRGBA = function(rgba, nsteps, interval, wait) {
		return this.setRGBA2(rgba, undefined, nsteps, interval, wait);
	}

	// Brush.setRGBA2
	Brush.prototype.setRGBA2 = function(rgba0, rgba1, nsteps, interval, wait) {
		if ((this.type != SOLIDBRUSH) && (this.type != GRADIENTBRUSH) && (this.type != RADIALBRUSH))
			return 0;
		if ((this.type == SOLIDBRUSH) && (this.rgba0 == rgba))
			return 0;
		if (((this.type == GRADIENTBRUSH) || (this.type == RADIALBRUSH)) && (this.rgba0 == rgba0) && (this.rgba1 == rgba1))
			return 0;
		if (nsteps === undefined)
			nsteps = 0;
		if (interval === undefined)
			interval = 1;
		if (wait === undefined)
			wait = 0;
		if (nsteps == 0 || interval <= 0) {
			this.firstUpdate();
			this.rgba0 = rgba0;
			this.rgba1 = rgba1
			this.update();
			return 0;
		}
		new RGBATracker(this, rgba0, rgba1, nsteps, interval, wait);
		return wait;
	}

	// brushPatternLoaded
	//
	// handles the asychronous loading of brush patterns
	// set asyncPhase to
	//
	function brushPatternLoaded() {
		//console.log("brushPatternLoaded loaded");
		if (this.patternBrush.type == IMAGEBRUSH) {	//  make sure brush type hasn't changed before image loaded
			this.patternBrush.fillStyle = ctx.createPattern(this, "repeat");
			this.patternBrush.update();	// update objects drawn with brush
			asyncPhase = 1;
			drawChanges();				// clears asyncPhase {joj 28/11/17}
		}
	}

	// Font constructor
	function Font(face, sz, flags) {
		this.face = face;
		this.sz = sz;
		this.flags = flags || 0;
		this.savedState = 0;
		this.created = 2*tick + asyncPhase;
		this.updated = 1;
		this.lastUpdate = 2*tick + asyncPhase;
		this.gobjs = 0;
		fonts.push(this);
	}
	Font.prototype = Object.create(PBF.prototype);

	// Font.getFace
	Font.prototype.getFace = function() { return this.face }

	// Font.getSz
	Font.prototype.getSz = function() { return this.sz }

	// Font.getFlags
	Font.prototype.getFlags = function() { return this.flags }

	// Font.match
	Font.prototype.match = function(gobj) {
		return gobj.font == this;
	}

	// Font.saveState
	Font.prototype.saveState = function() {
		this.savedState.sz = this.sz;
	}

	// Font.restoreState
	Font.prototype.restoreState = function() {
		this.sz = this.savedState.sz;
	}

	// Font.setFont
	Font.prototype.setFont = function(face, sz, flags) {
		flags = flags || 0;
		if ((this.face != face) || (this.sz != sz) ||(this.flags != flags)) {
			this.firstUpdate();
			this.face = face;
			this.sz = sz;
			this.flags = flags;
			this.update();
		}
		return this;
	}

	// Font.setSz
	Font.prototype.setSz = function(sz, nsteps, interval, wait) {
		if (nsteps === undefined)
			nsteps = 0;
		if (interval === undefined)
			interval = 1;
		if (wait === undefined)
			wait = 0;
		if ((this.sz == sz) && (wait == 0))
			return 0;
		if (nsteps == 0 || interval <= 0) {
			this.firstUpdate();
			this.sz = sz;
			this.update();
			return 0;
		}
		new FontSzTracker(this, sz - this.sz, nsteps, interval, wait);
		return wait;
	}

	// Font.toString
	//
	// canvas fonts do not support UNDERLINE and STRIKETHROUGH (handled in drawTxt)
	//
	Font.prototype.toString = function() {
		let s = "";
		if (this.flags & BOLD)
			s += "bold";
		if (this.flags & ITALIC)
			s += s.length ? " italic" : "italic";
		if (this.flags & SMALLCAPS)
			s += s.length ? " small-caps" : "small-caps";
		s += (s.length ? " " : "") + this.sz + "px " + this.face;
		//console.log("font=" + s);
		return s;
	}

	var defaultFont = new Font("Calibri", 24);	// default font

	// GObjState constructor
	function GObjState(tick, next) {
		this.tick = tick;	// asyncPhase will be 0
		this.next = next;	// linked list
	}

	// GObj constructor
	function GObj() {
		// nothing to do
	}

	// GObj.addEventHandler
	GObj.prototype.addEventHandler = function(e, obj, pc) {
		//console.log("GObj.addEventHandler("  + e + ", " + obj + ", " + pc + ")");
		if (this.handler[e] == undefined)
			this.handler[e] = [];
		this.handler[e].push({"obj": obj, "pc": pc});
	}

	// GObj.attachTo
	GObj.prototype.attachTo = function(grp) {
		console.log("GObj.attachTo()");
		grp.add(this);	// TODO remove from group, if in one,  first
	}

	// GObj.calculateMinMax
	GObj.prototype.calculateMinMax = function() {
		this.minx = this.miny = Number.MAX_VALUE;
		this.maxx = this.maxy = Number.MIN_VALUE;
		for (let i = 0; i < this.ptx.length; i++) {
			if (this.ptx[i] < this.minx)
				this.minx = this.ptx[i];
			if (this.pty[i] < this.miny)
				this.miny = this.pty[i];
			if (this.ptx[i] > this.maxx)
				this.maxx = this.ptx[i];
			if (this.pty[i] > this.maxy)
				this.maxy = this.pty[i];
		}
	}

	// GObj.drawTxt helper
	//
	// code accounts for the different vertical positioning of text by different browsers
	// this.drawOpacity > 0
	// handle UNDERLINE and STRIKETHROUGH as not supported by canvas fonts
	//
	GObj.prototype.drawTxt = function(ctx) {
		if (this.txt.length && this.txtPen && this.font) {
			let maxw = 0, x, y;
			let hoptions = this.options & HMASK;
			let voptions = this.options & VMASK;
			let txt = this.txt.split("\n");
			let len = Array();
			ctx.font = this.font.toString();
			for (let i = 0; i < txt.length; i++) {
				len[i] = ctx.measureText(txt[i]).width + 1;
				maxw = Math.max(len[i], maxw);
			}
			let h = this.font.sz * txt.length;
			//ctx.globalAlpha = this.opacity;
			ctx.fillStyle = toRGBA(this.txtPen.rgba);
			if (hoptions == HLEFT) {
				ctx.textAlign = "left";
				x = this.minx;
			} else if (hoptions == HRIGHT) {
				ctx.textAlign = "right";
				x = this.maxx;
			} else {
				ctx.textAlign = "center"
				x = (this.minx + this.maxx)/2;
			}
			ctx.textBaseline = "middle";	// browers agree on middle
			if (voptions == VTOP) {
				y = this.miny;
			} else if (voptions == VBOTTOM) {
				y = this.maxy - h;
			} else {
				y = (this.miny + this.maxy)/2 - h/2;
			}
			if (this.txtOffX)
				x += this.txtOffX;
			if (this.txtOffY)
				y += this.txtOffY;
			for (let i = 0; i < txt.length; i++, y += this.font.sz) {
				ctx.fillText(txt[i], x, y + this.font.sz/2);
				if (this.font.options & (UNDERLINE | STRIKETHROUGH)) {
					let xx = x;
					if (hoptions == HCENTRE) {
						xx -= len[i] / 2;
					} else if (hoptions == HRIGHT) {
						xx -= len[i];
					}
					ctx.save();
					ctx.lineWidth = 0;
					ctx.beginPath();
					if (this.font.options & UNDERLINE) {
						let yy = y + this.font.sz;
						ctx.moveTo(xx, yy);
						ctx.lineTo(xx + len[i], yy);
					}
					if (this.font.options & STRIKETHROUGH) {
						let yy = y + this.font.sz/2;
						ctx.moveTo(xx, yy);
						ctx.lineTo(xx + len[i], yy);
					}
					ctx.stroke();
					ctx.restore();
				}
			}
		}
	}

	// GObj.firstUpdate
	GObj.prototype.firstUpdate = function() {
		if (playZero == 0 && this.savedState == 0 && this.created == 0)
			this.save(0);
	}

	// GObj.flash
	GObj.prototype.flash = function(pen1, brush1, nsteps, interval, wait) {
		if (nsteps === undefined)
			nsteps = 0;
		if (interval === undefined)
			interval = 1;
		if (wait === undefined)
			wait = 0;
		if (nsteps == 0 || interval <= 0)
			return 0;
		new FlashTracker(this, pen1, brush1, nsteps, interval, wait);
		return wait;
	}

	// GObj.getBrush
	GObj.prototype.getBrush = function() { return this.brush }

	// GObj.getFont
	GObj.prototype.getFont = function() { return this.font }

	// GObj.getIH
	GObj.prototype.getIH = function() { return this.maxy - this.miny }

	// GObj.getIW
	GObj.prototype.getIW = function() { return this.maxx - this.minx }

	// GObj.getIX
	GObj.prototype.getIX = function() { return this.minx }

	// GObj.getIY
	GObj.prototype.getIY = function() { return this.miny }

	// GObj.getLayer
	GObj.prototype.getLayer = function() { return this.layer }

	// GObj.getOpacity
	GObj.prototype.getOpacity = function() { return this.opacity }

	// GObj.getOptions
	GObj.prototype.getOptions = function() { return this.options }

	// GObj.getPen
	GObj.prototype.getPen = function() { return this.pen }

	//GObj.getPinX
	GObj.prototype.getPinX = function() { return this.pinx }

	// GObj.getPinY
	GObj.prototype.getPinY = function() { return this.piny }

	// GObj.getTheta
	GObj.prototype.getTheta = function() { return this.theta }

	// GObj.getTxt
	GObj.prototype.getTxt = function() { return this.txt }

	// GObj.getTxtOffX
	GObj.prototype.getTxtOffX = function() { return this.txtOffX }

	// GObj.getTxtOffY
	GObj.prototype.getTxtOffY = function() { return this.txtOffY }

	// GObj.getTxtPen
	GObj.prototype.getTxtPen = function() { return this.txtPen }

	// GObj.getW
	GObj.prototype.getW = function() { return this.maxx - this.minx }

	// GObj.getX
	GObj.prototype.getX = function() { return this.tx }

	// GObj.getY
	GObj.prototype.getY = function() { return this.ty }

	// GObj.grab
	GObj.prototype.grab = function() {
		//console.log("GRAB");
		grab = this;
	}

	// GObj.moveAfter
	GObj.prototype.moveAfter = function(gobj) {
		console.log("moveAfter");
	}

	// GObj.moveToBack
	//
	// reorder layer gobjs, NO need to reorder grp gobjs
	//
	GObj.prototype.moveToBack = function() {
		this.layer.moveToBack(this);			// reorder layer gobjs
		this.update();							// make sure gobj redrawn
	}

	// GObj.moveBefore
	GObj.prototype.moveBefore = function(gobj) {
		console.log("moveBefore");
	}

	// GObj.moveToFront
	//
	// reorder layer gobjs, NO need to reorder grp gobjs
	//
	GObj.prototype.moveToFront = function() {
		this.layer.moveToFront(this);			// reorder layer gobjs
		this.update();							// make sure gobj redrawn
	}

	// GObj.restore
	GObj.prototype.restore = function() {
		this.updated = UPDATE;	// default {joj 27/10/16}
		this.lastUpdate = 0;	// defualt {joj 27/10/16}
		while (this.savedState) {
			if (this.savedState.tick <= tick) {
				//console.log("GObj.restore savedState.tick=" + this.savedState.tick);
				this.pen = this.savedState.pen;
				this.brush = this.savedState.brush;
				this.minx = this.savedState.minx;
				this.miny = this.savedState.miny;
				this.maxx = this.savedState.maxx;
				this.maxy = this.savedState.maxy;
				this.sx = this.savedState.sx;
				this.sy = this.savedState.sy;
				this.pinx = this.savedState.pinx;
				this.piny = this.savedState.piny;
				this.theta = this.savedState.theta;
				this.tx = this.savedState.tx;
				this.ty = this.savedState.ty;
				this.setT2D();
				this.txtPen = this.savedState.txtPen;
				this.font = this.savedState.font;
				this.txt = this.savedState.txt;
				this.opacity = this.savedState.opacity;
				this.lastUpdate = this.savedState.lastUpdate;
				this.restoreState(); // restore GObj specific state
				break;
			}
			this.savedState = this.savedState.next;
		}
	}

	// GObj.remove
	GObj.prototype.remove = function() {
		console.log("remove");
	}

	// GObj.rotate
	GObj.prototype.rotate = function(dtheta, nsteps, interval, wait) {
		if (nsteps === undefined)
			nsteps = 0;
		if (interval === undefined)
			interval = 1;
		if (wait === undefined)
			wait = 0;
		if ((dtheta == 0) && (wait == 0))
			return 0;
		if (nsteps == 0 || interval <= 0) {
			this.firstUpdate();
			this.theta += dtheta;
			this.setT2D();
			this.update(UPDATEMEMBERS);
			return 0;
		}
		new RotateTracker(this, dtheta, nsteps, interval, wait);
		return wait;
	}

	// GObj.save
	//
	// NB: will not be called when tick = 0
	// NB: saveTick normally  tick unless on first update when it is 0
	//
	GObj.prototype.save = function(saveTick) {
		//if (saveTick == 0 || (this.lastUpdate > 0 && this.lastUpdate > this.savedState.tick)) {
		if (saveTick == 0 || (this.lastUpdate > 0 && (this.savedState == 0 || this.lastUpdate > 2*this.savedState.tick))) {
			this.savedState = new GObjState(saveTick, this.savedState);
			this.savedState.pen = this.pen;
			this.savedState.brush = this.brush;
			this.savedState.minx = this.minx;
			this.savedState.miny = this.miny;
			this.savedState.maxx = this.maxx;
			this.savedState.maxy = this.maxy;
			this.savedState.sx = this.sx;
			this.savedState.sy = this.sy;
			this.savedState.pinx = this.pinx;
			this.savedState.piny = this.piny;
			this.savedState.theta = this.theta;
			this.savedState.tx = this.tx;
			this.savedState.ty = this.ty;
			this.savedState.txtPen = this.txtPen;
			this.savedState.font = this.font;
			this.savedState.txt = this.txt;
			this.savedState.opacity = this.opacity;
			this.savedState.lastUpdate = this.lastUpdate;
			this.saveState();	// save GObj specific state
		}
	}

	// GObj.scale
	GObj.prototype.scale = function(sx, sy, nsteps, interval, wait) {
		if (nsteps === undefined)
			nsteps = 0;
		if (interval === undefined)
			interval = 1;
		if (wait === undefined)
			wait = 0;
		if ((sx == 0) && (sy == 0) && (wait == 0))
			return 0;
		if (nsteps == 0 || interval <= 0) {
			this.firstUpdate();
			this.sx *= sx;
			this.sy *= sy;
			this.setT2D();
			this.update(UPDATEMEMBERS);
			return 0;
		}
		new ScaleTracker(this, sx, sy, nsteps, interval, wait);
		return wait;
	}

	// GObj.setAngle
	GObj.prototype.setAngle = function(theta, nsteps, interval, wait) {
		return this.rotate(theta - this.theta, nsteps, interval, wait);
	}

	// GObj.setBrush
	GObj.prototype.setBrush = function(brush) {
		if (this.brush != brush) {
			this.firstUpdate();
			if (this.brush)
				this.brush.remove(this);
			this.brush = brush;
			if (this.brush)
				this.brush.add(this);
			this.update();
		}
	}

	// GObj.setClipPath
	GObj.prototype.setClipPath = function(clipPath) {
		//console.log("setClipPath");
		if (this.clipPath != clipPath) {
			this.firstUpdate();
			this.clipPath = clipPath;
			this.update(UPDATEMEMBERS);
		}
	}

	// GObj.setFont
	GObj.prototype.setFont = function(font) {
		if (this.font != font) {
			this.firstUpdate();
			if (this.font)
				this.font.remove(this);
			this.font = font;
			if (this.font)
				this.font.add(this);
			this.update();
		}
	}

	// GObj.setLineStyle helper
	//
	// NB: decided not to scale dash and dots with pen width {joj 8/9/17}
	//
	GObj.prototype.setLineStyle = function(ctx, pen) {
		ctx.lineWidth = pen.width;
		ctx.lineCap = "butt";
		let caps = pen.caps & 0x00ff00;
		ctx.lineJoin = (caps == BEVEL_JOIN) ? "bevel" : (caps == ROUND_JOIN) ? "round" : "miter";
		ctx.fillStyle = pen.strokeStyle;		// used to fill caps
		ctx.strokeStyle = pen.strokeStyle;
		switch (pen.style) {
		case DASH:
			ctx.setLineDash([4, 4]);
			break;
		case DOT:
			ctx.setLineDash([2, 2]);
			break;
		case DASH_DOT:
			ctx.setLineDash([4, 2, 2, 2]);
			break;
		case DASH_DOT_DOT:
			ctx.setLineDash([4, 2, 2, 2, 2, 2]);
			break;
		}
	}

	// GObj.setNPts
	GObj.prototype.setNPts = function(npts) {
		if (this.ptx.length != npts) {
			this.firstUpdate();
			this.ptx.length = npts;
			this.pty.length = npts;
			this.update();
		}
	}

	// GObj.setOpacity
	GObj.prototype.setOpacity = function(opacity, nsteps, interval, wait) {
		if (nsteps === undefined)
			nsteps = 0;
		if (interval === undefined)
			interval = 1;
		if (wait === undefined)
			wait = 0;
		if ((this.opacity == opacity) && (wait == 0))	// {joj 17/11/17}
			return 0;
		if (nsteps == 0 || interval <= 0) {
			this.firstUpdate();
			this.opacity = opacity;
			this.update(UPDATEMEMBERS);
			return 0;
		}
		new OpacityTracker(this, opacity, nsteps, interval, wait);
		return wait;
	}

	// GObj.setOptions
	GObj.prototype.setOptions = function(options) {
		//console.log("setOptions(" + options + ")");
		if (this.options != options) {
			this.firstUpdate();
			this.options = options;
			this.update();
		}
	}

	// GObj.setPen
	GObj.prototype.setPen = function(pen) {
		if (this.pen != pen) {
			this.firstUpdate();
			if (this.pen)
				this.pen.remove(this);
			this.pen = pen;
			if (this.pen)
				this.pen.add(this);
			this.update();
		}
	}

	// GObj.setPin
	GObj.prototype.setPin = function(pinx, piny, nsteps, interval, wait) {
		return this.translatePin(pinx - this.pinx, piny - this.piny, nsteps, interval, wait);
	}

	// GObj.setPos
	GObj.prototype.setPos = function(x, y, nsteps, interval, wait) {
		return this.translate(x - this.tx, y - this.ty, nsteps, interval, wait);
	}

	// GObj.setSize
	GObj.prototype.setSize = function(w, h, nsteps, interval, wait) {
		if (nsteps === undefined)
			nsteps = 0;
		if (interval === undefined)
			interval = 1;
		if (wait === undefined)
			wait = 0;
		let gw = this.maxx - this.minx;
		let gh = this.maxy - this.miny;
		if ((w / gw == sx) && (h / gh == sy) && (wait == 0))
			return;
		let newsx = (gw == 0) ? 1 : w / gw;	// {joj 10/8/17}
		let newsy = (gh == 0) ? 1 : h / gh;	// {joj 10/8/17}
		if (nsteps == 0 || interval <= 0) {
			this.firstUpdate();
			this.sx = newsx;
			this.sy = newsy;
			this.setT2D();
			this.update(UPDATEMEMBERS);
			return 0;
		}
		new ScaleTracker(this, newsx / this.sx, newsy / this.sy, nsteps, interval, wait);
		return wait;
	}

	// GObj.setT2D
	GObj.prototype.setT2D = function() {
		this.transform2D.setIdentity();
		if ((this.sx != 1) || (this.sy != 1))
			this.transform2D.scale(this.sx, this.sy);
		if (this.theta != 0) {
			//this.transform2D.translate(-this.pinx, -this.piny);	// CHECK
			this.transform2D.rotate(this.theta);
			//this.transform2D.translate(this.pinx, this.piny);	// CHECK
		}
		this.transform2D.translate(this.tx, this.ty);
	}

	// GObj.translatePt
	GObj.prototype.translatePt = function(n, dx, dy, nsteps, interval, wait) {
		if (n > this.ptx.length)
			return 0;
		if (nsteps === undefined)
			nsteps = 0;
		if (interval === undefined)
			interval = 1;
		if (wait === undefined)
			wait = 0;
		if ((dx == 0) && (dy == 0) && (wait == 0))
			return 0;
		if (nsteps == 0 | interval <= 0) {
			this.firstUpdate();
			this.ptx[n] += dx;
			this.pty[n] += dy;
			this.calculateMinMax();
			this.update();
			return 0;
		}
		new PointTracker(this, n, dx, dy, nsteps, interval, wait);
		return wait;
	}

	// GObj.setTxt
	GObj.prototype.setTxt = function(txt) {
		txt = sprintf.apply(txt || "", arguments);
		if (txt != this.txt) {
			this.firstUpdate();
			this.txt = txt;
			this.update();
		}
	}

	// GObj.setTxt3
	GObj.prototype.setTxt3 = function(txtPen, font, txt) {
		txtPen = txtPen || defaultPen;
		font = font || defaultFont;
		txt = txt || "";
		if (arguments.length > 3) {
			let args = [this.txt];
			for (let i = 3; i < arguments.length; i++)
				args.push(arguments[i]);
			txt = sprintf.apply(this, args);
		}
		this.setTxtPen(txtPen);
		this.setFont(font);
		this.setTxt (txt);
	}

	// GObj.setTxtOff
	GObj.prototype.setTxtOff = function(txtOffX, txtOffY, nsteps, interval, wait) {
		if (nsteps === undefined)
			nsteps = 0;
		if (interval === undefined)
			interval = 1;
		if (wait === undefined)
			wait = 0;
		if ((this.txtOffX == txtOffX) && (this.txtOffY == txtOffY) && (wait == 0))
			return 0;
		if (nsteps == 0 || interval <= 0) {
			this.firstUpdate();
			this.txtOffX = txtOffX;
			this.txtOffY = txtOffY;
			this.update();
			return 0;
		}
		new TxtOffTracker(this, txtOffX, txtOffY, nsteps, interval, wait);
		return wait;
	}

	// GObj.setTxtPen
	GObj.prototype.setTxtPen = function(txtPen) {
		if (txtPen != this.txtPen) {
			this.firstUpdate();
			this.txtPen = txtPen;
			this.update();
		}
	}

	// GObj.translate
	GObj.prototype.translate = function(dx, dy, nsteps, interval, wait) {
		if (nsteps === undefined)
			nsteps = 0;
		if (interval === undefined)
			interval = 1;
		if (wait === undefined)
			wait = 0;
		if ((dx == 0) && (dy == 0) && (wait == 0))
			return 0;
		if (nsteps == 0 || interval <= 0) {
			this.firstUpdate();
			this.tx += dx;
			this.ty += dy;
			this.setT2D();
			this.update(FIREMOVED | UPDATEMEMBERS);
			return 0;
		}
		new TranslateTracker(this, dx, dy, nsteps, interval, wait);
		return wait;
	}

	// GObj.translatePin
	GObj.prototype.translatePin = function(dx, dy, nsteps, interval, wait) {
		if (nsteps === undefined)
			nsteps = 0;
		if (interval === undefined)
			interval = 1;
		if (wait === undefined)
			wait = 0;
		if ((dx == 0) && (dy == 0) && (wait == 0))
			return 0;
		if (nsteps == 0 || interval <= 0) {
			this.firstUpdate();
			this.pin += dx;
			this.pin += dy;
			this.setT2D();
			this.update(FIREMOVED | UPDATEMEMBERS);
			return 0;
		}
		new TranslatePinTracker(this, dx, dy, nsteps, interval, wait);
		return wait;
	}

	// GObj.ungrab
	GObj.prototype.ungrab = function() {
		//console.log("UNGRAB");
		grab = 0;
	}

	// GObj.update
	GObj.prototype.update = function(updFlags) {
		if (updFlags === undefined)
			updFlags = 0;
		this.updated |= (updFlags | UPDATE);
		this.lastUpdate = 2*tick + asyncPhase;
		//if ((updFlags & FIREMOVED) && this.handler["eventMOVED"]) {
		//	let currentThread = getThread();
		//	for (let i = 0; i < this.handler["eventMOVED"].length; i++)
		//		callEventHandler(this.handler["eventMOVED"][i].pc, this.handler["eventMOVED"][i].obj);
		//	resumeThread(currentThread);
		//}
		if ((updFlags & UPDATEMEMBERS) && this.gobjs) {
			for (let i = 0; i < this.gobjs.length; i++) {
				this.gobjs[i].firstUpdate();		// needed in case group members haven't been updated
				this.gobjs[i].update(updFlags & UPDATEMEMBERS);
			}
		}
		if (this.handler["eventUPDATED"]) {
			let handler = this.handler["eventUPDATED"];
			for (let k = 0; k < handler.length; k++) {
				let r = callEventHandler(handler[k].pc, handler[k].obj);
				if ((r & PROPAGATE) == 0)
					break;
			}
		}
	}

	// GObj.updateTxtMbb
	GObj.prototype.updateTxtMbb = function(bGObj, bTxt) {
		if (bTxt) {
			let h, hoptions, maxw = 0, txt, voptions, x0, y0;
			ctx.save();
			ctx.font = this.font.toString();
			txt = this.txt.split("\n");
			for (let i = 0; i < txt.length; i++)
				maxw = Math.max(ctx.measureText(txt[i]).width + 1, maxw);
			h = this.font.sz * txt.length;
			hoptions = this.options & HMASK;
			voptions = this.options & VMASK;
			if (hoptions == HLEFT) {
				x0 = this.minx;
			} else if (hoptions == HRIGHT) {
				x0 = this.maxx - maxw;
			} else {
				x0 = (this.minx + this.maxx - maxw) / 2;
			}
			x0 += this.txtOffX;	// {joj 12/7/17}
			if (voptions == VTOP) {
				y0 = this.miny;
			} else if (voptions == VBOTTOM) {
				y0 = this.maxy - h;
			} else {
				y0 = (this.miny + this.maxy - h) / 2;
			}
			y0 += this.txtOffY;	// {joj 12/7/17}
			if (bGObj == 0 && bTxt) {	// txt ONLY
				this.mbb.set(x0, y0, x0 + maxw, y0 + h);
			} else {
				this.mbb.add(x0, y0, x0 + maxw, y0 + h);
			}
			this.mbb.inflate(1, 1); // to be sure
			ctx.restore();
		}
	}

	// GObj.setClip
	//
	// recursive so transform is calculated in "reverse" order
	//
	GObj.prototype.setClip = function(ctx) {
		if (this.grp)
			this.grp.setClip(ctx);
		ctx.transform(this.transform2D.a, this.transform2D.b, this.transform2D.c, this.transform2D.d, this.transform2D.e, this.transform2D.f);
		if (this.clipPath) {
			for (let i = 0; i < this.clipPath.path.length; i++) {
				ctx.beginPath();
				switch (this.clipPath.path[i].type) {
				case $EPATH:
					if (typeof ctx.ellipse === "function") {
						ctx.ellipse(this.clipPath.path[i].x + this.clipPath.path[i].w / 2, this.clipPath.path[i].y + this.clipPath.path[i].h / 2, this.clipPath.path[i].w / 2, this.clipPath.path[i].h / 2, 0, 0, 2 * Math.PI);
					} else {
						ctx.save();
						ctx.translate(this.clipPath.path[i].x, this.clipPath.path[i].y);
						ctx.scale(this.clipPath.path[i].w / 2, this.clipPath.path[i].h / 2);
						ctx.arc(1, 1, 1, 0, Math.PI*2);
						ctx.restore();
					}
					break;
				case $RPATH:
					ctx.rect(this.clipPath.path[i].x, this.clipPath.path[i].y, this.clipPath.path[i].w, this.clipPath.path[i].h);
					break;
				}
				ctx.clip();
			}
		}

	}

	// Arc constructor
	//
	// NB: used by Pie
	//
	function Arc(grp, _layer, options, pen, brush, x, y, cx, cy, rx, ry, startAngle, spanAngle, txtPen, font, txt) {
		//console.log("new Arc()");
		this.grp = grp;
		this.layer = (_layer) ? _layer : layer[0];
		this.options = options;
		this.pen = pen;
		if (pen)
			pen.add(this);
		this.brush = brush;
		if (brush)
			brush.add(this);
		this.minx = cx - rx;
		this.miny = cy - ry;
		this.maxx = cx + rx;
		this.maxy = cy + ry;
		this.rx = rx;
		this.ry = ry;
		this.startAngle = startAngle * Math.PI / 180;	// convert to radians
		this.spanAngle = spanAngle * Math.PI / 180;		// convert to radians
		this.sx = 1;
		this.sy = 1;
		this.pinx = 0;
		this.piny = 0;
		this.theta = 0;
		this.tx = x;
		this.ty = y;
		this.transform2D = new T2D();
		this.setT2D();
		this.txtPen = txtPen || defaultPen;
		this.font = font || defaultFont;
		this.txt = txt || "";
		if (arguments.length > 15) {
			let args = [this.txt];
			for (let i = 15; i < arguments.length; i++)
				args.push(arguments[i]);
			this.txt = sprintf.apply(this, args);	// this ignored
		}
		this.txtOffX = 0;
		this.txtOffY = 0;
		this.opacity = 1;
		this.savedState = 0;
		this.handler = [];
		this.clipped = 0;
		this.enter = 0;
		this.created = 2*tick + asyncPhase;
		this.updated = UPDATE;
		this.lastUpdate = 2*tick + asyncPhase;
		this.lastUpdateDraw = -1;
		this.mbb = new Mbb();
		this.drawOpacity = 1;
		this.drawT2D = new T2D;
		if ((options & NOATTACH) == 0)	// {joj 3/11/17}
			this.grp.add(this);			// add to group
		this.layer.add(this);			// add to layer
	}
	Arc.prototype = Object.create(GObj.prototype);

	// Arc.draw
	Arc.prototype.draw = function(flags) {
		//console.log("Arc.draw()");
		if (this.drawOpacity && (flags || this.layer.mbbs.overlap(this.mbb))) {
			let ctx = this.layer.ctx;
			ctx.save();
			if (this.clipped) {
				ctx.setTransform(sx, 0, 0, sy, tx, ty);
				this.setClip(ctx);
			} else {
				ctx.transform(this.drawT2D.a, this.drawT2D.b, this.drawT2D.c, this.drawT2D.d, this.drawT2D.e, this.drawT2D.f);
			}
			if (this.brush || this.pen) {
				ctx.beginPath();
				let cx = this.minx + this.rx;
				let cy = this.miny + this.ry;
				let theta = this.startAngle + this.spanAngle;
				if (this.options & PIE) {
					ctx.save();
					ctx.translate(cx, cy);
					ctx.scale(this.rx, this.ry);
					ctx.moveTo(0, 0);
					ctx.lineTo(Math.cos(this.startAngle), Math.sin(this.startAngle));
					ctx.arc(0, 0, 1, this.startAngle, theta, theta < 0);
					ctx.closePath();
					ctx.restore();
				} else {
					ctx.save();
					ctx.translate(cx, cy);
					ctx.scale(this.rx, this.ry);
					ctx.arc(0, 0, 1, this.startAngle, theta, theta < 0);
					if (this.closed)
						ctx.closePath();
					ctx.restore();
				}
				ctx.globalAlpha = this.drawOpacity;	// {joj 4/10/17}
				if (this.brush && this.brush.type != NULLBRUSH) {
					ctx.save();
					ctx.fillStyle = this.brush.fillStyle;
					if (this.brush.options == 0) {
						ctx.setTransform(1, 0, 0, 1, 0, 0);
					} else {
						ctx.setTransform(1, this.drawT2D.b, this.drawT2D.c, 1, 0, 0);
					}
					ctx.fill();
					ctx.restore();
				}
				if (this.pen) {
					ctx.save();
					this.setLineStyle(ctx, this.pen);
					this.drawStartCap(ctx, 0);	// draw start cap
					this.drawEndCap(ctx, 0);	// draw end cap
					this.drawStartCap(ctx, 1);	// setup clip for drawing line
					this.drawEndCap(ctx, 1);	// setup clip for drawing line
					ctx.stroke();
					ctx.restore();
				}
			}
			this.drawTxt(ctx);
			ctx.restore();
		}
	}

	// Arc.getStartAngle
	Arc.prototype.getStartAngle = function() {
		return this.startAngle * 180 / Math.PI;	// convert to degrees
	}

	// Arc.getSpanAngle
	Arc.prototype.getSpanAngle = function() {
		return this.spanAngle * 180 / Math.PI;	// convert to degrees
	}

	// Arc.hit
	Arc.prototype.hit = function(x, y) {
		let r = 0;
		if (this.drawOpacity || (this.options & HITINVISIBLE)) {
			ctx.save();
			let t2D = new T2D();
			for (let grp = this; grp; grp = grp.grp)
				t2D.multiplyBA(grp.transform2D);
			ctx.beginPath();	// IMPORTANT
			ctx.setTransform(t2D.a, t2D.b, t2D.c, t2D.d, t2D.e, t2D.f);
			let cx = this.minx + this.rx;
			let cy = this.miny + this.ry;
			let theta = this.startAngle + this.spanAngle;
			if (this.options & PIE) {
				ctx.save();
				ctx.translate(cx, cy);
				ctx.scale(this.rx, this.ry);
				ctx.moveTo(0, 0);
				ctx.lineTo(Math.cos(this.startAngle), Math.sin(this.startAngle));
				ctx.arc(0, 0, 1, this.startAngle, theta, theta < 0);
				ctx.closePath();
				ctx.restore();
			} else {
				ctx.save();
				ctx.translate(cx, cy);
				ctx.scale(this.rx, this.ry);
				ctx.arc(0, 0, 1, this.startAngle, theta, theta < 0);
				if (this.closed)
					ctx.closePath();
				ctx.restore();
			}
			if (this.pen) {
				ctx.lineWidth = this.pen.width;
				r = ctx.isPointInStroke(x, y);
			}
			if ((r == 0) && (this.optios & PIE))
				r = ctx.isPointInPath(x, y);
			if (r && this.clipped) {
				ctx.setTransform(1, 0, 0, 1, 0, 0);
				this.setClip(ctx);
				r = ctx.isPointInPath(x, y);
			}
			ctx.restore();
		}
		return r ? 1 : 0;	// NEEDED
	}

	// Arc.restoreState
	Arc.prototype.restoreState = function() {
		//console.log("Arc.restoreState tick=" + tick + " txt=" + this.txt + " x=" + this.tx + " y=" + this.ty);
		// no additional state to restore
	}

	// Arc.rotateAngleHelper
	//
	// flag == 0	rotateStartAngle
	// flag == 1	rotateSpanAngle
	// flag == 2	setStartAngle
	// flag == 3	setSpanAngle
	//
	Arc.prototype.rotateAngleHelper = function(flag, theta, nsteps, interval, wait) {
		//console.log("Arc.rotateAngleHelper(flag=" + flag + "theta=" + theta + ")");
		if (nsteps === undefined)
			nsteps = 0;
		if (interval === undefined)
			interval = 1;
		if (wait === undefined)
			wait = 0;
		theta *= Math.PI / 180;						// convert to radians
		if (flag == 2) {							// {joj 23/3/18}
			theta -= this.startAngle;				// make relative
		} else if (flag == 3) {
			theta -= this.spanAngle;				// make relative
		}
		if (nsteps == 0 || interval <= 0) {
			this.firstUpdate();
			if (flag & 1) {							// {joj 23/3/18}
				this.spanAngle += theta;
			} else {
				this.startAngle += theta;
			}
			this.update();
			return 0;
		}
		new ArcRotateTracker(this, flag & 1, theta, nsteps, interval, wait);
		return wait;
	}

	// Arc.rotateSpanAngle
	Arc.prototype.rotateSpanAngle = function(theta, nsteps, interval, wait) {
		//console.log("Arc.rotateSpanAngle(theta=" + theta + ")");
		return this.rotateAngleHelper(1, theta, nsteps, interval, wait);
	}

	// Arc.rotateStartAngle
	Arc.prototype.rotateStartAngle = function(theta, nsteps, interval, wait) {
		//console.log("Arc.rotateStartAngle(theta=" + theta + ")");
		return this.rotateAngleHelper(0, theta, nsteps, interval, wait);
	}

	// Arc.setSpanAngle {joj 23//3}
	Arc.prototype.setSpanAngle = function(angle, nsteps, interval, wait) {
		//console.log("Arc.setSpanAngle(angle=" + angle + ") this.spanAngle=" + this.spanAngle);
		return this.rotateAngleHelper(3, angle, nsteps, interval, wait);
	}

	// Arc.setStartAngle {joj 23/3/18}
	Arc.prototype.setStartAngle = function(angle, nsteps, interval, wait) {
		//console.log("Arc.setStartAngle(angle=" + angle + ")");
		return this.rotateAngleHelper(2, angle, nsteps, interval, wait);
	}

	// Arc.saveState
	Arc.prototype.saveState = function() {
		//console.log("Arc.saveState tick=" + tick + " txt=" + this.txt + " x=" + this.tx + " y=" + this.ty);
		// no additional state to save
	}

	// Arc.updateMbb
	Arc.prototype.updateMbb = function(opacity, drawT2D, clipped, flags) {
		//console.log("Arc.updateMbb()");
		this.drawOpacity = opacity * this.opacity;
		if (flags || (this.updated && (this.lastUpdate != this.lastUpdateDraw || asyncPhase))) {	// async needed as multiple asysnc events can be executed
			this.drawOpacity = opacity * this.opacity;
			this.clipped = (clipped || this.clipPath) ? 1 : 0;
			this.closed = this.options & CLOSED;
			this.layer.mbbs.add(this.mbb);
			let bGObj = (this.brush && this.brush.type != NULLBRUSH) || this.pen;
			let bTxt = this.txt.length && this.txtPen && this.font;
			if (this.drawOpacity && (bGObj || bTxt)) {
				this.drawT2D.set(this.transform2D);
				this.drawT2D.multiplyBA(drawT2D);
				this.mbb.set(this.minx, this.miny, this.maxx, this.maxy);	// IMPROVE
				this.mbb.inflate(1);	// {joj 12/7/17}
				if (this.pen)
					this.mbb.inflate(((this.pen.width == 0) ? 1 : (this.pen.width + 1) / 2));
				this.updateTxtMbb(bGObj, bTxt);
				this.drawT2D.transformMbb(this.mbb);
				this.layer.mbbs.add(this.mbb);
			} else {
				this.mbb.set();
			}
			this.lastUpdateDraw = this.lastUpdate;	// NB
		}
		this.updated = 0;
	}

	// Bezier constructor
	//
	// a Bezier curve is a list of points with the point <0,0> positioned at <x,y>
	// the points specified as either ABSOLUTE or RELATIVE to previous point
	//
	function Bezier(grp, _layer, options, pen, brush, x, y) {
		//console.log("new Bezier()");
		this.grp = grp;
		this.layer = (_layer) ? _layer : layer[0];
		this.options = options;
		this.pen = pen;
		if (pen)
			pen.add(this);
		this.brush = brush;
		if (brush)
			brush.add(this);
		this.closed = 0;
		this.sx = 1;
		this.sy = 1;
		this.pinx = 0;
		this.piny = 0;
		this.theta = 0;
		this.tx = arguments[4];
		this.ty = arguments[5];
		this.transform2D = new T2D();
		this.setT2D();
		let npt = (arguments.length - 6) / 2;
		this.ptx = [];
		this.pty = [];
		for (let i = 0; i < npt; i++) {
			this.ptx[i] = arguments[7 + i*2];
			this.pty[i] = arguments[7 + i*2 + 1];
			if (((options & ABSOLUTE) == 0) && (i > 0)) {
				this.ptx[i] += this.ptx[i-1];
				this.pty[i] += this.pty[i-1]
			}
		}
		this.calculateMinMax();
		this.txtPen = defaultPen;
		this.font = defaultFont;
		this.txt = "";
		this.txtOffX = 0;
		this.txtOffY = 0;
		this.opacity = 1;
		this.savedState = 0;
		this.handler = [];
		this.clipped = 0;
		this.enter = 0;
		this.created = 2*tick + asyncPhase;
		this.updated = UPDATE;
		this.lastUpdate = 2*tick + asyncPhase;
		this.lastUpdateDraw = -1;
		this.mbb = new Mbb();
		this.drawOpacity = 1;
		this.clipPath = 0;				// {joj 14/7/17}
		this.drawT2D = new T2D();
		if ((options & NOATTACH) == 0)	// {joj 3/11/17}
			this.grp.add(this);			// add to group
		this.layer.add(this);			// add to layer
	}
	Bezier.prototype = Object.create(GObj.prototype);

	// Bezier,draw
	Bezier.prototype.draw = function(flags) {
		//console.log("Bezier.draw()");
		if (this.drawOpacity && (flags || this.layer.mbbs.overlap(this.mbb))) {
			let ctx = this.layer.ctx;
			ctx.save();
			if (this.clipped) {
				ctx.setTransform(sx, 0, 0, sy, tx, ty);
				this.setClip(ctx);
			} else {
				ctx.transform(this.drawT2D.a, this.drawT2D.b, this.drawT2D.c, this.drawT2D.d, this.drawT2D.e, this.drawT2D.f);
			}
			ctx.globalAlpha = this.drawOpacity;	// {joj 4/10/17}
			if (this.brush && this.brush.type != NULLBRUSH) {
				ctx.save();
				ctx.beginPath();
				ctx.moveTo(this.ptx[0], this.pty[0]);
				for (let i = 1; i < this.ptx.length; i += 3)
					ctx.bezierCurveTo(this.ptx[i], this.pty[i], this.ptx[i+1], this.pty[i+1], this.ptx[i+2], this.pty[i+2]);
				if (this.closed)
					ctx.closePath();
				ctx.fillStyle = this.brush.fillStyle;
				ctx.fill();
				ctx.restore();
			}
			if (this.pen) {
				ctx.save();
				this.setLineStyle(ctx, this.pen);
				this.drawStartCap(ctx, 0);
				this.drawEndCap(ctx, 0);
				this.drawStartCap(ctx, 1);
				this.drawEndCap(ctx, 1);
				ctx.beginPath();
				ctx.moveTo(this.ptx[0], this.pty[0]);
				for (let i = 1; i < this.ptx.length; i += 3)
					ctx.bezierCurveTo(this.ptx[i], this.pty[i], this.ptx[i+1], this.pty[i+1], this.ptx[i+2], this.pty[i+2]);
				if (this.closed)
					ctx.closePath();
				ctx.stroke();
				ctx.restore();
			}
			this.drawTxt(ctx);
			ctx.restore();
		}
	}

	// Bezier.hit
	Bezier.prototype.hit = function(x, y) {
		//console.log("Bezier.hit");
		let r = 0;
		if (this.drawOpacity || (this.options & HITINVISIBLE)) {
			ctx.save();
			let t2D = new T2D();
			for (let grp = this; grp; grp = grp.grp)
				t2D.multiplyBA(grp.transform2D);
			ctx.beginPath();
			ctx.setTransform(t2D.a, t2D.b, t2D.c, t2D.d, t2D.e, t2D.f);
			ctx.moveTo(this.ptx[0], this.pty[0]);
			var n = this.ptx.length;
			for (let i = 1; i < n; i += 3)
				ctx.bezierCurveTo(this.ptx[i], this.pty[i], this.ptx[i+1], this.pty[i+1], this.ptx[i+2], this.pty[i+2]);
			if (this.closed)
				ctx.closePath();
			if (this.pen) {
				ctx.lineWidth = this.pen.width;
				r = ctx.isPointInStroke(x,y);
			}
			if ((r == 0) && (this.closed))
				r = ctx.isPointInPath(x, y);
			if (r && this.clipped) {
				ctx.setTransform(1, 0, 0, 1, 0, 0);
				this.setClip(ctx);
				r = ctx.isPointInPath(x, y);
			}
			ctx.restore();
		}
		return r ? 1 : 0;	// NEEDED
	}

	// Bezier.saveState
	Bezier.prototype.saveState = function() {
		//console.log("Bezier.saveState tick=" + tick + " txt=" + this.txt + " x=" + this.tx + " y=" + this.ty);
		// no additional state to save
	}

	// Bezier.restoreState
	Bezier.prototype.restoreState = function() {
		//console.log("Bezier.restoreState tick=" + tick + " txt=" + this.txt + " x=" + this.tx + " y=" + this.ty);
		// no additional state to restore
	}

	// Bezier.setPt
	Bezier.prototype.setPt = function(n, x, y, nsteps, interval, wait) {
		//console.log("Bezier.setPt()");
		if (nsteps === undefined)
			nsteps = 0;
		if (interval === undefined)
			interval = 1;
		if (wait === undefined)
			wait = 0;
		if (nsteps == 0 || interval <= 0) {
			this.firstUpdate();
			this.ptx[n] = x;
			this.pty[n] = y;
			//this.calculateMinMax();
			this.update();
			return 0;
		}
		new PointTracker(this, n, x - this.ptx[n], y - this.pty[n], nsteps, interval, wait);
		return wait;
	}

	// Bezier.updateMbb
	Bezier.prototype.updateMbb = function(opacity, drawT2D, clipped, flags) {
		//console.log("Bezier.updateMbb()");
		this.drawOpacity = opacity * this.opacity;
		if (flags || (this.updated && (this.lastUpdate != this.lastUpdateDraw || asyncPhase))) {	// async needed as multiple async events can be executed
			this.drawOpacity = opacity * this.opacity;
			this.clipped = (clipped || this.clipPath) ? 1 : 0;
			this.closed = this.options & CLOSED;
			this.layer.mbbs.add(this.mbb);
			let bGObj = (this.brush && this.brush.type != NULLBRUSH) || this.pen;
			let bTxt = this.txt.length && this.txtPen && this.font;
			if (this.drawOpacity && (bGObj || bTxt)) {
				this.drawT2D.set(this.transform2D);
				this.drawT2D.multiplyBA(drawT2D);
				this.mbb.set(this.minx, this.miny, this.maxx, this.maxy);
				this.mbb.inflate(1);
				if (this.pen)
					this.mbb.inflate(((this.pen.width == 0) ? 1 : (this.pen.width + 1) / 2));
				this.updateTxtMbb(bGObj, bTxt);
				this.drawT2D.transformMbb(this.mbb);
				this.layer.mbbs.add(this.mbb);
			} else {
				this.mbb.set();
			}
			this.lastUpdateDraw = this.lastUpdate;	// NB
		}
		this.updated = 0;
	}

	// Ellipse constructor
	function Ellipse(grp, _layer, options, pen, brush, x, y, ix, iy, iw, ih, txtPen, font, txt) {
		this.grp = grp;
		this.layer = (_layer) ? _layer : layer[0];
		this.options = options;
		this.pen = pen;
		if (pen)
			pen.add(this);
		this.brush = brush;
		if (brush)
			brush.add(this);
		this.ptx = [];
		this.pty = [];
		this.ptx[0] = ix;
		this.pty[0] = iy;
		this.ptx[1] = ix + iw;
		this.pty[1] = iy + ih;
		this.calculateMinMax();
		this.sx = 1;
		this.sy = 1;
		this.pinx = 0;
		this.piny = 0;
		this.theta = 0;
		this.tx = x;
		this.ty = y;
		this.transform2D = new T2D();
		this.setT2D();
		this.txtPen = txtPen || defaultPen;
		this.font = font || defaultFont;
		this.txt = txt || "";
		if (arguments.length > 14) {
			let args = [this.txt];
			for (let i = 14; i < arguments.length; i++)
				args.push(arguments[i]);
			this.txt = sprintf.apply(this, args);
		}
		this.txtOffX = 0;
		this.txtOffY = 0;
		this.opacity = 1;
		this.savedState = 0;
		this.handler = [];
		this.clipped = 0;
		this.enter = 0;
		this.created = 2*tick + asyncPhase;
		this.updated = UPDATE;
		this.lastUpdate = 2*tick + asyncPhase;
		this.lastUpdateDraw = -1;
		this.mbb = new Mbb();
		this.drawOpacity = 1;
		this.drawT2D = new T2D;
		if ((options & NOATTACH) == 0)	// {joj 3/11/17}
			this.grp.add(this);			// add to group
		this.layer.add(this);			// add to layer
	}
	Ellipse.prototype = Object.create(GObj.prototype);

	// Ellipse.draw
	Ellipse.prototype.draw = function(flags) {
		//console.log("Ellipse.draw tick=" + tick);
		if (this.drawOpacity && (flags || this.layer.mbbs.overlap(this.mbb))) {
			let ctx = this.layer.ctx;
			ctx.save();
			if (this.clipped) {
				ctx.setTransform(sx, 0, 0, sy, tx, ty);
				this.setClip(ctx);
			} else {
				ctx.transform(this.drawT2D.a, this.drawT2D.b, this.drawT2D.c, this.drawT2D.d, this.drawT2D.e, this.drawT2D.f);
			}
			ctx.beginPath();
			let x0 = this.ptx[0];
			let y0 = this.pty[0];
			let x1 = this.ptx[1];
			let y1 = this.pty[1];
			if (ctx.ellipse) {
				ctx.ellipse((x0 + x1) / 2, (y0 + y1) / 2, Math.abs(x1 - x0) / 2, Math.abs(y1 - y0) / 2, 0, 0, 2 * Math.PI);
			} else {
				ctx.save();
				ctx.translate(x0, y0);
				ctx.scale((x1 - x0) / 2, (y1 - y0) / 2);
				ctx.arc(1, 1, 1, 0, Math.PI*2);
				ctx.restore();
			}
			ctx.globalAlpha = this.drawOpacity;	// {joj 4/10/17}
			if (this.brush && this.brush.type != NULLBRUSH) {
				ctx.save();
				ctx.fillStyle = this.brush.fillStyle;
				if (this.brush.options == 0)
					ctx.setTransform(1, 0, 0, 1, 0, 0);
				ctx.fill();
				ctx.restore();
			}
			if (this.pen) {
				this.setLineStyle(ctx, this.pen);
				ctx.stroke();
			}
			this.drawTxt(ctx);
			ctx.restore();
		}
	}

	// Ellipse.hit
	//
	// test against virtual co-ordinates
	// isPointInStroke() and isPointInPath() doesn't take into account clipping
	//
	Ellipse.prototype.hit = function(x, y) {
		//console.log("Ellipse.hit");
		let r = 0;
		if (this.drawOpacity || (this.options & HITINVISIBLE)) {
			ctx.save();
			let t2D = new T2D();
			for (let grp = this; grp; grp = grp.grp)
				t2D.multiplyBA(grp.transform2D);
			ctx.beginPath();	// IMPORTANT
			ctx.setTransform(t2D.a, t2D.b, t2D.c, t2D.d, t2D.e, t2D.f);
			let x0 = this.ptx[0];
			let y0 = this.pty[0];
			let x1 = this.ptx[1];
			let y1 = this.pty[1];
			if (ctx.ellipse) {
				ctx.ellipse((x0 + x1) / 2, (y0 + y1) / 2, (x1 - x0) / 2, (y1 - y0) / 2, 0, 0, 2 * Math.PI);
			} else {
				ctx.save();
				ctx.translate(x0, y0);
				ctx.scale((x1 - x0) / 2, (y1 - y0) / 2);
				ctx.arc(1, 1, 1, 0, Math.PI*2);
				ctx.restore();
			}
			if (this.pen) {
				ctx.lineWidth = this.pen.width;
				r = ctx.isPointInStroke(x, y);
			}
			if (r == 0)
				r = ctx.isPointInPath(x, y);
			if (r && this.clipped) {
				ctx.setTransform(1, 0, 0, 1, 0, 0);
				this.setClip(ctx);
				r = ctx.isPointInPath(x, y);
			}
			ctx.restore();
		}
		return r ? 1 : 0;	// NEEDED
	}

	// Ellipse.saveState
	Ellipse.prototype.saveState = function() {
		//console.log("Ellipse.saveState tick=" + tick + " txt=" + this.txt + " x=" + this.tx + " y=" + this.ty);
		// no additional state to save
	}

	// Ellipse.saveState
	Ellipse.prototype.restoreState = function() {
		//console.log("Ellipse.restoreState tick=" + tick + " txt=" + this.txt + " x=" + this.tx + " y=" + this.ty);
		// no additional state to restore
	}

	// Ellipse.toString
	Ellipse.prototype.toString = function() {
		return "Ellipse " + this.txt;
	}

	// Ellipse.updateMbb
	Ellipse.prototype.updateMbb = function(opacity, drawT2D, clipped, flags) {
		Rectangle.prototype.updateMbb.call(this, opacity, drawT2D, clipped, flags);
	}

	// Ellipse2 (alternative constructor)
	function Ellipse2(grp, layer, options, pen, brush, x, y, iw, ih, txtPen, font, txt) {
		var args = [grp, layer, options, pen, brush, x, y, 0, 0, iw, ih, txtPen, font, txt];
		for (let i = 12; i < arguments.length; i++)
			args.push(arguments[i]);
		Ellipse.apply(this, args);
	}
	Ellipse2.prototype = Ellipse.prototype;

	// Image constuctor
	//
	// NB: images loaded asynchronously
	//
	function Image(grp, _layer, options, pen, url, x, y, ix, iy, iw, ih) {
		//console.log("Image url=" + url + " x=" + x + " y=" + y + " ix=" + ix + " iy=" + iy + " iw=" + iw + " ih=" + ih);
		this.grp = grp;
		this.layer = (_layer) ? _layer : layer[0];
		this.options = options;
		this.url = url;
		this.pen = pen;
		if (pen)
			pen.add(this);
		this.brush = 0;
		this.ptx = [];
		this.pty = [];
		this.ptx[0] = ix;
		this.pty[0] = iy;
		this.ptx[1] = ix + iw;
		this.pty[1] = iy + ih;
		this.calculateMinMax();
		this.sx = 1;
		this.sy = 1;
		this.pinx = 0;
		this.piny = 0;
		this.theta = 0;
		this.tx = x;
		this.ty = y;
		this.transform2D = new T2D();
		this.setT2D();
		this.txtPen = defaultPen;
		this.font = defaultFont;
		this.txt = "";
		this.txtOffX = 0;
		this.txtOffY = 0;
		this.opacity = 1;
		this.savedState = 0;
		this.handler = [];
		this.clipped = 0;
		this.enter = 0;
		this.created = 2*tick + asyncPhase;
		this.updated = UPDATE;
		this.lastUpdate = 2*tick + asyncPhase;
		this.lastUpdateDraw = -1;
		this.mbb = new Mbb();
		this.drawOpacity = 1;
		this.clipPath = 0;
		this.drawT2D = new T2D();
		if ((options & NOATTACH) == 0)	// {joj 3/11/17}
			this.grp.add(this);			// add to group
		this.layer.add(this);			// add to layer
		this.image = new window.Image();
		this.image.imageObj = this;
		this.image.onload = imageLoaded;
		this.image.src = url;
	}
	Image.prototype = Object.create(GObj.prototype);

	// imageLoaded
	//
	// handles the asychronous loading of images
	//
	function imageLoaded(image) {
		this.imageObj.updated = UPDATE;
		asyncPhase = 1;
		drawChanges();		// clears asyncPhase {joj 28/11/17}
	}

	// Image.updateMbb
	Image.prototype.updateMbb = function(opacity, drawT2D, clipped, flags) {
		//console.log("Image.updateMbb opacity=" + opacity);
		if (flags || (this.updated && (this.lastUpdate != this.lastUpdateDraw || asyncPhase))) {	// async needed as multiple async events can be executed
			//console.log("tick=" + tick + " Image updateMbb txt=\"" + this.txt + "\" flags=" + flags + " lastUpdate=" + this.lastUpdate + " lastUpdateDraw=" + this.lastUpdateDraw + " asyncPhase=" + asyncPhase);
			this.drawOpacity = opacity * this.opacity;
			this.clipped = (clipped || this.clipPath) ? 1 : 0;
			this.layer.mbbs.add(this.mbb);
			let bTxt = this.txt.length && this.txtPen && this.font;
			if (this.drawOpacity) {
				this.drawT2D.set(this.transform2D);
				this.drawT2D.multiplyBA(drawT2D);
				this.mbb.set(this.ptx[0], this.pty[0], this.ptx[1], this.pty[1]);
				this.mbb.inflate(1);	// {joj 12/7/17}
				if (this.pen)
					this.mbb.inflate(((this.pen.width == 0) ? 1 : (this.pen.width + 1) / 2));
				this.updateTxtMbb(1, bTxt);
				this.drawT2D.transformMbb(this.mbb);
				this.layer.mbbs.add(this.mbb);
			} else {
				this.mbb.set();
			}
			this.lastUpdateDraw = this.lastUpdate;	// NB
		}
		this.updated = 0;
	}

	// Image.draw
	Image.prototype.draw = function(flags) {
		//console.log("Image.draw");
		if (this.drawOpacity && (flags || this.layer.mbbs.overlap(this.mbb))) {
			let ctx = this.layer.ctx;
			ctx.save();
			if (this.clipped) {
				ctx.setTransform(sx, 0, 0, sy, tx, ty);
				this.setClip(ctx);
			} else {
				ctx.transform(this.drawT2D.a, this.drawT2D.b, this.drawT2D.c, this.drawT2D.d, this.drawT2D.e, this.drawT2D.f);
			}
			let x0 = this.ptx[0];
			let y0 = this.pty[0];
			let x1 = this.ptx[1];
			let y1 = this.pty[1];
			ctx.globalAlpha = this.drawOpacity;	// {joj 4/10/17}
			ctx.drawImage(this.image, x0, y0, x1 - x0, y1 - y0);
			if (this.pen) {
				ctx.beginPath();
				ctx.rect(x0, y0, x1 - x0, y1 - y0);
				this.setLineStyle(ctx, this.pen);
				ctx.stroke();
			}
			this.drawTxt(ctx);
			ctx.restore();
		}
	}

	// Image.hit
	Image.prototype.hit = function(x, y) {
		let r = 0;
		if (this.drawOpacity || (this.options & HITINVISIBLE)) {
			ctx.save();
			ctx.beginPath();	// needed
			let t2D = new T2D();
			for (let grp = this; grp; grp = grp.grp)
				t2D.multiplyBA(grp.transform2D.a, grp.transform2D.b, grp.transform2D.c, grp.transform2D.d, grp.transform2D.e, grp.transform2D.f);
			ctx.setTransform(t2D.a, t2D.b, t2D.c, t2D.d, t2D.e, t2D.f);
			let x0 = this.ptx[0];
			let y0 = this.pty[0];
			let x1 = this.ptx[1];
			let y1 = this.pty[1];
			ctx.rect(x0, y0, x1 - x0, y1 - y0)
			if (this.pen) {
				ctx.lineWidth = this.pen.width;
				r = ctx.isPointInStroke(x,y);
			}
			if (r == 0)
				r = ctx.isPointInPath(x, y);
			if (r && this.clipped) {
				ctx.setTransform(1, 0, 0, 1, 0, 0);
				this.setClip(ctx);
				r = ctx.isPointInPath(x, y);
			}
			ctx.restore();
		}
		return r ? 1 : 0;	// NEEDED
	}

	// Image.saveState
	Image.prototype.saveState = function() {
		//console.log("Image.saveState tick=" + tick + " txt=" + this.txt + " x=" + this.tx + " y=" + this.ty);
		// no additional state to save
	}

	// Image.restoreState
	Image.prototype.restoreState = function() {
		//console.log("Image.restoreState tick=" + tick + " txt=" + this.txt + " x=" + this.tx + " y=" + this.ty);
		// no additional state to restore
	}

	// Line constructor
	//
	// a line is a list of points with the point <0,0> positioned at <x,y>
	// the points can be specified as either ABSOLUTE or RELATIVE to the previous point
	//
	function Line(grp, _layer, options, pen, x, y) {
		this.grp = grp;
		this.layer = (_layer) ? _layer : layer[0];
		this.options = options;
		this.pen = pen;
		if (pen)
			pen.add(this);
		this.brush = 0;		// used by Polygon
		this.closed = 0;	// 0:Line 1:Polygon
		this.sx = 1;
		this.sy = 1;
		this.pinx = 0;
		this.piny = 0;
		this.theta = 0;
		this.tx = x;
		this.ty = y;
		this.transform2D = new T2D();
		this.setT2D();
		let npt = (arguments.length - 6) / 2;
		this.ptx = [];
		this.pty = [];
		for (let i = 0; i < npt; i++) {
			this.ptx[i] = arguments[6 + i*2];
			this.pty[i] = arguments[6 + i*2 + 1];
			if (((options & ABSOLUTE) == 0) && (i > 0)) {
				this.ptx[i] += this.ptx[i-1];
				this.pty[i] += this.pty[i-1]
			}
		}
		this.calculateMinMax();
		this.txtPen = defaultPen;
		this.font = defaultFont;
		this.txt = "";
		this.txtOffX = 0;
		this.txtOffY = 0;
		this.opacity = 1;
		this.savedState = 0;
		this.handler = [];
		this.clipped = 0;
		this.enter = 0;
		this.created = 2*tick + asyncPhase;
		this.updated = UPDATE;
		this.lastUpdate = 2*tick + asyncPhase;
		this.lastUpdateDraw = -1;
		this.mbb = new Mbb();
		this.drawOpacity = 1;
		this.clipPath = 0;				// {joj 14/7/17}
		this.drawT2D = new T2D();
		if ((options & NOATTACH) == 0)	// {joj 3/11/17}
			this.grp.add(this);			// add to group
		this.layer.add(this);			// add to layer
	}
	Line.prototype = Object.create(GObj.prototype);

	// Line.saveState
	Line.prototype.saveState = function() {
		//console.log("Line.saveState()");
		this.savedState.ptx = [];
		this.savedState.pty = [];
		for (let i = 0; i < this.ptx.length; i++) {
			this.savedState.ptx[i] = this.ptx[i]
			this.savedState.pty[i] = this.pty[i];
		}
	}

	// Line.restoreState
	Line.prototype.restoreState = function() {
		//console.log("Line.restoreState tick=" + tick);
		this.ptx.length = this.pty.length = 0;
		for (let i = 0; i < this.savedState.ptx.length; i++) {
			this.ptx[i] = this.savedState.ptx[i]
			this.pty[i] = this.savedState.pty[i];
		}
		this.calculateMinMax();
	}

	// Line.hit
	Line.prototype.hit = function(x, y) {
		//console.log("Line.hit");
		let r = 0;
		if (this.drawOpacity || (this.options & HITINVISIBLE)) {
			ctx.save();
			let t2D = new T2D();
			for (let grp = this; grp; grp = grp.grp)
				t2D.multiplyBA(grp.transform2D);
			ctx.beginPath();
			ctx.setTransform(t2D.a, t2D.b, t2D.c, t2D.d, t2D.e, t2D.f);
			ctx.moveTo(this.ptx[0], this.pty[0]);
			for (let i = 1; i < this.ptx.length; i++)
				ctx.lineTo(this.ptx[i], this.pty[i]);
			if (this.closed)
				ctx.closePath();
			if (this.pen) {
				ctx.lineWidth = this.pen.width;
				r = ctx.isPointInStroke(x,y);
			}
			if ((r == 0) && (this.closed))
				r = ctx.isPointInPath(x, y);
			if (r && this.clipped) {
				ctx.setTransform(1, 0, 0, 1, 0, 0);
				this.setClip(ctx);
				r = ctx.isPointInPath(x, y);
			}
			ctx.restore();
		}
		return r ? 1 : 0;	// NEEDED
	}

	// Line.setPt
	Line.prototype.setPt = function(n, x, y, nsteps, interval, wait) {
		if (nsteps === undefined)
			nsteps = 0;
		if (interval === undefined)
			interval = 1;
		if (wait === undefined)
			wait = 0;
		if ((this.ptx[n] == x) && (this.pty[n] == y) && (wait == 0))
			return 0;
		if (nsteps == 0 || interval <= 0) {
			this.firstUpdate();
			this.ptx[n] = x;
			this.pty[n] = y;
			this.calculateMinMax();
			this.update();
			return 0;
		}
		new PointTracker(this, n, x - this.ptx[n], y - this.pty[n], nsteps, interval, wait);
		return wait;
	}

	// Line.drawCircleCap
	GObj.prototype.drawCircleCap = function(ctx, start, scale, clip) {
		if (((this.pen.caps & 0xff) == ROUND_START) && ((this.pen.caps & 0xff0000) == ROUND_END)) {	// use native lineCap
			ctx.lineCap = "round";
			return;
		}
		let p = start ? 0 : this.ptx.length - 1;
		let sz = this.pen.width*scale;
		ctx.save();
		ctx.beginPath();
		if (clip) {
			ctx.save();
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.rect(0, 0, canvas.width, canvas.height);
			ctx.restore();
			sz = sz/2 > 0.25 ? sz/2 - 0.25 : 0
			ctx.ellipse(this.ptx[p], this.pty[p], sz, sz, 0, 0, 2*Math.PI);
			ctx.restore();
			ctx.clip("evenodd");
		} else {
			ctx.ellipse(this.ptx[p], this.pty[p], sz/2, sz/2, 0, 0, 2*Math.PI);
			if (this.pen.options == 0)
				ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.fill();
			ctx.restore();
		}
	}

	// Line.drawSquareCap
	GObj.prototype.drawSquareCap = function(ctx, start, scale, clip) {
		let p0 = 0, p1 = 1;
		if (start == 0) {
			p0 = this.ptx.length - 1;
			p1 = p0 - 1;
		}
		let dx = this.ptx[p0] - this.ptx[p1];
		let dy = this.pty[p0] - this.pty[p1];
		let radians = Math.atan2(dy, dx);
		let sz = this.pen.width * scale;
		ctx.save();
		ctx.beginPath();
		ctx.translate(this.ptx[p0], this.pty[p0]);
		ctx.rotate(radians);
		if (clip) {
			ctx.save();
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.rect(0, 0, canvas.width, canvas.height);
			ctx.restore();
			ctx.rect(-sz/2, -sz/2, sz, sz);
			ctx.restore();
			ctx.clip("evenodd");
		} else {
			ctx.rect(-sz/2, -sz/2, sz, sz);
			if (this.pen.options == 0)
				ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.fill();
			ctx.restore();
		}
	}

	// Line.drawArrowCap helper
	//
	// rotate and translate line so it is horizontal with tip of arrow head at 0,0
	// make sure head is not bigger than length of line
	//
	GObj.prototype.drawArrowCap = function(ctx, start, angle, scale, clip) {
		let p0 = 0, p1 = 1;
		if (start == 0) {
			p0 = this.ptx.length - 1;
			p1 = p0 - 1;
		}
		let dx = this.ptx[p1] - this.ptx[p0];
		let dy = this.pty[p1] - this.pty[p0];
		let radians = Math.atan2(dy, dx);
		let l = Math.sqrt(dx*dx + dy*dy);
		angle = angle*Math.PI/180/2;	// half angle in radians
		if (clip) {
			dy = (scale > 1 ? this.pen.width*scale : this.pen.width) / 2;
			dx = Math.min(this.pen.width*scale / 2 / Math.tan(angle), l);
			ctx.save();
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.beginPath();
			ctx.rect(0, 0, canvas.width, canvas.height);
			ctx.restore();
			ctx.save();
			ctx.translate(this.ptx[p0], this.pty[p0]);
			ctx.rotate(radians);
			ctx.rect(-0.75, -dy - 0.5, dx + 0.5, 2*dy + 1);
			ctx.restore();
			ctx.clip("evenodd");
		} else {
			dy = this.pen.width*scale / 2;
			dx = Math.min(dy / Math.tan(angle), l);
			ctx.save();
			ctx.translate(this.ptx[p0], this.pty[p0]);
			ctx.rotate(radians);
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.lineTo(dx, -dy);
			ctx.lineTo(dx, dy);
			ctx.closePath();
			if (this.pen.options == 0)
				ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.fill();
			ctx.restore();
		}
	}

	// Line.drawStartCap helper
	GObj.prototype.drawStartCap = function(ctx, clip) {
		switch (this.pen.caps & 0x000000ff) {
		case BUTT_START:
			break;
		case ROUND_START:
			this.drawCircleCap(ctx, 1, 1, clip);
			break;
		case SQUARE_START:
			this.drawSquareCap(ctx, 1, this.pen.ss, clip);
			break;
		case ARROW40_START:
			this.drawArrowCap(ctx, 1, 40, this.pen.ss, clip);
			break;
		case ARROW60_START:
			this.drawArrowCap(ctx, 1, 60, this.pen.ss, clip);
			break;
		case ARROW90_START:
			this.drawArrowCap(ctx, 1, 90, this.pen.ss, clip);
			break;
		case CIRCLE_START:
			this.drawCircleCap(ctx, 1, this.pen.ss, clip);
			break;
		}
	}

	// Line.drawEndCap helper
	GObj.prototype.drawEndCap = function(ctx, clip) {
		switch (this.pen.caps & 0x00ff0000) {
		case BUTT_END:
			break;
		case ROUND_END:
			this.drawCircleCap(ctx, 0, 1, clip);
			break;
		case SQUARE_END:
			this.drawSquareCap(ctx, 0, this.pen.se, clip);
			break;
		case ARROW40_END:
			this.drawArrowCap(ctx, 0, 40, this.pen.se, clip);
			break;
		case ARROW60_END:
			this.drawArrowCap(ctx, 0, 60, this.pen.se, clip);
			break;
		case ARROW90_END:
			this.drawArrowCap(ctx, 0, 90, this.pen.se, clip);
			break;
		case CIRCLE_END:
			this.drawCircleCap(ctx, 0, this.pen.se, clip);
			break;
		}
	}

	// Line.setLineWidth helper
	//
	// scales ctx.lineWidth when line stroked using identity matrix
	//
	GObj.prototype.setLineWidth = function(ctx) {
		let dx = this.ptx[1] - this.ptx[0];
		let dy = this.pty[1] - this.pty[0];
		let radians = Math.atan2(dy, dx);
		let x0 = this.drawT2D.e;
		let y0 = this.drawT2D.f;
		let x = this.pen.width*Math.cos(radians);
		let y = this.pen.width*Math.sin(radians);
		let x1 = this.drawT2D.a*x + this.drawT2D.b*y + this.drawT2D.e;
		let y1 = this.drawT2D.c*x + this.drawT2D.c*y + this.drawT2D.f;
		ctx.lineWidth = Math.sqrt((x0-x1)*(x0-x1)+(y0-y1)*(y0-y1));
	}

	// Line.draw
	Line.prototype.draw = function(flags) {
		if (this.drawOpacity && (flags || this.layer.mbbs.overlap(this.mbb))) {
			let ctx = this.layer.ctx;
			ctx.save();
			if (this.clipped) {
				ctx.setTransform(sx, 0, 0, sy, tx, ty);
				this.setClip(ctx);
			} else {
				ctx.transform(this.drawT2D.a, this.drawT2D.b, this.drawT2D.c, this.drawT2D.d, this.drawT2D.e, this.drawT2D.f);
			}
			ctx.globalAlpha = this.drawOpacity;	// {joj 4/10/17}
			if (this.closed && brushVisible(this.brush)) {	// NB: polygon is a closed line
				ctx.save();
				ctx.beginPath();
				ctx.moveTo(this.ptx[0], this.pty[0]);
				for (let i = 1; i < this.ptx.length; i++)
					ctx.lineTo(this.ptx[i], this.pty[i]);
				if (this.closed)
					ctx.closePath();
				ctx.fillStyle = this.brush.fillStyle;
				ctx.fill();
				ctx.restore();
			}
			if (penVisible(this.pen)) {
				ctx.save();
				this.setLineStyle(ctx, this.pen);
				this.drawStartCap(ctx, 0);
				this.drawEndCap(ctx, 0);
				this.drawStartCap(ctx, 1);
				this.drawEndCap(ctx, 1);
				ctx.beginPath();
				ctx.moveTo(this.ptx[0], this.pty[0]);
				for (let i = 1; i < this.ptx.length; i++)
					ctx.lineTo(this.ptx[i], this.pty[i]);
				if (this.closed)
					ctx.closePath();
				if (this.pen.type == IMAGEPEN && this.pen.options == 0) {
					this.setLineWidth(ctx);
					ctx.setTransform(1, 0, 0, 1, 0, 0);
				}
				ctx.stroke();
				ctx.restore();
			}
			this.drawTxt(ctx);
			ctx.restore();
		}
	}

	// Line.toString
	Line.prototype.toString = function() {
		return "Line " + this.txt;
	}

	//
	// Line.updateMbbSquareCap helper
	//
	// cap at ptx[p],pty[p]
	// TOFIX: make more accurate
	//
	Line.prototype.updateMbbSquareCap = function(p, scale) {
		let sz = this.pen.width*scale;
		sz = Math.sqrt(2*sz*sz)/2 + 1;
		this.mbb.add(this.ptx[p] - sz, this.pty[p] - sz, this.ptx[p] + sz, this.pty[p] + sz);
	}

	//
	// Line.updateMbbArrowCap helper
	//
	// line p0 -> p1 arrow head at p1
	//
	Line.prototype.updateMbbArrowCap = function(p0, p1, angle, scale) {
		let dx = this.ptx[p1] - this.ptx[p0];
		let dy = this.pty[p1] - this.pty[p0];
		let radians = Math.atan2(dy, dx);
		angle = angle*Math.PI/180/2;	// half angle in radians
		let l = this.pen.width*scale/Math.sin(angle) / 2;
		dx = l*Math.sin(Math.PI/2 - angle - radians);
		dy = l*Math.cos(Math.PI/2 - angle - radians);
		this.mbb.addPt(this.ptx[p1] - dx, this.pty[p1] - dy);
		dx = l*Math.cos(radians - angle);
		dy = l*Math.sin(radians - angle);
		this.mbb.addPt(this.ptx[p1] - dx, this.pty[p1] - dy);
		this.mbb.inflate(1, 1); // to be sure!
	}

	//
	// Line.updateMbbCircleCap helper
	//
	// cap at ptx[p],pty[p]
	//
	Line.prototype.updateMbbCircleCap = function(p, scale) {
		let sz = this.pen.width*scale/2 + 1;
		this.mbb.add(this.ptx[p] - sz, this.pty[p] - sz, this.ptx[p] + sz, this.pty[p] + sz);
	}

	// Line.updateMbbCaps helper
	Line.prototype.updateMbbCaps = function() {
		let n = this.ptx.length - 1;
		switch (this.pen.caps & 0x000000ff) {
		case SQUARE_START:
			this.updateMbbSquareCap(0, this.pen.ss);			// start cap at pt[0]
			break;
		case ARROW40_START:
			this.updateMbbArrowCap(1, 0, 40, this.pen.ss);		// start cap at pt[0]
			break;
		case ARROW60_START:
			this.updateMbbArrowCap(1, 0, 60, this.pen.ss);		// start cap at pt[0]
			break;
		case ARROW90_START:
			this.updateMbbArrowCap(1, 0, 90, this.pen.ss);		// start cap at pt[0]
			break;
		case CIRCLE_START:
			this.updateMbbCircleCap(0, this.pen.ss);			// start cap at pt[0]
			break;
		}
		switch (this.pen.caps & 0x00ff0000) {
		case SQUARE_END:
			this.updateMbbSquareCap(n, this.pen.se);			// end cap at pt[n]
			break;
		case ARROW40_END:
			this.updateMbbArrowCap(n - 1, n, 40, this.pen.se);	// end cap at pt[n]
			break;
		case ARROW60_END:
			this.updateMbbArrowCap(n - 1, n, 60, this.pen.se);	// end cap at pt[n]
			break;
		case ARROW90_END:
			this.updateMbbArrowCap(n - 1, n, 90, this.pen.se);	// end cap at pt[n]
			break;
		case CIRCLE_END:
			this.updateMbbCircleCap(n, this.pen.se);			// end cap at pt[n] {joj 22/2/18}
			break;
		}
	}

	// Line.updateMbb
	Line.prototype.updateMbb = function(opacity, drawT2D, clipped, flags) {
		//console.log("Line.updateMbb updated=" + this.updated + " lastUpdate=" + this.lastUpdate + " lastUpdateDraw=" + this.lastUpdateDraw + " asyncPhase=" + asyncPhase);
		if (flags || (this.updated && (this.lastUpdate != this.lastUpdateDraw || asyncPhase))) {	// async needed as multiple async events can be executed
			this.drawOpacity = opacity * this.opacity;
			this.clipped = (clipped || this.clipPath) ? 1 : 0;
			this.layer.mbbs.add(this.mbb);
			if (this.drawOpacity && (this.brush || this.pen || (this.txt.length && this.txtPen && this.font))) {
				this.drawT2D.set(this.transform2D);
				this.drawT2D.multiplyBA(drawT2D);
				let pw = this.pen.width / 2 + 1;
				this.mbb.set(this.minx - pw, this.miny - pw, this.maxx + pw, this.maxy + pw);	// not that accurate - oversized
				this.updateMbbCaps();
				this.drawT2D.transformMbb(this.mbb);
				this.layer.mbbs.add(this.mbb);
			} else {
				this.mbb.set(); // empty mbb
			}
			this.lastUpdateDraw = this.lastUpdate;	// NB:
		}
		this.updated = 0;
	}

	//
	// Line2 constructor)
	//
	// alternative Line constructor
	// a line is a list of points with the notional point <0,0> positioned at <x,y>
	// the points can be specified as either ABSOLUTE or RELATIVE to the previous point
	// since Line2 uses the first point as <x,y>, the remaining points have
	// to be adjusted accordingly if specified as ABSOLUTE
	//
	function Line2(grp, layer, options, pen) {
		let arg4 = arguments[4] || 0;
		let arg5 = arguments[5] || 0;
		let a = [grp, layer, options, pen, arg4, arg5, 0, 0];
		for (let i = 6; i < arguments.length; i += 2) {
			if (options & ABSOLUTE) {
				a.push(arguments[i] - arg4);		// make ABSOLUTE for Line!
				a.push(arguments[i + 1] - arg5);
			} else {
				a.push(arguments[i]);				// still RELATIVE for Line
				a.push(arguments[i + 1]);
			}
		}
		Line.apply(this, a);
	}
	Line2.prototype = Line.prototype;

	// Pie constructor
	function Pie() {
		arguments[2] |= PIE;	// options {joj 11/8/17}
		Arc.apply(this, arguments);
	}
	Pie.prototype = Arc.prototype;

	// Polygon constructor
	function Polygon(grp, layer, options, pen, brush, x, y) {
		let a = [grp, layer, options, pen, x, y];
		for (let i = 7; i < arguments.length; i++)
			a.push(arguments[i]);
		Line.apply(this, a);
		this.closed = 1;
		this.brush = brush;
	}
	Polygon.prototype = Line.prototype;

	// Rectangle constructor
	function Rectangle(grp, _layer, options, pen, brush, x, y, ix, iy, iw, ih, txtPen, font, txt) {
		//console.log("new Rectangle");
		this.grp = grp;
		this.layer = (_layer) ? _layer : layer[0];
		this.options = options;
		this.pen = pen;
		if (pen)
			pen.add(this);
		this.brush = brush;
		if (brush)
			brush.add(this);
		this.ptx = [];
		this.pty = [];
		this.ptx[0] = ix;
		this.pty[0] = iy;
		this.ptx[1] = ix + iw;
		this.pty[1] = iy + ih;
		this.calculateMinMax();
		this.sx = 1;
		this.sy = 1;
		this.pinx = 0;
		this.piny = 0;
		this.theta = 0;
		this.tx = x;
		this.ty = y;
		this.transform2D = new T2D();
		this.setT2D();
		this.txtPen = txtPen || defaultPen;
		this.font = font || defaultFont;
		this.txt = txt || "";
		if (arguments.length > 14) {
			let args = [this.txt];
			for (let i = 14; i < arguments.length; i++)
				args.push(arguments[i]);
			this.txt = sprintf.apply(this, args);
		}
		this.txtOffX = 0;
		this.txtOffY = 0;
		this.opacity = 1;
		this.rx = 0;
		this.ry = 0;
		this.savedState = 0;
		this.handler = [];
		this.clipped = 0;
		this.enter = 0;
		this.created = 2*tick + asyncPhase;
		this.updated = UPDATE;
		this.lastUpdate = 2*tick + asyncPhase;
		this.lastUpdateDraw = -1;
		this.mbb = new Mbb();
		this.drawOpacity = 1;
		this.clipPath = 0;			// {joj 14/7/17}
		this.drawT2D = new T2D();
		if (this.grp && ((options & NOATTACH) == 0))	// top group is not a member of a group!
			this.grp.add(this);		// add to group
		this.layer.add(this);		// add to layer
	}
	Rectangle.prototype = Object.create(GObj.prototype);

	// Rectangle.saveState
	Rectangle.prototype.saveState = function() {
		//console.log("Rectangle.saveState()");
		this.savedState.rx = this.rx;
		this.savedState.ry = this.ry
	}

	// Rectangle.restoreState
	Rectangle.prototype.restoreState = function() {
		//console.log("Rectangle.restoreState tick=" + tick);
		this.rx = this.savedState.rx;
		this.ry = this.savedState.ry;
	}

	// Rectangle.getTxtH
	Rectangle.prototype.getTxtH = function () {
		ctx.save();
		//ctx.font = this.font.toString();
		//let w = ctx.measureText(this.txt).width;
		ctx.restore();
		return 10;
	}

	// Rectangle.getTxtW
	Rectangle.prototype.getTxtW = function () {
		ctx.save();
		ctx.font = this.font.toString();
		let w = ctx.measureText(this.txt).width;
		ctx.restore();
		return w;
	}

	// Rectangle.setPt
	Rectangle.prototype.setPt = function(n, x, y, nsteps, interval, wait) {
		if (nsteps === undefined)
			nsteps = 0;
		if (interval === undefined)
			interval = 1;
		if (wait === undefined)
			wait = 0;
		if (n == 0) {
			this.ptx[0] = this.minx = x;
			this.pty[0] = this.miny = y;
		} else if (n == 1) {
			this.ptx[1] = this.maxx = x;
			this.pty[1] = this.maxy = y;
		}
		// TODO call tracker
	}

	// Rectangle.setRounded
	Rectangle.prototype.setRounded = function(rx, ry, nsteps, interval, wait) {
		if (rx < 0)	// must be +ve
			rx = 0;
		if (ry < 0)	// must be +ve
			ry = 0;
		if (nsteps === undefined)
			nsteps = 0;
		if (interval === undefined)
			interval = 1;
		if (wait === undefined)
			wait = 0;
		if ((this.rx == rx) && (this.ry == ry) && (wait == 0))
			return 0;
		if (nsteps == 0 || interval <= 0) {
			this.firstUpdate();
			this.rx = rx;
			this.ry = ry;
			this.update();
			return 0;
		}
		new RoundedTracker(this, rx, ry, nsteps, interval, wait);
		return wait;
	}

	// Rectangle.hit
	Rectangle.prototype.hit = function(x, y) {
		//console.log("Rectangle.hit");
		let r = 0;
		if (this.drawOpacity || (this.options & HITINVISIBLE)) {
			ctx.save();
			let t2D = new T2D();
			for (let grp = this; grp; grp = grp.grp)
				t2D.multiplyBA(grp.transform2D);
			ctx.beginPath();
			ctx.setTransform(t2D.a, t2D.b, t2D.c, t2D.d, t2D.e, t2D.f);
			let x0 = this.ptx[0];
			let y0 = this.pty[0];
			let x1 = this.ptx[1];
			let y1 = this.pty[1];
			if ((this.rx != 0) || (this.ry != 0)) {	// rounded corners
				let rx = (x1 < x0) ? -this.rx : this.rx;
				let ry = (y1 < y0) ? -this.ry : this.ry;
				ctx.moveTo(x0, y0 + ry);
				ctx.quadraticCurveTo(x0, y0, x0 + rx, y0);
				ctx.lineTo(x1 - rx, y0);
				ctx.quadraticCurveTo(x1, y0, x1, y0 + ry);
				ctx.lineTo(x1, y1 - ry);
				ctx.quadraticCurveTo(x1, y1, x1 - rx, y1);
				ctx.lineTo(x0 + rx, y1);
				ctx.quadraticCurveTo(x0, y1, x0, y1 - ry);
				ctx.closePath();
			} else {
				ctx.rect(x0, y0, x1 - x0, y1 - y0);
			}
			if (this.pen) {
				ctx.lineWidth = this.pen.width;
				r = ctx.isPointInStroke(x,y);
			}
			if (r == 0)
				r = ctx.isPointInPath(x, y);
			if (r && this.clipped) {
				ctx.setTransform(1, 0, 0, 1, 0, 0);
				this.setClip(ctx);
				r = ctx.isPointInPath(x, y);
			}
			ctx.restore();
		}
		return r ? 1 : 0;	// NEEDED
	}

	// Rectangle.draw
	Rectangle.prototype.draw = function (flags) {
		//console.log("Rectangle.draw");
		if (this.drawOpacity && (flags || this.layer.mbbs.overlap(this.mbb))) {
			let ctx = this.layer.ctx;
			ctx.save();
			if (this.clipped) {
				ctx.setTransform(sx, 0, 0, sy, tx, ty);
				this.setClip(ctx);
			} else {
				ctx.transform(this.drawT2D.a, this.drawT2D.b, this.drawT2D.c, this.drawT2D.d, this.drawT2D.e, this.drawT2D.f);
			}
			ctx.beginPath();
			let x0 = this.ptx[0];
			let y0 = this.pty[0];
			let x1 = this.ptx[1];
			let y1 = this.pty[1];
			if ((this.rx != 0) || (this.ry != 0)) {	// rounded corners
				let rx = (x1 < x0) ? -this.rx : this.rx;
				let ry = (y1 < y0) ? -this.ry : this.ry;
				ctx.moveTo(x0, y0 + ry);
				ctx.quadraticCurveTo(x0, y0, x0 + rx, y0);
				ctx.lineTo(x1 - rx, y0);
				ctx.quadraticCurveTo(x1, y0, x1, y0 + ry);
				ctx.lineTo(x1, y1 - ry);
				ctx.quadraticCurveTo(x1, y1, x1 - rx, y1);
				ctx.lineTo(x0 + rx, y1);
				ctx.quadraticCurveTo(x0, y1, x0, y1 - ry);
				ctx.closePath();
			} else {
				ctx.rect(x0, y0, x1 - x0, y1 - y0);
			}
			ctx.globalAlpha = this.drawOpacity;
			if (this.brush && this.brush.type != NULLBRUSH) {
				ctx.save();
				ctx.fillStyle = this.brush.fillStyle;
				if (this.brush.type == IMAGEBRUSH) {
					if (this.brush.options == 0) {
						ctx.setTransform(1, 0, 0, 1, 0, 0);
					} else {
						ctx.setTransform(1, 0, 0, 1, 0, 0);
						ctx.rotate(this.theta*Math.PI/180);
					}
				}
				ctx.fill();
				ctx.restore();
			}
			if (this.pen) {
				this.setLineStyle(ctx, this.pen);
				ctx.stroke();
			}
			this.drawTxt(ctx);
			ctx.restore();
		}
	}

	// Rectangle.updateMbb
	Rectangle.prototype.updateMbb = function(opacity, drawT2D, clipped, flags) {
		//console.log("Rectangle.updateMbb this.updated=" + this.updated + " asyncPhase=" + asyncPhase);
		if (flags || (this.updated && (this.lastUpdate != this.lastUpdateDraw || asyncPhase))) {	// async needed as multiple async events can be executed
			//console.log("tick=" + tick + " Rectangle Ellipse updateMbb txt=\"" + this.txt + "\" flags=" + flags + " lastUpdate=" + this.lastUpdate + " lastUpdateDraw=" + this.lastUpdateDraw + " asyncPhase=" + asyncPhase);
			this.drawOpacity = opacity * this.opacity;
			this.clipped = (clipped || this.clipPath) ? 1 : 0;
			this.layer.mbbs.add(this.mbb);
			let bGObj = (this.brush && this.brush.type != NULLBRUSH) || this.pen;
			let bTxt = this.txt.length && this.txtPen && this.font;
			if (this.drawOpacity && (bGObj || bTxt)) {
				this.drawT2D.set(this.transform2D);
				this.drawT2D.multiplyBA(drawT2D);
				this.mbb.set(this.minx, this.miny, this.maxx, this.maxy);
				this.mbb.inflate(1);	// {joj 12/7/17}
				if (this.pen)
					this.mbb.inflate(((this.pen.width == 0) ? 1 : (this.pen.width + 1) / 2));
				this.updateTxtMbb(bGObj, bTxt);
				this.drawT2D.transformMbb(this.mbb);
				this.layer.mbbs.add(this.mbb);
			} else {
				this.mbb.set();
			}
			this.lastUpdateDraw = this.lastUpdate;	// NB
		}
		this.updated = 0;
	}

	//
	// Rectangle2 constructor
	//
	function Rectangle2(grp, layer, options, pen, brush, x, y, iw, ih, txtPen, font, txt) {
		var args = [grp, layer, options, pen, brush, x, y, 0, 0, iw, ih, txtPen, font, txt];
		for (let i = 12; i < arguments.length; i++)
			args.push(arguments[i]);
		Rectangle.apply(this, args);
	}
	Rectangle2.prototype = Rectangle.prototype;

	//
	// Txt constructor
	//
	// NB: iw and ih set to 1 {joj 10/8/17}
	//
	function Txt(grp, layer, options, x, y, txtPen, font, txt) {
		var args = [grp, layer, options, 0, 0, x, y, 0, 0, 1, 1, txtPen, font, txt];
		for (let i = 8; i < arguments.length; i++)
			args.push(arguments[i]);
		Rectangle.apply(this, args);
	}
	Txt.prototype = Object.create(Rectangle.prototype);

	//
	// Spline constructor
	//
	// cardinal spline implemented using a Bezier curve
	//
	function Spline(grp, _layer, options, pen, brush, tension, x, y) {
		//console.log("new Spline()");
		this.grp = grp;
		this.layer = (_layer) ? _layer : layer[0];	// NB: _layer to avoid confusion with layer
		this.options = options;
		this.pen = pen;
		if (pen)
			pen.add(this);
		this.brush = brush;
		if (brush)
			brush.add(this);
		this.tension = tension;
		this.sx = 1;
		this.sy = 1;
		this.pinx = 0;
		this.piny = 0;
		this.theta = 0;
		this.tx = arguments[6];	// x
		this.ty = arguments[7];	// y
		this.transform2D = new T2D();
		this.setT2D();
		let npt = (arguments.length - 8) / 2;
		this.sptx = [];		// for spline points
		this.spty = [];
		this.ptx = [];		// drawn by converting to a Bezier
		this.pty = [];
		this.c0x = 0;		// used when converting spline to Bezier
		this.c0y = 0;
		this.c1x = 0;		// used when converting spline to Bezier
		this.c1y = 0;
		for (let i = 0; i < npt; i++) {
			this.sptx[i] = arguments[8 + i*2];
			this.spty[i] = arguments[8 + i*2 + 1];
			if (((options & ABSOLUTE) == 0) && (i > 0)) {
				this.sptx[i] += this.sptx[i-1];
				this.spty[i] += this.spty[i-1]
			}
		}
		//this.calculateMinMax();
		this.txtPen = defaultPen;
		this.font = defaultFont;
		this.txt = "";
		this.txtOffX = 0;
		this.txtOffY = 0;
		this.opacity = 1;
		this.savedState = 0;
		this.handler = [];
		this.clipped = 0;
		this.enter = 0;
		this.created = 2*tick + asyncPhase;
		this.updated = UPDATE;
		this.lastUpdate = 2*tick + asyncPhase;
		this.lastUpdateDraw = -1;
		this.mbb = new Mbb();
		this.drawOpacity = 1;
		this.clipPath = 0;				// {joj 14/7/17}
		this.drawT2D = new T2D();
		if ((options & NOATTACH) == 0)	// {joj 3/11/17}
			this.grp.add(this);			// add to group
		this.layer.add(this);			// add to layer
	}
	Spline.prototype = Object.create(GObj.prototype);

	// Spline.calcCurve helper
	Spline.prototype.calcCurve = function(p0, p1, p2, t) {
		let dx = this.sptx[p2] - this.sptx[p0];
		let dy = this.spty[p2] - this.spty[p0];
		this.c0x = this.sptx[p1] - t*dx;
		this.c0y = this.spty[p1] - t*dy;
		this.c1x = this.sptx[p1] + t*dx;
		this.c1y = this.spty[p1] + t*dy;
	}

	// Spline.calcCurveEnd helper
	Spline.prototype.calcCurveEnd = function(end, adj, t) {
		this.c0x = t*(this.sptx[adj] - this.sptx[end]) + this.sptx[end];
		this.c0y = t*(this.spty[adj] - this.spty[end]) + this.spty[end];
	}

	//
	// Spline.convertToBezier helper
	//
	// NB: code thanks to "a coder name Floris" http://floris.briolas.nl/floris/?p=144
	// NB: uses Beziers to provide Microsoft GDI+ cardinal splines
	//
	Spline.prototype.convertToBezier = function() {

		//console.log("convertToBezier");

		let npt = this.sptx.length;
		if (npt == 0)
			return;

		let closed = this.options & CLOSED;
		let nbp = npt*3 - 2;
		if (closed)
			nbp += 3;
		this.ptx.length = nbp;	// {joj 12/7/17}
		this.pty.length = nbp;	// {joj 12/7/17}
		let t = this.tension / 3;

		if (closed == 0) {
			this.calcCurveEnd(0, 1, t);
			this.ptx[0] = this.sptx[0];
			this.pty[0] = this.spty[0]
			this.ptx[1] = this.c0x;
			this.pty[1] = this.c0y;
		}

		for (let i = 0; i < npt - ((closed) ? 1 : 2); i++) {
			this.calcCurve(i, i+1, (i+2) % npt, t);
			this.ptx[3*i + 2] = this.c0x;
			this.pty[3*i + 2] = this.c0y;
			this.ptx[3*i + 3] = this.sptx[i+1];
			this.pty[3*i + 3] = this.spty[i+1];
			this.ptx[3*i + 4] = this.c1x;
			this.pty[3*i + 4] = this.c1y;
		}

		if (closed) {
			this.calcCurve(npt-1, 0, 1, t);
			this.ptx[nbp-2] = this.c0x;
			this.pty[nbp-2] = this.c0y;
			this.ptx[0] = this.sptx[0];
			this.pty[0] = this.spty[0];
			this.ptx[1] = this.c1x;
			this.pty[1] = this.c1y;
			this.ptx[nbp-1] = this.sptx[0];
			this.pty[nbp-1] = this.spty[0];
		} else {
			this.calcCurveEnd(npt-1, npt-2, t);
			this.ptx[nbp-2] = this.c0x;
			this.pty[nbp-2] = this.c0y;
			this.ptx[nbp-1] = this.sptx[npt-1];
			this.pty[nbp-1] = this.spty[npt-1];
		}

	}

	// Spline.draw
	Spline.prototype.draw = function(flags) {
		Bezier.prototype.draw.call(this, flags);
	}

	// Spline.saveState
	Spline.prototype.saveState = function() {
		//console.log("Spline.saveState tick=" + tick + " txt=" + this.txt + " x=" + this.tx + " y=" + this.ty);
		// no additional state to save
	}

	// Spline.restoreState
	Spline.prototype.restoreState = function() {
		//console.log("Spline.restoreState tick=" + tick + " txt=" + this.txt + " x=" + this.tx + " y=" + this.ty);
		// no additional state to restore
	}

	// Spline.getTension
	Spline.prototype.getTension = function() {
		return this.tension;
	}

	// Spline.hit
	Spline.prototype.hit = function(x, y) {
		//console.log("Spline.hit");
		return Bezier.prototype.hit.call(this, x, y);
	}

	// Spline.setTension
	Spline.prototype.setTension = function(tension) {
		if (this.tension != tension) {
			this.firstUpdate();
			this.tension = tension;
			this.update();
		}
	}

	//
	// Spline.setPt
	//
	// NB: only ABSOLUTE points supported
	//
	Spline.prototype.setPt = function(n, x, y, nsteps, interval, wait) {
		//console.log("Spline.setPt()");
		if (nsteps === undefined)
			nsteps = 0;
		if (interval === undefined)
			interval = 1;
		if (wait === undefined)
			wait = 0;
		if (nsteps == 0 || interval <= 0) {
			this.firstUpdate();
			this.sptx[n] = x;
			this.spty[n] = y;
			//this.calculateMinMax();
			this.update();
			return 0;
		}
		new PointTracker(this, n, x - this.sptx[n], y - this.spty[n], nsteps, interval, wait);
		return wait;
	}

	// Spline.updateMbb
	Spline.prototype.updateMbb = function(opacity, drawT2D, clipped, flags) {
		//console.log("Spline.updateMbb()");
		this.drawOpacity = opacity * this.opacity;
		if (flags || (this.updated && (this.lastUpdate != this.lastUpdateDraw || asyncPhase))) {	// async needed as multiple async events can be executed
			this.convertToBezier();
			this.clipped = (clipped || this.clipPath) ? 1 : 0;
			this.closed = this.options & CLOSED;
			this.layer.mbbs.add(this.mbb);
			let bGObj = (this.brush && this.brush.type != NULLBRUSH) || this.pen;
			let bTxt = this.txt.length && this.txtPen && this.font;
			if (this.drawOpacity && (bGObj || bTxt)) {
				this.drawT2D.set(this.transform2D);
				this.drawT2D.multiplyBA(drawT2D);
				this.mbb.set(this.minx, this.miny, this.maxx, this.maxy);
				this.mbb.inflate(1);
				if (this.pen)
					this.mbb.inflate(((this.pen.width == 0) ? 1 : (this.pen.width + 1) / 2));
				this.updateTxtMbb(bGObj, bTxt);
				this.drawT2D.transformMbb(this.mbb);
				this.layer.mbbs.add(this.mbb);
			} else {
				this.mbb.set();
			}
			this.lastUpdateDraw = this.lastUpdate;	// NB
		}
		this.updated = 0;
	}

	//
	// Group constructor
	//
	// gobjs always in order of creation
	// problem if gobj destroyed
	//
	function Group(grp, layer, options, x, y, ix, iy, iw, ih) {
		Rectangle.call(this, grp, layer, options, 0, 0, x, y, ix, iy, iw, ih, 0, 0, "");
		this.gobjs = [];
	}
	Group.prototype = Object.create(Rectangle.prototype);

	// Group.add
	Group.prototype.add = function(gobj) {
		//console.log("Group.add length=" + (this.gobjs.length + 1));
		this.firstUpdate();
		this.gobjs.push(gobj);
		this.update(UPDATEGOBJSLEN);
	}

	// Group.draw
	Group.prototype.draw = function(flags) {
		if (this.drawOpacity)
			Rectangle.prototype.draw.call(this, flags);
	}

	// Group.saveState
	Group.prototype.saveState = function() {
		//console.log("Group saveState tick=" + tick + " length=" + this.gobjs.length);
		this.savedState.length = this.gobjs.length;
	}

	// Group.restoreState
	Group.prototype.restoreState = function() {
		//console.log("Group restoreState tick=" + tick + " gobjs.length=" + this.gobjs.length + " new length l=" + (l+1));
		if (this.gobjs.length != this.savedState.length)
			this.gobjs.length = this.savedState.length;
	}

	// Group.updateMbb
	Group.prototype.updateMbb = function(opacity, drawT2D, clipped, flags) {
		//console.log("Group.updateMbb flags=" + flags + " gobsj.length=" + this.gobjs.length);
		this.drawOpacity = opacity * this.opacity;
		this.clipped = (clipped || this.clipPath) ? 1 : 0;
		Rectangle.prototype.updateMbb.call(this, opacity, drawT2D, this.clipped, flags);
		this.drawT2D.set(this.transform2D);
		this.drawT2D.multiplyBA(drawT2D);
		for (let i = 0; i < this.gobjs.length; i++)
			this.gobjs[i].updateMbb(opacity*this.opacity, this.drawT2D, this.clipped, flags);
	}

	//
	// Path constructor
	//
	// avoid using Path2D
	// not implemented in all browsers
	// difficult to do hit testing with clipping
	// isPointInStroke() and isPointInPath() doesn't taken into account clipping
	//
	function Path(path) {
		this.path = [];
		this.path.push(path);
	}

	// E$
	function E$(x, y, w, h) {
		return new Path({type:$EPATH, x:x, y:y, w:w, h:h});
	}

	// R$
	function R$(x, y, w, h) {
		return new Path({type:$RPATH, x:x, y:y, w:w, h:h});
	}

	//
	// global functions
	//

	// rgba
	//
	// red, green, blue and alpha in range 0 to 1)
	//
	function rgba(red, green, blue, alpha) {
		if (alpha === undefined)
			alpha = 1.0;
		red = ((red < 0.0) ? 0 : (red > 1.0) ? 1 : red) * 255;
		green = ((green < 0.0) ? 0 : (green > 1.0) ? 1 : green) * 255;
		blue = ((blue < 0.0) ? 0 : (blue > 1.0) ? 1 : blue) * 255;
		alpha = ((alpha < 0.0) ? 0 : (alpha > 1.0) ? 1 : alpha) * 255;
		return (alpha << 24) + (red << 16) + (green << 8) + (blue | 0);
	}

	// toRGBA helper
	function toRGBA(rgba) {
		let a = (rgba >> 24) & 0xff;
		let r = (rgba >> 16) & 0xff;
		let g = (rgba >> 8) & 0xff;
		let b = (rgba & 0xff);
		return "rgba(" + r + "," + g + "," + b + "," + a / 255 + ")";	// NB: alpha must be in range 0 to 1
	}

	// penVisible helper
	function penVisible(pen) {
		return pen && (pen.type != NULLPEN);
	}

	// brushVisible helper
	function brushVisible(brush ) {
		return brush && (brush.type != NULLBRUSH);
	}

	// setBgBrush
	function setBgBrush(brush) {
		if (bgBrush != brush) {
			$g[0].firstUpdate();
			bgBrush = brush;
			$g[0].update(UPDATEALL);
		}
	}

	// setBgPen
	function setBgPen(pen) {
		if (bgPen != pen) {
			$g[0].firstUpdate();
			bgPen = pen;
			$g[0].update(UPDATEALL);
		}
	}

	// setViewport
	function setViewport(_vx, _vy, _vw, _vh, _keepAspectRatio) {
		keepAspectRatio = (_keepAspectRatio === undefined) ? 1 : _keepAspectRatio;
		$g[0].ptx[0] = vx = _vx;
		$g[0].pty[0] = vy = _vy;
		vw = _vw;
		vh = _vh;
		$g[0].ptx[1] =  vx + vw;
		$g[0].pty[1] =  vy + vh;
		$g[0].minx = vx;			// {joj NEEDED 23/9/17}
		$g[0].miny = vy;			// {joj NEEDED 23/9/17}
		$g[0].maxx = vx + vw;		// {joj NEEDED 23/9/17}
		$g[0].maxy = vy + vh;		// {joj NEEDED 23/9/17}
		resize();
	}

	// getWVH
	function getWVH() {
		return canvas.clientHeight / sy;
	}

	// getWVW
	function getWVW() {
		return canvas.clientWidth / sx;
	}

	// getWH
	function getWH() {
		return canvas.clientHeight;
	}

	// getWW
	function getWW() {
		return canvas.clientWidth;
	}

	// resize
	function resize() {
		//console.log("resize");
		rtStart = performance.now();
		canvas.width = canvas.clientWidth;			// {joj 27/3/16} to handle width% canvas
		canvas.height = canvas.clientHeight;		// {joj 27/3/16} to handle height% canvas

		for (let i = 1; i < nlayer; i++) {
			layer[i].canvas.style.left = canvas.offsetLeft + "px";
			layer[i].canvas.style.top = canvas.offsetTop + "px";
			layer[i].canvas.width = canvas.width;
			layer[i].canvas.height = canvas.height;
		}

		if (overlay) {
			overlay.style.left = canvas.offsetLeft + "px";
			overlay.style.top = canvas.offsetTop + "px";
			overlay.width = canvas.width;
			overlay.height = canvas.height;
		}

		let h = (showStats) ? canvas.height - INFOFONTH - 4 : canvas.height;
		let w = canvas.width;
		sx = w/vw;
		sy = h/vh;
		tx = vx;
		ty = vy;
		if (keepAspectRatio) {
			if (sx > sy) {
				sx = sy;
				tx  -= (vw*sx - w)/2;
			} else {
				sy = sx;
				ty -= (vh*sy - h)/2;
			}
		}

		//console.log("div clientWidth=" + canvas.parentNode.clientWidth + " clientHeight=" + canvas.parentNode.clientHeight);
		//console.log("canvas width=" + canvas.width + " height=" + canvas.height);
		//console.log("canvas clientWidth=" + canvas.clientWidth + " clientHeight=" + canvas.clientHeight);
		//console.log("vx=" + vx + " vy=" + vy + " vw=" + vw + " vh=" + vh);
		//console.log("sx=" + sx + " sy=" + sy + " tx=" + tx + " ty=" + ty);

		if (!playZero)
			drawAll();
	}

	// drawAll
	function drawAll() {
		$g[0].updated |= UPDATEALL;
		drawChanges();
	}

	// drawChanges
	function drawChanges(flags) {
		//console.log("drawChanges tick=" + tick +" flags=" + flags + " asyncPhase=" + asyncPhase);
		if (flags === undefined)
			flags = 0;
		flags |= $g[0].updated & UPDATEALL;	// setBgBrush or setBgPen
		let dtStart = performance.now();
		clearMbbs();						// clear mbbs on overlay canvas
		t2D.set(sx, 0, 0, sy, tx, ty);
		$g[0].updateMbb(1, t2D, 0, flags);
		let redraw = 0;
		for (let i = 0; i < nlayer; i++) {
			if ((layer[i].opacity == 0) && (layer[i].flags == 0) && (layer[i].mbbs.nmbb == 0) && (flags == 0))
				continue
			redraw |= 1;
			let ctx = layer[i].ctx;
			ctx.save();
			ctx.beginPath();
			if (flags || layer[i].flags) {
				ctx.rect(0, 0, canvas.width, (showStats) ? canvas.height - INFOFONTH - 4 : canvas.height);
			} else {
				let mbbs = layer[i].mbbs;
				for (let j = 0; j < mbbs.nmbb; j++)
					ctx.rect(mbbs.mbb[j].x0, mbbs.mbb[j].y0, mbbs.mbb[j].width(), mbbs.mbb[j].height());
			}
			ctx.clip();					// create clip region from path
			if (i == 0) {
				ctx.fillStyle = bgBrush ? bgBrush.fillStyle : "white";		// globalAlpha?
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				if (bgPen) {
					$g[0].setLineStyle(ctx, bgPen);
					ctx.strokeRect(0, 0, canvas.width, canvas.height);;
				}
			} else {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
			}
			//console.log("drawChanges i=" + i + " gobjs.length=" + layer[i].gobjs.length);
			if (layer[i].opacity) {	// {joj 17/10/16}
				for (let j = 0; j < layer[i].gobjs.length; j++)
					layer[i].gobjs[j].draw(flags);
			}
			layer[i].flags = 0;
			ctx.restore();
		}
		if (redraw)
			(dir == 1) ? nff++ : nfb++;		// number of frames
		let now = performance.now();
		dtLast = now - dtStart;
		rtLast = now - rtStart;
		if (dir == 1) {
			dtf += dtLast;
			rtf += rtLast
		} else {
			dtb += dtLast;
			rtb += rtLast
		}
		swapMbbs();		// swap layer mbbs and clear mbbs
		drawInfoTip();
		drawStats();
		drawMbbs();
		asyncPhase = 0;	// clear asyncPhase {joj 28/11/17}
	}

	//
	// wheelHandler
	//
	// no need to set asynchPhase = 1 as no Vivio events handlers called
	//
	function wheelHandler(e) {
		//console.log("wheelEvent e.deltaY=" + e.deltaY + " e.deltaX=" + e.deltaX);
		let delta = e.deltaX + e.deltaY;	// fix for chrome when shift button pressed
		if (e.ctrlKey) {
			if (delta > 0) {
				if (tps < 100)
					setTPS(tps + 1, 1);
			} else {
				if (tps > 1)
					setTPS(tps - 1, 1);
			}
			showInfoTip("set speed: " + tps + " tps", 0, 1);
		} else {
			if (delta > 0) {
				dir = 1;
				if (e.shiftKey) {
					stop(1);
					if (eventQ) {
						playMode = SNAPTOCHKPT;
						rtStart = performance.now();
						playTo(-1);			// play to next check point or end of animation
						showInfoTip("snap to next checkpoint at tick " + tick, 0, 0);
						drawChanges();
						playMode = PLAY;
					} else {
						showInfoTip("NO more checkpoints (eventQ empty) tick " + tick, 0, 1);
					}
				} else if (eventQ && timer == 0) {
					playMode = SINGLESTEP;
					showInfoTip("step forward: tick " + (tick + 1), 0, 0);
					rtStart = performance.now();
					playTo(tick + 1);
					drawChanges();
					playMode = PLAY;
				}
			} else {
				if (e.shiftKey) {
					stop(1);
					dir = -1;
					let newTick = getPreviousCheckPt();
					if (newTick < tick) {
						playMode = SNAPTOCHKPT;
						showInfoTip("snap to previous checkpoint at tick " + newTick, 0, 0);
						rtStart = performance.now();
						goto(newTick);
						drawChanges();
						playMode = PLAY;
					} else {
						showInfoTip("NO more checkpoints tick " + newTick, 0, 1);
					}
				} else if (timer == 0) {
					playMode = SINGLESTEP;
					dir = -1;
					let newTick = (tick > 0) ? tick - 1 : 0;
					showInfoTip("step backward: tick " + newTick, 0, 0);
					rtStart = performance.now();
					//console.log("wheelHandler: goTo(" + newTick + ")");
					goto(newTick);	// goto 0 even if at 0
					drawChanges();
					playMode = PLAY;
				}
			}
		}
		e.preventDefault();	// why?
		return false;
	}

	//
	// mouseMoveHandler
	//
	// always called from user interface
	// don't remember mouse move events
	// set asyncPhase = 1 so changes redrawn
	//
	function mouseMoveHandler(e) {
		asyncPhase = 1;
		mouseX = e.offsetX;
		mouseY = e.offsetY;
		let x = (mouseX - tx) / sx;		// convert to viewport co-ordinates
		let y = (mouseY - ty) / sy;		// convert to viewport co-ordinates

		let flags = 0;
		if (e.button == 0)
			flags |= MB_LEFT;
		else if (e.button == 1)
			flags |= MB_MIDDLE;
		else if (e.button == 2)
			flags |= MB_RIGHT;
		if (e.shiftKey)
			flags |= MB_SHIFT;
		if (e.ctrlKey)
			flags |= MB_CTRL;
		if (e.altKey)
			flags |= MB_ALT;

		if (grab) {
			if (typeof grab == "function") { 	// {joj 28/11/17}
				grab(e);						// Menu.grab
			} else {
				//callEventHandler(grab.pc, grab.obj, MM, 0, flags, x, y);
				let handler = grab.handler["eventGRABBED"];
				for (let k = 0; k < handler.length; k++) {
					let r = callEventHandler(handler[k].pc, handler[k].obj, MM, 0, flags, x, y);
					if ((r & PROPAGATE) == 0)
						break;
				}
				drawChanges();	// clears asyncPhase {joj 28/11/17}
			}
			e.preventDefault();
			return false;
		}
		let redraw = 0;
		rtStart = performance.now();
		// console.log("mouseMoveHandler x=" + x + " y=" + y);
		FOR: {
			for (let i = nlayer - 1; i >= 0; i--) {
				if (layer[i].opacity == 0)	// {joj 17/10/16}
					continue;
				for (let j = layer[i].gobjs.length - 1; j >= 0; j--) {
					let g = layer[i].gobjs[j];
					if (g.handler["eventEE"]) {
						let hit = ((g.hit(x, y) || (g == $g[0] && (g.options & HITWINDOW) ? 1 : 0)) && inCanvas) ? 1 : 0;	// {joj 22/9/17}
						//console.log("hit=" + hit + " enter=" + g.enter);
						if (hit != g.enter) {
							g.enter = hit;
							redraw = 1;
							let handler = g.handler["eventEE"];
							for (let k = 0; k < handler.length; k++) {
								let r = callEventHandler(handler[k].pc, handler[k].obj, hit, x, y);
								if ((r & PROPAGATE) == 0)
									break FOR;
							}
						}
					}
				}
			}
		}
		if (redraw)
			drawChanges();
		canvas.focus();
		asyncPhase = 0;		// {joj 21/11/17}
	}

	//
	// mouseEnterHandler
	//
	// fired when mouse enters canvas {joj 15/07/17	NOT generated by QBrowserEngine}
	// simply calls mouseMoveHandler
	//
	function mouseEnterHandler(e) {
		//console.log("mouseEnterHandler");
		inCanvas = 1;
		mouseMoveHandler(e);
	}

	//
	// mouseLeaveHandler
	//
	// fired when mouse leaves canvas {joj 15/07/17	NOT generated by QBrowserEngine}
	// simply calls mouseMoveHandler
	//
	function mouseLeaveHandler(e) {
		//console.log("mouseLeaveHandler");
		inCanvas = 0;
		mouseMoveHandler(e);
	}

	//
	// handleMBEvent
	//
	// always called from user interface
	// callEventHandler creates a separate thread to execute event function
	// set asyncPhase = 1 so changes redrawn
	//
	function handleMBEvent(e, down, flags, x, y) {
		//console.log("handleMBEvent down=" + down + " flags=" + (flags | 0) + " x=" + x + " y=" + y);
		rtStart = performance.now();
		//let redraw = 0;
		//let remember = 0;
		FOR: {
			for (let i = nlayer - 1; i >= 0; i--) {
				if (layer[i].opacity == 0)	// {joj 17/10/16}
					continue;
				for (let j = layer[i].gobjs.length - 1; j >= 0 ; j--) {
					if (layer[i].gobjs[j].handler["eventMB"]) {
						if (layer[i].gobjs[j].hit(x, y)) {
							if (asyncPhase == 0)			// first hit indicates a new path so...
								removeFutureAsyncEvents();	// need to remove future ASYNC events
							let handler = layer[i].gobjs[j].handler["eventMB"];
							for (let k = 0; k < handler.length; k++) {
								addToAsyncEventQ(new AsyncEvent(tick, callEventHandler.bind(null, handler[k].pc, handler[k].obj, down, flags, x, y)));
								let r = callEventHandler(handler[k].pc, handler[k].obj, down, flags, x, y);
								asyncPhase = 1;
//								if (r & REMEMBER)
//									addToAsyncEventQ(new AsyncEvent(tick, callEventHandler.bind(null, handler[k].pc, handler[k].obj, down, flags, x, y)));
								if ((r & PROPAGATE) == 0)
									break FOR;
							}
						}
					}
				}
			}
		}
		if (asyncPhase) {	// event handled
			drawChanges();	// clears asyncPhase {joj 28/11/17}
			return;
		}

		if (down) {
			if (flags & MB_LEFT) {
				if (flags & MB_SHIFT && flags & MB_CTRL) {
					et = nff = nfb = rtf = rtb = dtf = dtb = 0;
					etStart = performance.now();
					showInfoTip("clear stats", 1, 1);
					drawStats();
				} else if (flags & MB_SHIFT) {
					showStats = showStats ? 0 : 1
					if (useSessionStorage)
						sessionStorage.setItem("showStats", showStats);
					showInfoTip(showStats ? "show stats" : "hide stats", 0, 0);
					resize();
				} else if (flags & MB_CTRL) {
					createOverlay();
					clearMbbs();
					showMbbs = showMbbs ? 0 : 1;
					if (useSessionStorage)
						sessionStorage.setItem("showMbbs", showMbbs);
					showInfoTip(showMbbs ? "show mbbs" : "hide mbbs", 0, 1);
				} else {
					if (timer) {
						stop(1);
						showInfoTip("stop", 0, 1);
					} else {
						if (eventQ) {						// {joj 12/7/17}
							start(1);
							showInfoTip("start", 0, 1);
						}
					}
				}
			} else if (flags & MB_RIGHT) {	// {joj 28/11/17}
				createOverlay();			// {joj 28/11/17}
				contextMenu.show(e);		// {joj 28/11/17}
			}
		}
	}

	//
	// mouseButtonHandler
	//
	// callEventHandler creates a separate thread to execute event function
	// set asyncPhase = 1 so changes redrawn
	//
	function mouseButtonHandler(e) {
		mouseX = e.offsetX;
		mouseY = e.offsetY;
		if (showStats && (mouseY > canvas.clientHeight - INFOFONTH - 4 - 1))
			return;
		let down = (e.type == "mousedown") ? 1 : 0;	// {joj 11/7/17}
		let flags = 0;
		let x = (mouseX - tx) / sx;		// convert to viewport co-ordinates
		let y = (mouseY - ty) / sy;		// convert to viewport co-ordinates
		if (e.button == 0)
			flags |= MB_LEFT;
		else if (e.button == 1)
			flags |= MB_MIDDLE;
		else if (e.button == 2)
			flags |= MB_RIGHT;
		if (e.shiftKey)
			flags |= MB_SHIFT;
		if (e.ctrlKey)
			flags |= MB_CTRL;
		if (e.altKey)
			flags |= MB_ALT;
		if (grab) {
			if (typeof grab == "function") { 	// {joj 28/11/17}
				grab(e);						// Menu.grab
			} else {
				let handler = grab.handler["eventGRABBED"];
				for (let k = 0; k < handler.length; k++) {
					asyncPhase = 1;
					let r = callEventHandler(handler[k].pc, handler[k].obj, MB, down, flags, x, y);
					if ((r & PROPAGATE) == 0)
						break;
				}
				if (asyncPhase)
					drawChanges();	// clears asyncPhase {joj 28/11/17}
			}

		} else {
			handleMBEvent(e, down, flags, x, y);
		}
		e.preventDefault();
		return false;
	}

	//
	// keyDownHandler
	//
	// use e.which for key {joj 26/10/17}
	// no need to set asynchPhase = 1 as no Vivio events handlers called
	//
	function keyDownHandler(e) {
		var key = e.key === undefined ? e.code : e.key;
		//console.log("keyDownHandler: which=" + e.which + " key=" + key + " repeat=" + e.repeat);
		if (key == "ArrowUp") {
			if (e.shiftKey && e.ctrlKey) {
				etf = etb = nff = nfb = rtf = rtb = dtf = dtb = 0;
				etStart = performance.now();
				showInfoTip("clear stats", 1, 1);
				drawStats();
			} else if (e.shiftKey) {
				showStats = showStats ? 0 : 1;
				if (useSessionStorage)
					sessionStorage.setItem("showStats", showStats);
				showInfoTip(showStats ? "show stats" : "hide stats", 1, 0);
				resize();
			} else if (e.ctrlKey) {
				createOverlay();
				clearMbbs();
				showMbbs = showMbbs ? 0 : 1;
				if (useSessionStorage)
					sessionStorage.setItem("showMbbs", showMbbs);
				showInfoTip(showMbbs ? "show mbbs" : "hide mbbs", 1, 1);
			} else {
				stop(0);
				etf = etb = nff = nfb = rtf = rtb = dtf = dtb = 0;
				rtStart = performance.now();
				goto(-1);
				showInfoTip("reset", 1, 0);
				drawAll();
			}
			e.preventDefault();
		} else if (key == "ArrowRight") {
			dir = 1;
			if (e.ctrlKey) {
				if (tps < 100)
					setTPS(tps + 1, 1);
				showInfoTip("speed: " + tps + " tps", 1, 1);
			} else if (e.shiftKey) {
				playMode = SNAPTOCHKPT;
				rtStart = performance.now();
				playTo(-1);
				showInfoTip("snap to next checkpoint at tick " + tick, 1, 0);
				drawChanges();
				playMode = PLAY;
			} else if (eventQ && timer == 0) {
				showInfoTip("step forward: tick " + (tick + 1), 1, 0);
				rtStart = performance.now();
				playTo(tick + 1);
				drawChanges();
			}
			e.preventDefault();
		} else if (key == "ArrowLeft") {
			if (e.ctrlKey) {
				if (tps > 1)
					setTPS(tps - 1, 1);
				showInfoTip("speed: " + tps + " tps", 1, 1);
			} else if (e.shiftKey) {
				playMode = SNAPTOCHKPT;
				dir = -1;
				stop(1);
				let toTick = getPreviousCheckPt();
				showInfoTip("snap to previous checkpoint at tick " + toTick, 1, 0);
				rtStart = performance.now();
				goto(toTick);
				drawChanges();
				playMode = PLAY;
			} else if (timer == 0) {
				playMode = SINGLESTEP;
				dir = -1;
				let newTick = (tick > 0) ? tick - 1 : 0;
				showInfoTip("step backward: tick " + newTick, 1, 0);
				rtStart = performance.now();
				goto(newTick);	// goto 0 even if at 0
				drawChanges();
				playMode = PLAY;
			}
			e.preventDefault();
		} else if (key == "ArrowDown") {
			if (timer) {
				stop(1);
				showInfoTip("stop", 1, 1);
			} else {
				start(1);
				showInfoTip("start", 1, 1);
			}
			e.preventDefault();
		}
		return false;
	}

	//
	// keyPressHandler
	//
	// use e.which for key {joj 26/10/17}
	// set asyncPhase = 1 so changes redrawn
	//
	function keyPressHandler(e) {
		asyncPhase = 1;
		let flags = 0;
		if (e.button == 0)
			flags |= MB_LEFT;
		else if (e.button == 1)
			flags |= MB_MIDDLE;
		else if (e.button == 2)
			flags |= MB_RIGHT;
		if (e.shiftKey)
			flags |= MB_SHIFT;
		if (e.ctrlKey)
			flags |= MB_CTRL;
		if (e.altKey)
			flags |= MB_ALT;
		console.log("keyPressHandler: which=" + e.which + " flags=" + flags + " repeat=" + e.repeat);
		let key = e.which;
		if (e.key == "Delete")
			key = 127;
		let x = (mouseX - tx) / sx;		// convert to viewport co-ordinates
		let y = (mouseY - ty) / sy;		// convert to viewport co-ordinates
		let redraw = 0;
		let remember = 0;
		rtStart = performance.now();
		FOR: {
			for (let i = nlayer - 1; i >= 0; i--) {
				for (let j = layer[i].gobjs.length - 1; j >= 0 ; j--) {
					if (layer[i].gobjs[j].handler["eventKEY"]) {
						let g = layer[i].gobjs[j];
						if (g.hit(x, y)) {
							if (redraw == 0)				// first hit indicates a new path so...
								removeFutureAsyncEvents();	// need to remove future ASYNC events
							redraw = 1;
							let handler = g.handler["eventKEY"];
							for (let k = 0; k < handler.length; k++) {
								let r = callEventHandler(handler[k].pc, handler[k].obj, key, flags, x, y);
								if (r & REMEMBER)
									addToAsyncEventQ(new AsyncEvent(tick, callEventHandler.bind(null, handler[k].pc, handler[k].obj, key, flags, x, y)));
								if ((r & PROPAGATE) == 0)
									break FOR;
							}
						}
					}
				}
			}
		}
		if (redraw)
			drawChanges();
		asyncPhase = 0;
		return false;
	}

	//
	// playAddedEvents
	//
	// play events added by async events (eg fork)
	//
	function playAddedEvents() {
		//console.log("playAddedEvents");
		while (eventQ) {
			let e = eventQ;
			if (e.tick > tick || e.typ == ASYNC)
				break;
			eventQ = eventQ.next;
			if (e.typ == TRACKER) {
				e.tracker.action();
			} else if (e.typ == RESUMETHREAD) {
				execute(e.thread);
			}
		}
	}

	//
	// playTo
	//
	// saveState at fixed intervals (eg every 1024 ticks) when playing backwards
	// sst can be changed programatically
	//
	function playTo(toTick) {
		//console.log("playTo toTick=" +  toTick);
		atCheckPoint = 0;
		while (eventQ) {
			let e = eventQ;
			if (toTick == -1) {
				if (atCheckPoint) // && ((e.tick > tick) || (e.tick == tick && e.typ == ASYNC)))
					break;
			} else if ((e.tick > toTick) || (e.tick == toTick && e.typ == ASYNC)) {
				tick = toTick;
				break;
			}
			if (dir == -1) { // check position of this code relative to tests above
				let nextSaveTick = ((tick + sst - 1) / sst | 0) * sst;	// integer
				if (((e.tick > nextSaveTick) || (e.tick == nextSaveTick && e.typ == ASYNC)) && savedState.tick != nextSaveTick) {
					tick = nextSaveTick;	// make sure savedState has correct timestamp
					saveState();
				}
			}
			eventQ = eventQ.next;
			tick = e.tick;
			if (e.typ == TRACKER) {
				e.tracker.action();
			} else if (e.typ == RESUMETHREAD) {
				execute(e.thread);
			} else {
				//console.log("play async event");
				asyncPhase = 1;
				e.handler();
				lastAsyncEvent = e;
				playAddedEvents();	// {joj 22/11/17}
				asyncPhase = 0;		// clear after playAddedEvents so changes redrawn
			}
		}
	}

	// goto
	function goto(toTick) {
		//console.log("goto(" + toTick + ")");
		asyncPhase = 0;	// {joj 15/7/16}
		if (toTick == -1) {
			stop(1);
			for (let i = 1; i < nlayer; i++)				// destroy all layers except...
				document.body.removeChild(layer[i].canvas);	// layer [0] {joj 16/10/16}
			layer.length = nlayer = 0;						// {joj 16/10/16}
			$g.length = 0;									// reset globals
			vobjs.length = 0;								// reset vobjs
			aobjs.length = 0;								// reset aobjs
			handler.length = 0;								// reset global event handlers
			checkPt.length = 0;
			savedState = 0;
			atCheckPoint = 0;
			eventQ = 0;
			asyncEventQ.length = 0;
			tick = 0;
			new Layer();
			playZero = 1;
			$g[0] = new Group(0, 0, 0, 0, 0, 0, 0, canvas.clientWidth, canvas.clientHeight);
			fork(0);
			playTo(0);
			saveState();
			playZero = 0;
			playMode = PLAY;
			return;
		}
		restoreState(toTick); // restore to nearest state
		//if (handler["eventStartStop"]) {
		//	for (let i = 0; i < handler["eventStartStop"].length; i++)
		//		callEventHandler(handler["eventStartStop"][i].pc, handler["eventStartStop"][i].obj, isRunning());
		//}
		//if (handler["eventSetTPS"]) {
		//	for (let i = 0; i < handler["eventSetTPS"].length; i++)
		//		callEventHandler(handler["eventSetTPS"][i].pc, handler["eventSetTPS"][i].obj, tps);
		//}
		playTo(toTick);
	}

	// animate
	function animate(timeStamp) {
		timer = requestAnimationFrame(animate);
		rtStart = performance.now();
		let dTick = ((timeStamp - startTimeStamp) / 1000 * tps) | 0;
		let toTick = (dir == 1) ? startTick + dTick : startTick - dTick;
		if (dir == 1) {
			if (tick == toTick)
				return;
			while (eventQ) {
				let e = eventQ;
				if ((e.tick > toTick) || (e.tick == toTick && e.typ == ASYNC))
					break;
				tick = e.tick;
				eventQ = eventQ.next;
				if (e.typ == TRACKER) {
					e.tracker.action();
				} else if (e.typ == RESUMETHREAD){
					execute(e.thread);
				} else {
					//console.log("animate: async event");
					//asyncPhase = 1;
					e.handler();
					lastAsyncEvent = e;
					playAddedEvents();	// {joj 22/11/17}
					asyncPhase = 0;		// clear after playAddedEvents so changes redrawn
				}
			}
			//asyncPhase = 0; //{joj 24/9/17}
			if (handler["tick"]) {
				for (let i = 0; i < handler["tick"].length; i++)
					callEventHandler(handler["tick"][i], 0, tick);
			}
			tick = toTick;
			drawChanges();
			if (eventQ == 0)
				stop(1);	// {joj 27/10/17}
		} else {
			if (toTick < 0)
				toTick = 0;
			if (tick == toTick)
				return;
			goto(toTick);
			if (tick == 0) {
				stop(0);
				dir = 1;
			}
			drawChanges();
		}
	}

	//
	// fire
	//
	// call global "eventFire" handlers
	//
	function fire(s) {
		//console.log(s);
		if (handler["eventFire"]) {
			for (let i = 0; i < handler["eventFire"].length; i++)
				callEventHandler(handler["eventFire"][i], 0, s);
		}
		drawChanges();
	}

	// load
	function load(VCode) {
		//console.log("load");
		vcode = new VCode(this);
		execute = vcode.execute;
		resumeThread = vcode.resumeThread;
		suspendThread = vcode.suspendThread;
		getThread = vcode.getThread;
		waitTracker = vcode.waitTracker;
		asyncPhase = 0;									// {joj 15/7/16}
		stop(1);
		for (let i = 1; i < nlayer; i++)				// destroy all layers except...
			document.body.removeChild(layer[i].canvas);	// layer [0] {joj 16/10/16}
		layer.length = nlayer = 0;						// {joj 16/10/16}
		$g.length = 0;									// reset globals
		vobjs.length = 0;								// reset vobjs
		aobjs.length = 0;								// reset aobjs
		handler.length = 0;								// reset global event handlers
		checkPt.length = 0;
		savedState = 0;
		atCheckPoint = 0;
		eventQ = 0;
		asyncEventQ.length = 0;
		tick = 0;
		new Layer();
		playZero = 1;
		$g[0] = new Group(0, 0, 0, 0, 0, 0, 0, canvas.clientWidth, canvas.clientHeight);
		fork(0);
		playTo(0);
		saveState();
		playZero = 0;
		playMode = PLAY;
		drawAll();
	}

	// Menu constructor
	function Menu(items, action, h) {
		this.items = items.split("/");
		this.x = 0;
		this.y = 0;
		this.w = 0;
		this.action = action;
		this.h = (h === undefined) ? 16 : h;
		this.selected = -1;
		this.rxy = 2;
	}

	// Menu.show
	Menu.prototype.show = function(e) {
		overlayCtx.save();
		this.x = (e.clientX | 0) - 0.5;
		this.y = (e.clientY | 0) - 0.5;
		overlayCtx.font = this.h + "px Calibri";
		for (let i = 0; i < this.items.length; i++) {
			let w = overlayCtx.measureText(this.items[i]).width;
			if (w > this.w)
				this.w = w + 0.5 | 0;
		}
		this.w += this.h;
		overlayCtx.fillStyle = "#ffffff";
		overlayCtx.fillRect(this.x, this.y, this.w, this.items.length*this.h);
		overlayCtx.strokeStyle = "#000000";
		overlayCtx.strokeRect(this.x, this.y, this.w, this.items.length*this.h);
		overlayCtx.textBaseline = "bottom";
		overlayCtx.fillStyle = "#000000";
		overlayCtx.strokeStyle = "#e0e0e0";
		overlayCtx.lineWidth = 1;
		for (let i = 0; i < this.items.length; i++) {
			if (this.items[i].length) {
				overlayCtx.fillText(this.items[i], this.x + this.h/2, this.y + i*this.h + this.h, this.w - this.h, this.h);
			} else {
				overlayCtx.beginPath();
				overlayCtx.moveTo(this.x + this.h/2, this.y + i*this.h + this.h/2);
				overlayCtx.lineTo(this.x + this.w - this.h, this.y + i*this.h + this.h/2);
				overlayCtx.stroke();
			}
		}
		overlayCtx.restore();
		grab = this.grab.bind(this);
	}

	// Menu.hide
	Menu.prototype.hide = function() {
		overlayCtx.save();
		overlayCtx.clearRect(this.x - 1, this.y - 1, this.w + 2, this.items.length*this.h + 2);
		overlayCtx.restore();
		grab = 0;
	}

	// Menu.drawItem
	Menu.prototype.drawItem = function(i, selected) {
		if (this.items[i].length) {
			overlayCtx.save();
			overlayCtx.font = this.h + "px Calibri";
			overlayCtx.textBaseline = "bottom";
			overlayCtx.fillStyle = "#ffffff";
			overlayCtx.fillRect(this.x, this.y + this.selected*this.h, this.w, this.h);
			overlayCtx.fillStyle = "#000000";
			overlayCtx.fillText(this.items[i], this.x + this.h/2, this.y + this.selected*this.h + this.h, this.w - this.h, this.h);
			if (selected) {
				let x = this.x + 2
				let y = this.y + i * this.h + 2;
				let w = this.w - 4;
				let h = this.h - 4;
				let r = this.rxy;
				overlayCtx.strokeStyle = "#6495ED"; // cornflower blue
				overlayCtx.beginPath();
				overlayCtx.moveTo(x + r, y);
				overlayCtx.arcTo(x + w, y, x + w, y + r, r);
				overlayCtx.arcTo(x + w, y + h, x + w - r, y + h, r);
				overlayCtx.arcTo(x, y + h, x, y + h - r, r);
				overlayCtx.arcTo(x, y, x + r, y, r);
				overlayCtx.stroke();
			}
			overlayCtx.strokeStyle = "#000000";
			overlayCtx.strokeRect(this.x, this.y, this.w, this.items.length*this.h);
			overlayCtx.restore();
		}
	}

	// Menu.grab
	Menu.prototype.grab = function(e) {
		let hit = (e.clientX > this.x) && (e.clientX < this.x + this.w + this.h) && (e.clientY > this.y) && (e.clientY < this.y + this.items.length*this.h);
		if (hit == 0) {
			if ((e.type == "mousemove") && (this.selected != -1)) {
				this.drawItem(this.selected, 0);
				this.selected = -1;
			} else if ((e.type == "mousedown") || (e.type == "mouseup")) {
				this.hide()
			}
		} else {
			let selected = (e.clientY - this.y) / this.h | 0;
			if (e.type == "mousemove") {
				if (this.selected != selected) {
					if (this.selected != -1)
						this.drawItem(this.selected, 0);
					this.selected = selected;
					this.drawItem(this.selected, 1);
				}
			} else if (e.type == "mousedown") {
				this.hide()
				this.action(this.selected);
			}
		}
		e.preventDefault();
	}

	// contextMenuAction
	function contextMenuAction(v) {
		console.log("menuAction ", v);
		if (v == 0) {
			reset();
			drawAll();
		} else if (v == 2) {
			//for (let i = 1; i < nlayer; i++)
			//	ctx.drawImage(layer[i].canvas, 0, 0);
			//let img = canvas.toDataURL();
			//drawChanges();	// should this be drawALL() ?
			//window.location = img;
		}
	}

	// run
	function run() {
		//console.log("run()\n");

		testFlag = (location.search == "?vivioTestFlag=1") ? 1 : 0;	// simple test {joj 28/9/17}

		isChrome = navigator.userAgent.indexOf("Chrome") > -1;
		isFF = navigator.userAgent.indexOf("Firefox") > -1;
		useSessionStorage = isChrome || location.protocol == "http:" || location.protocol == "https:";

		addEventListener("resize", resize, false);
		canvas = document.getElementById(canvasID);
		if (canvas.mozOpaque !== undefined)
			canvas.mozOpaque = true;
		if (canvas.style.zIndex == "")
			canvas.style.zIndex = 0;
		canvas.focus();
		canvas.addEventListener("wheel", wheelHandler, false);
		canvas.addEventListener("mousemove", mouseMoveHandler, false);
		canvas.addEventListener("mouseenter", mouseEnterHandler, false);
		canvas.addEventListener("mouseleave", mouseLeaveHandler, false);
		canvas.addEventListener("mousedown", mouseButtonHandler, false);
		canvas.addEventListener("mouseup", mouseButtonHandler, false);
		canvas.addEventListener("keydown", keyDownHandler, false);
		canvas.addEventListener("keypress", keyPressHandler, false);
		contextMenu = new Menu("reset//view image", contextMenuAction);
		canvas.addEventListener("contextmenu", mouseButtonHandler, false);		// {joj 28/11/17}
		ctx = canvas.getContext("2d");
		new Layer();

		if (useSessionStorage) {
			showStats = sessionStorage.getItem("showStats") | 0;
			showMbbs = sessionStorage.getItem("showMbbs") | 0
		}
		if (showMbbs)
			createOverlay();

		rtStart = performance.now();
		playZero = 1;
		$g[0] = new Group(0, 0, 0, 0, 0, 0, 0, canvas.clientWidth, canvas.clientHeight);
		fork(0);
		playTo(testFlag ? -1 : 0);	// {joj 3/11/17}

		saveState();
		playZero = 0;
		drawAll();
	}

	//
	// sprintf
	//
	// Copyright (C) 2010 Jakob Westhoff
	//
	function sprintf(format) {

		if (typeof format != 'string')
			throw "sprintf: The first arguments need to be a valid format string.";

		//
		// Define the regex to match a formating string
		// The regex consists of the following parts:
		// percent sign to indicate the start
		// (optional) sign specifier
		// (optional) padding specifier
		// (optional) alignment specifier
		// (optional) width specifier
		// (optional) precision specifier
		// type specifier:
		//  % - literal percent sign
		//  b - binary number
		//  c - ASCII character represented by the given value
		//  d - signed decimal number
		//  f - floating point value
		//  o - octal number
		//  s - string
		//  x - hexadecimal number (lowercase characters)
		//  X - hexadecimal number (uppercase characters)
		//
		var r = new RegExp( /%(\+)?([0 ]|'(.))?(-)?([0-9]+)?(\.([0-9]+))?([%bcdfosxX])/g );

		//
		// Each format string is splitted into the following parts:
		// 0: Full format string
		// 1: sign specifier (+)
		// 2: padding specifier (0/<space>/'<any char>)
		// 3: if the padding character starts with a ' this will be the real
		//    padding character
		// 4: alignment specifier
		// 5: width specifier
		// 6: precision specifier including the dot
		// 7: precision specifier without the dot
		// 8: type specifier
		//
		var parts = [];
		var paramIndex = 1;
		var part; // {joj}
		while (part = r.exec(format)) {

			// Check if an input value has been provided, for the current
			// format string (no argument needed for %%)
			if (( paramIndex >= arguments.length) && (part[8] != '%'))
				throw "sprintf: At least one argument was missing.";

			parts[parts.length] = {
				begin: part.index,													// beginning of the part in the string
				end: part.index + part[0].length,									// end of the part in the string
				sign: (part[1] == '+'),												// force sign
				negative: (parseFloat(arguments[paramIndex]) < 0) ? true : false,	// is the given data negative
				padding: (part[2] == undefined)										// padding character (default: <space>)
					? (' ')															// default
					: (( part[2].substring(0, 1) == "'")
					? (part[3])														// use special char
					: (part[2])														// use normal <space> or zero
				),
				alignLeft: (part[4] == '-'),										// should the output be aligned left?
				width: ( part[5] != undefined ) ? part[5] : false,					// width specifier (number or false)
				precision: ( part[7] != undefined ) ? part[7] : false,				// precision specifier (number or false)
				type: part[8],														// type specifier
				data: (part[8] != '%') ? String(arguments[paramIndex++]) : false	// the given data associated with this part converted to a string
			}
		}

		var newString = "";
		var start = 0;
		for (var i = 0; i < parts.length; ++i) {									// generate our new formated string
			newString += format.substring(start, parts[i].begin);					// add first unformated string part
			start = parts[i].end;													// mark the new string start

			//
			// create the appropriate preformat substitution
			// this substitution is only the correct type conversion. All the
			// different options and flags haven't been applied to it at this
			// point
			//
			var preSubstitution = "";
			switch (parts[i].type) {
			case '%':
				preSubstitution = "%";
				break;
			case 'b':
				preSubstitution = Math.abs(parseInt(parts[i].data)).toString(2);
				break;
			case 'c':
				preSubstitution = String.fromCharCode(Math.abs(parseInt(parts[i].data)));
				break;
			case 'd':
				preSubstitution = String(Math.abs(parseInt(parts[i].data)));
				break;
			case 'f':
				preSubstitution = (parts[i].precision === false)
					? (String((Math.abs(parseFloat( parts[i].data)))))
					: (Math.abs(parseFloat(parts[i].data)).toFixed(parts[i].precision));
				break;
			case 'o':
				preSubstitution = Math.abs(parseInt(parts[i].data)).toString(8);
				break;
			case 's':
				preSubstitution = parts[i].data.substring(0, parts[i].precision ? parts[i].precision : parts[i].data.length);	// Cut if precision is defined
				break;
			case 'x':
				preSubstitution = Math.abs(parseInt(parts[i].data)).toString(16).toLowerCase();
				break;
			case 'X':
				preSubstitution = Math.abs(parseInt(parts[i].data)).toString(16).toUpperCase();
				break;
			default:
				throw 'sprintf: Unknown type "' + parts[i].type + '" detected. This should never happen. Maybe the regex is wrong.';
			}

			//
			// % character is a special type and does not need further processing
			//
			if (parts[i].type ==  "%") {
				newString += preSubstitution;
				continue;
			}

			//
			// modify the preSubstitution by taking sign, padding and width into account
			// pad the string based on the given width
			//
			//if (parts[i].width != false) {
			if (parts[i].width) {
				if (parts[i].width > preSubstitution.length) {				// padding needed?
					var origLength = preSubstitution.length;
					for (var j = 0; j < parts[i].width - origLength; ++j)
						//preSubstitution = (parts[i].alignLeft == true) ? (preSubstitution + parts[i].padding) : (parts[i].padding + preSubstitution);
						preSubstitution = (parts[i].alignLeft) ? (preSubstitution + parts[i].padding) : (parts[i].padding + preSubstitution);
				}
			}

			//
			// add a sign symbol if neccessary or enforced, but only if we are not handling a string
			//
			if (parts[i].type == 'b' || parts[i].type == 'd' || parts[i].type == 'o' || parts[i].type == 'f' || parts[i].type == 'x' || parts[i].type == 'X') {
				//if (parts[i].negative == true) {
				if (parts[i].negative) {
					preSubstitution = "-" + preSubstitution;
				//} else if (parts[i].sign == true ) {
				} else if (parts[i].sign) {
					preSubstitution = "+" + preSubstitution;
				}
			}
			newString += preSubstitution;							// add the substitution to the new string

		}

		newString += format.substring(start, format.length);		// add the remaining part of format string
		return newString;
	}

	// clock
	function clock() {
		return Date.now();
	}

	// getTPS
	function getTPS() {
		return tps;
	}

	// setTPS
	function setTPS(newTPS, fromUI) {
		if (fromUI === undefined)
			fromUI = 0;
		tps = newTPS
		if (fromUI && handler["eventSetTPS"]) {
			for (let i = 0; i < handler["eventSetTPS"].length; i++) {
				asyncPhase = 1;
				callEventHandler(handler["eventSetTPS"][i].pc, handler["eventSetTPS"][i].obj, tps);
			}
			if (asyncPhase)		// clears asyncPhase {joj 28/11/17}
				drawChanges();
		}
		if (timer) {
			startTick = tick;
			startTimeStamp = performance.now();
		}
	}

	//
	// start
	//
	// fromUI == 1 if called directly from a mouse click or key press
	//
	function start(fromUI) {
		if (fromUI === undefined)
			fromUI = 0;
		//console.log("start fromUI=" + fromUI + " dir=" + dir + " timer=" + timer);
		if (fromUI == 0 && dir == -1)
			return;
		if (fromUI == 0 && (playMode == SINGLESTEP || playMode == SNAPTOCHKPT))
			return;
		if (timer == 0) {
			if (fromUI && handler["eventStartStop"]) {
				rtStart = performance.now();
				for (let i = 0; i < handler["eventStartStop"].length; i++) {
					asyncPhase = 1;
					callEventHandler(handler["eventStartStop"][i].pc, handler["eventStartStop"][i].obj, 1);
				}
				if (asyncPhase)
					drawChanges();	// clears asyncPhase {joj 28/11/17}
			}
			if (tick == 0)
				dir = 1;
			startTick = tick;
			startTimeStamp = etStart = performance.now();
			timer = requestAnimationFrame(animate);
		}
	}

	//
	// stop
	//
	// fromUI == 1 if called directly from a mouse click or key press
	//
	function stop(fromUI) {
		if (fromUI === undefined)
			fromUI = 1;
		//console.log("stop(fromUI=" + fromUI + ") timer=" + timer);
		if (timer) {
			cancelAnimationFrame(timer);
			if (fromUI && handler["eventStartStop"]) {
				rtStart = performance.now();
				for (let i = 0; i < handler["eventStartStop"].length; i++) {
					asyncPhase = 1;
					callEventHandler(handler["eventStartStop"][i].pc, handler["eventStartStop"][i].obj, 0);
				}
				if (asyncPhase)
					drawChanges();	// clear asyncPhase {joj 28/11/17}
			}
			timer = 0;	// set here so et reported correctly in stats
			if (dir == 1) {
				etf += performance.now() - etStart;
			} else {
				etb += performance.now() - etStart;
			}
		}
	}

	// addGlobalEventHandler
	function addGlobalEventHandler(e, obj, pc) {
		//console.log("addGlobalEventHandler(" + e + ", " + obj + ", " + pc + ")");
		if (handler[e] == undefined)
			handler[e] = [];
		handler[e].push({"obj": obj, "pc": pc});
	}

	//
	// getArgs
	//
	// args passed as a string parameter to VPlayer
	// args is a " " separated list of name=value pairs
	//
	// eg. arg0=0 arg1=1 arg2="2 3" arg3='3 4 5'
	//
	// values are treated as strings and can optionally be
	// in single or double quotes
	//
	// NB: can set arguments directly using JavaScript
	//
	// vplayer.arg["arg0"] = "0";
	// vplayer.arg["arg1"] = "1";
	// vplayer.arg["arg2"] = "2 3";
	// vplayer.arg["arg3"] = "3 4 5";
	//
	function getArgs() {
		try { // catch invalid range
			console.log(args);
			let i = 0, len = args.length;
			console.log(len);
			while (1) {
				let argName = "";
				if ((args[i] >= "A" && args[i] <= "Z") || (args[i] >= "a" && args[i] <= "z"))
					argName += args[i++];
				while ((args[i] >= "A" && args[i] <= "Z") || (args[i] >= "a" && args[i] <= "z") || (args[i] >= "0" && args[i] <= "9"))
					argName += args[i++];
				if (args[i] != "=")
					break;
				++i;
				let end = " ";
				if ((args[i] == "'") || (args[i] == '"'))
					end = args[i++];
				let argValue = "";
				while (i < len && args[i] != end)
					argValue += args[i++];
				if (i == len && end != " " && args[i-1] != end)	// check non matching quote to end string
					break;
				arg[argName] = argValue;
				i++; // skip space ' or "
				while (args[i] == " ")
					i++;
			}
		} finally {
			// ignore exception
		}
		for (var a in arg)
			console.log("arg[" + a + "]=" + arg[a]);
	}

	//
	// getArg
	//
	// access arg["vivioArg[" + name +"]"
	//
	// NB: array["fill"] returns the array fill function so wrapping
	// the name as "vivioArg[name]" avoids such conflicts
	//
	function getArg(name, v) {
		name = "vivioArg[" + name + "]";
		if (arg[name] === undefined)
			return v;
		return arg["vivioArg[" + name +"]"];
	}

	// getArgAsNum
	function getArgAsNum(name, v) {
		name = "vivioArg[" + name + "]";
		if (arg[name] === undefined)
			return v;
		//console.log("getArgAsNum: " + name + "=" + Number(arg[name]));
		return Number(arg[name]);
	}

	//
	// setArg
	//
	// daysToLive	< 0	page lifeTime ONLY
	//			  	0	browser instance lifeTime (saved in a cookie)
	//			  	n 	saved between browser instances for n days (also saved in a cookie)
	//
	function setArg(name, v, daysToLive) {
		if (daysToLive === undefined)
			daysToLive = -1;
		//console.log("setArg name=" + name + " v=" + v + " daysToLive=" + daysToLive);
		name = "vivioArg[" + name + "]";
		arg[name] = v;
		if (daysToLive < 0)
			return;
		var cookie = name + "=" + encodeURIComponent(v);
		if (daysToLive > 0)
			cookie += "; max-age=" + (daysToLive*60*60*24);
		document.cookie = cookie;
	}

	// setArgFromNum
	function setArgFromNum(name, v, daysToLive) {
		setArg(name, v.toString(), daysToLive);
	}

	// getCookies
	function getCookies() {
		//console.log("getCookies");
		var all = document.cookie;
		if (all === "")
			return;
		var list = all.split("; ");
		for (var i = 0; i < list.length; i++) {
			var cookie = list[i];
			var p = cookie.indexOf("=");
			var name = cookie.substring(0, p);
			if ((name.substr(0, 9) == "vivioArg[") && (name.substr(name.length - 1, 1) == "]")) {
				var value = decodeURIComponent(cookie.substring(p + 1));
				console.log("cookie: " + name + "=" + value);
				setArg(name, value, -1);	// no need to update cookie
			}
		}

	}

	// T2D constructor
	function T2D() {
		if (arguments.length == 1) {			// T2D(t2d)
			this.a = arguments[0].a;
			this.b = arguments[0].b;
			this.c = arguments[0].c;
			this.e = arguments[0].d;
			this.e = arguments[0].e;
			this.f = arguments[0].f;
		} else {
			this.a = 1;							// T2D()
			this.b = 0;
			this.c = 0;
			this.d = 1;
			this.e = 0;
			this.f = 0;
		}
	}

	// T2D.setIdentity
	T2D.prototype.setIdentity = function() {
		this.a = 1;
		this.b = 0;
		this.c = 0;
		this.d = 1;
		this.e = 0;
		this.f = 0;
	}

	// T2D.set
	T2D.prototype.set = function() {
		if (arguments.length == 1) {		// set(t2d)
			this.a = arguments[0].a;
			this.b = arguments[0].b;
			this.c = arguments[0].c;
			this.d = arguments[0].d;
			this.e = arguments[0].e;
			this.f = arguments[0].f;
		} else {
			this.a = arguments[0];			// set(a, b, c, d, e, f)
			this.b = arguments[1];
			this.c = arguments[2];
			this.d = arguments[3];
			this.e = arguments[4];
			this.f = arguments[5];
		}
	}

	//
	// T2D.multiplyBA
	//
	// transform A followed by B represented by matrix BA
	//
	T2D.prototype.multiplyBA = function() {
		let ba, bb, bc, bd, be, bf;
		if (arguments.length == 1) {		// multiplyBA(t2D)
			ba = arguments[0].a;
			bb = arguments[0].b;
			bc = arguments[0].c;
			bd = arguments[0].d;
			be = arguments[0].e;
			bf = arguments[0].f;
		} else {							// multiplyBA(ba, bb, bc, bd, be, bf)
			ba = arguments[0];
			bb = arguments[1];
			bc = arguments[2];
			bd = arguments[3];
			be = arguments[4];
			bf = arguments[5];
		}
		let aa = this.a;
		let ab = this.b;
		let ac = this.c;
		let ad = this.d;
		let ae = this.e;
		let af = this.f;
		this.a = ba*aa + bc*ab;
		this.b = bb*aa + bd*ab;
		this.c = ba*ac + bc*ad;
		this.d = bb*ac + bd*ad;
		this.e = ba*ae + bc*af + be;
		this.f = bb*ae + bd*af + bf;
	}

	//
	// T2D.multiplyAB
	//
	// transform B followed by A represented by matrix AB
	//
	T2D.prototype.multiplyAB = function() {
		let ba, bb, bc, bd, be, bf;
		if (arguments.length == 1) {		// multiplyBA(ba, bb, bc, bd, be, bf)
			ba = arguments[0].a;
			bb = arguments[0].b;
			bc = arguments[0].c;
			bd = arguments[0].d;
			be = arguments[0].e;
			bf = arguments[0].f;
		} else {							// multiplyBA(t2D)
			ba = arguments[0];
			bb = arguments[1];
			bc = arguments[2];
			bd = arguments[3];
			be = arguments[4];
			bf = arguments[5];
		}
		let aa = this.a;
		let ab = this.b;
		let ac = this.c;
		let ad = this.d;
		let ae = this.e;
		let af = this.f;
		this.a = aa*ba + ac*bb;
		this.b = ab*ba + ad*bb;
		this.c = aa*bc + ac*bd;
		this.d = ab*bc + ad*bd;
		this.e = aa*be + ac*bf + ae;
		this.f = ab*be + ad*bf + af;
	}

	// T2D.rotate
	T2D.prototype.rotate = function(angle) {
		let cos = Math.cos(angle * Math.PI / 180);
		let sin = Math.sin(angle * Math.PI / 180);
		this.multiplyBA(cos, sin, -sin, cos, 0, 0);
	}

	// T2D.scale
	T2D.prototype.scale = function(sx, sy) {
		this.multiplyBA(sx, 0, 0, sy, 0, 0);
	}

	// T2D.translate
	T2D.prototype.translate = function(tx, ty) {
		this.multiplyBA(1, 0, 0, 1, tx, ty);
	}

	// T2D.transformMbb
	T2D.prototype.transformMbb = function(mbb) {
		//console.log("transformMbb");
		let x = [mbb.x0, mbb.x1, mbb.x1, mbb.x0];
		let y = [mbb.y0, mbb.y0, mbb.y1, mbb.y1];
		let xx, yy, x0 = Number.MAX_VALUE, y0 = Number.MAX_VALUE, x1 = Number.MIN_VALUE, y1 = Number.MIN_VALUE;
		for (let i = 0; i < 4; i++) {
			xx = x[i]*this.a + y[i]*this.c + this.e;
			yy = x[i]*this.b + y[i]*this.d + this.f;
			if (xx < x0)
				x0 = xx;
			if (xx > x1)
				x1 = xx;
			if (yy < y0)
				y0 = yy
			if (yy > y1)
				y1 = yy;
		}
		mbb.set(x0, y0, x1, y1);
	}

	// checkpoint
	function checkPoint() {
		//console.log("checkPoint() tick=" + tick);
		checkPt.push(tick);
		atCheckPoint = 1;
	}

	// getPreviousCheckPt
	function getPreviousCheckPt() {
		let l;
		while (1) {
			l = checkPt.length;
			if ((l == 0) || (checkPt[l - 1] < tick))
				break;
			checkPt.pop();
		}
		return (l > 0) ? checkPt.pop() : 0;
	}

	// drawStats
	function drawStats() {
		if (showStats) {
			const h = INFOFONTH + 4;
			let t, txt, w;
			ctx.save();
			ctx.fillStyle = "#ffffe0";		// light yellow
			ctx.fillRect(0, canvas.clientHeight - h, canvas.clientWidth, h);
			ctx.font = INFOFONTH + "px Calibri";
			ctx.textBaseline = "middle";
			ctx.fillStyle = "#000000";		// black
			txt = "tick=" + tick + " tps=" + tps +
				" last frame=" + rtLast.toFixed(1) + "ms (" + dtLast.toFixed(1) + "ms)";
			ctx.fillText(txt, 5, canvas.clientHeight - h/2 + 1);
			w = ctx.measureText(txt).width;
			t = (dir == 1 && timer) ? etf + performance.now() - etStart : etf;
			txt = " FORWARD " +
				" t=" + (t / 1000).toFixed(1) + "s" +
				//" ticks=0" +
				" nf=" + nff +
				" avg=" + (nff ? (rtf / nff).toFixed(1) + "ms (" + (dtf / nff).toFixed(1) + "ms)" : "0.0ms (0.0ms)");
			ctx.fillStyle = "#008000";		// green
			ctx.fillText(txt, 5 + w, canvas.clientHeight - h/2 + 1);
			w += ctx.measureText(txt).width;
			t = (dir == -1 && timer) ? etb + performance.now() - etStart : etb;
			txt = " BACK " +
				" t=" + (t / 1000).toFixed(1) + "s" +
				//" ticks=0" +
				" nf=" + nfb +
				" avg=" + (nfb ? (rtb / nfb).toFixed(1) + "ms (" + (dtb / nfb).toFixed(1) + "ms)" : "0.0ms (0.0ms)") +
				" sst=" + sst;
			ctx.fillStyle = "#ff0000";		// red
			ctx.fillText(txt, 5 + w, canvas.clientHeight - h/2 + 1);
			ctx.restore();
		}
	}

	//
	// InfoTip constuctor
	//
	// need to keep mbb of InfoTip
	//
	function InfoTip() {
		this.mbb = new Mbb();
		//this.mbbs = new Mbbs();
		infoTipTimer = 0;
	}

	//
	// InfoTip.draw
	//
	// draws infoTip on top layer
	//
	InfoTip.prototype.draw = function() {
		if (infoTipTimer) {
			let ctx = layer[nlayer-1].ctx;
			ctx.save();
			ctx.font = INFOFONTH + "px Calibri";
			ctx.fillStyle = "#ffffe0";		// ivory
			ctx.fillRect(this.x, this.y, this.w, this.h);
			ctx.strokeStyle = "#ff0000";	// red
			ctx.strokeRect(this.x, this.y, this.w, this.h);
			ctx.textAlign = "left";
			ctx.textBaseline = "middle";
			ctx.fillStyle = "#000000";
			ctx.fillText(this.txt, this.x + 5, this.y + this.h/2);
			ctx.restore();
			this.mbb.set(this.x, this.y, this.x + this.w, this.y + this.h);
		}
	}

	//
	// InfoTip.drawChanges
	//
	// draw infoTip on top layer
	// layer[nlayer-1].mmbbs.nmbb will be 0
	//
	InfoTip.prototype.drawChanges = function() {
		//console.assert(layer[nlayer-1].mbbs.nmbb == 0, "InfoTip.drawChanges nmbb=%d", layer[nlayer-1].mbbs.nmbb);
		if (this.mbb.isEmpty() == 0) {								// clear existing infoTip if being displayed
			let ctx = layer[nlayer-1].ctx;							// top layer
			layer[nlayer-1].mbbs.add(this.mbb);						// add infoTip mbb to top layer mbbs (will be empty)
			ctx.save();
			ctx.beginPath();
			//console.log("x0=" + this.mbb.x0 + " y0=" + this.mbb.y0 + " x1=" + this.mbb.x1 + " y1=" + this.mbb.y1);
			ctx.rect(this.mbb.x0 - 1, this.mbb.y0 - 1, this.mbb.width() + 2, this.mbb.height() + 2);
			ctx.clip();
			ctx.fillStyle = bgBrush ? bgBrush.fillStyle : "white";			// gobalAlpha?
			if (nlayer == 1) {
				ctx.fillStyle = bgBrush ? bgBrush.fillStyle : "white";		// gobalAlpha?
				ctx.fillRect(0, 0, canvas.width, canvas.height);
			} else {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
			}
			if (layer[nlayer-1].opacity) {								// {joj 17/10/16}
				for (let i = 0; i < layer[nlayer-1].gobjs.length; i++)	// redraw gobjs which overlap infoTip
					layer[nlayer-1].gobjs[i].draw(0);
			}
			layer[nlayer-1].mbbs.nmbb = 0;								// reset top layer mbbs
			ctx.restore();
		}
		this.draw();													// draw infoTip
	}

	// InfoTip.set
	InfoTip.prototype.set = function(txt, centred) {
		this.txt = txt
		this.centred = centred;
		this.mouseX = mouseX;
		this.mouseY = mouseY;
		let x, y, w, h = INFOFONTH + 4;
		ctx.save();
		ctx.font = INFOFONTH + "px Calibri";
		w = ctx.measureText(this.txt).width + 10;
		ctx.restore();
		if (this.centred) {
			x = (canvas.clientWidth - w) / 2;
			y = (canvas.clientHeight - h) / 2;
		} else {
			x = this.mouseX;
			if (x + w > canvas.clientWidth)
				x = canvas.clientWidth - w - 2;
			y = this.mouseY - h;
			if (y - h < 0)
				y = 0;
		}
		this.x = Math.round(x) + 0.5;
		this.y = Math.round(y) + 0.5;
		this.w = Math.round(w);
		this.h = Math.round(h);
	}

	// InfoTip.drawInfoTip
	function drawInfoTip() {
		if (infoTipTimer)
			infoTip.drawChanges();
	}

	// InfoTip.hideInfoTip
	function hideInfoTip() {
		infoTipTimer = 0;
		infoTip.drawChanges();
		infoTip.mbb.set(0, 0, 0, 0);
	}

	// InfoTip.showInfoTip
	function showInfoTip(txt, centred, draw) {
		infoTip.set(txt, centred);
		if (infoTipTimer)
			clearTimeout(infoTipTimer);
		infoTipTimer = setTimeout(hideInfoTip, 1000);
		if (draw)
			infoTip.drawChanges();
	}

	var infoTip = new InfoTip();

	// reset
	function reset() {
		//console.log("reset");
		stop(0);
		etf = etb = nff = nfb = rtf = rtb = dtf = dtb = 0;
		rtStart = performance.now();
		goto(-1);
		let e = new Event();		// is this the wrong event?
		e.offsetX = mouseX;
		e.offsetY = mouseY;
		mouseMoveHandler(e);
		//drawAll();
	}

	// isRunning
	function isRunning() {			// vivio function
		return timer > 0;
	}

	// setSST
	function setSST(newSST) {
		sst = newSST;
	}

	// debug
	function debug() {
		console.log(sprintf.apply(this, arguments));
	}

	// closeIDE
	function closeIDE() {
		if (testFlag)
			window.close();
	}

	// String.find
	String.prototype.find = function(s) {
		return this.indexOf(s);
	}

	// String.left
	String.prototype.left = function(cnt) {
		return this.slice(0, cnt);
	}

	// String.len
	String.prototype.len = function() {
		return this.length;
	}

	// String.mid
	String.prototype.mid = function(startPos, cnt) {
		return this.slice(startPos, startPos + cnt);
	}

	// String.rfind
	String.prototype.rfind = function(s) {
		return this.lastIndexOf(s);
	}

	// String.regExpSplit
	String.prototype.regExpSplit = function(pattern, flags, limit) {
		return this.split(RegExp(pattern, flags), limit);
	}

	// String.right
	String.prototype.right = function(cnt) {
		return this.slice(-cnt);
	}

	// String.toNum
	String.prototype.toNum = function() {
		return Number(this);
	}

	// Date.isLeapYear
	// from stackoverflow
	Date.prototype.isLeapYear = function() {
    	var year = this.getFullYear();
    	if((year & 3) != 0) return false;
    	return ((year % 100) != 0 || (year % 400) == 0);
	};

	// Date.getDOY
	// from stackoverflow
	Date.prototype.getDOY = function() {
    	var dayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    	var mn = this.getMonth();
    	var dn = this.getDate();
    	var dayOfYear = dayCount[mn] + dn;
    	if(mn > 1 && this.isLeapYear()) dayOfYear++;
    	return dayOfYear;
	};

	// Date.getWeek (ISO 8601)
	// from weekNumber.net
	Date.prototype.getWeek = function() {
  		var date = new Date(this.getTime());
   		date.setHours(0, 0, 0, 0);
  		// Thursday in current week decides the year
  		date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
		// January 4 is always in week 1
		var week1 = new Date(date.getFullYear(), 0, 4);
		// Adjust to Thursday in week 1 and count number of weeks from date to week1
  		return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000   - 3 + (week1.getDay() + 6) % 7) / 7);
	}

	// apologies for English only
	var day = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
	var dayF = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	var monthF = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	// lastModifiedMS
	function lastModifiedMS() {
		return Date.parse(document.lastModified);
	}

	// timeToString
	function timeToString(t, fs) {
		t = new Date(t);
		if (fs === undefined)
			return t.toLocaleString();
		let str = "";
		let v = 0;
		for (let i = 0; i < fs.length; i++) {
			if ((fs[i] != '%') || (i + 1 == fs.length)) {
				str += fs[i];
				continue;
			}
			switch (fs[i + 1]) {
			case 'a':
				str += day[t.getDay()]; i++; break;
			case 'A':
				str += dayF[t.getDay()]; i++; break;
			case 'b':
			case 'h':
				str += month[t.getMonth()]; i++; break;
			case 'B':
				str += monthF[t.getMonth()]; i++; break;
			case 'd':
				v = t.getDate();
				str += (v < 10) ? "0" + v : v; i++; break;
			case 'e':
				v = t.getDate();
				str += (v < 10) ? " " + v : v; i++; break;
			case 'H':
				v = t.getHours();
				str += (v < 10) ? "0" + v : v; i++; break;
			case 'I ':
				v = t.getHours() % 12;
				str += (v < 10) ? "0" + v : v; i++; break;
			case 'j':
				v = t.getDOY();
				str += (v < 10) ? "00" + v : (v < 100) ? "0" + v : v; i++; break;
			case 'k':
				v = t.getHours();
				str += (v < 10) ? " " + v : v; i++; break;
			case 'l':
				v = t.getHours() % 12;
				str += (v < 10) ? " " + v : v; i++; break;
			case 'm':
				v = t.getMonth() + 1;
				str += (v < 10) ? "0" + v : v; i++; break;
			case 'M':
				v = t.getMinutes();
				str += (v < 10) ? "0" + v : v; i++; break;
			case 'p':
				v = t.getHours() % 12;
				str += (v < 12) ? "PM" : "AM"; i++; break;
			case 'P':
				v = t.getHours() % 12;
				str += (v < 12) ? "pm" : "am"; i++; break;
			case 'r':
				v = t.getHours() % 12;
				str += (v < 10) ? "0" + v : v;
				str += ":";
				v = t.getMinutes();
				str += (v < 10) ? "0" + v : v;
				str += ":";
				v = t.getSeconds();
				str += (v < 10) ? "0" + v : v;
				v = t.getHours() % 12;
				str += (v < 12) ? " PM" : " AM";
				i++;
				break;
			case 'R':
				v = t.getHours();
				str += (v < 10) ? "0" + v : v;
				str += ":";
				v = t.getMinutes();
				str += (v < 10) ? "0" + v : v;
				i++;
				break;
			case 'S':
				v = t.getSeconds();
				str += (v < 10) ? "0" + v : v; i++; break;
			case 'T':
				v = t.getHours();
				str += (v < 10) ? "0" + v : v;
				str += ":";
				v = t.getMinutes();
				str += (v < 10) ? "0" + v : v;
				str += ":";
				v = t.getSeconds();
				str += (v < 10) ? "0" + v : v;
				i++;
				break;
			case "u":
				v = t.getDay();
				str += (v == 0) ? 7 : v;
			case 'V':
				v = t.getWeek();
				str += (v < 10) ? "0" + v : v; i++; break;
			case "w":
				str += t.getDay(); i++; break;
			case 'y':
				v = t.getFullYear() % 100;
				str += (v < 10) ? "0" + v : v; i++; break;
			case 'Y':
				str += t.getFullYear(); i++; break;
			default:
				str += fs[i];
			}
		}
		return str;
	}

	//
	// VPlayer public interface
	//
	// constants (in alphabetic order)
	//
	this.ABSOLUTE = ABSOLUTE;
	this.ARROW40_END = ARROW40_END;
	this.ARROW60_END = ARROW60_END;
	this.ARROW90_END = ARROW90_END;
	this.ARROW40_START = ARROW40_START;
	this.ARROW60_START = ARROW60_START;
	this.ARROW90_START = ARROW90_START;
	this.BEVEL_JOIN = BEVEL_JOIN;
	this.BLACK = BLACK;
	this.BLUE = BLUE;
	this.BOLD = BOLD;
	this.BUTT_END = BUTT_END;
	this.BUTT_START = BUTT_START;
	this.CLOSED = CLOSED;
	this.CIRCLE_END = CIRCLE_END;
	this.CIRCLE_START = CIRCLE_START;
	this.CYAN = CYAN;
	this.DASH = DASH;
	this.DASH_DOT = DASH_DOT;
	this.DASH_DOT_DOT = DASH_DOT_DOT;
	this.DOT = DOT;
	this.GRADIENTBRUSH = GRADIENTBRUSH;
	this.GRAY32 = GRAY32;
	this.GRAY64 = GRAY64;
	this.GRAY96	= GRAY96;
	this.GRAY128 = GRAY128;
	this.GRAY160 = GRAY160;
	this.GRAY192 = GRAY192;
	this.GRAY224 = GRAY224;
	this.GREEN = GREEN;
	this.HCENTRE = HCENTRE;
	this.HITINVISIBLE = HITINVISIBLE;
	this.HITWINDOW = HITWINDOW;
	this.HLEFT = HLEFT;
	this.HMASK = HMASK;
	this.HRIGHT = HRIGHT;
	this.IMAGEBRUSH = IMAGEBRUSH;
	this.IMAGEPEN = IMAGEPEN;
	this.ITALIC = ITALIC;
	this.KEY = KEY;
	this.MAGENTA = MAGENTA;
	this.MAX_CAP = MAX_CAP;
	this.MAX_JOIN = MAX_JOIN;
	this.MAX_STYLE = MAX_STYLE;
	this.MB_ALT = MB_ALT;
	this.MB_CTRL = MB_CTRL;
	this.MB_LEFT = MB_LEFT;
	this.MB_MIDDLE = MB_MIDDLE;
	this.MB_RIGHT = MB_RIGHT;
	this.MB_SHIFT = MB_SHIFT;
	this.MM = MM;
	this.MB = MB;
	this.NOATTACH = NOATTACH;				// {joj 3/11/17}
	this.NULLBRUSH = NULLBRUSH;
	this.NULLPEN = NULLPEN;
	this.PROPAGATE = PROPAGATE;
	this.RADIALBRUSH = RADIALBRUSH;
	this.RED = RED;
	this.REMEMBER = REMEMBER;
	this.ROUND_END = ROUND_END;
	this.ROUND_JOIN = ROUND_JOIN;
	this.ROUND_START = ROUND_START;
	this.RT = RT;							// {joj 6/7/17}
	this.SMALLCAPS = SMALLCAPS;
	this.SOLID = SOLID;
	this.SOLIDBRUSH = SOLIDBRUSH;			// {joj 13/9/17}
	this.SOLIDPEN = SOLIDPEN;				// {joj 13/9/17}
	this.SQUARE_END = SQUARE_END;
	this.SQUARE_START = SQUARE_START;
	this.STRIKETHROUGH = STRIKETHROUGH;
	this.UNDERLINE = UNDERLINE;
	this.VBOTTOM = VBOTTOM;
	this.VCENTRE = VCENTRE;
	this.VERSION = VERSION;
	this.VTOP = VTOP;
	this.VMASK = VMASK;
	this.WHITE = WHITE;
	this.YELLOW = YELLOW;

	//
	// globals (in alphabetic order)
	//
	// names start with $ so they don't clash with Vivio variable names
	//
	this.$g = $g;

	// functions (in alphabetic order)

	this.abs = Math.abs;
	this.acos = function(x) {return Math.acos(x) * 180 / Math.PI};
	this.addGlobalEventHandler = addGlobalEventHandler;
	this.addWaitToEventQ = addWaitToEventQ;
	this.Arc = Arc;
	this.arg = arg;
	this.asin = function(x) {return Math.asin(x) * 180 / Math.PI};
	this.atan = function(x) {return Math.atan(x) * 180 / Math.PI};
	this.atan2 = function(y, x) {return Math.atan2(y, x) * 180 / Math.PI};
	this.Bezier = Bezier;
	this.ceil = Math.ceil;
	this.checkPoint = checkPoint;
	this.clock = clock;
	this.closeIDE = closeIDE;
	this.cos = function(d) {return Math.cos(d * Math.PI/180)};
	this.debug = debug;
	this.exp = Math.exp;
	this.E$ = E$;
	this.getArg = getArg;
	this.getArgAsNum = getArgAsNum;
	this.getURL = function(url) { window.location.assign(url); };
	this.getTick = function() {return tick};
	this.getTPS = function() {return tps};
	this.Ellipse = Ellipse;
	this.Ellipse2 = Ellipse2;
	this.fire = fire;
	this.floor = Math.floor;
	this.Font = Font;
	this.fork = fork;
	this.lastModifiedMS = lastModifiedMS;
	this.GradientBrush = GradientBrush;
	this.Group = Group;
	this.Image = Image;
	this.ImageBrush = ImageBrush;
	this.ImagePen = ImagePen;
	this.isRunning = isRunning;
	this.Layer = Layer;
	this.Line = Line;
	this.Line2 = Line2;
	this.load = load;
	this.log = Math.log;
	this.log10 = Math.log10;
	this.mkTime = function(y, m, d, h, min, s) {return new Date(y, m, d, h, min, s).getTime()};
	this.newArray = newArray;
	this.NullBrush = NullBrush;
	this.NullPen = NullPen;
	this.Pie = Pie;
	this.Polygon = Polygon;
	this.pow = Math.pow;
	this.R$ = R$;
	this.RadialBrush = RadialBrush;
	this.random = function() {return Math.random()};
	this.Rectangle = Rectangle;
	this.Rectangle2 = Rectangle2;
	this.reset = reset;
	this.rgba = rgba;
	this.round = Math.round;
	this.setArg = setArg;
	this.setArgFromNum = setArgFromNum;
	this.setBgBrush = setBgBrush;
	this.setBgPen = setBgPen;
	this.setSST = setSST;
	this.setTPS = setTPS;
	this.getWVH = getWVH;
	this.getWVW = getWVW;
	this.getWH = getWH;
	this.getWW = getWW;
	this.setViewport = setViewport;
	this.sin = function(d) {return Math.sin(d * Math.PI/180)};
	this.sizeOf = function(a) {return a.length};
	this.SolidBrush = SolidBrush;
	this.SolidPen = SolidPen;
	this.Spline = Spline;
	this.sprintf = sprintf;
	this.sqrt = Math.sqrt;
	this.start = start;
	this.stop = stop;
	this.tan = function(d) {return Math.tan(d * Math.PI/180)};
	this.terminateThread = terminateThread;
	this.timeMS = function() {return Date.now()};
	this.timeToString = timeToString;
	this.trunc = Math.trunc;
	this.Txt = Txt;
	this.VObj = VObj;

	//
	// VCode
	//
	var vcode = new VCode(this);
	var execute = vcode.execute;
	var resumeThread = vcode.resumeThread;
	var suspendThread = vcode.suspendThread;
	var getThread = vcode.getThread;
	var waitTracker = vcode.waitTracker;

	run();

}

// eof