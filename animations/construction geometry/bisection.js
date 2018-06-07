"use strict"

function bisection(vplayer) {

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
	var atan = vplayer.atan
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
	const arcRadius = 200

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
				$g[32] = new Rectangle2($g[0], 0, W/2|VCENTRE, 0, 0, W/2-120, H/2-300, 200, 50, $g[1], 0)
				$g[32].setTxt("Bisection of a line", 0)
				$g[33] = (W/2)-150
				$g[34] = H/2
				$g[35] = 0
				$g[36] = 0
				$g[37] = 300
				$g[38] = 0
				$g[39] = new Line($g[0], 0, 0, $g[1], $g[33], $g[34], $g[35], $g[36], $g[35], $g[36])
				$g[40] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[33]-(dotRadius/2), $g[34]-(dotRadius/2), $g[35], $g[36], dotRadius, dotRadius, 0)
				$g[41] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[33]-(dotRadius/2), $g[34]-(dotRadius/2), $g[37], $g[38], dotRadius, dotRadius, 0)
				if ($g[39].setPt(1, $g[37], $g[38], 50, 1, 1))
				return
				$pc = 1
			case 1:
				if (wait(95))
				return
				$pc = 2
			case 2:
				$g[42] = sqrt(pow($g[37]-$g[35], 2)+pow($g[38]-$g[36], 2))
				debug("Line 1's length: %d", $g[42])
				$g[43] = $g[37]-$g[35]
				$g[44] = $g[38]-$g[36]
				$g[45] = $g[44]/$g[43]
				$g[46] = atan($g[45])
				$g[47] = $g[39].getTheta()
				debug("Line 1's angle: %d", $g[47])
				debug("Line 1's calculated angle: %d", $g[46])
				$g[48] = $g[33]
				$g[49] = H/2
				$g[50] = $g[48]+300
				$g[51] = H/2
				$g[52] = new Arc($g[0], 0, 0, $g[1], 0, $g[48], $g[49], $g[35], $g[36], arcRadius, arcRadius, 270, 0)
				if ($g[52].rotateSpanAngle(180, 50, 1, 1))
				return
				$pc = 3
			case 3:
				if (wait(95))
				return
				$pc = 4
			case 4:
				$g[53] = new Arc($g[0], 0, 0, $g[1], 0, $g[50], $g[51], $g[35], $g[36], arcRadius, arcRadius, -90, 0)
				if ($g[53].rotateSpanAngle(-180, 50, 1, 1))
				return
				$pc = 5
			case 5:
				if (wait(95))
				return
				$pc = 6
			case 6:
				$g[54] = arcRadius
				$g[55] = $g[35]
				$g[56] = $g[36]
				$g[57] = arcRadius
				$g[58] = $g[37]
				$g[59] = $g[38]
				$g[60] = sqrt(pow(($g[58]-$g[55]), 2)+pow(($g[59]-$g[56]), 2))
				debug("d: %d", $g[60])
				$g[61] = pow($g[54], 2)
				debug("a: %d", $g[61])
				$g[61]=$g[61]-(pow($g[57], 2))
				debug("a: %d", $g[61])
				$g[61]=$g[61]+(pow($g[60], 2))
				$g[61]=$g[61]/(2*$g[60])
				debug("a: %d", $g[61])
				$g[62] = pow($g[54], 2)-pow($g[61], 2)
				debug("h: %d", $g[62])
				$g[62]=sqrt($g[62])
				debug("h: %d", $g[62])
				$g[63] = $g[58]-$g[55]
				debug("x2: %d", $g[63])
				$g[63]=$g[63]/$g[60]
				debug("x2: %d", $g[63])
				$g[63]=$g[61]*$g[63]
				debug("x2: %d", $g[63])
				$g[63]=$g[55]+$g[63]
				debug("x2: %d", $g[63])
				$g[64] = ($g[59]-$g[56])
				debug("y2: %d", $g[64])
				$g[64]=$g[64]/$g[60]
				debug("y2: %d", $g[64])
				$g[64]=$g[61]*$g[64]
				debug("y2: %d", $g[64])
				$g[64]=$g[56]+$g[64]
				debug("y2: %d", $g[64])
				$g[65] = $g[59]-$g[56]
				debug("x3: %d", $g[65])
				$g[65]=$g[65]/$g[60]
				debug("x3: %d", $g[65])
				$g[65]=$g[62]*$g[65]
				debug("x3: %d", $g[65])
				$g[65]=$g[63]+$g[65]
				debug("x3: %d", $g[65])
				$g[66] = $g[58]-$g[55]
				debug("y3: %d", $g[66])
				$g[66]=$g[66]/$g[60]
				debug("y3: %d", $g[66])
				$g[66]=$g[62]*$g[66]
				debug("y3: %d", $g[66])
				$g[66]=$g[64]-$g[66]
				debug("y3: %d", $g[66])
				$g[67] = $g[59]-$g[56]
				debug("x4: %d", $g[67])
				$g[67]=$g[67]/$g[60]
				debug("x4: %d", $g[67])
				$g[67]=$g[62]*$g[67]
				debug("x4: %d", $g[67])
				$g[67]=$g[63]-$g[67]
				debug("x4: %d", $g[67])
				$g[68] = $g[58]-$g[55]
				debug("y4: %d", $g[68])
				$g[68]=$g[68]/$g[60]
				debug("y4: %d", $g[68])
				$g[68]=$g[62]*$g[68]
				debug("y4: %d", $g[68])
				$g[68]=$g[64]+$g[68]
				debug("y4: %d", $g[68])
				debug("Final points:")
				debug("x3: %d", $g[65])
				debug("y3: %d", $g[66])
				debug("x4: %d", $g[67])
				debug("y4: %d", $g[68])
				debug("Line l3 = Line(0, 0, bluePen, linePosX, linePosY, x3, y3, x4-x3, y4-y3);")
				$g[69] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[33]-(dotRadius/2), $g[34]-(dotRadius/2), $g[65], $g[66], dotRadius, dotRadius, 0)
				$g[70] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[33]-(dotRadius/2), $g[34]-(dotRadius/2), $g[67], $g[68], dotRadius, dotRadius, 0)
				if (wait(95))
				return
				$pc = 7
			case 7:
				$g[71] = new Line($g[0], 0, 0, $g[3], $g[33], $g[34], $g[65], $g[66], 0, 0)
				if ($g[71].setPt(1, $g[67], $g[68], 50, 1, 1))
				return
				$pc = 8
			case 8:
				$g[72] = (($g[37]*$g[36])-($g[35]*$g[38]))*($g[67]-$g[65])-((($g[67]*$g[66])-($g[65]*$g[68]))*($g[37]-$g[35]))
				$g[72]=$g[72]/((($g[37]-$g[35])*($g[68]-$g[66]))-(($g[67]-$g[65])*($g[38]-$g[36])))
				debug("intersectX: %d", $g[72])
				$g[73] = (($g[37]*$g[36])-($g[35]*$g[38]))*($g[68]-$g[66])-((($g[67]*$g[66])-($g[65]*$g[68]))*($g[38]-$g[36]))
				$g[73]=$g[72]/((($g[37]-$g[35])*($g[68]-$g[66]))-(($g[67]-$g[65])*($g[38]-$g[36])))
				debug("intersectY: %d", $g[73])
				$g[74] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[33]-(dotRadius/2), $g[34]-(dotRadius/2), $g[72], $g[73], dotRadius, dotRadius, 0)
				$g[52].setOpacity(0, 50, 1, 0)
				$g[53].setOpacity(0, 50, 1, 0)
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
