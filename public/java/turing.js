var TAMANHO_QUADRADO = 100;
var IMG_WIDTH = 500;
var IMG_HEIGHT = 600;

var nivel = 2;
var vetor = new Array();
var quadro_tmp;

function Quadro()
{
  var strhtml;
  var id;
}

function Terminou()
{
  var verX   = 0;
  var verY   = 0;
  var result = 1;
  
  $('#teste').val("");
  $("#mural").find("*").each(function() 
  { 
    if(($(this).css("backgroundPosition").toString()) != ((verX.toString()*-100)+"px "+(verY.toString()*-100)+"px"))
    {
      result = 0;
    }
    
    if (verX == (IMG_WIDTH/TAMANHO_QUADRADO) - 1)
    {
      verX = 0*-1;
      verY++;
    }
    else
    {
      verX ++;
    }
    
  });
  
  return result;
}

function AlterarQuadro(div_quadro)
{
  var aux;
  
  if (quadro_tmp == undefined)
  {
    quadro_tmp = div_quadro;    
    quadro_tmp.css("backgroundImage" , "url(../img/alan_turing2.png)");
  }
  else
  {
    quadro_tmp.css("backgroundImage" , "url(../img/alan_turing.png)");
    
    aux = div_quadro.css("backgroundPosition").toString();
    div_quadro.css("backgroundPosition",quadro_tmp.css("backgroundPosition").toString());
    quadro_tmp.css("backgroundPosition",aux);
     
    quadro_tmp = undefined;    
  }
  
}

$(document).ready(function() 
{
  var cont          = 0;
  var total_quadros = 0;
  var quadro        = null;
  var count_quadros = 0;
  
  $('#div_texto').animate({ opacity: 0 }, 0, function() {});
  
  $("#mural").ready(function()
  {      
    for(var j = 0; j < (IMG_HEIGHT / TAMANHO_QUADRADO); j++)
    {
      for(var i = 0; i < (IMG_WIDTH / TAMANHO_QUADRADO); i++)
      {
        quadro         = new Quadro()
        quadro.id      = count_quadros;
        quadro.strhtml = '<div name="ddiv" style="background: url(../img/alan_turing.png) no-repeat '+(i*TAMANHO_QUADRADO*-1).toString()+'px '+ (j*TAMANHO_QUADRADO*-1).toString()+'px; position: relative;"></div>'
        
        vetor[count_quadros] = quadro;
        count_quadros++;        
      }
    }
    
    for(var i = 0; i < vetor.length; i+=2)
      $("#mural").append(vetor[i].strhtml);
    for(var i = 1; i < vetor.length; i+=2)
      $("#mural").append(vetor[i].strhtml);
    
    total_quadros = (((IMG_HEIGHT / TAMANHO_QUADRADO) * (IMG_WIDTH / TAMANHO_QUADRADO)) / nivel);
  });
  
  $("div[name='ddiv']").click(function(){
    
    AlterarQuadro($(this));
    nivel++;
    total_quadros = 0;
    
    if(Terminou())
    {    
      $('#div_texto').css("display", "block")
      
      $('#div_texto').animate({ opacity: 1,left: '+=50'}, 11000, function() { 
      });
      $('#mural').animate({ opacity: 0.3}, 11000, function() { });
    }
    
  });
});
