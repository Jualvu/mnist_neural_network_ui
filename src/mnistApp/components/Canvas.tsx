import { forwardRef, useImperativeHandle, useRef } from "react";
import { ReactSketchCanvas, type ReactSketchCanvasRef } from "react-sketch-canvas";

export const Canvas = forwardRef<ReactSketchCanvasRef>((_, canvasRef) => {
  const internalRef = useRef<ReactSketchCanvasRef>(null);

  // Expose internalRef to parent via canvasRef
  useImperativeHandle(canvasRef, () => internalRef.current as ReactSketchCanvasRef);

  const handleClearClick = () => {
    internalRef.current?.clearCanvas();
  };

  return (
    <>
        <ReactSketchCanvas
        ref={internalRef}
        width="100%"
        height="400px"
        canvasColor="#bababa"
        strokeColor="black"
        strokeWidth={20}
        />
        <button
        className="mt-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition duration-200"
        onClick={handleClearClick}
        >
            Clean Canvas
        </button>
    </>
        
  );
});

export default Canvas;
