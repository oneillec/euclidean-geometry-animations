"use strict"

function parallel_line_through_given_a_point(vplayer) {

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
	var rgba = vplayer.rgba
	var setViewport = vplayer.setViewport
	var SolidBrush = vplayer.SolidBrush
	var SolidPen = vplayer.SolidPen
	var sqrt = vplayer.sqrt
	var terminateThread = vplayer.terminateThread

	const W = 1024
	const H = 620
	const dotRadius = 5

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
				$g[32] = new SolidPen(0, 0, rgba(73/256, 126/256, 191/256, 100))
				$g[33] = new SolidPen(0, 0, rgba(0/256, 149/256, 82/256, 100))
				$g[34] = new SolidBrush(rgba(73/256, 126/256, 191/256, 100))
				$g[35] = new SolidBrush(rgba(0/256, 149/256, 82/256, 100))
				$g[36] = new Rectangle2($g[0], 0, W/2|VCENTRE, 0, 0, W/2-60, H/2-280, 200, 50, $g[1], 0)
				$g[36].setTxt("Parallel line through given point", 0)
				$g[37] = (W/2)-160
				$g[38] = H/2+100
				$g[39] = 0
				$g[40] = 0
				$g[41] = 300
				$g[42] = 0
				$g[43] = $g[41]/2
				$g[44] = -100
				$g[45] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[37]-(dotRadius/2), $g[38]-(dotRadius/2), $g[39], $g[40], dotRadius, dotRadius, 0)
				$g[46] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[37]+$g[39], $g[38]+$g[40], 0, 30, $g[1], $g[31])
				$g[46].setTxt("A", 0)
				$g[47] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[37]-(dotRadius/2), $g[38]-(dotRadius/2), $g[41], $g[42], dotRadius, dotRadius, 0)
				$g[48] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[37]+$g[41], $g[38]+$g[42], 0, 30, $g[1], $g[31])
				$g[48].setTxt("B", 0)
				$g[49] = new Line($g[0], 0, 0, $g[1], $g[37], $g[38], $g[39], $g[40], $g[39]+$g[41], $g[40]+$g[42])
				$g[50] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[37]-(dotRadius/2), $g[38]-(dotRadius/2), $g[43], $g[44], dotRadius, dotRadius, 0)
				if (wait(90))
				return
				$pc = 1
			case 1:
				$g[51] = new Arc($g[0], 0, 0, $g[32], 0, $g[37], $g[38], $g[43], $g[44], 125, 125, 0, 0)
				if ($g[51].rotateSpanAngle(360, 50, 1, 1))
				return
				$pc = 2
			case 2:
				$g[52] = new Ellipse($g[0], 0, 0, $g[32], $g[34], $g[37]-(dotRadius/2), $g[38]-(dotRadius/2), 75, 0, dotRadius, dotRadius, 0)
				$g[53] = new Ellipse($g[0], 0, 0, $g[32], $g[34], $g[37]-(dotRadius/2), $g[38]-(dotRadius/2), 225, 0, dotRadius, dotRadius, 0)
				if (wait(90))
				return
				$pc = 3
			case 3:
				if ($g[51].setOpacity(0, 50, 1, 1))
				return
				$pc = 4
			case 4:
				if (wait(90))
				return
				$pc = 5
			case 5:
				$g[54] = new Arc($g[0], 0, 0, $g[32], 0, $g[37], $g[38], 75, 0, 130, 130, 270, 0)
				if ($g[54].rotateSpanAngle(180, 50, 1, 1))
				return
				$pc = 6
			case 6:
				if (wait(90))
				return
				$pc = 7
			case 7:
				$g[55] = new Arc($g[0], 0, 0, $g[32], 0, $g[37], $g[38], 225, 0, 130, 130, -90, 0)
				if ($g[55].rotateSpanAngle(-180, 50, 1, 1))
				return
				$pc = 8
			case 8:
				if (wait(90))
				return
				$pc = 9
			case 9:
				$g[56] = 130
				$g[57] = 75
				$g[58] = 0
				$g[59] = 130
				$g[60] = 225
				$g[61] = 0
				$g[62] = sqrt(pow(($g[60]-$g[57]), 2)+pow(($g[61]-$g[58]), 2))
				debug("d: %d", $g[62])
				$g[63] = pow($g[56], 2)
				debug("a: %d", $g[63])
				$g[63]=$g[63]-(pow($g[59], 2))
				debug("a: %d", $g[63])
				$g[63]=$g[63]+(pow($g[62], 2))
				$g[63]=$g[63]/(2*$g[62])
				debug("a: %d", $g[63])
				$g[64] = pow($g[56], 2)-pow($g[63], 2)
				debug("h: %d", $g[64])
				$g[64]=sqrt($g[64])
				debug("h: %d", $g[64])
				$g[65] = $g[60]-$g[57]
				debug("x2: %d", $g[65])
				$g[65]=$g[65]/$g[62]
				debug("x2: %d", $g[65])
				$g[65]=$g[63]*$g[65]
				debug("x2: %d", $g[65])
				$g[65]=$g[57]+$g[65]
				debug("x2: %d", $g[65])
				$g[66] = ($g[61]-$g[58])
				debug("y2: %d", $g[66])
				$g[66]=$g[66]/$g[62]
				debug("y2: %d", $g[66])
				$g[66]=$g[63]*$g[66]
				debug("y2: %d", $g[66])
				$g[66]=$g[58]+$g[66]
				debug("y2: %d", $g[66])
				$g[67] = $g[61]-$g[58]
				debug("x3: %d", $g[67])
				$g[67]=$g[67]/$g[62]
				debug("x3: %d", $g[67])
				$g[67]=$g[64]*$g[67]
				debug("x3: %d", $g[67])
				$g[67]=$g[65]+$g[67]
				debug("x3: %d", $g[67])
				$g[68] = $g[60]-$g[57]
				debug("y3: %d", $g[68])
				$g[68]=$g[68]/$g[62]
				debug("y3: %d", $g[68])
				$g[68]=$g[64]*$g[68]
				debug("y3: %d", $g[68])
				$g[68]=$g[66]-$g[68]
				debug("y3: %d", $g[68])
				$g[69] = $g[61]-$g[58]
				debug("x4: %d", $g[69])
				$g[69]=$g[69]/$g[62]
				debug("x4: %d", $g[69])
				$g[69]=$g[64]*$g[69]
				debug("x4: %d", $g[69])
				$g[69]=$g[65]-$g[69]
				debug("x4: %d", $g[69])
				$g[70] = $g[60]-$g[57]
				debug("y4: %d", $g[70])
				$g[70]=$g[70]/$g[62]
				debug("y4: %d", $g[70])
				$g[70]=$g[64]*$g[70]
				debug("y4: %d", $g[70])
				$g[70]=$g[66]+$g[70]
				debug("y4: %d", $g[70])
				debug("Final points:")
				debug("x3: %d", $g[67])
				debug("y3: %d", $g[68])
				debug("x4: %d", $g[69])
				debug("y4: %d", $g[70])
				debug("Line l3 = Line(0, 0, bluePen, linePosX, linePosY, x3, y3, x4-x3, y4-y3);")
				$g[71] = new Ellipse($g[0], 0, 0, $g[3], $g[18], $g[37]-(dotRadius/2), $g[38]-(dotRadius/2), $g[67], $g[68], dotRadius, dotRadius, 0)
				$g[72] = new Ellipse($g[0], 0, 0, $g[3], $g[18], $g[37]-(dotRadius/2), $g[38]-(dotRadius/2), $g[69], $g[70], dotRadius, dotRadius, 0)
				if (wait(90))
				return
				$pc = 10
			case 10:
				$g[54].setOpacity(0, 50, 1, 0)
				$g[52].setOpacity(0, 50, 1, 0)
				$g[53].setOpacity(0, 50, 1, 0)
				if ($g[55].setOpacity(0, 50, 1, 1))
				return
				$pc = 11
			case 11:
				if (wait(90))
				return
				$pc = 12
			case 12:
				$g[73] = new Line($g[0], 0, 0, $g[1], $g[37], $g[38], $g[67], $g[68]-120, 0, 0)
				if ($g[73].setPt(1, $g[69], $g[70]+20, 50, 1, 1))
				return
				$pc = 13
			case 13:
				$g[74] = new Ellipse($g[0], 0, 0, $g[32], $g[34], $g[37]-(dotRadius/2), $g[38]-(dotRadius/2), $g[43], $g[42], dotRadius, dotRadius, 0)
				if (wait(90))
				return
				$pc = 14
			case 14:
				$g[71].setOpacity(0, 50, 1, 0)
				if ($g[72].setOpacity(0, 50, 1, 1))
				return
				$pc = 15
			case 15:
				if (wait(90))
				return
				$pc = 16
			case 16:
				$g[75] = new Arc($g[0], 0, 0, $g[32], 0, $g[37], $g[38], $g[43], $g[44], 100, 100, 270-30, 0)
				if ($g[75].rotateSpanAngle(60, 50, 1, 1))
				return
				$pc = 17
			case 17:
				$g[76] = new Ellipse($g[0], 0, 0, $g[32], $g[34], $g[37]-(dotRadius/2), $g[38]-(dotRadius/2), $g[43], $g[44]-100, dotRadius, dotRadius, 0)
				if (wait(90))
				return
				$pc = 18
			case 18:
				if ($g[75].setOpacity(0, 50, 1, 1))
				return
				$pc = 19
			case 19:
				if (wait(90))
				return
				$pc = 20
			case 20:
				$g[77] = new Arc($g[0], 0, 0, $g[33], 0, $g[37], $g[38], $g[43], $g[42], 130, 130, 180, 0)
				if ($g[77].rotateSpanAngle(180, 50, 1, 1))
				return
				$pc = 21
			case 21:
				if (wait(90))
				return
				$pc = 22
			case 22:
				$g[78] = new Arc($g[0], 0, 0, $g[33], 0, $g[37], $g[38], $g[43], $g[44]-100, 130, 130, 0, 0)
				if ($g[78].rotateSpanAngle(180, 50, 1, 1))
				return
				$pc = 23
			case 23:
				$g[56]=130
				$g[57]=$g[43]
				$g[58]=$g[42]
				$g[59]=130
				$g[60]=$g[43]
				$g[61]=$g[44]-100
				$g[62]=sqrt(pow(($g[60]-$g[57]), 2)+pow(($g[61]-$g[58]), 2))
				$g[63]=pow($g[56], 2)
				$g[63]=$g[63]-(pow($g[59], 2))
				$g[63]=$g[63]+(pow($g[62], 2))
				$g[63]=$g[63]/(2*$g[62])
				$g[64]=pow($g[56], 2)-pow($g[63], 2)
				$g[64]=sqrt($g[64])
				$g[65]=$g[60]-$g[57]
				$g[65]=$g[65]/$g[62]
				$g[65]=$g[63]*$g[65]
				$g[65]=$g[57]+$g[65]
				$g[66]=($g[61]-$g[58])
				$g[66]=$g[66]/$g[62]
				$g[66]=$g[63]*$g[66]
				$g[66]=$g[58]+$g[66]
				$g[79] = $g[61]-$g[58]
				$g[79]=$g[79]/$g[62]
				$g[79]=$g[64]*$g[79]
				$g[79]=$g[65]+$g[79]
				$g[80] = $g[60]-$g[57]
				$g[80]=$g[80]/$g[62]
				$g[80]=$g[64]*$g[80]
				$g[80]=$g[66]-$g[80]
				$g[81] = $g[61]-$g[58]
				$g[81]=$g[81]/$g[62]
				$g[81]=$g[64]*$g[81]
				$g[81]=$g[65]-$g[81]
				$g[82] = $g[60]-$g[57]
				$g[82]=$g[82]/$g[62]
				$g[82]=$g[64]*$g[82]
				$g[82]=$g[66]+$g[82]
				$g[83] = new Ellipse($g[0], 0, 0, $g[33], $g[35], $g[37]-(dotRadius/2), $g[38]-(dotRadius/2), $g[79], $g[80], dotRadius, dotRadius, 0)
				$g[84] = new Ellipse($g[0], 0, 0, $g[33], $g[35], $g[37]-(dotRadius/2), $g[38]-(dotRadius/2), $g[81], $g[82], dotRadius, dotRadius, 0)
				if (wait(90))
				return
				$pc = 24
			case 24:
				$g[85] = new Line($g[0], 0, 0, $g[33], $g[37], $g[38], $g[39], $g[80], 0, 0)
				if ($g[85].setPt(0, $g[41], $g[82], 50, 1, 1))
				return
				$pc = 25
			case 25:
				if (wait(90))
				return
				$pc = 26
			case 26:
				$g[73].setOpacity(0, 50, 1, 0)
				$g[74].setOpacity(0, 50, 1, 0)
				$g[76].setOpacity(0, 50, 1, 0)
				$g[77].setOpacity(0, 50, 1, 0)
				$g[78].setOpacity(0, 50, 1, 0)
				$g[83].setOpacity(0, 50, 1, 0)
				if ($g[84].setOpacity(0, 50, 1, 1))
				return
				$pc = 27
			case 27:
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
