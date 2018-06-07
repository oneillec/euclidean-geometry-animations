"use strict"

function equilateral_triangle(vplayer) {

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
	var debug = vplayer.debug
	var Ellipse = vplayer.Ellipse
	var Font = vplayer.Font
	var Line = vplayer.Line
	var pow = vplayer.pow
	var Rectangle2 = vplayer.Rectangle2
	var setViewport = vplayer.setViewport
	var SolidBrush = vplayer.SolidBrush
	var SolidPen = vplayer.SolidPen
	var sqrt = vplayer.sqrt
	var terminateThread = vplayer.terminateThread

	const W = 1024
	const H = 620
	const dotRadius = 5
	const sideLength = 300

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
				$g[32] = (W/2)-150
				$g[33] = H/2+150
				$g[34] = 0
				$g[35] = 0
				$g[36] = sideLength
				$g[37] = $g[35]
				$g[38] = new Rectangle2($g[0], 0, W/2|VCENTRE, 0, 0, W/2-25, H/2-300, 200, 50, $g[1], 0)
				$g[38].setTxt("Equilateral triangle on a given side", 0)
				$g[39] = new Line($g[0], 0, 0, $g[1], $g[32], $g[33], $g[34], $g[35], $g[36], $g[37])
				$g[40] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[32]-(dotRadius/2), $g[33]-(dotRadius/2), $g[34], $g[35], dotRadius, dotRadius, 0)
				$g[41] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[32]-(dotRadius/2), $g[33]-(dotRadius/2), $g[36], $g[37], dotRadius, dotRadius, 0)
				$g[42] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[32]+$g[34], $g[33]+$g[35], 0, 30, $g[1], $g[31])
				$g[42].setTxt("A", 0)
				$g[43] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[32]+$g[36], $g[33]+$g[37], 0, 30, $g[1], $g[31])
				$g[43].setTxt("B", 0)
				if (wait(90))
				return
				$pc = 1
			case 1:
				$g[44] = new Arc($g[0], 0, 0, $g[1], 0, $g[32], $g[33], $g[34], $g[35], sideLength, sideLength, -360, 0)
				if ($g[44].rotateSpanAngle(-80, 50, 1, 1))
				return
				$pc = 2
			case 2:
				$g[45] = new Arc($g[0], 0, 0, $g[1], 0, $g[32], $g[33], $g[36], $g[37], sideLength, sideLength, 180, 0)
				if ($g[45].rotateSpanAngle(80, 50, 1, 1))
				return
				$pc = 3
			case 3:
				$g[46] = sideLength
				$g[47] = $g[34]
				$g[48] = $g[35]
				$g[49] = sideLength
				$g[50] = $g[36]
				$g[51] = $g[37]
				$g[52] = sqrt(pow(($g[50]-$g[47]), 2)+pow(($g[51]-$g[48]), 2))
				debug("d: %d", $g[52])
				$g[53] = pow($g[46], 2)
				debug("a: %d", $g[53])
				$g[53]=$g[53]-(pow($g[49], 2))
				debug("a: %d", $g[53])
				$g[53]=$g[53]+(pow($g[52], 2))
				$g[53]=$g[53]/(2*$g[52])
				debug("a: %d", $g[53])
				$g[54] = pow($g[46], 2)-pow($g[53], 2)
				debug("h: %d", $g[54])
				$g[54]=sqrt($g[54])
				debug("h: %d", $g[54])
				$g[55] = $g[50]-$g[47]
				debug("x2: %d", $g[55])
				$g[55]=$g[55]/$g[52]
				debug("x2: %d", $g[55])
				$g[55]=$g[53]*$g[55]
				debug("x2: %d", $g[55])
				$g[55]=$g[47]+$g[55]
				debug("x2: %d", $g[55])
				$g[56] = ($g[51]-$g[48])
				debug("y2: %d", $g[56])
				$g[56]=$g[56]/$g[52]
				debug("y2: %d", $g[56])
				$g[56]=$g[53]*$g[56]
				debug("y2: %d", $g[56])
				$g[56]=$g[48]+$g[56]
				debug("y2: %d", $g[56])
				$g[57] = $g[51]-$g[48]
				debug("x3: %d", $g[57])
				$g[57]=$g[57]/$g[52]
				debug("x3: %d", $g[57])
				$g[57]=$g[54]*$g[57]
				debug("x3: %d", $g[57])
				$g[57]=$g[55]+$g[57]
				debug("x3: %d", $g[57])
				$g[58] = $g[50]-$g[47]
				debug("y3: %d", $g[58])
				$g[58]=$g[58]/$g[52]
				debug("y3: %d", $g[58])
				$g[58]=$g[54]*$g[58]
				debug("y3: %d", $g[58])
				$g[58]=$g[56]-$g[58]
				debug("y3: %d", $g[58])
				$g[59] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[32]-(dotRadius/2), $g[33]-(dotRadius/2), $g[57], $g[58], dotRadius, dotRadius, 0)
				if (wait(90))
				return
				$pc = 4
			case 4:
				$g[44].setOpacity(0, 50, 1, 0)
				if ($g[45].setOpacity(0, 50, 1, 1))
				return
				$pc = 5
			case 5:
				if (wait(90))
				return
				$pc = 6
			case 6:
				$g[60] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[32]+$g[57], $g[33]+$g[58], 0, -30, $g[1], $g[31])
				$g[60].setTxt("C", 0)
				if (wait(90))
				return
				$pc = 7
			case 7:
				$g[61] = new Line($g[0], 0, 0, $g[1], $g[32]+$g[57], $g[33]+$g[58], 0, 0, 0, 0)
				if ($g[61].setPt(0, $g[34]-$g[57], $g[35]-$g[58], 50, 1, 1))
				return
				$pc = 8
			case 8:
				$g[62] = new Line($g[0], 0, 0, $g[1], $g[32]+$g[57], $g[33]+$g[58], 0, 0, 0, 0)
				if ($g[62].setPt(0, $g[36]-$g[57], $g[37]-$g[58], 50, 1, 1))
				return
				$pc = 9
			case 9:
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
