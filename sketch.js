// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
LSTM Generator example with p5.js
This uses a pre-trained model on a corpus of Virginia Woolf
For more models see: https://github.com/ml5js/ml5-data-and-training/tree/master/models/charRNN
=== */
let input1;
let charRNN,charRNN2;
let textInput;
// let lengthSlider;
let tempSlider;
//let sound;
let button;
let runningInference = false;
let foo;
let myRec = new p5.SpeechRec('en-US', parseResult); // new P5.SpeechRec object
myRec.continuous = true; // do continuous recognition
myRec.interimResults = true; // allow partial recognition (faster, less accurate)const url = 'http://localhost:8004/query';
//let result;

// function preload() {
// sound = loadSound('bass.mp3');
// }

document.addEventListener("DOMContentLoaded", () => {
  foo = new p5.Speech();
})

function showResult()
	{
		if(myRec.resultValue==true) {
      document.getElementById("textInput").value =myRec.resultString;

			// background(192, 255, 192);
			// text(myRec.resultString, width/2, height/2);
			console.log(myRec.resultString);
		}
	}

function setup() {
  noCanvas();
  // sound.loop();
  // sound.amp(0.1);

  // RENAME THE BELOW TO YOUR MODEL PATH
  //charRNN = ml5.charRNN('./models/friends/', modelReady);
  charRNN2 = ml5.charRNN('./models/woolf/', modelReady);

  // Grab the DOM elements
  textInput = select('#textInput');
  // lengthSlider = select('#lenSlider');
  // tempSlider = select('#tempSlider');
  button = select('#generate');

  // DOM element events
  button.mousePressed(generate);
  // lengthSlider.input(updateSliders);
  // tempSlider.input(updateSliders);
  myRec.onResult = showResult;
		myRec.start();

 // lengthSlider.value(200);

//  select('#length').html(200);
//   select('#temperature').html(0.5);
}

function parseResult()
	{
		// recognition system will often append words into phrases.
		// so hack here is to only use the last word:
		var mostrecentword = myRec.resultString.split(' ').pop();
		console.log(mostrecentword);
	}

//Update the slider values
// function updateSliders() {
//   select('#length').html(lengthSlider.value());
//   select('#temperature').html(tempSlider.value());
// }

function modelReady() {
  select('#status').html('Model Loaded');
}

var myText = ''

// Generate new text
function generate(existingText) {
  // prevent starting inference if we've already started another instance
  // TODO: is there better JS way of doing this?
 if(!runningInference) {
    runningInference = true;

    // Update the status log
    select('#status').html('Generating...');

    // Grab the original text
    let txt;

    if (existingText) {
      txt = existingText;
    } else {
      let original = textInput.value();
      // Make it to lower case
      txt = original.toLowerCase();
    }

    console.log('generating text with seed: ', txt);
    // Check if there's something to send
    if (txt.length > 0) {
      // This is what the LSTM generator needs
      // Seed text, temperature, length to outputs
      // TODO: What are the defaults?
      let data = {
        seed: txt,
        length:500,
        temperature:0.5
      };

      // Generate text with the charRNN
      charRNN2.generate(data, gotData);
      //charRNN.generate(data, gotData);

      // When it's done
      function gotData(err, result) {
        if (err) {
          console.error(err);
        }
        if (result) {
          // Update the status log
          select('#status').html('Ready!');
          //select('#result').html(txt + result.sample);
          select('#original').html(txt);
          myText += result.sample;
          select('#result').html(myText);
          textInput = select('#textInput');
          textInput.value(txt + result.sample);
          foo.speak(result.sample); // say something
          runningInference = false;
          // text2Image();

          const lastCharacters = result.sample.substr(result.sample.length - 50);
          generate(lastCharacters);
        }
      }
    }
  }
}
// function text2Image() {
//   const postData = {
//     "caption": textInput.value()
//   };
//   // Send HTTP Post request to Runway with text, runway will return the output image src
//   httpPost(url, 'json', postData, (output) => {
//     if (output &&  output.result) {
//       createImg(output.result);
//     }
//   })
// }
