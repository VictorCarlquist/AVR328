var CODE; 
var MEMORIA = new Array(4096);
var MEMORIA_DADOS = new Array(4096);
var END = 0;
var LINE = 0;
var EXECUTAR = false; //VARIAVEL DIZ SE O EMULADOR ESTA EXECUTANDO O CODIDO, PARA IMPEDIR QUE ELE ADICIONE OS OPCODES NOVAMENTE
var MONTAGEM_OK;
var editor;
	
function leftPad(number, targetLength) {
    var output = number + '';
    while (output.length < targetLength) {
        output = '0' + output;
    }
    return output;
}
function criarPop(i,num)
{
	
	var s = "<span id='R"+leftPad(i,2)+"'data-original-title>  R"+leftPad(i,1)+"  : "+num+"</span><br>";
	s+="<script>$('#R"+leftPad(i,2)+"').popover({ title:' R"+leftPad(i,1)+": "+num+"', content: 'Bin: "+DecToBin(AVR328.R[i],8,true)+"<br>Hex: 0x"+AVR328.R[i].toString(16).toUpperCase()+"'});</script>";

	if(i<8)
		$( "#Reg1" ).append(s);
	else if(i<16)
			$( "#Reg2" ).append(s);
		else if(i<24)
			$( "#Reg3" ).append(s);
		else
			$( "#Reg4" ).append(s);
}

/**
* Atualiza os valores dos registradores na interface
*/
function AtualizaDados() 
{
	var flags = document.getElementById("Flag");
	var ns = "";
//	ns += "I: -  <br />";
//	ns += "T: -  <br/>";
//	ns += "H: -  <br/>";
	
	if(AVR328.S)
		ns += "<span class='label label-warning'>S</span><br />";
	else
		ns += "<span class='label'>S</span><br />";
	if(AVR328.V)
		ns += "<span class='label label-warning'>V</span><br />";
	else
		ns += "<span class='label'>V</span><br />";
	if(AVR328.N)
		ns += "<span class='label label-warning'>N</span><br />";
	else
		ns += "<span class='label'>N</span><br />";
	if(AVR328.Z)
		ns += "<span class='label label-warning'>Z</span><br />";
	else
		ns += "<span class='label'>Z</span><br />";
	if(AVR328.C)
		ns += "<span class='label label-warning'>C</span><br />";
	else
		ns += "<span class='label'>C</span><br />";
	ns += "<span>SP:"+AVR328.SP+"  </span><br/>";
	//ns += "PC:"+AVR328.PC+" <br/>";
	
	flags.innerHTML = ns;
	flags = document.getElementById("Reg1");
	ns= "";
	flags.innerHTML = ns;
	flags = document.getElementById("Reg2");
	flags.innerHTML = ns;
	flags = document.getElementById("Reg3");
	flags.innerHTML = ns;
	flags = document.getElementById("Reg4");
	flags.innerHTML = ns;
	//flags.innerHTML = '';
	for(var i=0;i<32;i++)
	{
		criarPop(i,leftPad(AVR328.R[i],3));
	}
	
	$(function (){
		$("[rel=popover]").popover({placement:'left'});
		}); 
	//flags.innerHTML = ns;
	
}
/**
* Modifica o texto da div 'opcode', para limpar a div basta enviar '""'
* @param {string} Binarios das intruções
*/
function ConsoleBin(s)
{
	var CampoOpCODE = document.getElementById("opcode");
	if(s != "")
	{
		CampoOpCODE.value = s+"\n";
	}
	else
		CampoOpCODE.value = s;
}
/**
* Modifica o texto da div 'dados', para limpar a div basta enviar '""'
* @param {string} Binarios das variaveis
*/
function ConsoleBinDados(s)
{
	var CampoOpCODE = document.getElementById("dados");
	if(s != "")
	{
		CampoOpCODE.value = s+"\n";
	}
	else
		CampoOpCODE.value = s;
}
/**
* Modifica o texto da div 'erros', para limpar a div basta enviar '""'
* @param {string} um erro
*/
function ConsoleBinErro(s)
{
	var CampoOpCODE = document.getElementById("erros");
	if(s != "")
	{
		CampoOpCODE.value += s+"\n";
	}
	else
		CampoOpCODE.value = s;
}
/**
* Insere um byte na memória em Binario
* @param {string}
*/
function InsereMemoria(s)
{
	if(!EXECUTAR)
	{
		spl = Trim(s);
		if(spl.length <=19)
		{
			MEMORIA[END] = spl.substring(0,9);
			END++;
			MEMORIA[END] = spl.substring(10);
			END++;
		}else
		{
			var s1 = spl.substring(0,9);
			var s2 = spl.substring(10,19);
			var s3 = spl.substring(20,29);
			var s4 = spl.substring(30);
			MEMORIA[END] = s1;
			END++;
			MEMORIA[END] = s2;
			END++;
			MEMORIA[END] = s3;
			END++;
			MEMORIA[END] = s4;
			END++;
			
		}
	}
}
/**
* Mostra o conteúdo da variável MEMÓRIA na interface
* @see ConsoleBin() 
*/
function MostraMemoria()
{
	ConsoleBin("");
	var s = "";
	for(var i=0;i<4096;i++)
		if(i<16)
			s += "0x00"+i.toString(16).toUpperCase()+": "+MEMORIA[i]+'\n';
		else if(i>=16 && i<256)
				s += "0x0"+i.toString(16).toUpperCase()+": "+MEMORIA[i]+'\n';
			 else
				s += "0x"+i.toString(16).toUpperCase()+": "+MEMORIA[i]+'\n';
			
	ConsoleBin(s);
}
/**
* Mostra o conteúdo da variável MEMÓRIA_DADOS na interface
* @see ConsoleBinDados() 
*/
function MostraMemoriaDados()
{
	ConsoleBinDados("");
	var s = "";
	for(var i=0;i<4096;i++)
		if(i<16)
			s += "0x00"+i.toString(16).toUpperCase()+": "+MEMORIA_DADOS[i]+'\n';
		else if(i>=16 && i<256)
				s += "0x0"+i.toString(16).toUpperCase()+": "+MEMORIA_DADOS[i]+'\n';
			 else
				s += "0x"+i.toString(16).toUpperCase()+": "+MEMORIA_DADOS[i]+'\n';
			
	ConsoleBinDados(s);
}
/**
* Inicializa a interface, processador e/ou memória
* @param {integer} tipo = 0(inicializa TUDO);tipo = 1(inicializa o processador, não a memória)
*/
function inicializa(tipo)
{
	
	var comandos = AVR328.Commands;
	AVR328 = new CAVR328;
	AVR328.Commands = comandos;
		for(var i=0;i<32;i++)
				AVR328.R[i] = Math.floor((Math.random()*256));
	if(tipo == 0)
	{
		ConsoleBin("");
		for(var i=0;i<4096;i++)
		{
			MEMORIA[i] =  DecToBin(Math.floor((Math.random()*256)),8,true);
			MEMORIA_DADOS[i] = DecToBin(Math.floor((Math.random()*256)),8,true);
		}
		MostraMemoriaDados();
		MostraMemoria();
	}
	if(tipo == 1)
	{
		for(var i=0;i<4096;i++)
		{
			MEMORIA_DADOS[i] = DecToBin(Math.floor((Math.random()*256)),8,true);
		}
		MostraMemoriaDados();
		MostraMemoria();
	}
	END = 0;
	AtualizaDados();
	
	document.getElementById("btn_Executa").disabled = true;
	document.getElementById("btn_Frente").disabled = true;
	editor.setReadOnly(false); 
}
function Valida()
{
	END = 0;
	AtualizaDados();
	
	if(MONTAGEM_OK)
	{
		document.getElementById("btn_Executa").disabled = false;
		document.getElementById("btn_Frente").disabled = false;
	}
	else
	{
		document.getElementById("btn_Executa").disabled = true;
		document.getElementById("btn_Frente").disabled = true;
	}
}
/**
* Normaliza o comando
* @param c instrucao 
* @return {array} 0 comando , 1 parametro 
*/
function Normalizar(c)
{

	//Este laço deixa com 1 espaço entre o CCC e Rd. Ex: LDI      R10,10 ->após o laço-> LDI R10,10
	var i =0;
	do{
		if(c.substr(i,1) == ' ')
		{
		
			if(c.substr(i+1,1) == ' ')
			{
				c = c.substring(0,i+1) + c.substring(i+2); 
				
			}else
				break;
		}
		else
			i++;
	}while(i < c.length);
	
	var part = Array(2);
	part[0] = c.substring(0,i);
	part[1] = c.substring(i+1);  
	return part;

}

/**
* Converte os mnemonicos em opcodes, alterando memória , verifica a sintaxe
*/
function Montar()
{
	LINEs();
	
	ConsoleBinErro("");
	MONTAGEM_OK = true;
	EXECUTAR = false;
	//inicializa(0);
	LINE=0;
	//document.getElementById("linha").value = "linha: " +LINE;
	var CampoOpCODE = document.getElementById("opcode");


	CODE =editor.getValue().split("\n");//Coloca uma LINE em cada indice do vetor
	while(LINE < CODE.length)
	{
		
		CODE[LINE] = Trim(CODE[LINE]) // tira espaços iniciais e finais do comando
		var CodSemComentario = CODE[LINE].split(";");
		CODE[LINE] = CodSemComentario[0];
		
		var c = CODE[LINE].toUpperCase();//pega a instrução
		var part = Normalizar(c);
		
		
		//se for uma label, 
		//pula para proxima LINE se tiver espaço em branco
		var isLabelOnly = false; // se existir uma label, ira verificar se há um comando na mesma LINE
		if(part[0].indexOf(":") >= 0 || part[0]=="")
		{
			if(part[1] != "") // se true: existe uma instrucao na frente da label
			{
				part = Normalizar(part[1]);
			}
			else
			{
				LINE++;
				isLabelOnly = true;
			}
		}	
		if(!isLabelOnly)
		{
			var encontrado = false;
			for(var i in AVR328.Commands)
			{
				if(AVR328.Commands[i].asm.toUpperCase() == part[0]) //Pesquisa o comando
				{
					encontrado = true;
					if(AVR328.Commands[i].Command(TrimAll(part[1]),0) == 1) // Chama a ação do comando passando os parametros do comando
					{
						ConsoleBinErro("Linha ["+ (parseInt(LINE)+1)+"] : Parametro da instrução "+AVR328.Commands[i].asm.toUpperCase()+"  incorreto.");
						MONTAGEM_OK = false;
						break;
					}
					
					MostraMemoria();
					MostraMemoriaDados();
					AtualizaDados();
					break;
				}
					
			}
			if(!encontrado)
			{
				MONTAGEM_OK = false;
				ConsoleBinErro("Instrucao desconhecida! linha:"+ (parseInt(LINE)+1)+" : "+part[0]);
				break;
			}
		
		
			LINE++;
			
		}
		
	}
	
	//inicializa(1); // Limpa o estado do processador, pois esta função é apenas para gerar os opcodes.
	Valida();
	if(MONTAGEM_OK && LINE != 1)
	{
		editor.setReadOnly(false); 
		document.getElementById("btn_Executa").disabled = false;
		document.getElementById("btn_Frente").disabled = false;
	}else
	{
		document.getElementById("btn_Executa").disabled = true;
		document.getElementById("btn_Frente").disabled = true;
	}
	LINE = 0;
	END = 0;
	
	
}		
/**
* Executa o código que foi montado
*/
function Executar()
{
	ConsoleBinErro("");
	EXECUTAR = true;
	//inicializa(1);
	while(LINE < CODE.length)
	{
		
		
		var c = CODE[LINE].toUpperCase();//separa a instrução do parametros
		var part = Normalizar(c);
		
		//se for uma label, pula para proxima LINE 
		var isLabelOnly = false;
		if(part[0].indexOf(":") >= 0 || part[0]=="")
		{
			if(part[1] != "") // se true: existe uma instrucao na frente da label
			{
				part = Normalizar(part[1]);
			}
			else
			{
				LINE++;
				isLabelOnly = true;
			}
		}	
		if(!isLabelOnly)
		{
			var encontrado = false;
			for(var i in AVR328.Commands)
			{
				if(AVR328.Commands[i].asm.toUpperCase() == part[0]) //Pesquisa o comando
				{
					if(AVR328.Commands[i].Command(TrimAll(part[1]),1) == 1) // Chama a ação do comando passando os parametros do comando
					{
						ConsoleBinErro("Erro na LINE "+ (parseInt(LINE)+1));
						LINE++;
					}
					encontrado = true;
					MostraMemoria();
					MostraMemoriaDados();
					AtualizaDados();
					break;
				}
					
			}
			if(!encontrado)
			{
				ConsoleBinErro("Instrucao desconhecida! LINE:"+ (parseInt(LINE)+1));

			}
		
		}
			
	}
	EXECUTAR = false;
	editor.setReadOnly(false); 
	document.getElementById("btn_Executa").disabled = true;
	document.getElementById("btn_Frente").disabled = true;
}		
/**
*Executa o código LINE por LINE
*/
function Passo()
{
	//ConsoleBinErro("");
	EXECUTAR = true;
	//inicializa(1);

	//Este laço deixa com 1 espaço entre o CCC e Rd. Ex: LDI      R10,10 ->após o laço-> LDI R10,10
	var c = CODE[LINE].toUpperCase();//separa a instrução do parametros
	var part = Normalizar(c);
	
	while(c == "")
	{
		LINE++;	
		c = CODE[LINE].toUpperCase();//separa a instrução do parametros
		part = Normalizar(c);
	}
			
	//se for uma label, pula para proxima LINE 
		var isLabelOnly = false;
		if(part[0].indexOf(":") >= 0 || part[0]=="")
		{
			if(part[1] != "") // se true: existe uma instrucao na frente da label
			{
				part = Normalizar(part[1]);
			}
			else
			{
				LINE++;
				isLabelOnly = true;
			}
		}	
		
		
		if(!isLabelOnly)
		{
			var encontrado = false;
			for(var i in AVR328.Commands)
			{
				if(AVR328.Commands[i].asm.toUpperCase() == part[0]) //Pesquisa o comando
				{
					if(AVR328.Commands[i].Command(TrimAll(part[1]),1) == 1) // Chama a ação do comando passando os parametros do comando
					{
						ConsoleBinErro("Erro na linha "+ (parseInt(LINE)+1));
						LINE++;
						break;
					
					}
					encontrado = true;
					MostraMemoria();
					MostraMemoriaDados();
					AtualizaDados();
					break;
				}
				
			}
			if(!encontrado)
			{
				ConsoleBinErro("Instrucao desconhecida! LINE:"+ (parseInt(LINE)+1));
			}
	
	}
	if((LINE) >= CODE.length)
	{
		document.getElementById("btn_Frente").disabled = true;
		editor.setReadOnly(true); 
	}
	
	//document.getElementById("linhas").value = "Linha: " +LINE;
	editor.gotoLine(LINE);
	//LINEs(LINE);
}		
/**
* Gera o numero das LINEs e destaca a LINE em execução
*/
function LINEs(l)
{
	var ns="";
	if(!l)
		l=0;
	for(var i=1;i<100;i++)
	{
		if(l==i-1)
		{
			ns+="<span style='color:white;background-color:black;'>"+i+"</span><br />";
		}else
			ns+=i+"<br />";
	}
	//document.getElementById("linhas").innerHTML = ns;
}
function scroolCode()
{
	//document.getElementById("linhas").scrollTop = document.getElementById("CODE").scrollTop;
}

