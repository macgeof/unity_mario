// This only works properly if there is no skybox or solid background color visible during the transition
// http://www.unifycommunity.com/wiki/index.php?title=ShapeWipe
// Author: Eric Haines (Eric5h5)

var camera1 				: Camera;
var camera2 				: Camera;
var wipeTime 				: float 		= 2;
var rotateAmount 			: float 		= 1;
private var inProgress  	: boolean 		= false;
private var swap 			: boolean 		= false;
private var activeShape 	: int 			= 0;

enum sizeType { Grow, Shrink }

var shapes : Transform[];

function Start ()
{
	ScreenShapeWipe ( wipeTime, sizeType.Grow   );
}
function Update() 
{
	if ( Input.GetKeyDown ( "o" ) ) { ScreenShapeWipe ( wipeTime, sizeType.Grow   ); }
	if ( Input.GetKeyDown ( "p" ) ) { ScreenShapeWipe ( wipeTime, sizeType.Shrink ); }
}

function ScreenShapeWipe ( wipeTime : float, zoom : sizeType ) 
{
	if ( inProgress ) { return; }
	inProgress = true;
	camera1.gameObject.SetActive(true);
	camera2.gameObject.SetActive(true);
	
	// Swap cameras every other time so multiple transitions in a row will work
	if ( swap ) 
	{
		var c1 = camera2;
		var c2 = camera1;
 	}
	else 
	{
		c1 = camera1;
		c2 = camera2;
	}
	swap = !swap;

	var originalDepth = c2.depth;
	
	// Set camera order depending on whether the transition is shrink or grow
	if ( zoom == sizeType.Shrink ) 
	{
		var originalFlag 	  = c2.clearFlags;
		c2.clearFlags 		  = CameraClearFlags.Depth;
		c2.depth 			  = c1.depth+1;
		var shape : Transform =
			Instantiate(shapes[activeShape], c2.transform.position + c2.transform.forward*(c2.nearClipPlane+.01), c2.transform.rotation);
	}
	else 
	{
		originalFlag 		 = c1.clearFlags;
		c1.clearFlags 		 = CameraClearFlags.Depth;
		c2.depth 			 = c1.depth-1;
		shape = Instantiate(shapes[activeShape], c1.transform.position + c1.transform.forward*(c1.nearClipPlane+.01), c1.transform.rotation);
	}
	
	var originalAngles = shape.eulerAngles;
	
	// Do the wipe
	if (zoom == sizeType.Shrink) 
	{
		for ( i = 1.0; i > 0.0; i -= Time.deltaTime * 1 / wipeTime ) 
		{	
			var j = Mathf.Lerp ( 1.0, 0.0, Mathf.Sin ( ( 1 - i ) * Mathf.PI * 0.5 ) );	// Slow down near the end
			shape.localScale  = Vector3( j, j, j );
			shape.eulerAngles = Vector3 ( originalAngles.x, originalAngles.y, i * 360 * rotateAmount );
			yield;
		}
	}
	else 
	{
		for ( i = 0.0; i < 1.0; i += Time.deltaTime * 1 / wipeTime ) 
		{
			j = Mathf.Lerp ( 1.0, 0.0, Mathf.Sin ( ( 1 - i ) * Mathf.PI * 0.5 ) );	// Start out slower
			shape.localScale  = Vector3 ( j, j, j );
			shape.eulerAngles = Vector3 ( originalAngles.x, originalAngles.y, -i * 360 * rotateAmount );
			yield;
		}	
	}

	// Clean up
	Destroy ( shape.gameObject );
	if ( zoom == sizeType.Shrink ) 
	{
		c2.clearFlags = originalFlag;
	}
	else 
	{
		c1.clearFlags = originalFlag;
	}
	c1.gameObject.SetActive(false);
	c2.depth = originalDepth;
	inProgress = false;
}