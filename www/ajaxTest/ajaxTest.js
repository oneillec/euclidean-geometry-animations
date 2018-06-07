"use strict"

function ajaxTest(vplayer) {

	const BLUE = vplayer.BLUE;
	const GRAY160 = vplayer.GRAY160;
	const GRAY192 = vplayer.GRAY192;
	const GREEN = vplayer.GREEN;
	const HLEFT = vplayer.HLEFT;
	const ITALIC = vplayer.ITALIC;
	const RED = vplayer.RED;

	var addEventHandler = vplayer.addEventHandler;
	var addWaitToEventQ = vplayer.addWaitToEventQ;
	var Font = vplayer.Font;
	var g = vplayer.g;
	var Line2 = vplayer.Line2;
	var newArray = vplayer.newArray;
	var rand = vplayer.rand;
	var Rectangle2 = vplayer.Rectangle2;
	var setBgBrush = vplayer.setBgBrush;
	var setViewport = vplayer.setViewport;
	var SolidBrush = vplayer.SolidBrush;
	var SolidPen = vplayer.SolidPen;
	var sprintf = vplayer.sprintf;
	var terminateThread = vplayer.terminateThread;
	var VObj = vplayer.VObj;

	const WIDTH = 400;
	const HEIGHT = 300;
	const RW = WIDTH / 2;
	const RH = HEIGHT / 2;

	var $thread = 0;
	var $pc = 0;
	var $fp = -1;
	var $sp = -1;
	var $acc = 0;
	var $obj = 0;
	var $stack = 0;

	function callf(pc, obj) {
		if (obj === undefined)
			obj = 0
		let l = arguments.length - 1;
		for (let i = l; i >= 2; i--)
			$stack[++$sp] = arguments[i];
		$acc = obj;
		$stack[++$sp] = $pc + 1;
		$pc = pc;
	}

	function enterf(n) {	// n = # local variables
		$stack[++$sp] = $obj;
		$stack[++$sp] = $fp;
		$fp = $sp;
		$obj = $acc;
		$sp += n;
	}

	function returnf(n) {	// n = # parameters to pop
		$sp = $fp;
		$fp = $stack[$sp--];
		$obj = $stack[$sp--];
		$pc = $stack[$sp--];
		if ($pc == -1) {
			terminateThread($thread);
			$thread = 0;
			return;
		}
		$sp -= n;
	}

	function suspendThread() {
		if ($thread == 0)
			return 0;
		$thread.pc = $pc;
		$thread.fp = $fp;
		$thread.sp = $sp;
		$thread.acc = $acc;
		$thread.obj = $obj;
		return $thread;
	}

	function waitTracker() {
		$pc++;
		return $thread;
	}

	function resumeThread(toThread) {
		$pc = toThread.pc;
		$fp = toThread.fp;
		$sp = toThread.sp;
		$acc = toThread.acc;
		$obj = toThread.obj;
		$stack = toThread.stack;
		$thread = toThread;
	}

	function switchToThread(toThread) {
		if ($thread == toThread)
			return;
		suspendThread();
		resumeThread(toThread);
	}

	function wait(ticks, pc) {
		$pc = (pc === undefined) ? $pc + 1 : pc;
		suspendThread();
		addWaitToEventQ(ticks, $thread);
	}


	function Graph(x, y, _w, _h) {
		VObj.call(this)
		this.w = _w;
		this.h = _h;
		this.bar1 = new Rectangle2(g[0], 0, 0, 0, g[7], x, y + this.h, this.w / 3, -this.h);
		this.bar2 = new Rectangle2(g[0], 0, 0, 0, g[6], x + this.w / 3, y + this.h, this.w / 3, -this.h);
		this.bar3 = new Rectangle2(g[0], 0, 0, 0, g[4], x + this.w / 3 * 2, y + this.h, this.w / 3, -this.h);
		this.bar1Txt = new Rectangle2(g[0], 0, 0, 0, 0, x, y + this.h, this.w / 3, -this.h / 5);
		this.bar2Txt = new Rectangle2(g[0], 0, 0, 0, 0, x + this.w / 3, y + this.h, this.w / 3, -this.h / 5);
		this.bar3Txt = new Rectangle2(g[0], 0, 0, 0, 0, x + 2 * this.w / 3, y + this.h, this.w / 3, -this.h / 5);
		new Line2(g[0], 0, 0, g[1], x, y, 0, this.h + 2);
		new Line2(g[0], 0, 0, g[1], x - 2, y + this.h, this.w + 2, 0);
		this.vTxt = new Rectangle2(g[0], 0, HLEFT, 0, 0, x, y, this.w, this.h / 10, g[2], g[8]);
		this.tTxt = new Rectangle2(g[0], 0, 0, 0, 0, x, y + this.h, this.w, this.h / 5, g[3]);
		this.arg = newArray(5);
		this.update("5.2.0-8+etch7 12:34:56 1 2 3");
	}
	Graph.prototype = Object.create(VObj.prototype);

	Graph.prototype.update = function(s) {
		this.arg = s.split(" ");
		this.vTxt.setTxt(" php version: " + this.arg[0]);
		this.tTxt.setTxt(this.arg[1]);
		let v0 = this.arg[2].toNum();
		let v1 = this.arg[3].toNum();
		let v2 = this.arg[4].toNum();
		this.bar1.setSize(this.w / 3, -v0 * this.h / 10);
		this.bar1Txt.setTxt("%d", v0);
		this.bar2.setSize(this.w / 3, -v1 * this.h / 10);
		this.bar2Txt.setTxt("%d", v1);
		this.bar3.setSize(this.w / 3, -v2 * this.h / 10);
		this.bar3Txt.setTxt("%d", v2);
	}

	function eventFire(s) {
		g[9].update(s);
		return 0;
	}

	function execute(thread) {

		switchToThread(thread);

		while (1) {
			switch ($pc) {
			case -1:
				return;		// catch thread termination
			case 0:
				enterf(0);	// started with a function call
				g[1] = new SolidPen(0, 0, BLUE);
				g[2] = new SolidPen(0, 0, GRAY160);
				g[3] = new SolidPen(0, 0, RED);
				g[4] = new SolidBrush(BLUE);
				g[5] = new SolidBrush(GRAY192);
				g[6] = new SolidBrush(GREEN);
				g[7] = new SolidBrush(RED);
				g[8] = new Font("Calibri", 10, ITALIC);
				setViewport(0, 0, WIDTH, HEIGHT, 1);
				setBgBrush(g[5]);;
				g[9] = new Graph((WIDTH - RW) / 2, (HEIGHT - RH) / 2, RW, RH);
				g[10] = 0
				$pc = 1
			case 1:
				if (!(g[10] < 10)) {
					$pc = 4
					continue
				}
				wait(1)
				return
			case 2:
				g[9].update(sprintf("5.2.0-8+etch7 12:34:56 %d %d %d", (rand() * 10) | 0, (rand() * 10) | 0, (rand() * 10) | 0))
				$pc = 3
			case 3:
				g[10]++
				$pc = 1
				continue
			case 4:
				addEventHandler("eventFire", eventFire);
				returnf(0)
				continue
			}
		}
	}

	this.getThread = function() { return $thread; };
	this.execute = execute;
	this.resumeThread = resumeThread;
	this.suspendThread = suspendThread;
	this.waitTracker = waitTracker;

}

// eof
