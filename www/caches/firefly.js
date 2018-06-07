"use strict"

function firefly(vplayer) {

	const ARROW60_END = vplayer.ARROW60_END
	const ARROW60_START = vplayer.ARROW60_START
	const BLACK = vplayer.BLACK
	const BLUE = vplayer.BLUE
	const GRAY128 = vplayer.GRAY128
	const GRAY192 = vplayer.GRAY192
	const GRAY224 = vplayer.GRAY224
	const GRAY32 = vplayer.GRAY32
	const GRAY64 = vplayer.GRAY64
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
	const INFOY = 70
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
	const BUSOPY = 206
	const NCPU = 3
	const NADDR = 4
	const NSET = 2
	const TICKS = 20
	const DIRTYBIT = 1
	const SHAREDBIT = 2
	const NSND = 0
	const NSD = 1
	const SND = 2
	const SD = 3
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

	Bus.prototype.setColour = function(rgba) {
		this.busPen.setRGBA(rgba)
	}

	function BusArrow(_x, _y, _w, _l, bgColour, fgColour) {
		VObj.call(this)
		this.x = _x
		this.y = _y
		this.w = _w
		this.l = _l
		this.bgPen = new SolidPen(0, this.w, bgColour, ARROW60_START|ARROW60_END)
		this.bgArrow = new Line2($g[0], 0, 0, this.bgPen, this.x, this.y, 0, this.l)
		this.fgPen = new SolidPen(0, this.w, fgColour, ARROW60_END)
		this.fgArrow = new Line2($g[0], 0, 0, this.fgPen, this.x, this.y, 0, 0)
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
		this.r = new Rectangle2($g[0], 0, 0, $g[1], $g[11], this.x, this.y, MEMW, MEMH)
		this.r.setRounded(4, 4)
		this.t = new Rectangle2($g[0], 0, 0, 0, 0, this.x, this.y-30, MEMW, 25, $g[8], $g[18], "Memory")
		this.abus = new BusArrow(this.x+50, this.y+MEMH, ABUSW, ABUSY-this.y-MEMH-ABUSW/2, GRAY32, BLUE)
		this.dbus = new BusArrow(this.x+100, this.y+MEMH, DBUSW, DBUSY-this.y-MEMH-DBUSW/2, GRAY32, RED)
		for (this.i = 0; this.i<NADDR; this.i++) {
			this.mem[this.i]=0
			this.stale[this.i]=0
			this.memR[this.i]=new Rectangle2($g[0], 0, 0, $g[1], $g[15], this.x+this.bgap, this.y+(this.i+1)*this.bgap+this.i*this.bh, this.bw, this.bh, $g[1], $g[19], "address: a%d data: %d", this.i, this.mem[this.i])
			this.memR[this.i].setRounded(2, 2)
			this.memR[this.i].setTxtOff(0, 1)
		}
	}
	Memory.prototype = Object.create(VObj.prototype)

	Memory.prototype.highlight = function(addr, flag) {
		if (flag==1) {
			this.memR[addr].setBrush($g[13])
		} else {
			if (this.stale[addr]) {
				this.memR[addr].setBrush($g[11])
			} else {
				this.memR[addr].setBrush($g[15])
			}
		}
	}

	Memory.prototype.reset = function() {
		for (let i = 0; i<NADDR; i++)
		this.highlight(i, 0)
	}

	function showBusOp(s) {
		$g[35].setTxt(s)
		let w = $g[35].getTxtW()+16
		$g[35].setPt(0, -w/2, -10)
		$g[35].setPt(1, w/2, 10)
		$g[35].setOpacity(1, TICKS, 1, 0)
	}

	function Cache(x, y, _cpuN) {
		VObj.call(this)
		this.aR = newArray(NSET), this.dR = newArray(NSET), this.sharedR = newArray(NSET), this.dirtyR = newArray(NSET)
		this.sharedX0 = newArray(NSET), this.sharedX1 = newArray(NSET), this.dirtyX0 = newArray(NSET), this.dirtyX1 = newArray(NSET)
		this.a = newArray(NSET), this.d = newArray(NSET), this.state = newArray(NSET)
		this.cpuN = _cpuN
		this.bgap = 3
		this.bw0 = 20
		this.bw1 = (CACHEW-5*this.bgap-2*this.bw0)/2
		this.bh = (CACHEH-(NSET+1)*this.bgap)/NSET
		this.sbus = new BusArrow(x+this.bgap+this.bw0/2, SBUSY+SBUSW/2, SBUSW, y-SBUSY-SBUSW/2, GRAY32, MAGENTA)
		this.abus = new BusArrow(x+2*this.bgap+this.bw0+this.bw1/2, ABUSY+ABUSW/2, ABUSW, y-ABUSY-ABUSW/2, GRAY32, BLUE)
		this.dbus = new BusArrow(x+3*this.bgap+this.bw0+3*this.bw1/2, DBUSY+DBUSW/2, DBUSW, y-DBUSY-DBUSW/2, GRAY32, RED)
		this.cpuabus = new BusArrow(x+CACHEW/4, y+CACHEH, ABUSW, CPUY-CACHEY-CACHEH, GRAY32, BLUE)
		this.cpudbus = new BusArrow(x+3*CACHEW/4, y+CACHEH, DBUSW, CPUY-CACHEY-CACHEH, GRAY32, RED)
		this.r = new Rectangle2($g[0], 0, 0, $g[1], $g[11], x, y, CACHEW, CACHEH)
		this.r.setRounded(4, 4)
		this.t = new Txt($g[0], 0, HLEFT|VTOP, x+CACHEW-20, y-30, $g[8], $g[18], "Cache %d", this.cpuN)
		$g[35].moveToFront()
		for (this.i = 0; this.i<NSET; this.i++) {
			this.state[this.i]=SND
			this.sharedR[this.i]=new Rectangle2($g[0], 0, 0, $g[1], $g[15], x+this.bgap, y+(this.i+1)*this.bgap+this.i*this.bh, this.bw0, this.bh, $g[1], $g[18], "S")
			this.sharedR[this.i].setRounded(2, 2)
			this.sharedX0[this.i]=new Line2($g[0], 0, 0, $g[8], x+this.bgap, y+(this.i+1)*this.bgap+this.i*this.bh, this.bw0, this.bh)
			this.sharedX0[this.i].setOpacity(0)
			this.sharedX1[this.i]=new Line2($g[0], 0, 0, $g[8], x+2*this.bgap+this.bw0, y+(this.i+1)*this.bgap+this.i*this.bh, -this.bw0, this.bh)
			this.sharedX1[this.i].setOpacity(0)
			this.dirtyR[this.i]=new Rectangle2($g[0], 0, 0, $g[1], $g[15], x+2*this.bgap+this.bw0, y+(this.i+1)*this.bgap+this.i*this.bh, this.bw0, this.bh, $g[1], $g[18], "D")
			this.dirtyR[this.i].setRounded(2, 2)
			this.dirtyX0[this.i]=new Line2($g[0], 0, 0, $g[8], x+2*this.bgap+this.bw0, y+(this.i+1)*this.bgap+this.i*this.bh, this.bw0, this.bh)
			this.dirtyX1[this.i]=new Line2($g[0], 0, 0, $g[8], x+2*this.bgap+2*this.bw0, y+(this.i+1)*this.bgap+this.i*this.bh, -this.bw0, this.bh)
			this.a[this.i]=this.i
			this.aR[this.i]=new Rectangle2($g[0], 0, 0, $g[1], $g[15], x+3*this.bgap+2*this.bw0, y+(this.i+1)*this.bgap+this.i*this.bh, this.bw1, this.bh, $g[1], $g[19], "a%d", this.i)
			this.aR[this.i].setRounded(2, 2)
			this.d[this.i]=0
			this.dR[this.i]=new Rectangle2($g[0], 0, 0, $g[1], $g[15], x+4*this.bgap+2*this.bw0+this.bw1, y+(this.i+1)*this.bgap+this.i*this.bh, this.bw1, this.bh, $g[1], $g[19], "0")
			this.dR[this.i].setRounded(2, 2)
		}
	}
	Cache.prototype = Object.create(VObj.prototype)

	Cache.prototype.setState = function(set) {
		let opacity = (this.state[set]&SHAREDBIT) ? 0 : 1
		this.sharedX0[set].setOpacity(opacity)
		this.sharedX1[set].setOpacity(opacity)
		opacity=(this.state[set]&DIRTYBIT) ? 0 : 1
		this.dirtyX0[set].setOpacity(opacity)
		this.dirtyX1[set].setOpacity(opacity)
	}

	Cache.prototype.highlight = function(set, flag) {
		if (flag==1) {
			this.sharedR[set].setBrush($g[13])
			this.dirtyR[set].setBrush($g[13])
			this.aR[set].setBrush($g[13])
			this.dR[set].setBrush($g[13])
		} else {
			this.sharedR[set].setBrush($g[15])
			this.dirtyR[set].setBrush($g[15])
			this.aR[set].setBrush($g[15])
			this.dR[set].setBrush($g[15])
		}
	}

	Cache.prototype.reset = function() {
		this.cpuabus.reset()
		this.cpudbus.reset()
		this.highlight(0, 0)
		this.highlight(1, 0)
	}

	Cache.prototype.resetBus = function() {
		$g[34].abus.reset()
		$g[34].dbus.reset()
		$g[31].setColour(GRAY32)
		$g[32].setColour(GRAY32)
		$g[33].setColour(GRAY32)
		$g[34].reset()
		for (let i = 0; i<NCPU; i++) {
			$g[37][i].abus.reset()
			$g[37][i].dbus.reset()
			$g[37][i].sbus.reset()
		}
	}

	function CPU(x, y, _cpuN) {
		VObj.call(this)
		this.cpuN = _cpuN
		this.buttonLock = 0
		this.selected
		this.rb = newArray(NADDR)
		this.wb = newArray(NADDR)
		this.r = new Rectangle2($g[0], 0, 0, $g[1], $g[11], x, y, CPUW, CPUH)
		this.r.setRounded(4, 4)
		new Txt($g[0], 0, HLEFT|VTOP, x+CPUW-20, y-30, $g[8], $g[18], "CPU %d", this.cpuN)
		for (this.i = 0; this.i<NADDR; this.i++) {
			this.rb[this.i]=new this.CPUButton(this, $g[0], 0, x+bgap, y+(this.i+1)*bgap+this.i*bh, this.i)
			this.wb[this.i]=new this.CPUButton(this, $g[0], 1, x+bgap+bw+bgap, y+(this.i+1)*bgap+this.i*bh, this.i)
		}
	}
	CPU.prototype = Object.create(VObj.prototype)

	CPU.prototype.CPUButton = function($parent, $grp, _rw, x, y, _addr) {
		this.$parent = $parent
		SimpleButton.call(this, $grp, x, y, bw, bh, $g[15], $g[12], $g[3], $g[4], $g[1], $g[19], $g[20], "")
		this.rw = _rw
		this.addr = _addr
		this.setTxt(this.rw ? "write a%d" : "read a%d", this.addr)
		this.addEventHandler("eventMB", this, this.$eh2)
	}
	CPU.prototype.CPUButton.prototype = Object.create(SimpleButton.prototype)

	CPU.prototype.CPUButton.prototype.select = function() {
		if (this.$parent.selected==this) {
			this.$parent.selected.setPen($g[3])
			this.$parent.selected=0
		} else {
			if (this.$parent.selected)
			this.$parent.selected.setPen($g[3])
			this.$parent.selected=this
			this.$parent.selected.setPen($g[7])
		}
	}

	CPU.prototype.CPUButton.prototype.resetCPUs = function(cpuN) {
		for (let i = 0; i<NCPU; i++) {
			if ($g[38][i].selected==0) {
				$g[37][i].reset()
				$g[38][i].r.setPen($g[1])
				$g[38][i].resetButtons()
			}
		}
	}

	CPU.prototype.CPUButton.prototype.$eh2 = function(down, flags, $2, $3) {
		let rr = 0
		if (down && (flags&MB_LEFT)) {
			rr|=REMEMBER
			if (this.$parent.buttonLock)
			return rr
			for (let i = 0; i<NCPU; i++)
			$g[38][i].resetButtons()
			if (flags&MB_CTRL) {
				this.select()
			} else {
				this.$parent.selected=this
				startAction()
			}
		}
		return rr
	}

	CPU.prototype.resetButtons = function() {
		for (let i = 0; i<NADDR; i++) {
			if (this.selected!=this.rb[i])
			this.rb[i].setPen($g[3])
			if (this.selected!=this.wb[i])
			this.wb[i].setPen($g[3])
		}
	}

	function startAction() {
		start()
		for (let i = 0; i<NCPU; i++)
		fork(92, $g[38][i])
	}

	function $eh3(down, flags, $2, $3) {
		if (down && (flags&MB_LEFT)) {
			reset()
		}
		return 0
	}

	function $eh4(down, flags, $2, $3) {
		if (down && (flags&MB_LEFT)) {
			if ($g[28]==2) {
				$g[28]=0
				$g[40].setTxt("bug free!")
			} else {
				$g[28]++
				$g[40].setTxt("bug %d", $g[28]-1)
			}
		}
		return 0
	}

	function $eh5(down, flags, $2, $3) {
		if (down && (flags&MB_LEFT))
		getURL("https://www.scss.tcd.ie/Jeremy.Jones/VivioJS/caches/fireflyHelp.htm")
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
				setViewport(0, 0, W, H, 1)
				setTPS(20)
				$g[1] = new SolidPen(0, 0, BLACK)
				$g[2] = new SolidPen(0, 0, BLUE)
				$g[3] = new SolidPen(0, 2, GRAY64, ROUND_END)
				$g[4] = new SolidPen(0, 1, GRAY128, ROUND_END)
				$g[5] = new SolidPen(0, 2, rgba(0, 0.75, 0), ROUND_END)
				$g[6] = new SolidPen(0, 0, MAGENTA)
				$g[7] = new SolidPen(0, 2, rgba(1, 0.65000000000000002, 0), ROUND_END)
				$g[8] = new SolidPen(0, 0, RED)
				$g[9] = new SolidPen(0, 2, RED, ROUND_END)
				$g[10] = new SolidPen(0, 0, WHITE)
				$g[11] = new SolidBrush(GRAY192)
				$g[12] = new SolidBrush(GRAY224)
				$g[13] = new SolidBrush(GREEN)
				$g[14] = new SolidBrush(rgba(0, 0, 0.40000000000000002))
				$g[15] = new SolidBrush(WHITE)
				$g[16] = new Font("Calibri Light", 18, 0)
				$g[17] = new Font("Calibri", 32, SMALLCAPS)
				$g[18] = new Font("Calibri", 18, SMALLCAPS)
				$g[19] = new Font("Calibri Light", 18, 0)
				$g[20] = new Font("Calibri Light", 16, 0)
				setBgBrush($g[12])
				$g[21] = new Rectangle2($g[0], 0, 0, 0, $g[14], TITLEX, TITLEY, W/2, TITLEH, $g[10], $g[17], "Firefly Protocol")
				$g[21].setRounded(5, 5)
				$g[21].setPt(1, $g[21].getTxtW()+16, TITLEH)
				$g[22] = "Like real hardware, the CPUs can operate in\n"
				$g[22]+="parallel. Try pressing a button on different\n"
				$g[22]+="CPUs \"simultaneously\". Alternatively select\n"
				$g[22]+="buttons on different CPUs with the CTRL key and\n"
				$g[22]+="click on the last button without CTRL to start\n"
				$g[22]+="simultaneous transactions."
				new Rectangle2($g[0], 0, HLEFT|VCENTRE|JUSTIFY, 0, 0, INFOX, INFOY, INFOW, INFOH, $g[1], $g[16], $g[22])
				$g[23] = 0
				$g[24] = 0
				$g[25] = 0
				$g[26] = 0
				$g[27] = 0
				$g[28] = 0
				$g[29] = -1
				$g[30] = 0
				$g[31] = new Bus(10, DBUSY, DBUSW, W-40, GRAY32)
				new Txt($g[0], 0, HLEFT|VTOP, 60, DBUSY-30, $g[8], $g[18], "Data bus")
				$g[32] = new Bus(20, ABUSY, ABUSW, W-40, GRAY32)
				new Txt($g[0], 0, HLEFT|VTOP, 70, ABUSY-30, $g[2], $g[18], "Address bus")
				$g[33] = new Bus(30, SBUSY, SBUSW, W-40, GRAY32)
				new Txt($g[0], 0, HLEFT|VTOP, 220, SBUSY-25, $g[6], $g[18], "Shared")
				$g[34] = new Memory((W-MEMW)/2, MEMY)
				$g[35] = new Rectangle($g[0], 0, 0, $g[1], $g[15], W/2, BUSOPY, 0, 0, 0, 0, 0, $g[16])
				$g[35].setOpacity(0)
				$g[35].setRounded(4, 4)
				$g[36] = new Txt($g[0], 0, HLEFT, 2*W/3, (ABUSY+DBUSY)/2, 0, $g[18], "bus cycles: %d", $g[30])
				$g[37] = newArray(NCPU)
				$g[38] = newArray(NCPU)
				$g[37][0]=new Cache((W-5*CACHEW)/2, CACHEY, 0)
				$g[37][1]=new Cache((W-5*CACHEW)/2+2*CACHEW, CACHEY, 1)
				$g[37][2]=new Cache((W-5*CACHEW)/2+4*CACHEW, CACHEY, 2)
				$g[38][0]=new CPU((W-5*CPUW)/2, CPUY, 0)
				$g[38][1]=new CPU((W-5*CPUW)/2+2*CPUW, CPUY, 1)
				$g[38][2]=new CPU((W-5*CPUW)/2+4*CPUW, CPUY, 2)
				$g[39] = new SimpleButton($g[0], W-2*BW-2*BW/8, BY, BW, BH, $g[15], $g[12], $g[3], $g[4], $g[1], $g[19], $g[20], "reset")
				$g[40] = new SimpleButton($g[0], W-BW-BW/8, BY, BW, BH, $g[15], $g[12], $g[3], $g[4], $g[1], $g[19], $g[20], "bug free!")
				$g[41] = new SimpleButton($g[0], W-2*BW-2*BW/8, BY+BH+BH/4, BW, BH, $g[15], $g[12], $g[3], $g[4], $g[1], $g[19], $g[20], "help")
				$g[42] = new SimpleButton($g[0], W-BW-BW/8, BY+BH+BH/4, BW, BH, $g[15], $g[12], $g[3], $g[4], $g[1], $g[19], $g[20], "VivioJS help")
				$g[39].addEventHandler("eventMB", this, $eh3)
				$g[40].addEventHandler("eventMB", this, $eh4)
				$g[41].addEventHandler("eventMB", this, $eh5)
				$g[42].addEventHandler("eventMB", this, $eh6)
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
				enterf(1);	// busWatchHelper
				$stack[$fp+1] = $stack[$fp-3]%NSET
				if (!($stack[$fp-4] && $obj.a[$stack[$fp+1]]==$stack[$fp-3])) {
					$pc = 8
					continue
				}
				callf(3, $obj.dbus, TICKS, 0)
				continue
			case 6:
				callf(1, $obj.sbus, TICKS, 0)
				continue
			case 7:
				$pc = 8
			case 8:
				callf(3, $obj.abus, TICKS, 1)
				continue
			case 9:
				if (!($obj.a[$stack[$fp+1]]!=$stack[$fp-3])) {
					$pc = 10
					continue
				}
				$g[24]--
				returnf(3)
				continue
				$pc = 10
			case 10:
				$obj.state[$stack[$fp+1]]|=SHAREDBIT
				$obj.highlight($stack[$fp+1], 1)
				if (!($g[26])) {
					$pc = 12
					continue
				}
				showBusOp(sprintf("CPU %d reads a%d from memory - CPU(s) intervene and supply data", $obj.cpuN, $stack[$fp-3]))
				callf(1, $obj.dbus, TICKS, 0)
				continue
			case 11:
				$pc = 12
			case 12:
				if (!($stack[$fp-4]==1)) {
					$pc = 13
					continue
				}
				$obj.d[$stack[$fp+1]]=$stack[$fp-5]
				$obj.dR[$stack[$fp+1]].setTxt("%d", $stack[$fp-5])
				$obj.state[$stack[$fp+1]]=$obj.state[$stack[$fp+1]]&~DIRTYBIT
				$pc = 13
			case 13:
				$obj.setState($stack[$fp+1])
				$g[24]--
				if (!($stack[$fp-4]==0)) {
					$pc = 15
					continue
				}
				callf(1, $obj.sbus, TICKS, 0)
				continue
			case 14:
				$pc = 15
			case 15:
				returnf(3)
				continue
			case 16:
				enterf(2);	// busWatch
				$stack[$fp+1] = $stack[$fp-3]%NSET
				$g[25]=0
				$g[26]=0
				$stack[$fp+2] = 0
				$pc = 17
			case 17:
				if (!($stack[$fp+2]<NCPU)) {
					$pc = 21
					continue
				}
				if (!($stack[$fp+2]==$stack[$fp-4])) {
					$pc = 18
					continue
				}
				$pc = 20
				continue
				$pc = 18
			case 18:
				if (!($g[37][$stack[$fp+2]].a[$stack[$fp+1]]==$stack[$fp-3])) {
					$pc = 19
					continue
				}
				$g[25]=1
				$g[26]=($stack[$fp-5]==0) && $g[37][$stack[$fp+2]].state[$stack[$fp+1]]&DIRTYBIT
				$g[27]=$g[37][$stack[$fp+2]].d[$stack[$fp+1]]
				$pc = 21
				continue
				$pc = 19
			case 19:
				$pc = 20
			case 20:
				$stack[$fp+2]++
				$pc = 17
				continue
			case 21:
				callf(1, $g[34].abus, TICKS, 0)
				continue
			case 22:
				if (!($stack[$fp-5] && $g[26]==0)) {
					$pc = 24
					continue
				}
				callf(1, $g[34].dbus, TICKS, 0)
				continue
			case 23:
				$pc = 24
			case 24:
				$g[24]=NCPU-1
				$stack[$fp+2]=0
				$pc = 25
			case 25:
				if (!($stack[$fp+2]<NCPU)) {
					$pc = 28
					continue
				}
				if (!($stack[$fp+2]!=$stack[$fp-4])) {
					$pc = 26
					continue
				}
				fork(5, $g[37][$stack[$fp+2]], $stack[$fp-3], $stack[$fp-5], $stack[$fp-6])
				$pc = 26
			case 26:
				$pc = 27
			case 27:
				$stack[$fp+2]++
				$pc = 25
				continue
			case 28:
				$pc = 29
			case 29:
				if (!($g[24])) {
					$pc = 31
					continue
				}
				if (wait(1))
				return
				$pc = 30
			case 30:
				$pc = 29
				continue
			case 31:
				returnf(4)
				continue
			case 32:
				enterf(2);	// flush
				$stack[$fp+1] = $stack[$fp-4]%NSET
				$stack[$fp+2] = $obj.a[$stack[$fp+1]]
				callf(1, $obj.abus, TICKS, 0)
				continue
			case 33:
				callf(1, $obj.dbus, TICKS, 1)
				continue
			case 34:
				$g[32].setColour(BLUE)
				$g[31].setColour(RED)
				callf(16, $obj, $stack[$fp-4], $stack[$fp-3], 1, $obj.d[$stack[$fp+1]])
				continue
			case 35:
				if (!($g[25])) {
					$pc = 36
					continue
				}
				$g[33].setColour(MAGENTA)
				$pc = 36
			case 36:
				callf(3, $obj.sbus, TICKS, 1)
				continue
			case 37:
				$obj.state[$stack[$fp+1]]=$obj.state[$stack[$fp+1]]&~DIRTYBIT
				$obj.setState($stack[$fp+1])
				$g[34].stale[$stack[$fp+2]]=0
				$g[34].memR[$stack[$fp+2]].setBrush($g[15])
				$g[34].mem[$stack[$fp+2]]=$obj.d[$stack[$fp+1]]
				$g[34].memR[$stack[$fp+2]].setTxt("address: a%d data: %d", $stack[$fp+2], $g[34].mem[$stack[$fp+2]])
				returnf(2)
				continue
			case 38:
				enterf(0);	// getBusLock
				if (!($g[29]==$obj.cpuN)) {
					$pc = 39
					continue
				}
				returnf(0)
				continue
				$pc = 39
			case 39:
				$pc = 40
			case 40:
				if (!($g[29]>=0)) {
					$pc = 42
					continue
				}
				if (wait(1))
				return
				$pc = 41
			case 41:
				$pc = 40
				continue
			case 42:
				$g[29]=$obj.cpuN
				returnf(0)
				continue
			case 43:
				enterf(0);	// releaseBusLock
				$g[29]=-1
				if (wait(1))
				return
				$pc = 44
			case 44:
				returnf(0)
				continue
			case 45:
				enterf(1);	// read
				$stack[$fp+1] = $stack[$fp-3]%NSET
				if (!($g[29]==-1)) {
					$pc = 46
					continue
				}
				$obj.resetBus()
				$pc = 46
			case 46:
				if (!($stack[$fp-4])) {
					$pc = 48
					continue
				}
				callf(1, $obj.cpuabus, TICKS, 1)
				continue
			case 47:
				$pc = 48
			case 48:
				if (!($obj.a[$stack[$fp+1]]==$stack[$fp-3])) {
					$pc = 51
					continue
				}
				if (!($stack[$fp-4])) {
					$pc = 50
					continue
				}
				callf(3, $obj.cpudbus, TICKS, 1)
				continue
			case 49:
				$pc = 50
			case 50:
				returnf(2)
				continue
				$pc = 51
			case 51:
				if (!(($obj.state[$stack[$fp+1]]&DIRTYBIT) && ($g[28]!=2))) {
					$pc = 55
					continue
				}
				callf(38, $obj)
				continue
			case 52:
				showBusOp(sprintf("CPU %d flushes a%d from its cache to memory", $obj.cpuN, $stack[$fp-3]))
				$g[30]++
				$g[36].setTxt("bus cycles: %d", $g[30])
				$obj.resetBus()
				callf(32, $obj, $obj.cpuN, $obj.a[$stack[$fp+1]])
				continue
			case 53:
				callf(43, $obj)
				continue
			case 54:
				$pc = 55
			case 55:
				$obj.highlight($stack[$fp+1], 1)
				callf(38, $obj)
				continue
			case 56:
				$obj.resetBus()
				showBusOp(sprintf("CPU %d reads a%d from memory", $obj.cpuN, $stack[$fp-3]))
				$g[30]++
				$g[36].setTxt("bus cycles: %d", $g[30])
				callf(1, $obj.abus, TICKS, 1)
				continue
			case 57:
				$g[32].setColour(BLUE)
				callf(16, $obj, $stack[$fp-3], $obj.cpuN, 0, 0)
				continue
			case 58:
				if (!($g[26])) {
					$pc = 60
					continue
				}
				if (wait(TICKS))
				return
				$pc = 59
			case 59:
				$pc = 62
				continue
			case 60:
				callf(3, $g[34].dbus, TICKS, 1)
				continue
			case 61:
				$pc = 62
			case 62:
				if (!($g[25])) {
					$pc = 63
					continue
				}
				$g[33].setColour(MAGENTA)
				$pc = 63
			case 63:
				$g[31].setColour(RED)
				callf(3, $obj.sbus, TICKS, 0)
				continue
			case 64:
				callf(3, $obj.dbus, TICKS, 1)
				continue
			case 65:
				if (!($g[26])) {
					$pc = 66
					continue
				}
				$obj.d[$stack[$fp+1]]=$g[27]
				$obj.state[$stack[$fp+1]]=SD
				$pc = 67
				continue
			case 66:
				$g[34].highlight($stack[$fp-3], 1)
				$obj.d[$stack[$fp+1]]=$g[34].mem[$stack[$fp-3]]
				$obj.state[$stack[$fp+1]]=($g[25]) ? SND : NSND
				$pc = 67
			case 67:
				$obj.a[$stack[$fp+1]]=$stack[$fp-3]
				$obj.aR[$stack[$fp+1]].setTxt("a%d", $stack[$fp-3])
				$obj.dR[$stack[$fp+1]].setTxt("%d", $obj.d[$stack[$fp+1]])
				$obj.setState($stack[$fp+1])
				callf(43, $obj)
				continue
			case 68:
				if (!($stack[$fp-4])) {
					$pc = 70
					continue
				}
				callf(3, $obj.cpudbus, TICKS, 1)
				continue
			case 69:
				$pc = 70
			case 70:
				returnf(2)
				continue
			case 71:
				enterf(1);	// write
				$stack[$fp+1] = $stack[$fp-3]%NSET
				if (!($g[29]==-1)) {
					$pc = 72
					continue
				}
				$obj.resetBus()
				$pc = 72
			case 72:
				callf(1, $obj.cpudbus, TICKS, 0)
				continue
			case 73:
				callf(1, $obj.cpuabus, TICKS, 1)
				continue
			case 74:
				$obj.highlight($stack[$fp+1], 1)
				if (!($obj.a[$stack[$fp+1]]!=$stack[$fp-3])) {
					$pc = 76
					continue
				}
				callf(45, $obj, $stack[$fp-3], 0)
				continue
			case 75:
				$pc = 76
			case 76:
				$g[23]++
				if (!(($obj.state[$stack[$fp+1]]&SHAREDBIT) && ($g[28]!=1))) {
					$pc = 85
					continue
				}
				callf(38, $obj)
				continue
			case 77:
				$obj.resetBus()
				showBusOp(sprintf("CPU %d writes %d to memory address a%d", $obj.cpuN, $g[23], $stack[$fp-3]))
				$g[30]++
				$g[36].setTxt("bus cycles: %d", $g[30])
				$obj.a[$stack[$fp+1]]=$stack[$fp-3]
				$obj.aR[$stack[$fp+1]].setTxt("a%d", $stack[$fp-3])
				$obj.d[$stack[$fp+1]]=$g[23]
				$obj.dR[$stack[$fp+1]].setTxt("%d", $g[23])
				callf(1, $obj.abus, TICKS, 0)
				continue
			case 78:
				callf(1, $obj.dbus, TICKS, 1)
				continue
			case 79:
				$g[32].setColour(BLUE)
				$g[31].setColour(RED)
				callf(16, $obj, $stack[$fp-3], $obj.cpuN, 1, $obj.d[$stack[$fp+1]])
				continue
			case 80:
				callf(3, $obj.sbus, TICKS, 1)
				continue
			case 81:
				if (!($g[25])) {
					$pc = 82
					continue
				}
				$g[33].setColour(MAGENTA)
				$obj.state[$stack[$fp+1]]=SND
				$pc = 83
				continue
			case 82:
				$obj.state[$stack[$fp+1]]=NSND
				$pc = 83
			case 83:
				$obj.setState($stack[$fp+1])
				$g[34].mem[$stack[$fp-3]]=$obj.d[$stack[$fp+1]]
				$g[34].memR[$stack[$fp-3]].setTxt("address: a%d data: %d", $stack[$fp-3], $g[34].mem[$stack[$fp-3]])
				$g[34].stale[$stack[$fp-3]]=0
				$g[34].highlight($stack[$fp-3], 1)
				callf(43, $obj)
				continue
			case 84:
				returnf(1)
				continue
				$pc = 85
			case 85:
				$obj.a[$stack[$fp+1]]=$stack[$fp-3]
				$obj.aR[$stack[$fp+1]].setTxt("a%d", $stack[$fp-3])
				$obj.d[$stack[$fp+1]]=$g[23]
				$obj.dR[$stack[$fp+1]].setTxt("%d", $g[23])
				$obj.state[$stack[$fp+1]]=NSD
				$obj.setState($stack[$fp+1])
				$g[34].stale[$stack[$fp-3]]=1
				$g[34].memR[$stack[$fp-3]].setBrush($g[11])
				returnf(1)
				continue
			case 86:
				enterf(0);	// cpuButtonAction
				$obj.resetCPUs($obj.$parent.cpuN)
				if (!($g[29]==-1)) {
					$pc = 87
					continue
				}
				$g[37][$obj.$parent.cpuN].resetBus()
				$pc = 87
			case 87:
				$obj.$parent.buttonLock=1
				$g[37][$obj.$parent.cpuN].reset()
				$obj.$parent.r.setPen($g[5])
				$obj.setPen($g[9])
				if (!($obj.rw)) {
					$pc = 89
					continue
				}
				callf(71, $g[37][$obj.$parent.cpuN], $obj.addr)
				continue
			case 88:
				$pc = 91
				continue
			case 89:
				callf(45, $g[37][$obj.$parent.cpuN], $obj.addr, 1)
				continue
			case 90:
				$pc = 91
			case 91:
				$obj.resetCPUs($obj.$parent.cpuN)
				$obj.$parent.selected=0
				checkPoint()
				$obj.$parent.buttonLock=0
				returnf(0)
				continue
			case 92:
				enterf(0);	// cpuAction
				if (!($obj.selected && $obj.buttonLock==0)) {
					$pc = 94
					continue
				}
				callf(86, $obj.selected)
				continue
			case 93:
				$pc = 94
			case 94:
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
