"use strict"

function division_constructible_numbers(vplayer) {

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
	const HLEFT = vplayer.HLEFT
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
	const aLength = 301
	const unitLength = 100

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
				$g[33] = H/2+100
				$g[34] = 0
				$g[35] = 0
				$g[36] = new Rectangle2($g[0], 0, W/2|VCENTRE, 0, 0, W/2-25, H/2-300, 200, 50, $g[1], 0)
				$g[36].setTxt("Division - Constructible Numbers", 0)
				$g[37] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[32]-(dotRadius/2), $g[33]-(dotRadius/2), $g[34], $g[34], dotRadius, dotRadius, 0)
				if (wait(90))
				return
				$pc = 1
			case 1:
				$g[38] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[32]+$g[34], $g[33]+$g[35], 0, 30, $g[1], $g[31])
				$g[38].setTxt("O", 0)
				if (wait(90))
				return
				$pc = 2
			case 2:
				$g[39] = new Line($g[0], 0, 0, $g[1], $g[32], $g[33], $g[34], $g[35], 0, 0)
				if ($g[39].setPt(1, (aLength+50), $g[35], 50, 1, 1))
				return
				$pc = 3
			case 3:
				$g[40] = new Line($g[0], 0, 0, $g[1], $g[32], $g[33], $g[34], $g[35], 0, 0)
				if ($g[40].setPt(1, (150+100), (0-200), 50, 1, 1))
				return
				$pc = 4
			case 4:
				if (wait(90))
				return
				$pc = 5
			case 5:
				$g[41] = new Arc($g[0], 0, 0, $g[1], 0, $g[32], $g[33], $g[34], $g[35], unitLength, unitLength, 360-70, 0)
				if ($g[41].rotateSpanAngle(60, 50, 1, 1))
				return
				$pc = 6
			case 6:
				$g[42] = 78
				$g[43] = -62
				$g[44] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[32]-(dotRadius/2), $g[33]-(dotRadius/2), $g[42], $g[43], dotRadius, dotRadius, 0)
				if (wait(90))
				return
				$pc = 7
			case 7:
				if ($g[41].setOpacity(0, 50, 1, 1))
				return
				$pc = 8
			case 8:
				$g[45] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[32]+$g[42], $g[33]+$g[43], 0, -30, $g[1], $g[31])
				$g[45].setTxt("P", 0)
				$g[46] = ($g[34]+$g[42])/2
				$g[47] = ($g[35]+$g[43])/2
				$g[48] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[32]+$g[46], $g[33]+$g[47], -10, -20, $g[1], $g[31])
				$g[48].setTxt("1", 0)
				if (wait(90))
				return
				$pc = 9
			case 9:
				$g[49] = new Arc($g[0], 0, 0, $g[1], 0, $g[32], $g[33], $g[34], $g[35], aLength, aLength, 360-30, 0)
				if ($g[49].rotateSpanAngle(60, 50, 1, 1))
				return
				$pc = 10
			case 10:
				$g[50] = aLength
				$g[51] = $g[35]
				$g[52] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[32]-(dotRadius/2), $g[33]-(dotRadius/2), $g[50], $g[51], dotRadius, dotRadius, 0)
				if (wait(90))
				return
				$pc = 11
			case 11:
				if ($g[49].setOpacity(0, 50, 1, 1))
				return
				$pc = 12
			case 12:
				$g[53] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[32]+$g[50], $g[33]+$g[51], 0, 30, $g[1], $g[31])
				$g[53].setTxt("A", 0)
				if (wait(90))
				return
				$pc = 13
			case 13:
				$g[54] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[32]+155, $g[33]+$g[35], 0, 30, $g[1], $g[31])
				$g[54].setTxt("|OA| = a", 0)
				if (wait(90))
				return
				$pc = 14
			case 14:
				$g[55] = new Arc($g[0], 0, 0, $g[1], 0, $g[32], $g[33], $g[42], $g[43], unitLength, unitLength, 360-70, 0)
				if ($g[55].rotateSpanAngle(60, 50, 1, 1))
				return
				$pc = 15
			case 15:
				$g[56] = 156
				$g[57] = -125
				$g[58] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[32]-(dotRadius/2), $g[33]-(dotRadius/2), $g[56], $g[57], dotRadius, dotRadius, 0)
				if (wait(90))
				return
				$pc = 16
			case 16:
				if ($g[55].setOpacity(0, 50, 1, 1))
				return
				$pc = 17
			case 17:
				$g[59] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[32]+$g[56], $g[33]+$g[57], 0, -30, $g[1], $g[31])
				$g[59].setTxt("B", 0)
				if (wait(90))
				return
				$pc = 18
			case 18:
				$g[60] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[32]+$g[42], $g[33]+$g[43], -30, -95, $g[1], $g[31])
				$g[60].setTxt("|OB| = b", 0)
				if (wait(90))
				return
				$pc = 19
			case 19:
				$g[60].setOpacity(0, 1, 1, 0)
				$g[61] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[32]+$g[42], $g[33]+$g[43], -30, -95, $g[3], $g[31])
				$g[61].setTxt("|OB| = b", 0)
				$g[58].setOpacity(0, 1, 1, 0)
				$g[62] = new Ellipse($g[0], 0, 0, $g[3], $g[18], $g[32]-(dotRadius/2), $g[33]-(dotRadius/2), $g[56], $g[57], dotRadius, dotRadius, 0)
				$g[37].setOpacity(0, 1, 1, 0)
				$g[63] = new Ellipse($g[0], 0, 0, $g[3], $g[18], $g[32]-(dotRadius/2), $g[33]-(dotRadius/2), $g[34], $g[34], dotRadius, dotRadius, 0)
				if (wait(90))
				return
				$pc = 20
			case 20:
				$g[61].setOpacity(0, 1, 1, 0)
				$g[60].setOpacity(100, 1, 1, 0)
				$g[62].setOpacity(0, 1, 1, 0)
				$g[58].setOpacity(100, 1, 1, 0)
				$g[63].setOpacity(0, 1, 1, 0)
				if ($g[37].setOpacity(100, 1, 1, 1))
				return
				$pc = 21
			case 21:
				if (wait(90))
				return
				$pc = 22
			case 22:
				$g[64] = new Line($g[0], 0, 0, $g[1], $g[32], $g[33], $g[56], $g[57], 0, 0)
				if ($g[64].setPt(1, $g[50], $g[51], 50, 1, 1))
				return
				$pc = 23
			case 23:
				if (wait(90))
				return
				$pc = 24
			case 24:
				$g[65] = new Arc($g[0], 0, 0, $g[1], 0, $g[32], $g[33], $g[42], $g[43], 115, 115, 0, 0)
				if ($g[65].rotateSpanAngle(360, 50, 1, 1))
				return
				$pc = 25
			case 25:
				if (wait(90))
				return
				$pc = 26
			case 26:
				$g[66] = $g[56]-$g[50]
				$g[67] = $g[57]-$g[51]
				$g[68] = pow($g[66], 2)
				$g[68]=$g[68]+pow($g[67], 2)
				$g[68]=sqrt($g[68])
				$g[69] = $g[56]+($g[56]-$g[50])/$g[68]*90
				$g[70] = $g[57]+($g[57]-$g[51])/$g[68]*90
				$g[71] = new Line($g[0], 0, 0, $g[1], $g[32], $g[33], $g[56], $g[57], 0, 0)
				if ($g[71].setPt(0, $g[69], $g[70], 50, 1, 1))
				return
				$pc = 27
			case 27:
				$g[72] = 188
				$g[73] = -97
				$g[74] = 96
				$g[75] = -176
				$g[76] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[32]-(dotRadius/2), $g[33]-(dotRadius/2), $g[72], $g[73], dotRadius, dotRadius, 0)
				$g[77] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[32]-(dotRadius/2), $g[33]-(dotRadius/2), $g[74], $g[75], dotRadius, dotRadius, 0)
				if (wait(90))
				return
				$pc = 28
			case 28:
				if ($g[65].setOpacity(0, 50, 1, 1))
				return
				$pc = 29
			case 29:
				if (wait(90))
				return
				$pc = 30
			case 30:
				$g[78] = new Arc($g[0], 0, 0, $g[5], 0, $g[32], $g[33], $g[72], $g[73], 70, 70, 135, 0)
				if ($g[78].rotateSpanAngle(180, 50, 1, 1))
				return
				$pc = 31
			case 31:
				if (wait(90))
				return
				$pc = 32
			case 32:
				$g[79] = new Arc($g[0], 0, 0, $g[5], 0, $g[32], $g[33], $g[74], $g[75], 70, 70, 310, 0)
				if ($g[79].rotateSpanAngle(180, 50, 1, 1))
				return
				$pc = 33
			case 33:
				$g[80] = 70
				$g[81] = $g[72]
				$g[82] = $g[73]
				$g[83] = 70
				$g[84] = $g[74]
				$g[85] = $g[75]
				$g[86] = sqrt(pow(($g[84]-$g[81]), 2)+pow(($g[85]-$g[82]), 2))
				$g[87] = pow($g[80], 2)
				$g[87]=$g[87]-(pow($g[83], 2))
				$g[87]=$g[87]+(pow($g[86], 2))
				$g[87]=$g[87]/(2*$g[86])
				$g[88] = pow($g[80], 2)-pow($g[87], 2)
				$g[88]=sqrt($g[88])
				$g[89] = $g[84]-$g[81]
				$g[89]=$g[89]/$g[86]
				$g[89]=$g[87]*$g[89]
				$g[89]=$g[81]+$g[89]
				$g[90] = ($g[85]-$g[82])
				$g[90]=$g[90]/$g[86]
				$g[90]=$g[87]*$g[90]
				$g[90]=$g[82]+$g[90]
				$g[91] = $g[85]-$g[82]
				$g[91]=$g[91]/$g[86]
				$g[91]=$g[88]*$g[91]
				$g[91]=$g[89]+$g[91]
				$g[92] = $g[84]-$g[81]
				$g[92]=$g[92]/$g[86]
				$g[92]=$g[88]*$g[92]
				$g[92]=$g[90]-$g[92]
				$g[93] = $g[85]-$g[82]
				$g[93]=$g[93]/$g[86]
				$g[93]=$g[88]*$g[93]
				$g[93]=$g[89]-$g[93]
				$g[94] = $g[84]-$g[81]
				$g[94]=$g[94]/$g[86]
				$g[94]=$g[88]*$g[94]
				$g[94]=$g[90]+$g[94]
				$g[95] = new Ellipse($g[0], 0, 0, $g[5], $g[20], $g[32]-(dotRadius/2), $g[33]-(dotRadius/2), $g[91], $g[92], dotRadius, dotRadius, 0)
				$g[96] = new Ellipse($g[0], 0, 0, $g[5], $g[20], $g[32]-(dotRadius/2), $g[33]-(dotRadius/2), $g[93], $g[94], dotRadius, dotRadius, 0)
				if (wait(90))
				return
				$pc = 34
			case 34:
				$g[97] = new Line($g[0], 0, 0, $g[5], $g[32], $g[33], $g[91], $g[92], 0, 0)
				if ($g[97].setPt(1, $g[93], $g[94], 50, 1, 1))
				return
				$pc = 35
			case 35:
				$g[98] = (($g[69]*$g[51])-($g[50]*$g[70]))*($g[93]-$g[91])-((($g[93]*$g[92])-($g[91]*$g[94]))*($g[69]-$g[50]))
				$g[98]=$g[98]/((($g[69]-$g[50])*($g[94]-$g[92]))-(($g[93]-$g[91])*($g[70]-$g[51])))
				$g[99] = ((($g[69]*$g[51])-($g[50]*$g[70]))*($g[94]-$g[92]))-((($g[93]*$g[92])-($g[91]*$g[94]))*($g[70]-$g[51]))
				$g[99]=$g[99]/((($g[69]-$g[50])*($g[94]-$g[92]))-(($g[93]-$g[91])*($g[70]-$g[51])))
				$g[100] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[32]-(dotRadius/2), $g[33]-(dotRadius/2), $g[98], $g[99], dotRadius, dotRadius, 0)
				if (wait(90))
				return
				$pc = 36
			case 36:
				$g[76].setOpacity(0, 50, 1, 0)
				$g[77].setOpacity(0, 50, 1, 0)
				$g[78].setOpacity(0, 50, 1, 0)
				$g[79].setOpacity(0, 50, 1, 0)
				$g[95].setOpacity(0, 50, 1, 0)
				$g[96].setOpacity(0, 50, 1, 0)
				if ($g[97].setOpacity(0, 50, 1, 1))
				return
				$pc = 37
			case 37:
				if (wait(90))
				return
				$pc = 38
			case 38:
				$g[101] = sqrt(pow($g[42]-$g[98], 2)+pow($g[43]-$g[99], 2))
				$g[102] = $g[42]+($g[42]-$g[98])/$g[101]*($g[101]+50)
				$g[103] = $g[43]+($g[43]-$g[99])/$g[101]*($g[101]+50)
				$g[104] = new Line($g[0], 0, 0, $g[1], $g[32], $g[33], $g[98], $g[99], 0, 0)
				if ($g[104].setPt(0, $g[102], $g[103], 50, 1, 1))
				return
				$pc = 39
			case 39:
				if (wait(90))
				return
				$pc = 40
			case 40:
				$g[105] = new Arc($g[0], 0, 0, $g[1], 0, $g[32], $g[33], $g[42], $g[43], $g[101], $g[101], 100, 0)
				if ($g[105].rotateSpanAngle(60, 50, 1, 1))
				return
				$pc = 41
			case 41:
				debug("perpendIntersectX: %d", $g[98])
				debug("perpendIntersectY: %d", $g[99])
				debug("perpInterThruPointPX2: %d", $g[102])
				debug("perpInterThruPointPY2: %d", $g[103])
				debug("pointPx: %d", $g[42])
				debug("pointPy: %d", $g[43])
				debug("r: %d", $g[101])
				$g[106] = 14
				$g[107] = 12
				$g[108] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[32]-(dotRadius/2), $g[33]-(dotRadius/2), $g[106], $g[107], dotRadius, dotRadius, 0)
				if ($g[105].setOpacity(0, 50, 1, 1))
				return
				$pc = 42
			case 42:
				if (wait(90))
				return
				$pc = 43
			case 43:
				$g[109] = new Arc($g[0], 0, 0, $g[1], 0, $g[32], $g[33], $g[98], $g[99], 130, 130, 30, 0)
				if ($g[109].rotateSpanAngle(180, 50, 1, 1))
				return
				$pc = 44
			case 44:
				if (wait(90))
				return
				$pc = 45
			case 45:
				$g[110] = new Arc($g[0], 0, 0, $g[1], 0, $g[32], $g[33], $g[106], $g[107], 130, 130, 225, 0)
				if ($g[110].rotateSpanAngle(180, 50, 1, 1))
				return
				$pc = 46
			case 46:
				$g[80]=130
				$g[81]=$g[98]
				$g[82]=$g[99]
				$g[83]=130
				$g[84]=$g[106]
				$g[85]=$g[107]
				$g[86]=sqrt(pow(($g[84]-$g[81]), 2)+pow(($g[85]-$g[82]), 2))
				$g[87]=pow($g[80], 2)
				$g[87]=$g[87]-(pow($g[83], 2))
				$g[87]=$g[87]+(pow($g[86], 2))
				$g[87]=$g[87]/(2*$g[86])
				$g[88]=pow($g[80], 2)-pow($g[87], 2)
				$g[88]=sqrt($g[88])
				$g[89]=$g[84]-$g[81]
				$g[89]=$g[89]/$g[86]
				$g[89]=$g[87]*$g[89]
				$g[89]=$g[81]+$g[89]
				$g[90]=($g[85]-$g[82])
				$g[90]=$g[90]/$g[86]
				$g[90]=$g[87]*$g[90]
				$g[90]=$g[82]+$g[90]
				$g[111] = $g[85]-$g[82]
				$g[111]=$g[111]/$g[86]
				$g[111]=$g[88]*$g[111]
				$g[111]=$g[89]+$g[111]
				$g[112] = $g[84]-$g[81]
				$g[112]=$g[112]/$g[86]
				$g[112]=$g[88]*$g[112]
				$g[112]=$g[90]-$g[112]
				$g[113] = $g[85]-$g[82]
				$g[113]=$g[113]/$g[86]
				$g[113]=$g[88]*$g[113]
				$g[113]=$g[89]-$g[113]
				$g[114] = $g[84]-$g[81]
				$g[114]=$g[114]/$g[86]
				$g[114]=$g[88]*$g[114]
				$g[114]=$g[90]+$g[114]
				$g[115] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[32]-(dotRadius/2), $g[33]-(dotRadius/2), $g[111], $g[112], dotRadius, dotRadius, 0)
				$g[116] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[32]-(dotRadius/2), $g[33]-(dotRadius/2), $g[113], $g[114], dotRadius, dotRadius, 0)
				if (wait(90))
				return
				$pc = 47
			case 47:
				$g[117] = sqrt(pow($g[111]-$g[113], 2)+pow($g[112]-$g[114], 2))
				$g[111]=$g[111]+($g[111]-$g[113])/$g[117]*50
				$g[112]=$g[112]+($g[112]-$g[114])/$g[117]*50
				$g[118] = (($g[113]*$g[112])-($g[111]*$g[114]))*(($g[50]+200)-$g[34])-((($g[50]+200)*$g[35])-($g[34]*$g[51]))*($g[113]-$g[111])
				$g[118]=$g[118]/(($g[113]-$g[111])*($g[51]-$g[35])-(($g[50]+200)-$g[34])*($g[114]-$g[112]))
				debug("pointQx%d", $g[118])
				$g[119] = ((($g[113]*$g[112])-($g[111]*$g[114]))*($g[51]-$g[35]))-(((($g[50]+200)*$g[35])-($g[34]*$g[51]))*($g[114]-$g[112]))
				$g[119]=$g[119]/((($g[113]-$g[111])*($g[51]-$g[35]))-((($g[50]+200)-$g[34])*($g[114]-$g[112])))
				$g[120] = new Line($g[0], 0, 0, $g[1], $g[32], $g[33], $g[113], $g[114], 0, 0)
				if ($g[120].setPt(0, $g[118], $g[119], 50, 1, 1))
				return
				$pc = 48
			case 48:
				$g[121] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[32]-(dotRadius/2), $g[33]-(dotRadius/2), $g[118], $g[119], dotRadius, dotRadius, 0)
				$g[122] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[32]+$g[118], $g[33]+$g[119], 0, -30, $g[1], $g[31])
				$g[122].setTxt("Q", 0)
				$g[120].setOpacity(0, 50, 1, 0)
				$g[123] = new Line($g[0], 0, 0, $g[1], $g[32], $g[33], $g[42], $g[43], $g[118]-$g[42], $g[119]-$g[43])
				$g[104].setOpacity(0, 50, 1, 0)
				$g[71].setOpacity(0, 50, 1, 0)
				$g[109].setOpacity(0, 50, 1, 0)
				$g[110].setOpacity(0, 50, 1, 0)
				$g[108].setOpacity(0, 50, 1, 0)
				$g[100].setOpacity(0, 50, 1, 0)
				$g[115].setOpacity(0, 50, 1, 0)
				if ($g[116].setOpacity(0, 50, 1, 1))
				return
				$pc = 49
			case 49:
				if (wait(90))
				return
				$pc = 50
			case 50:
				$g[124] = new Rectangle2($g[0], 0, W/2|VCENTRE, 0, 0, $g[32]+$g[56]-300, $g[33]-200, 200, 50, $g[3], $g[31])
				$g[124].setTxt("Triangle OPQ is similar to OBA", 0)
				if (wait(180))
				return
				$pc = 51
			case 51:
				$g[125] = new Rectangle2($g[0], 0, HLEFT, 0, 0, $g[32]+$g[56]+250, $g[33]-200, 200, 50, $g[3], 0)
				$g[125].setTxt("|OQ|/1 = a/b", 0)
				$g[126] = new Rectangle2($g[0], 0, HLEFT, 0, 0, $g[32]+$g[56]+250, $g[33]-150, 200, 50, $g[5], 0)
				$g[126].setTxt("a/b = |OQ|", 0)
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
