"use strict"

function subtraction_constructible_numbers(vplayer) {

	const BLACK = vplayer.BLACK
	const BLUE = vplayer.BLUE
	const CYAN = vplayer.CYAN
	const GRAY128 = vplayer.GRAY128
	const GRAY160 = vplayer.GRAY160
	const GRAY192 = vplayer.GRAY192
	const GRAY224 = vplayer.GRAY224
	const GRAY32 = vplayer.GRAY32
	const GRAY64 = vplayer.GRAY64
	const GRAY96 = vplayer.GRAY96
	const GREEN = vplayer.GREEN
	const MAGENTA = vplayer.MAGENTA
	const RED = vplayer.RED
	const VCENTRE = vplayer.VCENTRE
	const WHITE = vplayer.WHITE
	const YELLOW = vplayer.YELLOW

	var $g = vplayer.$g
	var addWaitToEventQ = vplayer.addWaitToEventQ
	var Arc = vplayer.Arc
	var Ellipse = vplayer.Ellipse
	var Font = vplayer.Font
	var Line = vplayer.Line
	var Rectangle2 = vplayer.Rectangle2
	var setViewport = vplayer.setViewport
	var SolidBrush = vplayer.SolidBrush
	var SolidPen = vplayer.SolidPen
	var terminateThread = vplayer.terminateThread

	const W = 1024
	const H = 620
	const dotRadius = 5
	const aLength = 70
	const bLength = 300

	var $thread = 0
	var $pc = 0
	var $fp = -1
	var $sp = -1
	var $acc = 0
	var $obj = 0
	var $stack = 0

	function callf(pc, obj) {
		if (obj === undefined)
			obj = 0
		let l = arguments.length - 1
		for (let i = l; i >= 2; i--)
			$stack[++$sp] = arguments[i]
		$acc = obj
		$stack[++$sp] = $pc + 1
		$pc = pc
		return $acc
	}

	function enterf(n) {	// n = # local variables
		$stack[++$sp] = $obj
		$stack[++$sp] = $fp
		$fp = $sp
		$obj = $acc
		$sp += n
	}

	function returnf(n) {	// n = # parameters to pop
		$sp = $fp
		$fp = $stack[$sp--]
		$obj = $stack[$sp--]
		$pc = $stack[$sp--]
		if ($pc == -1) {
			terminateThread($thread)
			$thread = 0
			return
		}
		$sp -= n
	}

	function suspendThread() {
		if ($thread == 0)
			return 0;
		$thread.pc = $pc
		$thread.fp = $fp
		$thread.sp = $sp
		$thread.acc = $acc
		$thread.obj = $obj
		return $thread
	}

	function waitTracker() {
		$pc++
		return $thread
	}

	function resumeThread(toThread) {
		$pc = toThread.pc
		$fp = toThread.fp
		$sp = toThread.sp
		$acc = toThread.acc
		$obj = toThread.obj
		$stack = toThread.stack
		$thread = toThread
	}

	function switchToThread(toThread) {
		if ($thread == toThread)
			return
		suspendThread()
		resumeThread(toThread)
	}

	function wait(ticks, pc) {
		$pc = (pc === undefined) ? $pc + 1 : pc
		suspendThread()
		addWaitToEventQ(ticks, $thread)
		return 1
	}

	function execute(thread) {

		switchToThread(thread);

		while (1) {
			switch ($pc) {
			case -1:
				return;		// catch thread termination
			case 0:
				enterf(0);	// started with a function call
				$g[1] = new SolidPen(0, 1, BLACK)
				$g[2] = new SolidPen(0, 0, WHITE)
				$g[3] = new SolidPen(0, 0, RED)
				$g[4] = new SolidPen(0, 0, GREEN)
				$g[5] = new SolidPen(0, 0, BLUE)
				$g[6] = new SolidPen(0, 0, YELLOW)
				$g[7] = new SolidPen(0, 0, MAGENTA)
				$g[8] = new SolidPen(0, 0, CYAN)
				$g[9] = new SolidPen(0, 0, GRAY32)
				$g[10] = new SolidPen(0, 0, GRAY64)
				$g[11] = new SolidPen(0, 0, GRAY96)
				$g[12] = new SolidPen(0, 0, GRAY128)
				$g[13] = new SolidPen(0, 0, GRAY160)
				$g[14] = new SolidPen(0, 0, GRAY192)
				$g[15] = new SolidPen(0, 0, GRAY224)
				$g[16] = new SolidBrush(BLACK)
				$g[17] = new SolidBrush(WHITE)
				$g[18] = new SolidBrush(RED)
				$g[19] = new SolidBrush(GREEN)
				$g[20] = new SolidBrush(BLUE)
				$g[21] = new SolidBrush(YELLOW)
				$g[22] = new SolidBrush(MAGENTA)
				$g[23] = new SolidBrush(CYAN)
				$g[24] = new SolidBrush(GRAY32)
				$g[25] = new SolidBrush(GRAY64)
				$g[26] = new SolidBrush(GRAY96)
				$g[27] = new SolidBrush(GRAY128)
				$g[28] = new SolidBrush(GRAY160)
				$g[29] = new SolidBrush(GRAY192)
				$g[30] = new SolidBrush(GRAY224)
				setViewport(0, 0, W, H, 1)
				$g[31] = new Font("Calibri", 18)
				$g[32] = new Rectangle2($g[0], 0, W/2|VCENTRE, 0, 0, W/2-25, H/2-300, 200, 50, $g[1], 0)
				$g[32].setTxt("Subtraction - Constructible Numbers", 0)
				$g[33] = (W/2)-150
				$g[34] = H/2
				$g[35] = 0
				$g[36] = 0
				$g[37] = $g[35]+bLength
				$g[38] = $g[36]
				$g[39] = $g[35]+aLength
				$g[40] = $g[36]
				$g[41] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[33]-(dotRadius/2), $g[34]-(dotRadius/2), $g[35], $g[36], dotRadius, dotRadius, 0)
				$g[42] = new Arc($g[0], 0, 0, $g[1], 0, $g[33], $g[34], $g[35], $g[36], bLength, bLength, 360-30, 0)
				if ($g[42].rotateSpanAngle(60, 50, 1, 1))
				return
				$pc = 1
			case 1:
				if (wait(90))
				return
				$pc = 2
			case 2:
				$g[43] = new Line($g[0], 0, 0, $g[1], $g[33], $g[34], 0, 0, 0, 0)
				if ($g[43].setPt(1, $g[37], $g[40], 50, 1, 1))
				return
				$pc = 3
			case 3:
				$g[44] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[33]-(dotRadius/2), $g[34]-(dotRadius/2), $g[37], $g[40], dotRadius, dotRadius, 0)
				if (wait(90))
				return
				$pc = 4
			case 4:
				if ($g[42].setOpacity(0, 50, 1, 1))
				return
				$pc = 5
			case 5:
				$g[45] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[33], $g[34], ($g[35]+$g[37])/2+135, ($g[36]+$g[40])/2-35, $g[1], $g[31])
				$g[45].setTxt("b", 0)
				if (wait(90))
				return
				$pc = 6
			case 6:
				$g[46] = new Arc($g[0], 0, 0, $g[1], 0, $g[33], $g[34], $g[35], $g[36], aLength, aLength, 360-30, 0)
				if ($g[46].rotateSpanAngle(60, 50, 1, 1))
				return
				$pc = 7
			case 7:
				$g[47] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[33]-(dotRadius/2), $g[34]-(dotRadius/2), $g[39], $g[40], dotRadius, dotRadius, 0)
				if (wait(90))
				return
				$pc = 8
			case 8:
				if ($g[46].setOpacity(0, 50, 1, 1))
				return
				$pc = 9
			case 9:
				$g[48] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[33], $g[34], ($g[35]+$g[39])/2+35, ($g[36]+$g[40])/2-35, $g[1], $g[31])
				$g[48].setTxt("a", 0)
				if (wait(90))
				return
				$pc = 10
			case 10:
				if ($g[45].setOpacity(0, 50, 1, 1))
				return
				$pc = 11
			case 11:
				$g[49] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[33], $g[34], ($g[35]+$g[37])/2+205, ($g[36]+$g[38])/2-40, $g[1], $g[31])
				$g[49].setTxt("b - a", 0)
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
