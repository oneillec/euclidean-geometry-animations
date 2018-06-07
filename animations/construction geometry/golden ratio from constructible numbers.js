"use strict"

function golden_ratio_from_constructible_numbers(vplayer) {

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
				setViewport(0, 0, W, H, 1)
				$g[31] = new Font("Calibri", 18)
				$g[32] = new Font("Calibri", 15)
				$g[33] = new SolidPen(SOLID, 3, RED, ARROW60_END, 2, 4)
				$g[34] = (W/2)-150
				$g[35] = H/2+100
				$g[36] = 0
				$g[37] = 0
				$g[38] = new Rectangle2($g[0], 0, W/2|VCENTRE, 0, 0, W/2-25, H/2-300, 200, 50, $g[1], 0)
				$g[38].setTxt("Golden Ratio (\u03C6) from Constructible Numbers", 0)
				$g[39] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[34]-(dotRadius/2), $g[35]-(dotRadius/2), $g[36], $g[36], dotRadius, dotRadius, 0)
				$g[40] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[34]+$g[36], $g[35]+$g[37], 0, 30, $g[1], $g[31])
				$g[40].setTxt("O", 0)
				if (wait(90))
				return
				$pc = 1
			case 1:
				$g[41] = $g[36]-unitLength
				$g[42] = $g[37]
				$g[43] = new Line($g[0], 0, 0, $g[1], $g[34], $g[35], $g[36], $g[37], 0, 0)
				if ($g[43].setPt(1, ($g[41]-50), $g[42], 50, 1, 1))
				return
				$pc = 2
			case 2:
				$g[44] = new Arc($g[0], 0, 0, $g[1], 0, $g[34], $g[35], $g[36], $g[37], unitLength, unitLength, 330-180, 0)
				if ($g[44].rotateSpanAngle(60, 50, 1, 1))
				return
				$pc = 3
			case 3:
				$g[45] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[34]-(dotRadius/2), $g[35]-(dotRadius/2), $g[41], $g[42], dotRadius, dotRadius, 0)
				if (wait(90))
				return
				$pc = 4
			case 4:
				$g[44].setOpacity(0, 50, 1, 0)
				$g[46] = new Line($g[0], 0, 0, $g[1], $g[34], $g[35], $g[36], $g[37], $g[36]+$g[41], $g[37]+$g[42], 0)
				if ($g[43].setOpacity(0, 50, 1, 1))
				return
				$pc = 5
			case 5:
				$g[47] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[34]+$g[41], $g[35]+$g[42], 0, 30, $g[1], $g[31])
				$g[47].setTxt("P", 0)
				$g[48] = ($g[36]+$g[41])/2
				$g[49] = ($g[37]+$g[42])/2
				$g[50] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[34]+$g[48], $g[35]+$g[49], 0, 30, $g[1], $g[31])
				$g[50].setTxt("1", 0)
				if (wait(90))
				return
				$pc = 6
			case 6:
				$g[51] = new Line($g[0], 0, 0, $g[1], $g[34], $g[35], $g[36], $g[37], 0, 0)
				if ($g[51].setPt(1, (aLength+50), $g[37], 50, 1, 1))
				return
				$pc = 7
			case 7:
				if (wait(90))
				return
				$pc = 8
			case 8:
				$g[52] = new Arc($g[0], 0, 0, $g[1], 0, $g[34], $g[35], $g[36], $g[37], aLength, aLength, 360-30, 0)
				if ($g[52].rotateSpanAngle(60, 50, 1, 1))
				return
				$pc = 9
			case 9:
				$g[53] = aLength
				$g[54] = $g[37]
				$g[55] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[34]-(dotRadius/2), $g[35]-(dotRadius/2), $g[53], $g[54], dotRadius, dotRadius, 0)
				if (wait(90))
				return
				$pc = 10
			case 10:
				$g[52].setOpacity(0, 50, 1, 0)
				$g[56] = new Line($g[0], 0, 0, $g[1], $g[34], $g[35], $g[36], $g[37], $g[36]+$g[53], $g[37]+$g[54], 0)
				if ($g[51].setOpacity(0, 50, 1, 1))
				return
				$pc = 11
			case 11:
				$g[57] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[34]+$g[53], $g[35]+$g[54], 0, 30, $g[1], $g[31])
				$g[57].setTxt("A", 0)
				$g[58] = ($g[36]+$g[53])/2
				$g[59] = ($g[37]+$g[54])/2
				$g[60] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[34]+$g[58], $g[35]+$g[59], 0, 30, $g[1], $g[31])
				$g[60].setTxt("5", 0)
				if (wait(90))
				return
				$pc = 12
			case 12:
				$g[61] = new Arc($g[0], 0, 0, $g[1], 0, $g[34], $g[35], $g[41], $g[42], ((aLength+unitLength)/2)+20, ((aLength+unitLength)/2)+20, 270, 0)
				if ($g[61].rotateSpanAngle(180, 50, 1, 1))
				return
				$pc = 13
			case 13:
				if (wait(90))
				return
				$pc = 14
			case 14:
				$g[62] = new Arc($g[0], 0, 0, $g[1], 0, $g[34], $g[35], $g[53], $g[54], ((aLength+unitLength)/2)+20, ((aLength+unitLength)/2)+20, -90, 0)
				if ($g[62].rotateSpanAngle(-180, 50, 1, 1))
				return
				$pc = 15
			case 15:
				$g[63] = ((aLength+unitLength)/2)+20
				$g[64] = $g[41]
				$g[65] = $g[42]
				$g[66] = ((aLength+unitLength)/2)+20
				$g[67] = $g[53]
				$g[68] = $g[54]
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
				$g[78] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[34]-(dotRadius/2), $g[35]-(dotRadius/2), $g[74], $g[75], dotRadius, dotRadius, 0)
				$g[79] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[34]-(dotRadius/2), $g[35]-(dotRadius/2), $g[76], $g[77], dotRadius, dotRadius, 0)
				if (wait(90))
				return
				$pc = 16
			case 16:
				$g[80] = new Line($g[0], 0, 0, $g[1], $g[34], $g[35], $g[74], $g[75], 0, 0)
				if ($g[80].setPt(1, $g[76], $g[77], 50, 1, 1))
				return
				$pc = 17
			case 17:
				$g[81] = (($g[53]*$g[42])-($g[41]*$g[54]))*($g[76]-$g[74])-((($g[76]*$g[75])-($g[74]*$g[77]))*($g[53]-$g[41]))
				$g[81]=$g[81]/((($g[53]-$g[41])*($g[77]-$g[75]))-(($g[76]-$g[74])*($g[54]-$g[42])))
				$g[82] = ((($g[53]*$g[42])-($g[41]*$g[54]))*($g[77]-$g[75]))-((($g[76]*$g[75])-($g[74]*$g[77]))*($g[54]-$g[42]))
				$g[82]=$g[82]/((($g[53]-$g[41])*($g[77]-$g[75]))-(($g[76]-$g[74])*($g[54]-$g[42])))
				$g[83] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[34]-(dotRadius/2), $g[35]-(dotRadius/2), $g[81], $g[82], dotRadius, dotRadius, 0)
				if (wait(90))
				return
				$pc = 18
			case 18:
				$g[61].setOpacity(0, 50, 1, 0)
				$g[62].setOpacity(0, 50, 1, 0)
				$g[78].setOpacity(0, 50, 1, 0)
				$g[79].setOpacity(0, 50, 1, 0)
				if ($g[80].setOpacity(0, 50, 1, 1))
				return
				$pc = 19
			case 19:
				if (wait(90))
				return
				$pc = 20
			case 20:
				$g[84] = sqrt(pow($g[41]-$g[81], 2)+pow($g[42]-$g[82], 2))
				$g[85] = new Arc($g[0], 0, 0, $g[1], 0, $g[34], $g[35], $g[81], $g[82], $g[84], $g[84], 180, 0)
				if ($g[85].rotateSpanAngle(180, 50, 1, 1))
				return
				$pc = 21
			case 21:
				if (wait(90))
				return
				$pc = 22
			case 22:
				if ($g[83].setOpacity(0, 50, 1, 1))
				return
				$pc = 23
			case 23:
				if (wait(90))
				return
				$pc = 24
			case 24:
				debug("perpendIntersectX: %d", $g[81])
				debug("perpendIntersectY: %d", $g[82])
				debug("semicircleRadius: %d", $g[84])
				$g[86] = 0
				$g[87] = -60*sqrt(5)
				$g[88] = new Line($g[0], 0, 0, $g[1], $g[34], $g[35], $g[36], $g[37], 0, 0)
				if ($g[88].setPt(1, $g[86], $g[87], 50, 1, 1))
				return
				$pc = 25
			case 25:
				$g[89] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[34]-(dotRadius/2), $g[35]-(dotRadius/2), $g[86], $g[87], dotRadius, dotRadius, 0)
				$g[90] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[34]+$g[86], $g[35]+$g[87], 0, -30, $g[1], $g[31])
				$g[90].setTxt("Q", 0)
				$g[91] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[34]+$g[86], ($g[35]+$g[87]/2), 30, 0, $g[1], $g[31])
				$g[91].setTxt("\u221A5", 0)
				if (wait(90))
				return
				$pc = 26
			case 26:
				$g[92] = new Line($g[0], 0, 0, $g[1], $g[34], $g[35], $g[86], $g[87], 0, 0)
				if ($g[92].setPt(1, $g[41], $g[42], 50, 1, 1))
				return
				$pc = 27
			case 27:
				if (wait(90))
				return
				$pc = 28
			case 28:
				$g[93] = new Line($g[0], 0, 0, $g[1], $g[34], $g[35], $g[86], $g[87], 0, 0)
				if ($g[93].setPt(1, $g[53], $g[54], 50, 1, 1))
				return
				$pc = 29
			case 29:
				$g[94] = new Rectangle2($g[0], 0, W/2|VCENTRE, 0, 0, $g[34]+270, $g[35]-200, 200, 50, $g[3], $g[31])
				$g[94].setTxt("Triangle OPQ is similar to OQA.", 0)
				if (wait(150))
				return
				$pc = 30
			case 30:
				$g[95] = new Rectangle2($g[0], 0, W/2|VCENTRE, 0, 0, $g[34]+270, $g[35]-170, 200, 50, $g[3], $g[31])
				$g[95].setTxt("|OQ|/|OA| = |OP|/|OQ|", 0)
				if (wait(150))
				return
				$pc = 31
			case 31:
				$g[96] = new Rectangle2($g[0], 0, W/2|VCENTRE, 0, 0, $g[34]+270, $g[35]-140, 200, 50, $g[3], $g[31])
				$g[96].setTxt("|OQ|\u00B2 = (|OP|)(|OA|)", 0)
				if (wait(150))
				return
				$pc = 32
			case 32:
				$g[97] = new Rectangle2($g[0], 0, W/2|VCENTRE, 0, 0, $g[34]+270, $g[35]-110, 200, 50, $g[3], $g[31])
				$g[97].setTxt("|OQ|\u00B2 = 5", 0)
				if (wait(150))
				return
				$pc = 33
			case 33:
				$g[98] = new Rectangle2($g[0], 0, W/2|VCENTRE, 0, 0, $g[34]+270, $g[35]-80, 200, 50, $g[5], $g[31])
				$g[98].setTxt("\u221A(5) = |OQ|", 0)
				if (wait(200))
				return
				$pc = 34
			case 34:
				$g[98].setOpacity(0, 50, 1, 0)
				$g[97].setOpacity(0, 50, 1, 0)
				$g[96].setOpacity(0, 50, 1, 0)
				$g[95].setOpacity(0, 50, 1, 0)
				$g[94].setOpacity(0, 50, 1, 0)
				$g[93].setOpacity(0, 50, 1, 0)
				$g[92].setOpacity(0, 50, 1, 0)
				$g[85].setOpacity(0, 50, 1, 0)
				$g[60].setOpacity(0, 50, 1, 0)
				$g[57].setOpacity(0, 50, 1, 0)
				if ($g[55].setOpacity(0, 50, 1, 1))
				return
				$pc = 35
			case 35:
				if (wait(200))
				return
				$pc = 36
			case 36:
				checkPoint()
				$g[99] = 60*sqrt(5)
				$g[100] = new Arc($g[0], 0, 0, $g[3], 0, $g[34], $g[35], $g[36], $g[37], $g[99], $g[99], 270, 0)
				if ($g[100].rotateSpanAngle(90, 50, 1, 1))
				return
				$pc = 37
			case 37:
				$g[53]=$g[99]
				$g[55]=new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[34]-(dotRadius/2), $g[35]-(dotRadius/2), $g[53], $g[54], dotRadius, dotRadius, 0)
				$g[55].setOpacity(1, 50, 1, 0)
				$g[57]=new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[34]+$g[53], $g[35]+$g[54], 0, 30, $g[1], $g[31])
				$g[57].setTxt("A", 0)
				$g[57].setOpacity(1, 50, 1, 0)
				$g[58]=($g[36]+$g[53])/2
				$g[59]=($g[37]+$g[54])/2
				$g[60]=new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[34]+$g[58], $g[35]+$g[59], 0, 30, $g[1], $g[31])
				$g[60].setTxt("\u221A5", 0)
				if ($g[60].setOpacity(1, 50, 1, 1))
				return
				$pc = 38
			case 38:
				if (wait(90))
				return
				$pc = 39
			case 39:
				$g[100].setOpacity(0, 50, 1, 0)
				$g[88].setOpacity(0, 50, 1, 0)
				$g[91].setOpacity(0, 50, 1, 0)
				$g[90].setOpacity(0, 50, 1, 0)
				if ($g[89].setOpacity(0, 50, 1, 1))
				return
				$pc = 40
			case 40:
				if (wait(90))
				return
				$pc = 41
			case 41:
				$g[50].setOpacity(0, 50, 1, 0)
				$g[60].setOpacity(0, 50, 1, 0)
				$g[39].setOpacity(0, 50, 1, 0)
				if ($g[40].setOpacity(0, 50, 1, 1))
				return
				$pc = 42
			case 42:
				$g[101] = ($g[41]+$g[53])/2
				$g[102] = ($g[42]+$g[54])/2
				$g[103] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[34]+$g[101], $g[35]+$g[102], 0, 30, $g[1], $g[31])
				$g[103].setTxt("1 + \u221A5", 0)
				if (wait(200))
				return
				$pc = 43
			case 43:
				checkPoint()
				$g[104] = sqrt(pow(($g[53]-$g[41]), 2)+pow(($g[54]-$g[42]), 2))
				$g[105] = $g[104]/2+40
				$g[106] = $g[41]
				$g[107] = $g[42]
				$g[108] = $g[53]
				$g[109] = $g[54]
				$g[110] = new Arc($g[0], 0, 0, $g[3], 0, $g[34]+$g[106], $g[35]+$g[107], 0, 0, $g[105], $g[105], 270, 0)
				$g[111] = new Line($g[0], 0, 0, $g[33], $g[34]+$g[106], $g[35]+$g[107], 0, 0, 0, -$g[105])
				$g[111].rotate(180, 50, 1, 0)
				if ($g[110].rotateSpanAngle(180, 50, 1, 1))
				return
				$pc = 44
			case 44:
				if ($g[111].setOpacity(0, 50, 1, 1))
				return
				$pc = 45
			case 45:
				if (wait(95))
				return
				$pc = 46
			case 46:
				$g[112] = new Arc($g[0], 0, 0, $g[3], 0, $g[34]+$g[108], $g[35]+$g[109], 0, 0, $g[105], $g[105], -90, 0)
				$g[113] = new Line($g[0], 0, 0, $g[33], $g[34]+$g[108], $g[35]+$g[109], 0, 0, 0, -$g[105])
				$g[113].rotate(-180, 50, 1, 0)
				if ($g[112].rotateSpanAngle(-180, 50, 1, 1))
				return
				$pc = 47
			case 47:
				if ($g[113].setOpacity(0, 50, 1, 1))
				return
				$pc = 48
			case 48:
				$g[63]=$g[105]
				$g[64]=$g[106]
				$g[65]=$g[107]
				$g[66]=$g[105]
				$g[67]=$g[108]
				$g[68]=$g[109]
				$g[69]=sqrt(pow(($g[67]-$g[64]), 2)+pow(($g[68]-$g[65]), 2))
				$g[70]=pow($g[63], 2)
				$g[70]=$g[70]-(pow($g[66], 2))
				$g[70]=$g[70]+(pow($g[69], 2))
				$g[70]=$g[70]/(2*$g[69])
				$g[71]=pow($g[63], 2)-pow($g[70], 2)
				$g[71]=sqrt($g[71])
				$g[72]=$g[67]-$g[64]
				$g[72]=$g[72]/$g[69]
				$g[72]=$g[70]*$g[72]
				$g[72]=$g[64]+$g[72]
				$g[73]=($g[68]-$g[65])
				$g[73]=$g[73]/$g[69]
				$g[73]=$g[70]*$g[73]
				$g[73]=$g[65]+$g[73]
				$g[74]=$g[68]-$g[65]
				$g[74]=$g[74]/$g[69]
				$g[74]=$g[71]*$g[74]
				$g[74]=$g[72]+$g[74]
				$g[75]=$g[67]-$g[64]
				$g[75]=$g[75]/$g[69]
				$g[75]=$g[71]*$g[75]
				$g[75]=$g[73]-$g[75]
				$g[76]=$g[68]-$g[65]
				$g[76]=$g[76]/$g[69]
				$g[76]=$g[71]*$g[76]
				$g[76]=$g[72]-$g[76]
				$g[77]=$g[67]-$g[64]
				$g[77]=$g[77]/$g[69]
				$g[77]=$g[71]*$g[77]
				$g[77]=$g[73]+$g[77]
				$g[114] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[34]-(dotRadius/2), $g[35]-(dotRadius/2), $g[74], $g[75], dotRadius, dotRadius, 0)
				$g[115] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[34]-(dotRadius/2), $g[35]-(dotRadius/2), $g[76], $g[77], dotRadius, dotRadius, 0)
				if (wait(90))
				return
				$pc = 49
			case 49:
				$g[116] = new Line($g[0], 0, 0, $g[1], $g[34], $g[35], $g[74], $g[75], 0, 0)
				if ($g[116].setPt(1, $g[76], $g[77], 50, 1, 1))
				return
				$pc = 50
			case 50:
				$g[81]=(($g[53]*$g[42])-($g[41]*$g[54]))*($g[76]-$g[74])-((($g[76]*$g[75])-($g[74]*$g[77]))*($g[53]-$g[41]))
				$g[81]=$g[81]/((($g[53]-$g[41])*($g[77]-$g[75]))-(($g[76]-$g[74])*($g[54]-$g[42])))
				$g[82]=((($g[53]*$g[42])-($g[41]*$g[54]))*($g[77]-$g[75]))-((($g[76]*$g[75])-($g[74]*$g[77]))*($g[54]-$g[42]))
				$g[82]=$g[82]/((($g[53]-$g[41])*($g[77]-$g[75]))-(($g[76]-$g[74])*($g[54]-$g[42])))
				$g[117] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[34]-(dotRadius/2), $g[35]-(dotRadius/2), $g[81], $g[82], dotRadius, dotRadius, 0)
				if (wait(90))
				return
				$pc = 51
			case 51:
				$g[110].setOpacity(0, 50, 1, 0)
				$g[112].setOpacity(0, 50, 1, 0)
				$g[114].setOpacity(0, 50, 1, 0)
				$g[115].setOpacity(0, 50, 1, 0)
				if ($g[116].setOpacity(0, 50, 1, 1))
				return
				$pc = 52
			case 52:
				if (wait(30))
				return
				$pc = 53
			case 53:
				if ($g[103].setOpacity(0, 50, 1, 1))
				return
				$pc = 54
			case 54:
				$g[36]=$g[101]
				$g[37]=$g[102]
				$g[40]=new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[34]+$g[36], $g[35]+$g[37], 0, 30, $g[1], $g[31])
				$g[40].setTxt("O", 0)
				$g[48]=($g[36]+$g[41])/2
				$g[49]=($g[37]+$g[42])/2
				$g[50]=new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[34]+$g[48], $g[35]+$g[49], 0, -30, $g[1], $g[32])
				$g[50].setTxt("(1 + \u221A5)/2", 0)
				$g[58]=($g[36]+$g[53])/2
				$g[59]=($g[37]+$g[54])/2
				$g[60]=new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[34]+$g[58], $g[35]+$g[59], 0, -30, $g[1], $g[32])
				$g[60].setTxt("(1 + \u221A5)/2", 0)
				$g[50].setOpacity(1, 50, 1, 0)
				if ($g[60].setOpacity(1, 50, 1, 1))
				return
				$pc = 55
			case 55:
				if (wait(95))
				return
				$pc = 56
			case 56:
				$g[56].setOpacity(0, 50, 1, 0)
				$g[46].setOpacity(0, 50, 1, 0)
				$g[57].setOpacity(0, 50, 1, 0)
				$g[60].setOpacity(0, 50, 1, 0)
				if ($g[55].setOpacity(0, 50, 1, 1))
				return
				$pc = 57
			case 57:
				$g[46]=new Line($g[0], 0, 0, $g[1], $g[34], $g[35], $g[41], $g[42], $g[36]-$g[41], $g[42]-$g[37])
				if (wait(95))
				return
				$pc = 58
			case 58:
				if ($g[50].setOpacity(0, 50, 1, 1))
				return
				$pc = 59
			case 59:
				if (wait(20))
				return
				$pc = 60
			case 60:
				$g[50].setTxt("\u03C6")
				if ($g[50].setOpacity(1, 50, 1, 1))
				return
				$pc = 61
			case 61:
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
