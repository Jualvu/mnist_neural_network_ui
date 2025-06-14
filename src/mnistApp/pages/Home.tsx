import { ReactSketchCanvas, type ReactSketchCanvasRef } from 'react-sketch-canvas';
import getPixelArray from '../utils/GetPixelArray'
import { useRef, useState } from 'react';
import { sendImageToAPI } from '../services/prediction_api_request';

export const Home = () => {

    const canvasRef = useRef<ReactSketchCanvasRef>(null);
    const [predicted_num, setPredicted_num] = useState();
    const [predicted_confidence, setPredicted_confidence] = useState();
    const [model_to_use, setModel_to_use] = useState('nn_numpy');

    const handleClearClick = () => {
        canvasRef.current?.clearCanvas();
    };

    const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setModel_to_use(event.target.value);
    console.log(event.target.value);
  };

    const makePrediction = async() => {
        const result  = await getPixelArray(canvasRef)

        // create canvas of 28x28 re-scaled image of the canvas 
        const container = document.getElementById("rescaled-image-container");
        if(container && result && result['offCanvas']){
            container.innerHTML = ""; // Remove previous contents
            const canvas = result['offCanvas'];
            canvas.style.width = "300px";  // Scale 10x
            canvas.style.imageRendering = "pixelated"; // Keep sharp blocky look
            canvas.style.border = "1px solid #ccc";    // Optional: add a border
            container?.appendChild(canvas);
        }

        if(result && result['28x28_pixels_data']){

            const response = await sendImageToAPI(result['28x28_pixels_data'], model_to_use);
            
            console.log(response)

            setPredicted_num(response['prediction'])
            setPredicted_confidence(response['confidence'])
            // console.log(JSON.stringify(object))

        }
        // scroll to the top of the page after giving the results, this helps on the mobile web page implementation
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
            
    }

   


  return (

    
    // Whole page div
    <div id='canvas_page_content' className='flex flex-col items-center min-h-screen justify-start bg-black p-6'>

        {/* Div with titles */}
        <div id='title' className='mt-[2%]'>
            <h1 className='text-white text-5xl text-center m-[5%] text-justify leading-relaxed break-words hyphens-auto'>Welcome</h1>
            <h1 className='text-white text-3xl text-center m-[5%] text-justify leading-relaxed break-words hyphens-auto'
            >
                Try out my two personal Neural Networks.
                One trained using just numpy and the other on plain python.
                They were trained on the MNIST dataset to recognize numbers from 0-9.</h1>

                <p className='text-md m-[5%] text-gray-400 text-center mb-4 text-justify leading-relaxed break-words hyphens-auto'>
                    [Drawing factors such as proper centering, consistent size, and clear stroke definition can significantly
                    affect prediction accuracy, since the MNIST dataset assumes these conditions by default.]
                </p>
        </div>

        <div className='flex mb-10'>

            {/* Button to trigger prediction process */}
            <button 
            className='mt-2 mx-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition duration-200'
            onClick={makePrediction}>
                Make Prediction
            </button>

            <select id="model" className='bg-gray-800 mt-2 mx-4 py-2 px-4 text-white rounded-xl'
            onChange={handleModelChange}
            value={model_to_use}
            >
                <option value="nn_numpy">Neural Network with Numpy</option>
                <option value="nn_plain_python">Neural Network plain Python</option>
            </select>
        </div>

        {/* div containing: drawing canvas, 28x28 canvas showcase and result given */}
        <div className='xl:flex md:inline-block xs:inline-block '>


            {/* Div with canvas */}
            <div id='canvas' className='flex flex-col items-center m-10'>

                <h1 className='text-xl text-white text-center mb-10'>Please draw a single number from 0 to 9 here</h1>
                {/* canvas component */}
                {/* <Canvas ref={canvasRef}/>  */}
                <ReactSketchCanvas
                ref={canvasRef}
                width="280px"
                height="280px"
                canvasColor="black"
                strokeColor="white"
                strokeWidth={25}
                />
                {/* Clean canvas button */}
                <button
                className="mt-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition duration-200"
                onClick={handleClearClick}
                >
                    Clean Canvas
                </button>
                

            </div>

            {/* Div with 28x28 re-scaled image */}
            <div className='flex flex-col items-center m-10'>
                <h1 className='text-xl text-white text-center'>28x28 pixel Re-scaled</h1>
                <div id='rescaled-image-container' className='flex flex-col items-center m-10'>
                    {/* temporary canvas to load page */}
                    <canvas id='rescaled-image' className='w-[300px] h-[300px] border border-1px' style={{imageRendering: 'pixelated'}}>
                    </canvas>
                </div>
            </div>


            {/* Div with prediction result */}
            <div id='canvas' className='justify-center m-10'>
                {/* titles */}
                <h1 className='text-3xl text-white text-center'>Results:</h1>
                <h1 className='text-xl text-white text-center'>Predicted result using model: <span className='text-green-500'>{model_to_use}</span></h1>
                {/* predictions: number predicted and confidence */}
                <div id='div_result justify-center m-2'>
                    <h1 id='predicted_num_result' className='text-3xl text-white text-center m-10'> Number: <span className='text-green-500'>{predicted_num} </span></h1>
                    <h1 id='predicted_confidence_result' className='text-3xl text-white text-center m-10'> Confidence: <span className='text-green-500'>{predicted_confidence} %</span> </h1>
                </div>
            </div>

        </div>

        
    </div>
  )
}


export default Home
