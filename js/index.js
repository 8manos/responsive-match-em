var width, height, space, level, entries, seconds, t, resizeTimer, cardwidth, cardheight;
var running = false;
var best = [0,0,0,0,0,0,0,0];
var pics = [];
var cards = [];
var done = [];
var levels = [
	{total: 4, rows: 1, cols: 4},
	{total: 6, rows: 2, cols: 3},
	{total: 8, rows: 2, cols: 4},
	{total: 12, rows: 3, cols: 4},
	{total: 16, rows: 2, cols: 8},
	{total: 20, rows: 4, cols: 5},
	{total: 24, rows: 4, cols: 6},
	{total: 32, rows: 4, cols: 8}
];

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

	level = Math.floor(space / 140);//140 es el alto mínimo de las cartas

	//ahora empieza desde el nivel 1 siempre
	level = 1;

	setSelectedLevel(level);
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

	space = Math.min(max, min);

	console.log('space: ', space);
}

function setSelectedLevel(level)
{
	$('#levels option').prop('selected', false);
	$('#levels option').eq(level-1).prop('selected', true);
	$('body').removeClass().addClass('level-'+level);
}

function cloneCards()
{
	var total = levels[level-1].total;
	var $card;
	for (i=1; i<total; i++){
		$card = $('#0').clone();
		$card.attr('id', i);
		$card.appendTo('#cards');
	}
}

function getPics()
{
	entries = Math.floor(levels[level-1].total/2);

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
	$('#cards').height(height).width(width);
	var rows = levels[level-1].rows;
	var cols = levels[level-1].cols;

	$('article').width(100/cols+'%').height(100/rows+'%');

	var max_card_width = $('article').width() - 10;
	var max_card_height = $('article').height() - 10;

	var multip = Math.floor( Math.min((max_card_width / 17), (max_card_height / 24), 10) );

	cardwidth = multip*17;
	cardheight = multip*24;

	$('.card').width(cardwidth).height(cardheight);
}

function setCardsArray()
{
	cards = [];
	//lleno el arreglo con los levels de las fotos y lo randomizo
	for (i=0; i<entries; i++){
		cards.push(i);
	}

	//dos cartas de cada motivo, para hacer las parejas
	cards = cards.concat(cards);
	cards.sort( randOrd );
}

function randOrd()
{
	return (Math.round(Math.random())-0.5);
}

function setUp()
{
	$('#start button').live('click', function(){
		$('#time').html('Tiempo: <span>00:00</span>');
		$('#start').html('<button class="restart">Reiniciar</button>');
		running = true;
		seconds = 0;
		clearTimeout(t);
		timer();

		resetBoard();

		$('article:not(.done, .used)').live('click', clickCard);
	});

	$(window).resize(function(e) {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(finishResize, 999);
	});

	$('#levels select').live('change', function(){
		level = $(this).children('option:selected').index()+1;
		newGame(level);
	});
}

function finishResize()
{
	getSpace();
};

function newGame(level)
{
	setSelectedLevel(level);

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
	$('.card').width(cardwidth).height(cardheight).fadeIn();

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

		if (best[level-1] == 0 || best[level-1] >= seconds){
			best[level-1] = seconds-1;
			$('#best span').remove();
			$('#time span').clone().appendTo($('#best'));
			$('#best').slideDown();
		}

		resetStart();
		enableNext();
	}
}

function resetStart()
{
	running = false;
	clearTimeout(t);

	$('#start').html('<button>Iniciar</button>');

	$("article:not(.done, .used)").die('click', clickCard);
}

function enableNext()
{
	$('#levels option').eq(level).prop('disabled', false);
}

function setBest()
{
	var level_best = best[level-1];
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
