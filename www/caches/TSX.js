"use strict"

function TSX(vplayer) {

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
	const ITALIC = vplayer.ITALIC
	const JUSTIFY = vplayer.JUSTIFY
	const MAGENTA = vplayer.MAGENTA
	const MB_CTRL = vplayer.MB_CTRL
	const MB_LEFT = vplayer.MB_LEFT
	const PROPAGATE = vplayer.PROPAGATE
	const RED = vplayer.RED
	const REMEMBER = vplayer.REMEMBER
	const ROUND_END = vplayer.ROUND_END
	const ROUND_START = vplayer.ROUND_START
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
	var Line = vplayer.Line
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
	const ABUSY = 280
	const ABUSW = 12
	const DBUSY = 240
	const DBUSW = 12
	const SBUSY = 320
	const SBUSW = 8
	const CACHEY = 370
	const CACHEW = MEMW
	const CACHEH = 60
	const CPUY = 490
	const CPUW = CACHEW
	const CPUH = 80
	const TY = CPUY+CPUH+5
	const BUSOPY = 208
	const NCPU = 3
	const NADDR = 4
	const NSET = 2
	const TICKS = 20
	const INVALID = 0
	const SHARED = 1
	const EXCLUSIVE = 2
	const MODIFIED = 3

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
		new Rectangle2($g[0], 0, 0, 0, 0, this.x, this.y-30, MEMW, 25, $g[3], $g[39], "Memory")
		this.abus = new BusArrow(this.x+50, this.y+MEMH, ABUSW, ABUSY-this.y-MEMH-ABUSW/2, GRAY32, BLUE)
		this.dbus = new BusArrow(this.x+100, this.y+MEMH, DBUSW, DBUSY-this.y-MEMH-DBUSW/2, GRAY32, RED)
		for (this.i = 0; this.i<NADDR; this.i++) {
			this.mem[this.i]=10
			this.stale[this.i]=0
			this.memR[this.i]=new Rectangle2($g[0], 0, 0, $g[1], $g[17], this.x+this.bgap, this.y+(this.i+1)*this.bgap+this.i*this.bh, this.bw, this.bh, $g[1], $g[37], "address: a%d data: %d", this.i, this.mem[this.i])
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
		$g[57].setTxt(s)
		let w = $g[57].getTxtW()+16
		$g[57].setPt(0, -w/2, -10)
		$g[57].setPt(1, w/2, 10)
		$g[57].setOpacity(1, TICKS, 1, 0)
	}

	function Cache(x, y, _cpuN) {
		VObj.call(this)
		this.aR = newArray(NSET), this.dR = newArray(NSET), this.stateR = newArray(NSET), this.tbitR = newArray(NSET)
		this.a = newArray(NSET), this.d = newArray(NSET), this.state = newArray(NSET), this.tbit = newArray(NSET)
		this.cpuN = _cpuN
		this.bgap = 3
		this.bw0 = 20
		this.bw1 = (CACHEW-5*this.bgap-2*this.bw0)/2
		this.bh = (CACHEH-(NSET+1)*this.bgap)/NSET
		this.sharedbus = new BusArrow(x+this.bgap+this.bw0/2, SBUSY+SBUSW/2, SBUSW, y-SBUSY-SBUSW/2, GRAY32, MAGENTA)
		this.abus = new BusArrow(x+2*this.bgap+this.bw0+this.bw1/2, ABUSY+ABUSW/2, ABUSW, y-ABUSY-ABUSW/2, GRAY32, BLUE)
		this.dbus = new BusArrow(x+3*this.bgap+this.bw0+3*this.bw1/2, DBUSY+DBUSW/2, DBUSW, y-DBUSY-DBUSW/2, GRAY32, RED)
		this.cpuabus = new BusArrow(x+CACHEW/4, y+CACHEH, ABUSW, CPUY-CACHEY-CACHEH, GRAY32, BLUE)
		this.cpudbus = new BusArrow(x+3*CACHEW/4, y+CACHEH, DBUSW, CPUY-CACHEY-CACHEH, GRAY32, RED)
		this.r = new Rectangle2($g[0], 0, 0, $g[1], $g[29], x, y, CACHEW, CACHEH)
		this.r.setRounded(4, 4)
		new Txt($g[0], 0, HLEFT|VTOP, x+CACHEW-20, y-30, $g[3], $g[39], "Cache %d", this.cpuN)
		$g[57].moveToFront()
		for (this.i = 0; this.i<NSET; this.i++) {
			this.state[this.i]=INVALID
			this.stateR[this.i]=new Rectangle2($g[0], 0, 0, $g[1], $g[17], x+this.bgap, y+(this.i+1)*this.bgap+this.i*this.bh, this.bw0, this.bh, $g[1], $g[37], "I")
			this.stateR[this.i].setRounded(2, 2)
			this.tbit[this.i]=0
			this.tbitR[this.i]=new Rectangle2($g[0], 0, 0, $g[1], $g[17], x+2*this.bgap+this.bw0, y+(this.i+1)*this.bgap+this.i*this.bh, this.bw0, this.bh, $g[1], $g[37])
			this.tbitR[this.i].setRounded(2, 2)
			this.a[this.i]=0
			this.aR[this.i]=new Rectangle2($g[0], 0, 0, $g[1], $g[17], x+3*this.bgap+2*this.bw0, y+(this.i+1)*this.bgap+this.i*this.bh, this.bw1, this.bh, $g[1], $g[37])
			this.aR[this.i].setRounded(2, 2)
			this.d[this.i]=0
			this.dR[this.i]=new Rectangle2($g[0], 0, 0, $g[1], $g[17], x+4*this.bgap+2*this.bw0+this.bw1, y+(this.i+1)*this.bgap+this.i*this.bh, this.bw1, this.bh, $g[1], $g[37])
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
		this.tbitR[set].setBrush(brush)
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
		$g[56].abus.reset()
		$g[56].dbus.reset()
		$g[54].setColour(GRAY32)
		$g[53].setColour(GRAY32)
		$g[55].setColour(GRAY32)
		$g[56].reset()
		for (let i = 0; i<NCPU; i++) {
			$g[59][i].abus.reset()
			$g[59][i].dbus.reset()
			$g[59][i].sharedbus.reset()
		}
		$g[57].setOpacity(0, TICKS, 1, 0)
	}

	Cache.prototype.startTransaction = function() {
		this.r.setPen($g[35])
	}

	Cache.prototype.endTransaction = function() {
		this.r.setPen($g[1])
		for (let set = 0; set<NSET; set++) {
			this.tbit[set]=0
			this.tbitR[set].setTxt("")
			if (this.state[set]==MODIFIED) {
				$g[56].stale[this.a[set]]=1
				$g[56].memR[this.a[set]].setBrush($g[29])
			}
		}
	}

	Cache.prototype.abortTransaction = function() {
		this.r.setPen($g[1])
		for (let set = 0; set<NSET; set++) {
			if ((this.state[set]==MODIFIED) && this.tbit[set]) {
				this.state[set]=INVALID
				this.stateR[set].setTxt("I")
			}
			this.tbit[set]=0
			this.tbitR[set].setTxt("")
		}
	}

	function CPU(x, y, _cpuN) {
		VObj.call(this)
		this.cpuN = _cpuN
		this.bgap = 3
		this.bw = (CPUW-4*this.bgap)/3
		this.bh = (CPUH-(NADDR+1)*this.bgap)/NADDR
		this.tbw = (CPUW-4*this.bgap)/3
		this.buttonLock = 0
		this.selected
		this.transaction = 0
		this.readB = newArray(NADDR)
		this.incB = newArray(NADDR)
		this.decB = newArray(NADDR)
		this.r = new Rectangle2($g[0], 0, 0, $g[1], $g[29], x, y, CPUW, CPUH)
		this.r.setRounded(4, 4)
		new Txt($g[0], 0, HLEFT|VTOP, x+CPUW-20, y-30, $g[3], $g[39], "CPU %d", this.cpuN)
		for (this.i = 0; this.i<NADDR; this.i++) {
			this.readB[this.i]=new this.CPUButton(this, $g[0], 0, x+this.bgap, y+(this.i+1)*this.bgap+this.i*this.bh, this.bw, this.i)
			this.incB[this.i]=new this.CPUButton(this, $g[0], 1, x+2*this.bgap+this.bw, y+(this.i+1)*this.bgap+this.i*this.bh, this.bw, this.i)
			this.decB[this.i]=new this.CPUButton(this, $g[0], 2, x+3*this.bgap+2*this.bw, y+(this.i+1)*this.bgap+this.i*this.bh, this.bw, this.i)
		}
		this.tR = new Rectangle($g[0], 0, 0, $g[1], $g[29], x, TY, 0, 0, CPUW, 2*this.bgap+this.bh)
		this.tR.setRounded(4, 4)
		this.xbeginButton = new SimpleButton($g[0], x+this.bgap, TY+this.bgap, this.tbw, this.bh, $g[17], $g[30], $g[10], $g[12], $g[1], $g[37], $g[38], "xbegin")
		this.xendButton = new SimpleButton($g[0], x+2*this.bgap+this.tbw, TY+this.bgap, this.tbw, this.bh, $g[17], $g[30], $g[10], $g[12], $g[1], $g[37], $g[38], "xend")
		this.xabortButton = new SimpleButton($g[0], x+3*this.bgap+2*this.tbw, TY+this.bgap, this.tbw, this.bh, $g[17], $g[30], $g[10], $g[12], $g[1], $g[37], $g[38], "xabort")
		this.abortLR = new Line($g[0], 0, 0, $g[31], x, y, 4, 4, CPUW-8, CPUH-8)
		this.abortRL = new Line($g[0], 0, 0, $g[31], x, y, 4, CPUH-4, CPUW-8, -CPUH+8)
		this.abortLR.setOpacity(0)
		this.abortRL.setOpacity(0)
		this.tStatus = new Rectangle2($g[0], 0, 0, 0, 0, x, TY+3*this.bgap+this.bh, CPUW, 20, $g[3], $g[39], "")
		this.xbeginButton.addEventHandler("eventMB", this, this.$eh3)
		this.xendButton.addEventHandler("eventMB", this, this.$eh4)
		this.xabortButton.addEventHandler("eventMB", this, this.$eh5)
	}
	CPU.prototype = Object.create(VObj.prototype)

	CPU.prototype.CPUButton = function($parent, $grp, _op, x, y, bw, _addr) {
		this.$parent = $parent
		SimpleButton.call(this, $grp, x, y, bw, this.$parent.bh, $g[17], $g[30], $g[10], $g[12], $g[1], $g[37], $g[38], "")
		this.op = _op
		this.addr = _addr
		this.setTxt(this.op==0 ? "read a%d" : this.op==1 ? "inc a%d" : "dec a%d", this.addr)
		this.addEventHandler("eventMB", this, this.$eh2)
	}
	CPU.prototype.CPUButton.prototype = Object.create(SimpleButton.prototype)

	CPU.prototype.CPUButton.prototype.select = function() {
		if (this.$parent.selected==this) {
			this.$parent.selected.setPen($g[10])
			this.$parent.selected=0
		} else {
			if (this.$parent.selected)
			this.$parent.selected.setPen($g[10])
			this.$parent.selected=this
			this.$parent.selected.setPen($g[34])
		}
	}

	CPU.prototype.CPUButton.prototype.resetCPUs = function(cpuN) {
		for (let i = 0; i<NCPU; i++) {
			if ($g[60][i].selected==0) {
				$g[59][i].reset()
				$g[60][i].resetButtons()
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
			$g[60][i].resetButtons()
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
			if (this.selected!=this.readB[i])
			this.readB[i].setPen($g[10])
			if (this.selected!=this.incB[i])
			this.incB[i].setPen($g[10])
			if (this.selected!=this.decB[i])
			this.decB[i].setPen($g[10])
			this.tStatus.setTxt(this.transaction ? "Transaction in Progress" : "")
			this.abortLR.setOpacity(0)
			this.abortRL.setOpacity(0)
		}
	}

	CPU.prototype.startTransaction = function() {
		if (this.transaction==0 && this.buttonLock==0) {
			this.transaction=1
			$g[59][this.cpuN].startTransaction()
			this.r.setPen($g[35])
			this.abortLR.setOpacity(0)
			this.abortRL.setOpacity(0)
			this.tStatus.setTxt("Transaction in Progress")
		}
	}

	CPU.prototype.endTransaction = function() {
		if (this.transaction && this.buttonLock==0) {
			this.transaction=0
			$g[59][this.cpuN].endTransaction()
			this.r.setPen($g[1])
			this.tStatus.setTxt("Transaction COMMIT")
		}
	}

	CPU.prototype.abortTransaction = function() {
		if (this.transaction && this.buttonLock==0) {
			this.transaction=0
			$g[59][this.cpuN].abortTransaction()
			this.r.setPen($g[1])
			this.abortRL.setOpacity(1)
			this.abortLR.setOpacity(1)
			this.tStatus.setTxt("Transaction ABORT")
		}
	}

	CPU.prototype.$eh3 = function(down, flags, $2, $3) {
		if (down && (flags&MB_LEFT)) {
			this.startTransaction()
			start()
		}
	}

	CPU.prototype.$eh4 = function(down, flags, $2, $3) {
		if (down && (flags&MB_LEFT)) {
			this.endTransaction()
			start()
		}
	}

	CPU.prototype.$eh5 = function(down, flags, $2, $3) {
		if (down && (flags&MB_LEFT)) {
			this.abortTransaction()
			start()
		}
	}

	function startAction() {
		start()
		for (let i = 0; i<NCPU; i++)
		fork(105, $g[60][i])
	}

	function $eh6(down, flags, $2, $3) {
		if (down && (flags&MB_LEFT)) {
			reset()
		}
		return 0
	}

	function $eh7(down, flags, $2, $3) {
		if (down && (flags&MB_LEFT)) {
			if ($g[48]==2) {
				$g[48]=0
				$g[62].setTxt("bug free!")
			} else {
				$g[48]++
				$g[62].setTxt("bug %d", $g[48]-1)
			}
		}
		return 0
	}

	function $eh8(down, flags, $2, $3) {
		if (down && (flags&MB_LEFT))
		getURL("https://www.scss.tcd.ie/Jeremy.Jones/VivioJS/caches/TSXHelp.htm")
		return 0
	}

	function $eh9(down, flags, $2, $3) {
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
				$g[31] = new SolidPen(0, 4, RED, ROUND_START|ROUND_END)
				$g[32] = new SolidPen(0, 2, rgba(0, 0.5, 0), ROUND_END)
				$g[33] = new SolidPen(0, 2, GRAY64, ROUND_END)
				$g[34] = new SolidPen(0, 2, rgba(1, 0.65000000000000002, 0), ROUND_END)
				$g[35] = new SolidPen(0, 2, RED, ROUND_END)
				$g[36] = new SolidBrush(rgba(0, 0, 0.40000000000000002))
				$g[37] = new Font("Calibri Light", 16, 0)
				$g[38] = new Font("Calibri Light", 14, 0)
				$g[39] = new Font("Calibri", 18, SMALLCAPS)
				$g[40] = new Font("Calibri", 24, SMALLCAPS)
				$g[41] = new Font("Calibri Light", 18, 0)
				$g[42] = new Font("Calibri", 10, ITALIC)
				$g[43] = new Font("Calibri", 32, SMALLCAPS)
				setBgBrush($g[30])
				$g[44] = new Rectangle2($g[0], 0, 0, 0, $g[36], TITLEX, TITLEY, W/2, TITLEH, $g[2], $g[43], "Intel TSX MESI Cache")
				$g[44].setRounded(5, 5)
				$g[44].setPt(1, $g[44].getTxtW()+16, TITLEH)
				$g[45] = "Like real hardware, the CPUs can operate in\n"
				$g[45]+="parallel. Try pressing a button on different\n"
				$g[45]+="CPUs \"simultaneously\". Alternatively select\n"
				$g[45]+="buttons on different CPUs with the CTRL key and\n"
				$g[45]+="click on the last button without CTRL to start\n"
				$g[45]+="simultaneous transactions."
				new Rectangle2($g[0], 0, HLEFT|VCENTRE|JUSTIFY, 0, 0, INFOX, INFOY, INFOW, INFOH, $g[1], $g[41], $g[45])
				$g[46] = new Txt($g[0], 0, 0, W-40, H-20, $g[14], $g[42], "23-Nov-17")
				$g[47] = (W-3*CPUW-2*CPUW)/2
				$g[48] = 0
				$g[49] = -1
				$g[50] = 0
				$g[51] = -1
				$g[52] = 0
				$g[53] = new Bus(10, DBUSY, DBUSW, W-40, GRAY32)
				new Txt($g[0], 0, 0, $g[47]+CACHEW+CACHEW/2-40, DBUSY-20, $g[3], $g[39], "Data bus")
				$g[54] = new Bus(20, ABUSY, ABUSW, W-40, GRAY32)
				new Txt($g[0], 0, 0, $g[47]+CACHEW+CACHEW/2, ABUSY-20, $g[5], $g[39], "Address bus")
				$g[55] = new Bus(30, SBUSY, SBUSW, W-40, GRAY32)
				new Txt($g[0], 0, 0, $g[47]+CACHEW+CACHEW/2, SBUSY-15, $g[7], $g[39], "Shared")
				$g[56] = new Memory((W-MEMW)/2, MEMY)
				$g[57] = new Rectangle($g[0], 0, 0, $g[1], $g[17], W/2, BUSOPY, 0, 0, 0, 0, 0, $g[41])
				$g[57].setOpacity(0)
				$g[57].setRounded(4, 4)
				$g[58] = new Txt($g[0], 0, HLEFT, 2*W/3, (ABUSY+DBUSY)/2, 0, $g[39], "Bus cycles: %d", $g[52])
				$g[59] = newArray(NCPU)
				$g[60] = newArray(NCPU)
				$g[59][0]=new Cache((W-3*CACHEW-2*CACHEW)/2, CACHEY, 0)
				$g[59][1]=new Cache((W-3*CACHEW-2*CACHEW)/2+CACHEW+CACHEW, CACHEY, 1)
				$g[59][2]=new Cache((W-3*CACHEW-2*CACHEW)/2+2*CACHEW+2*CACHEW, CACHEY, 2)
				$g[60][0]=new CPU((W-3*CPUW-2*CPUW)/2, CPUY, 0)
				$g[60][1]=new CPU((W-3*CPUW-2*CPUW)/2+CPUW+CPUW, CPUY, 1)
				$g[60][2]=new CPU((W-3*CPUW-2*CPUW)/2+2*CPUW+2*CPUW, CPUY, 2)
				$g[61] = new SimpleButton($g[0], W-2*BW-2*BW/8, BY, BW, BH, $g[17], $g[30], $g[33], $g[12], $g[1], $g[37], $g[38], "reset")
				$g[62] = new SimpleButton($g[0], W-BW-BW/8, BY, BW, BH, $g[17], $g[30], $g[33], $g[12], $g[1], $g[37], $g[38], "bug free!")
				$g[63] = new SimpleButton($g[0], W-2*BW-2*BW/8, BY+BH+BH/4, BW, BH, $g[17], $g[30], $g[33], $g[12], $g[1], $g[37], $g[38], "help")
				$g[64] = new SimpleButton($g[0], W-BW-BW/8, BY+BH+BH/4, BW, BH, $g[17], $g[30], $g[33], $g[12], $g[1], $g[37], $g[38], "VivioJS help")
				$g[61].addEventHandler("eventMB", this, $eh6)
				$g[62].addEventHandler("eventMB", this, $eh7)
				$g[63].addEventHandler("eventMB", this, $eh8)
				$g[64].addEventHandler("eventMB", this, $eh9)
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
				$g[54].setColour(BLUE)
				$g[53].setColour(RED)
				callf(1, $g[56].abus, TICKS, 0)
				continue
			case 8:
				callf(1, $g[56].dbus, TICKS, 1)
				continue
			case 9:
				$obj.state[$stack[$fp+1]]=EXCLUSIVE
				$obj.stateR[$stack[$fp+1]].setTxt("E")
				$g[56].stale[$stack[$fp+2]]=0
				$g[56].memR[$stack[$fp+2]].setBrush($g[17])
				$g[56].mem[$stack[$fp+2]]=$obj.d[$stack[$fp+1]]
				$g[56].memR[$stack[$fp+2]].setTxt("address: a%d data: %d", $stack[$fp+2], $g[56].mem[$stack[$fp+2]])
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
				$g[50]=($obj.state[$stack[$fp+1]]==MODIFIED && $obj.tbit[$stack[$fp+1]]) ? 0 : 1
				if (!($obj.state[$stack[$fp+1]]==MODIFIED)) {
					$pc = 11
					continue
				}
				$g[49]=$obj.cpuN
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
					$pc = 20
					continue
				}
				if (!($obj.state[$stack[$fp+1]]==MODIFIED && $obj.tbit[$stack[$fp+1]])) {
					$pc = 15
					continue
				}
				$g[49]=-1
				$g[60][$obj.cpuN].abortTransaction()
				returnf(2)
				continue
				$pc = 15
			case 15:
				if (!(($obj.state[$stack[$fp+1]]==EXCLUSIVE) || ($obj.state[$stack[$fp+1]]==MODIFIED))) {
					$pc = 18
					continue
				}
				if (!($obj.state[$stack[$fp+1]]==MODIFIED)) {
					$pc = 17
					continue
				}
				$g[59][$obj.cpuN].highlight($stack[$fp+1], 1)
				callf(1, $g[59][$obj.cpuN].dbus, TICKS, 0)
				continue
			case 16:
				$pc = 17
			case 17:
				$obj.state[$stack[$fp+1]]=SHARED
				$obj.stateR[$stack[$fp+1]].setTxt("S")
				$obj.highlight($stack[$fp+1], 1)
				$pc = 18
			case 18:
				callf(1, $obj.sharedbus, TICKS, 1)
				continue
			case 19:
				$g[55].setColour(MAGENTA)
				$pc = 22
				continue
			case 20:
				if (!($obj.tbit[$stack[$fp+1]])) {
					$pc = 21
					continue
				}
				$g[60][$obj.cpuN].abortTransaction()
				$pc = 21
			case 21:
				$obj.state[$stack[$fp+1]]=INVALID
				$obj.stateR[$stack[$fp+1]].setTxt("I")
				$obj.highlight($stack[$fp+1], 1)
				$pc = 22
			case 22:
				returnf(2)
				continue
			case 23:
				enterf(1);	// busWatch
				$g[49]=-1
				$g[50]=0
				$stack[$fp+1] = 0
				$pc = 24
			case 24:
				if (!($stack[$fp+1]<NCPU)) {
					$pc = 27
					continue
				}
				if (!($stack[$fp+1]!=$stack[$fp-4])) {
					$pc = 25
					continue
				}
				fork(10, $g[59][$stack[$fp+1]], $stack[$fp-3], $stack[$fp-5])
				$pc = 25
			case 25:
				$pc = 26
			case 26:
				$stack[$fp+1]++
				$pc = 24
				continue
			case 27:
				if (!($stack[$fp-5]==0)) {
					$pc = 30
					continue
				}
				if (wait(2*TICKS))
				return
				$pc = 28
			case 28:
				callf(3, $g[59][$stack[$fp-4]].sharedbus, TICKS, 0)
				continue
			case 29:
				$pc = 30
			case 30:
				returnf(3)
				continue
			case 31:
				enterf(0);	// getBusLock
				if (!($g[51]==$obj.cpuN)) {
					$pc = 32
					continue
				}
				returnf(0)
				continue
				$pc = 32
			case 32:
				$pc = 33
			case 33:
				if (!($g[51]>=0)) {
					$pc = 35
					continue
				}
				if (wait(1))
				return
				$pc = 34
			case 34:
				$pc = 33
				continue
			case 35:
				$g[51]=$obj.cpuN
				returnf(0)
				continue
			case 36:
				enterf(0);	// releaseBusLock
				$g[51]=-1
				if (wait(1))
				return
				$pc = 37
			case 37:
				returnf(0)
				continue
			case 38:
				enterf(1);	// read
				$g[57].setOpacity(0)
				$stack[$fp+1] = $stack[$fp-3]%NSET
				if (!($stack[$fp-4])) {
					$pc = 40
					continue
				}
				callf(1, $obj.cpuabus, TICKS, 1)
				continue
			case 39:
				$pc = 40
			case 40:
				if (!($obj.a[$stack[$fp+1]]!=$stack[$fp-3] && $obj.tbit[$stack[$fp+1]]==1)) {
					$pc = 41
					continue
				}
				$g[60][$obj.cpuN].abortTransaction()
				returnf(2)
				continue
				$pc = 41
			case 41:
				if (!(($obj.a[$stack[$fp+1]]==$stack[$fp-3]) && ($obj.state[$stack[$fp+1]]!=INVALID))) {
					$pc = 48
					continue
				}
				if (!($g[60][$obj.cpuN].transaction && $obj.tbit[$stack[$fp+1]]==0 && $obj.state[$stack[$fp+1]]==MODIFIED)) {
					$pc = 45
					continue
				}
				showBusOp(sprintf("CPU %d flushes a%d from its cache to memory", $obj.cpuN, $stack[$fp-3]))
				callf(5, $obj, $stack[$fp-3])
				continue
			case 42:
				$g[52]++
				$g[58].setTxt("Bus cycles: %d", $g[52])
				callf(36, $obj)
				continue
			case 43:
				callf(31, $obj)
				continue
			case 44:
				$obj.resetBus()
				$pc = 45
			case 45:
				$obj.tbit[$stack[$fp+1]]=$g[60][$obj.cpuN].transaction
				$obj.tbitR[$stack[$fp+1]].setTxt($obj.tbit[$stack[$fp+1]] ? "T" : "")
				$obj.highlight($stack[$fp+1], 1)
				if (!($stack[$fp-4])) {
					$pc = 47
					continue
				}
				callf(3, $obj.cpudbus, TICKS, 1)
				continue
			case 46:
				$pc = 47
			case 47:
				returnf(2)
				continue
				$pc = 48
			case 48:
				callf(31, $obj)
				continue
			case 49:
				$obj.resetBus()
				if (!(($obj.state[$stack[$fp+1]]==MODIFIED) && ($g[48]!=2))) {
					$pc = 53
					continue
				}
				showBusOp(sprintf("CPU %d flushes a%d from its cache to memory", $obj.cpuN, $stack[$fp-3]))
				callf(5, $obj, $stack[$fp-3])
				continue
			case 50:
				$g[52]++
				$g[58].setTxt("Bus cycles: %d", $g[52])
				callf(36, $obj)
				continue
			case 51:
				callf(31, $obj)
				continue
			case 52:
				$obj.resetBus()
				$pc = 53
			case 53:
				showBusOp(sprintf("CPU %d reads a%d from memory", $obj.cpuN, $stack[$fp-3]))
				$g[52]++
				$g[58].setTxt("Bus cycles: %d", $g[52])
				$obj.highlight($stack[$fp+1], 1)
				callf(1, $obj.abus, TICKS, 1)
				continue
			case 54:
				$g[54].setColour(BLUE)
				callf(1, $g[56].abus, TICKS, 0)
				continue
			case 55:
				fork(23, $obj, $stack[$fp-3], $obj.cpuN, 0)
				if (wait(TICKS))
				return
				$pc = 56
			case 56:
				if (!($g[49]>=0)) {
					$pc = 60
					continue
				}
				if (wait(TICKS))
				return
				$pc = 57
			case 57:
				showBusOp(sprintf("CPU %d reads a%d from memory - CPU %d intervenes and supplies data from its cache", $obj.cpuN, $stack[$fp-3], $g[49]))
				$g[53].setColour(RED)
				callf(1, $g[56].dbus, TICKS, 0)
				continue
			case 58:
				callf(3, $obj.dbus, TICKS, 1)
				continue
			case 59:
				$g[56].mem[$stack[$fp-3]]=$g[59][$g[49]].d[$stack[$fp+1]]
				$g[56].stale[$stack[$fp-3]]=0
				$g[56].memR[$stack[$fp-3]].setBrush($g[17])
				$g[56].memR[$stack[$fp-3]].setTxt("address: a%d data: %d", $stack[$fp-3], $g[56].mem[$stack[$fp-3]])
				$g[56].highlight($stack[$fp-3], 1)
				$pc = 63
				continue
			case 60:
				$g[56].highlight($stack[$fp-3], 1)
				callf(3, $g[56].dbus, TICKS, 1)
				continue
			case 61:
				$g[53].setColour(RED)
				callf(3, $obj.dbus, TICKS, 1)
				continue
			case 62:
				$pc = 63
			case 63:
				$obj.a[$stack[$fp+1]]=$stack[$fp-3]
				$obj.aR[$stack[$fp+1]].setTxt("a%d", $stack[$fp-3])
				$obj.d[$stack[$fp+1]]=$g[56].mem[$stack[$fp-3]]
				$obj.dR[$stack[$fp+1]].setTxt("%d", $obj.d[$stack[$fp+1]])
				$obj.state[$stack[$fp+1]]=$g[50] ? SHARED : EXCLUSIVE
				$obj.stateR[$stack[$fp+1]].setTxt($g[50] ? "S" : "E")
				$obj.tbit[$stack[$fp+1]]=$g[60][$obj.cpuN].transaction
				$obj.tbitR[$stack[$fp+1]].setTxt($obj.tbit[$stack[$fp+1]] ? "T" : "")
				callf(36, $obj)
				continue
			case 64:
				if (!($stack[$fp-4])) {
					$pc = 66
					continue
				}
				callf(3, $obj.cpudbus, TICKS, 1)
				continue
			case 65:
				$pc = 66
			case 66:
				returnf(2)
				continue
			case 67:
				enterf(3);	// write
				$g[57].setOpacity(0)
				$stack[$fp+1] = $stack[$fp-3]%NSET
				callf(1, $obj.cpudbus, TICKS, 0)
				continue
			case 68:
				callf(1, $obj.cpuabus, TICKS, 1)
				continue
			case 69:
				$obj.highlight($stack[$fp+1], 1)
				$stack[$fp+2] = $g[60][$obj.cpuN].transaction
				if (!(($obj.a[$stack[$fp+1]]==$stack[$fp-3]) && (($obj.state[$stack[$fp+1]]==EXCLUSIVE) || ($obj.state[$stack[$fp+1]]==MODIFIED)))) {
					$pc = 74
					continue
				}
				if (!($stack[$fp+2] && $obj.state[$stack[$fp+1]]==MODIFIED && $obj.tbit[$stack[$fp+1]]==0)) {
					$pc = 71
					continue
				}
				showBusOp(sprintf("CPU %d flushes a%d from its cache to memory", $obj.cpuN, $stack[$fp-3]))
				callf(5, $obj, $stack[$fp-3])
				continue
			case 70:
				$g[52]++
				$g[58].setTxt("Bus cycles: %d", $g[52])
				$pc = 71
			case 71:
				$obj.setValues($stack[$fp+1], $stack[$fp-3], $obj.d[$stack[$fp+1]]+$stack[$fp-4])
				$obj.state[$stack[$fp+1]]=MODIFIED
				$obj.stateR[$stack[$fp+1]].setTxt("M")
				if (!($stack[$fp+2])) {
					$pc = 72
					continue
				}
				$obj.tbit[$stack[$fp+1]]=1
				$obj.tbitR[$stack[$fp+1]].setTxt("T")
				$pc = 73
				continue
			case 72:
				$g[56].stale[$stack[$fp-3]]=1
				$g[56].memR[$stack[$fp-3]].setBrush($g[29])
				$pc = 73
			case 73:
				returnf(2)
				continue
				$pc = 74
			case 74:
				$pc = 75
			case 75:
				if (!(1)) {
					$pc = 95
					continue
				}
				if (!(($obj.state[$stack[$fp+1]]==INVALID) || ($obj.a[$stack[$fp+1]]!=$stack[$fp-3]))) {
					$pc = 78
					continue
				}
				$stack[$fp+3] = $g[60][$obj.cpuN].transaction
				callf(38, $obj, $stack[$fp-3], 0)
				continue
			case 76:
				if (!(($stack[$fp+3]==1) && ($g[60][$obj.cpuN].transaction==0))) {
					$pc = 77
					continue
				}
				returnf(2)
				continue
				$pc = 77
			case 77:
				$pc = 78
			case 78:
				if (!($obj.state[$stack[$fp+1]]==SHARED)) {
					$pc = 91
					continue
				}
				callf(31, $obj)
				continue
			case 79:
				if (!($obj.state[$stack[$fp+1]]==INVALID)) {
					$pc = 80
					continue
				}
				$pc = 75
				continue
				$pc = 80
			case 80:
				$obj.resetBus()
				if (!($stack[$fp+2]==0)) {
					$pc = 81
					continue
				}
				showBusOp(sprintf("CPU %d \"writes\" to a%d to invalidate other cached copies", $obj.cpuN, $stack[$fp-3]))
				$pc = 82
				continue
			case 81:
				showBusOp(sprintf("CPU %d writes %d to a%d in memory", $obj.cpuN, $obj.d[$stack[$fp+1]]+$stack[$fp-4], $stack[$fp-3]))
				$pc = 82
			case 82:
				$g[52]++
				$g[58].setTxt("Bus cycles: %d", $g[52])
				$obj.setValues($stack[$fp+1], $stack[$fp-3], $obj.d[$stack[$fp+1]]+$stack[$fp-4])
				callf(1, $obj.abus, TICKS, 0)
				continue
			case 83:
				callf(1, $obj.dbus, TICKS, 1)
				continue
			case 84:
				$g[54].setColour(BLUE)
				$g[53].setColour(RED)
				if (!($stack[$fp+2]==0)) {
					$pc = 87
					continue
				}
				callf(1, $g[56].abus, TICKS, 0)
				continue
			case 85:
				callf(1, $g[56].dbus, TICKS, 0)
				continue
			case 86:
				$pc = 87
			case 87:
				fork(23, $obj, $stack[$fp-3], $obj.cpuN, 1)
				if (!($stack[$fp+2]==0)) {
					$pc = 88
					continue
				}
				$g[56].mem[$stack[$fp-3]]=$obj.d[$stack[$fp+1]]
				$g[56].memR[$stack[$fp-3]].setTxt("address: a%d data: %d", $stack[$fp-3], $g[56].mem[$stack[$fp-3]])
				$g[56].highlight($stack[$fp-3], 1)
				$obj.state[$stack[$fp+1]]=EXCLUSIVE
				$obj.stateR[$stack[$fp+1]].setTxt("E")
				$pc = 89
				continue
			case 88:
				$obj.state[$stack[$fp+1]]=MODIFIED
				$obj.stateR[$stack[$fp+1]].setTxt("M")
				$obj.tbit[$stack[$fp+1]]=1
				$obj.tbitR[$stack[$fp+1]].setTxt("T")
				$pc = 89
			case 89:
				callf(36, $obj)
				continue
			case 90:
				$pc = 95
				continue
				$pc = 94
				continue
			case 91:
				if (!(($obj.state[$stack[$fp+1]]==EXCLUSIVE) || ($obj.state[$stack[$fp+1]]==MODIFIED))) {
					$pc = 93
					continue
				}
				$obj.setValues($stack[$fp+1], $stack[$fp-3], $obj.d[$stack[$fp+1]]+$stack[$fp-4])
				$obj.state[$stack[$fp+1]]=MODIFIED
				$obj.stateR[$stack[$fp+1]].setTxt("M")
				if (!($g[60][$obj.cpuN].transaction==0)) {
					$pc = 92
					continue
				}
				$g[56].stale[$stack[$fp-3]]=1
				$g[56].memR[$stack[$fp-3]].setBrush($g[29])
				$pc = 92
			case 92:
				$g[57].setOpacity(0)
				$pc = 95
				continue
				$pc = 93
			case 93:
				$pc = 94
			case 94:
				$pc = 75
				continue
			case 95:
				returnf(2)
				continue
			case 96:
				enterf(0);	// cpuButtonAction
				$obj.resetCPUs($obj.$parent.cpuN)
				if (!($g[51]==-1)) {
					$pc = 97
					continue
				}
				$g[59][$obj.$parent.cpuN].resetBus()
				$pc = 97
			case 97:
				$obj.$parent.buttonLock=1
				$g[59][$obj.$parent.cpuN].reset()
				$obj.setPen($g[32])
				if (!($obj.op==0)) {
					$pc = 99
					continue
				}
				callf(38, $g[59][$obj.$parent.cpuN], $obj.addr, 1)
				continue
			case 98:
				$pc = 104
				continue
			case 99:
				if (!($obj.op==1)) {
					$pc = 101
					continue
				}
				callf(67, $g[59][$obj.$parent.cpuN], $obj.addr, 1)
				continue
			case 100:
				$pc = 103
				continue
			case 101:
				callf(67, $g[59][$obj.$parent.cpuN], $obj.addr, -1)
				continue
			case 102:
				$pc = 103
			case 103:
				$pc = 104
			case 104:
				$obj.$parent.selected=0
				checkPoint()
				$obj.$parent.buttonLock=0
				returnf(0)
				continue
			case 105:
				enterf(0);	// cpuAction
				if (!($obj.selected && $obj.buttonLock==0)) {
					$pc = 107
					continue
				}
				callf(96, $obj.selected)
				continue
			case 106:
				$pc = 107
			case 107:
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
