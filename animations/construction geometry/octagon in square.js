"use strict"

function octagon_in_square(vplayer) {

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
				$g[33] = new SolidPen(0, 0, rgba(0/256, 144/256, 17/256, 100))
				$g[34] = new SolidBrush(rgba(73/256, 126/256, 191/256, 100))
				$g[35] = new SolidBrush(rgba(0/256, 144/256, 17/256, 100))
				$g[36] = new Rectangle2($g[0], 0, W/2|VCENTRE, 0, 0, W/2-60, H/2-280, 200, 50, $g[1], 0)
				$g[36].setTxt("Regular octagon in a square", 0)
				$g[37] = 250
				$g[38] = (W/2)-($g[37]/2)
				$g[39] = H/2+200
				$g[40] = 0
				$g[41] = -$g[37]
				$g[42] = new Ellipse($g[0], 0, 0, $g[3], $g[18], $g[38]-(dotRadius/2), $g[39]-(dotRadius/2), $g[40], $g[41], dotRadius, dotRadius, 0)
				$g[43] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[38]+$g[40], $g[39]+$g[41], -30, 0, $g[1], $g[31])
				$g[43].setTxt("A", 0)
				$g[44] = $g[37]
				$g[45] = -$g[37]
				$g[46] = new Ellipse($g[0], 0, 0, $g[3], $g[18], $g[38]-(dotRadius/2), $g[39]-(dotRadius/2), $g[44], $g[45], dotRadius, dotRadius, 0)
				$g[47] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[38]+$g[44], $g[39]+$g[45], 30, 0, $g[1], $g[31])
				$g[47].setTxt("B", 0)
				$g[48] = $g[37]
				$g[49] = 0
				$g[50] = new Ellipse($g[0], 0, 0, $g[3], $g[18], $g[38]-(dotRadius/2), $g[39]-(dotRadius/2), $g[48], $g[49], dotRadius, dotRadius, 0)
				$g[51] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[38]+$g[48], $g[39]+$g[49], 30, 0, $g[1], $g[31])
				$g[51].setTxt("C", 0)
				$g[52] = 0
				$g[53] = 0
				$g[54] = new Ellipse($g[0], 0, 0, $g[3], $g[18], $g[38]-(dotRadius/2), $g[39]-(dotRadius/2), $g[52], $g[53], dotRadius, dotRadius, 0)
				$g[55] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[38]+$g[52], $g[39]+$g[53], -30, 0, $g[1], $g[31])
				$g[55].setTxt("D", 0)
				$g[56] = new Line($g[0], 0, 0, $g[3], $g[38], $g[39], $g[52], $g[53], $g[52]+$g[48], $g[53]+$g[49])
				$g[57] = new Line($g[0], 0, 0, $g[3], $g[38], $g[39], $g[48], $g[49], $g[48]-$g[44], $g[49]+$g[45])
				$g[58] = new Line($g[0], 0, 0, $g[3], $g[38], $g[39], $g[44], $g[45], $g[40]-$g[44], $g[45]-$g[41])
				$g[59] = new Line($g[0], 0, 0, $g[3], $g[38], $g[39], $g[40], $g[41], $g[40]-$g[52], $g[53]-$g[41])
				if (wait(90))
				return
				$pc = 1
			case 1:
				$g[60] = new Line($g[0], 0, 0, $g[32], $g[38], $g[39], $g[40]-10, $g[41]-10, 0, 0)
				if ($g[60].setPt(1, $g[48]+10, $g[49]+10, 50, 1, 1))
				return
				$pc = 2
			case 2:
				if (wait(90))
				return
				$pc = 3
			case 3:
				$g[61] = new Line($g[0], 0, 0, $g[32], $g[38], $g[39], $g[44]+10, $g[45]-10, 0, 0)
				if ($g[61].setPt(1, $g[52]-10, $g[53]+10, 50, 1, 1))
				return
				$pc = 4
			case 4:
				if (wait(90))
				return
				$pc = 5
			case 5:
				$g[62] = $g[52]+($g[37]/2)
				$g[63] = $g[53]-($g[37]/2)
				$g[64] = new Ellipse($g[0], 0, 0, $g[32], $g[34], $g[38]-(dotRadius/2), $g[39]-(dotRadius/2), $g[62], $g[63], dotRadius, dotRadius, 0)
				$g[65] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[38]+$g[62], $g[39]+$g[63], 0, -30, $g[1], $g[31])
				$g[65].setTxt("O", 0)
				if (wait(90))
				return
				$pc = 6
			case 6:
				$g[66] = sqrt(pow($g[62]-$g[40], 2)+pow($g[63]-$g[41], 2))
				$g[67] = new Arc($g[0], 0, 0, $g[1], 0, $g[38], $g[39], $g[40], $g[41], $g[66], $g[66], -265, 0)
				if ($g[67].rotateSpanAngle(-100, 50, 1, 1))
				return
				$pc = 7
			case 7:
				$g[68] = $g[40]+$g[66]
				$g[69] = $g[41]
				$g[70] = $g[40]
				$g[71] = $g[41]+$g[66]
				$g[72] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[38]-(dotRadius/2), $g[39]-(dotRadius/2), $g[68], $g[69], dotRadius, dotRadius, 0)
				$g[73] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[38]-(dotRadius/2), $g[39]-(dotRadius/2), $g[70], $g[71], dotRadius, dotRadius, 0)
				$g[74] = new Arc($g[0], 0, 0, $g[1], 0, $g[38], $g[39], $g[52], $g[53], $g[66], $g[66], -265-90, 0)
				if ($g[74].rotateSpanAngle(-100, 50, 1, 1))
				return
				$pc = 8
			case 8:
				$g[75] = $g[52]+$g[66]
				$g[76] = $g[53]
				$g[77] = $g[52]
				$g[78] = $g[53]-$g[66]
				$g[79] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[38]-(dotRadius/2), $g[39]-(dotRadius/2), $g[75], $g[76], dotRadius, dotRadius, 0)
				$g[80] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[38]-(dotRadius/2), $g[39]-(dotRadius/2), $g[77], $g[78], dotRadius, dotRadius, 0)
				$g[81] = new Arc($g[0], 0, 0, $g[1], 0, $g[38], $g[39], $g[48], $g[49], $g[66], $g[66], 265-90, 0)
				if ($g[81].rotateSpanAngle(100, 50, 1, 1))
				return
				$pc = 9
			case 9:
				$g[82] = $g[48]-$g[66]
				$g[83] = $g[49]
				$g[84] = $g[48]
				$g[85] = $g[49]-$g[66]
				$g[86] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[38]-(dotRadius/2), $g[39]-(dotRadius/2), $g[82], $g[83], dotRadius, dotRadius, 0)
				$g[87] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[38]-(dotRadius/2), $g[39]-(dotRadius/2), $g[84], $g[85], dotRadius, dotRadius, 0)
				$g[88] = new Arc($g[0], 0, 0, $g[1], 0, $g[38], $g[39], $g[44], $g[45], $g[66], $g[66], 265-180, 0)
				if ($g[88].rotateSpanAngle(100, 50, 1, 1))
				return
				$pc = 10
			case 10:
				$g[89] = $g[44]-$g[66]
				$g[90] = $g[45]
				$g[91] = $g[44]
				$g[92] = $g[45]+$g[66]
				$g[93] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[38]-(dotRadius/2), $g[39]-(dotRadius/2), $g[89], $g[90], dotRadius, dotRadius, 0)
				$g[94] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[38]-(dotRadius/2), $g[39]-(dotRadius/2), $g[91], $g[92], dotRadius, dotRadius, 0)
				if (wait(95))
				return
				$pc = 11
			case 11:
				$g[67].setOpacity(0, 50, 1, 0)
				$g[74].setOpacity(0, 50, 1, 0)
				$g[81].setOpacity(0, 50, 1, 0)
				if ($g[88].setOpacity(0, 50, 1, 1))
				return
				$pc = 12
			case 12:
				if (wait(95))
				return
				$pc = 13
			case 13:
				$g[95] = new Line($g[0], 0, 0, $g[1], $g[38], $g[39], $g[89], $g[90], 0, 0)
				if ($g[95].setPt(1, $g[77], $g[78], 50, 1, 1))
				return
				$pc = 14
			case 14:
				$g[96] = new Line($g[0], 0, 0, $g[1], $g[38], $g[39], $g[77], $g[78], 0, 0)
				if ($g[96].setPt(1, $g[70], $g[71], 50, 1, 1))
				return
				$pc = 15
			case 15:
				$g[97] = new Line($g[0], 0, 0, $g[1], $g[38], $g[39], $g[70], $g[71], 0, 0)
				if ($g[97].setPt(1, $g[82], $g[83], 50, 1, 1))
				return
				$pc = 16
			case 16:
				$g[98] = new Line($g[0], 0, 0, $g[1], $g[38], $g[39], $g[82], $g[83], 0, 0)
				if ($g[98].setPt(1, $g[75], $g[76], 50, 1, 1))
				return
				$pc = 17
			case 17:
				$g[99] = new Line($g[0], 0, 0, $g[1], $g[38], $g[39], $g[75], $g[76], 0, 0)
				if ($g[99].setPt(1, $g[91], $g[92], 50, 1, 1))
				return
				$pc = 18
			case 18:
				$g[100] = new Line($g[0], 0, 0, $g[1], $g[38], $g[39], $g[91], $g[92], 0, 0)
				if ($g[100].setPt(1, $g[84], $g[85], 50, 1, 1))
				return
				$pc = 19
			case 19:
				$g[101] = new Line($g[0], 0, 0, $g[1], $g[38], $g[39], $g[84], $g[85], 0, 0)
				if ($g[101].setPt(1, $g[68], $g[69], 50, 1, 1))
				return
				$pc = 20
			case 20:
				$g[102] = new Line($g[0], 0, 0, $g[1], $g[38], $g[39], $g[68], $g[69], 0, 0)
				if ($g[102].setPt(1, $g[89], $g[90], 50, 1, 1))
				return
				$pc = 21
			case 21:
				if (wait(90))
				return
				$pc = 22
			case 22:
				$g[60].setOpacity(0, 50, 1, 0)
				$g[61].setOpacity(0, 50, 1, 0)
				$g[64].setOpacity(0, 50, 1, 0)
				if ($g[65].setOpacity(0, 50, 1, 1))
				return
				$pc = 23
			case 23:
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
