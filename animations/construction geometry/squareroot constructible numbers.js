"use strict"

function squareroot_constructible_numbers(vplayer) {

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
	var setViewport = vplayer.setViewport
	var SolidBrush = vplayer.SolidBrush
	var SolidPen = vplayer.SolidPen
	var sqrt = vplayer.sqrt
	var terminateThread = vplayer.terminateThread

	const W = 1024
	const H = 620
	const dotRadius = 5
	const aLength = 180
	const unitLength = 120

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
				$g[36].setTxt("Square Root - Constructible Numbers", 0)
				$g[37] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[32]-(dotRadius/2), $g[33]-(dotRadius/2), $g[34], $g[34], dotRadius, dotRadius, 0)
				$g[38] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[32]+$g[34], $g[33]+$g[35], 0, 30, $g[1], $g[31])
				$g[38].setTxt("O", 0)
				if (wait(90))
				return
				$pc = 1
			case 1:
				$g[39] = new Line($g[0], 0, 0, $g[1], $g[32], $g[33], $g[34], $g[35], 0, 0)
				if ($g[39].setPt(1, (aLength+50), $g[35], 50, 1, 1))
				return
				$pc = 2
			case 2:
				if (wait(90))
				return
				$pc = 3
			case 3:
				$g[40] = new Arc($g[0], 0, 0, $g[1], 0, $g[32], $g[33], $g[34], $g[35], aLength, aLength, 360-30, 0)
				if ($g[40].rotateSpanAngle(60, 50, 1, 1))
				return
				$pc = 4
			case 4:
				$g[41] = aLength
				$g[42] = $g[35]
				$g[43] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[32]-(dotRadius/2), $g[33]-(dotRadius/2), $g[41], $g[42], dotRadius, dotRadius, 0)
				if (wait(90))
				return
				$pc = 5
			case 5:
				$g[40].setOpacity(0, 50, 1, 0)
				$g[44] = new Line($g[0], 0, 0, $g[1], $g[32], $g[33], $g[34], $g[35], $g[34]+$g[41], $g[35]+$g[42], 0)
				if ($g[39].setOpacity(0, 50, 1, 1))
				return
				$pc = 6
			case 6:
				$g[45] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[32]+$g[41], $g[33]+$g[42], 0, 30, $g[1], $g[31])
				$g[45].setTxt("A", 0)
				$g[46] = ($g[34]+$g[41])/2
				$g[47] = ($g[35]+$g[42])/2
				$g[48] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[32]+$g[46], $g[33]+$g[47], 0, 30, $g[1], $g[31])
				$g[48].setTxt("a", 0)
				if (wait(90))
				return
				$pc = 7
			case 7:
				$g[49] = $g[34]-unitLength
				$g[50] = $g[35]
				$g[51] = new Line($g[0], 0, 0, $g[1], $g[32], $g[33], $g[34], $g[35], 0, 0)
				if ($g[51].setPt(1, ($g[49]-50), $g[50], 50, 1, 1))
				return
				$pc = 8
			case 8:
				$g[52] = new Arc($g[0], 0, 0, $g[1], 0, $g[32], $g[33], $g[34], $g[35], unitLength, unitLength, 330-180, 0)
				if ($g[52].rotateSpanAngle(60, 50, 1, 1))
				return
				$pc = 9
			case 9:
				$g[53] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[32]-(dotRadius/2), $g[33]-(dotRadius/2), $g[49], $g[50], dotRadius, dotRadius, 0)
				if (wait(90))
				return
				$pc = 10
			case 10:
				$g[52].setOpacity(0, 50, 1, 0)
				$g[54] = new Line($g[0], 0, 0, $g[1], $g[32], $g[33], $g[34], $g[35], $g[34]+$g[49], $g[35]+$g[50], 0)
				if ($g[51].setOpacity(0, 50, 1, 1))
				return
				$pc = 11
			case 11:
				$g[55] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[32]+$g[49], $g[33]+$g[50], 0, 30, $g[1], $g[31])
				$g[55].setTxt("P", 0)
				$g[56] = ($g[34]+$g[49])/2
				$g[57] = ($g[35]+$g[50])/2
				$g[58] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[32]+$g[56], $g[33]+$g[57], 0, 30, $g[1], $g[31])
				$g[58].setTxt("1", 0)
				if (wait(90))
				return
				$pc = 12
			case 12:
				$g[59] = new Arc($g[0], 0, 0, $g[1], 0, $g[32], $g[33], $g[49], $g[50], ((aLength+unitLength)/2)+20, ((aLength+unitLength)/2)+20, 270, 0)
				if ($g[59].rotateSpanAngle(180, 50, 1, 1))
				return
				$pc = 13
			case 13:
				if (wait(90))
				return
				$pc = 14
			case 14:
				$g[60] = new Arc($g[0], 0, 0, $g[1], 0, $g[32], $g[33], $g[41], $g[42], ((aLength+unitLength)/2)+20, ((aLength+unitLength)/2)+20, -90, 0)
				if ($g[60].rotateSpanAngle(-180, 50, 1, 1))
				return
				$pc = 15
			case 15:
				$g[61] = ((aLength+unitLength)/2)+20
				$g[62] = $g[49]
				$g[63] = $g[50]
				$g[64] = ((aLength+unitLength)/2)+20
				$g[65] = $g[41]
				$g[66] = $g[42]
				$g[67] = sqrt(pow(($g[65]-$g[62]), 2)+pow(($g[66]-$g[63]), 2))
				$g[68] = pow($g[61], 2)
				$g[68]=$g[68]-(pow($g[64], 2))
				$g[68]=$g[68]+(pow($g[67], 2))
				$g[68]=$g[68]/(2*$g[67])
				$g[69] = pow($g[61], 2)-pow($g[68], 2)
				$g[69]=sqrt($g[69])
				$g[70] = $g[65]-$g[62]
				$g[70]=$g[70]/$g[67]
				$g[70]=$g[68]*$g[70]
				$g[70]=$g[62]+$g[70]
				$g[71] = ($g[66]-$g[63])
				$g[71]=$g[71]/$g[67]
				$g[71]=$g[68]*$g[71]
				$g[71]=$g[63]+$g[71]
				$g[72] = $g[66]-$g[63]
				$g[72]=$g[72]/$g[67]
				$g[72]=$g[69]*$g[72]
				$g[72]=$g[70]+$g[72]
				$g[73] = $g[65]-$g[62]
				$g[73]=$g[73]/$g[67]
				$g[73]=$g[69]*$g[73]
				$g[73]=$g[71]-$g[73]
				$g[74] = $g[66]-$g[63]
				$g[74]=$g[74]/$g[67]
				$g[74]=$g[69]*$g[74]
				$g[74]=$g[70]-$g[74]
				$g[75] = $g[65]-$g[62]
				$g[75]=$g[75]/$g[67]
				$g[75]=$g[69]*$g[75]
				$g[75]=$g[71]+$g[75]
				$g[76] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[32]-(dotRadius/2), $g[33]-(dotRadius/2), $g[72], $g[73], dotRadius, dotRadius, 0)
				$g[77] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[32]-(dotRadius/2), $g[33]-(dotRadius/2), $g[74], $g[75], dotRadius, dotRadius, 0)
				if (wait(90))
				return
				$pc = 16
			case 16:
				$g[78] = new Line($g[0], 0, 0, $g[1], $g[32], $g[33], $g[72], $g[73], 0, 0)
				if ($g[78].setPt(1, $g[74], $g[75], 50, 1, 1))
				return
				$pc = 17
			case 17:
				$g[79] = (($g[41]*$g[50])-($g[49]*$g[42]))*($g[74]-$g[72])-((($g[74]*$g[73])-($g[72]*$g[75]))*($g[41]-$g[49]))
				$g[79]=$g[79]/((($g[41]-$g[49])*($g[75]-$g[73]))-(($g[74]-$g[72])*($g[42]-$g[50])))
				$g[80] = ((($g[41]*$g[50])-($g[49]*$g[42]))*($g[75]-$g[73]))-((($g[74]*$g[73])-($g[72]*$g[75]))*($g[42]-$g[50]))
				$g[80]=$g[80]/((($g[41]-$g[49])*($g[75]-$g[73]))-(($g[74]-$g[72])*($g[42]-$g[50])))
				$g[81] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[32]-(dotRadius/2), $g[33]-(dotRadius/2), $g[79], $g[80], dotRadius, dotRadius, 0)
				if (wait(90))
				return
				$pc = 18
			case 18:
				$g[59].setOpacity(0, 50, 1, 0)
				$g[60].setOpacity(0, 50, 1, 0)
				$g[76].setOpacity(0, 50, 1, 0)
				$g[77].setOpacity(0, 50, 1, 0)
				if ($g[78].setOpacity(0, 50, 1, 1))
				return
				$pc = 19
			case 19:
				if (wait(90))
				return
				$pc = 20
			case 20:
				$g[82] = sqrt(pow($g[49]-$g[79], 2)+pow($g[50]-$g[80], 2))
				$g[83] = new Arc($g[0], 0, 0, $g[1], 0, $g[32], $g[33], $g[79], $g[80], $g[82], $g[82], 180, 0)
				if ($g[83].rotateSpanAngle(180, 50, 1, 1))
				return
				$pc = 21
			case 21:
				if (wait(90))
				return
				$pc = 22
			case 22:
				if ($g[81].setOpacity(0, 50, 1, 1))
				return
				$pc = 23
			case 23:
				if (wait(90))
				return
				$pc = 24
			case 24:
				debug("perpendIntersectX: %d", $g[79])
				debug("perpendIntersectY: %d", $g[80])
				debug("semicircleRadius: %d", $g[82])
				$g[84] = 0
				$g[85] = -147
				$g[86] = new Line($g[0], 0, 0, $g[1], $g[32], $g[33], $g[34], $g[35], 0, 0)
				if ($g[86].setPt(1, $g[84], $g[85], 50, 1, 1))
				return
				$pc = 25
			case 25:
				$g[87] = new Ellipse($g[0], 0, 0, $g[1], $g[16], $g[32]-(dotRadius/2), $g[33]-(dotRadius/2), $g[84], $g[85], dotRadius, dotRadius, 0)
				$g[88] = new Rectangle2($g[0], 0, VCENTRE, 0, 0, $g[32]+$g[84], $g[33]+$g[85], 0, -30, $g[1], $g[31])
				$g[88].setTxt("Q", 0)
				if (wait(90))
				return
				$pc = 26
			case 26:
				$g[89] = new Line($g[0], 0, 0, $g[1], $g[32], $g[33], $g[84], $g[85], 0, 0)
				if ($g[89].setPt(1, $g[49], $g[50], 50, 1, 1))
				return
				$pc = 27
			case 27:
				if (wait(90))
				return
				$pc = 28
			case 28:
				$g[90] = new Line($g[0], 0, 0, $g[1], $g[32], $g[33], $g[84], $g[85], 0, 0)
				if ($g[90].setPt(1, $g[41], $g[42], 50, 1, 1))
				return
				$pc = 29
			case 29:
				$g[91] = new Rectangle2($g[0], 0, W/2|VCENTRE, 0, 0, $g[32]+230, $g[33]-200, 200, 50, $g[3], $g[31])
				$g[91].setTxt("Triangle OPQ is similar to OQA.", 0)
				if (wait(150))
				return
				$pc = 30
			case 30:
				$g[92] = new Rectangle2($g[0], 0, W/2|VCENTRE, 0, 0, $g[32]+230, $g[33]-170, 200, 50, $g[3], $g[31])
				$g[92].setTxt("|OQ|/|OA| = |OP|/|OQ|", 0)
				if (wait(150))
				return
				$pc = 31
			case 31:
				$g[93] = new Rectangle2($g[0], 0, W/2|VCENTRE, 0, 0, $g[32]+230, $g[33]-140, 200, 50, $g[3], $g[31])
				$g[93].setTxt("|OQ|\u00B2 = (|OP|)(|OA|)", 0)
				if (wait(150))
				return
				$pc = 32
			case 32:
				$g[94] = new Rectangle2($g[0], 0, W/2|VCENTRE, 0, 0, $g[32]+230, $g[33]-110, 200, 50, $g[3], $g[31])
				$g[94].setTxt("|OQ|\u00B2 = a", 0)
				if (wait(150))
				return
				$pc = 33
			case 33:
				$g[95] = new Rectangle2($g[0], 0, W/2|VCENTRE, 0, 0, $g[32]+230, $g[33]-80, 200, 50, $g[5], $g[31])
				$g[95].setTxt("\u221A(a) = |OQ|", 0)
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
