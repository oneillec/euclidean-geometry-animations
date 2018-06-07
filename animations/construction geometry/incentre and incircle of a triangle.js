"use strict"

function incentre_and_incircle_of_a_triangle(vplayer) {

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
				$g[31].setTxt("Incentre and incircle of a triangle", 0)
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
				$g[56] = new Arc($g[0], 0, 0, $g[1], 0, $g[39], $g[40], $g[41], $g[42], 100, 100, 310, 0)
				if ($g[56].rotateSpanAngle(55, 50, 1, 1))
				return
				$pc = 2
			case 2:
				$g[57] = 70.710999999999999
				$g[58] = -70.710999999999999
				if (wait(55))
				return
				$pc = 3
			case 3:
				$g[59] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[39]-(dotRadius/2), $g[40]-(dotRadius/2), $g[57], $g[58], dotRadius, dotRadius, 0)
				if ($g[59].setOpacity(0, 50, 0, 1))
				return
				$pc = 4
			case 4:
				if ($g[59].setOpacity(1, 50, 1, 1))
				return
				$pc = 5
			case 5:
				$g[60] = 100
				$g[61] = 0
				$g[62] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[39]-(dotRadius/2), $g[40]-(dotRadius/2), $g[60], $g[61], dotRadius, dotRadius, 0)
				if ($g[62].setOpacity(0, 50, 0, 1))
				return
				$pc = 6
			case 6:
				if ($g[62].setOpacity(1, 50, 1, 1))
				return
				$pc = 7
			case 7:
				if (wait(90))
				return
				$pc = 8
			case 8:
				if ($g[56].setOpacity(0, 50, 1, 1))
				return
				$pc = 9
			case 9:
				if (wait(90))
				return
				$pc = 10
			case 10:
				$g[63] = sqrt(pow($g[60]-$g[57], 2)+pow($g[61]-$g[58], 2))
				if ($g[59].setOpacity(0, 50, 0, 1))
				return
				$pc = 11
			case 11:
				$g[64] = new Ellipse($g[0], 0, 0, $g[3], $g[18], $g[39]-(dotRadius/2), $g[40]-(dotRadius/2), $g[57], $g[58], dotRadius, dotRadius, 0)
				$g[65] = new Arc($g[0], 0, 0, $g[3], 0, $g[39], $g[40], $g[57], $g[58], $g[63], $g[63], -290, 0)
				if ($g[65].rotateSpanAngle(-80, 50, 1, 1))
				return
				$pc = 12
			case 12:
				if (wait(90))
				return
				$pc = 13
			case 13:
				$g[64].setOpacity(0, 50, 1, 0)
				if ($g[59].setOpacity(1, 50, 1, 1))
				return
				$pc = 14
			case 14:
				if (wait(90))
				return
				$pc = 15
			case 15:
				if ($g[62].setOpacity(0, 50, 0, 1))
				return
				$pc = 16
			case 16:
				$g[66] = new Ellipse($g[0], 0, 0, $g[3], $g[18], $g[39]-(dotRadius/2), $g[40]-(dotRadius/2), $g[60], $g[61], dotRadius, dotRadius, 0)
				$g[67] = new Arc($g[0], 0, 0, $g[3], 0, $g[39], $g[40], $g[60], $g[61], $g[63], $g[63], 290-40, 0)
				if ($g[67].rotateSpanAngle(75, 50, 1, 1))
				return
				$pc = 17
			case 17:
				if (wait(90))
				return
				$pc = 18
			case 18:
				$g[66].setOpacity(0, 50, 1, 0)
				if ($g[62].setOpacity(1, 50, 1, 1))
				return
				$pc = 19
			case 19:
				if (wait(90))
				return
				$pc = 20
			case 20:
				$g[68] = $g[63]
				$g[69] = $g[57]
				$g[70] = $g[58]
				$g[71] = $g[63]
				$g[72] = $g[60]
				$g[73] = $g[61]
				$g[74] = sqrt(pow(($g[72]-$g[69]), 2)+pow(($g[73]-$g[70]), 2))
				$g[75] = pow($g[68], 2)
				$g[75]=$g[75]-(pow($g[71], 2))
				$g[75]=$g[75]+(pow($g[74], 2))
				$g[75]=$g[75]/(2*$g[74])
				$g[76] = pow($g[68], 2)-pow($g[75], 2)
				$g[76]=sqrt($g[76])
				$g[77] = $g[72]-$g[69]
				$g[77]=$g[77]/$g[74]
				$g[77]=$g[75]*$g[77]
				$g[77]=$g[69]+$g[77]
				$g[78] = ($g[73]-$g[70])
				$g[78]=$g[78]/$g[74]
				$g[78]=$g[75]*$g[78]
				$g[78]=$g[70]+$g[78]
				$g[79] = $g[73]-$g[70]
				$g[79]=$g[79]/$g[74]
				$g[79]=$g[76]*$g[79]
				$g[79]=$g[77]+$g[79]
				$g[80] = $g[72]-$g[69]
				$g[80]=$g[80]/$g[74]
				$g[80]=$g[76]*$g[80]
				$g[80]=$g[78]-$g[80]
				$g[81] = $g[73]-$g[70]
				$g[81]=$g[81]/$g[74]
				$g[81]=$g[76]*$g[81]
				$g[81]=$g[77]-$g[81]
				$g[82] = $g[72]-$g[69]
				$g[82]=$g[82]/$g[74]
				$g[82]=$g[76]*$g[82]
				$g[82]=$g[78]+$g[82]
				$g[83] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[39]-(dotRadius/2), $g[40]-(dotRadius/2), $g[79], $g[80], dotRadius, dotRadius, 0)
				if ($g[83].setOpacity(0, 50, 0, 1))
				return
				$pc = 21
			case 21:
				if ($g[83].setOpacity(1, 50, 1, 1))
				return
				$pc = 22
			case 22:
				if (wait(90))
				return
				$pc = 23
			case 23:
				$g[66].setOpacity(0, 50, 1, 0)
				$g[59].setOpacity(0, 50, 1, 0)
				$g[62].setOpacity(0, 50, 1, 0)
				$g[65].setOpacity(0, 50, 1, 0)
				if ($g[67].setOpacity(0, 50, 1, 1))
				return
				$pc = 24
			case 24:
				if (wait(90))
				return
				$pc = 25
			case 25:
				$g[84] = new Line($g[0], 0, 0, $g[35], $g[39], $g[40], $g[41], $g[42], 0, 0)
				if ($g[84].setPt(1, $g[79], $g[80], 50, 1, 1))
				return
				$pc = 26
			case 26:
				if (wait(90))
				return
				$pc = 27
			case 27:
				if ($g[83].setOpacity(0, 50, 1, 1))
				return
				$pc = 28
			case 28:
				if (wait(90))
				return
				$pc = 29
			case 29:
				$g[56]=new Arc($g[0], 0, 0, $g[1], 0, $g[39], $g[40], $g[43], $g[44], 100, 100, 175, 0)
				if ($g[56].setOpacity(1, 50, 0, 1))
				return
				$pc = 30
			case 30:
				if ($g[56].rotateSpanAngle(75, 50, 1, 1))
				return
				$pc = 31
			case 31:
				$g[57]=$g[43]-100
				$g[58]=$g[44]
				if (wait(55))
				return
				$pc = 32
			case 32:
				$g[59]=new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[39]-(dotRadius/2), $g[40]-(dotRadius/2), $g[57], $g[58], dotRadius, dotRadius, 0)
				if ($g[59].setOpacity(0, 50, 0, 1))
				return
				$pc = 33
			case 33:
				if ($g[59].setOpacity(1, 50, 1, 1))
				return
				$pc = 34
			case 34:
				$g[60]=160.608
				$g[61]=-91.915000000000006
				$g[62]=new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[39]-(dotRadius/2), $g[40]-(dotRadius/2), $g[60], $g[61], dotRadius, dotRadius, 0)
				if ($g[62].setOpacity(0, 50, 0, 1))
				return
				$pc = 35
			case 35:
				if ($g[62].setOpacity(1, 50, 1, 1))
				return
				$pc = 36
			case 36:
				if (wait(95))
				return
				$pc = 37
			case 37:
				if ($g[56].setOpacity(0, 50, 1, 1))
				return
				$pc = 38
			case 38:
				if (wait(95))
				return
				$pc = 39
			case 39:
				$g[63]=sqrt(pow($g[60]-$g[57], 2)+pow($g[61]-$g[58], 2))
				if ($g[59].setOpacity(0, 50, 0, 1))
				return
				$pc = 40
			case 40:
				$g[64]=new Ellipse($g[0], 0, 0, $g[3], $g[18], $g[39]-(dotRadius/2), $g[40]-(dotRadius/2), $g[57], $g[58], dotRadius, dotRadius, 0)
				if ($g[64].setOpacity(1, 50, 0, 1))
				return
				$pc = 41
			case 41:
				$g[65]=new Arc($g[0], 0, 0, $g[3], 0, $g[39], $g[40], $g[57], $g[58], $g[63], $g[63], -290+90-180-35, 0)
				if ($g[65].setOpacity(1, 50, 0, 1))
				return
				$pc = 42
			case 42:
				if ($g[65].rotateSpanAngle(-80, 50, 1, 1))
				return
				$pc = 43
			case 43:
				if (wait(90))
				return
				$pc = 44
			case 44:
				$g[64].setOpacity(0, 50, 0, 0)
				if ($g[59].setOpacity(1, 50, 0, 1))
				return
				$pc = 45
			case 45:
				if (wait(90))
				return
				$pc = 46
			case 46:
				if ($g[62].setOpacity(0, 50, 0, 1))
				return
				$pc = 47
			case 47:
				$g[66]=new Ellipse($g[0], 0, 0, $g[3], $g[18], $g[39]-(dotRadius/2), $g[40]-(dotRadius/2), $g[60], $g[61], dotRadius, dotRadius, 0)
				if ($g[66].setOpacity(1, 50, 0, 1))
				return
				$pc = 48
			case 48:
				$g[67]=new Arc($g[0], 0, 0, $g[3], 0, $g[39], $g[40], $g[60], $g[61], $g[63], $g[63], 125, 0)
				if ($g[67].setOpacity(1, 50, 0, 1))
				return
				$pc = 49
			case 49:
				if ($g[67].rotateSpanAngle(75, 50, 1, 1))
				return
				$pc = 50
			case 50:
				if (wait(30))
				return
				$pc = 51
			case 51:
				$g[66].setOpacity(0, 50, 1, 0)
				if ($g[62].setOpacity(1, 50, 1, 1))
				return
				$pc = 52
			case 52:
				if (wait(90))
				return
				$pc = 53
			case 53:
				$g[68]=$g[63]
				$g[69]=$g[57]
				$g[70]=$g[58]
				$g[71]=$g[63]
				$g[72]=$g[60]
				$g[73]=$g[61]
				$g[74]=sqrt(pow(($g[72]-$g[69]), 2)+pow(($g[73]-$g[70]), 2))
				$g[75]=pow($g[68], 2)
				$g[75]=$g[75]-(pow($g[71], 2))
				$g[75]=$g[75]+(pow($g[74], 2))
				$g[75]=$g[75]/(2*$g[74])
				$g[76]=pow($g[68], 2)-pow($g[75], 2)
				$g[76]=sqrt($g[76])
				$g[77]=$g[72]-$g[69]
				$g[77]=$g[77]/$g[74]
				$g[77]=$g[75]*$g[77]
				$g[77]=$g[69]+$g[77]
				$g[78]=($g[73]-$g[70])
				$g[78]=$g[78]/$g[74]
				$g[78]=$g[75]*$g[78]
				$g[78]=$g[70]+$g[78]
				$g[85] = $g[73]-$g[70]
				$g[85]=$g[85]/$g[74]
				$g[85]=$g[76]*$g[85]
				$g[85]=$g[77]+$g[85]
				$g[86] = $g[72]-$g[69]
				$g[86]=$g[86]/$g[74]
				$g[86]=$g[76]*$g[86]
				$g[86]=$g[78]-$g[86]
				$g[81]=$g[73]-$g[70]
				$g[81]=$g[81]/$g[74]
				$g[81]=$g[76]*$g[81]
				$g[81]=$g[77]-$g[81]
				$g[82]=$g[72]-$g[69]
				$g[82]=$g[82]/$g[74]
				$g[82]=$g[76]*$g[82]
				$g[82]=$g[78]+$g[82]
				$g[83]=new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[39]-(dotRadius/2), $g[40]-(dotRadius/2), $g[85], $g[86], dotRadius, dotRadius, 0)
				if ($g[83].setOpacity(0, 50, 0, 1))
				return
				$pc = 54
			case 54:
				if ($g[83].setOpacity(1, 50, 1, 1))
				return
				$pc = 55
			case 55:
				if (wait(95))
				return
				$pc = 56
			case 56:
				$g[65].setOpacity(0, 50, 1, 0)
				$g[67].setOpacity(0, 50, 1, 0)
				$g[59].setOpacity(0, 50, 1, 0)
				if ($g[62].setOpacity(0, 50, 1, 1))
				return
				$pc = 57
			case 57:
				if (wait(50))
				return
				$pc = 58
			case 58:
				$g[87] = new Line($g[0], 0, 0, $g[35], $g[39], $g[40], $g[43], $g[44], 0, 0)
				if ($g[87].setPt(1, $g[85], $g[86], 50, 1, 1))
				return
				$pc = 59
			case 59:
				if (wait(95))
				return
				$pc = 60
			case 60:
				if ($g[83].setOpacity(0, 50, 1, 1))
				return
				$pc = 61
			case 61:
				if (wait(30))
				return
				$pc = 62
			case 62:
				$g[88] = (($g[79]*$g[42])-($g[41]*$g[80]))*($g[85]-$g[43])-(($g[85]*$g[44])-($g[43]*$g[86]))*($g[79]-$g[41])
				$g[88]=$g[88]/(($g[79]-$g[41])*($g[86]-$g[44])-($g[85]-$g[43])*($g[80]-$g[42]))
				$g[89] = ((($g[79]*$g[42])-($g[41]*$g[80]))*($g[86]-$g[44]))-((($g[85]*$g[44])-($g[43]*$g[86]))*($g[80]-$g[42]))
				$g[89]=$g[89]/((($g[79]-$g[41])*($g[86]-$g[44]))-(($g[85]-$g[43])*($g[80]-$g[42])))
				$g[90] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[39]-(dotRadius/2), $g[40]-(dotRadius/2), $g[88], $g[89], dotRadius, dotRadius, 0)
				if ($g[90].setOpacity(0, 50, 0, 1))
				return
				$pc = 63
			case 63:
				if ($g[90].setOpacity(1, 50, 0, 1))
				return
				$pc = 64
			case 64:
				if (wait(90))
				return
				$pc = 65
			case 65:
				$g[87].setOpacity(0, 50, 1, 0)
				if ($g[84].setOpacity(0, 50, 1, 1))
				return
				$pc = 66
			case 66:
				if (wait(50))
				return
				$pc = 67
			case 67:
				$g[91] = new Arc($g[0], 0, 0, $g[35], 0, $g[39], $g[40], $g[88], $g[89], 70, 70, 0, 0)
				if ($g[91].rotateSpanAngle(360, 50, 1, 1))
				return
				$pc = 68
			case 68:
				$g[92] = new Ellipse($g[0], 0, 0, $g[35], $g[37], $g[39]-(dotRadius/2), $g[40]-(dotRadius/2), 73, 0, dotRadius, dotRadius, 0)
				$g[93] = new Ellipse($g[0], 0, 0, $g[35], $g[37], $g[39]-(dotRadius/2), $g[40]-(dotRadius/2), 171, 0, dotRadius, dotRadius, 0)
				if (wait(90))
				return
				$pc = 69
			case 69:
				if ($g[91].setOpacity(0, 50, 1, 1))
				return
				$pc = 70
			case 70:
				if (wait(90))
				return
				$pc = 71
			case 71:
				$g[94] = new Arc($g[0], 0, 0, $g[35], 0, $g[39], $g[40], 73, 0, 90, 90, 270, 0)
				if ($g[94].rotateSpanAngle(180, 50, 1, 1))
				return
				$pc = 72
			case 72:
				if (wait(90))
				return
				$pc = 73
			case 73:
				$g[95] = new Arc($g[0], 0, 0, $g[35], 0, $g[39], $g[40], 171, 0, 90, 90, -90, 0)
				if ($g[95].rotateSpanAngle(-180, 50, 1, 1))
				return
				$pc = 74
			case 74:
				if (wait(90))
				return
				$pc = 75
			case 75:
				$g[68]=90
				$g[69]=73
				$g[70]=0
				$g[71]=90
				$g[72]=171
				$g[73]=0
				$g[74]=sqrt(pow(($g[72]-$g[69]), 2)+pow(($g[73]-$g[70]), 2))
				debug("d: %d", $g[74])
				$g[75]=pow($g[68], 2)
				debug("a: %d", $g[75])
				$g[75]=$g[75]-(pow($g[71], 2))
				debug("a: %d", $g[75])
				$g[75]=$g[75]+(pow($g[74], 2))
				$g[75]=$g[75]/(2*$g[74])
				debug("a: %d", $g[75])
				$g[76]=pow($g[68], 2)-pow($g[75], 2)
				debug("h: %d", $g[76])
				$g[76]=sqrt($g[76])
				debug("h: %d", $g[76])
				$g[77]=$g[72]-$g[69]
				debug("x2: %d", $g[77])
				$g[77]=$g[77]/$g[74]
				debug("x2: %d", $g[77])
				$g[77]=$g[75]*$g[77]
				debug("x2: %d", $g[77])
				$g[77]=$g[69]+$g[77]
				debug("x2: %d", $g[77])
				$g[78]=($g[73]-$g[70])
				debug("y2: %d", $g[78])
				$g[78]=$g[78]/$g[74]
				debug("y2: %d", $g[78])
				$g[78]=$g[75]*$g[78]
				debug("y2: %d", $g[78])
				$g[78]=$g[70]+$g[78]
				debug("y2: %d", $g[78])
				$g[96] = $g[73]-$g[70]
				debug("x3: %d", $g[96])
				$g[96]=$g[96]/$g[74]
				debug("x3: %d", $g[96])
				$g[96]=$g[76]*$g[96]
				debug("x3: %d", $g[96])
				$g[96]=$g[77]+$g[96]
				debug("x3: %d", $g[96])
				$g[97] = $g[72]-$g[69]
				debug("y3: %d", $g[97])
				$g[97]=$g[97]/$g[74]
				debug("y3: %d", $g[97])
				$g[97]=$g[76]*$g[97]
				debug("y3: %d", $g[97])
				$g[97]=$g[78]-$g[97]
				debug("y3: %d", $g[97])
				$g[81]=$g[73]-$g[70]
				debug("x4: %d", $g[81])
				$g[81]=$g[81]/$g[74]
				debug("x4: %d", $g[81])
				$g[81]=$g[76]*$g[81]
				debug("x4: %d", $g[81])
				$g[81]=$g[77]-$g[81]
				debug("x4: %d", $g[81])
				$g[82]=$g[72]-$g[69]
				debug("y4: %d", $g[82])
				$g[82]=$g[82]/$g[74]
				debug("y4: %d", $g[82])
				$g[82]=$g[76]*$g[82]
				debug("y4: %d", $g[82])
				$g[82]=$g[78]+$g[82]
				debug("y4: %d", $g[82])
				$g[98] = new Ellipse($g[0], 0, 0, $g[3], $g[18], $g[39]-(dotRadius/2), $g[40]-(dotRadius/2), $g[96], $g[97], dotRadius, dotRadius, 0)
				$g[99] = new Ellipse($g[0], 0, 0, $g[3], $g[18], $g[39]-(dotRadius/2), $g[40]-(dotRadius/2), $g[81], $g[82], dotRadius, dotRadius, 0)
				if (wait(90))
				return
				$pc = 76
			case 76:
				$g[94].setOpacity(0, 50, 1, 0)
				$g[92].setOpacity(0, 50, 1, 0)
				$g[93].setOpacity(0, 50, 1, 0)
				if ($g[95].setOpacity(0, 50, 1, 1))
				return
				$pc = 77
			case 77:
				if (wait(90))
				return
				$pc = 78
			case 78:
				$g[100] = new Line($g[0], 0, 0, $g[1], $g[39], $g[40], $g[96], $g[97]-20, 0, 0)
				if ($g[100].setPt(1, $g[81], $g[82]+20, 50, 1, 1))
				return
				$pc = 79
			case 79:
				$g[101] = new Ellipse($g[0], 0, 0, $g[3], $g[18], $g[39]-(dotRadius/2), $g[40]-(dotRadius/2), $g[88], $g[42], dotRadius, dotRadius, 0)
				if (wait(90))
				return
				$pc = 80
			case 80:
				$g[100].setOpacity(0, 50, 1, 0)
				$g[98].setOpacity(0, 50, 1, 0)
				if ($g[99].setOpacity(0, 50, 1, 1))
				return
				$pc = 81
			case 81:
				if (wait(90))
				return
				$pc = 82
			case 82:
				$g[102] = new Arc($g[0], 0, 0, $g[1], 0, $g[39], $g[40], $g[88], $g[89], $g[89], $g[89], 180+90, 0)
				if ($g[102].rotateSpanAngle(360, 50, 1, 1))
				return
				$pc = 83
			case 83:
				if (wait(90))
				return
				$pc = 84
			case 84:
				if ($g[101].setOpacity(0, 50, 1, 1))
				return
				$pc = 85
			case 85:
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
