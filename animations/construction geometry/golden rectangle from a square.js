"use strict"

function golden_rectangle_from_a_square(vplayer) {

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
				$g[33] = new SolidPen(0, 0, rgba(0/256, 144/256, 17/256, 100))
				$g[34] = new SolidBrush(rgba(73/256, 126/256, 191/256, 100))
				$g[35] = new SolidBrush(rgba(0/256, 144/256, 17/256, 100))
				$g[36] = new SolidPen(SOLID, 3, RED, ARROW60_END, 2, 4)
				$g[37] = new Rectangle2($g[0], 0, W/2|VCENTRE, 0, 0, W/2-60, H/2-280, 200, 50, $g[1], 0)
				$g[37].setTxt("Golden rectangle from a square", 0)
				$g[38] = 250
				$g[39] = (W/2)-($g[38]/2)
				$g[40] = H/2+100
				$g[41] = -100
				$g[42] = -$g[38]
				$g[43] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[39]-(dotRadius/2), $g[40]-(dotRadius/2), $g[41], $g[42], dotRadius, dotRadius, 0)
				$g[44] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[39]+$g[41], $g[40]+$g[42], 0, -30, $g[1], $g[31])
				$g[44].setTxt("A", 0)
				$g[45] = $g[41]+$g[38]
				$g[46] = $g[42]
				$g[47] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[39]-(dotRadius/2), $g[40]-(dotRadius/2), $g[45], $g[46], dotRadius, dotRadius, 0)
				$g[48] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[39]+$g[45], $g[40]+$g[46], 0, -30, $g[1], $g[31])
				$g[48].setTxt("B", 0)
				$g[49] = $g[45]
				$g[50] = $g[46]+$g[38]
				$g[51] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[39]-(dotRadius/2), $g[40]-(dotRadius/2), $g[49], $g[50], dotRadius, dotRadius, 0)
				$g[52] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[39]+$g[49], $g[40]+$g[50], 0, 30, $g[1], $g[31])
				$g[52].setTxt("D", 0)
				$g[53] = $g[41]
				$g[54] = $g[42]+$g[38]
				$g[55] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[39]-(dotRadius/2), $g[40]-(dotRadius/2), $g[53], $g[54], dotRadius, dotRadius, 0)
				$g[56] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[39]+$g[53], $g[40]+$g[54], 0, 30, $g[1], $g[31])
				$g[56].setTxt("C", 0)
				$g[57] = new Line($g[0], 0, 0, $g[1], $g[39], $g[40], $g[53], $g[54], $g[49]-$g[53], $g[54]+$g[50])
				$g[58] = new Line($g[0], 0, 0, $g[1], $g[39], $g[40], $g[49], $g[50], $g[49]-$g[45], $g[50]+$g[46])
				$g[59] = new Line($g[0], 0, 0, $g[1], $g[39], $g[40], $g[45], $g[46], $g[41]-$g[45], $g[46]-$g[42])
				$g[60] = new Line($g[0], 0, 0, $g[1], $g[39], $g[40], $g[41], $g[42], $g[41]-$g[53], $g[54]-$g[42])
				debug("squareTopLeftX: %d", $g[41])
				debug("squareTopLeftY: %d", $g[42])
				debug("squareTopRightX: %d", $g[45])
				debug("squareTopRightY: %d", $g[46])
				debug("squareBottomLeftX: %d", $g[53])
				debug("squareBottomLeftY: %d", $g[54])
				debug("squareBottomRightX: %d", $g[49])
				debug("squareBottomRightY: %d", $g[50])
				if (wait(90))
				return
				$pc = 1
			case 1:
				$g[61] = new Arc($g[0], 0, 0, $g[3], 0, $g[39], $g[40], $g[41], $g[42], ($g[38]/2)+20, ($g[38]/2)+20, 270, 0)
				if ($g[61].rotateSpanAngle(180, 50, 1, 1))
				return
				$pc = 2
			case 2:
				if (wait(90))
				return
				$pc = 3
			case 3:
				$g[62] = new Arc($g[0], 0, 0, $g[3], 0, $g[39], $g[40], $g[45], $g[46], ($g[38]/2)+20, ($g[38]/2)+20, -90, 0)
				if ($g[62].rotateSpanAngle(-180, 50, 1, 1))
				return
				$pc = 4
			case 4:
				$g[63] = ($g[38]/2)+20
				$g[64] = $g[41]
				$g[65] = $g[42]
				$g[66] = ($g[38]/2)+20
				$g[67] = $g[45]
				$g[68] = $g[46]
				$g[69] = sqrt(pow(($g[67]-$g[64]), 2)+pow(($g[68]-$g[65]), 2))
				$g[70] = pow($g[63], 2)
				$g[70]=$g[70]-(pow($g[66], 2))
				$g[70]=$g[70]+(pow($g[69], 2))
				$g[70]=$g[70]/(2*$g[69])
				$g[71] = pow($g[63], 2)-pow($g[70], 2)
				$g[71]=sqrt($g[71])
				$g[72] = $g[67]-$g[64]
				$g[72]=$g[72]/$g[69]
				$g[72]=$g[70]*$g[72]
				$g[72]=$g[64]+$g[72]
				$g[73] = ($g[68]-$g[65])
				$g[73]=$g[73]/$g[69]
				$g[73]=$g[70]*$g[73]
				$g[73]=$g[65]+$g[73]
				$g[74] = $g[68]-$g[65]
				$g[74]=$g[74]/$g[69]
				$g[74]=$g[71]*$g[74]
				$g[74]=$g[72]+$g[74]
				$g[75] = $g[67]-$g[64]
				$g[75]=$g[75]/$g[69]
				$g[75]=$g[71]*$g[75]
				$g[75]=$g[73]-$g[75]
				$g[76] = $g[68]-$g[65]
				$g[76]=$g[76]/$g[69]
				$g[76]=$g[71]*$g[76]
				$g[76]=$g[72]-$g[76]
				$g[77] = $g[67]-$g[64]
				$g[77]=$g[77]/$g[69]
				$g[77]=$g[71]*$g[77]
				$g[77]=$g[73]+$g[77]
				$g[78] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[39]-(dotRadius/2), $g[40]-(dotRadius/2), $g[74], $g[75], dotRadius, dotRadius, 0)
				$g[79] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[39]-(dotRadius/2), $g[40]-(dotRadius/2), $g[76], $g[77], dotRadius, dotRadius, 0)
				if (wait(90))
				return
				$pc = 5
			case 5:
				$g[80] = new Line($g[0], 0, 0, $g[1], $g[39], $g[40], $g[74], $g[75], 0, 0)
				if ($g[80].setPt(1, $g[76], $g[77]+200, 50, 1, 1))
				return
				$pc = 6
			case 6:
				$g[81] = $g[41]+$g[38]/2
				$g[82] = $g[42]
				$g[83] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[39]-(dotRadius/2), $g[40]-(dotRadius/2), $g[81], $g[82], dotRadius, dotRadius, 0)
				$g[84] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[39]+($g[41]+$g[38]/2), $g[40]+$g[42], 0, -30, $g[1], $g[31])
				$g[84].setTxt("E", 0)
				$g[85] = $g[53]+$g[38]/2
				$g[86] = $g[54]
				$g[87] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[39]-(dotRadius/2), $g[40]-(dotRadius/2), $g[85], $g[86], dotRadius, dotRadius, 0)
				$g[88] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[39]+($g[53]+$g[38]/2), $g[40]+$g[54], 0, 30, $g[1], $g[31])
				$g[88].setTxt("F", 0)
				if (wait(90))
				return
				$pc = 7
			case 7:
				$g[61].setOpacity(0, 50, 1, 0)
				$g[62].setOpacity(0, 50, 1, 0)
				$g[78].setOpacity(0, 50, 1, 0)
				$g[79].setOpacity(0, 50, 1, 0)
				if ($g[80].setOpacity(0, 50, 1, 1))
				return
				$pc = 8
			case 8:
				if (wait(90))
				return
				$pc = 9
			case 9:
				$g[89] = 200
				$g[90] = new Line($g[0], 0, 0, $g[1], $g[39], $g[40], $g[45], $g[46], 0, 0)
				if ($g[90].setPt(1, $g[45]+$g[89], $g[46], 50, 1, 1))
				return
				$pc = 10
			case 10:
				if (wait(90))
				return
				$pc = 11
			case 11:
				$g[91] = sqrt(pow($g[53]-$g[81], 2)+pow($g[54]-$g[82], 2))
				$g[92] = new Arc($g[0], 0, 0, $g[3], 0, $g[39], $g[40], $g[81], $g[82], $g[91], $g[91], -265+30, 0)
				$g[83].setOpacity(0, 50, 0, 0)
				$g[93] = new Ellipse($g[0], 0, 0, $g[3], $g[18], $g[39]-(dotRadius/2), $g[40]-(dotRadius/2), $g[81], $g[82], dotRadius, dotRadius, 0)
				$g[55].setOpacity(0, 50, 0, 0)
				$g[94] = new Ellipse($g[0], 0, 0, $g[3], $g[18], $g[39]-(dotRadius/2), $g[40]-(dotRadius/2), $g[53], $g[54], dotRadius, dotRadius, 0)
				$g[51].setOpacity(0, 50, 0, 0)
				$g[95] = new Ellipse($g[0], 0, 0, $g[3], $g[18], $g[39]-(dotRadius/2), $g[40]-(dotRadius/2), $g[49], $g[50], dotRadius, dotRadius, 0)
				if ($g[92].rotateSpanAngle(-100-30, 50, 1, 1))
				return
				$pc = 12
			case 12:
				$g[96] = $g[81]+$g[91]
				$g[97] = $g[82]
				$g[98] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[39]-(dotRadius/2), $g[40]-(dotRadius/2), $g[96], $g[97], dotRadius, dotRadius, 0)
				$g[99] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[39]+$g[96], $g[40]+$g[97], 0, -30, $g[1], $g[31])
				$g[99].setTxt("G", 0)
				if (wait(90))
				return
				$pc = 13
			case 13:
				$g[93].setOpacity(0, 50, 0, 0)
				$g[94].setOpacity(0, 50, 0, 0)
				$g[95].setOpacity(0, 50, 0, 0)
				$g[83].setOpacity(1, 50, 0, 0)
				$g[55].setOpacity(1, 50, 0, 0)
				$g[51].setOpacity(1, 50, 0, 0)
				if ($g[92].setOpacity(0, 50, 1, 1))
				return
				$pc = 14
			case 14:
				if (wait(90))
				return
				$pc = 15
			case 15:
				$g[100] = new Line($g[0], 0, 0, $g[1], $g[39], $g[40], $g[49], $g[50], 0, 0)
				if ($g[100].setPt(1, $g[49]+$g[89], $g[50], 50, 1, 1))
				return
				$pc = 16
			case 16:
				if (wait(90))
				return
				$pc = 17
			case 17:
				$g[101] = new Arc($g[0], 0, 0, $g[3], 0, $g[39], $g[40], $g[85], $g[86], $g[91], $g[91], 265-90+60, 0)
				$g[87].setOpacity(0, 50, 0, 0)
				$g[102] = new Ellipse($g[0], 0, 0, $g[3], $g[18], $g[39]-(dotRadius/2), $g[40]-(dotRadius/2), $g[85], $g[86], dotRadius, dotRadius, 0)
				$g[43].setOpacity(0, 50, 0, 0)
				$g[103] = new Ellipse($g[0], 0, 0, $g[3], $g[18], $g[39]-(dotRadius/2), $g[40]-(dotRadius/2), $g[41], $g[42], dotRadius, dotRadius, 0)
				$g[47].setOpacity(0, 50, 0, 0)
				$g[104] = new Ellipse($g[0], 0, 0, $g[3], $g[18], $g[39]-(dotRadius/2), $g[40]-(dotRadius/2), $g[45], $g[46], dotRadius, dotRadius, 0)
				if ($g[101].rotateSpanAngle(100+30, 50, 1, 1))
				return
				$pc = 18
			case 18:
				$g[105] = $g[85]+$g[91]
				$g[106] = $g[86]
				$g[107] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[39]-(dotRadius/2), $g[40]-(dotRadius/2), $g[105], $g[106], dotRadius, dotRadius, 0)
				$g[108] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[39]+$g[105], $g[40]+$g[106], 0, 30, $g[1], $g[31])
				$g[108].setTxt("H", 0)
				if (wait(90))
				return
				$pc = 19
			case 19:
				$g[102].setOpacity(0, 50, 0, 0)
				$g[103].setOpacity(0, 50, 0, 0)
				$g[104].setOpacity(0, 50, 0, 0)
				$g[87].setOpacity(1, 50, 0, 0)
				$g[43].setOpacity(1, 50, 0, 0)
				$g[47].setOpacity(1, 50, 0, 0)
				if ($g[101].setOpacity(0, 50, 1, 1))
				return
				$pc = 20
			case 20:
				if (wait(90))
				return
				$pc = 21
			case 21:
				$g[109] = new Line($g[0], 0, 0, $g[1], $g[39], $g[40], $g[96], $g[97], 0, 0)
				if ($g[109].setPt(1, $g[105], $g[106], 50, 1, 1))
				return
				$pc = 22
			case 22:
				if (wait(90))
				return
				$pc = 23
			case 23:
				$g[110] = new Line($g[0], 0, 0, $g[1], $g[39], $g[40], $g[96], $g[97], $g[45]-$g[96], $g[97]-$g[46])
				$g[111] = new Line($g[0], 0, 0, $g[1], $g[39], $g[40], $g[105], $g[106], $g[49]-$g[105], $g[106]-$g[50])
				$g[90].setOpacity(0, 50, 1, 0)
				if ($g[100].setOpacity(0, 50, 1, 1))
				return
				$pc = 24
			case 24:
				$g[112] = new Rectangle2($g[0], 0, W/2|VCENTRE, 0, 0, $g[39]+$g[96]+50, $g[40]+$g[97], 200, 50, $g[33], 0)
				$g[112].setTxt("AG:BG = \u03C6:1", 0)
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
