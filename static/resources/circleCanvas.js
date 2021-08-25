function createCanvasMaterial(color, size) {
	var size = 512;

	// create canvas
	canvas = document.createElement( 'canvas' );
	canvas.width = size;
	canvas.height = size;

	// get context
	var context = canvas.getContext( '2d' );

	// draw gradient
	context.rect( 0, 0, size, size );
	var gradient = context.createLinearGradient( 0, 0, size, size );
	gradient.addColorStop(0, '#806222'); // light blue 
	gradient.addColorStop(1, '#ebcd8f'); // dark blue
	context.fillStyle = gradient;
	context.fill();

	return canvas;
  }