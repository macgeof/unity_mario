// Time Tool Component
// Walker Boys (www.walkerboystudio.com)
// March 8, 2011
// Description: Time component for counting up and down. Provides the following functionality
// Counts in days, hours, minutes, seconds, fractions, clock time, numeric count (game time)
// Start time, From Load time, Stop time, Continue time Up, Continue time Down, Reset time, Count Down time, Add Time Once/Multi, Since Startup
// Designed to view and be used in GUISkin, GUILabel, Animated Texture Sheets (number 0-9), Console and Inspector

var aniFont1 : GameObject;								// holds a sprite sheet - should be a number sheet 0-9
var aniFont2 : GameObject;								// holds a sprite sheet - should be a number sheet 0-9
var aniFont3 : GameObject;								// holds a sprite sheet - should be a number sheet 0-9
var aniFont4 : GameObject;								// holds a sprite sheet - should be a number sheet 0-9

var marioGui : GUISkin;									// used for gui text if you want to use a ttf instead of image
var GUIToggle 			: boolean 	= false;			// toggle to show gui text on screen (debug)

var playTime 			: float 	= 0.0;				// playTime is the current time printed to screen - think of it like current game time
var days     			: int   	= 0.0;				// days
var hours    			: int   	= 0.0;				// hours
var minutes  			: int   	= 0.0;				// minutes
var seconds  			: int   	= 0.0;				// seconds
var fraction 			: int   	= 0.0;				// fractions

var startTime      		: float 	= 0.0;				// used to store current start time when pressed
var fromLoadTime   		: float 	= 0.0;				// used to store original load time
var stopTime			: float 	= 0.0;				// used to stop time in game
var continueTimeUp		: float 	= 0.0;				// used to continue time up from stopped time
var continueTimeDown 	: float 	= 0.0;				// used to continue time down from stopped time
var countDownDelay		: float 	= 0.0;				// used to delay time during counting
var countDownAmount		: float 	= 0.0;				// amount to delay each time

var delayTime			: float 	= 0.0;				// hold delayTime
var delayRate	   		: float 	= 0.0;				// hold delayRate
var addToTime    		: float 	= 0.0;				// used to add Time to current playTime
var addTimeAmount		: float 	= 0.0;				// amount to add to Time
var realTime	 		: float 	= 0.0;				// holds real time since start of game regardless of pausing

var playTimeEnabled	  	: boolean 	= false;			// toggle for playTime
var realTimeEnabled  	: boolean 	= false;			// toggle for realTime
var fromLoadTimeEnabled	: boolean 	= false;			// toggle for loadTime
var continueTimeEnabled : boolean 	= false;			// toggle for continueTime
var countDownEnabled    : boolean 	= false;			// toggle for countDown

// This is our 2D Ani Sprite Sheet with minor modifications to work with Time. Define 'type' with: font1, font2, font 3, font 4
function aniSprite ( spriteObject, columnSize, rowSize, colFrameStart, rowFrameStart, totalFrames, type:String)
{
	var index : int = playTime;							// to control frame location, playTime will equal the index count
	
	var font1 = ( index % 10 );							// font1 position
	var font2 = ( ( index - font1 ) / 10 ) % 10;		// font2 position 
	var font3 = ( ( index - font1 ) / 100 ) % 10;		// font3 position
	var font4 = ( ( index - font1 ) / 1000 ) % 10;		// font4 position

	if ( type == "font1" ) index = font1;				// check for which sprite sheet to use - font1
	if ( type == "font2" ) index = font2;				// check for which sprite sheet to use - font2
	if ( type == "font3" ) index = font3;				// check for which sprite sheet to use - font3
	if ( type == "font4" ) index = font4;				// check for which sprite sheet to use - font4
	
	//print ( font4 + "  " + font3 + "  " + font2 + "  " + font1 );	// print to console to see it split the numbers correctly

	var size = Vector2 ( 1.0 / columnSize, 1.0 / rowSize );	// find scale to show on poly 

	var u = index % columnSize;								// u cord separated from v, to find just the column and mod it
	var v = index / columnSize;								// v finds location on row based on columnSize count
	
	var offset = Vector2 ( ( u + colFrameStart ) * size.x, ( 1.0 - size.y ) - ( v + rowFrameStart ) * size.y );	// offset uv's
	
	spriteObject.renderer.material.mainTextureOffset = offset; 	// apply the offset amount to the correct sprite sheet object
	spriteObject.renderer.material.mainTextureScale  = size; 	// apply the scale amount to the correct sprite sheet object

	// Remember if you want additional texture maps, add them here. Example of normal map below
	// spriteObject.renderer.material.SetTextureOffset ("_BumpMap", offset);
	// spriteObject.renderer.material.SetTextureScale  ("_BumpMap", size);
}

function Update ()
{
if (aniFont1 != null) aniSprite ( aniFont1, 10, 1, 0, 0, 10, "font1" );	// animated font sprite - type: font1
if (aniFont2 != null) aniSprite ( aniFont2, 10, 1, 0, 0, 10, "font2" );	// animated font sprite - type: font2
if (aniFont3 != null) aniSprite ( aniFont3, 10, 1, 0, 0, 10, "font3" );	// animated font sprite - type: font3	
if (aniFont4 != null) aniSprite ( aniFont4, 10, 1, 0, 0, 10, "font4" );	// animated font sprite - type: font4

	days     = ( playTime / 86400 ) % 365;				// divide playtime by number of seconds in a day
	hours    = ( playTime / 3600 ) % 24;				// divide playtime by number of seconds in an hour
	minutes  = ( playTime / 60 ) % 60;					// divide playtime by number of seconds in a minute
	seconds  = ( playTime % 60 );						// modulo playtime by number of seconds  
	fraction = ( playTime * 10 ) % 10;					// multiply playtime by 10 and mod of 10

/// part 1 - start time
	if ( playTimeEnabled && !countDownEnabled )			// if playTime standard is enabled use this formula
	    playTime = Time.time - startTime - continueTimeUp + addToTime;	// playTime is current time since start

	if ( Input.GetKeyDown ( "1" ) )						// press to activate startTime
	{
		startTime 		 = Time.time;          			// startTime equals current time (Time.time)
		addToTime 		 = 0;							// reset add time
		continueTimeUp 	 = 0;							// reset continue time
		playTimeEnabled  = true;						// set to true
		countDownEnabled = false;						// reset to false
	}

/// part 2 - from load time
	if ( Input.GetKeyDown ( "2" ) )						// press to activate start of scene time
	{
		fromLoadTime = Time.timeSinceLevelLoad; 		// store current fromLoadTime
		startTime 			= 0;						// reset start time
		addtoTime 			= 0;						// reset add to time
		playTimeEnabled 	= false;					// reset to false
		realTimeEnabled 	= false;					// reset to false
		countDownEnabled 	= false;					// reset to false
		fromLoadTimeEnabled	= true;						// set to true
	}
	if ( fromLoadTimeEnabled && !playTimeEnabled )		// if loadTime is true, enable this one for playTime
	    playTime = Time.timeSinceLevelLoad + addToTime;	// playTime is current time since start

/// part 3 - stop time - stop and game pause
	if ( Input.GetKeyDown ( "3" ) )						// press to activate stop timer
	{
		stopTime 			= playTime;					// hold stop time
		addToTime 			= 0;						// reset add time
		playTimeEnabled 	= false;					// time active set to false
		continueTimeEnabled = false;					// reset to false
		realTimeEnabled 	= false;					// reset to false
		countDownEnabled 	= false;					// reset to false
		fromLoadTimeEnabled	= false;					// reset to false
	}
	if ( Input.GetKeyDown ( "4" ) )						// key down to activate pause game time
	{
		Time.timeScale = 0.0;							// actually scale time to nothing
	}
	else if (Input.GetKeyUp ( "4" ) )					// key up to return time to default
	{
		Time.timeScale = 1.0;							// return time scale to 1
	}

/// part 4 - continue time - continue from stopped time
	if ( Input.GetKeyDown ( "5" ) )						// press to continue playTime
	{
		continueTimeUp   = Time.time - stopTime;		// get playTime start
		startTime 		 = 0;
		addToTime 		 = 0;							// reset add time
		playTimeEnabled  = true;						// start timer again
		countDownEnabled = false;						// reset to false
	}		

/// part 5 - reset time
	if ( Input.GetKeyDown ( "6" ) )						// press to reset playTime
	{
		stopTime 			= 0;						// reset stopTime to zero
		playTime 			= 0;						// reset playTime to zero
		continueTimeUp 		= 0;						// store current to continue for subtracting above
		addToTime    		= 0;
		continueTimeEnabled = false;					// reset to false
		realTimeEnabled 	= false;					// reset to false
		fromLoadTimeEnabled = false;					// reset to false
		countDownEnabled 	= false;					// reset to false
		playTimeEnabled 	= false;					// reset to false
	}	

/// part 6 - count down time (to and from -> simple 'if' statement)
	if ( playTimeEnabled && countDownEnabled )			// if countDown enabled, then use this for playTime
	{
		playTime = countDownDelay - Time.time + countDownAmount + continueTimeDown;	// get playTime start
	}	
	if ( Input.GetKeyDown ( "7" ) )						// press to countdown time
	{
		countDownDelay 	 = Time.time;					// store current time in countDownDelay
		playTimeEnabled  = true;						// start timer again
		countDownEnabled = true;						// start counting down
		addToTime 		 = 0;							// reset add time
		continueTimeDown = 0;							// reset continue time
	}	
	if ( Input.GetKeyDown ( "t" ) )						// count down from current stop time
	{
		continueTimeDown = stopTime - ( countDownDelay - Time.time + countDownAmount );	// get time to continue from
		startTime 		 = 0;							// reset start time 
		addToTime 		 = 0;							// reset add time
		playTimeEnabled  = true;						// start timer again
		countDownEnabled = true;						// reset to false		
	}
	if ( playTime < 0 )									// simple stop for countDown
	{
		playTimeEnabled  = false;						// stop timer - playTime
		countDownEnabled = false;						// stop timer - countDown
	}

/// part 7 - delay time
	if ( playTime > delayTime )							// check for time more than delay
	{
		delayTime = Time.time + delayRate;				// add delay amount (rate) to time for next delay amount
	//	print ("delayed for " + delayRate + " seconds");
	}	

/// part 8 - add to time
	if ( Input.GetKeyDown ( "8" ) )						// press to activate add to timer
	{
		addToTime = addTimeAmount;						// adds single amount to timer
	}
	if ( Input.GetKeyDown ( "9" ) )						// press to activate add to timer
	{
		addToTime += addTimeAmount;						// adds increment amount to timer
	}

/// part 9 - actual time since start of game			// if gamePAUSED, this still keeps actual time
	if ( Input.GetKeyDown ( "0" ) )						// press to activate startTime
	{
		realTime  		    = Time.realtimeSinceStartup;// store real time since startup
		startTime 		    = 0;						// reset start time
		addToTime 		    = 0;						// reset add to time
		playTimeEnabled     = false;					// turn off play time
		realTimeEnabled     = true;						// set real time on
		fromLoadTimeEnabled = false;					// turn off load tim
	}
	if ( realTimeEnabled && !playTimeEnabled && !fromLoadTimeEnabled )		// if real time enabled, use this for playTime
		playTime = Time.realtimeSinceStartup + addToTime;					// playTime is now real time since startup
}

function OnGUI ()                            								// print time variables to the screen (gui)
{
	if ( GUIToggle )														// toggle visibility on/off
	{
		GUILayout.Label ( "PlayTime " + playTime.ToString ( "f4" ) );  		//  display on gui - playtime
		GUILayout.Label ( "1 - Start the Time"   	);						//  display on gui - start time
		GUILayout.Label ( "2 - From Load Time" 		);						//  display on gui - from load time 
		GUILayout.Label ( "3 - Stop Time"    		);						//  display on gui - stop time	
		GUILayout.Label ( "4 - Pause Game Time" 	);						//  display on gui - pause game (scale time)	
		GUILayout.Label ( "5 - Continue Time Up"   	);						//  display on gui - continue time up
		GUILayout.Label ( "T - Continue Time Down" 	);						//  display on gui - continue time down
		GUILayout.Label ( "6 - Reset Time"			);						//  display on gui - reset time
		GUILayout.Label ( "7 - Count Down Time"		);						//  display on gui - count down time
		GUILayout.Label ( "8 - Add to Time Once"	);						//  display on gui - add to time once
		GUILayout.Label ( "9 - Add Time Multi"  	);						//  display on gui - add time multi
		GUILayout.Label ( "0 - Since Startup Time"	);						//  display on gui - since start up time
		GUILayout.Label ( "Days: " 		+ days.ToString 	 ( "f0" ) );  	//  display on gui - days
		GUILayout.Label ( "Hours: " 	+ hours.ToString 	 ( "f0" ) );  	//  display on gui - hours
		GUILayout.Label ( "Minutes: " 	+ minutes.ToString 	 ( "f0" ) );  	//  display on gui - minutes
		GUILayout.Label ( "Seconds: " 	+ seconds.ToString 	 ( "f0" ) );  	//  display on gui - seconds
		GUILayout.Label ( "Fraction: " 	+ fraction.ToString  ( "f0" ) );  	//  display on gui - fraction
		GUILayout.Label ( "Delay Time " + delayTime.ToString ( "f0" ) );	//  display on gui - delay amount time
		
		if (marioGui != null) GUI.skin = marioGui;	// Print current Play Time to the screen with a Gui skin (font from Mario Bros)
		GUI.Label (Rect ( Screen.width / 2, 10, 1000, 100), "" + playTime.ToString("f1"));	// print gui text center on screen
	}
}
