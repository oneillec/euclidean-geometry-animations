"use strict"

function MESI(vplayer) {

	const ARROW60_END = vplayer.ARROW60_END
	const ARROW60_START = vplayer.ARROW60_START
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
	const JUSTIFY = vplayer.JUSTIFY
	const MAGENTA = vplayer.MAGENTA
	const MB_CTRL = vplayer.MB_CTRL
	const MB_LEFT = vplayer.MB_LEFT
	const PROPAGATE = vplayer.PROPAGATE
	const RED = vplayer.RED
	const REMEMBER = vplayer.REMEMBER
	const ROUND_END = vplayer.ROUND_END
	const SMALLCAPS = vplayer.SMALLCAPS
	const VCENTRE = vplayer.VCENTRE
	const VTOP = vplayer.VTOP
	const WHITE = vplayer.WHITE
	const YELLOW = vplayer.YELLOW

	var $g = vplayer.$g
	var addWaitToEventQ = vplayer.addWaitToEventQ
	var checkPoint = vplayer.checkPoint
	var Font = vplayer.Font
	var fork = vplayer.fork
	var getURL = vplayer.getURL
	var Group = vplayer.Group
	var Line2 = vplayer.Line2
	var newArray = vplayer.newArray
	var Rectangle = vplayer.Rectangle
	var Rectangle2 = vplayer.Rectangle2
	var reset = vplayer.reset
	var rgba = vplayer.rgba
	var setBgBrush = vplayer.setBgBrush
	var setTPS = vplayer.setTPS
	var setViewport = vplayer.setViewport
	var SolidBrush = vplayer.SolidBrush
	var SolidPen = vplayer.SolidPen
	var sprintf = vplayer.sprintf
	var start = vplayer.start
	var terminateThread = vplayer.terminateThread
	var Txt = vplayer.Txt
	var VObj = vplayer.VObj

	const W = 1024
	const H = 640
	const TITLEX = 10
	const TITLEY = 10
	const TITLEH = 40
	const BY = 10
	const BW = 100
	const BH = 30
	const INFOX = TITLEX
	const INFOY = 60
	const INFOW = 350
	const INFOH = 150
	const MEMY = 50
	const MEMW = 180
	const MEMH = 120
	const ABUSY = 290
	const ABUSW = 12
	const DBUSY = 250
	const DBUSW = 12
	const SBUSY = 330
	const SBUSW = 8
	const CACHEY = 380
	const CACHEW = MEMW
	const CACHEH = 60
	const CPUY = 500
	const CPUW = CACHEW
	const CPUH = MEMH
	const BUSOPY = 208
	const NCPU = 3
	const NADDR = 4
	const NSET = 2
	const TICKS = 20
	const INVALID = 0
	const SHARED = 1
	const EXCLUSIVE = 2
	const MODIFIED = 3
	const bgap = 3
	const bw = (CPUW-3*bgap)/2
	const bh = (CPUH-(NADDR+1)*bgap)/NADDR

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

	function SimpleButton($grp, x, y, w, h, _b0, _b1, p0, _p1, txtpen, _f1, _f2, txt) {
		Group.call(this, $grp, 0, 0, x, y, 0, 0, w, h)
		this.b0 = _b0
		this.b1 = _b1
		this.p1 = _p1
		this.f1 = _f1
		this.f2 = _f2
		this.enabled = 1
		this.setPen(p0)
		this.setBrush(this.b0)
		this.setTxtPen(txtpen)
		this.setFont(this.f1)
		this.setTxt(txt)
		this.setRounded(4, 4)
		this.buttonFG = new Rectangle2(this, 0, 0, 0, 0, 1, 1, w-2, h-2)
		this.buttonFG.setRounded(4, 4)
		this.addEventHandler("eventEE", this, this.$eh0)
		this.addEventHandler("eventMB", this, this.$eh1)
	}
	SimpleButton.prototype = Object.create(Group.prototype)

	SimpleButton.prototype.$eh0 = function(enter, $1, $2) {
		this.setBrush(enter ? this.b1 : this.b0)
		return PROPAGATE
	}

	SimpleButton.prototype.$eh1 = function(down, $1, $2, $3) {
		if (this.enabled) {
			this.setFont(down ? this.f2 : this.f1)
			this.buttonFG.setPen(down ? this.p1 : 0)
		}
		return PROPAGATE
	}

	function Bus(x, y, w, l, fgColour) {
		VObj.call(this)
		this.busPen = new SolidPen(0, w, fgColour, ARROW60_START|ARROW60_END)
		this.arrow = new Line2($g[0], 0, 0, this.busPen, x, y, l, 0)
	}
	Bus.prototype = Object.create(VObj.prototype)

	Bus.prototype.setColour = function(colour) {
		this.busPen.setRGBA(colour)
	}

	function BusArrow(x, y, w, _l, bgColour, fgColour) {
		VObj.call(this)
		this.l = _l
		this.bgPen = new SolidPen(0, w, bgColour, ARROW60_START|ARROW60_END)
		this.bgArrow = new Line2($g[0], 0, 0, this.bgPen, x, y, 0, this.l)
		this.fgPen = new SolidPen(0, w, fgColour, ARROW60_END)
		this.fgArrow = new Line2($g[0], 0, 0, this.fgPen, x, y, 0, 0)
		this.fgArrow.setOpacity(0)
	}
	BusArrow.prototype = Object.create(VObj.prototype)

	BusArrow.prototype.reset = function() {
		this.bgArrow.setOpacity(1)
		this.fgArrow.setOpacity(0)
	}

	function Memory(_x, _y) {
		VObj.call(this)
		this.mem = newArray(NADDR)
		this.stale = newArray(NADDR)
		this.memR = newArray(NADDR)
		this.x = _x
		this.y = _y
		this.bgap = 3
		this.bw = MEMW-2*this.bgap
		this.bh = (MEMH-(NADDR+1)*this.bgap)/NADDR
		this.r = new Rectangle2($g[0], 0, 0, $g[1], $g[29], this.x, this.y, MEMW, MEMH)
		this.r.setRounded(4, 4)
		new Rectangle2($g[0], 0, 0, 0, 0, this.x, this.y-30, MEMW, 25, $g[3], $g[38], "Memory")
		this.abus = new BusArrow(this.x+50, this.y+MEMH, ABUSW, ABUSY-this.y-MEMH-ABUSW/2, GRAY32, BLUE)
		this.dbus = new BusArrow(this.x+100, this.y+MEMH, DBUSW, DBUSY-this.y-MEMH-DBUSW/2, GRAY32, RED)
		for (this.i = 0; this.i<NADDR; this.i++) {
			this.mem[this.i]=0
			this.stale[this.i]=0
			this.memR[this.i]=new Rectangle2($g[0], 0, 0, $g[1], $g[17], this.x+this.bgap, this.y+(this.i+1)*this.bgap+this.i*this.bh, this.bw, this.bh, $g[1], $g[39], "address: a%d data: %d", this.i, this.mem[this.i])
			this.memR[this.i].setRounded(2, 2)
			this.memR[this.i].setTxtOff(0, -1)
		}
	}
	Memory.prototype = Object.create(VObj.prototype)

	Memory.prototype.highlight = function(addr, flag) {
		this.memR[addr].setBrush((flag) ? $g[19] : (this.stale[addr]) ? $g[29] : $g[17])
	}

	Memory.prototype.reset = function() {
		for (let i = 0; i<NADDR; i++)
		this.highlight(i, 0)
	}

	function showBusOp(s) {
		$g[53].setTxt(s)
		let w = $g[53].getTxtW()+16
		$g[53].setPt(0, -w/2, -10)
		$g[53].setPt(1, w/2, 10)
		$g[53].setOpacity(1, TICKS, 1, 0)
	}

	function Cache(x, y, _cpuN) {
		VObj.call(this)
		this.aR = newArray(NSET), this.dR = newArray(NSET), this.stateR = newArray(NSET)
		this.a = newArray(NSET), this.d = newArray(NSET), this.state = newArray(NSET)
		this.cpuN = _cpuN
		this.bgap = 3
		this.bw0 = 20
		this.bw1 = (CACHEW-4*this.bgap-this.bw0)/2
		this.bh = (CACHEH-(NSET+1)*this.bgap)/NSET
		this.sharedbus = new BusArrow(x+this.bgap+this.bw0/2, SBUSY+SBUSW/2, SBUSW, y-SBUSY-SBUSW/2, GRAY32, MAGENTA)
		this.abus = new BusArrow(x+2*this.bgap+this.bw0+this.bw1/2, ABUSY+ABUSW/2, ABUSW, y-ABUSY-ABUSW/2, GRAY32, BLUE)
		this.dbus = new BusArrow(x+3*this.bgap+this.bw0+3*this.bw1/2, DBUSY+DBUSW/2, DBUSW, y-DBUSY-DBUSW/2, GRAY32, RED)
		this.cpuabus = new BusArrow(x+CACHEW/4, y+CACHEH, ABUSW, CPUY-CACHEY-CACHEH, GRAY32, BLUE)
		this.cpudbus = new BusArrow(x+3*CACHEW/4, y+CACHEH, DBUSW, CPUY-CACHEY-CACHEH, GRAY32, RED)
		this.r = new Rectangle2($g[0], 0, 0, $g[1], $g[29], x, y, CACHEW, CACHEH)
		this.r.setRounded(4, 4)
		new Txt($g[0], 0, HLEFT|VTOP, x+CACHEW-20, y-30, $g[3], $g[38], "Cache %d", this.cpuN)
		$g[53].moveToFront()
		for (this.i = 0; this.i<NSET; this.i++) {
			this.state[this.i]=INVALID
			this.stateR[this.i]=new Rectangle2($g[0], 0, 0, $g[1], $g[17], x+this.bgap, y+(this.i+1)*this.bgap+this.i*this.bh, this.bw0, this.bh, $g[1], 0, "I")
			this.stateR[this.i].setRounded(2, 2)
			this.a[this.i]=0
			this.aR[this.i]=new Rectangle2($g[0], 0, 0, $g[1], $g[17], x+2*this.bgap+this.bw0, y+(this.i+1)*this.bgap+this.i*this.bh, this.bw1, this.bh)
			this.aR[this.i].setRounded(2, 2)
			this.d[this.i]=0
			this.dR[this.i]=new Rectangle2($g[0], 0, 0, $g[1], $g[17], x+3*this.bgap+this.bw0+this.bw1, y+(this.i+1)*this.bgap+this.i*this.bh, this.bw1, this.bh)
			this.dR[this.i].setRounded(2, 2)
		}
	}
	Cache.prototype = Object.create(VObj.prototype)

	Cache.prototype.setValues = function(set, addr, data) {
		this.a[set]=addr
		this.aR[set].setTxt("a%d", addr)
		this.d[set]=data
		this.dR[set].setTxt("%d", data)
	}

	Cache.prototype.highlight = function(set, flag) {
		let brush = flag ? $g[19] : $g[17]
		this.stateR[set].setBrush(brush)
		this.aR[set].setBrush(brush)
		this.dR[set].setBrush(brush)
	}

	Cache.prototype.reset = function() {
		this.cpuabus.reset()
		this.cpudbus.reset()
		this.highlight(0, 0)
		this.highlight(1, 0)
	}

	Cache.prototype.resetBus = function() {
		$g[52].abus.reset()
		$g[52].dbus.reset()
		$g[50].setColour(GRAY32)
		$g[49].setColour(GRAY32)
		$g[51].setColour(GRAY32)
		$g[52].reset()
		for (let i = 0; i<NCPU; i++) {
			$g[55][i].abus.reset()
			$g[55][i].dbus.reset()
			$g[55][i].sharedbus.reset()
		}
		$g[53].setOpacity(0, TICKS, 1, 0)
	}

	function CPU(x, y, _cpuN) {
		VObj.call(this)
		this.cpuN = _cpuN
		this.buttonLock = 0
		this.selected
		this.rb = newArray(NADDR)
		this.wb = newArray(NADDR)
		this.r = new Rectangle2($g[0], 0, 0, $g[1], $g[29], x, y, CPUW, CPUH, 0, 0, "CPUX %d", this.cpuN)
		this.r.setRounded(4, 4)
		new Txt($g[0], 0, HLEFT|VTOP, x+CPUW-20, y-30, $g[3], $g[38], "CPU %d", this.cpuN)
		for (this.i = 0; this.i<NADDR; this.i++) {
			this.rb[this.i]=new this.CPUButton(this, $g[0], 0, x+bgap, y+(this.i+1)*bgap+this.i*bh, this.i)
			this.wb[this.i]=new this.CPUButton(this, $g[0], 1, x+bgap+bw+bgap, y+(this.i+1)*bgap+this.i*bh, this.i)
		}
	}
	CPU.prototype = Object.create(VObj.prototype)

	CPU.prototype.CPUButton = function($parent, $grp, _rw, x, y, _addr) {
		this.$parent = $parent
		SimpleButton.call(this, $grp, x, y, bw, bh, $g[17], $g[30], $g[32], $g[12], $g[1], $g[39], $g[40], "")
		this.rw = _rw
		this.addr = _addr
		this.setTxt(this.rw ? "write a%d" : "read a%d", this.addr)
		this.addEventHandler("eventMB", this, this.$eh2)
	}
	CPU.prototype.CPUButton.prototype = Object.create(SimpleButton.prototype)

	CPU.prototype.CPUButton.prototype.select = function() {
		if (this.$parent.selected==this) {
			this.$parent.selected.setPen($g[32])
			this.$parent.selected=0
		} else {
			if (this.$parent.selected)
			this.$parent.selected.setPen($g[32])
			this.$parent.selected=this
			this.$parent.selected.setPen($g[33])
		}
	}

	CPU.prototype.CPUButton.prototype.resetCPUs = function(cpuN) {
		for (let i = 0; i<NCPU; i++) {
			if ($g[56][i].selected==0) {
				$g[55][i].reset()
				$g[56][i].r.setPen($g[1])
				$g[56][i].resetButtons()
			}
		}
	}

	CPU.prototype.CPUButton.prototype.$eh2 = function(down, flags, $2, $3) {
		let r = 0
		if (down && (flags&MB_LEFT)) {
			r|=REMEMBER
			if (this.$parent.buttonLock)
			return r
			for (let i = 0; i<NCPU; i++)
			$g[56][i].resetButtons()
			if (flags&MB_CTRL) {
				this.select()
			} else {
				this.$parent.selected=this
				startAction()
			}
		}
		return r
	}

	CPU.prototype.resetButtons = function() {
		for (let i = 0; i<NADDR; i++) {
			if (this.selected!=this.rb[i])
			this.rb[i].setPen($g[32])
			if (this.selected!=this.wb[i])
			this.wb[i].setPen($g[32])
		}
	}

	function startAction() {
		start()
		for (let i = 0; i<NCPU; i++)
		fork(85, $g[56][i])
	}

	function $eh3(down, flags, $2, $3) {
		if (down && (flags&MB_LEFT)) {
			reset()
		}
		return 0
	}

	function $eh4(down, flags, $2, $3) {
		if (down && (flags&MB_LEFT)) {
			if ($g[44]==2) {
				$g[44]=0
				$g[58].setTxt("bug free!")
			} else {
				$g[44]++
				$g[58].setTxt("bug %d", $g[44]-1)
			}
		}
		return 0
	}

	function $eh5(down, flags, $2, $3) {
		if (down && (flags&MB_LEFT))
		getURL("https://www.scss.tcd.ie/Jeremy.Jones/VivioJS/caches/MESIHelp.htm")
		return 0
	}

	function $eh6(down, flags, $2, $3) {
		if (down && (flags&MB_LEFT))
		getURL("https://www.scss.tcd.ie/Jeremy.Jones/VivioJS/vivio.htm")
		return 0
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
				setTPS(20)
				$g[31] = new SolidPen(0, 3, rgba(0, 0.59999999999999998, 0), 0, ROUND_END)
				$g[32] = new SolidPen(0, 2, GRAY64, 0, ROUND_END)
				$g[33] = new SolidPen(0, 2, rgba(1, 0.65000000000000002, 0), 0, ROUND_END)
				$g[34] = new SolidPen(0, 2, RED, 0, ROUND_END)
				$g[35] = new SolidBrush(rgba(0, 0, 0.40000000000000002))
				$g[36] = new Font("Calibri Light", 18, 0)
				$g[37] = new Font("Calibri", 32, SMALLCAPS)
				$g[38] = new Font("Calibri", 18, SMALLCAPS)
				$g[39] = new Font("Calibri Light", 18, 0)
				$g[40] = new Font("Calibri Light", 16, 0)
				setBgBrush($g[30])
				$g[41] = new Rectangle2($g[0], 0, 0, 0, $g[35], TITLEX, TITLEY, W/2, TITLEH, $g[2], $g[37], "MESI Protocol")
				$g[41].setRounded(5, 5)
				$g[41].setPt(1, $g[41].getTxtW()+16, TITLEH)
				$g[42] = "Like real hardware, the CPUs can operate in\n"
				$g[42]+="parallel. Try pressing a button on different\n"
				$g[42]+="CPUs \"simultaneously\". Alternatively select\n"
				$g[42]+="buttons on different CPUs with the CTRL key and\n"
				$g[42]+="click on the last button without CTRL to start\n"
				$g[42]+="simultaneous transactions."
				new Rectangle2($g[0], 0, HLEFT|VCENTRE|JUSTIFY, 0, 0, INFOX, INFOY, INFOW, INFOH, $g[1], $g[36], $g[42])
				$g[43] = 0
				$g[44] = 0
				$g[45] = -1
				$g[46] = 0
				$g[47] = -1
				$g[48] = 0
				$g[49] = new Bus(10, DBUSY, DBUSW, W-40, GRAY32)
				new Txt($g[0], 0, HLEFT|VTOP, 60, DBUSY-30, $g[3], $g[38], "Data bus")
				$g[50] = new Bus(20, ABUSY, ABUSW, W-40, GRAY32)
				new Txt($g[0], 0, HLEFT|VTOP, 70, ABUSY-30, $g[5], $g[38], "Address bus")
				$g[51] = new Bus(30, SBUSY, SBUSW, W-40, GRAY32)
				new Txt($g[0], 0, HLEFT|VTOP, 220, SBUSY-25, $g[7], $g[38], "Shared")
				$g[52] = new Memory((W-MEMW)/2, MEMY)
				$g[53] = new Rectangle($g[0], 0, 0, $g[1], $g[17], W/2, BUSOPY, 0, 0, 0, 0, 0, $g[36])
				$g[53].setOpacity(0)
				$g[53].setRounded(4, 4)
				$g[54] = new Txt($g[0], 0, HLEFT, 2*W/3, (ABUSY+DBUSY)/2, 0, $g[38], "Bus cycles: %d", $g[48])
				$g[55] = newArray(NCPU)
				$g[56] = newArray(NCPU)
				$g[55][0]=new Cache((W-5*CACHEW)/2, CACHEY, 0)
				$g[55][1]=new Cache((W-5*CACHEW)/2+2*CACHEW, CACHEY, 1)
				$g[55][2]=new Cache((W-5*CACHEW)/2+4*CACHEW, CACHEY, 2)
				$g[56][0]=new CPU((W-5*CPUW)/2, CPUY, 0)
				$g[56][1]=new CPU((W-5*CPUW)/2+2*CPUW, CPUY, 1)
				$g[56][2]=new CPU((W-5*CPUW)/2+4*CPUW, CPUY, 2)
				$g[57] = new SimpleButton($g[0], W-2*BW-2*BW/8, BY, BW, BH, $g[17], $g[30], $g[32], $g[12], $g[1], $g[39], $g[40], "reset")
				$g[58] = new SimpleButton($g[0], W-BW-BW/8, BY, BW, BH, $g[17], $g[30], $g[32], $g[12], $g[1], $g[39], $g[40], "bug free!")
				$g[59] = new SimpleButton($g[0], W-2*BW-2*BW/8, BY+BH+BH/4, BW, BH, $g[17], $g[30], $g[32], $g[12], $g[1], $g[39], $g[40], "help")
				$g[60] = new SimpleButton($g[0], W-BW-BW/8, BY+BH+BH/4, BW, BH, $g[17], $g[30], $g[32], $g[12], $g[1], $g[39], $g[40], "VivioJS help")
				$g[57].addEventHandler("eventMB", this, $eh3)
				$g[58].addEventHandler("eventMB", this, $eh4)
				$g[59].addEventHandler("eventMB", this, $eh5)
				$g[60].addEventHandler("eventMB", this, $eh6)
				returnf(0)
				continue
			case 1:
				enterf(0);	// moveUp
				$obj.fgArrow.setPt(0, 0, $obj.l)
				$obj.fgArrow.setPt(1, 0, $obj.l)
				$obj.fgArrow.setPt(1, 0, 0, $stack[$fp-3], 1, 0)
				$obj.fgArrow.setOpacity(1, $stack[$fp-3]/4, 1, 0)
				if ($obj.bgArrow.setOpacity(0, $stack[$fp-3], 1, $stack[$fp-4]))
				return
				$pc = 2
			case 2:
				returnf(2)
				continue
			case 3:
				enterf(0);	// moveDown
				$obj.fgArrow.setPt(0, 0, 0)
				$obj.fgArrow.setPt(1, 0, 0)
				$obj.fgArrow.setPt(1, 0, $obj.l, $stack[$fp-3], 1, 0)
				$obj.fgArrow.setOpacity(1, $stack[$fp-3]/4, 1, 0)
				if ($obj.bgArrow.setOpacity(0, $stack[$fp-3], 1, $stack[$fp-4]))
				return
				$pc = 4
			case 4:
				returnf(2)
				continue
			case 5:
				enterf(2);	// flush
				$stack[$fp+1] = $stack[$fp-3]%NSET
				$stack[$fp+2] = $obj.a[$stack[$fp+1]]
				callf(1, $obj.abus, TICKS, 0)
				continue
			case 6:
				callf(1, $obj.dbus, TICKS, 1)
				continue
			case 7:
				$g[50].setColour(BLUE)
				$g[49].setColour(RED)
				callf(1, $g[52].abus, TICKS, 0)
				continue
			case 8:
				callf(1, $g[52].dbus, TICKS, 1)
				continue
			case 9:
				$obj.state[$stack[$fp+1]]=INVALID
				$obj.stateR[$stack[$fp+1]].setTxt("I")
				$g[52].stale[$stack[$fp+2]]=0
				$g[52].memR[$stack[$fp+2]].setBrush($g[17])
				$g[52].mem[$stack[$fp+2]]=$obj.d[$stack[$fp+1]]
				$g[52].memR[$stack[$fp+2]].setTxt("address: a%d data: %d", $stack[$fp+2], $g[52].mem[$stack[$fp+2]])
				$obj.resetBus()
				returnf(1)
				continue
			case 10:
				enterf(2);	// busWatchHelper
				$stack[$fp+1] = $stack[$fp-3]%NSET
				$stack[$fp+2] = ($obj.a[$stack[$fp+1]]==$stack[$fp-3]) && ($obj.state[$stack[$fp+1]]!=INVALID)
				if (!($stack[$fp+2] && $stack[$fp-4]==0)) {
					$pc = 12
					continue
				}
				$g[46]=1
				if (!($obj.state[$stack[$fp+1]]==MODIFIED)) {
					$pc = 11
					continue
				}
				$g[45]=$obj.cpuN
				$pc = 11
			case 11:
				$pc = 12
			case 12:
				callf(3, $obj.abus, TICKS, 1)
				continue
			case 13:
				if (!($stack[$fp+2]==0)) {
					$pc = 14
					continue
				}
				returnf(2)
				continue
				$pc = 14
			case 14:
				if (!($stack[$fp-4]==0)) {
					$pc = 19
					continue
				}
				if (!(($obj.state[$stack[$fp+1]]==EXCLUSIVE) || ($obj.state[$stack[$fp+1]]==MODIFIED))) {
					$pc = 17
					continue
				}
				if (!($obj.state[$stack[$fp+1]]==MODIFIED)) {
					$pc = 16
					continue
				}
				$g[55][$obj.cpuN].highlight($stack[$fp+1], 1)
				callf(1, $g[55][$obj.cpuN].dbus, TICKS, 0)
				continue
			case 15:
				$pc = 16
			case 16:
				$obj.state[$stack[$fp+1]]=SHARED
				$obj.stateR[$stack[$fp+1]].setTxt("S")
				$obj.highlight($stack[$fp+1], 1)
				$pc = 17
			case 17:
				callf(1, $obj.sharedbus, TICKS, 1)
				continue
			case 18:
				$g[51].setColour(MAGENTA)
				$pc = 21
				continue
			case 19:
				if (!($g[44]!=1)) {
					$pc = 20
					continue
				}
				$obj.state[$stack[$fp+1]]=INVALID
				$obj.stateR[$stack[$fp+1]].setTxt("I")
				$obj.highlight($stack[$fp+1], 1)
				$pc = 20
			case 20:
				$pc = 21
			case 21:
				returnf(2)
				continue
			case 22:
				enterf(1);	// busWatch
				$g[45]=-1
				$g[46]=0
				$stack[$fp+1] = 0
				$pc = 23
			case 23:
				if (!($stack[$fp+1]<NCPU)) {
					$pc = 26
					continue
				}
				if (!($stack[$fp+1]!=$stack[$fp-4])) {
					$pc = 24
					continue
				}
				fork(10, $g[55][$stack[$fp+1]], $stack[$fp-3], $stack[$fp-5])
				$pc = 24
			case 24:
				$pc = 25
			case 25:
				$stack[$fp+1]++
				$pc = 23
				continue
			case 26:
				if (!($stack[$fp-5]==0)) {
					$pc = 29
					continue
				}
				if (wait(2*TICKS))
				return
				$pc = 27
			case 27:
				callf(3, $g[55][$stack[$fp-4]].sharedbus, TICKS, 0)
				continue
			case 28:
				$pc = 29
			case 29:
				returnf(3)
				continue
			case 30:
				enterf(0);	// getBusLock
				if (!($g[47]==$obj.cpuN)) {
					$pc = 31
					continue
				}
				returnf(0)
				continue
				$pc = 31
			case 31:
				$pc = 32
			case 32:
				if (!($g[47]>=0)) {
					$pc = 34
					continue
				}
				if (wait(1))
				return
				$pc = 33
			case 33:
				$pc = 32
				continue
			case 34:
				$g[47]=$obj.cpuN
				returnf(0)
				continue
			case 35:
				enterf(0);	// releaseBusLock
				$g[47]=-1
				if (wait(1))
				return
				$pc = 36
			case 36:
				returnf(0)
				continue
			case 37:
				enterf(1);	// read
				$g[53].setOpacity(0)
				$stack[$fp+1] = $stack[$fp-3]%NSET
				if (!($stack[$fp-4])) {
					$pc = 39
					continue
				}
				callf(1, $obj.cpuabus, TICKS, 1)
				continue
			case 38:
				$pc = 39
			case 39:
				if (!(($obj.a[$stack[$fp+1]]==$stack[$fp-3]) && ($obj.state[$stack[$fp+1]]!=INVALID))) {
					$pc = 42
					continue
				}
				$obj.highlight($stack[$fp+1], 1)
				if (!($stack[$fp-4])) {
					$pc = 41
					continue
				}
				callf(3, $obj.cpudbus, TICKS, 1)
				continue
			case 40:
				$pc = 41
			case 41:
				returnf(2)
				continue
				$pc = 42
			case 42:
				callf(30, $obj)
				continue
			case 43:
				$obj.resetBus()
				if (!(($obj.state[$stack[$fp+1]]==MODIFIED) && ($g[44]!=2))) {
					$pc = 47
					continue
				}
				showBusOp(sprintf("CPU %d flushes a%d from its cache to memory", $obj.cpuN, $stack[$fp-3]))
				callf(5, $obj, $stack[$fp-3])
				continue
			case 44:
				$g[48]++
				$g[54].setTxt("Bus cycles: %d", $g[48])
				callf(35, $obj)
				continue
			case 45:
				callf(30, $obj)
				continue
			case 46:
				$obj.resetBus()
				$pc = 47
			case 47:
				showBusOp(sprintf("CPU %d reads a%d from memory", $obj.cpuN, $stack[$fp-3]))
				$g[48]++
				$g[54].setTxt("Bus cycles: %d", $g[48])
				$obj.highlight($stack[$fp+1], 1)
				callf(1, $obj.abus, TICKS, 1)
				continue
			case 48:
				$g[50].setColour(BLUE)
				callf(1, $g[52].abus, TICKS, 0)
				continue
			case 49:
				fork(22, $obj, $stack[$fp-3], $obj.cpuN, 0)
				if (wait(TICKS))
				return
				$pc = 50
			case 50:
				if (!($g[45]>=0)) {
					$pc = 54
					continue
				}
				if (wait(TICKS))
				return
				$pc = 51
			case 51:
				showBusOp(sprintf("CPU %d reads a%d from memory - CPU %d intervenes and supplies data from its cache", $obj.cpuN, $stack[$fp-3], $g[45]))
				$g[49].setColour(RED)
				callf(1, $g[52].dbus, TICKS, 0)
				continue
			case 52:
				callf(3, $obj.dbus, TICKS, 1)
				continue
			case 53:
				$g[52].mem[$stack[$fp-3]]=$g[55][$g[45]].d[$stack[$fp+1]]
				$g[52].stale[$stack[$fp-3]]=0
				$g[52].memR[$stack[$fp-3]].setBrush($g[17])
				$g[52].memR[$stack[$fp-3]].setTxt("address: a%d data: %d", $stack[$fp-3], $g[52].mem[$stack[$fp-3]])
				$g[52].highlight($stack[$fp-3], 1)
				$pc = 57
				continue
			case 54:
				$g[52].highlight($stack[$fp-3], 1)
				callf(3, $g[52].dbus, TICKS, 1)
				continue
			case 55:
				$g[49].setColour(RED)
				callf(3, $obj.dbus, TICKS, 1)
				continue
			case 56:
				$pc = 57
			case 57:
				$obj.a[$stack[$fp+1]]=$stack[$fp-3]
				$obj.aR[$stack[$fp+1]].setTxt("a%d", $stack[$fp-3])
				$obj.d[$stack[$fp+1]]=$g[52].mem[$stack[$fp-3]]
				$obj.dR[$stack[$fp+1]].setTxt("%d", $obj.d[$stack[$fp+1]])
				$obj.state[$stack[$fp+1]]=$g[46] ? SHARED : EXCLUSIVE
				$obj.stateR[$stack[$fp+1]].setTxt($g[46] ? "S" : "E")
				callf(35, $obj)
				continue
			case 58:
				if (!($stack[$fp-4])) {
					$pc = 60
					continue
				}
				callf(3, $obj.cpudbus, TICKS, 1)
				continue
			case 59:
				$pc = 60
			case 60:
				returnf(2)
				continue
			case 61:
				enterf(1);	// write
				$g[53].setOpacity(0)
				$stack[$fp+1] = $stack[$fp-3]%NSET
				callf(1, $obj.cpudbus, TICKS, 0)
				continue
			case 62:
				callf(1, $obj.cpuabus, TICKS, 1)
				continue
			case 63:
				$obj.highlight($stack[$fp+1], 1)
				$g[43]++
				if (!(($obj.a[$stack[$fp+1]]==$stack[$fp-3]) && (($obj.state[$stack[$fp+1]]==EXCLUSIVE) || ($obj.state[$stack[$fp+1]]==MODIFIED)))) {
					$pc = 64
					continue
				}
				$obj.setValues($stack[$fp+1], $stack[$fp-3], $g[43])
				$obj.state[$stack[$fp+1]]=MODIFIED
				$obj.stateR[$stack[$fp+1]].setTxt("M")
				$g[52].stale[$stack[$fp-3]]=1
				$g[52].memR[$stack[$fp-3]].setBrush($g[29])
				returnf(1)
				continue
				$pc = 64
			case 64:
				$pc = 65
			case 65:
				if (!(1)) {
					$pc = 78
					continue
				}
				if (!(($obj.state[$stack[$fp+1]]==INVALID) || ($obj.a[$stack[$fp+1]]!=$stack[$fp-3]))) {
					$pc = 67
					continue
				}
				callf(37, $obj, $stack[$fp-3], 0)
				continue
			case 66:
				$pc = 67
			case 67:
				if (!($obj.state[$stack[$fp+1]]==SHARED)) {
					$pc = 75
					continue
				}
				callf(30, $obj)
				continue
			case 68:
				if (!($obj.state[$stack[$fp+1]]==INVALID)) {
					$pc = 69
					continue
				}
				$pc = 65
				continue
				$pc = 69
			case 69:
				$obj.resetBus()
				showBusOp(sprintf("CPU %d writes %d to a%d in memory", $obj.cpuN, $g[43], $stack[$fp-3]))
				$g[48]++
				$g[54].setTxt("Bus cycles: %d", $g[48])
				$obj.setValues($stack[$fp+1], $stack[$fp-3], $g[43])
				callf(1, $obj.abus, TICKS, 0)
				continue
			case 70:
				callf(1, $obj.dbus, TICKS, 1)
				continue
			case 71:
				$g[50].setColour(BLUE)
				$g[49].setColour(RED)
				callf(1, $g[52].abus, TICKS, 0)
				continue
			case 72:
				callf(1, $g[52].dbus, TICKS, 0)
				continue
			case 73:
				fork(22, $obj, $stack[$fp-3], $obj.cpuN, 1)
				$obj.state[$stack[$fp+1]]=EXCLUSIVE
				$obj.stateR[$stack[$fp+1]].setTxt("E")
				$g[52].mem[$stack[$fp-3]]=$obj.d[$stack[$fp+1]]
				$g[52].memR[$stack[$fp-3]].setTxt("address: a%d data: %d", $stack[$fp-3], $g[52].mem[$stack[$fp-3]])
				$g[52].highlight($stack[$fp-3], 1)
				callf(35, $obj)
				continue
			case 74:
				$pc = 78
				continue
				$pc = 77
				continue
			case 75:
				if (!(($obj.state[$stack[$fp+1]]==EXCLUSIVE) || ($obj.state[$stack[$fp+1]]==MODIFIED))) {
					$pc = 76
					continue
				}
				$obj.setValues($stack[$fp+1], $stack[$fp-3], $g[43])
				$obj.state[$stack[$fp+1]]=MODIFIED
				$obj.stateR[$stack[$fp+1]].setTxt("M")
				$g[52].stale[$stack[$fp-3]]=1
				$g[52].memR[$stack[$fp-3]].setBrush($g[29])
				$g[53].setOpacity(0)
				$pc = 78
				continue
				$pc = 76
			case 76:
				$pc = 77
			case 77:
				$pc = 65
				continue
			case 78:
				returnf(1)
				continue
			case 79:
				enterf(0);	// cpuButtonAction
				$obj.resetCPUs($obj.$parent.cpuN)
				if (!($g[47]==-1)) {
					$pc = 80
					continue
				}
				$g[55][$obj.$parent.cpuN].resetBus()
				$pc = 80
			case 80:
				$obj.$parent.buttonLock=1
				$g[55][$obj.$parent.cpuN].reset()
				$obj.$parent.r.setPen($g[31])
				$obj.setPen($g[34])
				if (!($obj.rw)) {
					$pc = 82
					continue
				}
				callf(61, $g[55][$obj.$parent.cpuN], $obj.addr)
				continue
			case 81:
				$pc = 84
				continue
			case 82:
				callf(37, $g[55][$obj.$parent.cpuN], $obj.addr, 1)
				continue
			case 83:
				$pc = 84
			case 84:
				$obj.resetCPUs($obj.$parent.cpuN)
				$obj.$parent.selected=0
				checkPoint()
				$obj.$parent.buttonLock=0
				returnf(0)
				continue
			case 85:
				enterf(0);	// cpuAction
				if (!($obj.selected && $obj.buttonLock==0)) {
					$pc = 87
					continue
				}
				callf(79, $obj.selected)
				continue
			case 86:
				$pc = 87
			case 87:
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
