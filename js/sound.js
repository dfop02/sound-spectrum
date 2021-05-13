let angle = Math.random() * 360;
const angleDlt = 60;
const step = 0.004;

window.onload = function() {
  var file  = document.getElementById("file");
  var audio = document.getElementById("audio");

  file.onchange = function() {
    var files = this.files;
    audio.src = URL.createObjectURL(files[0]);
    audio.load();
    audio.play();

    audio.style.display = 'block'
    audio.classList.add('playing');

    var context  = new AudioContext();
    var src      = context.createMediaElementSource(audio);
    var analyser = context.createAnalyser();

    var canvas    = document.getElementById('canvas');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    var ctx       = canvas.getContext('2d');

    canvas.style.display = 'block';

    src.connect(analyser);
    analyser.connect(context.destination);

    analyser.fftSize = 1024;

    var bufferLength = analyser.frequencyBinCount;
    console.log(bufferLength);

    var dataArray = new Uint8Array(bufferLength);

    var WIDTH  = canvas.width;
    var HEIGHT = canvas.height;

    var barWidth = (WIDTH / bufferLength) * 2.5;
    var barHeight;
    var x = 0;

    function createGradient() {
      var gr = ctx.createLinearGradient(0, 0, WIDTH, 0);
      gr.addColorStop(0,   `hsl(${(angle % 360)}, 100%, 50%)`);
      gr.addColorStop(0.5, `hsl(${((angle + (angleDlt/2)) % 360)}, 100%, 50%)`);
      gr.addColorStop(1,   `hsl(${((angle + angleDlt) % 360)}, 100%, 50%)`);
      ctx.fillStyle = gr;
      angle += step;
    }

    function renderFrame() {
      requestAnimationFrame(renderFrame);

      x = 0;

      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      for (var i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];

        // var r = barHeight + (25 * (i/bufferLength));
        // var g = 250 * (i/bufferLength);
        // var b = 50;

        // var r = i * barHeight + (50 * (i/bufferLength));
        // var g = barHeight * (i/bufferLength);
        // var b = barHeight * (i/bufferLength);

        // ctx.fillStyle = `rgb(${r},${g},${b})`;
        createGradient();
        ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    }

    audio.play();
    renderFrame();
  };
};
