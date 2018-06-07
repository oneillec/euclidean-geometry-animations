"use strict"

function cache(vplayer) {

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
	const MAGENTA = vplayer.MAGENTA
	const MB_LEFT = vplayer.MB_LEFT
	const MB_RIGHT = vplayer.MB_RIGHT
	const PROPAGATE = vplayer.PROPAGATE
	const RED = vplayer.RED
	const ROUND_END = vplayer.ROUND_END
	const SMALLCAPS = vplayer.SMALLCAPS
	const VTOP = vplayer.VTOP
	const WHITE = vplayer.WHITE
	const YELLOW = vplayer.YELLOW

	var $g = vplayer.$g
	var addWaitToEventQ = vplayer.addWaitToEventQ
	var checkPoint = vplayer.checkPoint
	var Font = vplayer.Font
	var getArgAsNum = vplayer.getArgAsNum
	var getTPS = vplayer.getTPS
	var getURL = vplayer.getURL
	var Group = vplayer.Group
	var Layer = vplayer.Layer
	var Line = vplayer.Line
	var Line2 = vplayer.Line2
	var newArray = vplayer.newArray
	var random = vplayer.random
	var Rectangle = vplayer.Rectangle
	var Rectangle2 = vplayer.Rectangle2
	var reset = vplayer.reset
	var rgba = vplayer.rgba
	var setArgFromNum = vplayer.setArgFromNum
	var setBgBrush = vplayer.setBgBrush
	var setTPS = vplayer.setTPS
	var setViewport = vplayer.setViewport
	var SolidBrush = vplayer.SolidBrush
	var SolidPen = vplayer.SolidPen
	var start = vplayer.start
	var stop = vplayer.stop
	var terminateThread = vplayer.terminateThread
	var Txt = vplayer.Txt
	var VObj = vplayer.VObj

	const W = 1024
	const H = 640
	const NADDR = 32
	const BORDER = 10
	const TITLEX = BORDER
	const TITLEY = BORDER
	const TITLEH = 40
	const BH = 20
	const BW = 80
	const BGAP = 5
	const BGW = BW+BGAP
	const MEMW = 160
	const MEMX = (W-MEMW)/2
	const MEMY = 40
	const MEMH = 70
	const CPUW = MEMW
	const CPUX = (W-CPUW)/2
	const CPUH = MEMH
	const CPUY = H-60-CPUH
	const BUSW = 12
	const BUSL = 60
	const CLINEH = 20
	const CLINEGAP = 2
	const ADDRW = 64
	const ADDRH = 15
	const ADDRY = 80
	const ADDRGAPY = 2
	const ADDRX = BORDER+ADDRW/2
	const HITCNTX = 100
	const HITCNTY = ADDRY
	const INFOX = 100
	const INFOY = H-35
	const TICKS = 20
	const NFLASH = 2

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

	function log2(n) {
		let i
		for (i=-1; n>0; i++)
		n>>=1
		return i
	}

	function BusArrow(x, y, w, _l, bgColour, fgColour) {
		VObj.call(this)
		this.l = _l
		this.bgPen = new SolidPen(0, w, bgColour, ARROW60_START|ARROW60_END)
		this.bgArrow = new Line($g[0], 0, 0, this.bgPen, x, y, 0, 0, 0, this.l)
		this.fgPen = new SolidPen(0, w, fgColour, ARROW60_END)
		this.fgArrow = new Line($g[0], 0, 0, this.fgPen, x, y, 0, 0, 0, 0)
		this.fgArrow.setOpacity(0)
	}
	BusArrow.prototype = Object.create(VObj.prototype)

	BusArrow.prototype.reset = function() {
		this.bgArrow.setOpacity(1)
		this.fgArrow.setOpacity(0)
	}

	function Memory(l) {
		VObj.call(this)
		this.memory = new Rectangle2($g[0], 0, 0, $g[1], 0, MEMX, MEMY, MEMW, MEMH, $g[3], $g[58], "memory")
		this.memory.setRounded(4, 4)
		this.abus = new BusArrow(W/2-MEMW/4, MEMY+MEMH, BUSW, l, GRAY96, RED)
		this.dbus = new BusArrow(W/2+MEMW/4, MEMY+MEMH, BUSW, l, GRAY96, BLUE)
	}
	Memory.prototype = Object.create(VObj.prototype)

	function Cache() {
		VObj.call(this)
		this.w = ($g[38]<8) ? 64 : 40
		this.h = CLINEH
		this.gap = CLINEGAP
		this.cacheH = this.h+($g[39]+3)*(this.h+this.gap)-this.gap
		this.cacheW = this.w+$g[38]*(this.w+3)+this.gap+$g[38]*(this.w+3)+this.gap
		this.cacheX = (W-this.cacheW)/2
		this.cacheY = MEMY+MEMH+(CPUY-(MEMY+MEMH)-this.cacheH)/2
		this.tagR = newArray($g[39], $g[38])
		this.dataR = newArray($g[39], $g[38])
		this.tagFlashR = newArray($g[39])
		this.tagsd = newArray($g[39], $g[38])
		this.count = newArray($g[39], $g[38])
		this.order = newArray($g[39], $g[38])
		this.cborder = new Rectangle2($g[0], 0, 0, $g[1], 0, this.cacheX, this.cacheY, this.cacheW, this.cacheH)
		this.cborder.setRounded(4, 4)
		new Txt($g[0], 0, HLEFT, this.cacheX, this.cacheY-20, $g[3], $g[58], "cache")
		new Txt($g[0], 0, HLEFT|VTOP, this.cacheX+this.w, this.cacheY, $g[3], $g[56], "tags")
		new Txt($g[0], 0, HLEFT|VTOP, this.cacheX+this.w+$g[38]*(this.w+3)+this.gap, this.cacheY, $g[5], $g[56], "data")
		this.dataOut = new Rectangle2($g[0], 0, 0, 0, $g[20], 0, 0, this.w*4/$g[37], this.h)
		this.dataOut.setRounded(4, 4)
		this.dataOut.setOpacity(0)
		for (this.n = 0; this.n<$g[39]; this.n++) {
			new Rectangle2($g[0], 0, 0, 0, 0, this.cacheX, this.cacheY+(this.n+1)*(this.h+this.gap), this.w, this.h, 0, $g[38]<8 ? $g[56] : $g[55], "set %d", this.n)
			for (this.k = 0; this.k<$g[38]; this.k++) {
				this.tagR[this.n][this.k]=new Rectangle2($g[0], 0, 0, $g[3], $g[53][this.k], this.cacheX+this.w+this.k*(this.w+this.gap), this.cacheY+(this.n+1)*(this.h+this.gap), this.w, this.h, $g[1], $g[56], "xxx")
				this.tagR[this.n][this.k].setRounded(4, 4)
				this.tagsd[this.n][this.k]=65535
				this.count[this.n][this.k]=-1
				this.order[this.n][this.k]=this.k
				this.doffsetx = this.cacheX+this.w+$g[38]*(this.w+3)+this.gap+this.k*(this.w+3)
				this.dataR[this.n][this.k]=new Rectangle2($g[0], 0, 0, $g[5], 0, this.doffsetx, this.cacheY+(this.n+1)*(this.h+this.gap), this.w, this.h, $g[1], $g[56])
				this.dataR[this.n][this.k].setRounded(4, 4)
				for (this.l = 1; this.l<$g[37]/4; this.l++)
				new Line2($g[0], 0, 0, $g[47], this.doffsetx+this.l*this.w*4/$g[37], this.cacheY+(this.n+1)*(this.h+this.gap), 0, this.h)
			}
			this.tagFlashR[this.n]=new Rectangle2($g[0], 0, 0, 0, 0, this.cacheX+this.w, this.cacheY+(this.n+1)*(this.h+this.gap), $g[38]*(this.w+this.gap)-this.gap, this.h)
			this.tagFlashR[this.n].setRounded(2, 2)
		}
		this.asplitX = (W-16*8)/2
		this.asplitY = this.cacheY+this.h+($g[39]+1)*(this.h+this.gap)+this.h/2-this.gap
		this.tagW = (16-$g[46])*8
		this.setW = log2($g[39])*8
		this.offW = log2($g[37])*8
		this.tagT = new Rectangle2($g[0], 0, 0, 0, 0, this.asplitX, this.asplitY-24, this.tagW, this.h, $g[1], $g[56], "tag")
		this.setT = new Rectangle2($g[0], 0, 0, 0, 0, this.asplitX+this.tagW, this.asplitY-24, this.setW, this.h, $g[1], $g[56], "set")
		this.offsetT = new Rectangle2($g[0], 0, 0, 0, 0, this.asplitX+this.tagW+this.setW, this.asplitY-24, this.offW, this.h, $g[1], $g[56], "off")
		this.setSplitR = new Rectangle2($g[0], 0, 0, $g[3], $g[17], this.asplitX+this.tagW, this.asplitY, this.setW, this.h, $g[1], $g[56])
		this.setSplitR.setRounded(4, 4)
		this.offSplitR = new Rectangle2($g[0], 0, 0, $g[3], $g[17], this.asplitX+this.tagW+this.setW, this.asplitY, this.offW, this.h, $g[1], $g[56])
		this.offSplitR.setRounded(4, 4)
		this.tagSplitR = new Rectangle2($g[0], 0, 0, $g[3], $g[17], this.asplitX, this.asplitY, this.tagW, this.h, $g[1], $g[56])
		this.tagSplitR.setRounded(4, 4)
		this.aTrackerR = new Rectangle2($g[0], $g[42], 0, $g[51], $g[17], this.asplitX, this.asplitY, this.tagW+this.setW+this.offW, this.h, $g[1], $g[56])
		this.aTrackerR.setRounded(4, 4)
		this.aTrackerR.setOpacity(0)
		if (this.setW==0) {
			this.setT.setOpacity(0)
			this.setSplitR.setOpacity(0)
		}
	}
	Cache.prototype = Object.create(VObj.prototype)

	Cache.prototype.resetTagsAndData = function() {
		for (let i = 0; i<$g[39]; i++) {
			for (let j = 0; j<$g[38]; j++) {
				this.tagR[i][j].setPen($g[3])
				this.dataR[i][j].setPen($g[5])
			}
		}
	}

	Cache.prototype.setSplitTxt = function(defaultx, tag, set, off) {
		if (defaultx) {
			this.tagSplitR.setTxt("")
			this.setSplitR.setTxt("")
			this.offSplitR.setTxt("")
		} else {
			this.tagSplitR.setTxt("%03x", tag)
			this.setSplitR.setTxt("%01x", set)
			this.offSplitR.setTxt("%01x", off)
		}
	}

	Cache.prototype.oldestk = function(set) {
		let oldest = 0
		let min = 1000
		for (let kk = 0; kk<$g[38]; kk++) {
			if ((this.order[set][kk]==-1) && (this.count[set][kk]<min)) {
				min=this.count[set][kk]
				oldest=kk
			}
		}
		return oldest
	}

	Cache.prototype.reorder = function(set) {
		let kk
		for (kk=0; kk<$g[38]; kk++)
		this.order[set][kk]=-1
		for (kk=0; kk<$g[38]; kk++)
		this.order[set][this.oldestk(set)]=kk
		for (kk=0; kk<$g[38]; kk++)
		this.tagR[set][kk].setBrush($g[53][this.order[set][kk]])
	}

	function Cpu() {
		VObj.call(this)
		this.memory = new Rectangle2($g[0], 0, 0, $g[1], 0, CPUX, CPUY, CPUW, CPUH, $g[3], $g[58], "cpu")
		this.memory.setTxtOff(0, CPUH)
		this.memory.setRounded(4, 4)
		this.l = CPUY-($g[78].cacheY+$g[78].cacheH)
		this.abus = new BusArrow(W/2-CPUW/4, CPUY-this.l, BUSW, this.l, GRAY96, RED)
		this.dbus = new BusArrow(W/2+CPUW/4, CPUY-this.l, BUSW, this.l, GRAY96, BLUE)
		this.addrT = new Txt($g[0], 0, 0, W/2-CPUW/4, CPUY+12, $g[1], $g[55], "address")
		this.dataT = new Txt($g[0], 0, 0, W/2+CPUW/4, CPUY+12, $g[1], $g[55], "data")
		this.addr = new Rectangle($g[0], 0, 0, $g[1], 0, CPUX+CPUW/4, CPUY+CPUH/2, -ADDRW/2, -ADDRH/2, ADDRW, ADDRH, $g[1], $g[55])
		this.addr.setRounded(4, 4)
		this.data = new Rectangle($g[0], 0, 0, $g[1], 0, CPUX+3*CPUW/4, CPUY+CPUH/2, -ADDRW/2, -ADDRH/2, ADDRW, ADDRH, $g[1], $g[55])
		this.data.setRounded(4, 4)
	}
	Cpu.prototype = Object.create(VObj.prototype)

	function init() {
		$g[80].abus.reset()
		$g[80].dbus.reset()
		$g[80].addr.setTxt("")
		$g[80].addr.setPen($g[1])
		$g[80].data.setTxt("")
		$g[80].data.setPen($g[1])
		$g[79].abus.reset()
		$g[79].dbus.reset()
		$g[78].resetTagsAndData()
		$g[78].dataOut.setOpacity(0)
		$g[78].setSplitTxt(1, 0, 0, 0)
		$g[77].setOpacity(0)
		$g[63].setTxt("")
	}

	function $eh2(down, flags, $2, $3) {
		if (down && (flags&MB_LEFT))
		$g[35] ? stop() : start()
		return 0
	}

	function $eh3(down, flags, $2, $3) {
		if (down && (flags&MB_LEFT))
		reset()
		return 0
	}

	function $eh4(down, flags, $2, $3) {
		if (down) {
			if (flags&MB_LEFT) {
				$g[37]=($g[37]==32) ? 16 : 32
			} else
			if (flags&MB_RIGHT) {
				$g[37]=($g[37]==16) ? 32 : 16
			}
			setArgFromNum("L", $g[37])
			reset()
		}
		return 0
	}

	function $eh5(down, flags, $2, $3) {
		if (down) {
			if (flags&MB_LEFT) {
				$g[38]=($g[38]>=8) ? 1 : $g[38]*2
			} else
			if (flags&MB_RIGHT) {
				$g[38]=($g[38]<=1) ? 8 : $g[38]/2
			}
			setArgFromNum("K", $g[38])
			reset()
		}
		return 0
	}

	function $eh6(down, flags, $2, $3) {
		if (down) {
			if (flags&MB_LEFT) {
				$g[39]=($g[39]>=8) ? 1 : $g[39]*2
			} else
			if (flags&MB_RIGHT) {
				$g[39]=($g[39]<=1) ? 8 : $g[39]/2
			}
			setArgFromNum("N", $g[39])
			reset()
		}
		return 0
	}

	function $eh7(down, flags, $2, $3) {
		if (down) {
			if (flags&MB_LEFT) {
				$g[40]=($g[40]>=2) ? 0 : $g[40]+1
			} else
			if (flags&MB_RIGHT) {
				$g[40]=($g[40]<=0) ? 2 : $g[40]-1
			}
			setArgFromNum("A", $g[40])
			reset()
		}
		return 0
	}

	function $eh8(down, flags, $2, $3) {
		if (down) {
			if (flags&MB_LEFT) {
				$g[41]=($g[41]>=200) ? 10 : ($g[41]+10)/10*10
			} else
			if (flags&MB_RIGHT) {
				$g[41]=($g[41]<=10) ? 200 : ($g[41]-10)/10*10
			}
			$g[66].setTxt("%d ticks/s", $g[41])
			setTPS($g[41])
		}
		return 0
	}

	function $eh9(down, flags, $2, $3) {
		if (down && (flags&MB_LEFT))
		getURL("https://www.scss.tcd.ie/Jeremy.Jones/VivioJS/caches/cacheHelp.htm")
		return 0
	}

	function $eh10(down, flags, x, y) {
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
				$g[34] = 0
				$g[36] = newArray(NADDR)
				$g[37] = getArgAsNum("L", 16)
				$g[38] = getArgAsNum("K", 2)
				$g[39] = getArgAsNum("N", 4)
				$g[40] = getArgAsNum("A", 0)
				$g[41] = getArgAsNum("T", getTPS())
				setTPS($g[41])
				setViewport(0, 0, W, H, 1)
				$g[42] = new Layer()
				$g[43] = $g[37]-1
				$g[44] = log2($g[37])
				$g[45] = $g[39]-1
				$g[46] = log2($g[39])+log2($g[37])
				$g[47] = new SolidPen(6, 0, 255)
				$g[48] = new SolidPen(0, 2, 255)
				$g[49] = new SolidPen(0, 3, rgba(0, 0.5, 0))
				$g[50] = new SolidPen(0, 2, GRAY64, ROUND_END)
				$g[51] = new SolidPen(0, 2, 16711680)
				$g[52] = new SolidBrush(rgba(0, 0, 0.40000000000000002))
				$g[53] = newArray($g[38])
				$g[31]=0
				$pc = 1
			case 1:
				if (!($g[31]<$g[38])) {
					$pc = 3
					continue
				}
				$g[54] = 0.5+0.5*$g[31]/$g[38]
				$g[53][$g[31]]=new SolidBrush(rgba($g[54], $g[54], $g[54]))
				$pc = 2
			case 2:
				$g[31]++
				$pc = 1
				continue
			case 3:
				$g[55] = new Font("Calibri", 14)
				$g[56] = new Font("Calibri", 16)
				$g[57] = new Font("Calibri", 22)
				$g[58] = new Font("Calibri", 22, SMALLCAPS)
				$g[59] = new Font("Calibri", 24)
				$g[60] = new Font("Calibri", 16)
				$g[61] = new Font("Calibri", 14)
				setBgBrush($g[30])
				$g[62] = new Rectangle2($g[0], 0, 0, 0, $g[52], TITLEX, TITLEY, W/2, TITLEH, $g[2], $g[59], "Cache Animation for L=%d K=%d N=%d", $g[37], $g[38], $g[39])
				$g[62].setRounded(5, 5)
				$g[62].setPt(1, $g[62].getTxtW()+16, TITLEH)
				$g[63] = new Txt($g[0], 0, HLEFT, INFOX, INFOY, $g[1], $g[57], "Click to start")
				$g[64] = new SimpleButton($g[0], W-3*BGW, BGAP, BW, BH, $g[17], $g[30], $g[50], $g[12], $g[1], $g[60], $g[61], "start")
				$g[65] = new SimpleButton($g[0], W-2*BGW, BGAP, BW, BH, $g[17], $g[30], $g[50], $g[12], $g[1], $g[60], $g[61], "reset")
				$g[66] = new SimpleButton($g[0], W-BGW, BGAP, BW, BH, $g[17], $g[30], $g[50], $g[12], $g[1], $g[60], $g[61], "")
				$g[66].setTxt("%d ticks/s", $g[41])
				$g[67] = new SimpleButton($g[0], W-3*BGW, BH+2*BGAP, BW, BH, $g[17], $g[30], $g[50], $g[12], $g[1], $g[60], $g[61], "L")
				$g[67].setTxt("L = %d", $g[37])
				$g[68] = new SimpleButton($g[0], W-2*BGW, BH+2*BGAP, BW, BH, $g[17], $g[30], $g[50], $g[12], $g[1], $g[60], $g[61], "K")
				$g[68].setTxt("K = %d", $g[38])
				$g[69] = new SimpleButton($g[0], W-BGW, BH+2*BGAP, BW, BH, $g[17], $g[30], $g[50], $g[12], $g[1], $g[60], $g[61], "N")
				$g[69].setTxt("N = %d", $g[39])
				$g[70] = new SimpleButton($g[0], W-3*BGW, 2*BH+3*BGAP, 3*BGW-(BGW-BW), BH, $g[17], $g[30], $g[50], $g[12], $g[1], $g[60], $g[61], "A")
				$g[71] = new SimpleButton($g[0], W-3*BGW, 3*BH+4*BGAP, BGW+(BW-BGAP)/2, BH, $g[17], $g[30], $g[50], $g[12], $g[1], $g[60], $g[61], "help")
				$g[72] = new SimpleButton($g[0], W-3*BGW/2, 3*BH+4*BGAP, BGW+(BW-BGAP)/2, BH, $g[17], $g[30], $g[50], $g[12], $g[1], $g[60], $g[61], "VivioJS help")
				$g[73] = new Rectangle2($g[0], 0, 0, $g[1], $g[19], HITCNTX, HITCNTY, 80, 24, $g[1], $g[56], "hits:%3d", 0)
				$g[73].setRounded(2, 2)
				$g[74] = new Rectangle2($g[0], 0, 0, $g[1], $g[18], HITCNTX, HITCNTY+2*(ADDRH+ADDRGAPY), 80, 24, $g[1], $g[56], "misses:%3d", 0)
				$g[74].setRounded(2, 2)
				if (!($g[40]==0)) {
					$pc = 4
					continue
				}
				$g[36][0]=0
				$g[36][1]=4
				$g[36][2]=12
				$g[36][3]=8704
				$g[36][4]=208
				$g[36][5]=224
				$g[36][6]=4400
				$g[36][7]=40
				$g[36][8]=4412
				$g[36][9]=8708
				$g[36][10]=16
				$g[36][11]=32
				$g[36][12]=4
				$g[36][13]=64
				$g[36][14]=8712
				$g[36][15]=8
				$g[36][16]=160
				$g[36][17]=4
				$g[36][18]=4356
				$g[36][19]=40
				$g[36][20]=12
				$g[36][21]=132
				$g[36][22]=12
				$g[36][23]=13200
				$g[36][24]=176
				$g[36][25]=4352
				$g[36][26]=40
				$g[36][27]=100
				$g[36][28]=112
				$g[36][29]=208
				$g[36][30]=8
				$g[36][31]=13204
				$g[70].setTxt("tutorial addresses")
				$pc = 13
				continue
			case 4:
				if (!($g[40]==1)) {
					$pc = 8
					continue
				}
				$g[31]=0
				$pc = 5
			case 5:
				if (!($g[31]<NADDR)) {
					$pc = 7
					continue
				}
				$g[36][$g[31]]=($g[31]%5)<<4
				$pc = 6
			case 6:
				$g[31]++
				$pc = 5
				continue
			case 7:
				$g[70].setTxt("0000 0010 0020 0030 0040 0000...")
				$pc = 12
				continue
			case 8:
				$g[31]=0
				$pc = 9
			case 9:
				if (!($g[31]<NADDR)) {
					$pc = 11
					continue
				}
				$g[36][$g[31]]=(random()*65536)&65532
				$pc = 10
			case 10:
				$g[31]++
				$pc = 9
				continue
			case 11:
				$g[70].setTxt("random addresses")
				$pc = 12
			case 12:
				$pc = 13
			case 13:
				$g[75] = new Txt($g[0], 0, 0, ADDRX, ADDRY-16, $g[3], $g[56], "addresses")
				$g[76] = newArray(NADDR)
				$g[31]=0
				$pc = 14
			case 14:
				if (!($g[31]<NADDR)) {
					$pc = 16
					continue
				}
				$g[76][$g[31]]=new Rectangle($g[0], 0, 0, $g[1], $g[17], ADDRX, ADDRY+$g[31]*(ADDRH+ADDRGAPY), -ADDRW/2, -ADDRH/2, ADDRW, ADDRH, $g[1], $g[55], "%04x", $g[36][$g[31]])
				$g[76][$g[31]].setRounded(2, 2)
				$pc = 15
			case 15:
				$g[31]++
				$pc = 14
				continue
			case 16:
				$g[77] = new Rectangle($g[0], $g[42], 0, $g[51], $g[17], 0, 0, -ADDRW/2, -ADDRH/2, ADDRW, ADDRH, $g[1], $g[55])
				$g[77].setOpacity(0)
				$g[78] = new Cache()
				$g[79] = new Memory($g[78].cacheY-(MEMY+MEMH))
				$g[80] = new Cpu()
				$g[64].addEventHandler("eventMB", this, $eh2)
				$g[65].addEventHandler("eventMB", this, $eh3)
				$g[67].addEventHandler("eventMB", this, $eh4)
				$g[68].addEventHandler("eventMB", this, $eh5)
				$g[69].addEventHandler("eventMB", this, $eh6)
				$g[70].addEventHandler("eventMB", this, $eh7)
				$g[66].addEventHandler("eventMB", this, $eh8)
				$g[71].addEventHandler("eventMB", this, $eh9)
				$g[72].addEventHandler("eventMB", this, $eh10)
				if (wait(1))
				return
				$pc = 17
			case 17:
				$g[33]=0
				$pc = 18
			case 18:
				if (!($g[33]<NADDR)) {
					$pc = 24
					continue
				}
				init()
				callf(55, $obj)
				continue
			case 19:
				callf(36, $g[78], $g[36][$g[33]])
				continue
			case 20:
				callf(27, $g[80].dbus, TICKS, 1)
				continue
			case 21:
				$g[80].data.setTxt("(%04x)", $g[36][$g[33]])
				$g[80].data.setPen($g[48])
				checkPoint()
				if (wait(TICKS))
				return
				$pc = 22
			case 22:
				$pc = 23
			case 23:
				$g[33]++
				$pc = 18
				continue
			case 24:
				returnf(0)
				continue
			case 25:
				enterf(0);	// moveUp
				$obj.fgArrow.setPt(0, 0, $obj.l)
				$obj.fgArrow.setPt(1, 0, $obj.l)
				$obj.fgArrow.setPt(1, 0, 0, $stack[$fp-3], 1, 0)
				$obj.fgArrow.setOpacity(1, $stack[$fp-3]/4, 1, 0)
				if ($obj.bgArrow.setOpacity(0, $stack[$fp-3], 1, $stack[$fp-4]))
				return
				$pc = 26
			case 26:
				returnf(2)
				continue
			case 27:
				enterf(0);	// moveDown
				$obj.fgArrow.setPt(0, 0, 0)
				$obj.fgArrow.setPt(1, 0, 0)
				$obj.fgArrow.setPt(1, 0, $obj.l, $stack[$fp-3], 1, 0)
				$obj.fgArrow.setOpacity(1, $stack[$fp-3]/4, 1, 0)
				if ($obj.bgArrow.setOpacity(0, $stack[$fp-3], 1, $stack[$fp-4]))
				return
				$pc = 28
			case 28:
				returnf(2)
				continue
			case 29:
				enterf(0);	// flashTags
				$obj.tagFlashR[$stack[$fp-3]].flash($g[49], $obj.tagFlashR[$stack[$fp-3]].getBrush(), NFLASH, getTPS()/4, 0)
				if ($obj.tagSplitR.flash($g[49], $obj.tagSplitR.getBrush(), NFLASH, getTPS()/4, 1))
				return
				$pc = 30
			case 30:
				returnf(1)
				continue
			case 31:
				enterf(0);	// selectTagAndData
				$obj.tagR[$stack[$fp-3]][$stack[$fp-4]].flash($g[49], $obj.tagR[$stack[$fp-3]][$stack[$fp-4]].getBrush(), NFLASH, getTPS()/4, 0)
				if ($obj.dataR[$stack[$fp-3]][$stack[$fp-4]].flash($g[49], $obj.dataR[$stack[$fp-3]][$stack[$fp-4]].getBrush(), NFLASH, getTPS()/4, 1))
				return
				$pc = 32
			case 32:
				$obj.tagR[$stack[$fp-3]][$stack[$fp-4]].setPen($g[49])
				$obj.dataR[$stack[$fp-3]][$stack[$fp-4]].setPen($g[49])
				returnf(2)
				continue
			case 33:
				enterf(0);	// readMemory
				callf(25, $stack[$fp-3].abus, TICKS, 1)
				continue
			case 34:
				callf(27, $stack[$fp-3].dbus, TICKS, 1)
				continue
			case 35:
				returnf(1)
				continue
			case 36:
				enterf(7);	// hit
				$stack[$fp+1] = $stack[$fp-3]>>$g[46]
				$stack[$fp+2] = ($stack[$fp-3]>>$g[44])&$g[45]
				$stack[$fp+3] = $stack[$fp-3]&$g[43]
				$stack[$fp+4] = 0
				$g[63].setTxt("Step 1: extract tag, set number and offset from address")
				$obj.aTrackerR.setTxt("%04x", $stack[$fp-3])
				$obj.aTrackerR.setOpacity(1)
				if (wait(TICKS))
				return
				$pc = 37
			case 37:
				$obj.setSplitTxt(0, $stack[$fp+1], $stack[$fp+2], $stack[$fp+3])
				if ($obj.aTrackerR.setOpacity(0, TICKS, 1, 1))
				return
				$pc = 38
			case 38:
				$g[63].setTxt("Step 2: search set %d for tag %03x", $stack[$fp+2], $stack[$fp+1])
				callf(29, $obj, $stack[$fp+2])
				continue
			case 39:
				$stack[$fp+6] = 0
				$pc = 40
			case 40:
				if (!($stack[$fp+6]<$g[38])) {
					$pc = 43
					continue
				}
				if (!($obj.tagsd[$stack[$fp+2]][$stack[$fp+6]]==$stack[$fp+1])) {
					$pc = 41
					continue
				}
				$stack[$fp+4]=1
				$g[34]++
				$obj.count[$stack[$fp+2]][$stack[$fp+6]]=$g[33]
				$obj.tagR[$stack[$fp+2]][$stack[$fp+6]].setTxt("%03x", $stack[$fp+1])
				$stack[$fp+5]=$stack[$fp+6]
				$pc = 41
			case 41:
				$pc = 42
			case 42:
				$stack[$fp+6]++
				$pc = 40
				continue
			case 43:
				if (!($stack[$fp+4]==0)) {
					$pc = 51
					continue
				}
				$stack[$fp+5]=0
				$stack[$fp+7] = 1000
				$stack[$fp+6]=0
				$pc = 44
			case 44:
				if (!($stack[$fp+6]<$g[38])) {
					$pc = 47
					continue
				}
				if (!($obj.count[$stack[$fp+2]][$stack[$fp+6]]<$stack[$fp+7])) {
					$pc = 45
					continue
				}
				$stack[$fp+7]=$obj.count[$stack[$fp+2]][$stack[$fp+6]]
				$stack[$fp+5]=$stack[$fp+6]
				$pc = 45
			case 45:
				$pc = 46
			case 46:
				$stack[$fp+6]++
				$pc = 44
				continue
			case 47:
				$obj.count[$stack[$fp+2]][$stack[$fp+5]]=$g[33]
				$obj.tagsd[$stack[$fp+2]][$stack[$fp+5]]=$stack[$fp+1]
				$g[63].setTxt("Step 3: MISS - select least recently used tag")
				callf(31, $obj, $stack[$fp+2], $stack[$fp+5])
				continue
			case 48:
				$g[63].setTxt("Step 4: MISS - read data from memory and update tag and cache line")
				callf(33, $obj, $g[79])
				continue
			case 49:
				$obj.tagR[$stack[$fp+2]][$stack[$fp+5]].setTxt("%03x", $stack[$fp+1])
				$obj.dataR[$stack[$fp+2]][$stack[$fp+5]].setTxt("(%03xx)", $g[36][$g[33]]>>4)
				if (wait(TICKS/2))
				return
				$pc = 50
			case 50:
				$obj.reorder($stack[$fp+2])
				$g[76][$g[33]].setBrush($g[18])
				$g[63].setTxt("Step 5: output data")
				$g[74].setTxt("misses:%3d", ($g[33]-$g[34]+1))
				$pc = 53
				continue
			case 51:
				$g[63].setTxt("Step 4: HIT - update tag LRU ordering")
				callf(31, $obj, $stack[$fp+2], $stack[$fp+5])
				continue
			case 52:
				$obj.reorder($stack[$fp+2])
				$g[63].setTxt("Step 5: output data")
				$g[76][$g[33]].setBrush($g[19])
				$g[73].setTxt("hits:%3d", $g[34])
				$pc = 53
			case 53:
				$obj.dataOut.setPos($obj.dataR[$stack[$fp+2]][$stack[$fp+5]].getX()+$obj.w*4/$g[37]*($stack[$fp+3]>>2), $obj.dataR[$stack[$fp+2]][$stack[$fp+5]].getY())
				if ($obj.dataOut.setOpacity(1, TICKS, 1, 1))
				return
				$pc = 54
			case 54:
				returnf(1)
				continue
			case 55:
				enterf(0);	// trackAddr
				if (!($g[33]!=0)) {
					$pc = 56
					continue
				}
				$g[76][$g[33]-1].setPen($g[1])
				$pc = 56
			case 56:
				$g[76][$g[33]].setPen($g[51])
				$g[77].setSize(ADDRW, ADDRH)
				$g[77].setPos($g[76][$g[33]].getX(), $g[76][$g[33]].getY())
				$g[77].setTxt("%04x", $g[36][$g[33]])
				$g[77].setOpacity(1)
				if ($g[77].setPos($g[80].addr.getX(), $g[80].addr.getY(), 2*TICKS, 1, 1))
				return
				$pc = 57
			case 57:
				$g[80].addr.setPen($g[51])
				$g[80].addr.setTxt("%04x", $g[36][$g[33]])
				$g[77].setOpacity(0)
				callf(25, $g[80].abus, TICKS, 1)
				continue
			case 58:
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
