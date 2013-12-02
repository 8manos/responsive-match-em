var width, height, maxwidth, maxheight, space, num, entries, seconds, t, resizeTimer, cardwidth, cardheight;
var running = false;
var best = [0,0,0,0,0,0,0,0];
var pics = [];
var cards = [];
var done = [];

$(function(){
	getElNum();

	cloneCards();
	getPics();

	fixLayout();

	setUp();
});

function getElNum()
{
	getSpace();

	num = Math.floor(space / 140);
	if (num == 1){
		num = 2;
	}

	//ahora empieza desde el nivel 3 (o el 2 si es que no caben mas)
	num = Math.min(num, 3);

	setSelectedLevel(num);
}

function getSpace()
{
	width = $('body').width();
	height = $('body').height() - $('header').outerHeight() - $('#play').outerHeight(true);

	//game area top+bottom padding+margin
	var game_area_vspace = parseInt($('#game-area').css('padding-top')) + parseInt($('#game-area').css('padding-bottom')) + parseInt($('#game-area').css('margin-top')) + parseInt($('#game-area').css('margin-bottom'));
	var game_area_hspace = parseInt($('#game-area').css('padding-left')) + parseInt($('#game-area').css('padding-right')) + parseInt($('#game-area').css('margin-left')) + parseInt($('#game-area').css('margin-right'));

	width = width - game_area_hspace;
	height = height - game_area_vspace;

	var max = Math.max(width, height);
	var min = Math.min(width, height);

	space = Math.min(max - 140, min);
}

function setSelectedLevel(num)
{
	$('#levels option').prop('selected', false);
	$('#levels option').eq(num-2).prop('selected', true);
	$('body').removeClass().addClass('level-'+num);
}

function cloneCards()
{
	var total = num*num;
	var $card;
	for (i=1; i<total; i++){
		$card = $('#0').clone();
		$card.attr('id', i);
		$card.appendTo('#cards');
	}
}

function getPics()
{
	entries = Math.floor(num*num/2);

	pics = [
		"img/ooommm/aisha_bamboo.png",
		"img/ooommm/aisha_cobra.png",
		"img/ooommm/aisha_diamante.png",
		"img/ooommm/aisha_elefante.png",
		"img/ooommm/aisha_elefantesentado.png",
		"img/ooommm/aisha_estrella.png",
		"img/ooommm/aisha_lunacreciente.png",
		"img/ooommm/aisha_montana.png",
		"img/ooommm/aisha_oruga.png",
		"img/ooommm/aisha_perro.png",
		"img/ooommm/aisha_pinza.png",
		"img/ooommm/aisha_tabla.png",
		"img/ooommm/aisha_triangulo.png",
		"img/ooommm/dhani_camello.png",
		"img/ooommm/dhani_cobra.png",
		"img/ooommm/dhani_corazon.png",
		"img/ooommm/dhani_estrellademar.png",
		"img/ooommm/dhani_meditaciondelaguita.png",
		"img/ooommm/dhani_montanaconjunta.png",
		"img/ooommm/dhani_namaste.png",
		"img/ooommm/dhani_pez.png",
		"img/ooommm/dhani_rana.png",
		"img/ooommm/dhani_ranitas.png",
		"img/ooommm/dhani_revolviendolaleche.png",
		"img/ooommm/dhani_sanduche.png",
		"img/ooommm/pepe_anaconda.png",
		"img/ooommm/pepe_caiman.png",
		"img/ooommm/pepe_gatoenbalance.png",
		"img/ooommm/pepe_gatoenojado.png",
		"img/ooommm/pepe_gatofeliz.png",
		"img/ooommm/pepe_gatoneutro.png",
		"img/ooommm/pepe_jaguar.png",
		"img/ooommm/pepe_marioneta.png",
		"img/ooommm/pepe_monoguerrero.png",
		"img/ooommm/pepe_montana.png",
		"img/ooommm/pepe_mudra.png",
		"img/ooommm/pepe_namaste.png",
		"img/ooommm/pepe_perro.png",
		"img/ooommm/pepe_perroorinando.png",
		"img/ooommm/pepe_ranaacostada.png",
		"img/ooommm/pepe_torofuerte.png",
		"img/ooommm/willi_camello.png",
		"img/ooommm/willi_caradevaca.png",
		"img/ooommm/willi_diamante.png",
		"img/ooommm/willi_escarabajo.png",
		"img/ooommm/willi_huevocosmico.png",
		"img/ooommm/willi_libro.png",
		"img/ooommm/willi_mariposaw.png",
		"img/ooommm/willi_mariposamonarca.png",
		"img/ooommm/willi_namaste.png",
		"img/ooommm/willi_telefono.png"
	];
	pics.sort( randOrd );

	var preload_imgs = [];
	$.each(pics, function(i, url){
		preload_imgs[i] = new Image();
		preload_imgs[i].src = url;
	});
}

function fixLayout()
{
	$('#cards').height(height).css('min-width', num*105+'px').css('min-height', num*140+'px');

	$('article').width(100/num+'%').height(100/num+'%');

	var max_card_width = $('article').width() - 20;
	var max_card_height = $('article').height() - 20;

	var multip = Math.floor( Math.min((max_card_width / 17), (max_card_height / 24), 10) );

	cardwidth = multip*17;
	cardheight = multip*24;

	$('div:not(#win)').width(cardwidth).height(cardheight);
}

function setCardsArray()
{
	cards = [];
	//lleno el arreglo con los nums de las fotos y lo randomizo
	for (i=0; i<entries; i++){
		cards.push(i);
	}
	cards = cards.concat(cards);
	cards.sort( randOrd );
	//si es impar
	if (num % 2){
		var lo_half = cards.slice(0, entries);
		var hi_half = cards.slice(entries);
		cards = lo_half.concat(['star'], hi_half);
		$('#'+entries).addClass('done');
		//aca le puedo agregar la estrella con css
	}
}

function randOrd()
{
	return (Math.round(Math.random())-0.5);
}

function setUp()
{
	$('#start button').live('click', function(){
		$('#time').html('Tiempo: <span>00:00</span>');
		$('#start').html('<button class="play">Reiniciar</button>');
		running = true;
		seconds = 0;
		clearTimeout(t);
		timer();

		resetBoard();

		$('article:not(.done, .used)').live('click', clickCard);
	});

	$(window).resize(function(e) {
		//si el resize fue generado por el programa, actualiza width, height y space
		getSpace();

		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(finishResize, 999);
	});

	$('#levels select').live('change', function(){
		var rows = $(this).children('option:selected').index()+2;
		newGame(rows);
	});
}

function finishResize()
{
	var new_width = window.innerWidth;
	var new_height = window.innerHeight;

	var new_max = Math.max(new_width, new_height);
	var new_min = Math.min(new_width, new_height);

	var new_space = Math.min(new_max - 140, new_min);

	if (new_space > 0){
		if (running){
			if (new_space < num*140){
				confirmChangeLevel();
			}
		}else{
			if (new_space < num*140 || new_space > (num+1)*140){
				newGame('auto');
			}
		}
	}
};

function confirmChangeLevel()
{
	var new_game = confirm('Tu pantalla ahora es mas pequeña, quieres intentar con menos cartas?');
	if (new_game == true){
		newGame('auto');
	}
}

function newGame(rows)
{
	if (rows == 'auto'){
		getElNum();
	}else{
		//ponemos los elementos necesarios unicamente
		num = rows;
		setSelectedLevel(num);
	}

	deleteCards();
	cloneCards();
	getPics();

	fixLayout();

	resetStart();
	setBest();

	if (rows != 'auto'){
		//cambiamos el tamaño de la ventana si se deja
		var new_width = (max_width > max_height)? 105*(rows+1) : 105*rows;
		var new_height = (max_width > max_height)? 140*rows : 140*(rows+1);
		var toolbar = window.outerHeight + 16 - window.innerHeight;
		window.resizeTo(new_width+24, new_height+toolbar);
	}
}

function deleteCards()
{
	$('#cards, div').css('background', '');
	$('article:not(#0)').remove();
	$('#0').removeClass('done used hold');
}

function timer()
{
	t = setTimeout("timer()",1000);

	var minutes = Math.floor(seconds/60);
	var secs = seconds%60;

	minutes = ( minutes < 10 ? "0" : "" ) + minutes;
	secs = ( secs < 10 ? "0" : "" ) + secs;

	$('#time span').text(minutes+':'+secs);

	seconds = seconds+1;
}

function resetBoard()
{
	$('#cards, div').css('background', '');
	$('article').removeClass('done used hold');
	$('div:not(#win)').width(cardwidth).height(cardheight).fadeIn();

	done = [];
	setCardsArray();

	$("article:not(.done, .used)").die('click', clickCard);
}

function clickCard()
{
	var $used_cards = $(this).siblings('.used');

	if ($used_cards.length < 2){
		//destapamos la carta
		var index = $(this).index();
		var pic_id = cards[index];
		flip($(this), pic_id);

		//si ya había otra destapada
		if ($used_cards.length == 1){
			var used_index = $used_cards.index();

			$.merge($used_cards, $(this));
			$('article').not($used_cards).addClass('hold');

			//si son iguales modifico las clases y listo
			if (pic_id == cards[used_index]){
				animateMatch($used_cards);
				setTimeout(function(){
					cardsMatch($used_cards, pic_id);
				}, 400);
			//si son diferentes espero 1 segundo y las daño jejeje
			}else{
				setTimeout(function(){
					unflip($used_cards)
				}, 999);
			}
		}
	}
}

function flip($card, pic_id)
{
	$card.addClass('used');
	$card.children().addClass('flipped').width(0);

	setTimeout(function(){
		$card.children().css('backgroundImage', 'url('+pics[pic_id]+')').css('backgroundRepeat', 'no-repeat').removeClass('flipped').width(cardwidth);
	}, 200);
}

function animateMatch($cards)
{
	$cards.children().delay(400).animate({width: cardwidth+20, height: cardheight+20}, 200).animate({width: cardwidth, height: cardheight}, 200);
}

function cardsMatch($used_cards, pic_id)
{
	$used_cards.removeClass('used').addClass('done');
	$('article').removeClass('hold');
	done.push(pic_id);
	checkFinish();
}

function checkFinish()
{
	if (done.length == entries){
		$('div').fadeOut();
		$('#win').fadeIn().delay(1888).fadeOut();

		if (best[num-2] == 0 || best[num-2] >= seconds){
			best[num-2] = seconds-1;
			$('#best span').remove();
			$('#time span').clone().appendTo($('#best'));
			$('#best').slideDown();
		}

		resetStart();
	}
}

function resetStart()
{
	running = false;
	clearTimeout(t);

	$('#start').html('<button class="play">Iniciar</button>');

	$("article:not(.done, .used)").die('click', clickCard);
}

function setBest()
{
	var level_best = best[num-2];
	if (level_best == 0){
		$('#best span').text('');
	}else{
		var minutes = Math.floor(level_best/60);
		var secs = level_best%60;

		minutes = ( minutes < 10 ? "0" : "" ) + minutes;
		secs = ( secs < 10 ? "0" : "" ) + secs;

		$('#best span').text(minutes+':'+secs);
	}
}

function unflip($cards)
{
	$('article').removeClass('hold');
	$cards.children().addClass('flipped');
	setTimeout(function(){
		$cards.children().css('backgroundImage', '').css('backgroundRepeat', 'repeat').removeClass('flipped');
		$cards.removeClass('used');
	}, 200);
}
