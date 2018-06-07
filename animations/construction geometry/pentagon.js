"use strict"

function pentagon(vplayer) {

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
	const HLEFT = vplayer.HLEFT
	const MAGENTA = vplayer.MAGENTA
	const RED = vplayer.RED
	const SOLID = vplayer.SOLID
	const VCENTRE = vplayer.VCENTRE
	const WHITE = vplayer.WHITE
	const YELLOW = vplayer.YELLOW

	var $g = vplayer.$g
	var addWaitToEventQ = vplayer.addWaitToEventQ
	var Arc = vplayer.Arc
	var ceil = vplayer.ceil
	var checkPoint = vplayer.checkPoint
	var Ellipse = vplayer.Ellipse
	var floor = vplayer.floor
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
				$g[32] = new Font("Calibri", 22)
				$g[33] = new Font("Calibri", 30)
				$g[34] = new SolidPen(SOLID, 3, BLACK, ARROW60_END, 2, 4)
				$g[35] = new SolidPen(SOLID, 3, RED, ARROW60_END, 2, 4)
				$g[36] = new SolidPen(0, 0, rgba(73/256, 126/256, 191/256, 100))
				$g[37] = new SolidPen(0, 0, rgba(0/256, 144/256, 17/256, 100))
				$g[38] = new SolidBrush(rgba(73/256, 126/256, 191/256, 100))
				$g[39] = new SolidBrush(rgba(0/256, 144/256, 17/256, 100))
				$g[40] = new Rectangle2($g[0], 0, W/2|VCENTRE, 0, 0, W/2-20, H/2-300, 200, 50, $g[1], $g[33])
				$g[40].setTxt("Regular Pentagon in a Circle", 0)
				$g[41] = new Rectangle2($g[0], 0, HLEFT, 0, 0, W/2-550, H/2-150, 200, 50, $g[1], $g[32])
				$g[42] = 150
				$g[43] = W/2
				$g[44] = H/2
				$g[45] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[43]-dotRadius/2, $g[44]-dotRadius/2, 0, 0, dotRadius, dotRadius, 0)
				$g[46] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[43], $g[44], 20, -30, $g[1], $g[31])
				$g[46].setTxt("O", 0)
				if (wait(95))
				return
				$pc = 1
			case 1:
				$g[41].setTxt("1. Draw a circle with centre O.", 0)
				checkPoint()
				if (wait(95))
				return
				$pc = 2
			case 2:
				$g[47] = new Arc($g[0], 0, 0, $g[1], 0, $g[43], $g[44], 0, 0, $g[42], $g[42], 0, 0, 0)
				$g[48] = new Line($g[0], 0, 0, $g[34], $g[43], $g[44], 0, 0, $g[42], 0)
				$g[48].rotate(360, 50, 1, 0)
				if ($g[47].rotateSpanAngle(360, 50, 1, 1))
				return
				$pc = 3
			case 3:
				if ($g[48].setOpacity(0, 50, 1, 1))
				return
				$pc = 4
			case 4:
				if (wait(95))
				return
				$pc = 5
			case 5:
				if ($g[41].setOpacity(0, 50, 1, 1))
				return
				$pc = 6
			case 6:
				$g[41].setTxt("2. Draw a line through centre O.", 0)
				if (wait(20))
				return
				$pc = 7
			case 7:
				if ($g[41].setOpacity(1, 50, 0, 1))
				return
				$pc = 8
			case 8:
				checkPoint()
				if (wait(90))
				return
				$pc = 9
			case 9:
				$g[49] = $g[43]
				$g[50] = $g[44]-($g[42]+20)
				$g[51] = $g[43]
				$g[52] = $g[44]+($g[42]+20)
				$g[53] = new Line($g[0], 0, 0, $g[36], $g[49], $g[50], 0, 0, 0, 0)
				if ($g[53].setPt(1, 0, $g[52]-$g[50], 50, 1, 1))
				return
				$pc = 10
			case 10:
				if (wait(140))
				return
				$pc = 11
			case 11:
				if ($g[41].setOpacity(0, 50, 1, 1))
				return
				$pc = 12
			case 12:
				$g[41].setTxt("3. This gives point A and point B.", 0)
				if ($g[41].setOpacity(1, 50, 0, 1))
				return
				$pc = 13
			case 13:
				checkPoint()
				$g[54] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[43]-dotRadius/2, ($g[44]-$g[42])-dotRadius/2, 0, 0, dotRadius, dotRadius, 0)
				$g[55] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[43]-dotRadius/2, ($g[44]+$g[42])-dotRadius/2, 0, 0, dotRadius, dotRadius, 0)
				$g[56] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[43], $g[44]-$g[42], 20, -30, $g[1], $g[31])
				$g[56].setTxt("A", 0)
				$g[57] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[43], $g[44]+$g[42], 20, 30, $g[1], $g[31])
				$g[57].setTxt("B", 0)
				if (wait(190))
				return
				$pc = 14
			case 14:
				if ($g[41].setOpacity(0, 50, 1, 1))
				return
				$pc = 15
			case 15:
				$g[41].setTxt("4. Construct a perpendicular to line AB.", 0)
				if ($g[41].setOpacity(1, 50, 0, 1))
				return
				$pc = 16
			case 16:
				checkPoint()
				if (wait(250))
				return
				$pc = 17
			case 17:
				if ($g[41].setOpacity(0, 50, 1, 1))
				return
				$pc = 18
			case 18:
				$g[41].setTxt("5. Draw an arc centered at point A.", 0)
				$g[54].setOpacity(0, 50, 0, 0)
				$g[58] = new Ellipse($g[0], 0, 0, $g[3], $g[18], $g[43]-dotRadius/2, ($g[44]-$g[42])-dotRadius/2, 0, 0, dotRadius, dotRadius, 0)
				if ($g[41].setOpacity(1, 50, 0, 1))
				return
				$pc = 19
			case 19:
				checkPoint()
				if (wait(170))
				return
				$pc = 20
			case 20:
				if ($g[41].setOpacity(0, 50, 1, 1))
				return
				$pc = 21
			case 21:
				$g[41].setTxt("6. Make the arc's radius roughly\n    3/4 the length of line AB.")
				if ($g[41].setOpacity(1, 50, 0, 1))
				return
				$pc = 22
			case 22:
				checkPoint()
				$g[59] = $g[42]+80
				$g[60] = $g[43]
				$g[61] = $g[44]-$g[42]
				$g[62] = new Arc($g[0], 0, 0, $g[3], 0, $g[60], $g[61], 0, 0, $g[59], $g[59], 0, 0)
				$g[63] = new Line($g[0], 0, 0, $g[35], $g[60], $g[61], 0, 0, $g[59], 0)
				$g[63].rotate(180, 50, 1, 0)
				if ($g[62].rotateSpanAngle(180, 50, 1, 1))
				return
				$pc = 23
			case 23:
				if ($g[63].setOpacity(0, 50, 1, 1))
				return
				$pc = 24
			case 24:
				if (wait(170))
				return
				$pc = 25
			case 25:
				if ($g[41].setOpacity(0, 50, 1, 1))
				return
				$pc = 26
			case 26:
				$g[41].setTxt("7. Draw another arc with the\n    same radius centered at B.")
				if ($g[41].setOpacity(1, 50, 0, 1))
				return
				$pc = 27
			case 27:
				checkPoint()
				$g[58].setOpacity(0, 50, 0, 0)
				if ($g[54].setOpacity(1, 50, 0, 1))
				return
				$pc = 28
			case 28:
				$g[55].setOpacity(0, 50, 0, 0)
				$g[64] = new Ellipse($g[0], 0, 0, $g[3], $g[18], $g[43]-dotRadius/2, ($g[44]+$g[42])-dotRadius/2, 0, 0, dotRadius, dotRadius, 0)
				$g[65] = $g[43]
				$g[66] = $g[44]+$g[42]
				$g[67] = new Arc($g[0], 0, 0, $g[3], 0, $g[65], $g[66], 0, 0, $g[59], $g[59], 180, 0)
				$g[68] = new Line($g[0], 0, 0, $g[35], $g[65], $g[66], 0, 0, -$g[59], 0)
				$g[68].rotate(180, 50, 1, 0)
				if ($g[67].rotateSpanAngle(180, 50, 1, 1))
				return
				$pc = 29
			case 29:
				if ($g[68].setOpacity(0, 50, 1, 1))
				return
				$pc = 30
			case 30:
				if (wait(150))
				return
				$pc = 31
			case 31:
				if ($g[41].setOpacity(0, 50, 1, 1))
				return
				$pc = 32
			case 32:
				$g[64].setOpacity(0, 50, 0, 0)
				if ($g[55].setOpacity(1, 50, 1, 1))
				return
				$pc = 33
			case 33:
				$g[41].setTxt("8. Join the points where the two\n    arcs intersect.")
				if ($g[41].setOpacity(1, 50, 0, 1))
				return
				$pc = 34
			case 34:
				checkPoint()
				$g[69] = $g[59]
				$g[70] = $g[60]
				$g[71] = $g[61]
				$g[72] = $g[59]
				$g[73] = $g[65]
				$g[74] = $g[66]
				$g[75] = sqrt(pow(($g[73]-$g[70]), 2)+pow(($g[74]-$g[71]), 2))
				$g[76] = pow($g[69], 2)
				$g[76]=$g[76]-(pow($g[72], 2))
				$g[76]=$g[76]+(pow($g[75], 2))
				$g[76]=$g[76]/(2*$g[75])
				$g[77] = pow($g[69], 2)-pow($g[76], 2)
				$g[77]=sqrt($g[77])
				$g[78] = $g[73]-$g[70]
				$g[78]=$g[78]/$g[75]
				$g[78]=$g[76]*$g[78]
				$g[78]=$g[70]+$g[78]
				$g[79] = ($g[74]-$g[71])
				$g[79]=$g[79]/$g[75]
				$g[79]=$g[76]*$g[79]
				$g[79]=$g[71]+$g[79]
				$g[80] = $g[74]-$g[71]
				$g[80]=$g[80]/$g[75]
				$g[80]=$g[77]*$g[80]
				$g[80]=$g[78]+$g[80]
				$g[81] = $g[73]-$g[70]
				$g[81]=$g[81]/$g[75]
				$g[81]=$g[77]*$g[81]
				$g[81]=$g[79]-$g[81]
				$g[82] = $g[74]-$g[71]
				$g[82]=$g[82]/$g[75]
				$g[82]=$g[77]*$g[82]
				$g[82]=$g[78]-$g[82]
				$g[83] = $g[73]-$g[70]
				$g[83]=$g[83]/$g[75]
				$g[83]=$g[77]*$g[83]
				$g[83]=$g[79]+$g[83]
				$g[84] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[80]-(dotRadius/2), $g[81]-(dotRadius/2), 0, 0, dotRadius, dotRadius, 0)
				$g[85] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[80], $g[81], 0, -30, $g[1], $g[31])
				$g[85].setTxt("D", 0)
				$g[86] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[82]-(dotRadius/2), $g[83]-(dotRadius/2), 0, 0, dotRadius, dotRadius, 0)
				$g[87] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[82], $g[83], 0, -30, $g[1], $g[31])
				$g[87].setTxt("C", 0)
				$g[88] = new Line($g[0], 0, 0, $g[36], $g[82]-30, $g[83], 0, 0, 0, 0)
				if ($g[88].setPt(0, ($g[80]+30)-($g[82]-30), $g[81]-$g[83], 50, 1, 1))
				return
				$pc = 35
			case 35:
				if (wait(95))
				return
				$pc = 36
			case 36:
				$g[84].setOpacity(0, 50, 1, 0)
				$g[85].setOpacity(0, 50, 1, 0)
				$g[62].setOpacity(0, 50, 1, 0)
				$g[67].setOpacity(0, 50, 1, 0)
				if ($g[41].setOpacity(0, 50, 1, 1))
				return
				$pc = 37
			case 37:
				$g[41].setTxt("9. Draw an arc centered at C.")
				$g[86].setOpacity(0, 50, 0, 0)
				$g[89] = new Ellipse($g[0], 0, 0, $g[3], $g[18], $g[82]-(dotRadius/2), $g[83]-(dotRadius/2), 0, 0, dotRadius, dotRadius, 0)
				if ($g[41].setOpacity(1, 50, 0, 1))
				return
				$pc = 38
			case 38:
				checkPoint()
				if (wait(95))
				return
				$pc = 39
			case 39:
				if (wait(95))
				return
				$pc = 40
			case 40:
				if ($g[41].setOpacity(0, 50, 1, 1))
				return
				$pc = 41
			case 41:
				$g[41].setTxt("10. The arc's radius will equal\n       line CO's length.")
				if ($g[41].setOpacity(1, 50, 0, 1))
				return
				$pc = 42
			case 42:
				checkPoint()
				$g[90] = $g[82]
				$g[91] = $g[83]
				$g[92] = sqrt(pow($g[43]-$g[90], 2)+pow($g[44]-$g[91], 2))
				$g[93] = new Arc($g[0], 0, 0, $g[3], 0, $g[82], $g[83], 0, 0, $g[92], $g[92], 270, 0, 0)
				$g[94] = new Line($g[0], 0, 0, $g[35], $g[82], $g[83], 0, 0, 0, -$g[92])
				$g[93].rotateSpanAngle(180, 50, 1, 0)
				if ($g[94].rotate(180, 50, 1, 1))
				return
				$pc = 43
			case 43:
				if ($g[94].setOpacity(0, 50, 1, 1))
				return
				$pc = 44
			case 44:
				if (wait(200))
				return
				$pc = 45
			case 45:
				$g[69]=$g[92]
				$g[70]=$g[90]
				$g[71]=$g[91]
				$g[72]=$g[42]
				$g[73]=$g[43]
				$g[74]=$g[44]
				$g[75]=sqrt(pow(($g[73]-$g[70]), 2)+pow(($g[74]-$g[71]), 2))
				$g[76]=pow($g[69], 2)
				$g[76]=$g[76]-(pow($g[72], 2))
				$g[76]=$g[76]+(pow($g[75], 2))
				$g[76]=$g[76]/(2*$g[75])
				$g[77]=pow($g[69], 2)-pow($g[76], 2)
				$g[77]=sqrt($g[77])
				$g[78]=$g[73]-$g[70]
				$g[78]=$g[78]/$g[75]
				$g[78]=$g[76]*$g[78]
				$g[78]=$g[70]+$g[78]
				$g[79]=($g[74]-$g[71])
				$g[79]=$g[79]/$g[75]
				$g[79]=$g[76]*$g[79]
				$g[79]=$g[71]+$g[79]
				$g[95] = $g[74]-$g[71]
				$g[95]=$g[95]/$g[75]
				$g[95]=$g[77]*$g[95]
				$g[95]=$g[78]+$g[95]
				$g[96] = $g[73]-$g[70]
				$g[96]=$g[96]/$g[75]
				$g[96]=$g[77]*$g[96]
				$g[96]=$g[79]-$g[96]
				$g[97] = $g[74]-$g[71]
				$g[97]=$g[97]/$g[75]
				$g[97]=$g[77]*$g[97]
				$g[97]=$g[78]-$g[97]
				$g[98] = $g[73]-$g[70]
				$g[98]=$g[98]/$g[75]
				$g[98]=$g[77]*$g[98]
				$g[98]=$g[79]+$g[98]
				$g[99] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[95]-(dotRadius/2), $g[96]-(dotRadius/2), 0, 0, dotRadius, dotRadius, 0)
				$g[100] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[95], $g[96], 20, -40, $g[1], $g[31])
				$g[100].setTxt("E", 0)
				$g[101] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[97]-(dotRadius/2), $g[98]-(dotRadius/2), 0, 0, dotRadius, dotRadius, 0)
				$g[102] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[97], $g[98], 20, 30, $g[1], $g[31])
				$g[102].setTxt("F", 0)
				if ($g[41].setOpacity(0, 50, 1, 1))
				return
				$pc = 46
			case 46:
				$g[41].setTxt("11. Join points E and F.")
				if ($g[41].setOpacity(1, 50, 0, 1))
				return
				$pc = 47
			case 47:
				checkPoint()
				$g[103] = new Line($g[0], 0, 0, $g[36], $g[95], $g[96], 0, 0, 0, 0)
				if ($g[103].setPt(0, $g[97]-$g[95], $g[98]-$g[96], 50, 1, 1))
				return
				$pc = 48
			case 48:
				$g[104] = (($g[97]*$g[96])-($g[95]*$g[98]))*($g[82]-$g[80])-(($g[82]*$g[81])-($g[80]*$g[83]))*($g[97]-$g[95])
				$g[104]=$g[104]/(($g[97]-$g[95])*($g[83]-$g[81])-($g[82]-$g[80])*($g[98]-$g[96]))
				$g[105] = ((($g[97]*$g[96])-($g[95]*$g[98]))*($g[83]-$g[81]))-((($g[82]*$g[81])-($g[80]*$g[83]))*($g[98]-$g[96]))
				$g[105]=$g[105]/((($g[97]-$g[95])*($g[83]-$g[81]))-(($g[82]-$g[80])*($g[98]-$g[96])))
				$g[105]=ceil($g[105])
				if (wait(120))
				return
				$pc = 49
			case 49:
				$g[89].setOpacity(0, 50, 0, 0)
				if ($g[86].setOpacity(1, 50, 0, 1))
				return
				$pc = 50
			case 50:
				if ($g[93].setOpacity(0, 50, 1, 1))
				return
				$pc = 51
			case 51:
				if ($g[41].setOpacity(0, 50, 1, 1))
				return
				$pc = 52
			case 52:
				$g[41].setTxt("12. Mark a point G where lines\n      CO and EF intersect.")
				if ($g[41].setOpacity(1, 50, 0, 1))
				return
				$pc = 53
			case 53:
				checkPoint()
				$g[106] = new Ellipse($g[0], 0, 0, $g[3], $g[18], 0, 0, $g[104]-(dotRadius/2), $g[105]-(dotRadius/2), dotRadius, dotRadius, 0)
				$g[107] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[104], $g[105], 20, -30, $g[1], $g[31])
				$g[107].setTxt("G", 0)
				if (wait(200))
				return
				$pc = 54
			case 54:
				$g[103].setOpacity(0, 50, 1, 0)
				$g[99].setOpacity(0, 50, 1, 0)
				$g[100].setOpacity(0, 50, 1, 0)
				$g[87].setOpacity(0, 50, 1, 0)
				$g[86].setOpacity(0, 50, 1, 0)
				$g[101].setOpacity(0, 50, 1, 0)
				$g[102].setOpacity(0, 50, 1, 0)
				if ($g[41].setOpacity(0, 50, 1, 1))
				return
				$pc = 55
			case 55:
				$g[41].setTxt("13. Draw an arc centered at G which\n      passes through A and B.")
				if ($g[41].setOpacity(1, 50, 0, 1))
				return
				$pc = 56
			case 56:
				checkPoint()
				$g[54].setOpacity(0, 50, 0, 0)
				$g[58].setOpacity(1, 50, 0, 0)
				$g[55].setOpacity(0, 50, 0, 0)
				if ($g[64].setOpacity(1, 50, 1, 1))
				return
				$pc = 57
			case 57:
				if (wait(120))
				return
				$pc = 58
			case 58:
				$g[108] = sqrt(pow($g[43]-$g[104], 2)+pow(($g[44]+$g[42])-$g[105], 2))
				if (wait(90))
				return
				$pc = 59
			case 59:
				if ($g[41].setOpacity(0, 50, 1, 1))
				return
				$pc = 60
			case 60:
				$g[41].setTxt("14. This gives point H.")
				if ($g[41].setOpacity(1, 50, 0, 1))
				return
				$pc = 61
			case 61:
				checkPoint()
				$g[109] = new Arc($g[0], 0, 0, $g[3], 0, $g[104], $g[105], 0, 0, $g[108], $g[108], 270, 0)
				$g[110] = new Line($g[0], 0, 0, $g[35], $g[104], $g[105], 0, 0, 0, -$g[108])
				$g[110].rotate(180, 50, 1, 0)
				if ($g[109].rotateSpanAngle(180, 50, 1, 1))
				return
				$pc = 62
			case 62:
				if ($g[110].setOpacity(0, 50, 1, 1))
				return
				$pc = 63
			case 63:
				$g[111] = new Ellipse($g[0], 0, 0, $g[1], $g[16], 0, 0, ($g[104]+$g[108])-(dotRadius/2), $g[105]-(dotRadius/2), dotRadius, dotRadius, 0)
				$g[112] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[104]+$g[108], $g[105], -20, -30, $g[1], $g[31])
				$g[112].setTxt("H", 0)
				if (wait(95))
				return
				$pc = 64
			case 64:
				$g[106].setOpacity(0, 50, 1, 0)
				$g[107].setOpacity(0, 50, 1, 0)
				$g[109].setOpacity(0, 50, 1, 0)
				$g[58].setOpacity(0, 50, 0, 0)
				$g[54].setOpacity(1, 50, 0, 0)
				$g[64].setOpacity(0, 50, 0, 0)
				if ($g[55].setOpacity(1, 50, 0, 1))
				return
				$pc = 65
			case 65:
				if (wait(150))
				return
				$pc = 66
			case 66:
				if ($g[41].setOpacity(0, 50, 1, 1))
				return
				$pc = 67
			case 67:
				$g[41].setTxt("15. Draw an arc centered at A which\n      passes through H.")
				if ($g[41].setOpacity(1, 50, 0, 1))
				return
				$pc = 68
			case 68:
				checkPoint()
				$g[113] = sqrt(pow(($g[104]+$g[108])-$g[43], 2)+pow($g[105]-($g[44]-$g[42]), 2))
				$g[54].setOpacity(0, 50, 0, 0)
				$g[58].setOpacity(1, 50, 0, 0)
				$g[114] = new Arc($g[0], 0, 0, $g[3], 0, $g[43], ($g[44]-$g[42]), 0, 0, $g[113], $g[113], 0, 0)
				$g[115] = new Line($g[0], 0, 0, $g[35], $g[43], ($g[44]-$g[42]), 0, 0, $g[113], 0)
				$g[115].rotate(180, 50, 1, 0)
				if ($g[114].rotateSpanAngle(180, 50, 1, 1))
				return
				$pc = 69
			case 69:
				if ($g[115].setOpacity(0, 50, 1, 1))
				return
				$pc = 70
			case 70:
				$g[69]=$g[113]
				$g[70]=$g[43]
				$g[71]=($g[44]-$g[42])
				$g[72]=$g[42]
				$g[73]=$g[43]
				$g[74]=$g[44]
				$g[75]=sqrt(pow(($g[73]-$g[70]), 2)+pow(($g[74]-$g[71]), 2))
				$g[76]=pow($g[69], 2)
				$g[76]=$g[76]-(pow($g[72], 2))
				$g[76]=$g[76]+(pow($g[75], 2))
				$g[76]=$g[76]/(2*$g[75])
				$g[77]=pow($g[69], 2)-pow($g[76], 2)
				$g[77]=sqrt($g[77])
				$g[78]=$g[73]-$g[70]
				$g[78]=$g[78]/$g[75]
				$g[78]=$g[76]*$g[78]
				$g[78]=$g[70]+$g[78]
				$g[79]=($g[74]-$g[71])
				$g[79]=$g[79]/$g[75]
				$g[79]=$g[76]*$g[79]
				$g[79]=$g[71]+$g[79]
				$g[116] = $g[74]-$g[71]
				$g[116]=$g[116]/$g[75]
				$g[116]=$g[77]*$g[116]
				$g[116]=$g[78]+$g[116]
				$g[117] = $g[73]-$g[70]
				$g[117]=$g[117]/$g[75]
				$g[117]=$g[77]*$g[117]
				$g[117]=$g[79]-$g[117]
				$g[118] = $g[74]-$g[71]
				$g[118]=$g[118]/$g[75]
				$g[118]=$g[77]*$g[118]
				$g[118]=$g[78]-$g[118]
				$g[119] = $g[73]-$g[70]
				$g[119]=$g[119]/$g[75]
				$g[119]=$g[77]*$g[119]
				$g[119]=$g[79]+$g[119]
				$g[120] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[116]-(dotRadius/2), $g[117]-(dotRadius/2), 0, 0, dotRadius, dotRadius, 0)
				$g[121] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[118]-(dotRadius/2), $g[119]-(dotRadius/2), 0, 0, dotRadius, dotRadius, 0)
				if (wait(95))
				return
				$pc = 71
			case 71:
				$g[58].setOpacity(0, 50, 0, 0)
				$g[54].setOpacity(1, 50, 0, 0)
				if ($g[114].setOpacity(0, 50, 1, 1))
				return
				$pc = 72
			case 72:
				if ($g[41].setOpacity(0, 50, 1, 1))
				return
				$pc = 73
			case 73:
				$g[41].setTxt("16. This gives the pentagon's top-left\n      and top-right points.")
				if ($g[41].setOpacity(1, 50, 0, 1))
				return
				$pc = 74
			case 74:
				checkPoint()
				$g[120].setOpacity(0, 50, 0, 0)
				$g[121].setOpacity(0, 50, 0, 0)
				$g[122] = new Ellipse($g[0], 0, 0, $g[3], $g[18], $g[116]-(dotRadius/2), $g[117]-(dotRadius/2), 0, 0, dotRadius, dotRadius, 0)
				$g[123] = new Ellipse($g[0], 0, 0, $g[3], $g[18], $g[118]-(dotRadius/2), $g[119]-(dotRadius/2), 0, 0, dotRadius, dotRadius, 0)
				if (wait(120))
				return
				$pc = 75
			case 75:
				$g[124] = sqrt(pow($g[43]-($g[104]+$g[108]), 2)+pow($g[44]-$g[105], 2))
				if ($g[41].setOpacity(0, 50, 1, 1))
				return
				$pc = 76
			case 76:
				$g[41].setTxt("17. Draw an arc centered at B.")
				if ($g[41].setOpacity(1, 50, 0, 1))
				return
				$pc = 77
			case 77:
				checkPoint()
				$g[122].setOpacity(0, 50, 0, 0)
				$g[120].setOpacity(1, 50, 0, 0)
				$g[123].setOpacity(0, 50, 0, 0)
				$g[121].setOpacity(1, 50, 0, 0)
				$g[64].setOpacity(1, 50, 0, 0)
				if ($g[55].setOpacity(0, 50, 0, 1))
				return
				$pc = 78
			case 78:
				if (wait(120))
				return
				$pc = 79
			case 79:
				if ($g[41].setOpacity(0, 50, 1, 1))
				return
				$pc = 80
			case 80:
				$g[41].setTxt("18. The arc's radius equals the length\n      of line OH.")
				if ($g[41].setOpacity(1, 50, 0, 1))
				return
				$pc = 81
			case 81:
				checkPoint()
				$g[111].setOpacity(0, 50, 0, 0)
				$g[125] = new Ellipse($g[0], 0, 0, $g[3], $g[18], 0, 0, ($g[104]+$g[108])-(dotRadius/2), $g[105]-(dotRadius/2), dotRadius, dotRadius, 0)
				$g[45].setOpacity(0, 50, 0, 0)
				$g[126] = new Ellipse($g[0], 0, 0, $g[3], $g[18], $g[43]-dotRadius/2, $g[44]-dotRadius/2, 0, 0, dotRadius, dotRadius, 0)
				if (wait(200))
				return
				$pc = 82
			case 82:
				$g[127] = new Arc($g[0], 0, 0, $g[3], 0, $g[43], ($g[44]+$g[42]), 0, 0, $g[124], $g[124], 180, 0)
				$g[128] = new Line($g[0], 0, 0, $g[35], $g[43], ($g[44]+$g[42]), 0, 0, -$g[124], 0)
				$g[128].rotate(180, 50, 1, 0)
				if ($g[127].rotateSpanAngle(180, 50, 1, 1))
				return
				$pc = 83
			case 83:
				if ($g[128].setOpacity(0, 50, 1, 1))
				return
				$pc = 84
			case 84:
				$g[69]=$g[124]
				$g[70]=$g[43]
				$g[71]=($g[44]+$g[42])
				$g[72]=$g[42]
				$g[73]=$g[43]
				$g[74]=$g[44]
				$g[75]=sqrt(pow(($g[73]-$g[70]), 2)+pow(($g[74]-$g[71]), 2))
				$g[76]=pow($g[69], 2)
				$g[76]=$g[76]-(pow($g[72], 2))
				$g[76]=$g[76]+(pow($g[75], 2))
				$g[76]=$g[76]/(2*$g[75])
				$g[77]=pow($g[69], 2)-pow($g[76], 2)
				$g[77]=sqrt($g[77])
				$g[78]=$g[73]-$g[70]
				$g[78]=$g[78]/$g[75]
				$g[78]=$g[76]*$g[78]
				$g[78]=$g[70]+$g[78]
				$g[79]=($g[74]-$g[71])
				$g[79]=$g[79]/$g[75]
				$g[79]=$g[76]*$g[79]
				$g[79]=$g[71]+$g[79]
				$g[129] = $g[74]-$g[71]
				$g[129]=$g[129]/$g[75]
				$g[129]=$g[77]*$g[129]
				$g[129]=$g[78]+$g[129]
				$g[130] = $g[73]-$g[70]
				$g[130]=$g[130]/$g[75]
				$g[130]=$g[77]*$g[130]
				$g[130]=$g[79]-$g[130]
				$g[131] = $g[74]-$g[71]
				$g[131]=$g[131]/$g[75]
				$g[131]=$g[77]*$g[131]
				$g[131]=$g[78]-$g[131]
				$g[132] = $g[73]-$g[70]
				$g[132]=$g[132]/$g[75]
				$g[132]=$g[77]*$g[132]
				$g[132]=$g[79]+$g[132]
				$g[133] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[129]-(dotRadius/2), $g[130]-(dotRadius/2), 0, 0, dotRadius, dotRadius, 0)
				$g[134] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[131]-(dotRadius/2), $g[132]-(dotRadius/2), 0, 0, dotRadius, dotRadius, 0)
				if ($g[41].setOpacity(0, 50, 1, 1))
				return
				$pc = 85
			case 85:
				$g[41].setTxt("19. This gives the pentagon's bottom-left\n      and bottom-right points.")
				if ($g[41].setOpacity(1, 50, 0, 1))
				return
				$pc = 86
			case 86:
				checkPoint()
				if (wait(120))
				return
				$pc = 87
			case 87:
				$g[111].setOpacity(0, 50, 1, 0)
				$g[127].setOpacity(0, 50, 1, 0)
				$g[112].setOpacity(0, 50, 1, 0)
				$g[56].setOpacity(0, 50, 1, 0)
				$g[126].setOpacity(0, 50, 1, 0)
				$g[57].setOpacity(0, 50, 1, 0)
				$g[46].setOpacity(0, 50, 1, 0)
				$g[53].setOpacity(0, 50, 1, 0)
				$g[88].setOpacity(0, 50, 1, 0)
				$g[125].setOpacity(0, 50, 1, 0)
				if ($g[64].setOpacity(0, 50, 1, 1))
				return
				$pc = 88
			case 88:
				if ($g[41].setOpacity(0, 50, 1, 1))
				return
				$pc = 89
			case 89:
				$g[41].setTxt("20. Join the points to complete the pentagon.")
				if ($g[41].setOpacity(1, 50, 0, 1))
				return
				$pc = 90
			case 90:
				checkPoint()
				if (wait(120))
				return
				$pc = 91
			case 91:
				$g[135] = new Line($g[0], 0, 0, $g[1], $g[43], $g[44]-$g[42], 0, 0, 0, 0)
				if ($g[135].setPt(1, $g[116]-$g[43], $g[117]-($g[44]-$g[42]), 50, 1, 1))
				return
				$pc = 92
			case 92:
				$g[136] = new Line($g[0], 0, 0, $g[1], $g[116], $g[117], 0, 0, 0, 0)
				if ($g[136].setPt(1, $g[131]-$g[116], $g[132]-$g[117], 50, 1, 1))
				return
				$pc = 93
			case 93:
				$g[137] = new Line($g[0], 0, 0, $g[1], $g[131], $g[132], 0, 0, 0, 0)
				if ($g[137].setPt(1, $g[129]-$g[131], $g[132]-$g[130], 50, 1, 1))
				return
				$pc = 94
			case 94:
				$g[138] = new Line($g[0], 0, 0, $g[1], $g[129], $g[130], 0, 0, 0, 0)
				if ($g[138].setPt(1, $g[118]-$g[129], $g[119]-$g[130], 50, 1, 1))
				return
				$pc = 95
			case 95:
				$g[139] = new Line($g[0], 0, 0, $g[1], $g[118], $g[119], 0, 0, 0, 0)
				if ($g[139].setPt(1, $g[43]-$g[118], ($g[44]-$g[42])-$g[119], 50, 1, 1))
				return
				$pc = 96
			case 96:
				$g[45].setOpacity(0, 50, 1, 0)
				$g[47].setOpacity(0, 50, 1, 0)
				$g[53].setOpacity(0, 50, 1, 0)
				$g[62].setOpacity(0, 50, 1, 0)
				$g[67].setOpacity(0, 50, 1, 0)
				$g[88].setOpacity(0, 50, 1, 0)
				$g[93].setOpacity(0, 50, 1, 0)
				$g[99].setOpacity(0, 50, 1, 0)
				$g[101].setOpacity(0, 50, 1, 0)
				$g[103].setOpacity(0, 50, 1, 0)
				$g[109].setOpacity(0, 50, 1, 0)
				$g[111].setOpacity(0, 50, 1, 0)
				$g[114].setOpacity(0, 50, 1, 0)
				if ($g[127].setOpacity(0, 50, 1, 1))
				return
				$pc = 97
			case 97:
				if (wait(100))
				return
				$pc = 98
			case 98:
				$g[40].setTxt("Golden Ratio in Pentagon")
				if ($g[41].setOpacity(0, 50, 1, 1))
				return
				$pc = 99
			case 99:
				$g[41].setTxt("Join the diagonals of the pentagon.")
				if ($g[41].setOpacity(1, 50, 0, 1))
				return
				$pc = 100
			case 100:
				checkPoint()
				if (wait(120))
				return
				$pc = 101
			case 101:
				$g[140] = new Line($g[0], 0, 0, $g[36], $g[43], ($g[44]-$g[42]), 0, 0, 0, 0)
				if ($g[140].setPt(1, $g[129]-$g[43], $g[130]-($g[44]-$g[42]), 1, 1, 1))
				return
				$pc = 102
			case 102:
				if ($g[140].setOpacity(0, 50, 0, 1))
				return
				$pc = 103
			case 103:
				if ($g[140].setOpacity(1, 50, 1, 1))
				return
				$pc = 104
			case 104:
				if (wait(20))
				return
				$pc = 105
			case 105:
				$g[141] = new Line($g[0], 0, 0, $g[36], $g[129], $g[130], 0, 0, 0, 0)
				$g[141].setPt(1, $g[116]-$g[129], $g[117]-$g[130], 1, 1, 0)
				if ($g[141].setOpacity(0, 50, 0, 1))
				return
				$pc = 106
			case 106:
				if ($g[141].setOpacity(1, 50, 1, 1))
				return
				$pc = 107
			case 107:
				if (wait(20))
				return
				$pc = 108
			case 108:
				$g[142] = new Line($g[0], 0, 0, $g[36], $g[116], $g[117], 0, 0, 0, 0)
				$g[142].setPt(1, $g[118]-$g[116], $g[117]-$g[119], 1, 1, 0)
				if ($g[142].setOpacity(0, 50, 0, 1))
				return
				$pc = 109
			case 109:
				if ($g[142].setOpacity(1, 50, 1, 1))
				return
				$pc = 110
			case 110:
				if (wait(20))
				return
				$pc = 111
			case 111:
				$g[143] = new Line($g[0], 0, 0, $g[36], $g[43], ($g[44]-$g[42]), 0, 0, 0, 0)
				$g[143].setPt(1, $g[131]-$g[43], $g[132]-($g[44]-$g[42]), 1, 1, 0)
				if ($g[143].setOpacity(0, 50, 0, 1))
				return
				$pc = 112
			case 112:
				if ($g[143].setOpacity(1, 50, 1, 1))
				return
				$pc = 113
			case 113:
				if (wait(20))
				return
				$pc = 114
			case 114:
				$g[144] = new Line($g[0], 0, 0, $g[36], $g[131], $g[132], 0, 0, 0, 0)
				if ($g[144].setPt(1, $g[129]-$g[116], $g[117]-$g[130], 1, 1, 1))
				return
				$pc = 115
			case 115:
				if ($g[144].setOpacity(0, 50, 0, 1))
				return
				$pc = 116
			case 116:
				if ($g[144].setOpacity(1, 50, 1, 1))
				return
				$pc = 117
			case 117:
				if (wait(20))
				return
				$pc = 118
			case 118:
				$g[56]=new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[43], $g[44]-$g[42], 0, -30, $g[1], $g[31])
				$g[56].setTxt("A", 0)
				if ($g[56].setOpacity(0, 50, 0, 1))
				return
				$pc = 119
			case 119:
				if ($g[56].setOpacity(1, 50, 1, 1))
				return
				$pc = 120
			case 120:
				$g[57]=new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[118], $g[119], 0, -30, $g[1], $g[31])
				$g[57].setTxt("B", 0)
				if ($g[57].setOpacity(0, 50, 0, 1))
				return
				$pc = 121
			case 121:
				if ($g[57].setOpacity(1, 50, 1, 1))
				return
				$pc = 122
			case 122:
				$g[87]=new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[129], $g[130], -20, 30, $g[1], $g[31])
				$g[87].setTxt("C", 0)
				if ($g[87].setOpacity(0, 50, 0, 1))
				return
				$pc = 123
			case 123:
				if ($g[87].setOpacity(1, 50, 1, 1))
				return
				$pc = 124
			case 124:
				$g[85]=new Rectangle2($g[0], 0, VCENTRE, 0, 0, 474, 267, -20, -30, $g[1], $g[31])
				$g[85].setTxt("D", 0)
				if ($g[85].setOpacity(0, 50, 0, 1))
				return
				$pc = 125
			case 125:
				$g[145] = new Ellipse($g[0], 0, 0, $g[1], $g[16], 474-dotRadius/2, 267-dotRadius/2, 0, 0, dotRadius, dotRadius, 0)
				if ($g[145].setOpacity(0, 50, 0, 1))
				return
				$pc = 126
			case 126:
				$g[85].setOpacity(1, 50, 1, 0)
				if ($g[145].setOpacity(1, 50, 1, 1))
				return
				$pc = 127
			case 127:
				$g[100]=new Rectangle2($g[0], 0, VCENTRE, 0, 0, 454, 325, -25, 10, $g[1], $g[31])
				$g[100].setTxt("E", 0)
				if ($g[100].setOpacity(0, 50, 0, 1))
				return
				$pc = 128
			case 128:
				$g[146] = new Ellipse($g[0], 0, 0, $g[1], $g[16], 454-dotRadius/2, 325-dotRadius/2, 0, 0, dotRadius, dotRadius, 0)
				if ($g[146].setOpacity(0, 50, 0, 1))
				return
				$pc = 129
			case 129:
				$g[100].setOpacity(1, 50, 1, 0)
				if ($g[146].setOpacity(1, 50, 1, 1))
				return
				$pc = 130
			case 130:
				if ($g[41].setOpacity(0, 50, 1, 1))
				return
				$pc = 131
			case 131:
				$g[41].setTxt("AC : AB = \u03C6\nAD : DE = \u03C6\nCE : ED = \u03C6")
				if ($g[41].setOpacity(1, 50, 0, 1))
				return
				$pc = 132
			case 132:
				$g[129]=floor($g[129])
				$g[130]=floor($g[130])
				$g[116]=floor($g[116])
				$g[117]=floor($g[117])
				$g[118]=floor($g[118])
				$g[119]=floor($g[119])
				$g[147] = (($g[129]*($g[44]-$g[42]))-($g[43]*$g[130]))*($g[118]-$g[116])
				$g[147]=$g[147]-((($g[118]*$g[117])-($g[116]*$g[119]))*($g[129]-$g[43]))
				$g[147]=$g[147]/((($g[129]-$g[43])*($g[119]-$g[117]))-(($g[118]-$g[116])*($g[130]-($g[44]-$g[42]))))
				$g[148] = (($g[129]*($g[44]-$g[42]))-($g[43]*$g[130]))*($g[119]-$g[117])
				$g[148]=$g[148]-((($g[118]*$g[117])-($g[116]*$g[119]))*($g[130]-($g[44]-$g[42])))
				$g[148]=$g[148]/((($g[129]-$g[43])*($g[119]-$g[117]))-(($g[118]-$g[116])*($g[130]-($g[44]-$g[42]))))
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
