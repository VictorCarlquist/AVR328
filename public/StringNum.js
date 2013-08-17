/**
* Inverte uma string
* @param {string}
* @return {string}
*/
function Reverse (s)
{	
	var ns = "";
	for(var i=s.length;i>=0;i--)
		ns += s.substr(i,1)
	
	return ns;
}
/**
* Coloca um espaço a casa 4 bits(caracteres) 
* @param {string} 
* @return {string}
*/
function ColocaEspaco(s)
{
	var i=1;
	var ns= s.substring(0,4)+" "+s.substring(4,8)+" "+s.substring(8,12)+" "+s.substring(12,16);
	return ns;
	
}
/**
* Converte de decimal para binario
* @param {integer} valor, decimal
* @param {integer} bits, numero de bits de retorno (default 8)
* @param {boolean} espaco, se verdadeiro coloca espaço a cada 4 bits
* @return {string}
*/
function DecToBin(valor,bits,espaco) //valor = dec e bits = 8 // espaço(bool) entre 4 bits //
{
	if(!bits) bits =8;
	var negativo = false;
	if(valor<0)
	{
		negativo = true;
		valor = valor *-1;
	}
	var resto = "";
	do{
		resto +=(valor%2);
		valor = Math.floor(valor/2);
	}while(valor >= 1 && resto.length <=bits);
	for(var i = resto.length; i< bits;i++) resto +="0";
	
	resto = Reverse(resto);
	if(negativo)
		resto = complement2(resto);
	if(espaco)
		resto = ColocaEspaco(resto);
	return resto;
}
/**
* Converte de binario para decimal
* @param {string} s, valor em binario
* @return {integer}
*/

function BinToDec(s)
{
	var ind = s.length-1;
	var i = 0;
	var dec = 0;
	while((ind-i)>=0){
		dec += s[ind-i]*Math.pow(2,i);
		i++;
	}
	return dec;
}


/**
* Tira os espaços iniciais e finais de uma string
* @param {string}
* @return {string}
*/
function Trim(str){return str.replace(/^\s+|\s+$/g,"");}
/**
* Tira os todos espaços de uma string
* @param {string}
* @return {string}
*/
function TrimAll(str){return str.replace(/\s/g,'');}

/**
* Verifica se os parametros de uma função estão corretas
* @param {string} s parametros da instrução
* @param {integer} type
* Rd com Rd = 0 <br />
* Rd com KK = 1 <br />
* Rd		= 2 <br />
* KK com Rd = 3 <br />
* [X-Z],Rd  = 4 <br />
* Rd,[X-Z]  = 5 <br /> 
* KK        = 6 <br /> 
* [X-Z|Rd:Rd],[X-Z|Rd:Rd] = 7
* @return {boolean}
*/
//constantes da função ValidateInput
var _R_R = 0;
var _R_K = 1;
var _R   = 2;
var _K_R = 3;
var _XYZ_R = 4;
var _R_XYZ = 5;

function ValidateInput(s,type)
{
	var RtoR = RegExp(/((R+(\d))|(R+(\d\d)))+,+(R+(\d)|R+(\d\d))/);
	var RtoK = RegExp(/((R+(\d))|(R+(\d\d)))+,+((\d)|-(\d))/);
	var R 	 = RegExp(/R+(\d)|R+(\d\d)/);
	var KtoR = RegExp(/((\d)|(\d\d)|(\d\d\d)|(\d\d\d\d)|(\d\d\d\d\d))+,+((R+(\d))|(R+(\d\d)))/);
    var K    = RegExp(/\d{1,}/); 
	if(type == 0)
		if(RtoR.test(s))
			return true;
	if(type == 1)
		if(RtoK.test(s))
			return true;
	if(type == 2)
		if(R.test(s))
			return true;
	if(type == 3)
		if(KtoR.test(s))
			return true;
	if(type == 4)
	{
		var p 	= RegExp(/(([x-z]|[X-Z]))+,+((R+(\d))|(R+(\d\d)))/);
		var p1	= RegExp(/((([x-z)|[X-Z])+(([h]|[H])))+:+(([x-z)|[X-Z])+(([l]|[L])))+,((\d)|(\d\d)))/);
		var p2	= RegExp(/((([r]|[R])+(\d\d))+:+(([r]|[R])+(\d\d))+,+((\d)|(\d\d)))/);

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
			else
				return false;
		}
		else if (p2.test(s))
		{
			var d  = parseInt(s.substring(5,7));
			var d1 = parseInt(s.substring(1,3));
			
			if(d >= 24 && d <= 31)
			{
				rs = d1 - d;
				if(rs != 1)
					return false;
			}
			else
				return false;		
		}else
			return false;
		
		//Se chegou até aqui significa que a string foi informada corretamente.
		//Depois de verificar se as string estao corretas, pega os valores da string.
		
		
		return true;
	}
	if(type == 5)
	{
		var p 	= RegExp(/((R+(\d))|(R+(\d\d)))+,+(([x-z]|[X-Z]))/);
		var p1	= RegExp(/((R+(\d))|(R+(\d\d)))+,+(([x-z]|[X-Z])+(([h]|[H])))+:+(([x-z]|[X-Z])+(([l]|[L])))/);
		var p2	= RegExp(/((R+(\d))|(R+(\d\d)))+,+((([r]|[R])+(\d\d))+:+(([r]|[R])+(\d\d)))/);

		//Verifica
		s = s.split(",");
		if (p.test(s))
		{
			//Substitui os ponteiros de XYZ pelo
			//nome de cada registrador.
			
			if(s[1] == "X")
				s = s[1].replace("X","R27:R26");
			else if (s[1] == "Y")
				s = s[1].replace("Y","R29:R28");
			else if(s[1] == "Z")
				s = s[1].replace("Z","R31:R30");
		}
		else if (p1.test(s))
		{
			if(s[1] == "XH:XL")
				s = s[1].replace("XH:XL","R27:R26");
			else if(s[1] == "YH:YL")
				s = s[1].replace("YH:YL","R29:R28");
			else if (s[1] == "ZH:ZL")
				s = s[1].replace("ZH:ZL","R31:R30");
			else
				return false;
		}
		else if (p2.test(s))
		{
			var d  = parseInt(s.substring(5,7));
			var d1 = parseInt(s.substring(1,3));
			
			if(d >= 24 && d <= 31)
			{
				rs = d1 - d;
				if(rs != 1)
					return false;
			}
			else
				return false;		
		}else
			return false;
		
		//Se chegou até aqui significa que a string foi informada corretamente.
		//Depois de verificar se as string estao corretas, pega os valores da string.
		
		
		return true;
	}
	if(type == 6)
	    if(K.test(s))
			    return true;
	if(type == 7)
	{
		var p 	= RegExp(/(([x-z]|[X-Z]))+,+(([x-z]|[X-Z]))/);
		var p1	= RegExp(/(([x-z]|[X-Z])+(([h]|[H])))+:+(([x-z]|[X-Z])+(([l]|[L])))+,+(([x-z]|[X-Z])+(([h]|[H])))+:+(([x-z]|[X-Z])+(([l]|[L])))/);
		var p2	= RegExp(/(([x-z]|[X-Z])+(([h]|[H])))+:+(([x-z]|[X-Z])+(([l]|[L])))+,+((([r]|[R])+(\d\d))+:+(([r]|[R])+(\d\d)))/);
		var p3	= RegExp(/((([r]|[R])+(\d\d))+:+(([r]|[R])+(\d\d)))+,+(([x-z]|[X-Z])+(([h]|[H])))+:+(([x-z]|[X-Z])+(([l]|[L])))/);
		var p4	= RegExp(/((([r]|[R])+(\d\d))+:+(([r]|[R])+(\d\d)))+,+((([r]|[R])+(\d\d))+:+(([r]|[R])+(\d\d)))/);
		var p5 	= RegExp(/((([r]|[R])+(\d\d))+:+(([r]|[R])+(\d\d)))+,+(([x-z]|[X-Z]))/);
		var p6 	= RegExp(/(([x-z]|[X-Z]))+,+((([r]|[R])+(\d\d))+:+(([r]|[R])+(\d\d)))/);

		//Verifica
		s = s.split(",");
		if (p.test(s))
		{
			//Substitui os ponteiros de XYZ pelo
			//nome de cada registrador.
			
			if(s[0] == "X")
				s = s[0].replace("X","R27:R26");
			else if (s[0] == "Y")
				s = s[0].replace("Y","R29:R28");
			else if(s[0] == "Z")
				s = s[0].replace("Z","R31:R30");

			if(s[1] == "X")
				s = s[1].replace("X","R27:R26");
			else if (s[1] == "Y")
				s = s[1].replace("Y","R29:R28");
			else if(s[1] == "Z")
				s = s[1].replace("Z","R31:R30");

			return true;
		}
		else if (p1.test(s))
		{
			
			if(s[0] == "XH:XL")
				s = s[0].replace("XH:XL","R27:R26");
			else if(s[0] == "YH:YL")
				s = s[0].replace("YH:YL","R29:R28");
			else if (s[0] == "ZH:ZL")
				s = s[0].replace("ZH:ZL","R31:R30");
			else
				return false;	

			if(s[1] == "XH:XL")
				s = s[1].replace("XH:XL","R27:R26");
			else if(s[1] == "YH:YL")
				s = s[1].replace("YH:YL","R29:R28");
			else if (s[1] == "ZH:ZL")
				s = s[1].replace("ZH:ZL","R31:R30");
			else
				return false;

			return true;
		}else if (p2.test(s)) return true;
			else if (p3.test(s)) return true;
				else if (p4.test(s)) return true;
					else if (p5.test(s)) return true;
						else if (p6.test(s)) return true;
							else
							return false;
	}
	return false;
}
/**
* Substitui os 'k' e os 'd' pelos binario da instrução
* @param {string} fs: padrao do opcode; exemplo: 1111 dddd kkkk dddd
* @param {integer} d: numero do Rd em dec
* @param {integer} [k: valor imediato]
* @param {integer} [kb: numero de bits que se quer gerar a partir do valor de k]
* @param {integer} [r:  numero do Rr em dec]
* @param {integer} [nd: numero de bits que se quer gerar a partir do valor de d]
* @param {integer} [nr = numero de bits que se quer gerar a partir do valor de r]
* @return {string}
*/
function CreateOpcode(fs,d,k,kb,r,nd,nr)
{
	if(!nd)	nd = 4;
	if(!nr)	nr = 4;
	var binD = DecToBin(d,nd); //Rd
	var binK = DecToBin(k,kb);//KK
	var binR = DecToBin(r,nr); //Rr
	var jk = 0;
	var jd = 0;
	var jr = 0;
	var ns = "";
	for(var i =0;i<fs.length;i++)
	{
		if(fs.substr(i,1) != " ")
		{
			if(fs.substr(i,1) == "d")
			{
				ns+= binD.substr(jd,1);
				jd++;
			}else 
				if(fs.substr(i,1) == "k")	
				{
					ns+= binK.substr(jk,1);
					jk++;
				}else
					if(fs.substr(i,1) == "r")	
					{
						ns+= binR.substr(jr,1);
						jr++;
					}else
						ns+=fs.substr(i,1);
		}else
			ns+=" ";
	
	}
	return ns;
}
/**
* Pega o numero do primeiro Registrador na instrução
* @param {string} parametro de uma instrução
* @return {integer}
*/
function GetDReg(s)
{
	if(s.substr(2,1) == ',')
		return parseInt(s.substr(1,1));
	else
		return parseInt(s.substr(1,2));
}
/**
* Pega o numero do segundo Registrador na instrução
* @param {string} parametro de uma instrução
* @return {integer}
*/
function GetDReg2(s)
{
	if(s.substr(2,1) == ',')
		return parseInt(s.substr(4));
	else
		return parseInt(s.substr(5));
}
/**
* Pega o valor imediato na instrução
* @param {string} parametro de uma instrução
* @return {integer}
*/
function GetK(s)
{
	if(s.substr(2,1) == ',')
		return parseInt(s.substr(3));
	else
		return parseInt(s.substr(4));
}
//Estrutura dos dados do AVR328

/**

*/

function negacao(item){
		var str = "";
		
		for(var i in item)
		{
			if(item[i] == 0)		
				str += '1';
			else
				str += '0';
		}
		return(str);
}
/**
 *Soma dois binários
 *@param {string} op1: operador 1
 *@param {string} op2: operador 2
 *@param {string} c: usa carry inicial
 *@param {string} nd: numero de bits de retorno, default: 8
 *
 */
 function ADD(op1,op2,c,nd)
 {
	var result = "";
	var ult;
	if(!nd)
		nd = 8;
	if(!c)
		AVR328.C = 0; //Seta o Bit de status do Carry como 0.
	if(typeof(op1) != "string")
		op1=op1.toString();
	if(typeof(op2) != "string")
		op2=op2.toString();
	if(op1.length < nd)
	{
		var x = nd - op1.length ;
		for(var i = 0; i < x; i++)
		{
			op1 = "0" + op1;
		}
	}
	else if(op2.length < nd)
	{
		var x = nd - op2.length;
		for(var i = 0; i < x; i++)
		{
			op2 = "0" + op2;
		}
	}
	ult = op1.length;		
	
	for(var i = ult-1; i >= 0;i--)
	{
		var j = parseInt(op1[i]);
		var x = parseInt(op2[i]);
		var r = j + x + AVR328.C;
		
		if(r > 1)
		{
			result += (r - 2);
			AVR328.C = 1;
		}
		else
		{
			result += r;
			AVR328.C = 0;
		}
	}
	result = Reverse(result);
	return result;

}
/*
 *
 *
 *
 *
 *
 */

function complement2(str,digitos){
	
	var str = negacao(str);
	str1 = ADD(str,DecToBin(1),false,digitos);
	if(AVR328.C == 1)
		AVR328.V = 1;
	else
		AVR328.V = 0;
	return(str1);
}

function AchaLabel(lbl) // lbl == 'ANTES'
{
	for(var i in CODE)
	{
		if(CODE[i].toUpperCase().indexOf(lbl+':')>=0)
			return i;
	}
	return -1;
}

function ADIW(s){
		
		//Coloca string maiuscula e Retira da string o comando.
		s = s.toUpperCase(); s = s.replace("ADIW","");

		//	p	= ADIW Z,10
		//	p1	= ADIW ZH:ZL,10
		//	p2 	= ADIW R31:R30,10		
		var p 	= RegExp(/(([x-z]|[X-Z]))+,+((\d)|(\d\d))/);
		var p1	= RegExp(/((([x-z]|[X-Z])+(([h]|[H])))+:+(([x-z]|[X-Z])+(([l]|[L])))+,((\d)|(\d\d)))/);
		var p2	= RegExp(/((([r]|[R])+(\d\d))+:+(([r]|[R])+(\d\d))+,+((\d)|(\d\d)))/);

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
			else
				return false;
		}
		else if (p2.test(s))
		{
			var d  = parseInt(s.substring(5,7));
			var d1 = parseInt(s.substring(1,3));
			
			if(d >= 24 && d <= 31)
			{
				rs = d1 - d;
				if(rs != 1)
					return false;
			}
			else
				return false;		
		}else
			return false;
		
		//Se chegou até aqui significa que a string foi informada corretamente.
		//Depois de verificar se as string estao corretas, pega os valores da string.
		var d  = parseInt(s.substring(5,7));
		var d1 = parseInt(s.substring(1,3));
		var imediato = s.substring(8);
			
		if(parseInt(imediato)>63 || parseInt(imediato)<0)
			return false;
		//Concatena os dois registradores para formar um par.
		var nr = DecToBin(AVR328.R[d1]) + DecToBin(AVR328.R[d]);
		
		//Converte o numero Informado para binario.
		var binImediato = DecToBin(imediato,16);
		
		//soma os valores.
		var result = ADD(nr,binImediato);
		
		AfetaFlag(result);
		//coloca os valores em cada registrador do par.
		AVR328.R[d1] = BinToDec(result.slice(0,8)); //Pega ate a posicao 8.
		AVR328.R[d]  = BinToDec(result.slice(-8));  //Pega oito casas a partir da ultima.
		
		return true;
}

function ASR(d){
	
		//Declara o valor para o deslocamento.
		//A funcao ASR sempre desloca UM bit a direita.
		var des = 1;
		//Efetua o deslocamento.
		var bin = DecToBin(AVR328.R[d]);
		AVR328.C = parseInt(bin[bin.length-1]);
		AVR328.R[d] = AVR328.R[d] >> des;
		AfetaFlag(DecToBin(AVR328.R[d]));
	}
	
function AfetaFlag(sdk)
{
	var dk = BinToDec(sdk);
	if(dk == 0) AVR328.Z = 1; else AVR328.Z = 0;
	if(sdk[0] == '1') AVR328.N = 1; else AVR328.N = 0;
	if(AVR328.N == 1 ^ AVR328.V == 1) AVR328.S = 1; else AVR328.S = 0;
}	
/**
* Realiza a operação .OU.  
* @param {string} op1 1o. valor (binario) 
* @param {string} op2 2o. valor (binario)
* @return {string} (binario)
*/
function OR(op1, op2)
{
	//Converte para maiusculo e retira o comando da string incluindo os espacos.
	//s = s.toUpperCase(); s = s.replace("OR",""); s = TrimAll(s);
	
	//Exp para validar a entrada.
	// exp1 = R[\d],R[\d]
	// exp2 = R[\d],R[\d\d]
	// exp3 = R[\d\d],R[\d]
	// exp4 = R[\d\d],R[\d\d]
	/*var exp1 = RegExp(/((([r]|[R])+([\d]))+,+(([r]|[R])+([\d])))/);
	var exp2 = RegExp(/((([r]|[R])+([\d]))+,+(([r]|[R])+([\d\d])))/);
	var exp3 = RegExp(/[R]+[\d]+[\d]+,+[R]+([\d])$/);
	var exp4 = RegExp(/[R]+[\d]+[\d]+,+[R]+([\d]+[\d])$/);
	
	//Declara as variaveis que receberão os numeros dos regs.
	var d,r;
	
	if(exp1.test(s))
	{
		d = parseInt(s.substring(1,2));
		r = parseInt(s.substring(4,5));
		if( d < 0 && r < 0)
			return false;
	}
	else if(exp2.test(s))
	{
		d = parseInt(s.substring(1,2));
		r = parseInt(s.substring(4,6));
		if(d < 0 && (r < 0 || r > 31))
			return false;			
	}
	else if(exp3.test(s))
	{
		d = parseInt(s.substring(1,3));
		r = parseInt(s.substring(5,6));
		if(r < 0 || d < 0 || d > 31)
			return false;
	}
	else if(exp4.test(s))
	{
		d = parseInt(s.substring(1,3));
		r = parseInt(s.substring(5,7));
		if(d < 0 || d > 31 || r < 0 || r > 31)
			return false;			
	}
	else
		return false;
	*/	
	
	//Se chegou até aqui significa que a string foi informada corretamente.
	
	/*	Pega os valores de cada registrador.
		Depois pega o tamanho da string para ser parametro do 'for'.
		Nesse caso poderia ser qualquer reg. Ex.: reg[d] || reg[r],
		pois os valores dentro de cada registrador sempre tem o mesmo tamanha em bits.
		Após isso e feito um .E. entre os valores e o resultado armazenado no reg[d].
		Declara a variavel que receberá o .E. entre os registradores.
	 */
	 
	//Coloca os valores de reg[d] e reg[r] nas variaveis.
	//var rd = DecToBin(AVR328.R[GetDReg(s)]);
	//var rr = DecToBin(AVR328.R[GetDReg2(s)]);
	//
	var ns = "";
	
	for(var i = 0; i < 8; i++)
	{
		if(Boolean(parseInt(op1[i])) || Boolean(parseInt(op2[i])))
			ns += "1";
		else
			ns += "0";
	}
	
	return ns;
	
}

/**
* Realiza a operação .XOU.  
* @param {string} op1 1o. valor (binario) 
* @param {string} op2 2o. valor (binario)
* @return {string} (binario)
*/
function XOR(op1, op2)
{
	var ns = "";
	
	for(var i = 0; i < 8; i++)
	{
		
		if((Boolean(parseInt(op1[i])) && !Boolean(parseInt(op2[i])))  || (!Boolean(parseInt(op1[i])) && Boolean(parseInt(op2[i]))))
			ns += "1";
		else
			ns += "0";
	}
	
	return ns;
	
}

/**
* Realiza a operação .E.  
* @param {string} op1 1o. valor (binario) 
* @param {string} op2 2o. valor (binario)
* @return {string} (binario)
*/
function AND(op1, op2)
{
	var ns = "";
	
	for(var i = 0; i < 8; i++)
	{
		if(Boolean(parseInt(op1[i])) && Boolean(parseInt(op2[i])))
			ns += "1";
		else
			ns += "0";
	}
	
	return ns;
	
}

/**
* Subtrai dois numeros binarios. (subtração binaria)
* @param {string} op1 minuendo
* @param {string} op2 subtraendo
* @return {string}
*/
function SUB(op1,op2)
{
	var result = "";
	var ult;
	if(typeof(op1) != "string")
		op1=op1.toString();
	if(typeof(op2) != "string")
		op2=op2.toString();
	if(op1.length > op2.length)
	{
		var x = op2.length - 8;
		for(var i = 0; i < x; i++)
		{
			op2 = "0" + op2;
		}
	}
	else if(op1.length < op2.length)
	{
		var x = op1.length - 8;
		for(var i = 0; i < x; i++)
		{
			op1 = "0" + op1;
		}
	}
	ult = op1.length;		

	AVR328.C = 0;// não há emprestimo no inicio
	for(var i = ult-1; i >= 0;i--)
	{
		var j = parseInt(op1[i]);
		var x = parseInt(op2[i]);
		if((j-AVR328.C) < x)
		{
			result += '1';
			AVR328.C = 1;
		}else
		{
			var r = j - x - AVR328.C;
			result += r;
			AVR328.C = 0;
		}
	
	
	}
	result = Reverse(result);
	return result;

}


