"use strict"

function circumcentre_and_circumcircle_of_a_triangle(vplayer) {

	const ARROW60_END = vplayer.ARROW60_END
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
	const SOLID = vplayer.SOLID
	const VCENTRE = vplayer.VCENTRE
	const WHITE = vplayer.WHITE
	const YELLOW = vplayer.YELLOW

	var $g = vplayer.$g
	var addWaitToEventQ = vplayer.addWaitToEventQ
	var Arc = vplayer.Arc
	var checkPoint = vplayer.checkPoint
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
	const unitLength = 60
	const aLength = unitLength*5

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
				$g[31] = new Rectangle2($g[0], 0, W/2|VCENTRE, 0, 0, W/2-60, H/2-280, 200, 50, $g[1], 0)
				$g[31].setTxt("Circumcentre & circumcircle of a triangle", 0)
				setViewport(0, 0, W, H, 1)
				$g[32] = new Font("Calibri", 18)
				$g[33] = new Font("Calibri", 15)
				$g[34] = new SolidPen(SOLID, 3, RED, ARROW60_END, 2, 4)
				$g[35] = new SolidPen(0, 0, rgba(73/256, 126/256, 191/256, 100))
				$g[36] = new SolidPen(0, 0, rgba(0/256, 144/256, 17/256, 100))
				$g[37] = new SolidBrush(rgba(73/256, 126/256, 191/256, 100))
				$g[38] = new SolidBrush(rgba(0/256, 144/256, 17/256, 100))
				$g[39] = (W/2)-150
				$g[40] = H/2+100
				$g[41] = 0
				$g[42] = 0
				$g[43] = $g[41]+200
				$g[44] = $g[42]
				$g[45] = $g[41]+140
				$g[46] = $g[42]-140
				$g[47] = new Line($g[0], 0, 0, $g[1], $g[39], $g[40], $g[41], $g[42], $g[43]-$g[41], $g[42]+$g[44])
				$g[48] = new Line($g[0], 0, 0, $g[1], $g[39], $g[40], $g[43], $g[44], $g[45]-$g[43], $g[44]+$g[46])
				$g[49] = new Line($g[0], 0, 0, $g[1], $g[39], $g[40], $g[41], $g[42], $g[45]-$g[41], $g[46]+$g[42])
				$g[50] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[39]-(dotRadius/2), $g[40]-(dotRadius/2), $g[41], $g[42], dotRadius, dotRadius, 0)
				$g[51] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[39]+$g[41], $g[40]+$g[42], -30, 10, $g[1], $g[32])
				$g[51].setTxt("A", 0)
				$g[52] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[39]-(dotRadius/2), $g[40]-(dotRadius/2), $g[43], $g[44], dotRadius, dotRadius, 0)
				$g[53] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[39]+$g[43], $g[40]+$g[44], 30, 10, $g[1], $g[32])
				$g[53].setTxt("B", 0)
				$g[54] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[39]-(dotRadius/2), $g[40]-(dotRadius/2), $g[45], $g[46], dotRadius, dotRadius, 0)
				$g[55] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[39]+$g[45], $g[40]+$g[46], 10, -30, $g[1], $g[32])
				$g[55].setTxt("C", 0)
				if (wait(1))
				return
				$pc = 1
			case 1:
				$g[56] = sqrt(pow($g[43]-$g[41], 2)+pow($g[44]-$g[42], 2))/2+20
				$g[57] = new Arc($g[0], 0, 0, $g[3], 0, $g[39], $g[40], $g[41], $g[42], $g[56], $g[56], 270, 0)
				if ($g[57].rotateSpanAngle(180, 50, 1, 1))
				return
				$pc = 2
			case 2:
				if (wait(90))
				return
				$pc = 3
			case 3:
				$g[58] = new Arc($g[0], 0, 0, $g[3], 0, $g[39], $g[40], $g[43], $g[44], $g[56], $g[56], -90, 0)
				if ($g[58].rotateSpanAngle(-180, 50, 1, 1))
				return
				$pc = 4
			case 4:
				$g[59] = $g[56]
				$g[60] = $g[39]+$g[41]
				$g[61] = $g[40]+$g[42]
				$g[62] = $g[56]
				$g[63] = $g[39]+$g[43]
				$g[64] = $g[40]+$g[44]
				if (wait(90))
				return
				$pc = 5
			case 5:
				$g[65] = sqrt(pow(($g[63]-$g[60]), 2)+pow(($g[64]-$g[61]), 2))
				$g[66] = pow($g[59], 2)
				$g[66]=$g[66]-(pow($g[62], 2))
				$g[66]=$g[66]+(pow($g[65], 2))
				$g[66]=$g[66]/(2*$g[65])
				$g[67] = pow($g[59], 2)-pow($g[66], 2)
				$g[67]=sqrt($g[67])
				$g[68] = $g[63]-$g[60]
				$g[68]=$g[68]/$g[65]
				$g[68]=$g[66]*$g[68]
				$g[68]=$g[60]+$g[68]
				$g[69] = ($g[64]-$g[61])
				$g[69]=$g[69]/$g[65]
				$g[69]=$g[66]*$g[69]
				$g[69]=$g[61]+$g[69]
				$g[70] = $g[64]-$g[61]
				$g[70]=$g[70]/$g[65]
				$g[70]=$g[67]*$g[70]
				$g[70]=$g[68]+$g[70]
				$g[71] = $g[63]-$g[60]
				$g[71]=$g[71]/$g[65]
				$g[71]=$g[67]*$g[71]
				$g[71]=$g[69]-$g[71]
				$g[72] = $g[64]-$g[61]
				$g[72]=$g[72]/$g[65]
				$g[72]=$g[67]*$g[72]
				$g[72]=$g[68]-$g[72]
				$g[73] = $g[63]-$g[60]
				$g[73]=$g[73]/$g[65]
				$g[73]=$g[67]*$g[73]
				$g[73]=$g[69]+$g[73]
				$g[74] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[70]-(dotRadius/2), $g[71]-(dotRadius/2), 0, 0, dotRadius, dotRadius, 0)
				$g[75] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[72]-(dotRadius/2), $g[73]-(dotRadius/2), 0, 0, dotRadius, dotRadius, 0)
				$g[76] = $g[70]
				$g[77] = $g[71]
				$g[78] = $g[72]
				$g[79] = $g[73]
				$g[80] = new Line($g[0], 0, 0, $g[35], $g[72], $g[73]+30, 0, 0, 0, 0)
				if ($g[80].setPt(0, $g[70]-$g[72], ($g[71]-30)-($g[73]+30), 50, 1, 1))
				return
				$pc = 6
			case 6:
				if (wait(95))
				return
				$pc = 7
			case 7:
				$g[74].setOpacity(0, 50, 1, 0)
				$g[75].setOpacity(0, 50, 1, 0)
				$g[57].setOpacity(0, 50, 1, 0)
				if ($g[58].setOpacity(0, 50, 1, 1))
				return
				$pc = 8
			case 8:
				checkPoint()
				$g[56]=sqrt(pow($g[45]-$g[41], 2)+pow($g[46]-$g[42], 2))/2+20
				$g[81] = new Arc($g[0], 0, 0, $g[3], 0, $g[39], $g[40], $g[41], $g[42], $g[56], $g[56], 270-45, 0)
				if ($g[81].rotateSpanAngle(180, 50, 1, 1))
				return
				$pc = 9
			case 9:
				if (wait(90))
				return
				$pc = 10
			case 10:
				$g[82] = new Arc($g[0], 0, 0, $g[3], 0, $g[39], $g[40], $g[45], $g[46], $g[56], $g[56], -90-45, 0)
				if ($g[82].rotateSpanAngle(-180, 50, 1, 1))
				return
				$pc = 11
			case 11:
				$g[59]=$g[56]
				$g[60]=$g[39]+$g[41]
				$g[61]=$g[40]+$g[42]
				$g[62]=$g[56]
				$g[63]=$g[39]+$g[45]
				$g[64]=$g[40]+$g[46]
				if (wait(90))
				return
				$pc = 12
			case 12:
				$g[65]=sqrt(pow(($g[63]-$g[60]), 2)+pow(($g[64]-$g[61]), 2))
				$g[66]=pow($g[59], 2)
				$g[66]=$g[66]-(pow($g[62], 2))
				$g[66]=$g[66]+(pow($g[65], 2))
				$g[66]=$g[66]/(2*$g[65])
				$g[67]=pow($g[59], 2)-pow($g[66], 2)
				$g[67]=sqrt($g[67])
				$g[68]=$g[63]-$g[60]
				$g[68]=$g[68]/$g[65]
				$g[68]=$g[66]*$g[68]
				$g[68]=$g[60]+$g[68]
				$g[69]=($g[64]-$g[61])
				$g[69]=$g[69]/$g[65]
				$g[69]=$g[66]*$g[69]
				$g[69]=$g[61]+$g[69]
				$g[70]=$g[64]-$g[61]
				$g[70]=$g[70]/$g[65]
				$g[70]=$g[67]*$g[70]
				$g[70]=$g[68]+$g[70]
				$g[71]=$g[63]-$g[60]
				$g[71]=$g[71]/$g[65]
				$g[71]=$g[67]*$g[71]
				$g[71]=$g[69]-$g[71]
				$g[72]=$g[64]-$g[61]
				$g[72]=$g[72]/$g[65]
				$g[72]=$g[67]*$g[72]
				$g[72]=$g[68]-$g[72]
				$g[73]=$g[63]-$g[60]
				$g[73]=$g[73]/$g[65]
				$g[73]=$g[67]*$g[73]
				$g[73]=$g[69]+$g[73]
				$g[74]=new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[70]-(dotRadius/2), $g[71]-(dotRadius/2), 0, 0, dotRadius, dotRadius, 0)
				$g[75]=new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[72]-(dotRadius/2), $g[73]-(dotRadius/2), 0, 0, dotRadius, dotRadius, 0)
				$g[83] = $g[70]
				$g[84] = $g[71]
				$g[85] = $g[72]
				$g[86] = $g[73]
				$g[74].setOpacity(1, 50, 1, 0)
				if ($g[75].setOpacity(1, 50, 1, 1))
				return
				$pc = 13
			case 13:
				$g[87] = new Line($g[0], 0, 0, $g[35], $g[72], $g[73], 0, 0, 0, 0)
				if ($g[87].setPt(0, $g[70]-$g[72], $g[71]-$g[73], 50, 1, 1))
				return
				$pc = 14
			case 14:
				if (wait(95))
				return
				$pc = 15
			case 15:
				$g[74].setOpacity(0, 50, 1, 0)
				$g[75].setOpacity(0, 50, 1, 0)
				$g[81].setOpacity(0, 50, 1, 0)
				if ($g[82].setOpacity(0, 50, 1, 1))
				return
				$pc = 16
			case 16:
				checkPoint()
				$g[88] = (($g[78]*$g[77])-($g[76]*$g[79]))*($g[85]-$g[83])-(($g[85]*$g[84])-($g[83]*$g[86]))*($g[78]-$g[76])
				$g[88]=$g[88]/(($g[78]-$g[76])*($g[86]-$g[84])-($g[85]-$g[83])*($g[79]-$g[77]))
				$g[88]=$g[88]-$g[39]
				$g[89] = (($g[78]*$g[77])-($g[76]*$g[79]))*($g[86]-$g[84])-(($g[85]*$g[84])-($g[83]*$g[86]))*($g[79]-$g[77])
				$g[89]=$g[89]/(($g[78]-$g[76])*($g[86]-$g[84])-($g[85]-$g[83])*($g[79]-$g[77]))
				$g[89]=$g[89]-$g[40]
				if (wait(95))
				return
				$pc = 17
			case 17:
				$g[90] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[39]-(dotRadius/2), $g[40]-(dotRadius/2), $g[88], $g[89], dotRadius, dotRadius, 0)
				$g[91] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[39]+$g[88], $g[40]+$g[89], 0, -30, $g[1], $g[32])
				$g[91].setTxt("O", 0)
				if (wait(95))
				return
				$pc = 18
			case 18:
				$g[87].setOpacity(0, 50, 1, 0)
				if ($g[80].setOpacity(0, 50, 1, 1))
				return
				$pc = 19
			case 19:
				$g[92] = sqrt(pow($g[41]-$g[88], 2)+pow($g[42]-$g[89], 2))
				debug("lengthAO: %d", $g[92])
				debug("pointAx: %d", $g[41])
				debug("pointAy: %d", $g[42])
				debug("pointOx: %d", $g[88])
				debug("pointOy: %d", $g[89])
				if (wait(95))
				return
				$pc = 20
			case 20:
				$g[93] = new Arc($g[0], 0, 0, $g[3], 0, $g[39], $g[40], $g[88], $g[89], $g[92], $g[92], 0, 0, 0)
				$g[94] = new Line($g[0], 0, 0, $g[34], $g[39]+$g[88], $g[40]+$g[89], 0, 0, $g[92], 0)
				$g[94].rotate(360, 50, 1, 0)
				if ($g[93].rotateSpanAngle(360, 50, 1, 1))
				return
				$pc = 21
			case 21:
				if ($g[94].setOpacity(0, 50, 1, 1))
				return
				$pc = 22
			case 22:
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
