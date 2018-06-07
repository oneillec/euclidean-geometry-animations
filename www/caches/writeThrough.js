"use strict"

function writeThrough(vplayer) {

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
	const ABUSY = 300
	const ABUSW = 12
	const DBUSY = 250
	const DBUSW = 12
	const CACHEY = 380
	const CACHEW = MEMW
	const CACHEH = 60
	const CPUY = 500
	const CPUW = CACHEW
	const CPUH = MEMH
	const BUSOPY = 210
	const NCPU = 3
	const NADDR = 4
	const NSET = 2
	const TICKS = 20
	const VALID = 0
	const INVALID = 1
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
		this.memR = newArray(NADDR)
		this.x = _x
		this.y = _y
		this.bgap = 3
		this.bw = MEMW-2*this.bgap
		this.bh = (MEMH-(NADDR+1)*this.bgap)/NADDR
		this.r = new Rectangle2($g[0], 0, 0, $g[1], $g[10], this.x, this.y, MEMW, MEMH)
		this.r.setRounded(4, 4)
		new Rectangle2($g[0], 0, 0, 0, 0, this.x, this.y-30, MEMW, 25, $g[7], $g[17], "Memory")
		this.abus = new BusArrow(this.x+50, this.y+MEMH, ABUSW, ABUSY-this.y-MEMH-ABUSW/2, GRAY32, BLUE)
		this.dbus = new BusArrow(this.x+100, this.y+MEMH, DBUSW, DBUSY-this.y-MEMH-DBUSW/2, GRAY32, RED)
		for (this.i = 0; this.i<NADDR; this.i++) {
			this.mem[this.i]=0
			this.memR[this.i]=new Rectangle2($g[0], 0, 0, $g[1], $g[14], this.x+this.bgap, this.y+(this.i+1)*this.bgap+this.i*this.bh, this.bw, this.bh, $g[1], $g[18], "address: a%d data: %d", this.i, this.mem[this.i])
			this.memR[this.i].setRounded(2, 2)
			this.memR[this.i].setTxtOff(0, -1)
		}
	}
	Memory.prototype = Object.create(VObj.prototype)

	Memory.prototype.highlight = function(addr, flag) {
		this.memR[addr].setBrush((flag) ? $g[12] : $g[14])
	}

	Memory.prototype.reset = function() {
		for (let i = 0; i<NADDR; i++)
		this.highlight(i, 0)
	}

	function showBusOp(s) {
		$g[29].setTxt(s)
		let w = $g[29].getTxtW()+16
		$g[29].setPt(0, -w/2, -10)
		$g[29].setPt(1, w/2, 10)
		$g[29].setOpacity(1, TICKS, 1, 0)
	}

	function Cache(x, y, _cpuN) {
		VObj.call(this)
		this.a = newArray(NSET), this.d = newArray(NSET), this.state = newArray(NSET)
		this.aR = newArray(NSET), this.dR = newArray(NSET), this.stateR = newArray(NSET)
		this.cpuN = _cpuN
		this.bgap = 3
		this.bw0 = 20
		this.bw1 = (CACHEW-4*this.bgap-this.bw0)/2
		this.bh = (CACHEH-(NSET+1)*this.bgap)/NSET
		this.abus = new BusArrow(x+2*this.bgap+this.bw0+this.bw1/2, ABUSY+ABUSW/2, ABUSW, y-ABUSY-ABUSW/2, GRAY32, BLUE)
		this.dbus = new BusArrow(x+3*this.bgap+this.bw0+3*this.bw1/2, DBUSY+DBUSW/2, DBUSW, y-DBUSY-DBUSW/2, GRAY32, RED)
		this.cpuabus = new BusArrow(x+CACHEW/4, y+CACHEH, ABUSW, CPUY-CACHEY-CACHEH, GRAY32, BLUE)
		this.cpudbus = new BusArrow(x+3*CACHEW/4, y+CACHEH, DBUSW, CPUY-CACHEY-CACHEH, GRAY32, RED)
		this.r = new Rectangle2($g[0], 0, 0, $g[1], $g[10], x, y, CACHEW, CACHEH)
		this.r.setRounded(4, 4)
		new Txt($g[0], 0, HLEFT|VTOP, x+CACHEW-20, y-30, $g[7], $g[17], "Cache %d", this.cpuN)
		$g[29].moveToFront()
		for (this.i = 0; this.i<NSET; this.i++) {
			this.state[this.i]=INVALID
			this.stateR[this.i]=new Rectangle2($g[0], 0, 0, $g[1], $g[14], x+this.bgap, y+(this.i+1)*this.bgap+this.i*this.bh, this.bw0, this.bh, $g[1], $g[18], "I")
			this.stateR[this.i].setRounded(2, 2)
			this.a[this.i]=0
			this.aR[this.i]=new Rectangle2($g[0], 0, 0, $g[1], $g[14], x+2*this.bgap+this.bw0, y+(this.i+1)*this.bgap+this.i*this.bh, this.bw1, this.bh, $g[1], $g[18])
			this.aR[this.i].setRounded(2, 2)
			this.d[this.i]=0
			this.dR[this.i]=new Rectangle2($g[0], 0, 0, $g[1], $g[14], x+3*this.bgap+this.bw0+this.bw1, y+(this.i+1)*this.bgap+this.i*this.bh, this.bw1, this.bh, $g[1], $g[18])
			this.dR[this.i].setRounded(2, 2)
		}
	}
	Cache.prototype = Object.create(VObj.prototype)

	Cache.prototype.setvalues = function(set, addr, data) {
		this.a[set]=addr
		this.aR[set].setTxt("a%d", addr)
		this.d[set]=data
		this.dR[set].setTxt("%d", data)
	}

	Cache.prototype.highlight = function(set, flag) {
		let brush = (flag) ? $g[12] : $g[14]
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
		$g[28].abus.reset()
		$g[28].dbus.reset()
		$g[26].setColour(GRAY32)
		$g[27].setColour(GRAY32)
		$g[28].reset()
		for (let i = 0; i<NCPU; i++) {
			$g[31][i].abus.reset()
			$g[31][i].dbus.reset()
		}
		$g[29].setOpacity(0, TICKS, 1, 0)
	}

	Cache.prototype.busWatch = function(addr, cpu, rw) {
		for (let i = 0; i<NCPU; i++) {
			if (i!=cpu)
			fork(5, $g[31][i], addr, rw)
		}
	}

	function CPU(x, y, _cpuN) {
		VObj.call(this)
		this.cpuN = _cpuN
		this.buttonLock = 0
		this.selected
		this.rb = newArray(NADDR)
		this.wb = newArray(NADDR)
		this.r = new Rectangle2($g[0], 0, 0, $g[1], $g[10], x, y, CPUW, CPUH)
		this.r.setRounded(4, 4)
		new Txt($g[0], 0, HLEFT|VTOP, x+CPUW-20, y-30, $g[7], $g[17], "CPU %d", this.cpuN)
		for (this.i = 0; this.i<NADDR; this.i++) {
			this.rb[this.i]=new this.CPUButton(this, $g[0], 0, x+bgap, y+(this.i+1)*bgap+this.i*bh, this.i)
			this.wb[this.i]=new this.CPUButton(this, $g[0], 1, x+bgap+bw+bgap, y+(this.i+1)*bgap+this.i*bh, this.i)
		}
	}
	CPU.prototype = Object.create(VObj.prototype)

	CPU.prototype.CPUButton = function($parent, $grp, _rw, x, y, _addr) {
		this.$parent = $parent
		SimpleButton.call(this, $grp, x, y, bw, bh, $g[14], $g[11], $g[3], $g[4], $g[1], $g[18], $g[19], "")
		this.rw = _rw
		this.addr = _addr
		this.setTxt(this.rw ? "write %d" : "read a%d", this.addr)
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
			this.$parent.selected.setPen($g[6])
		}
	}

	CPU.prototype.CPUButton.prototype.resetCPUs = function(cpuN) {
		for (let i = 0; i<NCPU; i++) {
			if ($g[32][i].selected==0) {
				$g[31][i].reset()
				$g[32][i].r.setPen($g[1])
				$g[32][i].resetButtons()
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
			$g[32][i].resetButtons()
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
		fork(49, $g[32][i])
	}

	function $eh3(down, flags, $2, $3) {
		if (down && (flags&MB_LEFT)) {
			reset()
		}
		return 0
	}

	function $eh4(down, flags, $2, $3) {
		if (down && (flags&MB_LEFT)) {
			if ($g[23]==1) {
				$g[23]=0
				$g[34].setTxt("bug free!")
			} else {
				$g[23]++
				$g[34].setTxt("bug %d", $g[23]-1)
			}
		}
		return 0
	}

	function $eh5(down, flags, $2, $3) {
		if (down && (flags&MB_LEFT))
		getURL("https://www.scss.tcd.ie/Jeremy.Jones/VivioJS/caches/writeThroughHelp.htm")
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
				$g[6] = new SolidPen(0, 2, rgba(1, 0.65000000000000002, 0), ROUND_END)
				$g[7] = new SolidPen(0, 2, RED)
				$g[8] = new SolidPen(0, 0, RED)
				$g[9] = new SolidPen(0, 0, WHITE)
				$g[10] = new SolidBrush(GRAY192)
				$g[11] = new SolidBrush(GRAY224)
				$g[12] = new SolidBrush(GREEN)
				$g[13] = new SolidBrush(rgba(0, 0, 0.40000000000000002))
				$g[14] = new SolidBrush(WHITE)
				$g[15] = new Font("Calibri Light", 18, 0)
				$g[16] = new Font("Calibri", 32, SMALLCAPS)
				$g[17] = new Font("Calibri", 18, SMALLCAPS)
				$g[18] = new Font("Calibri Light", 18, 0)
				$g[19] = new Font("Calibri Light", 16, 0)
				setBgBrush($g[11])
				$g[20] = new Rectangle2($g[0], 0, 0, 0, $g[13], TITLEX, TITLEY, W/2, TITLEH, $g[9], $g[16], "Write-Through Protocol")
				$g[20].setRounded(5, 5)
				$g[20].setPt(1, $g[20].getTxtW()+16, TITLEH)
				$g[21] = "Like real hardware, the CPUs can operate in\n"
				$g[21]+="parallel. Try pressing a button on different\n"
				$g[21]+="CPUs \"simultaneously\". Alternatively select\n"
				$g[21]+="buttons on different CPUs with the CTRL key and\n"
				$g[21]+="click on the last button without CTRL to start\n"
				$g[21]+="simultaneous transactions."
				new Rectangle2($g[0], 0, HLEFT|VCENTRE|JUSTIFY, 0, 0, INFOX, INFOY, INFOW, INFOH, $g[1], $g[15], $g[21])
				$g[22] = 0
				$g[23] = 0
				$g[24] = -1
				$g[25] = 0
				$g[26] = new Bus(10, DBUSY, DBUSW, W-40, GRAY32)
				new Txt($g[0], 0, HLEFT|VTOP, 60, DBUSY-30, $g[7], $g[17], "Data bus")
				$g[27] = new Bus(20, ABUSY, ABUSW, W-40, GRAY32)
				new Txt($g[0], 0, HLEFT|VTOP, 70, ABUSY-30, $g[2], $g[17], "Address bus")
				$g[28] = new Memory((W-MEMW)/2, MEMY)
				$g[29] = new Rectangle($g[0], 0, 0, $g[1], $g[14], W/2, BUSOPY, 0, 0, 0, 0, 0, $g[15])
				$g[29].setOpacity(0)
				$g[29].setRounded(4, 4)
				$g[30] = new Txt($g[0], 0, HLEFT, 2*W/3, (ABUSY+DBUSY)/2, 0, $g[17], "Bus cycles: %d", $g[25])
				$g[31] = newArray(NCPU)
				$g[32] = newArray(NCPU)
				$g[31][0]=new Cache((W-5*CACHEW)/2, CACHEY, 0)
				$g[31][1]=new Cache((W-5*CACHEW)/2+2*CACHEW, CACHEY, 1)
				$g[31][2]=new Cache((W-5*CACHEW)/2+4*CACHEW, CACHEY, 2)
				$g[32][0]=new CPU((W-5*CPUW)/2, CPUY, 0)
				$g[32][1]=new CPU((W-5*CPUW)/2+2*CPUW, CPUY, 1)
				$g[32][2]=new CPU((W-5*CPUW)/2+4*CPUW, CPUY, 2)
				$g[33] = new SimpleButton($g[0], W-2*BW-2*BW/8, BY, BW, BH, $g[14], $g[11], $g[3], $g[4], $g[1], $g[18], $g[19], "reset")
				$g[34] = new SimpleButton($g[0], W-BW-BW/8, BY, BW, BH, $g[14], $g[11], $g[3], $g[4], $g[1], $g[18], $g[19], "bug free!")
				$g[35] = new SimpleButton($g[0], W-2*BW-2*BW/8, BY+BH+BH/4, BW, BH, $g[14], $g[11], $g[3], $g[4], $g[1], $g[18], $g[19], "help")
				$g[36] = new SimpleButton($g[0], W-BW-BW/8, BY+BH+BH/4, BW, BH, $g[14], $g[11], $g[3], $g[4], $g[1], $g[18], $g[19], "VivioJS help")
				$g[33].addEventHandler("eventMB", this, $eh3)
				$g[34].addEventHandler("eventMB", this, $eh4)
				$g[35].addEventHandler("eventMB", this, $eh5)
				$g[36].addEventHandler("eventMB", this, $eh6)
				returnf(0)
				continue
			case 1:
				enterf(0);	// moveup
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
				enterf(0);	// movedown
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
				callf(3, $obj.abus, TICKS, 1)
				continue
			case 6:
				if (!(($obj.a[$stack[$fp+1]]==$stack[$fp-3]) && ($stack[$fp-4]==1) && ($g[23]!=1))) {
					$pc = 8
					continue
				}
				if (!($obj.state[$stack[$fp+1]]==VALID)) {
					$pc = 7
					continue
				}
				$obj.highlight($stack[$fp+1], 1)
				$pc = 7
			case 7:
				$obj.state[$stack[$fp+1]]=INVALID
				$obj.stateR[$stack[$fp+1]].setTxt("I")
				$pc = 8
			case 8:
				returnf(2)
				continue
			case 9:
				enterf(0);	// getBusLock
				if (!($g[24]==$obj.cpuN)) {
					$pc = 10
					continue
				}
				returnf(0)
				continue
				$pc = 10
			case 10:
				$pc = 11
			case 11:
				if (!($g[24]>=0)) {
					$pc = 13
					continue
				}
				if (wait(1))
				return
				$pc = 12
			case 12:
				$pc = 11
				continue
			case 13:
				$g[24]=$obj.cpuN
				returnf(0)
				continue
			case 14:
				enterf(0);	// releaseBusLock
				$g[24]=-1
				if (wait(1))
				return
				$pc = 15
			case 15:
				returnf(0)
				continue
			case 16:
				enterf(1);	// read
				$g[29].setOpacity(0)
				$stack[$fp+1] = $stack[$fp-3]%NSET
				if (!($stack[$fp-4])) {
					$pc = 18
					continue
				}
				callf(1, $obj.cpuabus, TICKS, 1)
				continue
			case 17:
				$pc = 18
			case 18:
				if (!(($obj.a[$stack[$fp+1]]==$stack[$fp-3]) && ($obj.state[$stack[$fp+1]]!=INVALID))) {
					$pc = 21
					continue
				}
				$obj.highlight($stack[$fp+1], 1)
				if (!($stack[$fp-4])) {
					$pc = 20
					continue
				}
				callf(3, $obj.cpudbus, TICKS, 1)
				continue
			case 19:
				$pc = 20
			case 20:
				returnf(2)
				continue
				$pc = 21
			case 21:
				callf(9, $obj)
				continue
			case 22:
				$obj.resetBus()
				showBusOp(sprintf("CPU %d reads a%d from memory", $obj.cpuN, $stack[$fp-3]))
				$g[25]++
				$g[30].setTxt("Bus cycles: %d", $g[25])
				$obj.highlight($stack[$fp+1], 1)
				callf(1, $obj.abus, TICKS, 1)
				continue
			case 23:
				$g[27].setColour(BLUE)
				$obj.busWatch($stack[$fp-3], $obj.cpuN, 0)
				callf(1, $g[28].abus, TICKS, 1)
				continue
			case 24:
				$g[28].highlight($stack[$fp-3], 1)
				callf(3, $g[28].dbus, TICKS, 1)
				continue
			case 25:
				$g[26].setColour(RED)
				callf(3, $obj.dbus, TICKS, 1)
				continue
			case 26:
				$obj.setvalues($stack[$fp+1], $stack[$fp-3], $g[22])
				$obj.state[$stack[$fp+1]]=VALID
				$obj.stateR[$stack[$fp+1]].setTxt("V")
				callf(14, $obj)
				continue
			case 27:
				callf(3, $obj.cpudbus, TICKS, 1)
				continue
			case 28:
				returnf(2)
				continue
			case 29:
				enterf(1);	// write
				$g[29].setOpacity(0)
				$stack[$fp+1] = $stack[$fp-3]%NSET
				callf(1, $obj.cpudbus, TICKS, 0)
				continue
			case 30:
				callf(1, $obj.cpuabus, TICKS, 1)
				continue
			case 31:
				$obj.highlight($stack[$fp+1], 1)
				$g[22]++
				$pc = 32
			case 32:
				if (!(1)) {
					$pc = 42
					continue
				}
				if (!(($obj.state[$stack[$fp+1]]==INVALID) || ($obj.a[$stack[$fp+1]]!=$stack[$fp-3]))) {
					$pc = 34
					continue
				}
				callf(16, $obj, $stack[$fp-3], 0)
				continue
			case 33:
				$pc = 34
			case 34:
				callf(9, $obj)
				continue
			case 35:
				if (!($obj.state[$stack[$fp+1]]==INVALID)) {
					$pc = 36
					continue
				}
				$pc = 32
				continue
				$pc = 36
			case 36:
				$obj.resetBus()
				showBusOp(sprintf("CPU %d writes %d to a%d in memory", $obj.cpuN, $g[22], $stack[$fp-3]))
				$g[25]++
				$g[30].setTxt("Bus cycles: %d", $g[25])
				$obj.setvalues($stack[$fp+1], $stack[$fp-3], $g[22])
				callf(1, $obj.abus, TICKS, 0)
				continue
			case 37:
				callf(1, $obj.dbus, TICKS, 1)
				continue
			case 38:
				$g[27].setColour(BLUE)
				$g[26].setColour(RED)
				callf(1, $g[28].abus, TICKS, 0)
				continue
			case 39:
				$obj.busWatch($stack[$fp-3], $obj.cpuN, 1)
				callf(1, $g[28].dbus, TICKS, 1)
				continue
			case 40:
				$obj.state[$stack[$fp+1]]=VALID
				$obj.stateR[$stack[$fp+1]].setTxt("V")
				$g[28].mem[$stack[$fp-3]]=$obj.d[$stack[$fp+1]]
				$g[28].memR[$stack[$fp-3]].setTxt("address: a%d data: %d", $stack[$fp-3], $g[28].mem[$stack[$fp-3]])
				$g[28].highlight($stack[$fp-3], 1)
				callf(14, $obj)
				continue
			case 41:
				$pc = 42
				continue
				$pc = 32
				continue
			case 42:
				returnf(1)
				continue
			case 43:
				enterf(0);	// cpuButtonAction
				$obj.resetCPUs($obj.$parent.cpuN)
				if (!($g[24]==-1)) {
					$pc = 44
					continue
				}
				$g[31][$obj.$parent.cpuN].resetBus()
				$pc = 44
			case 44:
				$obj.$parent.buttonLock=1
				$g[31][$obj.$parent.cpuN].reset()
				$obj.$parent.r.setPen($g[5])
				$obj.setPen($g[8])
				if (!($obj.rw)) {
					$pc = 46
					continue
				}
				callf(29, $g[31][$obj.$parent.cpuN], $obj.addr)
				continue
			case 45:
				$pc = 48
				continue
			case 46:
				callf(16, $g[31][$obj.$parent.cpuN], $obj.addr, 1)
				continue
			case 47:
				$pc = 48
			case 48:
				$obj.resetCPUs($obj.$parent.cpuN)
				$obj.$parent.selected=0
				checkPoint()
				$obj.$parent.buttonLock=0
				returnf(0)
				continue
			case 49:
				enterf(0);	// cpuAction
				if (!($obj.selected && $obj.buttonLock==0)) {
					$pc = 51
					continue
				}
				callf(43, $obj.selected)
				continue
			case 50:
				$pc = 51
			case 51:
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
