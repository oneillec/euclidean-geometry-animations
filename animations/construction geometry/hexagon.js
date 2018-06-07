"use strict"

function hexagon(vplayer) {

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
				$g[36] = new Rectangle2($g[0], 0, W/2|VCENTRE, 0, 0, W/2, H/2-280, 200, 50, $g[1], 0)
				$g[36].setTxt("Hexagon given circle and point on circle", 0)
				$g[37] = (W/2)-150
				$g[38] = H/2+50
				$g[39] = 150
				$g[40] = 0
				$g[41] = 150
				$g[42] = 0
				$g[43] = $g[40]
				$g[44] = $g[41]
				$g[45] = new Arc($g[0], 0, 0, $g[1], 0, $g[37], $g[38], $g[39], $g[40], 150, 150, 0, 360)
				$g[46] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[37]-(dotRadius/2), $g[38]-(dotRadius/2), $g[39], $g[40], dotRadius, dotRadius, 0)
				$g[47] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[37]-(dotRadius/2), $g[38]-(dotRadius/2), $g[42], $g[43], dotRadius, dotRadius, 0)
				if (wait(90))
				return
				$pc = 1
			case 1:
				$g[48] = new Arc($g[0], 0, 0, $g[32], 0, $g[37], $g[38], $g[42], $g[43], $g[44], $g[44], 0, 0)
				if ($g[48].rotateSpanAngle(360, 50, 1, 1))
				return
				$pc = 2
			case 2:
				$g[49] = sqrt(pow(($g[42]-$g[39]), 2)+pow(($g[43]-$g[40]), 2))
				$g[50] = pow($g[41], 2)
				$g[50]=$g[50]-(pow($g[44], 2))
				$g[50]=$g[50]+(pow($g[49], 2))
				$g[50]=$g[50]/(2*$g[49])
				$g[51] = pow($g[41], 2)-pow($g[50], 2)
				$g[51]=sqrt($g[51])
				$g[52] = $g[42]-$g[39]
				$g[52]=$g[52]/$g[49]
				$g[52]=$g[50]*$g[52]
				$g[52]=$g[39]+$g[52]
				$g[53] = ($g[43]-$g[40])
				$g[53]=$g[53]/$g[49]
				$g[53]=$g[50]*$g[53]
				$g[53]=$g[40]+$g[53]
				$g[54] = $g[43]-$g[40]
				$g[54]=$g[54]/$g[49]
				$g[54]=$g[51]*$g[54]
				$g[54]=$g[52]+$g[54]
				$g[55] = $g[42]-$g[39]
				$g[55]=$g[55]/$g[49]
				$g[55]=$g[51]*$g[55]
				$g[55]=$g[53]-$g[55]
				$g[56] = $g[43]-$g[40]
				$g[56]=$g[56]/$g[49]
				$g[56]=$g[51]*$g[56]
				$g[56]=$g[52]-$g[56]
				$g[57] = $g[42]-$g[39]
				$g[57]=$g[57]/$g[49]
				$g[57]=$g[51]*$g[57]
				$g[57]=$g[53]+$g[57]
				$g[58] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[37]-(dotRadius/2), $g[38]-(dotRadius/2), $g[54], $g[55], dotRadius, dotRadius, 0)
				$g[59] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[37]-(dotRadius/2), $g[38]-(dotRadius/2), $g[56], $g[57], dotRadius, dotRadius, 0)
				if (wait(90))
				return
				$pc = 3
			case 3:
				if ($g[48].setOpacity(0, 50, 1, 1))
				return
				$pc = 4
			case 4:
				if (wait(90))
				return
				$pc = 5
			case 5:
				$g[60] = new Line($g[0], 0, 0, $g[33], $g[37], $g[38], $g[56], $g[57], 0, 0)
				$g[61] = 300-$g[56]
				$g[62] = -$g[57]
				if ($g[60].setPt(1, $g[61], $g[62], 50, 1, 1))
				return
				$pc = 6
			case 6:
				$g[63] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[37]-(dotRadius/2), $g[38]-(dotRadius/2), $g[61], $g[62], dotRadius, dotRadius, 0)
				if (wait(90))
				return
				$pc = 7
			case 7:
				$g[64] = new Line($g[0], 0, 0, $g[33], $g[37], $g[38], $g[42], $g[43], 0, 0)
				$g[65] = $g[39]+$g[39]
				$g[66] = $g[40]+$g[40]
				if ($g[64].setPt(1, $g[65], $g[66], 50, 1, 1))
				return
				$pc = 8
			case 8:
				$g[67] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[37]-(dotRadius/2), $g[38]-(dotRadius/2), $g[65], $g[66], dotRadius, dotRadius, 0)
				if (wait(90))
				return
				$pc = 9
			case 9:
				$g[68] = new Line($g[0], 0, 0, $g[33], $g[37], $g[38], $g[54], $g[55], 0, 0)
				$g[69] = $g[61]
				$g[70] = $g[57]
				if ($g[68].setPt(1, $g[69], $g[70], 50, 1, 1))
				return
				$pc = 10
			case 10:
				$g[71] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[37]-(dotRadius/2), $g[38]-(dotRadius/2), $g[69], $g[70], dotRadius, dotRadius, 0)
				if (wait(90))
				return
				$pc = 11
			case 11:
				$g[46].setOpacity(0, 50, 1, 0)
				$g[45].setOpacity(0, 50, 1, 0)
				$g[60].setOpacity(0, 50, 1, 0)
				$g[64].setOpacity(0, 50, 1, 0)
				if ($g[68].setOpacity(0, 50, 1, 1))
				return
				$pc = 12
			case 12:
				if (wait(90))
				return
				$pc = 13
			case 13:
				$g[72] = new Line($g[0], 0, 0, $g[1], $g[37], $g[38], $g[56], $g[57], 0, 0)
				$g[72].setPt(1, $g[69], $g[70], 50, 1, 0)
				$g[73] = new Line($g[0], 0, 0, $g[1], $g[37], $g[38], $g[61], $g[62], 0, 0)
				if ($g[73].setPt(1, $g[54], $g[55], 50, 1, 1))
				return
				$pc = 14
			case 14:
				$g[74] = new Line($g[0], 0, 0, $g[1], $g[37], $g[38], $g[69], $g[70], 0, 0)
				$g[74].setPt(1, $g[65], $g[66], 50, 1, 0)
				$g[75] = new Line($g[0], 0, 0, $g[1], $g[37], $g[38], $g[54], $g[55], 0, 0)
				if ($g[75].setPt(1, $g[42], $g[43], 50, 1, 1))
				return
				$pc = 15
			case 15:
				$g[76] = new Line($g[0], 0, 0, $g[1], $g[37], $g[38], $g[42], $g[43], 0, 0)
				$g[76].setPt(1, $g[56], $g[57], 50, 1, 0)
				$g[77] = new Line($g[0], 0, 0, $g[1], $g[37], $g[38], $g[65], $g[66], 0, 0)
				if ($g[77].setPt(1, $g[61], $g[62], 50, 1, 1))
				return
				$pc = 16
			case 16:
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
