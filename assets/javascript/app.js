var subject;
var limit = '&limit=10';
var apiKey = '&api_key=dc6zaTOxFJmzC';
var queryUrl;
var respCol;
var i;
var j;
var hasRating;
var displaySubject;
var showButtons;
var gifThumbHeight;
var gifThumbHeightNum;
var imgHeightArr = [];
var state;
var gifClass;
var newButton;
var searchVal;
var artists = [
	'Chance the Rapper',
	'Francis and the Lights',
	'Drake',
	'Young the Giant',
	'DJ Khaled',
	'Gary Clark Jr',
	'Local Natives',
	'Bon Iver',
	'Radiohead',
	'Chairlift',
	'Disclosure',
	'Sylvan Esso'
], j;

function displayButtons() {
	for(j = 0; j < artists.length; j++) {
		showButtons = $('<div class="col col-xs-2 col-btn"><button class="btn btn-default btn-gif" data-subject="' + artists[j] + '"><span>' + artists[j] + '</span></button></div>');
		$('.row-btn').append(showButtons);
	}

}

function ajaxQuery() {
	$('.row-gif').empty();
	if($('#search').val() == 'Search') {
		subject = $(this).attr('data-subject');
	} else {
		subject = $('#search').val();
	}
	queryUrl = ('https://api.giphy.com/v1/gifs/search?q=' + subject + limit + apiKey);
	console.log(queryUrl); // left in console to see why some GIFs were not moving

	$.ajax({
		url: queryUrl,
		method: 'GET'})
	.done(function(response) {
		console.log(response);
		$('.col-gif').css({'height': ''});
		imgHeightArr = [];

		for(i = 0; i < response.data.length; i++) {

			imgHeightArr.push(response.data[i].images.original.height/response.data[i].images.original.width);

			var respCol = $('<div class="col col-xs-3 col-gif"><img class="gif-thumb" alt="" src="' +
				response.data[i].images.original_still.url
				+ '" data-state="still" data-animate="' +
				response.data[i].images.original.url
				+ '" data-still="' +
				response.data[i].images.original_still.url
				+ '" /><br /></div>');

			$('.gif-thumb').on('load', imgHeight);
			hasRating = response.data[i].rating.toUpperCase();
			if(response.data[i].rating === '') {
				respCol.append('<span>Rating: NR</span>');
			} else {
				respCol.append('<span>Rating: ' + hasRating + '</span>');
			}
			$('.row-gif').append(respCol);
    	}
			$('.gif-thumb').on('click', gifClick);

	});

}
function newButton(event) {
	searchVal = $('#search').val().trim();
		$('#search').blur(); //added .blur to remove focus, not sure if this is needed
		newBtn = $('<div class="col col-xs-2 col-btn"><button class="btn btn-default btn-gif" data-subject="' + searchVal + '"><span>' + searchVal + '</span></button></div>');
		$('.row-btn').append(newBtn);
		ajaxQuery();
	$('#search').val('Search');
		searchFocus();
	$('.btn-gif').click(ajaxQuery);

}
function searchFocus(){
	$('#search').focus(function() {
		if((($('#search').attr('value')) || ($('#search').val()))  == 'Search') {
			$('#search').attr('value', '');
			$('#search').val('');
		}
	});
	$('#search').blur(function() {
		if((($('#search').attr('value')) || ($('#search').val()))  == '') {
			$('#search').attr('value', 'Search');
			$('#search').val('Search');
		}
	});
}
function gifClick(event) { //found using event.target is making "most GIFs" stop/start animating.  I used the below If/Else statement from the 4-pausing-gifs-students.html class activity
	state = $(event.target).attr('data-state');
	if (state == 'still'){
        $(event.target).attr('src', $(event.target).data('animate'));
        $(event.target).attr('data-state', 'animate');
    } else {
        $(event.target).attr('src', $(event.target).data('still'));
        $(event.target).attr('data-state', 'still');
    }
}

function imgHeight() { //using to format images
	imgHeightArr.sort(function(a, b) {
		return b - a;
	});
	imgWidth = $('.gif-thumb').width();
	newImgHeight = imgHeightArr[0] * imgWidth;
	$('.col-gif').css({'height': 'calc(' + newImgHeight + 'px + 15px + 1.5em)'});
}




$(document).ready(function() {
	searchFocus();
	displayButtons();
	$('.btn-search').click(newButton);
	$('.btn-gif').click(ajaxQuery);

	$(document).keypress(function(e) {
		if(e.which === 13) {
			newButton();
		}
	});

	$(window).on('resize', imgHeight);


});
