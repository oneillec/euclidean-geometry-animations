"use strict"

function dlx(vplayer) {

	const ABSOLUTE = vplayer.ABSOLUTE;
	const ARROW60_END = vplayer.ARROW60_END;
	const BEVEL_JOIN = vplayer.BEVEL_JOIN;
	const BLACK = vplayer.BLACK;
	const BOLD = vplayer.BOLD;
	const DASH = vplayer.DASH;
	const DOT = vplayer.DOT;
	const FLAT_END = vplayer.FLAT_END;
	const GRAY192 = vplayer.GRAY192;
	const GRAY224 = vplayer.GRAY224;
	const GRAY64 = vplayer.GRAY64;
	const GREEN = vplayer.GREEN;
	const HLEFT = vplayer.HLEFT;
	const ITALIC = vplayer.ITALIC;
	const MB_LEFT = vplayer.MB_LEFT;
	const MB_RIGHT = vplayer.MB_RIGHT;
	const RED = vplayer.RED;
	const ROUND_END = vplayer.ROUND_END;
	const ROUND_JOIN = vplayer.ROUND_JOIN;
	const ROUND_START = vplayer.ROUND_START;
	const SMALLCAPS = vplayer.SMALLCAPS;
	const SOLID = vplayer.SOLID;
	const STRIKETHROUGH = vplayer.STRIKETHROUGH;
	const VTOP = vplayer.VTOP;
	const WHITE = vplayer.WHITE;
	const YELLOW = vplayer.YELLOW;

	var addWaitToEventQ = vplayer.addWaitToEventQ;
	var checkPoint = vplayer.checkPoint;
	var debug = vplayer.debug;
	var Font = vplayer.Font;
	var fork = vplayer.fork;
	var g = vplayer.g;
	var getArg = vplayer.getArg;
	var getArgAsNum = vplayer.getArgAsNum;
	var getURL = vplayer.getURL;
	var Image = vplayer.Image;
	var Layer = vplayer.Layer;
	var Line = vplayer.Line;
	var Line2 = vplayer.Line2;
	var newArray = vplayer.newArray;
	var Polygon = vplayer.Polygon;
	var R$ = vplayer.R$;
	var Rectangle = vplayer.Rectangle;
	var Rectangle2 = vplayer.Rectangle2;
	var reset = vplayer.reset;
	var rgba = vplayer.rgba;
	var round = vplayer.round;
	var setArg = vplayer.setArg;
	var setBgBrush = vplayer.setBgBrush;
	var setTPS = vplayer.setTPS;
	var setViewport = vplayer.setViewport;
	var SolidBrush = vplayer.SolidBrush;
	var SolidPen = vplayer.SolidPen;
	var sprintf = vplayer.sprintf;
	var sqrt = vplayer.sqrt;
	var stop = vplayer.stop;
	var terminateThread = vplayer.terminateThread;
	var timeMS = vplayer.timeMS;
	var Txt = vplayer.Txt;
	var VObj = vplayer.VObj;

	const THIN = 1;
	const MEDIUM = 3;
	const THICK = 5;
	const DARK_BLUE = rgba(0, 0, 0.625);
	const LIGHT_BLUE = rgba(0.75, 1, 1);
	const PURPLE = rgba(0.75, 0.625, 0.75);
	const BORDEAU = rgba(0.375, 0, 0);
	const MARINE = rgba(0.375, 0.625, 0.375);
	const LIGHT_YELLOW = rgba(1, 1, 0.75);
	const WIDTH = 710;
	const HEIGHT = 490;
	const maxexample = 4;
	const NO_STALL = 0;
	const DATA_STALL = 1;
	const CTRL_STALL = 2;
	const PIPELINING_ENABLED = 0;
	const PIPELINING_DISABLED = 1;
	const BRANCH_PREDICTION = 0;
	const BRANCH_INTERLOCK = 1;
	const DELAYED_BRANCHES = 2;
	const LOAD_INTERLOCK = 0;
	const NO_LOAD_INTERLOCK = 1;
	const ALU_FORWARDING = 0;
	const ALU_INTERLOCK = 1;
	const NO_ALU_INTERLOCK = 2;
	const FORWARDING_TO_SMDR = 0;
	const STORE_INTERLOCK = 1;
	const NO_STORE_INTERLOCK = 2;
	const ZERO_FORWARDING = 0;
	const ZERO_INTERLOCK = 1;
	const NO_ZERO_INTERLOCK = 2;
	const MAX_INSTR = 31;
	const NOP = 0;
	const ADD = 1;
	const SUB = 2;
	const AND = 3;
	const OR = 4;
	const XOR = 5;
	const SLL = 6;
	const SRL = 7;
	const SLT = 8;
	const SGT = 9;
	const SLE = 10;
	const SGE = 11;
	const ADDi = 12;
	const SUBi = 13;
	const ANDi = 14;
	const ORi = 15;
	const XORi = 16;
	const SLLi = 17;
	const SRLi = 18;
	const SLTi = 19;
	const SGTi = 20;
	const SLEi = 21;
	const SGEi = 22;
	const LD = 23;
	const ST = 24;
	const BEQZ = 25;
	const BNEZ = 26;
	const J = 27;
	const JAL = 28;
	const JR = 29;
	const JALR = 30;
	const HALT = 31;
	const STALL = 32;
	const EMPTY = 33;
	const OP_TYPE_UNUSED = 0;
	const OP_TYPE_REG = 1;
	const OP_TYPE_IMM = 2;
	const HORIZONTAL = 0;
	const VERTICAL = 1;
	const LEFT = 0;
	const RIGHT = 1;
	const TOP = 2;
	const BOTTOM = 3;
	const BUTTON_PE = 0;
	const BUTTON_BP = 1;
	const BUTTON_LI = 2;
	const BUTTON_AF = 3;
	const BUTTON_SF = 4;
	const BUTTON_ZF = 5;
	const BUTTON_SP = 6;
	const LOGOW = 20;
	const LOGOH = 20;

	var $thread = 0;
	var $pc = 0;
	var $fp = -1;
	var $sp = -1;
	var $acc = 0;
	var $obj = 0;
	var $stack = 0;

	function callf(pc, obj) {
		if (obj === undefined)
			obj = 0
		let l = arguments.length - 1;
		for (let i = l; i >= 2; i--)
			$stack[++$sp] = arguments[i];
		$acc = obj;
		$stack[++$sp] = $pc + 1;
		$pc = pc;
	}

	function enterf(n) {	// n = # local variables
		$stack[++$sp] = $obj;
		$stack[++$sp] = $fp;
		$fp = $sp;
		$obj = $acc;
		$sp += n;
	}

	function returnf(n) {	// n = # parameters to pop
		$sp = $fp;
		$fp = $stack[$sp--];
		$obj = $stack[$sp--];
		$pc = $stack[$sp--];
		if ($pc == -1) {
			terminateThread($thread);
			$thread = 0;
			return;
		}
		$sp -= n;
	}

	function suspendThread() {
		if ($thread == 0)
			return 0;
		$thread.pc = $pc;
		$thread.fp = $fp;
		$thread.sp = $sp;
		$thread.acc = $acc;
		$thread.obj = $obj;
		return $thread;
	}

	function waitTracker() {
		$pc++;
		return $thread;
	}

	function resumeThread(toThread) {
		$pc = toThread.pc;
		$fp = toThread.fp;
		$sp = toThread.sp;
		$acc = toThread.acc;
		$obj = toThread.obj;
		$stack = toThread.stack;
		$thread = toThread;
	}

	function switchToThread(toThread) {
		if ($thread == toThread)
			return;
		suspendThread();
		resumeThread(toThread);
	}

	function wait(ticks, pc) {
		$pc = (pc === undefined) ? $pc + 1 : pc;
		suspendThread();
		addWaitToEventQ(ticks, $thread);
	}


	function instrIsNop(instr) {
		return (instr == NOP || instr == STALL || instr == EMPTY || instr == HALT) ? 1 : 0;
	}

	function instrIsArRR(instr) {
		return (instr >= ADD && instr <= SGE) ? 1 : 0;
	}

	function instrIsArRI(instr) {
		return (instr >= ADDi && instr <= SGEi) ? 1 : 0;
	}

	function instrIsBranch(instr) {
		return ((instr == BEQZ) || (instr == BNEZ)) ? 1 : 0;
	}

	function instrIsJumpI(instr) {
		return ((instr == J) || (instr == JAL)) ? 1 : 0;
	}

	function instrIsJumpR(instr) {
		return (instr == JR || instr == JALR) ? 1 : 0;
	}

	function instrIsBranchOrJump(instr) {
		return (instrIsBranch(instr) || instrIsJumpI(instr) || instrIsJumpR(instr)) ? 1 : 0;
	}

	function instrIsJumpAndLink(instr) {
		return ((instr == JAL) || (instr == JALR)) ? 1 : 0;
	}

	function instrIsLoadOrStore(instr) {
		return (instr == LD || instr == ST) ? 1 : 0;
	}

	function instrOpTypeRdt(instr) {
		if (instrIsArRR(instr) || instrIsArRI(instr) || instrIsJumpAndLink(instr) || instrIsLoadOrStore(instr))
		return OP_TYPE_REG
		else 
		return OP_TYPE_UNUSED;
	}

	function instrOpTypeRs1(instr) {
		if (instrIsNop(instr) || instrIsJumpR(instr) || instrIsJumpI(instr))
		return OP_TYPE_UNUSED
		else 
		return OP_TYPE_REG;
	}

	function instrOpTypeRs2(instr) {
		if (instrIsNop(instr))
		return OP_TYPE_UNUSED
		else 
		if (instrIsArRR(instr) || instrIsJumpR(instr))
		return OP_TYPE_REG
		else 
		return OP_TYPE_IMM;
	}

	function instrText(instr, rdt, rs1, rs2) {
		if (instrIsNop(instr))
		return sprintf("%s", g[37][instr])
		else 
		if (instrIsArRR(instr))
		return sprintf("%s R%d,R%d,R%d", g[37][instr], rdt, rs1, rs2)
		else 
		if (instrIsArRI(instr))
		return sprintf("%s R%d,R%d,%02X", g[37][instr], rdt, rs1, rs2)
		else 
		if (instr == LD)
		return sprintf("LD R%d,R%d+%02X", rdt, rs1, rs2)
		else 
		if (instr == ST)
		return sprintf("ST R%d,R%d+%02X", rdt, rs1, rs2)
		else 
		if (instrIsBranch(instr))
		return sprintf("%s R%d,%02X", g[37][instr], rs1, rs2)
		else 
		if (instr == J)
		return sprintf("%s %02X", g[37][instr], rs2)
		else 
		if (instr == JAL)
		return sprintf("%s R%d, %02X", g[37][instr], rdt, rs2)
		else 
		if (instr == JR)
		return sprintf("%s R%d", g[37][instr], rs2)
		else 
		if (instr == JALR)
		return sprintf("%s R%d, R%d", g[37][instr], rdt, rs2);
		return "EMPTY";
	}

	function se8(t) {
		if (t & 128)
		return (-1 ^ 255 | t)
		else 
		return t;
	}

	function instrExecute(instr, op1, op2) {
		if (instr == ADD || instr == ADDi)
		return (se8(op1) + se8(op2)) & 255
		else 
		if (instr == SUB || instr == SUBi)
		return (se8(op1) - se8(op2)) & 255
		else 
		if (instr == AND || instr == ANDi)
		return op1 & op2
		else 
		if (instr == OR || instr == ORi)
		return op1 | op2
		else 
		if (instr == XOR || instr == XORi)
		return op1 ^ op2
		else 
		if (instr == SLL || instr == SLLi)
		return (op1 << op2) & 255
		else 
		if (instr == SRL || instr == SRLi)
		return (op1 >> op2) & 255
		else 
		if (instr == SLT || instr == SLTi)
		return op1 < op2 ? 1 : 0
		else 
		if (instr == SGT || instr == SGTi)
		return op1 > op2 ? 1 : 0
		else 
		if (instr == SLE || instr == SLEi)
		return op1 <= op2 ? 1 : 0
		else 
		if (instr == SGE || instr == SGEi)
		return op1 >= op2 ? 1 : 0
		else 
		if (instr == LD || instr == ST)
		return (se8(op1) + se8(op2)) & 255
		else 
		if (instr == JAL || instr == JALR)
		return op2
		else 
		return 238;
	}

	function Instruction(_x, _y, _w, _h, _addr) {
		VObj.call(this)
		this.x = _x;
		this.y = _y;
		this.w = _w;
		this.h = _h;
		this.addr = _addr;
		this.vIns = 0, this.vRdt = 0, this.vRs1 = 0, this.vRs2 = 0;
		this.opTypeRdt = 0, this.opTypeRs1 = 0, this.opTypeRs2 = 0;
		this.clk;
		this.fw = this.w / 6;
		this.insPen = new SolidPen(0, 0, BLACK);
		this.rdtPen = new SolidPen(0, 0, BLACK);
		this.rs1Pen = new SolidPen(0, 0, BLACK);
		this.rs2Pen = new SolidPen(0, 0, BLACK);
		this.brush = new SolidBrush(WHITE);
		this.adr = new Rectangle2(g[0], g[18], 0, 0, this.brush, this.x, this.y, this.fw, this.h, 0, g[17], "%02X", this.addr);
		this.ins = new Rectangle2(g[0], g[18], HLEFT, 0, this.brush, this.x + this.fw, this.y, 2 * this.fw, this.h, this.insPen, g[17], " NOP");
		this.rdt = new Rectangle2(g[0], g[18], 0, 0, this.brush, this.x + 3 * this.fw, this.y, this.fw, this.h, this.rdtPen, g[17], "-");
		this.rs1 = new Rectangle2(g[0], g[18], 0, 0, this.brush, this.x + 4 * this.fw, this.y, this.fw, this.h, this.rs1Pen, g[17], "-");
		this.rs2 = new Rectangle2(g[0], g[18], 0, 0, this.brush, this.x + 5 * this.fw, this.y, this.fw, this.h, this.rs2Pen, g[17], "-");
		this.dot = new Rectangle2(g[0], g[18], 0, 0, g[11], this.x + this.fw * 0.80000000000000004, this.y + 2, this.h / 2, this.h / 2);
		this.dot.setOpacity(0);
		this.arrowDown = new Line(g[0], g[18], 0, g[41], 0, 0, this.x + this.w + 2, this.y + this.h * 0.5, 5, 0, 0, 0, 0, 0);
		this.arrowUp = new Line(g[0], g[18], 0, g[41], 0, 0, this.x - 2, this.y + this.h * 0.5, -5, 0, 0, 0, 0, 0);
		this.arrowDown.setOpacity(0);
		this.arrowUp.setOpacity(0);
		this.adr.addEventHandler("eventEE", this, this.adrEventEE);
		this.ins.addEventHandler("eventEE", this, this.insEventEE);
		this.rdt.addEventHandler("eventEE", this, this.rdtEventEE);
		this.rs1.addEventHandler("eventEE", this, this.rs1EventEE);
		this.rs2.addEventHandler("eventEE", this, this.rs2EventEE);
		this.ins.addEventHandler("eventMB", this, this.insEventMB);
		this.rdt.addEventHandler("eventMB", this, this.rdtEventMB);
		this.rs1.addEventHandler("eventMB", this, this.rs1EventMB);
		this.rs2.addEventHandler("eventMB", this, this.rs2EventMB);
	}
	Instruction.prototype = Object.create(VObj.prototype);

	Instruction.prototype.adrEventEE = function(enter, x, y) {
		this.brush.setSolid(enter ? MARINE : WHITE);
		return 0;
	}

	Instruction.prototype.insEventEE = function(enter, x, y) {
		this.brush.setSolid(enter ? MARINE : WHITE);
		this.insPen.setColour(enter ? RED : BLACK);
		return 0;
	}

	Instruction.prototype.rdtEventEE = function(enter, x, y) {
		this.brush.setSolid(enter ? MARINE : WHITE);
		if (this.opTypeRdt != OP_TYPE_UNUSED) {
			this.rdtPen.setColour(enter ? RED : BLACK);
		} else {
			this.rdtPen.setColour(BLACK);
		}
		return 0;
	}

	Instruction.prototype.rs1EventEE = function(enter, x, y) {
		this.brush.setSolid(enter ? MARINE : WHITE);
		if (this.opTypeRs1 != OP_TYPE_UNUSED) {
			this.rs1Pen.setColour(enter ? RED : BLACK);
		} else {
			this.rs1Pen.setColour(BLACK);
		}
		return 0;
	}

	Instruction.prototype.rs2EventEE = function(enter, x, y) {
		this.brush.setSolid(enter ? MARINE : WHITE);
		if (this.opTypeRs2 != OP_TYPE_UNUSED) {
			this.rs2Pen.setColour(enter ? RED : BLACK);
		} else {
			this.rs2Pen.setColour(BLACK);
		}
		return 0;
	}

	Instruction.prototype.getOpcode = function() {
		return this.vIns << 24 | this.vRdt << 16 | this.vRs1 << 8 | this.vRs2;
	}

	Instruction.prototype.initRegs = function(remember) {
		let offset;
		this.ins.setTxt("%c%s", 32, g[37][this.vIns]);
		this.opTypeRdt = instrOpTypeRdt(this.vIns);
		this.opTypeRs1 = instrOpTypeRs1(this.vIns);
		this.opTypeRs2 = instrOpTypeRs2(this.vIns);
		if (this.opTypeRs2 == OP_TYPE_REG)
		this.vRs2 = (this.vRs2 % 4);
		if (this.opTypeRdt == OP_TYPE_UNUSED)
		this.rdt.setTxt("-")
		else 
		this.rdt.setTxt("R%d", this.vRdt);
		if (this.opTypeRs1 == OP_TYPE_UNUSED)
		this.rs1.setTxt("-")
		else 
		this.rs1.setTxt("R%d", this.vRs1);
		if (this.opTypeRs2 == OP_TYPE_UNUSED)
		this.rs2.setTxt("-")
		else 
		if (this.opTypeRs2 == OP_TYPE_REG)
		this.rs2.setTxt("R%d", this.vRs2)
		else 
		this.rs2.setTxt("%02X", this.vRs2);
		if (instrIsBranch(this.vIns) || instrIsJumpI(this.vIns)) {
			if (this.vRs2 & 128) {
				offset = (se8(this.vRs2) / 4) * this.h + this.h / 2;
				this.arrowUp.setPt(2, this.x - 7, this.y + offset);
				this.arrowUp.setPt(3, this.x - 2, this.y + offset);
				this.arrowUp.setOpacity(1);
				this.arrowDown.setOpacity(0);
			} else {
				offset = (this.vRs2 / 4) * this.h + this.h / 2;
				this.arrowDown.setPt(2, this.x + this.w + 7, this.y + offset);
				this.arrowDown.setPt(3, this.x + this.w + 2, this.y + offset);
				this.arrowDown.setOpacity(1);
				this.arrowUp.setOpacity(0);
			}
		} else {
			this.arrowUp.setOpacity(0);
			this.arrowDown.setOpacity(0);
		}
		if (remember) {
			let s = sprintf("i%d", this.addr / 4);
			setArg(s, this.getOpcode().toString());
			g[14] = 0;
			setArg("example", g[14].toString());
		}
	}

	Instruction.prototype.setValue = function(instr, rdt, rs1, rd2imm) {
		this.vIns = instr;
		this.vRdt = rdt;
		this.vRs1 = rs1;
		this.vRs2 = rd2imm & 255;
		this.initRegs(0);
	}

	Instruction.prototype.setOpcode = function(opcode) {
		this.vIns = (opcode & 4278190080) >> 24;
		this.vRdt = (opcode & 16711680) >> 16;
		this.vRs1 = (opcode & 65280) >> 8;
		this.vRs2 = (opcode & 255);
		this.initRegs(0);
	}

	Instruction.prototype.insEventMB = function(down, flags, x, y) {
		if (!g[24]) {
			if (down) {
				this.clk = timeMS();
				if (flags & MB_LEFT) {
					this.vIns = (this.vIns == MAX_INSTR) ? 0 : this.vIns + 1;
				} else
				if (flags & MB_RIGHT) {
					this.vIns = (this.vIns == 0) ? MAX_INSTR : this.vIns - 1;
				}
			} else {
				this.clk = this.clk + 500;
				if (timeMS() > this.clk)
				this.vIns = 0;
			}
			this.initRegs(1);
		}
		return 0;
	}

	Instruction.prototype.rdtEventMB = function(down, flags, x, y) {
		if (!g[24] && down && this.opTypeRdt != OP_TYPE_UNUSED) {
			if (flags & MB_LEFT) {
				this.vRdt = (this.vRdt == 3) ? 0 : this.vRdt + 1;
			} else
			if (flags & MB_RIGHT)
			this.vRdt = (this.vRdt == 0) ? 3 : this.vRdt - 1;
			this.initRegs(1);
		}
		return 0;
	}

	Instruction.prototype.rs1EventMB = function(down, flags, x, y) {
		if (!g[24] && down && this.opTypeRdt != OP_TYPE_UNUSED) {
			if (flags & MB_LEFT) {
				this.vRs1 = (this.vRs1 == 3) ? 0 : this.vRs1 + 1;
			} else
			if (flags & MB_RIGHT)
			this.vRs1 = (this.vRs1 == 0) ? 3 : this.vRs1 - 1;
			this.initRegs(1);
		}
		return 0;
	}

	Instruction.prototype.rs2EventMB = function(down, flags, x, y) {
		if (!g[24] && down) {
			if (flags & MB_LEFT) {
				if (this.opTypeRs2 == OP_TYPE_REG) {
					this.vRs2 = (this.vRs2 + 1) % 4;
				} else
				if (this.opTypeRs2 == OP_TYPE_IMM) {
					this.clk = timeMS();
					this.vRs2 = (this.vRs2 + 1) % 256;
				}
			} else
			if (flags & MB_RIGHT) {
				if (this.opTypeRs2 == OP_TYPE_REG) {
					this.vRs2 = (this.vRs2 - 1) % 4;
					if (this.vRs2 < 0)
					this.vRs2 = 4 + this.vRs2;
				} else
				if (this.opTypeRs2 == OP_TYPE_IMM) {
					this.clk = timeMS();
					this.vRs2 = (this.vRs2 - 1) % 256;
					if (this.vRs2 < 0)
					this.vRs2 = 256 + this.vRs2;
				}
			} else {
				if (this.opTypeRs2 == OP_TYPE_IMM) {
					this.clk = this.clk + 500;
					if (timeMS() > this.clk)
					this.vRs2 = 0;
				}
			}
			this.initRegs(1);
		}
	}

	function InstructionMemory(x, y, w, h) {
		VObj.call(this)
		this.ih = (h - 4) / 32;
		this.instruction = newArray(32);
		this.active = 31;
		this.r = new Rectangle2(g[0], 0, 0, g[1], g[38], x, y, w, h);
		this.r.setRounded(2, 2);
		new Rectangle2(g[0], 0, 0, g[1], g[39], x + 2, y + 2, w - 4, h - 4);
		for (this.lp1 = 0; this.lp1 < 32; this.lp1++)
		this.instruction[this.lp1] = new Instruction(x + 2, y + 2 + this.lp1 * this.ih, w - 4, this.ih, this.lp1 * 4);
	}
	InstructionMemory.prototype = Object.create(VObj.prototype);

	InstructionMemory.prototype.setValue = function(addr, instr, rdt, rs1, rs2imm) {
		this.instruction[addr / 4].setValue(instr, rdt, rs1, rs2imm);
	}

	InstructionMemory.prototype.getOpcode = function(addr) {
		return this.instruction[addr / 4].getOpcode();
	}

	InstructionMemory.prototype.setOpcode = function(addr, opcode) {
		this.instruction[addr / 4].setOpcode(opcode);
	}

	InstructionMemory.prototype.setActive = function(addr) {
		this.instruction[this.active].dot.setOpacity(0);
		this.active = addr / 4;
		this.instruction[this.active].dot.setOpacity(1);
	}

	function InstructionRegister(x, y, w, h, caption) {
		VObj.call(this)
		this.vIns = EMPTY, this.vRdt = 0, this.vRs1 = 0, this.vRs2 = 0;
		this.nIns = EMPTY, this.nRdt = 0, this.nRs1 = 0, this.nRs2 = 0;
		this.txt = "EMPTY";
		this.r1 = new Rectangle2(g[0], 0, 0, g[1], g[5], x, y, w, h);
		this.r1.setRounded(2, 2);
		this.r2 = new Rectangle2(g[0], 0, 0, g[1], g[12], x + 2, y + 2, w - 4, h - 14);
		this.r2.setRounded(2, 2);
		this.r3 = new Rectangle2(g[0], 0, 0, 0, 0, x, y + h - 10, w, 10, g[4], g[17], caption);
		this.label = new Txt(g[0], g[18], 0, x + w / 2, y + (h - 14) / 2, 0, g[17], this.txt);
		this.label.rotate(-90);
	}
	InstructionRegister.prototype = Object.create(VObj.prototype);

	InstructionRegister.prototype.setNewValue = function(instr, rdt, rs1, rs2) {
		this.nIns = instr;
		this.nRdt = rdt;
		this.nRs1 = rs1;
		this.nRs2 = rs2;
	}

	InstructionRegister.prototype.setNewInstruction = function(i) {
		this.nIns = i.vIns;
		this.nRdt = i.vRdt;
		this.nRs1 = i.vRs1;
		this.nRs2 = i.vRs2;
	}

	InstructionRegister.prototype.getNewInstrTxt = function() {
		return instrText(this.nIns, this.nRdt, this.nRs1, this.nRs2);
	}

	InstructionRegister.prototype.setOpacity = function(opacity) {
		this.r1.setOpacity(opacity);
		this.r2.setOpacity(opacity);
		this.r3.setOpacity(opacity);
		this.label.setOpacity(opacity);
	}

	InstructionRegister.prototype.reset = function() {
		this.vIns = EMPTY;
		this.vRdt = this.vRs1 = this.vRs2 = 0;
		this.nIns = EMPTY;
		this.nRdt = this.nRs1 = this.nRs2 = 0;
		this.txt = instrText(this.vIns, this.vRdt, this.vRs1, this.vRs2);
		this.label.setTxt(this.txt);
	}

	function Register(x, y, w, h, labelPos, caption) {
		VObj.call(this)
		this.vx, this.vy, this.vw, this.vh;
		this.value = 0, this.newValue = 0;
		this.tag = 0, this.newTag = 0;
		this.useTag = 0, this.invalid = 0;
		this.fixed = 0;
		this.label;
		this.r1 = new Rectangle2(g[0], 0, 0, g[1], g[42], x, y, w, h);
		this.r1.setRounded(2, 2);
		this.bg1 = new Rectangle2(g[0], g[18], 0, 0, g[12], this.vx, this.vy, this.vw / 2, this.vh);
		this.bg2 = new Rectangle2(g[0], g[18], 0, 0, g[12], this.vx + this.vw / 2, this.vy, this.vw / 2, this.vh);
		if (w >= h) {
			this.vy = y + 2;
			this.vw = w - 14;
			this.vh = h - 4;
			if (labelPos == LEFT) {
				this.r2 = new Rectangle(g[0], 0, 0, 0, 0, x + 7 - 1, y + h / 2, -7, -h / 2, 14, h, 0, g[17], caption);
				this.r2.rotate(-90);
				this.vx = x + 12;
			} else
			if (labelPos == RIGHT) {
				this.r2 = new Rectangle(g[0], 0, 0, 0, 0, x + w - 7, y + h / 2, -7, -h / 2, 14, h, 0, g[17], caption);
				this.r2.rotate(-90);
				this.vx = x + 2;
			}
		} else {
			this.vx = x + 2;
			this.vw = w - 4;
			this.vh = h - 14;
			if (labelPos == TOP) {
				this.r2 = new Rectangle2(g[0], 0, 0, 0, 0, x, y, w, 14, 0, g[17], caption);
				this.vy = y + 12;
			} else
			if (labelPos == BOTTOM) {
				this.r2 = new Rectangle2(g[0], 0, 0, 0, 0, x, y + h - 10, w, 10, 0, g[17], caption);
				this.vy = y + 2;
			}
		}
		if (w >= h) {
			this.label = new Rectangle2(g[0], g[18], 0, 0, g[13], this.vx, this.vy, this.vw, this.vh, 0, g[17], "%02X", this.value);
		} else {
			this.label = new Rectangle(g[0], g[18], 0, 0, g[13], this.vx + this.vw / 2, this.vy + this.vh / 2, -this.vw / 2, -this.vh / 2, this.vw, this.vh, 0, g[17], "%02X", this.value);
		}
		this.label.setRounded(2, 2);
		this.label.addEventHandler("eventEE", this, this.labelEventEE);
		this.label.addEventHandler("eventMB", this, this.labelEventMB);
		this.hmode = 0;
	}
	Register.prototype = Object.create(VObj.prototype);

	Register.prototype.setFixed = function() {
		this.fixed = 1;
	}

	Register.prototype.setOpacity = function(opacity) {
		this.r1.setOpacity(opacity);
		this.r2.setOpacity(opacity);
		this.bg1.setOpacity(opacity);
		this.bg2.setOpacity(opacity);
		this.label.setOpacity(opacity);
	}

	Register.prototype.updateLabel = function() {
		if (this.invalid) {
			this.label.setTxt("INV");
		} else
		if (this.useTag) {
			if (this.tag >= 0)
			this.label.setTxt("R%d:%02X", this.tag, this.value)
			else 
			this.label.setTxt("--:%02X", this.value);
		} else {
			this.label.setTxt("%02X", this.value);
		}
		return 0;
	}

	Register.prototype.labelEventEE = function(enter, x, y) {
		if (this.fixed == 0)
		this.label.setBrush(enter ? g[12] : g[13]);
		return 0;
	}

	Register.prototype.labelEventMB = function(down, flags, x, y) {
		if (this.fixed == 0 && down) {
			if (flags & MB_LEFT) {
				this.value = (this.value + 1) & 255;
			} else
			if (flags & MB_RIGHT) {
				this.value = (this.value - 1) & 255;
			}
			this.updateLabel();
		}
		return 0;
	}

	Register.prototype.setValue = function(val) {
		this.value = val;
		this.invalid = 0;
		this.updateLabel();
	}

	Register.prototype.setNewValue = function(val) {
		this.newValue = val;
	}

	Register.prototype.setNewTag = function(t) {
		this.newTag = t;
	}

	Register.prototype.setTag = function(t) {
		this.useTag = 1;
		this.tag = t;
		this.updateLabel();
	}

	Register.prototype.setInvalid = function(i) {
		this.useTag = 1;
		this.invalid = i;
	}

	Register.prototype.tagMatches = function(t) {
		return (this.invalid) ? 0 : (this.tag == t) ? 1 : 0;
	}

	Register.prototype.highlight = function(brush) {
		if (this.hmode == 0) {
			this.bg1.setBrush(brush);
			this.bg2.setBrush(brush);
			this.hmode = 1;
		} else {
			this.bg2.setBrush(brush);
		}
	}

	Register.prototype.unHighlight = function() {
		this.bg1.setBrush(g[12]);
		this.bg2.setBrush(g[12]);
		this.hmode = 0;
	}

	Register.prototype.reset = function() {
		this.value = 0;
		this.newValue = 0;
		this.tag = 0;
		this.newTag = 0;
		this.useTag = 0;
		this.invalid = 0;
		this.unHighlight();
		this.updateLabel();
	}

	function Component(_x, _y, _w, _h, caption) {
		VObj.call(this)
		this.x = _x;
		this.y = _y;
		this.w = _w;
		this.h = _h;
		this.bg = new Rectangle2(g[0], 0, 0, g[1], g[44], this.x, this.y, this.w, this.h);
		this.bg.setRounded(2, 2);
		this.label;
		if (this.w >= this.h) {
			this.label = new Rectangle2(g[0], 0, 0, 0, 0, this.x, this.y, this.w, this.h, 0, g[45], caption);
		} else {
			this.label = new Rectangle(g[0], 0, 0, 0, 0, this.x + this.w / 2 - 1, this.y + this.h / 2, -this.w / 2, -this.h / 2, this.w, this.h, 0, g[45], caption);
			this.label.rotate(-90);
		}
	}
	Component.prototype = Object.create(VObj.prototype);

	Component.prototype.setOpacity = function(opacity) {
		this.bg.setOpacity(opacity);
		this.label.setOpacity(opacity);
	}

	function ALU(x, y, w, h) {
		VObj.call(this)
		this.alu = new Polygon(g[0], 0, ABSOLUTE, g[1], g[44], x, y, 0, 0, w, h / 4, w, 3 * h / 4, 0, h, 0, 5 * h / 8, w / 2, h / 2, 0, 3 * h / 8);
		new Rectangle2(g[0], 0, 0, 0, 0, x, y - 10, w, 10, 0, g[45], "ALU");
		this.op = "";
		this.txtOp = new Rectangle(g[0], g[18], 0, 0, g[11], x, y + h / 2, 0, -h / 12, 2 * w / 3, h / 6, g[4], g[45], this.op);
		this.txtOp.setOpacity(0);
		this.txtOp.setRounded(2, 2);
		this.txtResult = new Rectangle(g[0], g[20], 0, g[1], g[13], x + 3 * w / 4, y + h / 2, 0, -h / 12, w / 2, h / 6, g[1], g[45]);
		this.txtResult.setOpacity(0);
		this.txtResult.setRounded(2, 2);
	}
	ALU.prototype = Object.create(VObj.prototype);

	ALU.prototype.setTxtOp = function(vIns) {
		this.op = "";
		if (vIns == ADD || vIns == ADDi)
		this.op = "ADD"
		else 
		if (vIns == SUB || vIns == SUBi)
		this.op = "SUB"
		else 
		if (vIns == AND || vIns == ANDi)
		this.op = "AND"
		else 
		if (vIns == OR || vIns == ORi)
		this.op = "OR"
		else 
		if (vIns == XOR || vIns == XORi)
		this.op = "XOR"
		else 
		if (vIns == SLL || vIns == SLLi)
		this.op = "SLL"
		else 
		if (vIns == SRL || vIns == SRLi)
		this.op = "SRL"
		else 
		if (vIns == SLT || vIns == SLTi)
		this.op = "LT"
		else 
		if (vIns == SGT || vIns == SGTi)
		this.op = "GT"
		else 
		if (vIns == SLE || vIns == SLEi)
		this.op = "LE"
		else 
		if (vIns == SGE || vIns == SGEi)
		this.op = "GE"
		else 
		if (vIns == LD || vIns == ST)
		this.op = "ADD"
		else 
		if (vIns == JAL || vIns == JALR)
		this.op = "ADD";
		this.txtOp.setTxt(this.op);
		this.txtOp.setOpacity(1);
	}

	function AnimPipe() {
		VObj.call(this)
		this.w = 5;
		this.n = 0;
		this.px = newArray(0);
		this.py = newArray(0);
		this.ls = newArray(0);
		this.ll = 0;
		this.head = 1;
		this.bgPen0 = new SolidPen(SOLID, this.w, GRAY192, BEVEL_JOIN | FLAT_END);
		this.bgPen1 = new SolidPen(SOLID, this.w, GRAY192, BEVEL_JOIN | ARROW60_END);
		this.fgPen0 = new SolidPen(SOLID, this.w, RED, BEVEL_JOIN | FLAT_END);
		this.fgPen1 = new SolidPen(SOLID, this.w, RED, BEVEL_JOIN | ARROW60_END);
		this.bgLine = new Line(g[0], g[19], 0, this.bgPen1, 0, 0);
		this.fgLine = new Line(g[0], g[20], 0, this.fgPen0, 0, 0);
	}
	AnimPipe.prototype = Object.create(VObj.prototype);

	AnimPipe.prototype.setOpacity = function(opacity) {
		this.bgLine.setOpacity(opacity);
		this.fgLine.setOpacity(opacity);
	}

	AnimPipe.prototype.setHead = function(h) {
		this.head = h ? 1 : 0;
		this.bgLine.setPen(this.head ? this.bgPen1 : this.bgPen0);
		this.fgLine.setPen(this.fgPen0);
	}

	AnimPipe.prototype.addPoint = function(x, y) {
		this.px[this.n] = x;
		this.py[this.n] = y;
		this.bgLine.setPt(this.n, x, y);
		this.n++;
	}

	AnimPipe.prototype.calcLength = function() {
		let dx, dy;
		this.ll = 0;
		for (let i = 0; i < this.n - 1; i++) {
			dx = this.px[i + 1] - this.px[i];
			dy = this.py[i + 1] - this.py[i];
			this.ll += this.ls[i] = sqrt(dx * dx + dy * dy);
		}
	}

	AnimPipe.prototype.setPoint = function(n, x, y) {
		this.px[n] = x;
		this.py[n] = y;
		this.bgLine.setPt(n, x, y);
	}

	AnimPipe.prototype.reset = function() {
		this.fgLine.setNPts(0);
		this.fgLine.setPen(this.fgPen0);
	}

	function AnimatedClock(x, y, w, h) {
		VObj.call(this)
		this.cw = w;
		this.chw = this.cw / 2;
		this.ch = h - 6;
		this.stall = 0, this.type = 0;
		this.clkDisplay = new Rectangle2(g[0], 0, 0, g[1], g[12], x, y, w, h);
		this.clkDisplay.setRounded(2, 2);
		this.prev_clock = new Line(g[0], g[20], 0, g[48], x - this.chw + this.chw / 5, y + 3 + this.ch, 0, 0, 0, -this.ch, this.chw, 0, 0, this.ch, this.chw, 0);
		this.next_clock = new Line(g[0], g[20], 0, g[46], x + this.chw + this.chw / 5, y + 3 + this.ch, 0, 0, 0, -this.ch, this.chw, 0, 0, this.ch, this.chw, 0);
		this.prev_clock.setClipPath(R$(x + 1, y + 1, w - 2, h - 2));
		this.next_clock.setClipPath(R$(x + 1, y + 1, w - 2, h - 2));
		this.dot = new Rectangle2(g[0], g[20], 0, 0, g[5], x + w / 2 - 3, y + h - 6, 6, 6);
		this.canUpdate;
	}
	AnimatedClock.prototype = Object.create(VObj.prototype);

	AnimatedClock.prototype.setStall = function(s, t) {
		this.stall = s;
		this.type = t;
		if (this.canUpdate) {
			if (this.stall)
			this.prev_clock.setPen((this.type) ? g[47] : g[48])
			else 
			this.prev_clock.setPen(g[46]);
		}
	}

	function Button(x, y, w, h, caption, ID) {
		VObj.call(this)
		this.label = new Rectangle2(g[0], 0, 0, g[1], g[49], x, y, w, h, g[1], g[15], caption);
		this.label.addEventHandler("eventEE", this, this.labelEventEE);
	}
	Button.prototype = Object.create(VObj.prototype);

	Button.prototype.labelEventEE = function(enter, x, y) {
		this.label.setBrush(enter ? g[50] : g[49]);
		return 0;
	}

	Button.prototype.setCaption = function(caption) {
		this.label.setTxt(caption);
	}

	Button.prototype.showLocked = function(locked) {
		this.label.setFont(locked ? g[16] : g[15]);
	}

	function resetWires() {
		g[84].reset();
		g[82].reset();
		g[83].setOpacity(0);
		g[85].reset();
		g[86].reset();
		g[87].reset();
		g[88].reset();
		g[89].reset();
		g[90].reset();
		g[91].reset();
		g[92].reset();
		g[93].reset();
		g[94].reset();
		g[113].reset();
		g[114].reset();
		g[115].reset();
		g[116].reset();
		g[117].reset();
		g[118].reset();
		g[119].setOpacity(0);
		g[120].reset();
		g[121].setOpacity(0);
		g[122].reset();
		g[123].setOpacity(0);
		g[124].reset();
		g[125].setOpacity(0);
		g[127].reset();
		g[126].reset();
		g[128].reset();
		g[129].reset();
		g[130].setOpacity(0);
		g[131].reset();
		g[132].setOpacity(0);
		g[106].setPen(g[103]);
		g[107].setPen(g[103]);
		g[108].setPen(g[103]);
		g[109].setPen(g[103]);
		g[110].setPen(g[103]);
		g[140].reset();
		g[141].reset();
		g[142].reset();
		g[143].reset();
		g[144].reset();
		g[145].reset();
		g[146].setOpacity(0);
		g[147].reset();
		g[148].reset();
		g[149].reset();
		g[150].reset();
		g[151].reset();
		g[152].reset();
		g[153].reset();
		g[154].reset();
		g[139].txtOp.setOpacity(0);
		g[139].txtResult.setOpacity(0);
		g[160].reset();
		g[161].reset();
		g[162].reset();
		g[163].reset();
		g[164].reset();
		g[165].reset();
		g[168].reset();
	}

	function resetRegisters() {
		g[75].reset();
		g[75].setValue(124);
		g[96].reset();
		g[134].reset();
		g[135].reset();
		g[157].reset();
		g[156].reset();
		g[167].reset();
		g[77][0].reset();
		g[77][1].reset();
		g[78][0].reset();
		g[78][1].reset();
		g[95].reset();
		g[133].reset();
		g[155].reset();
		g[166].reset();
		g[73].setActive(124);
		g[156].setInvalid(1);
		g[156].updateLabel();
		g[167].setInvalid(1);
		g[167].updateLabel();
		g[77][0].setValue(-1);
		g[77][0].setInvalid(1);
		g[77][0].updateLabel();
		g[77][1].setValue(-1);
		g[77][1].setInvalid(1);
		g[77][1].updateLabel();
		g[35] = 0;
		g[36] = 0;
		g[70].setTxt("%4d", 0);
		g[71].setTxt("%4d", 0);
	}

	function resetCircuit() {
		resetRegisters();
		resetWires();
	}

	function showBTB(opacity) {
		g[76].setOpacity(opacity);
		g[77][0].setOpacity(opacity);
		g[77][1].setOpacity(opacity);
		g[78][0].setOpacity(opacity);
		g[78][1].setOpacity(opacity);
		g[90].setOpacity(opacity);
		g[113].setOpacity(opacity);
		g[79].setOpacity(opacity);
		g[93].setOpacity(opacity);
		g[86].setOpacity(opacity);
		g[124].setOpacity(opacity);
		g[127].setOpacity(opacity);
		g[101].setOpacity(opacity);
		g[126].setOpacity(opacity);
	}

	function showALUForwarding(opacity) {
		if (opacity == 0) {
			g[143].setPoint(0, 420, 205);
			g[143].setPoint(1, 481, 205);
			g[144].setPoint(0, (g[31]) ? 420 : 410, 250);
			g[144].setPoint(1, 470, 250);
			g[145].setPoint(2, 430, 260);
			g[145].setPoint(3, 470, 260);
			g[143].setHead(0);
		} else {
			g[143].setPoint(0, 420, 220);
			g[143].setPoint(1, 470, 220);
			g[144].setPoint(0, 420, 240);
			g[144].setPoint(1, 470, 240);
			g[145].setPoint(2, 430, 250);
			g[145].setPoint(3, 470, 250);
			g[143].setHead(1);
		}
		g[136].setOpacity(opacity);
		g[141].setOpacity(opacity);
		g[142].setOpacity(opacity);
		g[148].setOpacity(opacity);
		g[147].setOpacity(opacity);
	}

	function showSMDRForwarding(opacity) {
		if (opacity == 0) {
			g[151].setPoint(1, 410, 330);
			g[151].setPoint(2, 480, 330);
			g[151].setHead(0);
		} else {
			g[151].setPoint(1, 410, 340);
			g[151].setPoint(2, 470, 340);
			g[151].setHead(1);
		}
		g[138].setOpacity(opacity);
		g[149].setOpacity(opacity);
		g[150].setOpacity(opacity);
	}

	function showZeroForwarding(opacity) {
		if (opacity == 0) {
			g[109].setPt(1, 355, 135);
			g[109].setPt(2, 355, 160);
		} else {
			g[109].setPt(1, 345, 135);
			g[109].setPt(2, 345, 160);
		}
		g[111].setOpacity(opacity);
		g[112].setOpacity(opacity);
		g[106].setOpacity(opacity);
		g[107].setOpacity(opacity);
		g[108].setOpacity(opacity);
	}

	function showPipeline(opacity) {
		if (opacity == 0) {
			g[92].setPoint(1, 260, 230);
			g[92].setPoint(2, 260, 240);
			g[115].setPoint(0, 260, 230);
			g[116].setPoint(0, 260, 230);
			g[94].setPoint(1, 420, 390);
			g[131].setPoint(1, 370, 205);
			g[131].setPoint(2, 420, 205);
			g[128].setPoint(1, 410, 250);
			g[151].setPoint(0, 410, 250);
			g[153].setPoint(3, 580, 230);
			g[154].setPoint(3, 580, 230);
			g[152].setPoint(1, 590, 330);
			g[162].setPoint(1, 680, 230);
			g[94].setHead(0);
			g[92].setHead(0);
			g[131].setHead(0);
			g[143].setHead(0);
			g[128].setHead(0);
			g[151].setHead(0);
			g[152].setHead(0);
			g[153].setHead(0);
			g[154].setHead(0);
			g[162].setHead(0);
			showBTB(opacity);
			showALUForwarding(opacity);
			showSMDRForwarding(opacity);
			showZeroForwarding(opacity);
		} else {
			g[92].setPoint(1, 240, 230);
			g[92].setPoint(2, 250, 230);
			g[115].setPoint(0, 260, 250);
			g[116].setPoint(0, 260, 250);
			g[94].setPoint(1, 400, 390);
			g[131].setPoint(1, 370, 210);
			g[131].setPoint(2, 400, 210);
			g[128].setPoint(1, 400, 250);
			g[151].setPoint(0, 410, 270);
			g[153].setPoint(3, 560, 230);
			g[154].setPoint(3, 560, 230);
			g[152].setPoint(1, 550, 330);
			g[162].setPoint(1, 660, 230);
			g[94].setHead(1);
			g[92].setHead(1);
			g[131].setHead(1);
			g[143].setHead(1);
			g[128].setHead(1);
			g[151].setHead(1);
			g[152].setHead(1);
			g[153].setHead(1);
			g[154].setHead(1);
			g[162].setHead(1);
			showBTB(g[29] == BRANCH_PREDICTION ? 1 : 0);
			showALUForwarding(g[31] == ALU_FORWARDING ? 1 : 0);
			showSMDRForwarding(g[32] == FORWARDING_TO_SMDR ? 1 : 0);
			showZeroForwarding(g[33] == ZERO_FORWARDING ? 1 : 0);
		}
		g[91].setOpacity(opacity);
		g[81].setOpacity(opacity);
		g[88].setOpacity(opacity);
		g[96].setOpacity(opacity);
		g[133].setOpacity(opacity);
		g[155].setOpacity(opacity);
		g[166].setOpacity(opacity);
		g[140].setOpacity(opacity);
		g[160].setOpacity(opacity);
		g[134].setOpacity(opacity);
		g[135].setOpacity(opacity);
		g[156].setOpacity(opacity);
		g[167].setOpacity(opacity);
		g[157].setOpacity(opacity);
		g[63].label.setOpacity(opacity);
		g[64].label.setOpacity(opacity);
		g[65].label.setOpacity(opacity);
		g[66].label.setOpacity(opacity);
		g[67].label.setOpacity(opacity);
	}

	function setPEMode(mode) {
		g[28] = mode;
		if (g[28] == 0) {
			g[62].setCaption("Pipelining Enabled");
			showPipeline(1);
		} else
		if (g[28] == 1) {
			g[62].setCaption("Pipelining Disabled");
			showPipeline(0);
		}
		setArg("peMode", g[28].toString());
	}

	function setBPMode(mode) {
		g[29] = mode;
		if (g[29] == 0) {
			g[63].setCaption("Branch Prediction");
			showBTB(1);
		} else
		if (g[29] == 1) {
			g[63].setCaption("Branch Interlock");
			showBTB(0);
		} else
		if (g[29] == 2) {
			g[63].setCaption("Delayed Branches");
			showBTB(0);
		}
		setArg("bpMode", g[29].toString());
	}

	function setLIMode(mode) {
		g[30] = mode;
		if (g[30] == 0) {
			g[64].setCaption("Load Interlock");
		} else
		if (g[30] == 1) {
			g[64].setCaption("No Load Interlock");
		}
		setArg("liMode", g[30].toString());
	}

	function setAFMode(mode) {
		g[31] = mode;
		if (g[31] == 0) {
			g[65].setCaption("ALU Forwarding");
			showALUForwarding(1);
		} else
		if (g[31] == 1) {
			g[65].setCaption("ALU Interlock");
			showALUForwarding(0);
		} else
		if (g[31] == 2) {
			g[65].setCaption("No ALU Interlock");
			showALUForwarding(0);
		}
		setArg("afMode", g[31].toString());
	}

	function setSFMode(mode) {
		g[32] = mode;
		if (g[32] == 0) {
			g[66].setCaption("Store Operand\nForwarding");
			showSMDRForwarding(1);
		} else
		if (g[32] == 1) {
			g[66].setCaption("Store Interlock");
			showSMDRForwarding(0);
		} else
		if (g[32] == 2) {
			g[66].setCaption("No Store Interlock");
			showSMDRForwarding(0);
		}
		setArg("sfMode", g[32].toString());
	}

	function setZFMode(mode) {
		g[33] = mode;
		if (g[33] == 0) {
			g[67].setCaption("Zero Forwarding");
			showZeroForwarding(1);
		} else
		if (g[33] == 1) {
			g[67].setCaption("Zero Interlock");
			showZeroForwarding(0);
		} else
		if (g[33] == 2) {
			g[67].setCaption("No Zero Interlock");
			showZeroForwarding(0);
		}
		setArg("zfMode", g[33].toString());
	}

	function closeHelpEventEE(enter, x, y) {
		g[177].setBrush(enter ? g[9] : g[13]);
	}

	function closeHelpEventMB(down, flags, x, y) {
		if (down && (flags & MB_LEFT)) {
			setArg("help", "0");
			g[21].setOpacity(0);
		}
		return 0;
	}

	function btbIndex(pc) {
		for (let lp1 = 0; lp1 < 2; lp1++)
		if (g[77][lp1].value == pc)
		return lp1;
		return -1;
	}

	function detectStall() {
		g[25] = NO_STALL;
		g[27] = 0;
		if (g[31] == ALU_INTERLOCK) {
			if (instrOpTypeRdt(g[133].vIns) == OP_TYPE_REG) {
				if ((instrOpTypeRs1(g[95].vIns) == OP_TYPE_REG) && (g[95].vRs1 == g[133].vRdt))
				g[25] = DATA_STALL;
				if ((instrOpTypeRs2(g[95].vIns) == OP_TYPE_REG) && (g[95].vRs2 == g[133].vRdt))
				g[25] = DATA_STALL;
			}
			if (instrOpTypeRdt(g[155].vIns) == OP_TYPE_REG) {
				if ((instrOpTypeRs1(g[95].vIns) == OP_TYPE_REG) && (g[95].vRs1 == g[155].vRdt))
				g[25] = DATA_STALL;
				if ((instrOpTypeRs2(g[95].vIns) == OP_TYPE_REG) && (g[95].vRs2 == g[155].vRdt))
				g[25] = DATA_STALL;
			}
		}
		if ((g[32] == STORE_INTERLOCK) && (g[95].vIns == ST)) {
			if ((instrOpTypeRdt(g[133].vIns) == OP_TYPE_REG) && (g[133].vRdt == g[95].vRdt))
			g[25] = DATA_STALL;
			if ((instrOpTypeRdt(g[155].vIns) == OP_TYPE_REG) && (g[155].vRdt == g[95].vRdt))
			g[25] = DATA_STALL;
		}
		if ((g[33] == ZERO_INTERLOCK) && instrIsBranch(g[95].vIns)) {
			if ((instrOpTypeRdt(g[133].vIns) == OP_TYPE_REG) && (g[133].vRdt == g[95].vRs1))
			g[25] = DATA_STALL;
			if ((instrOpTypeRdt(g[155].vIns) == OP_TYPE_REG) && (g[155].vRdt == g[95].vRs1))
			g[25] = DATA_STALL;
		}
		if (instrIsJumpR(g[95].vIns)) {
			if ((instrOpTypeRdt(g[133].vIns) == OP_TYPE_REG) && (g[133].vRdt == g[95].vRs2))
			g[25] = DATA_STALL;
			if ((instrOpTypeRdt(g[155].vIns) == OP_TYPE_REG) && (g[155].vRdt == g[95].vRs2))
			g[25] = DATA_STALL;
		}
		if ((g[30] == LOAD_INTERLOCK) && (g[133].vIns == LD)) {
			if ((instrOpTypeRs1(g[95].vIns) == OP_TYPE_REG) && (g[95].vRs1 == g[133].vRdt))
			g[25] = DATA_STALL;
			if ((instrOpTypeRs2(g[95].vIns) == OP_TYPE_REG) && (g[95].vRs2 == g[133].vRdt))
			g[25] = DATA_STALL;
		}
		if ((g[25] == NO_STALL) && (g[29] != DELAYED_BRANCHES) && instrIsBranchOrJump(g[95].vIns) && !((g[178] == g[88]) || (g[178] == g[86]))) {
			g[27] = 1;
			g[25] = CTRL_STALL;
		}
		if (g[25] == DATA_STALL) {
			g[74].setStall(1, 0);
		} else
		if (g[25] == CTRL_STALL) {
			g[74].setStall(1, 1);
		}
	}

	function setlocked() {
		let b_locked = g[34] || g[24];
		g[62].showLocked(b_locked);
		g[63].showLocked(b_locked);
		g[64].showLocked(b_locked);
		g[65].showLocked(b_locked);
		g[66].showLocked(b_locked);
		g[67].showLocked(b_locked);
	}

	function buttonPEEventMB(down, flags, x, y) {
		if (down && (flags & MB_LEFT) && (!g[34]) && (!g[24])) {
			setPEMode((g[28] + 1) % 2);
			resetCircuit();
		}
		return 0;
	}

	function buttonBPEventMB(down, flags, x, y) {
		if (down && (flags & MB_LEFT) && (!g[34]) && (!g[24])) {
			setBPMode((g[29] + 1) % 3);
			resetCircuit();
		}
		return 0;
	}

	function buttonLIEventMB(down, flags, x, y) {
		if (down && (flags & MB_LEFT) && (!g[34]) && (!g[24])) {
			setLIMode((g[30] + 1) % 2);
			resetCircuit();
		}
		return 0;
	}

	function buttonAFEventMB(down, flags, x, y) {
		if (down && (flags & MB_LEFT) && (!g[34]) && (!g[24])) {
			setAFMode((g[31] + 1) % 3);
			resetCircuit();
		}
		return 0;
	}

	function buttonSFEventMB(down, flags, x, y) {
		if (down && (flags & MB_LEFT) && (!g[34]) && (!g[24])) {
			setSFMode((g[32] + 1) % 3);
			resetCircuit();
		}
		return 0;
	}

	function buttonZFEventMB(down, flags, x, y) {
		if (down && (flags & MB_LEFT) && (!g[34]) && (!g[24])) {
			setZFMode((g[33] + 1) % 3);
			resetCircuit();
		}
		return 0;
	}

	function buttonSPEventMB(down, flags, x, y) {
		if (down && (flags & MB_LEFT)) {
			debug("save configuration");
			let lp1, opcode, reg;
			let instr;
			let s = "saveanim.php?state=";
			for (lp1 = 0; lp1 < 32; lp1++) {
				instr = g[73].instruction[lp1];
				opcode = (instr.vIns << 24) | (instr.vRdt << 16) | (instr.vRs1 << 8) | (instr.vRs2);
				s = sprintf("%si%d='0x%08X' ", s, lp1, opcode);
			}
			for (lp1 = 0; lp1 < 4; lp1++) {
				reg = g[97][lp1].value;
				s = sprintf("%sr%d='0x%02X' ", s, lp1, reg);
			}
			for (lp1 = 0; lp1 < 4; lp1++) {
				reg = g[158][lp1].value;
				s = sprintf("%sm%d='0x%02X' ", s, lp1, reg);
			}
			s = sprintf("%speMode='%d' bpMode='%d' liMode='%d' afMode='%d' sfMode='%d' zfMode='%d'", s, g[28], g[29], g[30], g[31], g[32], g[33]);
			debug("%s", s);
			getURL(s);
		}
		return 0;
	}

	function logoEventMB(down, flags, x, y) {
		if (down && (flags & MB_LEFT))
		getURL("https://www.scss.tcd.ie/Jeremy.Jones/VivioJS/vivio.htm");
		return 0;
	}

	function titleEventMB(down, flags, x, y) {
		if (down && (flags & MB_LEFT))
		getURL("showanim.php");
	}

	function imLabelEventEE(enter, x, y) {
		g[72].setBrush(enter ? g[8] : g[12]);
		g[72].setTxtPen(enter ? g[3] : g[1]);
		return 0;
	}

	function imLabelEventMB(down, flags, x, y) {
		if (down && (flags & MB_LEFT)) {
			g[14] = (g[14] == maxexample) ? 0 : g[14] + 1;
			setArg("example", g[14].toString());
			reset();
		}
		return 0;
	}

	function execute(thread) {

		switchToThread(thread);

		while (1) {
			switch ($pc) {
			case -1:
				return;		// catch thread termination
			case 0:
				enterf(0);	// started with a function call
				g[1] = new SolidPen(0, 1, BLACK);
				g[2] = new SolidPen(0, 0, GRAY64);
				g[3] = new SolidPen(0, 0, RED);
				g[4] = new SolidPen(0, 0, WHITE);
				g[5] = new SolidBrush(BLACK);
				g[6] = new SolidBrush(GRAY64);
				g[7] = new SolidBrush(LIGHT_BLUE);
				g[8] = new SolidBrush(GRAY192);
				g[9] = new SolidBrush(GRAY224);
				g[10] = new SolidBrush(MARINE);
				g[11] = new SolidBrush(RED);
				g[12] = new SolidBrush(WHITE);
				g[13] = new SolidBrush(YELLOW);
				g[14] = 0;
				setViewport(0, 0, WIDTH, HEIGHT, 1);
				setBgBrush(g[12]);
				g[15] = new Font("Calibri", 8);
				g[16] = new Font("Calibri", 8, STRIKETHROUGH);
				g[17] = new Font("Calibri", 8);
				g[18] = new Layer(1, 3);
				g[19] = new Layer(2, 3);
				g[20] = new Layer(3, 0);
				g[21] = new Layer(5, 0);
				g[22] = new SolidBrush(RED);
				g[23] = new SolidBrush(RED);
				g[24] = 0;
				g[25] = NO_STALL;
				g[26] = 1;
				g[27] = 0;
				g[28] = 0;
				g[29] = 0;
				g[30] = 0;
				g[31] = 0;
				g[32] = 0;
				g[33] = 0;
				g[34] = 0;
				g[35] = 0;
				g[36] = 0;
				g[37] = newArray(34);
				g[37][NOP] = "NOP";
				g[37][ADD] = "ADD";
				g[37][SUB] = "SUB";
				g[37][AND] = "AND";
				g[37][OR] = "OR";
				g[37][XOR] = "XOR";
				g[37][SLL] = "SLL";
				g[37][SRL] = "SRL";
				g[37][SLT] = "SLT";
				g[37][SGT] = "SGT";
				g[37][SLE] = "SLE";
				g[37][SGE] = "SGE";
				g[37][ADDi] = "ADDi";
				g[37][SUBi] = "SUBi";
				g[37][ANDi] = "ANDi";
				g[37][ORi] = "ORi";
				g[37][XORi] = "XORi";
				g[37][SLLi] = "SLLi";
				g[37][SRLi] = "SRLi";
				g[37][SLTi] = "SLTi";
				g[37][SGTi] = "SGTi";
				g[37][SLEi] = "SLEi";
				g[37][SGEi] = "SGEi";
				g[37][LD] = "LD";
				g[37][ST] = "ST";
				g[37][BEQZ] = "BEQZ";
				g[37][BNEZ] = "BNEZ";
				g[37][J] = "J";
				g[37][JAL] = "JAL";
				g[37][JR] = "JR";
				g[37][JALR] = "JALR";
				g[37][HALT] = "HALT";
				g[37][STALL] = "STALL";
				g[37][EMPTY] = "EMPTY";;;;;;;;;;
				g[38] = new SolidBrush(BORDEAU);
				g[39] = new SolidBrush(WHITE);
				g[40] = new SolidPen(DOT, 1, rgba(0.75, 0.75, 0.75));
				g[41] = new SolidPen(SOLID, 1, RED, ARROW60_END);;;;
				g[42] = new SolidBrush(PURPLE);
				g[43] = new SolidBrush(WHITE);;
				g[44] = new SolidBrush(LIGHT_BLUE);
				g[45] = new Font("Calibri", 9);;;;
				g[46] = new SolidPen(SOLID, 1, RED, ROUND_START | ROUND_JOIN | ROUND_END);
				g[47] = new SolidPen(SOLID, 1, GREEN, ROUND_START | ROUND_JOIN | ROUND_END);
				g[48] = new SolidPen(SOLID, 1, MARINE, ROUND_START | ROUND_JOIN | ROUND_END);;
				g[49] = new SolidBrush(WHITE);
				g[50] = new SolidBrush(LIGHT_BLUE);;
				g[51] = getArg("name", "");
				if (!(g[51] != "")) {
					$pc = 1
					continue
				}
				g[51] = sprintf(":  %s", g[51])
				$pc = 1
			case 1:
				g[52] = new Font("Calibri", 20, SMALLCAPS | ITALIC);
				g[53] = new Rectangle2(g[0], 0, HLEFT, 0, new SolidBrush(DARK_BLUE), 10, 10, 300, 30, g[4], g[52], sprintf(" MIPS Animation %s", g[51]));
				g[54] = new SolidPen(DASH, 1, DARK_BLUE, ROUND_START | ROUND_JOIN | ROUND_END);
				new Line2(g[0], 0, ABSOLUTE, g[54], 120, 80, 700, 80);
				new Line2(g[0], 0, ABSOLUTE, g[54], 120, 440, 700, 440);
				new Line2(g[0], 0, ABSOLUTE, g[54], 120, 80, 120, 440);
				g[55] = new Line2(g[0], 0, ABSOLUTE, g[54], 240, 80, 240, 440);
				g[56] = new Line2(g[0], 0, ABSOLUTE, g[54], 390, 80, 390, 440);
				g[57] = new Line2(g[0], 0, ABSOLUTE, g[54], 540, 80, 540, 440);
				g[58] = new Line2(g[0], 0, ABSOLUTE, g[54], 650, 80, 650, 440);
				new Line2(g[0], 0, ABSOLUTE, g[54], 700, 80, 700, 440);
				g[59] = new SolidPen(DOT, THIN, BLACK);
				new Line2(g[0], 0, ABSOLUTE, g[59], 10, 450, 700, 450);
				g[60] = new Font("Calibri", 10, BOLD);
				g[61] = new Button(20, 460, 80, 20, "Save Configuration", BUTTON_SP);
				g[62] = new Button(120, 460, 80, 20, "Pipelining Enabled", BUTTON_PE);
				g[63] = new Button(210, 460, 80, 20, "Branch Prediction", BUTTON_BP);
				g[64] = new Button(300, 460, 80, 20, "Load Interlock", BUTTON_LI);
				g[65] = new Button(390, 460, 80, 20, "ALU Forwarding", BUTTON_AF);
				g[66] = new Button(480, 460, 80, 20, "Store Operand\nForwarding", BUTTON_SF);
				g[67] = new Button(570, 460, 80, 20, "Zero Forwarding", BUTTON_ZF);
				g[68] = new Image(g[0], 0, 0, "vivio.png", 660, 460, 0, 0, LOGOW, LOGOH);
				new Txt(g[0], 0, HLEFT | VTOP, 10, 46, g[2], g[15], "instructions executed:");
				g[69] = new Txt(g[0], 0, HLEFT | VTOP, 10, 56, g[2], g[15], "ticks:");
				g[70] = new Txt(g[0], 0, HLEFT | VTOP, 90, 46, g[3], g[17], "0");
				g[71] = new Txt(g[0], 0, HLEFT | VTOP, 90, 56, g[3], g[17], "0");
				g[72] = new Rectangle2(g[0], 0, 0, 0, 0, 10, 68, 100, 10, 0, g[15], "Instruction Cache");
				g[73] = new InstructionMemory(10, 80, 100, 320);
				g[74] = new AnimatedClock(20, 410, 80, 30);
				g[75] = new Register(200, 210, 20, 40, TOP, "PC");
				g[76] = new Rectangle2(g[0], 0, 0, 0, 0, 150, 85, 80, 10, 0, g[15], "Branch Target Buffer");
				g[77] = newArray(2);
				g[77][0] = new Register(150, 100, 40, 20, LEFT, "PC");
				g[77][1] = new Register(150, 120, 40, 20, LEFT, "PC");
				g[78] = newArray(2);
				g[78][0] = new Register(190, 100, 40, 20, RIGHT, "PPC");
				g[78][1] = new Register(190, 120, 40, 20, RIGHT, "PPC");
				g[79] = new Component(200, 170, 30, 10, "mux 2");
				g[80] = new Component(170, 205, 10, 50, "mux 1");
				g[81] = new Component(160, 270, 20, 10, "+4");
				g[82] = new AnimPipe();
				g[82].addPoint(110, 390);
				g[82].addPoint(250, 390);
				g[83] = new Rectangle(g[0], g[20], 0, 0, g[11], 180, 390, -30, -6, 60, 12, g[4], g[17]);
				g[83].setRounded(2, 2);
				g[84] = new AnimPipe();
				g[84].addPoint(210, 250);
				g[84].addPoint(210, 320);
				g[84].addPoint(110, 320);
				g[85] = new AnimPipe();
				g[85].addPoint(300, 170);
				g[85].addPoint(300, 160);
				g[85].addPoint(150, 160);
				g[85].addPoint(150, 215);
				g[85].addPoint(170, 215);
				g[86] = new AnimPipe();
				g[86].addPoint(150, 120);
				g[86].addPoint(140, 120);
				g[86].addPoint(140, 225);
				g[86].addPoint(170, 225);
				g[87] = new AnimPipe();
				g[87].addPoint(315, 50);
				g[87].addPoint(130, 50);
				g[87].addPoint(130, 235);
				g[87].addPoint(170, 235);
				g[88] = new AnimPipe();
				g[88].addPoint(160, 275);
				g[88].addPoint(150, 275);
				g[88].addPoint(150, 245);
				g[88].addPoint(170, 245);
				g[89] = new AnimPipe();
				g[89].addPoint(180, 230);
				g[89].addPoint(200, 230);
				g[90] = new AnimPipe();
				g[90].addPoint(210, 210);
				g[90].addPoint(210, 180);
				g[91] = new AnimPipe();
				g[91].addPoint(210, 250);
				g[91].addPoint(210, 275);
				g[91].addPoint(180, 275);
				g[92] = new AnimPipe();
				g[92].addPoint(220, 230);
				g[92].addPoint(240, 230);
				g[92].addPoint(250, 230);
				g[93] = new AnimPipe();
				g[93].addPoint(215, 170);
				g[93].addPoint(215, 140);
				g[94] = new AnimPipe();
				g[94].addPoint(270, 390);
				g[94].addPoint(400, 390);
				g[95] = new InstructionRegister(250, 350, 20, 85, "ID");
				g[96] = new Register(250, 210, 20, 40, TOP, "PC1");
				new Txt(g[0], 0, HLEFT | VTOP, 400, 40, 0, g[15], "Register\nFile");
				g[97] = newArray(4);
				g[97][0] = new Register(315, 30, 40, 20, LEFT, "R0");
				g[97][0].setFixed();
				g[97][1] = new Register(315, 50, 40, 20, LEFT, "R1");
				g[97][2] = new Register(355, 30, 40, 20, RIGHT, "R2");
				g[97][3] = new Register(355, 50, 40, 20, RIGHT, "R3");
				g[98] = new Component(275, 170, 50, 10, "mux 3");
				g[99] = new Component(270, 270, 30, 10, "ADD4");
				g[100] = new Component(300, 270, 30, 10, "ADDi");
				g[101] = new Component(250, 100, 10, 40, "mux 4");
				g[102] = new Component(370, 235, 10, 30, "mux 5");
				new Rectangle2(g[0], 0, 0, 0, 0, 280, 300, 20, 10, 0, g[15], "4");
				g[103] = new SolidPen(SOLID, 0, PURPLE, ARROW60_END);
				g[104] = new SolidPen(SOLID, 2, RED, ARROW60_END);
				g[105] = new SolidPen(SOLID, MEDIUM, BLACK);
				g[106] = new Line2(g[0], g[18], ABSOLUTE, g[103], 550, 230, 550, 150, 365, 150, 365, 160);
				g[107] = new Line2(g[0], g[18], ABSOLUTE, g[103], 570, 210, 570, 145, 360, 145, 360, 160);
				g[108] = new Line2(g[0], g[18], ABSOLUTE, g[103], 670, 210, 670, 140, 355, 140, 355, 160);
				g[109] = new Line(g[0], g[18], ABSOLUTE, g[103], 0, 0, 370, 135, 345, 135, 345, 160);
				g[110] = new Line2(g[0], g[18], ABSOLUTE, g[103], 355, 160, 355, 175, 325, 175);
				g[111] = new Line2(g[0], g[18], ABSOLUTE, g[105], 344, 160, 366, 160);
				g[112] = new Txt(g[0], g[18], HLEFT | VTOP, 346, 162, 0, g[15], "zero");
				g[113] = new AnimPipe();
				g[113].addPoint(260, 210);
				g[113].addPoint(260, 200);
				g[113].addPoint(220, 200);
				g[113].addPoint(220, 180);
				g[114] = new AnimPipe();
				g[114].addPoint(285, 270);
				g[114].addPoint(285, 255);
				g[114].addPoint(370, 255);
				g[115] = new AnimPipe();
				g[115].addPoint(260, 250);
				g[115].addPoint(260, 320);
				g[115].addPoint(280, 320);
				g[115].addPoint(280, 280);
				g[116] = new AnimPipe();
				g[116].addPoint(260, 250);
				g[116].addPoint(260, 320);
				g[116].addPoint(310, 320);
				g[116].addPoint(310, 280);
				g[117] = new AnimPipe();
				g[117].addPoint(290, 300);
				g[117].addPoint(290, 280);
				g[118] = new AnimPipe();
				g[118].addPoint(270, 390);
				g[118].addPoint(320, 390);
				g[118].addPoint(320, 280);
				g[119] = new Rectangle(g[0], g[20], 0, 0, g[11], 320, 376, -12, -6, 24, 12, g[4], g[17]);
				g[119].setRounded(2, 2);
				g[120] = new AnimPipe();
				g[120].addPoint(285, 270);
				g[120].addPoint(285, 180);
				g[121] = new Rectangle(g[0], g[20], 0, 0, g[11], 285, 200, -12, -6, 24, 12, g[4], g[17]);
				g[121].setRounded(2, 2);
				g[122] = new AnimPipe();
				g[122].addPoint(315, 270);
				g[122].addPoint(315, 180);
				g[123] = new Rectangle(g[0], g[20], 0, 0, g[11], 315, 200, -12, -6, 24, 12, g[4], g[17]);
				g[123].setRounded(2, 2);
				g[124] = new AnimPipe();
				g[124].addPoint(300, 170);
				g[124].addPoint(300, 130);
				g[124].addPoint(260, 130);
				g[125] = new Rectangle(g[0], g[20], 0, 0, g[11], 300, 160, -12, -6, 24, 12, g[4], g[17]);
				g[125].setRounded(2, 2);
				g[126] = new AnimPipe();
				g[126].addPoint(250, 120);
				g[126].addPoint(230, 120);
				g[127] = new AnimPipe();
				g[127].addPoint(315, 50);
				g[127].addPoint(300, 50);
				g[127].addPoint(300, 110);
				g[127].addPoint(260, 110);
				g[128] = new AnimPipe();
				g[128].addPoint(380, 250);
				g[128].addPoint(400, 250);
				g[129] = new AnimPipe();
				g[129].addPoint(340, 70);
				g[129].addPoint(340, 245);
				g[129].addPoint(370, 245);
				g[130] = new Rectangle(g[0], g[20], 0, 0, g[11], 340, 82, -12, 0, 24, 12, g[4], g[17], "R0:0");
				g[130].setRounded(2, 2);
				g[131] = new AnimPipe();
				g[131].addPoint(370, 70);
				g[131].addPoint(370, 210);
				g[131].addPoint(400, 210);
				g[132] = new Rectangle(g[0], g[20], 0, 0, g[11], 370, 82, -12, 0, 24, 12, g[4], g[17], "R0:0");
				g[132].setRounded(2, 2);
				g[133] = new InstructionRegister(400, 350, 20, 85, "EX");
				g[134] = new Register(400, 190, 20, 40, TOP, "A");
				g[135] = new Register(400, 230, 20, 40, BOTTOM, "B");
				g[136] = new Component(470, 180, 10, 50, "mux 6");
				g[137] = new Component(470, 230, 10, 50, "mux 7");
				g[138] = new Component(470, 310, 10, 40, "mux 8");
				g[139] = new ALU(490, 190, 40, 80);
				g[140] = new AnimPipe();
				g[140].addPoint(420, 390);
				g[140].addPoint(560, 390);
				g[141] = new AnimPipe();
				g[141].addPoint(570, 210);
				g[141].addPoint(570, 170);
				g[141].addPoint(450, 170);
				g[141].addPoint(450, 190);
				g[141].addPoint(470, 190);
				g[142] = new AnimPipe();
				g[142].addPoint(670, 210);
				g[142].addPoint(670, 160);
				g[142].addPoint(440, 160);
				g[142].addPoint(440, 200);
				g[142].addPoint(470, 200);
				g[143] = new AnimPipe();
				g[143].addPoint(420, 220);
				g[143].addPoint(470, 220);
				g[144] = new AnimPipe();
				g[144].addPoint(420, 240);
				g[144].addPoint(470, 240);
				g[145] = new AnimPipe();
				g[145].addPoint(420, 390);
				g[145].addPoint(430, 390);
				g[145].addPoint(430, 250);
				g[145].addPoint(470, 250);
				g[146] = new Rectangle(g[0], g[20], 0, 0, g[11], 432, 370, -10, 0, 20, 12, g[4], g[17], "IMM");
				g[146].setRounded(2, 2);
				g[147] = new AnimPipe();
				g[147].addPoint(670, 250);
				g[147].addPoint(670, 300);
				g[147].addPoint(440, 300);
				g[147].addPoint(440, 260);
				g[147].addPoint(470, 260);
				g[148] = new AnimPipe();
				g[148].addPoint(570, 250);
				g[148].addPoint(570, 290);
				g[148].addPoint(450, 290);
				g[148].addPoint(450, 270);
				g[148].addPoint(470, 270);
				g[149] = new AnimPipe();
				g[149].addPoint(570, 250);
				g[149].addPoint(570, 290);
				g[149].addPoint(450, 290);
				g[149].addPoint(450, 320);
				g[149].addPoint(470, 320);
				g[150] = new AnimPipe();
				g[150].addPoint(670, 250);
				g[150].addPoint(670, 300);
				g[150].addPoint(440, 300);
				g[150].addPoint(440, 330);
				g[150].addPoint(470, 330);
				g[151] = new AnimPipe();
				g[151].addPoint(410, 270);
				g[151].addPoint(410, 340);
				g[151].addPoint(470, 340);
				g[152] = new AnimPipe();
				g[152].addPoint(480, 330);
				g[152].addPoint(550, 330);
				g[153] = new AnimPipe();
				g[153].addPoint(480, 205);
				g[153].addPoint(490, 205);
				g[153].addPoint(540, 230);
				g[153].addPoint(560, 230);
				g[154] = new AnimPipe();
				g[154].addPoint(480, 255);
				g[154].addPoint(490, 255);
				g[154].addPoint(540, 230);
				g[154].addPoint(560, 230);
				g[155] = new InstructionRegister(560, 350, 20, 85, "MA");
				g[156] = new Register(560, 210, 20, 40, TOP, "O0");
				g[157] = new Register(550, 320, 40, 20, RIGHT, "SMR");
				new Txt(g[0], g[18], HLEFT | VTOP, 553, 100, 0, g[15], "memory\naddress");
				new Txt(g[0], g[18], HLEFT | VTOP, 605, 320, 0, g[15], "memory\ndata-in");
				new Txt(g[0], g[18], HLEFT | VTOP, 615, 100, 0, g[15], "memory\ndata-out");
				new Txt(g[0], 0, HLEFT | VTOP, 645, 35, 0, g[15], "Data\nCache\n(memory)");
				g[158] = newArray(4);
				g[158][0] = new Register(560, 30, 40, 20, LEFT, "M0");
				g[158][1] = new Register(560, 50, 40, 20, LEFT, "M1");
				g[158][2] = new Register(600, 30, 40, 20, RIGHT, "M2");
				g[158][3] = new Register(600, 50, 40, 20, RIGHT, "M3");
				g[159] = new Component(630, 210, 10, 40, "mux 9");
				g[160] = new AnimPipe();
				g[160].addPoint(580, 390);
				g[160].addPoint(660, 390);
				g[161] = new AnimPipe();
				g[161].addPoint(580, 230);
				g[161].addPoint(630, 230);
				g[162] = new AnimPipe();
				g[162].addPoint(640, 230);
				g[162].addPoint(660, 230);
				g[163] = new AnimPipe();
				g[163].addPoint(580, 230);
				g[163].addPoint(590, 230);
				g[163].addPoint(590, 70);
				g[164] = new AnimPipe();
				g[164].addPoint(590, 330);
				g[164].addPoint(600, 330);
				g[164].addPoint(600, 70);
				g[165] = new AnimPipe();
				g[165].addPoint(610, 70);
				g[165].addPoint(610, 220);
				g[165].addPoint(630, 220);
				g[166] = new InstructionRegister(660, 350, 20, 85, "WB");
				g[167] = new Register(660, 210, 20, 40, TOP, "O1");
				g[168] = new AnimPipe();
				g[168].addPoint(680, 230);
				g[168].addPoint(690, 230);
				g[168].addPoint(690, 10);
				g[168].addPoint(355, 10);
				g[168].addPoint(355, 30);
				g[139].txtResult.moveToFront();;;;;;;;;;;;;;;
				resetCircuit();
				g[171] = "";
				g[169] = 0
				$pc = 2
			case 2:
				if (!(g[169] < 32)) {
					$pc = 4
					continue
				}
				g[73].setOpcode(4 * g[169], 0)
				$pc = 3
			case 3:
				g[169]++
				$pc = 2
				continue
			case 4:
				g[169] = 0
				$pc = 5
			case 5:
				if (!(g[169] < 4)) {
					$pc = 7
					continue
				}
				g[171] = sprintf("r%d", g[169])
				g[97][g[169]].setValue(getArgAsNum(g[171], 0))
				$pc = 6
			case 6:
				g[169]++
				$pc = 5
				continue
			case 7:
				g[169] = 0
				$pc = 8
			case 8:
				if (!(g[169] < 4)) {
					$pc = 10
					continue
				}
				g[171] = sprintf("m%d", g[169])
				g[158][g[169]].setValue(getArgAsNum(g[171], 0))
				$pc = 9
			case 9:
				g[169]++
				$pc = 8
				continue
			case 10:
				setTPS(20);
				g[14] = getArgAsNum("example", 0);
				if (!(g[14] == 0)) {
					$pc = 14
					continue
				}
				g[169] = 0
				$pc = 11
			case 11:
				if (!(g[169] < 32)) {
					$pc = 13
					continue
				}
				g[171] = sprintf("i%d", g[169])
				g[73].setOpcode(4 * g[169], getArgAsNum(g[171], 0))
				$pc = 12
			case 12:
				g[169]++
				$pc = 11
				continue
			case 13:
				$pc = 22
				continue
			case 14:
				if (!(g[14] == 1)) {
					$pc = 15
					continue
				}
				g[73].setValue(0, XOR, 1, 1, 1)
				g[73].setValue(4, BEQZ, 0, 2, 36)
				g[73].setValue(8, ST, 2, 0, 0)
				g[73].setValue(12, ANDi, 2, 2, 1)
				g[73].setValue(16, BEQZ, 0, 2, 8)
				g[73].setValue(20, ADD, 1, 1, 3)
				g[73].setValue(24, LD, 2, 0, 0)
				g[73].setValue(28, SLLi, 3, 3, 1)
				g[73].setValue(32, SRLi, 2, 2, 1)
				g[73].setValue(36, J, 0, 0, 4 - 36)
				g[73].setValue(40, ST, 1, 0, 0)
				g[73].setValue(44, HALT, 0, 0, 0)
				g[97][2].setValue(9)
				g[97][3].setValue(8)
				setTPS(100)
				$pc = 21
				continue
			case 15:
				if (!(g[14] == 2)) {
					$pc = 16
					continue
				}
				g[73].setValue(0, ADD, 1, 2, 3)
				g[73].setValue(4, SUB, 3, 1, 2)
				g[73].setValue(8, AND, 2, 1, 3)
				g[73].setValue(12, XOR, 2, 1, 3)
				g[73].setValue(16, ADD, 2, 1, 0)
				g[73].setValue(20, HALT, 0, 0, 0)
				g[97][1].setValue(1)
				g[97][2].setValue(2)
				setTPS(50)
				$pc = 20
				continue
			case 16:
				if (!(g[14] == 3)) {
					$pc = 17
					continue
				}
				g[73].setValue(0, ADDi, 1, 0, 3)
				g[73].setValue(4, ADD, 0, 0, 0)
				g[73].setValue(8, ADD, 0, 0, 0)
				g[73].setValue(12, SUBi, 1, 1, 1)
				g[73].setValue(16, BNEZ, 0, 1, -12 & 255)
				g[73].setValue(20, HALT, 0, 0, 0)
				setTPS(50)
				$pc = 19
				continue
			case 17:
				if (!(g[14] == 4)) {
					$pc = 18
					continue
				}
				g[73].setValue(0, ADD, 3, 1, 2)
				g[73].setValue(4, ST, 3, 1, 1)
				g[73].setValue(8, LD, 1, 0, 2)
				g[73].setValue(12, ADD, 3, 3, 1)
				g[97][1].setValue(1)
				g[97][2].setValue(2)
				$pc = 18
			case 18:
				$pc = 19
			case 19:
				$pc = 20
			case 20:
				$pc = 21
			case 21:
				$pc = 22
			case 22:
				if (!(g[14] > 0)) {
					$pc = 26
					continue
				}
				g[169] = 0
				$pc = 23
			case 23:
				if (!(g[169] < 32)) {
					$pc = 25
					continue
				}
				g[171] = sprintf("i%d", g[169])
				setArg(g[171], g[73].getOpcode(g[169] * 4).toString())
				$pc = 24
			case 24:
				g[169]++
				$pc = 23
				continue
			case 25:
				g[14] = (g[14] == 4) ? 0 : g[14]
				$pc = 26
			case 26:
				g[172] = getArgAsNum("haltOnHalt", 1);
				g[29] = getArgAsNum("bpMode", 0);
				setBPMode(g[29]);
				g[30] = getArgAsNum("liMode", 0);
				setLIMode(g[30]);
				g[31] = getArgAsNum("afMode", 0);
				setAFMode(g[31]);
				g[32] = getArgAsNum("sfMode", 0);
				setSFMode(g[32]);
				g[33] = getArgAsNum("zfMode", 0);
				setZFMode(g[33]);
				g[28] = getArgAsNum("peMode", 0);
				setPEMode(g[28]);
				g[24] = getArgAsNum("locked", 0);
				g[173] = getArgAsNum("help", 1);
				g[174] = new Rectangle2(g[0], g[21], 0, 0, g[12], 0, 0, WIDTH, HEIGHT);
				g[174].setOpacity(0.5);
				g[174].setRounded(10, 10);
				g[175] = new SolidPen(SOLID, 2, RED, ROUND_START | ROUND_JOIN | ROUND_END);
				g[176] = new Font("Arial", 12, BOLD);
				new Txt(g[0], g[21], HLEFT | VTOP, 12, 290, g[175], g[176], "LEFT CLICK on animation background to start and stop clock.\n\nSHIFT LEFT CLICK on background to execute \"single MIPS clock cycle\".");
				if (!(!g[24])) {
					$pc = 27
					continue
				}
				g[174] = new Rectangle2(g[0], g[21], 0, g[175], 0, 20, 68, 80, 10)
				g[174].setRounded(5, 5)
				g[174] = new Rectangle2(g[0], g[21], 0, g[175], 0, 25, 121, 30, 10)
				g[174].setRounded(5, 5)
				g[174] = new Rectangle2(g[0], g[21], 0, g[175], 0, 60, 121, 14, 10)
				g[174].setRounded(5, 5)
				g[174] = new Rectangle2(g[0], g[21], 0, g[175], 0, 76, 121, 14, 10)
				g[174].setRounded(5, 5)
				g[174] = new Rectangle2(g[0], g[21], 0, g[175], 0, 92, 121, 14, 10)
				g[174].setRounded(5, 5)
				new Txt(g[0], g[21], HLEFT | VTOP, 110, 60, g[175], g[176], "LEFT CLICK to change\ninitial program.")
				new Txt(g[0], g[21], HLEFT | VTOP, 110, 105, g[175], g[176], "LEFT or RIGHT CLICK to \"rotate\"\ninstructions and operands.\nHold and release to reset value.")
				$pc = 27
			case 27:
				g[174] = new Rectangle2(g[0], g[21], 0, g[175], 0, 310, 25, 90, 50);
				g[174].setRounded(10, 10);
				new Txt(g[0], g[21], HLEFT | VTOP, 410, 40, g[175], g[176], "LEFT or RIGHT CLICK register\nto increment or decrement value.");
				if (!(!g[24])) {
					$pc = 28
					continue
				}
				g[174] = new Rectangle2(g[0], g[21], 0, g[175], 0, 110, 455, 550, 30)
				g[174].setRounded(10, 10)
				new Txt(g[0], g[21], HLEFT | VTOP, 180, 435, g[175], g[176], "LEFT CLICK on any of the buttons below to change circuit configuration.")
				$pc = 28
			case 28:
				g[177] = new Rectangle2(g[0], g[21], 0, g[175], g[13], 305, 230, 100, 30, g[175], g[176], "CLOSE HELP");
				g[177].setRounded(5, 5);;
				g[177].addEventHandler("eventEE", $obj, closeHelpEventEE);;
				g[177].addEventHandler("eventMB", $obj, closeHelpEventMB);
				if (!(g[173] == 0)) {
					$pc = 29
					continue
				}
				g[21].setOpacity(0)
				$pc = 29
			case 29:
				g[62].label.addEventHandler("eventMB", $obj, buttonPEEventMB);;
				g[63].label.addEventHandler("eventMB", $obj, buttonBPEventMB);;
				g[64].label.addEventHandler("eventMB", $obj, buttonLIEventMB);;
				g[65].label.addEventHandler("eventMB", $obj, buttonAFEventMB);;
				g[66].label.addEventHandler("eventMB", $obj, buttonSFEventMB);;
				g[67].label.addEventHandler("eventMB", $obj, buttonZFEventMB);;
				g[61].label.addEventHandler("eventMB", $obj, buttonSPEventMB);;
				g[68].addEventHandler("eventMB", $obj, logoEventMB);;
				g[53].addEventHandler("eventMB", $obj, titleEventMB);;
				g[72].addEventHandler("eventEE", $obj, imLabelEventEE);;
				g[72].addEventHandler("eventMB", $obj, imLabelEventMB);
				callf(271, $obj)
				continue
			case 30:
				returnf(0)
				continue
			case 31:
				enterf(0);	// update
				$obj.vIns = $obj.nIns
				$obj.vRdt = $obj.nRdt
				$obj.vRs1 = $obj.nRs1
				$obj.vRs2 = $obj.nRs2
				$obj.txt = instrText($obj.vIns, $obj.vRdt, $obj.vRs1, $obj.vRs2)
				$obj.label.setTxt($obj.txt)
				$obj.r2.setBrush(g[13])
				wait(16)
				return
			case 32:
				$obj.r2.setBrush(g[12])
				returnf(0);
				continue
			case 33:
				enterf(0);	// update
				$obj.value = $obj.newValue
				$obj.tag = $obj.newTag
				$obj.updateLabel()
				$obj.bg1.setBrush(g[13])
				$obj.bg2.setBrush(g[13])
				wait(16)
				return
			case 34:
				$obj.bg1.setBrush(g[12])
				$obj.bg2.setBrush(g[12])
				returnf(0);
				continue
			case 35:
				enterf(5);	// animate
				$stack[$fp+1] = 0, $stack[$fp+3] = 0
				$stack[$fp+4] = 0
				$obj.calcLength()
				$obj.fgLine.setPt(0, $obj.px[0], $obj.py[0])
				$obj.fgLine.setPen($obj.fgPen0)
				$stack[$fp+5] = 1
				$pc = 36
			case 36:
				if (!($stack[$fp+5] < $obj.n)) {
					$pc = 39
					continue
				}
				$obj.fgLine.setPt($stack[$fp+5], $obj.px[$stack[$fp+5] - 1], $obj.py[$stack[$fp+5] - 1])
				$stack[$fp+1] += $obj.ls[$stack[$fp+5] - 1]
				$stack[$fp+2] = round($stack[$fp+1] * $stack[$fp-3] / $obj.ll)
				if ($obj.fgLine.setPt($stack[$fp+5], $obj.px[$stack[$fp+5]], $obj.py[$stack[$fp+5]], $stack[$fp+2] - $stack[$fp+3], 1, 1))
				return;
				$pc = 37
			case 37:
				$stack[$fp+3] = $stack[$fp+2]
				$pc = 38
			case 38:
				$stack[$fp+5]++
				$pc = 36
				continue
			case 39:
				if (!($obj.head)) {
					$pc = 40
					continue
				}
				$obj.fgLine.setPen($obj.fgPen1)
				$pc = 40
			case 40:
				returnf(1);
				continue
			case 41:
				enterf(4);	// clockCycle
				$stack[$fp+1] = $stack[$fp-3] / 2
				$stack[$fp+2] = $stack[$fp-3] / 5
				$stack[$fp+3] = $stack[$fp-3] / 10
				$obj.canUpdate = 0
				$obj.prev_clock.translate(-$obj.chw, 0, $stack[$fp+1], 1, 0)
				$obj.next_clock.translate(-$obj.chw, 0, $stack[$fp+1], 1, 0)
				$obj.dot.translate(0, -$obj.ch, $stack[$fp+2], 1, 0)
				wait($stack[$fp+1])
				return
			case 42:
				$obj.prev_clock.translate(-$obj.chw, 0, $stack[$fp+1], 1, 0)
				$obj.next_clock.translate(-$obj.chw, 0, $stack[$fp+1], 1, 0)
				$obj.dot.translate(0, $obj.ch, $stack[$fp+2], 1, 0)
				wait($stack[$fp+3])
				return
			case 43:
				$obj.canUpdate = 1
				$obj.prev_clock.translate(2 * $obj.cw, 0)
				if (!($obj.stall)) {
					$pc = 44
					continue
				}
				$obj.prev_clock.setPen(($obj.type) ? g[47] : g[48])
				$pc = 45
				continue
			case 44:
				$obj.prev_clock.setPen(g[46])
				$pc = 45
			case 45:
				wait($stack[$fp+2] * 2)
				return
			case 46:
				$stack[$fp+4] = $obj.next_clock
				$obj.next_clock = $obj.prev_clock
				$obj.prev_clock = $stack[$fp+4]
				if (!($obj.stall)) {
					$pc = 47
					continue
				}
				$obj.stall--
				$pc = 47
			case 47:
				returnf(1);
				continue
			case 48:
				enterf(0);	// ifExec
				if (!((g[25] == NO_STALL) || (g[25] == CTRL_STALL))) {
					$pc = 49
					continue
				}
				fork(33, g[75])
				g[73].setActive(g[75].newValue)
				$pc = 49
			case 49:
				wait(8)
				return
			case 50:
				if (!((g[29] == BRANCH_PREDICTION) && (btbIndex(g[75].value) != -1))) {
					$pc = 51
					continue
				}
				g[26] = btbIndex(g[75].value)
				g[75].setNewValue(g[78][g[26]].value)
				g[178] = g[86]
				$pc = 52
				continue
			case 51:
				g[75].setNewValue((g[75].value + 4) & 127)
				g[178] = g[88]
				$pc = 52
			case 52:
				g[96].setNewValue(g[75].value)
				g[95].setNewInstruction(g[73].instruction[g[75].value / 4])
				wait(8)
				return
			case 53:
				fork(35, g[92], 64)
				fork(35, g[84], 24)
				fork(35, g[91], 24)
				if (!(g[29] == BRANCH_PREDICTION)) {
					$pc = 56
					continue
				}
				callf(35, g[90], 12)
				continue
			case 54:
				callf(35, g[93], 12)
				continue
			case 55:
				$pc = 58
				continue
			case 56:
				wait(24)
				return
			case 57:
				$pc = 58
			case 58:
				fork(35, g[82], 40)
				if (!((g[29] == BRANCH_PREDICTION) && (btbIndex(g[75].value) != -1))) {
					$pc = 59
					continue
				}
				g[77][btbIndex(g[75].value)].highlight(g[22])
				g[78][btbIndex(g[75].value)].highlight(g[22])
				$pc = 59
			case 59:
				g[83].setTxt(g[95].getNewInstrTxt())
				g[83].setOpacity(1, 16, 1, 0)
				callf(35, g[178], 18)
				continue
			case 60:
				callf(35, g[89], 6)
				continue
			case 61:
				returnf(0);
				continue
			case 62:
				enterf(3);	// calcNewPC
				if (!(instrIsBranch(g[95].vIns))) {
					$pc = 73
					continue
				}
				if (!(g[33] == ZERO_FORWARDING)) {
					$pc = 69
					continue
				}
				if (!((g[133].vRdt == g[95].vRs1) && (instrOpTypeRdt(g[133].vIns) == OP_TYPE_REG))) {
					$pc = 63
					continue
				}
				g[106].setPen(g[104])
				$stack[$fp+2] = g[156].newValue
				$pc = 68
				continue
			case 63:
				if (!(g[156].tagMatches(g[95].vRs1))) {
					$pc = 64
					continue
				}
				g[107].setPen(g[104])
				$stack[$fp+2] = g[156].value
				$pc = 67
				continue
			case 64:
				if (!(g[167].tagMatches(g[95].vRs2))) {
					$pc = 65
					continue
				}
				g[108].setPen(g[104])
				$stack[$fp+2] = g[167].value
				$pc = 66
				continue
			case 65:
				g[109].setPen(g[104])
				$stack[$fp+2] = g[97][g[95].vRs1].value
				g[132].setTxt("R%d:%02X", g[95].vRs1, $stack[$fp+2])
				g[132].setOpacity(1)
				fork(35, g[131], 24)
				$pc = 66
			case 66:
				$pc = 67
			case 67:
				$pc = 68
			case 68:
				$pc = 70
				continue
			case 69:
				g[109].setPen(g[104])
				$stack[$fp+2] = g[97][g[95].vRs1].value
				$pc = 70
			case 70:
				g[110].setPen(g[104])
				if (!((g[95].vIns == BEQZ) == ($stack[$fp+2] == 0))) {
					$pc = 71
					continue
				}
				g[179] = g[122]
				$stack[$fp+1] = (g[96].value + g[95].vRs2) & 127
				$pc = 72
				continue
			case 71:
				g[179] = g[120]
				$stack[$fp+1] = (g[96].value + 4) & 127
				$pc = 72
			case 72:
				$stack[$fp+3] = g[85]
				g[180] = g[124]
				$pc = 77
				continue
			case 73:
				if (!(instrIsJumpI(g[95].vIns))) {
					$pc = 74
					continue
				}
				g[179] = g[122]
				g[180] = g[124]
				$stack[$fp+1] = (g[96].value + g[95].vRs2) & 127
				$stack[$fp+3] = g[85]
				$pc = 76
				continue
			case 74:
				if (!(instrIsJumpR(g[95].vIns))) {
					$pc = 75
					continue
				}
				$stack[$fp+1] = (g[97][g[95].vRs2].value) & 127
				$stack[$fp+3] = g[87]
				g[180] = g[127]
				$pc = 75
			case 75:
				$pc = 76
			case 76:
				$pc = 77
			case 77:
				if (!($stack[$fp+1] != g[75].value)) {
					$pc = 84
					continue
				}
				g[75].setNewValue($stack[$fp+1])
				g[178] = $stack[$fp+3]
				if (!(g[29] == BRANCH_PREDICTION)) {
					$pc = 83
					continue
				}
				if (!($stack[$fp+1] == g[96].value + 4)) {
					$pc = 79
					continue
				}
				if (!(btbIndex(g[96].value) >= 0)) {
					$pc = 78
					continue
				}
				g[77][btbIndex(g[96].value)].setInvalid(1)
				$pc = 78
			case 78:
				$pc = 82
				continue
			case 79:
				if (!(btbIndex(g[96].value) >= 0)) {
					$pc = 80
					continue
				}
				g[26] = btbIndex(g[96].value)
				$pc = 81
				continue
			case 80:
				g[26] = (g[26]) ? 0 : 1
				$pc = 81
			case 81:
				g[77][g[26]].setNewValue(g[96].value)
				g[77][g[26]].setInvalid(0)
				g[77][g[26]].useTag = 0
				g[78][g[26]].setNewValue($stack[$fp+1])
				$pc = 82
			case 82:
				$pc = 83
			case 83:
				$pc = 84
			case 84:
				returnf(0);
				continue
			case 85:
				enterf(0);	// sendBTBOperands
				if (!(g[180] == g[124])) {
					$pc = 86
					continue
				}
				g[125].setTxt("%02X", g[75].newValue)
				g[125].setOpacity(1)
				$pc = 86
			case 86:
				callf(35, g[180], 18)
				continue
			case 87:
				callf(35, g[126], 6)
				continue
			case 88:
				returnf(0);
				continue
			case 89:
				enterf(1);	// idExec
				if (!(g[25] == NO_STALL)) {
					$pc = 90
					continue
				}
				fork(33, g[96])
				fork(31, g[95])
				$pc = 90
			case 90:
				if (!(g[27] && (g[29] == BRANCH_PREDICTION))) {
					$pc = 91
					continue
				}
				fork(33, g[77][g[26]])
				fork(33, g[78][g[26]])
				$pc = 91
			case 91:
				wait(16)
				return
			case 92:
				fork(35, g[94], 64)
				if (!(instrIsBranchOrJump(g[95].vIns))) {
					$pc = 95
					continue
				}
				fork(35, g[115], 32)
				fork(35, g[117], 32)
				fork(35, g[116], 32)
				fork(35, g[118], 32)
				wait(12)
				return
			case 93:
				g[119].setTxt("%02X", g[95].vRs2)
				g[119].setOpacity(1)
				wait(12)
				return
			case 94:
				$pc = 97
				continue
			case 95:
				wait(24)
				return
			case 96:
				$pc = 97
			case 97:
				wait(8)
				return
			case 98:
				if (!(instrIsBranchOrJump(g[95].vIns))) {
					$pc = 100
					continue
				}
				callf(62, $obj)
				continue
			case 99:
				$pc = 100
			case 100:
				detectStall()
				if (!(g[25] == NO_STALL)) {
					$pc = 101
					continue
				}
				g[133].setNewValue(g[95].vIns, g[95].vRdt, g[95].vRs1, g[95].vRs2)
				$pc = 102
				continue
			case 101:
				g[133].setNewValue(STALL, 0, 0, 0)
				$pc = 102
			case 102:
				if (!(instrIsBranch(g[95].vIns) || instrIsJumpI(g[95].vIns))) {
					$pc = 103
					continue
				}
				fork(35, g[120], 8)
				fork(35, g[122], 8)
				g[121].setTxt("%02X", (g[96].value + 4) & 255)
				g[121].setOpacity(1, 8, 1, 0)
				g[123].setTxt("%02X", (g[96].value + g[95].vRs2) & 255)
				g[123].setOpacity(1, 8, 1, 0)
				$pc = 103
			case 103:
				wait(8)
				return
			case 104:
				if (!(g[27])) {
					$pc = 105
					continue
				}
				fork(85, $obj)
				$pc = 105
			case 105:
				if (!(instrOpTypeRdt(g[95].vIns) == OP_TYPE_REG)) {
					$pc = 115
					continue
				}
				if (!(instrIsJumpAndLink(g[95].vIns))) {
					$pc = 108
					continue
				}
				g[134].setNewValue(0)
				g[135].setNewValue((g[96].value + 4) & 127)
				callf(35, g[114], 18)
				continue
			case 106:
				callf(35, g[128], 6)
				continue
			case 107:
				$pc = 114
				continue
			case 108:
				g[97][g[95].vRs1].highlight(g[22])
				g[134].setNewValue(g[97][g[95].vRs1].value)
				if (!(instrOpTypeRs2(g[95].vIns) == OP_TYPE_REG)) {
					$pc = 109
					continue
				}
				g[97][g[95].vRs2].highlight(g[23])
				g[135].setNewValue(g[97][g[95].vRs2].value)
				$pc = 110
				continue
			case 109:
				g[97][g[95].vRdt].highlight(g[23])
				g[135].setNewValue(g[97][g[95].vRdt].value)
				$pc = 110
			case 110:
				g[132].setTxt("R%d:%02X", g[95].vRs1, g[97][g[95].vRs1].value)
				g[132].setOpacity(1)
				fork(35, g[131], 24)
				if (!((!instrIsArRI(g[95].vIns)) && (g[95].vIns != LD))) {
					$pc = 113
					continue
				}
				$stack[$fp+1] = (g[95].vIns == ST) ? g[95].vRdt : g[95].vRs2
				g[130].setTxt("R%d:%02X", $stack[$fp+1], g[97][$stack[$fp+1]].value)
				g[130].setOpacity(1)
				callf(35, g[129], 18)
				continue
			case 111:
				callf(35, g[128], 6)
				continue
			case 112:
				$pc = 113
			case 113:
				$pc = 114
			case 114:
				$pc = 115
			case 115:
				returnf(0);
				continue
			case 116:
				enterf(6);	// exExec
				fork(31, g[133])
				if (!(!instrIsNop(g[133].nIns))) {
					$pc = 117
					continue
				}
				fork(33, g[134])
				fork(33, g[135])
				$pc = 117
			case 117:
				wait(8)
				return
			case 118:
				g[155].setNewValue(g[133].vIns, g[133].vRdt, g[133].vRs1, g[133].vRs2)
				if (!(instrOpTypeRdt(g[133].vIns) == OP_TYPE_REG)) {
					$pc = 140
					continue
				}
				if (!(instrIsJumpAndLink(g[133].vIns))) {
					$pc = 119
					continue
				}
				$stack[$fp+1] = 0
				$stack[$fp+4] = 0
				$pc = 126
				continue
			case 119:
				if (!(g[31] == ALU_FORWARDING)) {
					$pc = 124
					continue
				}
				if (!(g[156].tagMatches(g[133].vRs1))) {
					$pc = 120
					continue
				}
				$stack[$fp+1] = g[141]
				$stack[$fp+4] = g[156].value
				$pc = 123
				continue
			case 120:
				if (!(g[167].tagMatches(g[133].vRs1))) {
					$pc = 121
					continue
				}
				$stack[$fp+1] = g[142]
				$stack[$fp+4] = g[167].value
				$pc = 122
				continue
			case 121:
				$stack[$fp+1] = g[143]
				$stack[$fp+4] = g[134].value
				$pc = 122
			case 122:
				$pc = 123
			case 123:
				$pc = 125
				continue
			case 124:
				$stack[$fp+1] = g[143]
				$stack[$fp+4] = g[134].value
				$pc = 125
			case 125:
				$pc = 126
			case 126:
				if (!(instrIsJumpAndLink(g[133].vIns))) {
					$pc = 127
					continue
				}
				$stack[$fp+2] = g[144]
				$stack[$fp+5] = g[135].value
				$pc = 136
				continue
			case 127:
				if (!(instrOpTypeRs2(g[133].vIns) == OP_TYPE_IMM)) {
					$pc = 128
					continue
				}
				$stack[$fp+2] = g[145]
				$stack[$fp+5] = g[133].vRs2
				$pc = 135
				continue
			case 128:
				if (!(g[31] == ALU_FORWARDING)) {
					$pc = 133
					continue
				}
				if (!(g[156].tagMatches(g[133].vRs2))) {
					$pc = 129
					continue
				}
				$stack[$fp+2] = g[148]
				$stack[$fp+5] = g[156].value
				$pc = 132
				continue
			case 129:
				if (!(g[167].tagMatches(g[133].vRs2))) {
					$pc = 130
					continue
				}
				$stack[$fp+2] = g[147]
				$stack[$fp+5] = g[167].value
				$pc = 131
				continue
			case 130:
				$stack[$fp+2] = g[144]
				$stack[$fp+5] = g[135].value
				$pc = 131
			case 131:
				$pc = 132
			case 132:
				$pc = 134
				continue
			case 133:
				$stack[$fp+2] = g[144]
				$stack[$fp+5] = g[135].value
				$pc = 134
			case 134:
				$pc = 135
			case 135:
				$pc = 136
			case 136:
				$stack[$fp+6] = instrExecute(g[133].vIns, $stack[$fp+4], $stack[$fp+5])
				if (!(g[133].vRdt == 0)) {
					$pc = 137
					continue
				}
				$stack[$fp+6] = 0
				$pc = 137
			case 137:
				g[156].setNewValue($stack[$fp+6])
				if (!(instrIsLoadOrStore(g[133].vIns))) {
					$pc = 138
					continue
				}
				g[156].setNewTag(-1)
				$pc = 139
				continue
			case 138:
				g[156].setNewTag(g[133].vRdt)
				$pc = 139
			case 139:
				g[156].setInvalid(0)
				$pc = 140
			case 140:
				if (!(g[133].vIns == ST)) {
					$pc = 147
					continue
				}
				if (!(g[32] == FORWARDING_TO_SMDR)) {
					$pc = 145
					continue
				}
				if (!(g[156].tagMatches(g[133].vRdt))) {
					$pc = 141
					continue
				}
				$stack[$fp+3] = g[149]
				g[157].setNewValue(g[156].value)
				$pc = 144
				continue
			case 141:
				if (!(g[167].tagMatches(g[133].vRdt))) {
					$pc = 142
					continue
				}
				$stack[$fp+3] = g[150]
				g[157].setNewValue(g[167].value)
				$pc = 143
				continue
			case 142:
				$stack[$fp+3] = g[151]
				g[157].setNewValue(g[135].value)
				$pc = 143
			case 143:
				$pc = 144
			case 144:
				$pc = 146
				continue
			case 145:
				$stack[$fp+3] = g[151]
				g[157].setNewValue(g[135].value)
				$pc = 146
			case 146:
				$pc = 147
			case 147:
				wait(8)
				return
			case 148:
				fork(35, g[140], 64)
				if (!(g[133].vIns == ST)) {
					$pc = 149
					continue
				}
				fork(35, $stack[$fp+3], 24)
				$pc = 149
			case 149:
				if (!(instrOpTypeRdt(g[133].vIns) == OP_TYPE_REG)) {
					$pc = 152
					continue
				}
				if (!($stack[$fp+1] != 0)) {
					$pc = 150
					continue
				}
				fork(35, $stack[$fp+1], 24)
				$pc = 150
			case 150:
				if (!($stack[$fp+2] == g[145])) {
					$pc = 151
					continue
				}
				g[146].setTxt("%02X", $stack[$fp+5])
				g[146].setOpacity(1)
				$pc = 151
			case 151:
				fork(35, $stack[$fp+2], 24)
				$pc = 152
			case 152:
				wait(24)
				return
			case 153:
				if (!(g[133].vIns == ST)) {
					$pc = 154
					continue
				}
				fork(35, g[152], 40)
				$pc = 154
			case 154:
				if (!(instrOpTypeRdt(g[133].vIns) == OP_TYPE_REG)) {
					$pc = 157
					continue
				}
				g[139].setTxtOp(g[133].vIns)
				if (!($stack[$fp+1] != 0)) {
					$pc = 155
					continue
				}
				fork(35, g[153], 40)
				$pc = 155
			case 155:
				fork(35, g[154], 40)
				wait(20)
				return
			case 156:
				g[139].txtResult.setTxt("%02X", $stack[$fp+6])
				g[139].txtResult.setOpacity(1, 20, 1, 0)
				$pc = 157
			case 157:
				returnf(0);
				continue
			case 158:
				enterf(0);	// maExec
				fork(31, g[155])
				if (!(instrOpTypeRdt(g[155].nIns) == OP_TYPE_REG)) {
					$pc = 159
					continue
				}
				fork(33, g[156])
				$pc = 159
			case 159:
				if (!(g[155].nIns == ST)) {
					$pc = 160
					continue
				}
				fork(33, g[157])
				$pc = 160
			case 160:
				wait(8)
				return
			case 161:
				g[166].setNewValue(g[155].vIns, g[155].vRdt, g[155].vRs1, g[155].vRs2)
				if (!((instrOpTypeRdt(g[155].vIns) == OP_TYPE_REG) && (g[155].vIns != ST))) {
					$pc = 164
					continue
				}
				if (!(g[155].vIns == LD)) {
					$pc = 162
					continue
				}
				g[167].setNewValue(g[158][g[156].value % 4].value)
				g[167].setNewTag(g[155].vRdt)
				$pc = 163
				continue
			case 162:
				g[167].setNewValue(g[156].value)
				g[167].setNewTag(g[156].tag)
				$pc = 163
			case 163:
				g[167].setInvalid(0)
				$pc = 164
			case 164:
				wait(8)
				return
			case 165:
				fork(35, g[160], 64)
				if (!(g[155].vIns == ST)) {
					$pc = 168
					continue
				}
				g[158][g[156].value % 4].setNewValue(g[157].value)
				fork(35, g[164], 24)
				callf(35, g[163], 24)
				continue
			case 166:
				callf(33, g[158][g[156].value % 4])
				continue
			case 167:
				$pc = 176
				continue
			case 168:
				if (!(instrOpTypeRdt(g[155].vIns) == OP_TYPE_REG)) {
					$pc = 175
					continue
				}
				if (!(g[155].vIns == LD)) {
					$pc = 171
					continue
				}
				callf(35, g[163], 24)
				continue
			case 169:
				g[158][g[156].value % 4].highlight(g[22])
				callf(35, g[165], 24)
				continue
			case 170:
				$pc = 173
				continue
			case 171:
				callf(35, g[161], 48)
				continue
			case 172:
				$pc = 173
			case 173:
				callf(35, g[162], 16)
				continue
			case 174:
				$pc = 175
			case 175:
				$pc = 176
			case 176:
				returnf(0);
				continue
			case 177:
				enterf(0);	// wbExec
				fork(31, g[166])
				if (!((instrOpTypeRdt(g[166].nIns) == OP_TYPE_REG) && (g[166].nIns != ST))) {
					$pc = 178
					continue
				}
				fork(33, g[167])
				$pc = 178
			case 178:
				wait(8)
				return
			case 179:
				if (!((instrOpTypeRdt(g[166].vIns) == OP_TYPE_REG) && (g[166].vIns != ST))) {
					$pc = 184
					continue
				}
				g[97][g[167].tag].setNewValue(g[167].value)
				wait(8)
				return
			case 180:
				callf(35, g[168], 24)
				continue
			case 181:
				callf(33, g[97][g[167].tag])
				continue
			case 182:
				wait(19)
				return
			case 183:
				$pc = 186
				continue
			case 184:
				wait(67)
				return
			case 185:
				$pc = 186
			case 186:
				if (!(g[166].vIns != STALL && g[166].vIns != EMPTY)) {
					$pc = 187
					continue
				}
				g[35]++
				g[70].setTxt("%4d", g[35])
				$pc = 187
			case 187:
				g[36]++
				g[71].setTxt("%4d", g[36])
				returnf(0);
				continue
			case 188:
				enterf(0);	// nonPipelinedBranch
				fork(35, g[115], 24)
				fork(35, g[117], 24)
				if (!(instrIsBranchOrJump(g[95].vIns))) {
					$pc = 189
					continue
				}
				fork(35, g[116], 24)
				fork(35, g[118], 24)
				$pc = 189
			case 189:
				wait(24)
				return
			case 190:
				if (!(instrIsJumpR(g[95].vIns))) {
					$pc = 191
					continue
				}
				g[75].setNewValue((g[97][g[95].vRs2].value) & 127)
				fork(35, g[87], 34)
				$pc = 205
				continue
			case 191:
				if (!(instrIsBranch(g[95].vIns))) {
					$pc = 197
					continue
				}
				if (!((g[97][g[95].vRs1].value == 0) == (g[95].vIns == BEQZ))) {
					$pc = 193
					continue
				}
				callf(35, g[122], 20)
				continue
			case 192:
				g[75].setNewValue((g[75].value + g[95].vRs2) & 127)
				$pc = 195
				continue
			case 193:
				callf(35, g[120], 20)
				continue
			case 194:
				g[75].setNewValue((g[75].value + 4) & 127)
				$pc = 195
			case 195:
				callf(35, g[85], 14)
				continue
			case 196:
				$pc = 204
				continue
			case 197:
				if (!(instrIsJumpI(g[95].vIns))) {
					$pc = 200
					continue
				}
				g[75].setNewValue((g[75].value + g[95].vRs2) & 127)
				callf(35, g[122], 20)
				continue
			case 198:
				callf(35, g[85], 14)
				continue
			case 199:
				$pc = 203
				continue
			case 200:
				g[75].setNewValue((g[75].value + 4) & 127)
				callf(35, g[120], 20)
				continue
			case 201:
				callf(35, g[85], 14)
				continue
			case 202:
				$pc = 203
			case 203:
				$pc = 204
			case 204:
				$pc = 205
			case 205:
				callf(35, g[89], 6)
				continue
			case 206:
				returnf(0);
				continue
			case 207:
				enterf(5);	// execNonPipelined
				callf(33, g[75])
				continue
			case 208:
				g[73].setActive(g[75].newValue)
				fork(35, g[92], 64)
				callf(35, g[84], 24)
				continue
			case 209:
				fork(35, g[82], 40)
				wait(20)
				return
			case 210:
				g[95].setNewInstruction(g[73].instruction[g[75].value / 4])
				g[83].setTxt(g[95].getNewInstrTxt())
				g[83].translate(60 / 2 + 70, 0, 20, 1, 0)
				callf(31, g[95])
				continue
			case 211:
				if (!((instrOpTypeRs2(g[95].vIns) == OP_TYPE_IMM) && (instrOpTypeRdt(g[95].vIns) == OP_TYPE_REG))) {
					$pc = 212
					continue
				}
				fork(35, g[94], 64)
				$pc = 212
			case 212:
				fork(188, $obj)
				wait(24)
				return
			case 213:
				if (!(instrIsJumpAndLink(g[95].vIns))) {
					$pc = 216
					continue
				}
				callf(35, g[114], 20)
				continue
			case 214:
				callf(35, g[128], 20)
				continue
			case 215:
				$stack[$fp+1] = 0
				$stack[$fp+2] = (g[75].value + 4) & 127
				$pc = 228
				continue
			case 216:
				if (!(instrOpTypeRdt(g[95].vIns) == OP_TYPE_REG)) {
					$pc = 225
					continue
				}
				$stack[$fp+1] = g[97][g[95].vRs1].value
				g[97][g[95].vRs1].highlight(g[22])
				g[132].setTxt("R%d:%02X", g[95].vRs1, g[97][g[95].vRs1].value)
				g[132].setOpacity(1)
				fork(35, g[131], 40)
				if (!((instrOpTypeRs2(g[95].vIns) == OP_TYPE_REG) || (g[95].vIns == ST))) {
					$pc = 222
					continue
				}
				if (!(instrOpTypeRs2(g[95].vIns) == OP_TYPE_IMM)) {
					$pc = 217
					continue
				}
				$stack[$fp+2] = g[97][g[95].vRdt].value
				g[97][g[95].vRdt].highlight(g[23])
				$pc = 218
				continue
			case 217:
				$stack[$fp+2] = g[97][g[95].vRs2].value
				g[97][g[95].vRs2].highlight(g[23])
				$pc = 218
			case 218:
				if (!((!instrIsArRI(g[95].vIns)) && (g[95].vIns != LD))) {
					$pc = 221
					continue
				}
				$stack[$fp+5] = (g[95].vIns == ST) ? g[95].vRdt : g[95].vRs2
				g[130].setTxt("R%d:%02X", $stack[$fp+5], g[97][$stack[$fp+5]].value)
				g[130].setOpacity(1)
				callf(35, g[129], 20)
				continue
			case 219:
				callf(35, g[128], 20)
				continue
			case 220:
				$pc = 221
			case 221:
				$pc = 224
				continue
			case 222:
				wait(40)
				return
			case 223:
				$pc = 224
			case 224:
				$pc = 227
				continue
			case 225:
				wait(40)
				return
			case 226:
				$pc = 227
			case 227:
				$pc = 228
			case 228:
				if (!(instrOpTypeRdt(g[95].vIns) == OP_TYPE_REG)) {
					$pc = 229
					continue
				}
				g[139].setTxtOp(g[95].vIns)
				$pc = 229
			case 229:
				if (!(g[95].vIns == ST)) {
					$pc = 232
					continue
				}
				fork(35, g[151], 40)
				fork(35, g[143], 40)
				g[146].setTxt("%02X", g[95].vRs2)
				g[146].setOpacity(1)
				callf(35, g[145], 40)
				continue
			case 230:
				fork(35, g[152], 40)
				fork(35, g[154], 40)
				callf(35, g[153], 40)
				continue
			case 231:
				$stack[$fp+4] = $stack[$fp+2]
				$stack[$fp+3] = instrExecute(g[95].vIns, $stack[$fp+1], g[95].vRs2)
				$pc = 245
				continue
			case 232:
				if (!(instrIsJumpAndLink(g[95].vIns))) {
					$pc = 235
					continue
				}
				callf(35, g[144], 40)
				continue
			case 233:
				callf(35, g[154], 40)
				continue
			case 234:
				$stack[$fp+3] = instrExecute(g[95].vIns, $stack[$fp+1], $stack[$fp+2])
				$pc = 244
				continue
			case 235:
				if (!(instrOpTypeRdt(g[95].vIns) == OP_TYPE_REG)) {
					$pc = 241
					continue
				}
				fork(35, g[143], 40)
				if (!(instrOpTypeRs2(g[95].vIns) == OP_TYPE_IMM)) {
					$pc = 237
					continue
				}
				g[146].setTxt("%02X", g[95].vRs2)
				g[146].setOpacity(1)
				callf(35, g[145], 40)
				continue
			case 236:
				$stack[$fp+3] = instrExecute(g[95].vIns, $stack[$fp+1], g[95].vRs2)
				$pc = 239
				continue
			case 237:
				callf(35, g[144], 40)
				continue
			case 238:
				$stack[$fp+3] = instrExecute(g[95].vIns, $stack[$fp+1], $stack[$fp+2])
				$pc = 239
			case 239:
				fork(35, g[154], 40)
				callf(35, g[153], 40)
				continue
			case 240:
				$pc = 243
				continue
			case 241:
				wait(80)
				return
			case 242:
				$pc = 243
			case 243:
				$pc = 244
			case 244:
				$pc = 245
			case 245:
				if (!(g[95].vIns == LD)) {
					$pc = 249
					continue
				}
				callf(35, g[163], 20)
				continue
			case 246:
				g[158][($stack[$fp+3]) % 4].highlight(g[22])
				callf(35, g[165], 20)
				continue
			case 247:
				callf(35, g[162], 40)
				continue
			case 248:
				$stack[$fp+3] = g[158][($stack[$fp+3]) % 4].value
				$pc = 259
				continue
			case 249:
				if (!(g[95].vIns == ST)) {
					$pc = 252
					continue
				}
				fork(35, g[164], 20)
				callf(35, g[163], 20)
				continue
			case 250:
				g[158][($stack[$fp+3]) % 4].setNewValue($stack[$fp+4])
				callf(33, g[158][($stack[$fp+3]) % 4])
				continue
			case 251:
				$pc = 258
				continue
			case 252:
				if (!(instrOpTypeRdt(g[95].vIns) == OP_TYPE_REG)) {
					$pc = 255
					continue
				}
				callf(35, g[161], 40)
				continue
			case 253:
				callf(35, g[162], 40)
				continue
			case 254:
				$pc = 257
				continue
			case 255:
				wait(80)
				return
			case 256:
				$pc = 257
			case 257:
				$pc = 258
			case 258:
				$pc = 259
			case 259:
				g[97][0].unHighlight()
				g[97][1].unHighlight()
				g[97][2].unHighlight()
				g[97][3].unHighlight()
				if (!((instrOpTypeRdt(g[95].vIns) == OP_TYPE_REG) && (g[95].vIns != ST))) {
					$pc = 263
					continue
				}
				callf(35, g[168], 40)
				continue
			case 260:
				g[97][g[95].vRdt].setNewValue($stack[$fp+3])
				callf(33, g[97][g[95].vRdt])
				continue
			case 261:
				wait(19)
				return
			case 262:
				$pc = 265
				continue
			case 263:
				wait(75)
				return
			case 264:
				$pc = 265
			case 265:
				g[36] += 5
				g[35]++
				g[70].setTxt("%4d", g[35])
				g[71].setTxt("%4d", g[36])
				returnf(0);
				continue
			case 266:
				enterf(0);	// exec
				g[97][0].unHighlight()
				g[97][1].unHighlight()
				g[97][2].unHighlight()
				g[97][3].unHighlight()
				g[158][0].unHighlight()
				g[158][1].unHighlight()
				g[158][2].unHighlight()
				g[158][3].unHighlight()
				g[77][0].unHighlight()
				g[77][1].unHighlight()
				g[78][0].unHighlight()
				g[78][1].unHighlight()
				if (!(g[28] == PIPELINING_ENABLED)) {
					$pc = 267
					continue
				}
				fork(48, $obj)
				fork(89, $obj)
				fork(116, $obj)
				fork(158, $obj)
				fork(177, $obj)
				$pc = 268
				continue
			case 267:
				fork(207, $obj)
				$pc = 268
			case 268:
				wait(8)
				return
			case 269:
				resetWires()
				wait((g[28] == PIPELINING_ENABLED) ? 72 : 392)
				return
			case 270:
				checkPoint()
				returnf(0);
				continue
			case 271:
				enterf(0);	// run
				wait(1)
				return
			case 272:
				g[34] = 1
				setlocked()
				$pc = 273
			case 273:
				if (!(1)) {
					$pc = 278
					continue
				}
				fork(41, g[74], (g[28] == PIPELINING_ENABLED) ? 80 : 400)
				callf(266, $obj)
				continue
			case 274:
				if (!(((g[166].vIns == HALT) && (g[28] == PIPELINING_ENABLED)) || ((g[95].vIns == HALT) && (g[28] == PIPELINING_DISABLED)))) {
					$pc = 276
					continue
				}
				stop()
				if (!(g[172])) {
					$pc = 275
					continue
				}
				$pc = 278
				continue
				$pc = 275
			case 275:
				$pc = 276
			case 276:
				wait(1)
				return
			case 277:
				$pc = 273
				continue
			case 278:
				returnf(0);
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
