// By Neil Carter
Shader "DepthMask" {
    SubShader {
    	Tags { "Queue" = "Background" }
        // Turn off lighting, because it's expensive and the thing is supposed to be
        // invisible anyway.
 
        Lighting Off
 
        // Draw into the depth buffer in the usual way.  This is probably the default,
        // but it doesn't hurt to be explicit.
 
        ZTest LEqual
        ZWrite On
 
        // Don't draw the RGB colour channels, just the alpha channel.  This means
        // that nothing visible is drawn.  Ideally, I would have liked to set ColorMask
        // to draw nothing at all, but it doesn't seem to be possible to say anything
        // like ColorMask None.
 
        ColorMask A
 
        // Do nothing specific in the pass:
 
        Pass {}
    }
}