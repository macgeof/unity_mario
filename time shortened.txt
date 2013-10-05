// Time Tool Component - Just the Countdown
// Walker Boys (www.walkerboystudio.com)
// March 8, 2011
// Description: Time component for counting up and down. Provides the following functionality
// Counts in days, hours, minutes, seconds, fractions, clock time, numeric count (game time)
// Start time, From Load time, Stop time, Continue time Up, Continue time Down, Reset time, Count Down time, Add Time Once/Multi, Since Startup
// Designed to view and be used in GUISkin, GUILabel, Animated Texture Sheets (number 0-9), Console and Inspector

var aniFont1 			: GameObject;					// holds a sprite sheet - should be a number sheet 0-9
var aniFont2 			: GameObject;					// holds a sprite sheet - should be a number sheet 0-9
var aniFont3 			: GameObject;					// holds a sprite sheet - should be a number sheet 0-9

var playTime 			: float 	= 0.0;				// playTime is the current time printed to screen - think of it like current game time
var continueTimeDown 	: float 	= 0.0;				// used to continue time down from stopped time
var countDownDelay		: float 	= 0.0;				// used to delay time during counting
var countDownAmount		: float 	= 150;				// amount to delay each time

var playTimeEnabled	  	: boolean 	= true;				// toggle for playTime
var countDownEnabled    : boolean 	= true;				// toggle for countDown

function aniSprite ( spriteObject, columnSize, rowSize, colFrameStart, rowFrameStart, totalFrames, type:String)
{
	var index : int = playTime;							// to control frame location, playTime will equal the index count
	
	var font1 = ( index % 10 );							// font1 position
	var font2 = ( ( index - font1 ) / 10 ) % 10;		// font2 position 
	var font3 = ( ( index - font1 ) / 100 ) % 10;		// font3 position

	if ( type == "font1" ) index = font1;				// check for which sprite sheet to use - font1
	if ( type == "font2" ) index = font2;				// check for which sprite sheet to use - font2
	if ( type == "font3" ) index = font3;				// check for which sprite sheet to use - font3
	
	var size = Vector2 ( 1.0 / columnSize, 1.0 / rowSize );	// find scale to show on poly 

	var u = index % columnSize;								// u cord separated from v, to find just the column and mod it
	var v = index / columnSize;								// v finds location on row based on columnSize count
	
	var offset = Vector2 ( ( u + colFrameStart ) * size.x, ( 1.0 - size.y ) - ( v + rowFrameStart ) * size.y );	// offset uv's
	
	spriteObject.renderer.material.mainTextureOffset = offset; 	// apply the offset amount to the correct sprite sheet object
	spriteObject.renderer.material.mainTextureScale  = size; 	// apply the scale amount to the correct sprite sheet object
}
function Update ()
{
	if (aniFont1 != null) aniSprite ( aniFont1, 10, 1, 0, 0, 10, "font1" );	// animated font sprite - type: font1
	if (aniFont2 != null) aniSprite ( aniFont2, 10, 1, 0, 0, 10, "font2" );	// animated font sprite - type: font2
	if (aniFont3 != null) aniSprite ( aniFont3, 10, 1, 0, 0, 10, "font3" );	// animated font sprite - type: font3	

	if ( playTimeEnabled && countDownEnabled )			// if countDown enabled, then use this for playTime
	{
		playTime = countDownDelay - Time.time + countDownAmount + continueTimeDown;	// get playTime start
	}	
	if ( playTime <= 0 )								// simple stop for countDown
	{
		playTimeEnabled  = false;						// stop timer - playTime
		countDownEnabled = false;						// stop timer - countDown
	}
}
