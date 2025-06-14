import type { ReactSketchCanvasRef } from "react-sketch-canvas";

type image_export_type = {
  "offCanvas": HTMLCanvasElement | null,
  "28x28_pixels_data" : number[] | null
}

const getPixelArray = async (canvasRef: React.RefObject<ReactSketchCanvasRef | null>) => {
  //check if canvasRef is valid
  if(!canvasRef.current) {
    console.log('canvas.current is null')
    return;
  }
  // call exportImage method from react-sketch-canvas library to extract a .png image of the canvas
  const base64 = await canvasRef.current?.exportImage("png");

  // create result object
  const result: image_export_type = {
    "offCanvas": null,
    "28x28_pixels_data" : null
  };

  // promise to convert the .png image to a canvas of 28x28 pixels
  return new Promise<image_export_type>((resolve) => {
    const img = new Image();
    img.src = base64!;
    img.onload = () => {
      // Create hidden canvas
      const offCanvas = document.createElement("canvas");
      const ctx = offCanvas.getContext("2d")!;
      offCanvas.width = 28;
      offCanvas.height = 28;
      result['offCanvas'] = offCanvas; // define offCanvas on the result object
      
      // Draw scaled down image
      ctx.drawImage(img, 0, 0, 28, 28);

      // Get image data
      const imageData = ctx.getImageData(0, 0, 28, 28).data;

      // Create the 784 array of pixel color values
      const pixels: number[] = [];
      for (let y = 0; y < 28; y++) {
        for (let x = 0; x < 28; x++) {
          const index = (y * 28 + x) * 4;
          const r = imageData[index];     // red
          const g = imageData[index + 1]; // green
          const b = imageData[index + 2]; // blue

          // Convert to grayscale (simple average)
          const grayscale = (r + g + b) / 3;

          // Optionally normalize (0-1 or 0-255)
          pixels.push(grayscale); // invert if background is black
        }
      }
      
      result['28x28_pixels_data'] = pixels; // add 28x28 pixels data to the result
      resolve(result);
    };

  });
};


export default getPixelArray