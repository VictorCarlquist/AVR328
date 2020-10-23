CAVR328 = function (AVR328)
{
	this.Commands 	= new Array();
	this.R = new Array(32);
	this.C = 0;
	this.Z = 0;
	this.N = 0;
	this.V = 0;
	this.S = 0;
	this.H = 0;
	this.T = 0;
	this.I = 0;
	this.PC = 0;
	this.SP = 16;
}
var AVR328 = new CAVR328;
var LINE = 0;
var CALL; //Armazena a linha onde o call foi chamado para o RET retornar na linha correta
//*********************************************
//***Comando ALAN_TURING ******************************
//*********************************************
var classeteste = function()
{
	//Carrega um valor imediato
	this.asm = "ALAN_TURING";
	// 			 1110 kkkk dddd kkkk
	this.opcode="==== ALAN *100 anos"; //tudo em caixa baixa!
}
classeteste.prototype.Command = function(s,tipo) //s = Rd,kk
{

	var s = "ALAN TURING PARABENS 100 ANOS  ";
	for(var i=0;i<s.length;i++)
	    AVR328.R[i] = s[i];

    //gira();
    window.location = "../public/alan_turing.html";
	//o this.opcode é o "1110 kkkk dddd kkkk", depois é passado o numedo de 'd', e valor de k, e quantos bits são o k, que neste caso é 8bits
	InsereMemoria(this.opcode);
	LINE++; AVR328.PC++;

	return 0;
}
AVR328.Commands.push(new classeteste());
//*********************************************
//***FIM ALAN_TURING******************************
//*********************************************


//*********************************************
//***Comando LDI ******************************
//*********************************************
var classeteste = function()
{
	//Carrega um valor imediato
	this.asm = "LDI";
	// 			 1110 kkkk dddd kkkk
	this.opcode="1110 kkkk dddd kkkk"; //tudo em caixa baixa!
}
classeteste.prototype.Command = function(s,tipo) //s = Rd,kk
{
	if (ValidateInput(s,1)) // Valida os parametros do comando
	{
		var d = GetDReg(s);
		var k = GetK(s);
		
		if(d<16 || k > 255 || k < 0)
			return 1;
		AVR328.R[d] = k;

		//o this.opcode é o "1110 kkkk dddd kkkk", depois é passado o numedo de 'd', e valor de k, e quantos bits são o k, que neste caso é 8bits
		InsereMemoria(CreateOpcode(this.opcode,d-16,k,8));

		LINE++; AVR328.PC++;
		

		return 0;
	}else
	{
		return 1;
	}	
}
AVR328.Commands.push(new classeteste());
//*********************************************
//***FIM LDI ******************************
//*********************************************

//*********************************************
//***Comando MOV ******************************
//*********************************************
var classeteste = function()
{
	//Carrega um valor imediato
	this.asm = "MOV";
	// 			 1110 kkkk dddd kkkk
	this.opcode="0010 11rd dddd rrrr"; //tudo em caixa baixa!
}
classeteste.prototype.Command = function(s,tipo) //s = Rd,kk
{
	if (ValidateInput(s,0)) // Valida os parametros do comando
	{
		var d = GetDReg(s);
		var dr = GetDReg2(s);
		if(!(0<=d && d<=31 && 0<=dr && dr<=31)) 
		    return 1;
		AVR328.R[d] = AVR328.R[dr];

		//o this.opcode é o "1110 kkkk dddd kkkk", depois é passado o numedo de 'd', e valor de k, e quantos bits são o k, que neste caso é 8bits
		InsereMemoria(CreateOpcode(this.opcode,d,0,0,dr,5,5));

		LINE++; AVR328.PC++;
		

		return 0;
	}else
	{
		return 1;
	}	
}
AVR328.Commands.push(new classeteste());
//*********************************************
//***FIM MOV ******************************
//*********************************************

//*********************************************
//***Comando CPI ******************************
//*********************************************
var classeteste = function()
{
	//Carrega um valor imediato
	this.asm = "CPI";
	this.opcode="0011 kkkk dddd kkkk"; //tudo em caixa baixa!
}
classeteste.prototype.Command = function(s,tipo) //s = Rd,kk
{
	if (ValidateInput(s,1)) // Valida os parametros do comando
	{
		var d = GetDReg(s);
		var k = GetK(s);
		//var nk =  complement2(DecToBin(k));
		//complement2(DecToBin(k)); // é usado para gerar overflow da flag V
		var db = DecToBin(AVR328.R[d],8);
		//var sdk = ADD(db,nk);
		var sdk = SUB(db,DecToBin(k));
		if(!(16 <= d && d <= 31 && 0 <= k && k <= 255))
		    return 1;
		AfetaFlag(sdk);
		//o this.opcode é o "1110 kkkk dddd kkkk", depois é passado o numedo de 'd', e valor de k, e quantos bits são o k, que neste caso é 8bits
		InsereMemoria(CreateOpcode(this.opcode,d-16,k,8));

		LINE++; AVR328.PC++;

		return 0;
	}else
	{
		return 1;
	}	
}
AVR328.Commands.push(new classeteste());
//*********************************************
//***FIM CPI ******************************
//*********************************************

//*********************************************
//***Comando CP ******************************
//*********************************************
var classeteste = function()
{
	//Carrega um valor imediato
	this.asm = "CP";
	this.opcode="0001 01rd dddd rrrr"; //tudo em caixa baixa!
}
classeteste.prototype.Command = function(s,tipo) //s = Rd,kk
{
	if (ValidateInput(s,0)) // Valida os parametros do comando
	{
		var d = GetDReg(s);
		var r = GetDReg2(s);
		//complement2(DecToBin(AVR328.R[r])); // é usado para gerar overflow da flag V
		var db = DecToBin(AVR328.R[d],8);
		//var sdk = ADD(db,nr);
		var sdk = SUB(db,DecToBin(AVR328.R[r],8));
		AfetaFlag(sdk);
		//o this.opcode é o "1110 kkkk dddd kkkk", depois é passado o numedo de 'd', e valor de k, e quantos bits são o k, que neste caso é 8bits
		InsereMemoria(CreateOpcode(this.opcode,d,0,0,r,5,5));

		LINE++; AVR328.PC++;

		return 0;
	}else
	{
		return 1;
	}	
}
AVR328.Commands.push(new classeteste());
//*********************************************
//***FIM CP ******************************
//*********************************************


//*********************************************
//***Comando BRGE ******************************
//*********************************************
var classeteste = function()
{
	//if Rd >= Rr signed
	this.asm = "BRGE";
	this.opcode="1111 01kk kkkk k100"; //tudo em caixa baixa!
}
classeteste.prototype.Command = function(s,tipo) //LABEL:
{

	var k = AchaLabel(s);
	
	if((AVR328.PC-63) <= k && (AVR328.PC+64) >= k && k!=-1)
	{
		//o this.opcode é o "1110 kkkk dddd kkkk", depois é passado o numedo de 'd', e valor de k, e quantos bits são o k, que neste caso é 8bits
		InsereMemoria(CreateOpcode(this.opcode,0,k,8));
		if(AVR328.S == 0) {
			LINE = parseInt(k);
			AVR328.PC = k;
		}
		else {
			LINE++; AVR328.PC++;
		}
		return 0;
	}
	return 1;
}
AVR328.Commands.push(new classeteste());
//*********************************************
//***FIM BRGE ******************************
//*********************************************


//*********************************************
//***Comando BREQ ******************************
//*********************************************
var classeteste = function()
{
	//if Rd = Rr signed Z = 1
	this.asm = "BREQ";
	this.opcode="1111 00kk kkkk k100"; //tudo em caixa baixa!
}
classeteste.prototype.Command = function(s,tipo) //s = Rd,kk
{

	var k = AchaLabel(s);
	
	if((AVR328.PC-63) <= k && (AVR328.PC+64) >= k && k!=-1)
	{
		//o this.opcode é o "1110 kkkk dddd kkkk", depois é passado o numedo de 'd', e valor de k, e quantos bits são o k, que neste caso é 8bits
		InsereMemoria(CreateOpcode(this.opcode,0,k,8));
		if(AVR328.Z == 1)
			LINE = parseInt(k);
		else
			LINE++; AVR328.PC++;
		return 0;
	}
	return 1;
}
AVR328.Commands.push(new classeteste());
//*********************************************
//***FIM BREG ******************************
//*********************************************

//*********************************************
//***Comando BRLT ******************************
//*********************************************
var classeteste = function()
{
	//if Rd < Rr signed S = 1
	this.asm = "BRLT";
	this.opcode="1111 00kk kkkk k100"; //tudo em caixa baixa!
}
classeteste.prototype.Command = function(s,tipo) //s = Rd,kk
{

	var k = AchaLabel(s);
	
	if((AVR328.PC-63) <= k && (AVR328.PC+64) >= k && k!=-1)
	{
		//o this.opcode é o "1110 kkkk dddd kkkk", depois é passado o numedo de 'd', e valor de k, e quantos bits são o k, que neste caso é 8bits
		InsereMemoria(CreateOpcode(this.opcode,0,k,8));
		if(AVR328.S == 1)
			LINE = parseInt(k);
		else
			LINE++; AVR328.PC++;
		return 0;
	}
	return 1;
}
AVR328.Commands.push(new classeteste());
//*********************************************
//***FIM BRLT ******************************
//*********************************************

//*********************************************
//***Comando BRSH ******************************
//*********************************************
var classeteste = function()
{
	//if Rd >= Rr unsigned C = 0
	this.asm = "BRSH";
	this.opcode="1111 01kk kkkk k000"; //tudo em caixa baixa!
}
classeteste.prototype.Command = function(s,tipo) //s = Rd,kk
{

	var k = AchaLabel(s);
	
	if((AVR328.PC-63) <= k && (AVR328.PC+64) >= k && k!=-1)
	{
		//o this.opcode é o "1110 kkkk dddd kkkk", depois é passado o numedo de 'd', e valor de k, e quantos bits são o k, que neste caso é 8bits
		InsereMemoria(CreateOpcode(this.opcode,0,k,8));
		if(AVR328.C == 0)
			LINE = parseInt(k);
		else
			LINE++; AVR328.PC++;
		return 0;
	}
	return 1;
}
AVR328.Commands.push(new classeteste());
//*********************************************
//***FIM BRSH ******************************
//*********************************************

//*********************************************
//***Comando BRCC ******************************
//*********************************************
var classeteste = function()
{
	//if C = 0
	this.asm = "BRCC";
	this.opcode="1111 01kk kkkk k000"; //tudo em caixa baixa!
}
classeteste.prototype.Command = function(s,tipo) //s = Rd,kk
{

	var k = AchaLabel(s);
	
	if((AVR328.PC-63) <= k && (AVR328.PC+64) >= k && k!=-1)
	{
		//o this.opcode é o "1110 kkkk dddd kkkk", depois é passado o numedo de 'd', e valor de k, e quantos bits são o k, que neste caso é 8bits
		InsereMemoria(CreateOpcode(this.opcode,0,k,8));
		if(AVR328.C == 0)
			LINE = parseInt(k);
		else
			LINE++; AVR328.PC++;
		return 0;
	}
	return 1;
}
AVR328.Commands.push(new classeteste());
//*********************************************
//***FIM BRCC ******************************
//*********************************************

//*********************************************
//***Comando BRLO ******************************
//*********************************************
var classeteste = function()
{
	//if Rd < Rr unsigned  C = 1
	this.asm = "BRLO";
	this.opcode="1111 00kk kkkk k000"; //tudo em caixa baixa!
}
classeteste.prototype.Command = function(s,tipo) //s = Rd,kk
{

	var k = AchaLabel(s);
	
	if((AVR328.PC-63) <= k && (AVR328.PC+64) >= k && k!=-1)
	{
		//o this.opcode é o "1110 kkkk dddd kkkk", depois é passado o numedo de 'd', e valor de k, e quantos bits são o k, que neste caso é 8bits
		InsereMemoria(CreateOpcode(this.opcode,0,k,8));
		if(AVR328.C == 1)
			LINE = parseInt(k);
		else
			LINE++; AVR328.PC++;
		return 0;
	}
	return 1;
}
AVR328.Commands.push(new classeteste());
//*********************************************
//***FIM BRLO ******************************
//*********************************************

//*********************************************
//***Comando BRCS ******************************
//*********************************************
var classeteste = function()
{
	//if  C = 1
	this.asm = "BRCS";
	this.opcode="1111 00kk kkkk k000"; //tudo em caixa baixa!
}
classeteste.prototype.Command = function(s,tipo) //s = Rd,kk
{

	var k = AchaLabel(s);
	
	if((AVR328.PC-63) <= k && (AVR328.PC+64) >= k && k!=-1)
	{
		//o this.opcode é o "1110 kkkk dddd kkkk", depois é passado o numedo de 'd', e valor de k, e quantos bits são o k, que neste caso é 8bits
		InsereMemoria(CreateOpcode(this.opcode,0,k,8));
		if(AVR328.C == 1)
			LINE = parseInt(k);
		else
			LINE++; AVR328.PC++;
		return 0;
	}
	return 1;
}
AVR328.Commands.push(new classeteste());
//*********************************************
//***FIM BRCS ******************************
//*********************************************

//*********************************************
//***Comando BRMI ******************************
//*********************************************
var classeteste = function()
{
	//if  N = 1
	this.asm = "BRMI";
	this.opcode="1111 00kk kkkk k010"; //tudo em caixa baixa!
}
classeteste.prototype.Command = function(s,tipo) //s = Rd,kk
{

	var k = AchaLabel(s);
	
	if((AVR328.PC-63) <= k && (AVR328.PC+64) >= k && k!=-1)
	{
		//o this.opcode é o "1110 kkkk dddd kkkk", depois é passado o numedo de 'd', e valor de k, e quantos bits são o k, que neste caso é 8bits
		InsereMemoria(CreateOpcode(this.opcode,0,k,8));
		if(AVR328.N == 1)
			LINE = parseInt(k);
		else
			LINE++; AVR328.PC++;
		return 0;
	}
	return 1;
}
AVR328.Commands.push(new classeteste());
//*********************************************
//***FIM BRMI ******************************
//*********************************************

//*********************************************
//***Comando BRVS ******************************
//*********************************************
var classeteste = function()
{
	//if  V = 1
	this.asm = "BRVS";
	this.opcode="1111 00kk kkkk k011"; //tudo em caixa baixa!
}
classeteste.prototype.Command = function(s,tipo) //s = Rd,kk
{

	var k = AchaLabel(s);
	
	if((AVR328.PC-63) <= k && (AVR328.PC+64) >= k && k!=-1)
	{
		//o this.opcode é o "1110 kkkk dddd kkkk", depois é passado o numedo de 'd', e valor de k, e quantos bits são o k, que neste caso é 8bits
		InsereMemoria(CreateOpcode(this.opcode,0,k,8));
		if(AVR328.V == 1)
			LINE = parseInt(k);
		else
			LINE++; AVR328.PC++;
		return 0;
	}
	return 1;
}
AVR328.Commands.push(new classeteste());
//*********************************************
//***FIM BRVS ******************************
//*********************************************

//*********************************************
//***Comando BRNE ******************************
//*********************************************
var classeteste = function()
{
	//if  Z = 0
	this.asm = "BRNE";
	this.opcode="1111 01kk kkkk k001"; //tudo em caixa baixa!
}
classeteste.prototype.Command = function(s,tipo) //s = Rd,kk
{

	var k = AchaLabel(s);
	
	if((AVR328.PC-63) <= k && (AVR328.PC+64) >= k && k!=-1)
	{
		//o this.opcode é o "1110 kkkk dddd kkkk", depois é passado o numedo de 'd', e valor de k, e quantos bits são o k, que neste caso é 8bits
		InsereMemoria(CreateOpcode(this.opcode,0,k,8));
		if(AVR328.Z == 0)
			LINE = parseInt(k);
		else
			LINE++; AVR328.PC++;
		return 0;
	}
	return 1;
}
AVR328.Commands.push(new classeteste());
//*********************************************
//***FIM BRNE ******************************
//*********************************************

//*********************************************
//***Comando BRPL ******************************
//*********************************************
var classeteste = function()
{
	//if  N = 0
	this.asm = "BRPL";
	this.opcode="1111 01kk kkkk k010"; //tudo em caixa baixa!
}
classeteste.prototype.Command = function(s,tipo) //s = Rd,kk
{

	var k = AchaLabel(s);
	
	if((AVR328.PC-63) <= k && (AVR328.PC+64) >= k && k!=-1)
	{
		//o this.opcode é o "1110 kkkk dddd kkkk", depois é passado o numedo de 'd', e valor de k, e quantos bits são o k, que neste caso é 8bits
		InsereMemoria(CreateOpcode(this.opcode,0,k,8));
		if(AVR328.N == 0)
			LINE = parseInt(k);
		else
			LINE++; AVR328.PC++;
		return 0;
	}
	return 1;
}
AVR328.Commands.push(new classeteste());
//*********************************************
//***FIM BRPL ******************************
//*********************************************

//*********************************************
//***Comando BRVC ******************************
//*********************************************
var classeteste = function()
{
	//if  V = 0
	this.asm = "BRVC";
	this.opcode="1111 01kk kkkk k011"; //tudo em caixa baixa!
}
classeteste.prototype.Command = function(s,tipo) //s = Rd,kk
{

	var k = AchaLabel(s);
	
	if((AVR328.PC-63) <= k && (AVR328.PC+64) >= k && k!=-1)
	{
		//o this.opcode é o "1110 kkkk dddd kkkk", depois é passado o numedo de 'd', e valor de k, e quantos bits são o k, que neste caso é 8bits
		InsereMemoria(CreateOpcode(this.opcode,0,k,8));
		if(AVR328.V == 0)
			LINE = parseInt(k);
		else
			LINE++; AVR328.PC++;
		return 0;
	}
	return 1;
}
AVR328.Commands.push(new classeteste());
//*********************************************
//***FIM BRVC ******************************
//*********************************************

//*********************************************
//***Comando JMP ******************************
//*********************************************
var classeteste = function()
{
	this.asm = "JMP";
	this.opcode="1001 010k kkkk 110k kkkk kkkk kkkk kkkk"; //tudo em caixa baixa!
}
classeteste.prototype.Command = function(s,tipo) //s = Rd,kk
{

	var k = AchaLabel(s);
	
	//o this.opcode é o "1110 kkkk dddd kkkk", depois é passado o numedo de 'd', e valor de k, e quantos bits são o k, que neste caso é 8bits
	InsereMemoria(CreateOpcode(this.opcode,0,k,22));

	LINE = parseInt(k);

	return 0;

}
AVR328.Commands.push(new classeteste());
//*********************************************
//***FIM JPM ******************************
//*********************************************

//*********************************************
//***Comando ADD ******************************
//*********************************************
var classeteste = function()
{
	this.asm = "ADD";
	this.opcode="0000 11rd dddd rrrr"; //tudo em caixa baixa!
}
classeteste.prototype.Command = function(s,tipo) //s = Rd,Rd
{
	if (ValidateInput(s,0)) // Valida os parametros do comando
	{
		var d = GetDReg(s);
		var d2 = GetDReg2(s);
		
		AVR328.R[d] = BinToDec(ADD(DecToBin(AVR328.R[d]),DecToBin(AVR328.R[d2])));
		AfetaFlag(DecToBin(AVR328.R[d]));
		//o this.opcode é o "1110 kkkk dddd kkkk", depois é passado o numedo de 'd', e valor de k, e quantos bits são o k, que neste caso é 8bits
		InsereMemoria(CreateOpcode(this.opcode,d,0,0,d2,5,5));

		LINE++; AVR328.PC++;

		return 0;
	}else
	{
		return 1;
	}	
}
AVR328.Commands.push(new classeteste());
//*********************************************
//***FIM ADD ******************************
//*********************************************


//*********************************************
//***Comando ADC ******************************
//*********************************************
var classeteste = function()
{
	this.asm = "ADC";
	this.opcode="0001 11rd dddd rrrr"; //tudo em caixa baixa!
}
classeteste.prototype.Command = function(s,tipo) //s = Rd,Rr
{
	if (ValidateInput(s,0)) // Valida os parametros do comando
	{
		var d = GetDReg(s);
		var d2 = GetDReg2(s);
		
		AVR328.R[d] = BinToDec(ADD(DecToBin(AVR328.R[d]),DecToBin(AVR328.R[d2]),true));
		AfetaFlag(DecToBin(AVR328.R[d]));
		//o this.opcode é o "1110 kkkk dddd kkkk", depois é passado o numedo de 'd', e valor de k, e quantos bits são o k, que neste caso é 8bits
		InsereMemoria(CreateOpcode(this.opcode,d,0,0,d2,5,5));

		LINE++; AVR328.PC++;

		return 0;
	}else
	{
		return 1;
	}	
}
AVR328.Commands.push(new classeteste());
//*********************************************
//***FIM ADWI ******************************
//*********************************************
var classeteste = function()
{
	this.asm = "ADIW";
	this.opcode="1001 0110 kkdd kkkk"; //tudo em caixa baixa!
}
classeteste.prototype.Command = function(s,tipo) //s = Rd,Rr
{
	if (ADIW(s)) // Valida os parametros do comando
	{
		var p 	= RegExp(/(([x-z]|[X-Z]))+,+((\d)|(\d\d))/);
		
		//Verifica
		if (p.test(s))
		{
			//Substitui os ponteiros de XYZ pelo
			//nome de cada registrador.
			if(s.substring(0,1) == "X")
				s = s.replace("X","R27:R26");
			else if (s.substring(0,1) == "Y")
				s = s.replace("Y","R29:R28");
			else if(s.substring(0,1) == "Z")
				s = s.replace("Z","R31:R30");
		}
		else
			
		if(s.substring(0,5) == "XH:XL")
			s = s.replace("XH:XL","R27:R26");
		else if(s.substring(0,5) == "YH:YL")
			s = s.replace("YH:YL","R29:R28");
		else if (s.substring(0,5) == "ZH:ZL")
			s = s.replace("ZH:ZL","R31:R30");
			
		var d  = parseInt(s.substring(5,7));
		
		if(d == "24")
			d = 0;
		if(d == "26")
			d = 1;
		if(d == "28")
			d = 2;
		if(d == "30")
			d = 3;
		var k = s.substring(8);
		LINE++; AVR328.PC++;
		
		
		InsereMemoria(CreateOpcode(this.opcode,d,k,6,0,2));
		return 0;
	}else
		return 1;
}
AVR328.Commands.push(new classeteste());
//*********************************************
//***FIM ADWI ******************************
//*********************************************


//*********************************************
//***Comando .ORG ******************************
//*********************************************
var classeteste = function()
{
	this.asm = ".ORG";
	//this.opcode="1001 11rd dddd rrrr"; //tudo em caixa baixa!
}
classeteste.prototype.Command = function(s,tipo) //s = Rd,Rd
{
    if(ValidateInput(s,6))
	{
	    END = parseInt(s);
	    LINE++; AVR328.PC++;
	    return 0;
    }else
        return 1;
}
AVR328.Commands.push(new classeteste());
//*********************************************
//***FIM .ORG ******************************
//*********************************************

//*********************************************
//***Comando ASR ******************************
//*********************************************
var classeteste = function()
{
	//Carrega um valor imediato
	this.asm = "ASR";

	this.opcode="1001 010d dddd 0101"; //tudo em caixa baixa!
}
classeteste.prototype.Command = function(s,tipo) //s = Rd,kk
{
	if (ValidateInput(s,2)) // Valida os parametros do comando
	{
		var d = GetDReg(s);
		ASR(d);
		//o this.opcode é o "1110 kkkk dddd kkkk", depois é passado o numedo de 'd', e valor de k, e quantos bits são o k, que neste caso é 8bits
		InsereMemoria(CreateOpcode(this.opcode,d,0,0,0,5));

		LINE++; AVR328.PC++;
		

		return 0;
	}else
	{
		return 1;
	}	
}
AVR328.Commands.push(new classeteste());
//*********************************************
//***FIM ASR ******************************
//*********************************************

//*********************************************
//***Comando NEG******************************
//*********************************************
var classeteste = function()
{
	//Complemento de 2
	this.asm = "NEG";

	this.opcode="1001 010d dddd 0001"; //tudo em caixa baixa!
}
classeteste.prototype.Command = function(s,tipo) //s = Rd
{
	if (ValidateInput(s,2)) // Valida os parametros do comando
	{
		var d = GetDReg(s);
		if(tipo == 1)
			AVR328.R[d] = BinToDec(complement2(DecToBin(AVR328.R[d])));
		InsereMemoria(CreateOpcode(this.opcode,d,0,0,0,5));
		AfetaFlag(DecToBin(AVR328.R[d]));
		LINE++; AVR328.PC++;
		

		return 0;
	}else
	{
		return 1;
	}	
}
AVR328.Commands.push(new classeteste());

//*********************************************
//***Comando STS ******************************
//*********************************************
var classeteste = function()
{
	//Complemento de 2
	this.asm = "STS";

	this.opcode="1001 001d dddd 0000 kkkk kkkk kkkk kkkk"; //tudo em caixa baixa!
}
classeteste.prototype.Command = function(s,tipo) //s = Rd
{
	if (ValidateInput(s,3)) // Valida os parametros do comando
	{
		var ss = s.split(",");
		var k = ss[0];
		var d = GetDReg(ss[1]);
		if(tipo == 1)
			MEMORIA_DADOS[k] = DecToBin(AVR328.R[d],8,true);
		InsereMemoria(CreateOpcode(this.opcode,d,k,16,0,5));
		LINE++; AVR328.PC++;
		return 0;
	}else
	{
		return 1;
	}	
}
AVR328.Commands.push(new classeteste());
//*********************************************
//***FIM STS ******************************
//*********************************************

//*********************************************
//***FIM  LDS******************************
//*********************************************
var classeteste = function()
{
	//Complemento de 2
	this.asm = "LDS";

	this.opcode="1001 000d dddd 0000 kkkk kkkk kkkk kkkk"; //tudo em caixa baixa!
}
classeteste.prototype.Command = function(s,tipo) //s = Rd
{
	if (ValidateInput(s,1)) // Valida os parametros do comando
	{
		var d = GetDReg(s);
		var k = GetK(s);
		if(tipo == 1)
			AVR328.R[d]=BinToDec(TrimAll(MEMORIA_DADOS[k]));
		InsereMemoria(CreateOpcode(this.opcode,d,k,16,0,5));
		LINE++; AVR328.PC++;
		return 0;
	}else
	{
		return 1;
	}	
}
AVR328.Commands.push(new classeteste());
//*********************************************
//***FIM LDS ******************************
//*********************************************

//*********************************************
//***Comando  ST******************************
//*********************************************
var classeteste = function()
{
	//Complemento de 2
	this.asm = "ST";

	this.opcode="1001 001r rrrr 1100"; //tudo em caixa baixa!
}
classeteste.prototype.Command = function(s,tipo) //s = Rd
{
	if (ValidateInput(s,4)) // Valida os parametros do comando
	{
	
		var p 	= RegExp(/(([x-z]|[X-Z]))+,+((R+(\d))|(R+(\d\d)))/);
		var p1	= RegExp(/((([x-z)|[X-Z])+(([h]|[H])))+:+(([x-z)|[X-Z])+(([l]|[L])))+,((\d)|(\d\d)))/);

		//Verifica
		if (p.test(s))
		{
			//Substitui os ponteiros de XYZ pelo
			//nome de cada registrador.
			if(s.substring(0,1) == "X")
				s = s.replace("X","R27:R26");
			else if (s.substring(0,1) == "Y")
				s = s.replace("Y","R29:R28");
			else if(s.substring(0,1) == "Z")
				s = s.replace("Z","R31:R30");
		}
		else if (p1.test(s))
		{
			if(s.substring(0,5) == "XH:XL")
				s = s.replace("XH:XL","R27:R26");
			else if(s.substring(0,5) == "YH:YL")
				s = s.replace("YH:YL","R29:R28");
			else if (s.substring(0,5) == "ZH:ZL")
				s = s.replace("ZH:ZL","R31:R30");
		}
		
		var d0  = parseInt(s.substring(5,7));
		var d1 = parseInt(s.substring(1,3));
		var r = s.substring(9);
		
		var bin = DecToBin(AVR328.R[d1]) + DecToBin(AVR328.R[d0]);
		var dec = BinToDec(bin);
		if(tipo == 1)
			MEMORIA_DADOS[dec] = DecToBin(AVR328.R[r],8,true);
		InsereMemoria(CreateOpcode(this.opcode,0,0,0,r,0,5));
		LINE++; AVR328.PC++;
		return 0;
	}else
	{
		return 1;
	}	
}
AVR328.Commands.push(new classeteste());
//*********************************************
//***FIM ST ******************************
//*********************************************

//*********************************************
//***Comando  LD******************************
//*********************************************
var classeteste = function()
{
	//Complemento de 2
	this.asm = "LD";

	this.opcode="1001 000d dddd 1100"; //tudo em caixa baixa!
}
classeteste.prototype.Command = function(s,tipo) //s = Rd
{
	if (ValidateInput(s,5)) // Valida os parametros do comando
	{
	
		var p 	= RegExp(/((R+(\d))|(R+(\d\d)))+,+(([x-z]|[X-Z]))/);
		var p1	= RegExp(/((R+(\d))|(R+(\d\d)))+,+(([x-z]|[X-Z])+(([h]|[H])))+:+(([x-z]|[X-Z])+(([l]|[L])))/);
		var p2	= RegExp(/((R+(\d))|(R+(\d\d)))+,+((([r]|[R])+(\d\d))+:+(([r]|[R])+(\d\d)))/);

		//Verifica
		ss = s.split(",");
		if (p.test(ss))
		{
			//Substitui os ponteiros de XYZ pelo
			//nome de cada registrador.
			
			if(ss[1] == "X")
				ss = ss[1].replace("X","R27:R26");
			else if (ss[1] == "Y")
				ss = ss[1].replace("Y","R29:R28");
			else if(ss[1] == "Z")
				ss = ss[1].replace("Z","R31:R30");
		}
		else if (p1.test(ss))
		{
			if(ss[1] == "XH:XL")
				ss = ss[1].replace("XH:XL","R27:R26");
			else if(s[1] == "YH:YL")
				ss = ss[1].replace("YH:YL","R29:R28");
			else if (s[1] == "ZH:ZL")
				ss = ss[1].replace("ZH:ZL","R31:R30");
		}
		
		var r0  = parseInt(ss.substring(5,7));
		var r1 = parseInt(ss.substring(1,3));
		var d = GetDReg(s);
		
		var bin = DecToBin(AVR328.R[r1]) + DecToBin(AVR328.R[r0]);
		var dec = BinToDec(bin);
		if(tipo == 1)
			AVR328.R[d] = BinToDec(TrimAll(MEMORIA_DADOS[dec]));
		InsereMemoria(CreateOpcode(this.opcode,d,0,0,0,5));
		LINE++; AVR328.PC++;
		return 0;
	}else
	{
		return 1;
	}	
}
AVR328.Commands.push(new classeteste());
//*********************************************
//***FIM LD ******************************
//*********************************************

//*********************************************
//***Comando INC ******************************
//*********************************************
var classeteste = function()
{
	//Incrementa um registrador
	this.asm = "INC";
	// 			 1110 kkkk dddd kkkk
	this.opcode="1001 010d dddd 0011"; //tudo em caixa baixa!
}
classeteste.prototype.Command = function(s,tipo) //s = Rd
{
	if (ValidateInput(s,2)) // Valida os parametros do comando
	{
		var d = GetDReg(s);
		
		AVR328.R[d]++;

		sdk = DecToBin(AVR328.R[d], 8);
		AfetaFlag(sdk);

		//o this.opcode é o "1110 kkkk dddd kkkk", depois é passado o numedo de 'd', e valor de k, e quantos bits são o k, que neste caso é 8bits
		InsereMemoria(CreateOpcode(this.opcode,d,0,0,0,5));

		LINE++; AVR328.PC++;

		return 0;
	}else
	{
		return 1;
	}	
}
AVR328.Commands.push(new classeteste());
//*********************************************
//***FIM INC ******************************
//*********************************************

//*********************************************
//***Comando DEC ******************************
//*********************************************
var classeteste = function()
{
	//Decrementa um registrador
	this.asm = "DEC";
	// 			 1110 kkkk dddd kkkk
	this.opcode="1001 010d dddd 1010"; //tudo em caixa baixa!
}
classeteste.prototype.Command = function(s,tipo) //s = Rd
{
	if (ValidateInput(s,2)) // Valida os parametros do comando
	{
		var d = GetDReg(s);
		
		AVR328.R[d]--;
		sdk = DecToBin(AVR328.R[d], 8);
		AfetaFlag(sdk);

		//o this.opcode é o "1110 kkkk dddd kkkk", depois é passado o numedo de 'd', e valor de k, e quantos bits são o k, que neste caso é 8bits
		InsereMemoria(CreateOpcode(this.opcode,d,0,0,0,5));

		LINE++; AVR328.PC++;

		return 0;
	}else
	{
		return 1;
	}	
}
AVR328.Commands.push(new classeteste());
//*********************************************
//***FIM DEC ******************************
//*********************************************

//*********************************************
//***Comando NOP ******************************
//*********************************************
var classeteste = function()
{
	//Sem operacao
	this.asm = "NOP";
	// 			 1110 kkkk dddd kkkk
	this.opcode="0000 0000 0000 0000"; //tudo em caixa baixa!
}
classeteste.prototype.Command = function(s,tipo) //s = Rd
{
	if (s == "") // Valida os parametros do comando
	{
		InsereMemoria(this.opcode);

		LINE++; AVR328.PC++;

		return 0;
	}else
	{
		return 1;
	}	
}
AVR328.Commands.push(new classeteste());
//*********************************************
//***FIM NOP ******************************
//*********************************************

//*********************************************
//***Comando SUB ******************************
//*********************************************
var classeteste = function()
{
	this.asm = "SUB";
	this.opcode="0001 10rd dddd rrrr"; //tudo em caixa baixa!
}
classeteste.prototype.Command = function(s,tipo) //s = Rd,Rd
{
	if (ValidateInput(s,_R_R)) // Valida os parametros do comando
	{
		var d = GetDReg(s);
		var d2 = GetDReg2(s);
		
		AVR328.R[d] = BinToDec(SUB(DecToBin(AVR328.R[d]),DecToBin(AVR328.R[d2])));
		AfetaFlag(DecToBin(AVR328.R[d]));
		InsereMemoria(CreateOpcode(this.opcode,d,0,0,d2,6,6));

		LINE++; AVR328.PC++;

		return 0;
	}else
	{
		return 1;
	}	
}
AVR328.Commands.push(new classeteste());
//*********************************************
//*******FIM SUB ******************************
//*********************************************


//*********************************************
//***Comando SUBI ******************************
//*********************************************
var classeteste = function()
{
	this.asm = "SUBI";
	this.opcode="0101 kkkk dddd kkkk"; //tudo em caixa baixa!
}
classeteste.prototype.Command = function(s,tipo) //s = Rd,Rd
{
	if (ValidateInput(s,_R_K)) // Valida os parametros do comando
	{
		var d = GetDReg(s);
		var k = GetK(s);
		
		if(d < 16 || d > 31 || k < 0 || k > 255)
			return 1;
		
		AVR328.R[d] = BinToDec(SUB(DecToBin(AVR328.R[d]),DecToBin(k)));
		AfetaFlag(DecToBin(AVR328.R[d]));
		InsereMemoria(CreateOpcode(this.opcode,d-16,k,8,0,4));

		LINE++; AVR328.PC++;

		return 0;
	}else
	{
		return 1;
	}	
}
AVR328.Commands.push(new classeteste());
//*********************************************
//*******FIM SUBI *****************************
//*********************************************

//*********************************************
//***Comando OR ******************************
//*********************************************
var classeteste = function()
{
	this.asm = "OR";
	this.opcode="0010 10rd dddd rrrr"; //tudo em caixa baixa!
}
classeteste.prototype.Command = function(s,tipo) //s = Rd,Rd
{
	if (ValidateInput(s,_R_R)) // Valida os parametros do comando
	{
		var d = GetDReg(s);
		var d2 = GetDReg2(s);
		if(d < 0 || d > 31 || d2 < 0 || d2 > 31)
			return 1;
			
		AVR328.R[d] = BinToDec(OR(DecToBin(AVR328.R[d]),DecToBin(AVR328.R[d2])));	
		AVR328.V = 0;
		AfetaFlag(DecToBin(AVR328.R[d]));
		InsereMemoria(CreateOpcode(this.opcode,d,0,0,d2,5,5));

		LINE++; AVR328.PC++;

		return 0;
	}else
	{
		return 1;
	}	
}
AVR328.Commands.push(new classeteste());
//*********************************************
//*******FIM OR *****************************
//*********************************************

//*********************************************
//***Comando EOR ******************************
//*********************************************
var classeteste = function()
{
	this.asm = "EOR";
	this.opcode="0010 01rd dddd rrrr"; //tudo em caixa baixa!
}
classeteste.prototype.Command = function(s,tipo) //s = Rd,Rd
{
	if (ValidateInput(s,_R_R)) // Valida os parametros do comando
	{
		var d = GetDReg(s);
		var d2 = GetDReg2(s);
		if(d < 0 || d > 31 || d2 < 0 || d2 > 31)
			return 1;
			
		AVR328.R[d] = BinToDec(XOR(DecToBin(AVR328.R[d]),DecToBin(AVR328.R[d2])));	
		AVR328.V = 0;
		AfetaFlag(DecToBin(AVR328.R[d]));
		InsereMemoria(CreateOpcode(this.opcode,d,0,0,d2,5,5));

		LINE++; AVR328.PC++;

		return 0;
	}else
	{
		return 1;
	}	
}
AVR328.Commands.push(new classeteste());
//*********************************************
//*******FIM OR *****************************
//*********************************************

//*********************************************
//***Comando ORI ******************************
//*********************************************
var classeteste = function()
{
	this.asm = "ORI";
	this.opcode="0110 kkkk dddd kkkk"; //tudo em caixa baixa!
}
classeteste.prototype.Command = function(s,tipo) //s = Rd,Rd
{
	if (ValidateInput(s,_R_K)) // Valida os parametros do comando
	{
		var d = GetDReg(s);
		var k = GetK(s);
		if(d < 16 || d > 31 || k < 0 || k > 255)
			return 1;
			
		AVR328.R[d] = BinToDec(OR(DecToBin(AVR328.R[d]),DecToBin(k)));	
		AVR328.V = 0;
		AfetaFlag(DecToBin(AVR328.R[d]));
		InsereMemoria(CreateOpcode(this.opcode,d-16,k,8,0,4));

		LINE++; AVR328.PC++;

		return 0;
	}else
	{
		return 1;
	}	
}
AVR328.Commands.push(new classeteste());
//*********************************************
//*******FIM ORI *****************************
//*********************************************

//*********************************************
//***Comando AND ******************************
//*********************************************
var classeteste = function()
{
	this.asm = "AND";
	this.opcode="0010 00rd dddd rrrr"; //tudo em caixa baixa!
}
classeteste.prototype.Command = function(s,tipo) //s = Rd,Rd
{
	if (ValidateInput(s,_R_R)) // Valida os parametros do comando
	{
		var d = GetDReg(s);
		var d2 = GetDReg2(s);
		if(d < 0 || d > 31 || d2 < 0 || d2 > 31)
			return 1;
			
		AVR328.R[d] = BinToDec(AND(DecToBin(AVR328.R[d]),DecToBin(AVR328.R[d2])));	
		AVR328.V = 0;
		AfetaFlag(DecToBin(AVR328.R[d]));
		InsereMemoria(CreateOpcode(this.opcode,d,0,0,d2,5,5));

		LINE++; AVR328.PC++;

		return 0;
	}else
	{
		return 1;
	}	
}
AVR328.Commands.push(new classeteste());
//*********************************************
//*******FIM AND *****************************
//*********************************************

//*********************************************
//***Comando ANDI ******************************
//*********************************************
var classeteste = function()
{
	this.asm = "ANDI";
	this.opcode="0111 kkkk dddd kkkk"; //tudo em caixa baixa!
}
classeteste.prototype.Command = function(s,tipo) //s = Rd,Rd
{
	if (ValidateInput(s,_R_K)) // Valida os parametros do comando
	{
		var d = GetDReg(s);
		var k = GetK(s);
		if(d < 16 || d > 31 || k < 0 || k > 255)
			return 1;
			
		AVR328.R[d] = BinToDec(AND(DecToBin(AVR328.R[d]),DecToBin(k)));	
		AVR328.V = 0;
		AfetaFlag(DecToBin(AVR328.R[d]));
		InsereMemoria(CreateOpcode(this.opcode,d-16,k,8,0,4));

		LINE++; AVR328.PC++;

		return 0;
	}else
	{
		return 1;
	}	
}
AVR328.Commands.push(new classeteste());
//*********************************************
//*******FIM ANDI *****************************
//*********************************************

//*********************************************
//***Comando MUL ******************************
//*********************************************
var classeteste = function()
{
	this.asm = "MUL";
	this.opcode="1001 11rd dddd rrrr"; //tudo em caixa baixa!
}
classeteste.prototype.Command = function(s,tipo) //s = Rd,Rd
{
	if (ValidateInput(s,_R_R)) // Valida os parametros do comando
	{
		var d = GetDReg(s);
		var d2 = GetDReg2(s);
		
		if(d < 0 || d > 31 || d2 < 0 || d2 > 31)
			return 1;
		
		var s=DecToBin('0',16);
		var m = DecToBin(AVR328.R[d2]);
		for(var i=0;i<AVR328.R[d];i++)
			s = ADD(m,s,false,16);
		
		AVR328.R[0] = BinToDec(s.substr(8,8));
		AVR328.R[1] = BinToDec(s.substr(0,8));
		var dk = BinToDec(s);
		if(dk == 0) AVR328.Z = 1; else AVR328.Z = 0;
		//o this.opcode é o "1110 kkkk dddd kkkk", depois é passado o numedo de 'd', e valor de k, e quantos bits são o k, que neste caso é 8bits
		InsereMemoria(CreateOpcode(this.opcode,d,0,0,d2,5,5));

		LINE++; AVR328.PC++;

		return 0;
	}else
	{
		return 1;
	}	
}
AVR328.Commands.push(new classeteste());
//*********************************************
//***FIM MUL ******************************
//*********************************************

//*********************************************
//***Comando MULS ******************************
//*********************************************
var classeteste = function()
{
	this.asm = "MULS";
	this.opcode="0000 0010 dddd rrrr"; //tudo em caixa baixa!
}
classeteste.prototype.Command = function(s,tipo) //s = Rd,Rd
{
	if (ValidateInput(s,_R_R)) // Valida os parametros do comando
	{
		var d = GetDReg(s);
		var d2 = GetDReg2(s);
		
		if(d < 16 || d > 31 || d2 < 16 || d2 > 31)
			return 1;
		
		var s=DecToBin('0',16); //inicializa com 16 bits 0
		var m = DecToBin(AVR328.R[d2]);
		if(m[0] == '1')
			m = complement2(m);
	
		var times = DecToBin(AVR328.R[d]);
		if(times[0] == '1')
			times = complement2(times);
	
		times = BinToDec(times);
		for(var i=0;i<times;i++)
			s = ADD(m,s,false,16);
		
		
		
		if(DecToBin(AVR328.R[d2]).substr(0,1) == '0' && DecToBin(AVR328.R[d]).substr(0,1) == '0')
			s[0] = '0';
		else if((DecToBin(AVR328.R[d2]).substr(0,1) == '1' && DecToBin(AVR328.R[d]).substr(0,1) == '0') || ((DecToBin(AVR328.R[d2]).substr(0,1) == '0' && DecToBin(AVR328.R[d]).substr(0,1) == '1')))
				s = complement2(s,16);
			else if(DecToBin(AVR328.R[d2]).substr(0,1) == '1' && DecToBin(AVR328.R[d]).substr(0,1) == '1')
					s[0] = '0';

		AVR328.R[0] = BinToDec(s.substr(8,8));
		AVR328.R[1] = BinToDec(s.substr(0,8));

		var dk = BinToDec(s);
		if(dk == 0) AVR328.Z = 1; else AVR328.Z = 0;
		//o this.opcode é o "1110 kkkk dddd kkkk", depois é passado o numedo de 'd', e valor de k, e quantos bits são o k, que neste caso é 8bits
		InsereMemoria(CreateOpcode(this.opcode,d,0,0,d2,4,4));

		LINE++; AVR328.PC++;

		return 0;
	}else
	{
		return 1;
	}	
}
AVR328.Commands.push(new classeteste());
//*********************************************
//***FIM MULS ******************************
//*********************************************

//*********************************************
//***Comando COM ******************************
//*********************************************
var classeteste = function()
{
	this.asm = "COM";
	this.opcode="1001 010d dddd 0000"; //tudo em caixa baixa!
}
classeteste.prototype.Command = function(s,tipo) //s = Rd
{
	if (ValidateInput(s,_R)) // Valida os parametros do comando
	{
		var d = GetDReg(s);
		
		if(d < 0 || d > 31)
			return 1;
		
		s = SUB("11111111",DecToBin(AVR328.R[d]));
		AVR328.R[d] = BinToDec(s);
		
		AfetaFlag(s);
		//o this.opcode é o "1110 kkkk dddd kkkk", depois é passado o numedo de 'd', e valor de k, e quantos bits são o k, que neste caso é 8bits
		AVR328.V = 0;
		InsereMemoria(CreateOpcode(this.opcode,d,0,8,0,5,0));

		LINE++; AVR328.PC++;

		return 0;
	}else
	{
		return 1;
	}	
}
AVR328.Commands.push(new classeteste());
//*********************************************
//***FIM COM ******************************
//*********************************************

//*********************************************
//***Comando LSL ******************************
//*********************************************
var classeteste = function()
{
	this.asm = "LSL";
	this.opcode="0000 11rd dddd rrrr"; //tudo em caixa baixa!
}
classeteste.prototype.Command = function(s,tipo) //s = Rd
{
	if (ValidateInput(s,_R)) // Valida os parametros do comando
	{
		var d = GetDReg(s);
		
		if(d < 0 || d > 31)
			return 1;
		
		var n = DecToBin(AVR328.R[d]);
		AVR328.R[d] = BinToDec(DecToBin(AVR328.R[d] << 1).substr(1));
		
		AfetaFlag(DecToBin(AVR328.R[d]));
		AVR328.C = n[0]; 
		
		InsereMemoria(CreateOpcode(this.opcode,d,0,0,d,5,5));
		
		LINE++; AVR328.PC++;

		return 0;
	}else
	{
		return 1;
	}	
}
AVR328.Commands.push(new classeteste());
//*********************************************
//***FIM LSL ******************************
//*********************************************

//*********************************************
//***Comando LSR ******************************
//*********************************************
var classeteste = function()
{
	this.asm = "LSR";
	this.opcode="1001 010d dddd 0110"; //tudo em caixa baixa!
}
classeteste.prototype.Command = function(s,tipo) //s = Rd
{
	if (ValidateInput(s,_R)) // Valida os parametros do comando
	{
		var d = GetDReg(s);
		
		if(d < 0 || d > 31)
			return 1;
		
		var n = DecToBin(AVR328.R[d]);
		
		AVR328.R[d] = AVR328.R[d] >>> 1;
		
		
		AfetaFlag(DecToBin(AVR328.R[d]));

		AVR328.C = n[n.length-1];
		AVR328.N = 0;
		InsereMemoria(CreateOpcode(this.opcode,d,0,8,0,5,0));
		
		LINE++; AVR328.PC++;

		return 0;
	}else
	{
		return 1;
	}	
}
AVR328.Commands.push(new classeteste());
//*********************************************
//***FIM LSR ******************************
//*********************************************

//*********************************************
//***Comando ROR ******************************
//*********************************************
var classeteste = function()
{
	this.asm = "ROR";
	this.opcode="1001 010d dddd 0111"; //tudo em caixa baixa!
}
classeteste.prototype.Command = function(s,tipo) //s = Rd
{
	if (ValidateInput(s,_R)) // Valida os parametros do comando
	{
		var d = GetDReg(s);
		
		if(d < 0 || d > 31)
			return 1;
		
		var n = DecToBin(AVR328.R[d]);
		
		AVR328.R[d] = (AVR328.R[d] >>> 1);
		AVR328.R[d] = BinToDec(AVR328.C+DecToBin(AVR328.R[d],7));
		
		AfetaFlag(DecToBin(AVR328.R[d]));

		AVR328.C = n[n.length-1];

		InsereMemoria(CreateOpcode(this.opcode,d,0,8,0,5,0));
		
		LINE++; AVR328.PC++;

		return 0;
	}else
	{
		return 1;
	}	
}
AVR328.Commands.push(new classeteste());
//*********************************************
//***FIM ROR ******************************
//*********************************************

//*********************************************
//***Comando ROL ******************************
//*********************************************
var classeteste = function()
{
	this.asm = "ROL";
	this.opcode="0001 11rd dddd rrrr"; //tudo em caixa baixa!
}
classeteste.prototype.Command = function(s,tipo) //s = Rd
{
	if (ValidateInput(s,_R)) // Valida os parametros do comando
	{
		var d = GetDReg(s);
		
		if(d < 0 || d > 31)
			return 1;
		
		var n = DecToBin(AVR328.R[d]);
		var x;
		AVR328.R[d] = (AVR328.R[d] << 1);
		x = DecToBin(AVR328.R[d]);
		x[x.length-1] = AVR328.C;
		AVR328.R[d] = BinToDec(x);
		
		AfetaFlag(DecToBin(AVR328.R[d]));

		AVR328.C = n[0];

		InsereMemoria(CreateOpcode(this.opcode,d,0,0,d,5,5));
		
		LINE++; AVR328.PC++;

		return 0;
	}else
	{
		return 1;
	}	
}
AVR328.Commands.push(new classeteste());
//*********************************************
//***FIM ROL ******************************
//*********************************************

//*********************************************
//***Comando MOVW ******************************
//*********************************************
var classeteste = function()
{
	
	this.asm = "MOVW";
	
	this.opcode="0000 0001 dddd rrrr"; //tudo em caixa baixa!
}
classeteste.prototype.Command = function(s,tipo) //s = Rd,kk
{
	if (ValidateInput(s,7)) // Valida os parametros do comando
	{

		var p 	= RegExp(/(([x-z]|[X-Z]))+,+(([x-z]|[X-Z]))/);
		var p1	= RegExp(/(([x-z]|[X-Z])+(([h]|[H])))+:+(([x-z]|[X-Z])+(([l]|[L])))+,+(([x-z]|[X-Z])+(([h]|[H])))+:+(([x-z]|[X-Z])+(([l]|[L])))/);
		var p2	= RegExp(/(([x-z]|[X-Z])+(([h]|[H])))+:+(([x-z]|[X-Z])+(([l]|[L])))+,+((([r]|[R])+(\d\d))+:+(([r]|[R])+(\d\d)))/);
		var p3	= RegExp(/((([r]|[R])+(\d\d))+:+(([r]|[R])+(\d\d)))+,+(([x-z]|[X-Z])+(([h]|[H])))+:+(([x-z]|[X-Z])+(([l]|[L])))/);
		var p4	= RegExp(/((([r]|[R])+(\d\d))+:+(([r]|[R])+(\d\d)))+,+((([r]|[R])+(\d\d))+:+(([r]|[R])+(\d\d)))/);
		var p6 	= RegExp(/((([r]|[R])+(\d\d))+:+(([r]|[R])+(\d\d)))+,+(([x-z]|[X-Z]))/);
		var p5 	= RegExp(/(([x-z]|[X-Z]))+,+((([r]|[R])+(\d\d))+:+(([r]|[R])+(\d\d)))/);
		//Verifica
		as = s.split(",");
		if (p5.test(s))
		{
			if(as[0] == "X")
				as[0] = as[0].replace("X","R27:R26");
			else if (as[0] == "Y")
				as[0] = as[0].replace("Y","R29:R28");
			else if(as[0] == "Z")
				as[0] = as[0].replace("Z","R31:R30");	
		}
		if (p6.test(s))
		{
			if(as[1] == "X")
				as[1] = as[1].replace("X","R27:R26");
			else if (as[1] == "Y")
				as[1] = as[1].replace("Y","R29:R28");
			else if(as[1] == "Z")
				as[1] = as[1].replace("Z","R31:R30");	
		}
		if (p.test(s))
		{
			//Substitui os ponteiros de XYZ pelo
			//nome de cada registrador.
			
			if(as[0] == "X")
				as[0] = as[0].replace("X","R27:R26");
			else if (as[0] == "Y")
				as[0] = as[0].replace("Y","R29:R28");
			else if(as[0] == "Z")
				as[0] = as[0].replace("Z","R31:R30");

			if(as[1] == "X")
				as[1] = as[1].replace("X","R27:R26");
			else if (as[1] == "Y")
				as[1] = as[1].replace("Y","R29:R28");
			else if(as[1] == "Z")
				as[1] = as[1].replace("Z","R31:R30");
		}
		else if (p1.test(s))
		{
			
			if(as[0] == "XH:XL")
				as[0] = as[0].replace("XH:XL","R27:R26");
			else if(as[0] == "YH:YL")
				as[0] = as[0].replace("YH:YL","R29:R28");
			else if (as[0] == "ZH:ZL")
				as[0] = as[0].replace("ZH:ZL","R31:R30");
			
			if(as[1] == "XH:XL")
				as[1] = as[1].replace("XH:XL","R27:R26");
			else if(as[1] == "YH:YL")
				as[1] = as[1].replace("YH:YL","R29:R28");
			else if (as[1] == "ZH:ZL")
				as[1] = as[1].replace("ZH:ZL","R31:R30");
			
		}

		var d,d2,o,o2;
		
		var r = as[0].split(':');
		if(r.length>1)
		{
			if(r[0].length >=3)
				d = parseInt(r[0].substring(1,3));
			else
				d = parseInt(r[0].substring(1,2));

			if(r[1].length >=3)
				d2 = parseInt(r[1].substring(1,3));
			else
				d2 = parseInt(r[1].substring(1,2));
		}
		r = as[1].split(':');
		if(r.length>1)
		{
			
			if(r[0].length >=3)
				o = parseInt(r[0].substring(1,3));
			else
				o = parseInt(r[0].substring(1,2));

			if(r[1].length >=3)
				o2 = parseInt(r[1].substring(1,3));
			else
				o2 = parseInt(r[1].substring(1,2));
		}
		
		AVR328.R[d] = AVR328.R[o];
		AVR328.R[d2] = AVR328.R[o2];


		//o this.opcode é o "1110 kkkk dddd kkkk", depois é passado o numedo de 'd', e valor de k, e quantos bits são o k, que neste caso é 8bits
		InsereMemoria(CreateOpcode(this.opcode,d2/2,0,0,o2/2,4,4));

		LINE++; AVR328.PC++;
		

		return 0;
	}else
	{
		return 1;
	}	
}
AVR328.Commands.push(new classeteste());
//*********************************************
//***FIM MOVW ******************************
//*********************************************


//*********************************************
//***Comando  XCH******************************
//*********************************************
var classeteste = function()
{
	//Complemento de 2
	this.asm = "XCH";

	this.opcode="1001 001r rrrr 0100"; //tudo em caixa baixa!
}
classeteste.prototype.Command = function(s,tipo) //s = Rd
{
	var p 	= RegExp(/((z|Z))+,+((R+(\d))|(R+(\d\d)))/);
	if (p.test(s)) // Valida os parametros do comando
	{
	
		s = s.replace("Z","R31:R30");
		
		var d0  = parseInt(s.substring(5,7));
		var d1 = parseInt(s.substring(1,3));
		var r = parseInt(s.substring(9,11));
		
		var bin = DecToBin(AVR328.R[d1]) + DecToBin(AVR328.R[d0]);
		var dec = BinToDec(bin);
		
		var ex = TrimAll(MEMORIA_DADOS[dec]); 
		MEMORIA_DADOS[dec] = DecToBin(AVR328.R[r],8,true);
		AVR328.R[r] = BinToDec(ex);
		InsereMemoria(CreateOpcode(this.opcode,0,0,0,r,0,5));
		LINE++; AVR328.PC++;
		return 0;
	}else
	{
		return 1;
	}	
}
AVR328.Commands.push(new classeteste());
//*********************************************
//***FIM XCH ******************************
//*********************************************

//*********************************************
//***Comando CALL ******************************
//*********************************************
var classeteste = function()
{
	//if Rd >= Rr unsigned C = 0
	this.asm = "CALL";
	this.opcode="1001 010k kkkk 111k kkkk kkkk kkkk kkkk"; //tudo em caixa baixa!
}
classeteste.prototype.Command = function(s,tipo) //s = Rd,kk
{
	var k = AchaLabel(s);
	
	if(k!=-1)
	{
		//o this.opcode é o "1110 kkkk dddd kkkk", depois é passado o numedo de 'd', e valor de k, e quantos bits são o k, que neste caso é 8bits
		InsereMemoria(CreateOpcode(this.opcode,0,k,22,0,0));
		
			CALL = ++LINE; //Salva a linha que o call foi chamado		
			LINE = parseInt(k);
		 	AVR328.PC++;
		 	
		return 0;
	}
	return 1;
}
AVR328.Commands.push(new classeteste());
//*********************************************
//***FIM CALL ******************************
//*********************************************

//*********************************************
//***Comando RET ******************************
//*********************************************
var classeteste = function()
{
	//if Rd >= Rr unsigned C = 0
	this.asm = "RET";
	this.opcode="1001 0101 0000 1000"; //tudo em caixa baixa!
}
classeteste.prototype.Command = function(s,tipo) //s = Rd,kk
{
	if(CALL != "")
	{
		//o this.opcode é o "1110 kkkk dddd kkkk", depois é passado o numedo de 'd', e valor de k, e quantos bits são o k, que neste caso é 8bits
		InsereMemoria(CreateOpcode(this.opcode,0,0,0,0,0));
		
			LINE = CALL;
		 	AVR328.PC++;
		 	
		return 0;
	}
	return 1;
}
AVR328.Commands.push(new classeteste());
//*********************************************
//***FIM CALL ******************************
//*********************************************


//*********************************************
//***Comando  PUSH******************************
//*********************************************
var classeteste = function()
{
	//Complemento de 2
	this.asm = "PUSH";

	this.opcode="1001 001d dddd 1111"; //tudo em caixa baixa!
}
classeteste.prototype.Command = function(s,tipo) //s = Rd
{
	if (ValidateInput(s,_R)) // Valida os parametros do comando
	{
		
		var d = GetDReg(s);
		
		var bin = DecToBin(AVR328.R[d]);

		MEMORIA_DADOS[AVR328.SP++] = DecToBin(AVR328.R[d],8,true);
		InsereMemoria(CreateOpcode(this.opcode,d,0,0,0,5,0));
		LINE++; AVR328.PC++;
		return 0;
	}else
	{
		return 1;
	}	
}
AVR328.Commands.push(new classeteste());
//*********************************************
//***FIM PUSH ******************************
//*********************************************

//*********************************************
//***Comando  POP******************************
//*********************************************
var classeteste = function()
{
	//Complemento de 2
	this.asm = "POP";

	this.opcode="1001 000d dddd 1111"; //tudo em caixa baixa!
}
classeteste.prototype.Command = function(s,tipo) //s = Rd
{
	if (ValidateInput(s,_R)) // Valida os parametros do comando
	{
		
		var d = GetDReg(s);
		
		AVR328.R[d] = BinToDec(TrimAll(MEMORIA_DADOS[--AVR328.SP]));


		InsereMemoria(CreateOpcode(this.opcode,d,0,0,0,5,0));
		LINE++; AVR328.PC++;
		return 0;
	}else
	{
		return 1;
	}	
}
AVR328.Commands.push(new classeteste());
//*********************************************
//***FIM POP ******************************
//*********************************************