/***Creates the visualizer***/
window.onload = () => {

   let file = document.getElementById("audioFile");
   let audio = document.getElementById("audio");

   let videoFile = document.getElementById("videoFile");
   let videoPlayer = document.getElementById("videoPlayer");

   videoFile.onchange = function() {
    let files = this.files;
    videoPlayer.src = URL.createObjectURL(files[0]);
    videoPlayer.load();
    videoPlayer.play();
   }

    file.onchange = function() {
       let files = this.files;
       audio.src = URL.createObjectURL(files[0]);
       audio.load();
       audio.play();
       let context = new AudioContext();
       let src = context.createMediaElementSource(audio);
       let analyser = context.createAnalyser();

       let canvas = document.getElementById("canvas");
       canvas.width = window.innerWidth;
       canvas.height = window.innerHeight;
       let ctx = canvas.getContext("2d");

       src.connect(analyser);
       analyser.connect(context.destination);

       analyser.fftSize = 256;

       let bufferLength = analyser.frequencyBinCount;

       let dataArray = new Uint8Array(bufferLength);

       let WIDTH = canvas.width;
       let HEIGHT = canvas.height;

       let barWidth = (WIDTH / bufferLength) * 2.5;
       let barHeight;
       let x = 0;

        function renderFrame() {
           requestAnimationFrame(renderFrame);

           x = 0;

           analyser.getByteFrequencyData(dataArray);

           ctx.fillStyle = "#000";
           ctx.fillRect(0, 0, WIDTH, HEIGHT);

            for (let i = 0; i < bufferLength; i++) {
             barHeight = dataArray[i];

             let r = i;
             let g = 255;
             let b = i;

             ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
             ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

             x += barWidth + 1;
          }
        }

      audio.play();
      renderFrame();
    };
};
