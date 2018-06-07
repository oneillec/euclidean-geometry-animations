"use strict"

function multiplication_constructible_numbers(vplayer) {

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
	const aLength = 150
	const bLength = 150
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
				$g[32] = new Rectangle2($g[0], 0, W/2|VCENTRE, 0, 0, W/2-25, H/2-300, 200, 50, $g[1], 0)
				$g[32].setTxt("Multiplication - Constructible Numbers", 0)
				$g[33] = (W/2)-150
				$g[34] = H/2+100
				$g[35] = 0
				$g[36] = 0
				$g[37] = $g[35]+aLength
				$g[38] = $g[36]
				$g[39] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[33]-(dotRadius/2), $g[34]-(dotRadius/2), $g[35], $g[35], dotRadius, dotRadius, 0)
				if (wait(90))
				return
				$pc = 1
			case 1:
				$g[40] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[33]+$g[35], $g[34]+$g[36], 0, 30, $g[1], $g[31])
				$g[40].setTxt("O", 0)
				if (wait(90))
				return
				$pc = 2
			case 2:
				$g[41] = new Line($g[0], 0, 0, $g[1], $g[33], $g[34], $g[35], $g[36], 0, 0)
				if ($g[41].setPt(1, ($g[37]+200), $g[38], 50, 1, 1))
				return
				$pc = 3
			case 3:
				if (wait(90))
				return
				$pc = 4
			case 4:
				$g[42] = new Line($g[0], 0, 0, $g[1], $g[33], $g[34], $g[35], $g[36], 0, 0)
				if ($g[42].setPt(1, ($g[37]+100), ($g[38]-200), 50, 1, 1))
				return
				$pc = 5
			case 5:
				if (wait(90))
				return
				$pc = 6
			case 6:
				$g[43] = new Arc($g[0], 0, 0, $g[1], 0, $g[33], $g[34], $g[35], $g[36], unitLength, unitLength, 360-70, 0)
				if ($g[43].rotateSpanAngle(60, 50, 1, 1))
				return
				$pc = 7
			case 7:
				$g[44] = 78
				$g[45] = -62
				$g[46] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[33]-(dotRadius/2), $g[34]-(dotRadius/2), $g[44], $g[45], dotRadius, dotRadius, 0)
				if (wait(90))
				return
				$pc = 8
			case 8:
				if ($g[43].setOpacity(0, 50, 1, 1))
				return
				$pc = 9
			case 9:
				$g[47] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[33]+$g[44], $g[34]+$g[45], 0, -30, $g[1], $g[31])
				$g[47].setTxt("P", 0)
				$g[48] = ($g[35]+$g[44])/2
				$g[49] = ($g[36]+$g[45])/2
				$g[50] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[33]+$g[48], $g[34]+$g[49], -10, -20, $g[1], $g[31])
				$g[50].setTxt("1", 0)
				if (wait(90))
				return
				$pc = 10
			case 10:
				$g[51] = new Arc($g[0], 0, 0, $g[1], 0, $g[33], $g[34], $g[35], $g[36], aLength, aLength, 360-30, 0)
				if ($g[51].rotateSpanAngle(60, 50, 1, 1))
				return
				$pc = 11
			case 11:
				$g[52] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[33]-(dotRadius/2), $g[34]-(dotRadius/2), $g[37], $g[38], dotRadius, dotRadius, 0)
				if (wait(90))
				return
				$pc = 12
			case 12:
				if ($g[51].setOpacity(0, 50, 1, 1))
				return
				$pc = 13
			case 13:
				$g[53] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[33]+$g[37], $g[34]+$g[38], 0, 30, $g[1], $g[31])
				$g[53].setTxt("A", 0)
				$g[54] = ($g[35]+$g[36])/2
				$g[55] = ($g[37]+$g[38])/2
				$g[56] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[33]+$g[35]+75, $g[34]+$g[36], 0, 30, $g[1], $g[31])
				$g[56].setTxt("a", 0)
				if (wait(90))
				return
				$pc = 14
			case 14:
				$g[57] = new Arc($g[0], 0, 0, $g[1], 0, $g[33], $g[34], $g[44], $g[45], unitLength, unitLength, 360-70, 0)
				if ($g[57].rotateSpanAngle(60, 50, 1, 1))
				return
				$pc = 15
			case 15:
				$g[58] = 156
				$g[59] = -125
				$g[60] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[33]-(dotRadius/2), $g[34]-(dotRadius/2), $g[58], $g[59], dotRadius, dotRadius, 0)
				if (wait(90))
				return
				$pc = 16
			case 16:
				if ($g[57].setOpacity(0, 50, 1, 1))
				return
				$pc = 17
			case 17:
				$g[61] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[33]+$g[58], $g[34]+$g[59], 0, -30, $g[1], $g[31])
				$g[61].setTxt("B", 0)
				if (wait(90))
				return
				$pc = 18
			case 18:
				$g[62] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[33]+$g[44], $g[34]+$g[45], -30, -95, $g[1], $g[31])
				$g[62].setTxt("|OB| = b", 0)
				if (wait(90))
				return
				$pc = 19
			case 19:
				$g[62].setOpacity(0, 1, 1, 0)
				$g[63] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[33]+$g[44], $g[34]+$g[45], -30, -95, $g[3], $g[31])
				$g[63].setTxt("|OB| = b", 0)
				$g[60].setOpacity(0, 1, 1, 0)
				$g[64] = new Ellipse($g[0], 0, 0, $g[3], $g[18], $g[33]-(dotRadius/2), $g[34]-(dotRadius/2), $g[58], $g[59], dotRadius, dotRadius, 0)
				$g[39].setOpacity(0, 1, 1, 0)
				$g[65] = new Ellipse($g[0], 0, 0, $g[3], $g[18], $g[33]-(dotRadius/2), $g[34]-(dotRadius/2), $g[35], $g[35], dotRadius, dotRadius, 0)
				if (wait(90))
				return
				$pc = 20
			case 20:
				$g[63].setOpacity(0, 1, 1, 0)
				$g[62].setOpacity(100, 1, 1, 0)
				$g[64].setOpacity(0, 1, 1, 0)
				$g[60].setOpacity(100, 1, 1, 0)
				$g[65].setOpacity(0, 1, 1, 0)
				if ($g[39].setOpacity(100, 1, 1, 1))
				return
				$pc = 21
			case 21:
				if (wait(90))
				return
				$pc = 22
			case 22:
				$g[62].setOpacity(0, 50, 1, 0)
				$g[66] = new Arc($g[0], 0, 0, $g[1], 0, $g[33], $g[34], $g[58], $g[59], 115, 115, 0, 0)
				if ($g[66].rotateSpanAngle(360, 50, 1, 1))
				return
				$pc = 23
			case 23:
				if (wait(90))
				return
				$pc = 24
			case 24:
				$g[67] = $g[37]-$g[44]
				$g[68] = $g[38]-$g[45]
				$g[69] = pow($g[67], 2)
				$g[69]=$g[69]+pow($g[68], 2)
				$g[69]=sqrt($g[69])
				$g[70] = $g[44]+($g[44]-$g[37])/$g[69]*$g[69]
				$g[71] = $g[45]+($g[45]-$g[38])/$g[69]*$g[69]
				$g[72] = new Line($g[0], 0, 0, $g[1], $g[33], $g[34], $g[37], $g[38], 0, 0)
				if ($g[72].setPt(0, $g[70], $g[71], 50, 1, 1))
				return
				$pc = 25
			case 25:
				$g[73] = 137
				$g[74] = -12
				$g[75] = 47
				$g[76] = -89
				$g[77] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[33]-(dotRadius/2), $g[34]-(dotRadius/2), $g[73], $g[74], dotRadius, dotRadius, 0)
				$g[78] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[33]-(dotRadius/2), $g[34]-(dotRadius/2), $g[75], $g[76], dotRadius, dotRadius, 0)
				if (wait(90))
				return
				$pc = 26
			case 26:
				if ($g[66].setOpacity(0, 50, 1, 1))
				return
				$pc = 27
			case 27:
				if (wait(90))
				return
				$pc = 28
			case 28:
				$g[79] = new Arc($g[0], 0, 0, $g[5], 0, $g[33], $g[34], $g[73], $g[74], 70, 70, 135, 0)
				if ($g[79].rotateSpanAngle(180, 50, 1, 1))
				return
				$pc = 29
			case 29:
				if (wait(90))
				return
				$pc = 30
			case 30:
				$g[80] = new Arc($g[0], 0, 0, $g[5], 0, $g[33], $g[34], $g[75], $g[76], 70, 70, 310, 0)
				if ($g[80].rotateSpanAngle(180, 50, 1, 1))
				return
				$pc = 31
			case 31:
				$g[81] = 70
				$g[82] = $g[73]
				$g[83] = $g[74]
				$g[84] = 70
				$g[85] = $g[75]
				$g[86] = $g[76]
				$g[87] = sqrt(pow(($g[85]-$g[82]), 2)+pow(($g[86]-$g[83]), 2))
				$g[88] = pow($g[81], 2)
				$g[88]=$g[88]-(pow($g[84], 2))
				$g[88]=$g[88]+(pow($g[87], 2))
				$g[88]=$g[88]/(2*$g[87])
				$g[89] = pow($g[81], 2)-pow($g[88], 2)
				$g[89]=sqrt($g[89])
				$g[90] = $g[85]-$g[82]
				$g[90]=$g[90]/$g[87]
				$g[90]=$g[88]*$g[90]
				$g[90]=$g[82]+$g[90]
				$g[91] = ($g[86]-$g[83])
				$g[91]=$g[91]/$g[87]
				$g[91]=$g[88]*$g[91]
				$g[91]=$g[83]+$g[91]
				$g[92] = $g[86]-$g[83]
				$g[92]=$g[92]/$g[87]
				$g[92]=$g[89]*$g[92]
				$g[92]=$g[90]+$g[92]
				$g[93] = $g[85]-$g[82]
				$g[93]=$g[93]/$g[87]
				$g[93]=$g[89]*$g[93]
				$g[93]=$g[91]-$g[93]
				$g[94] = $g[86]-$g[83]
				$g[94]=$g[94]/$g[87]
				$g[94]=$g[89]*$g[94]
				$g[94]=$g[90]-$g[94]
				$g[95] = $g[85]-$g[82]
				$g[95]=$g[95]/$g[87]
				$g[95]=$g[89]*$g[95]
				$g[95]=$g[91]+$g[95]
				$g[96] = new Ellipse($g[0], 0, 0, $g[5], $g[20], $g[33]-(dotRadius/2), $g[34]-(dotRadius/2), $g[92], $g[93], dotRadius, dotRadius, 0)
				$g[97] = new Ellipse($g[0], 0, 0, $g[5], $g[20], $g[33]-(dotRadius/2), $g[34]-(dotRadius/2), $g[94], $g[95], dotRadius, dotRadius, 0)
				if (wait(90))
				return
				$pc = 32
			case 32:
				$g[98] = new Line($g[0], 0, 0, $g[5], $g[33], $g[34], $g[92], $g[93], 0, 0)
				if ($g[98].setPt(1, $g[94], $g[95], 50, 1, 1))
				return
				$pc = 33
			case 33:
				$g[99] = (($g[70]*$g[38])-($g[37]*$g[71]))*($g[94]-$g[92])-((($g[94]*$g[93])-($g[92]*$g[95]))*($g[70]-$g[37]))
				$g[99]=$g[99]/((($g[70]-$g[37])*($g[95]-$g[93]))-(($g[94]-$g[92])*($g[71]-$g[38])))
				$g[100] = ((($g[70]*$g[38])-($g[37]*$g[71]))*($g[95]-$g[93]))-((($g[94]*$g[93])-($g[92]*$g[95]))*($g[71]-$g[38]))
				$g[100]=$g[100]/((($g[70]-$g[37])*($g[95]-$g[93]))-(($g[94]-$g[92])*($g[71]-$g[38])))
				$g[101] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[33]-(dotRadius/2), $g[34]-(dotRadius/2), $g[99], $g[100], dotRadius, dotRadius, 0)
				if (wait(90))
				return
				$pc = 34
			case 34:
				$g[102] = new Line($g[0], 0, 0, $g[1], $g[33], $g[34], $g[44], $g[45], $g[37]-$g[44], $g[38]-$g[45])
				$g[77].setOpacity(0, 50, 1, 0)
				$g[78].setOpacity(0, 50, 1, 0)
				$g[79].setOpacity(0, 50, 1, 0)
				$g[80].setOpacity(0, 50, 1, 0)
				$g[96].setOpacity(0, 50, 1, 0)
				$g[97].setOpacity(0, 50, 1, 0)
				$g[72].setOpacity(0, 50, 1, 0)
				if ($g[98].setOpacity(0, 50, 1, 1))
				return
				$pc = 35
			case 35:
				if (wait(90))
				return
				$pc = 36
			case 36:
				$g[103] = sqrt(pow($g[58]-$g[99], 2)+pow($g[59]-$g[100], 2))
				$g[104] = $g[58]+($g[58]-$g[99])/$g[103]*($g[103]+50)
				$g[105] = $g[59]+($g[59]-$g[100])/$g[103]*($g[103]+50)
				$g[106] = new Line($g[0], 0, 0, $g[1], $g[33], $g[34], $g[99], $g[100], 0, 0)
				if ($g[106].setPt(0, $g[104], $g[105], 50, 1, 1))
				return
				$pc = 37
			case 37:
				if (wait(90))
				return
				$pc = 38
			case 38:
				$g[107] = new Arc($g[0], 0, 0, $g[1], 0, $g[33], $g[34], $g[58], $g[59], $g[103], $g[103], 280, 0)
				if ($g[107].rotateSpanAngle(60, 50, 1, 1))
				return
				$pc = 39
			case 39:
				$g[108] = 220
				$g[109] = -200
				$g[110] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[33]-(dotRadius/2), $g[34]-(dotRadius/2), $g[108], $g[109], dotRadius, dotRadius, 0)
				if ($g[107].setOpacity(0, 50, 1, 1))
				return
				$pc = 40
			case 40:
				if (wait(90))
				return
				$pc = 41
			case 41:
				$g[111] = new Arc($g[0], 0, 0, $g[1], 0, $g[33], $g[34], $g[99], $g[100], 130, 130, 225, 0)
				if ($g[111].rotateSpanAngle(180, 50, 1, 1))
				return
				$pc = 42
			case 42:
				if (wait(90))
				return
				$pc = 43
			case 43:
				$g[112] = new Arc($g[0], 0, 0, $g[1], 0, $g[33], $g[34], $g[108], $g[109], 130, 130, 30, 0)
				if ($g[112].rotateSpanAngle(180, 50, 1, 1))
				return
				$pc = 44
			case 44:
				$g[81]=130
				$g[82]=$g[99]
				$g[83]=$g[100]
				$g[84]=130
				$g[85]=$g[108]
				$g[86]=$g[109]
				$g[87]=sqrt(pow(($g[85]-$g[82]), 2)+pow(($g[86]-$g[83]), 2))
				$g[88]=pow($g[81], 2)
				$g[88]=$g[88]-(pow($g[84], 2))
				$g[88]=$g[88]+(pow($g[87], 2))
				$g[88]=$g[88]/(2*$g[87])
				$g[89]=pow($g[81], 2)-pow($g[88], 2)
				$g[89]=sqrt($g[89])
				$g[90]=$g[85]-$g[82]
				$g[90]=$g[90]/$g[87]
				$g[90]=$g[88]*$g[90]
				$g[90]=$g[82]+$g[90]
				$g[91]=($g[86]-$g[83])
				$g[91]=$g[91]/$g[87]
				$g[91]=$g[88]*$g[91]
				$g[91]=$g[83]+$g[91]
				$g[113] = $g[86]-$g[83]
				$g[113]=$g[113]/$g[87]
				$g[113]=$g[89]*$g[113]
				$g[113]=$g[90]+$g[113]
				$g[114] = $g[85]-$g[82]
				$g[114]=$g[114]/$g[87]
				$g[114]=$g[89]*$g[114]
				$g[114]=$g[91]-$g[114]
				$g[115] = $g[86]-$g[83]
				$g[115]=$g[115]/$g[87]
				$g[115]=$g[89]*$g[115]
				$g[115]=$g[90]-$g[115]
				$g[116] = $g[85]-$g[82]
				$g[116]=$g[116]/$g[87]
				$g[116]=$g[89]*$g[116]
				$g[116]=$g[91]+$g[116]
				$g[117] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[33]-(dotRadius/2), $g[34]-(dotRadius/2), $g[113], $g[114], dotRadius, dotRadius, 0)
				$g[118] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[33]-(dotRadius/2), $g[34]-(dotRadius/2), $g[115], $g[116], dotRadius, dotRadius, 0)
				if (wait(90))
				return
				$pc = 45
			case 45:
				$g[119] = sqrt(pow($g[113]-$g[115], 2)+pow($g[114]-$g[116], 2))
				$g[115]=$g[115]+($g[115]-$g[113])/$g[119]*$g[119]
				$g[116]=$g[116]+($g[116]-$g[114])/$g[119]*$g[119]
				$g[120] = (($g[115]*$g[114])-($g[113]*$g[116]))*(($g[37]+200)-$g[35])-((($g[37]+200)*$g[36])-($g[35]*$g[38]))*($g[115]-$g[113])
				$g[120]=$g[120]/(($g[115]-$g[113])*($g[38]-$g[36])-(($g[37]+200)-$g[35])*($g[116]-$g[114]))
				debug("pointQx%d", $g[120])
				$g[121] = ((($g[115]*$g[114])-($g[113]*$g[116]))*($g[38]-$g[36]))-(((($g[37]+200)*$g[36])-($g[35]*$g[38]))*($g[116]-$g[114]))
				$g[121]=$g[121]/((($g[115]-$g[113])*($g[38]-$g[36]))-((($g[37]+200)-$g[35])*($g[116]-$g[114])))
				$g[122] = new Line($g[0], 0, 0, $g[1], $g[33], $g[34], $g[113], $g[114], 0, 0)
				if ($g[122].setPt(0, $g[120], $g[121], 50, 1, 1))
				return
				$pc = 46
			case 46:
				$g[123] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[33]-(dotRadius/2), $g[34]-(dotRadius/2), $g[120], $g[121], dotRadius, dotRadius, 0)
				$g[124] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[33]+$g[120], $g[34]+$g[121], 0, 30, $g[1], $g[31])
				$g[124].setTxt("Q", 0)
				$g[125] = new Line($g[0], 0, 0, $g[1], $g[33], $g[34], $g[58], $g[59], $g[120]-$g[58], $g[121]-$g[59])
				$g[62].setOpacity(100, 50, 1, 0)
				$g[122].setOpacity(0, 50, 1, 0)
				$g[106].setOpacity(0, 50, 1, 0)
				$g[111].setOpacity(0, 50, 1, 0)
				$g[112].setOpacity(0, 50, 1, 0)
				$g[110].setOpacity(0, 50, 1, 0)
				$g[101].setOpacity(0, 50, 1, 0)
				$g[117].setOpacity(0, 50, 1, 0)
				if ($g[118].setOpacity(0, 50, 1, 1))
				return
				$pc = 47
			case 47:
				if (wait(90))
				return
				$pc = 48
			case 48:
				$g[126] = new Rectangle2($g[0], 0, W/2|VCENTRE, 0, 0, $g[33]+$g[58]-300, $g[34]-200, 200, 50, $g[3], $g[31])
				$g[126].setTxt("Triangle OPA is similar to OBQ", 0)
				if (wait(180))
				return
				$pc = 49
			case 49:
				$g[127] = new Rectangle2($g[0], 0, HLEFT, 0, 0, $g[33]+$g[58]+250, $g[34]-200, 200, 50, $g[3], $g[31])
				$g[127].setTxt("1/a = b/|OQ|", 0)
				$g[128] = new Rectangle2($g[0], 0, HLEFT, 0, 0, $g[33]+$g[58]+250, $g[34]-150, 200, 50, $g[3], $g[31])
				$g[128].setTxt("ab = |OQ|", 0)
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
