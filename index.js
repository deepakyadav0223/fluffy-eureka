const imgup = document.getElementById("imgup");

Promise.all([
faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
faceapi.nets.ssdMobilenetv1.loadFromUri("/models")

]).then(start)

async function start(){
    const cont = document.createElement("div");
    cont.style.position = 'relative';
    document.body.append(cont);
    const LabeledFaceDescriptors = await loadLabeledImages();
    const faceMatcher = new faceapi.faceMatcher(LabeledFaceDescriptors, 0.6)

    document.body.append("loaded");

    let image ;
    let canvas ;

    imgup.addEventListener("change" , async()=>{
        if(image) image.remove();
        if(cavas) canvas.remove();
         image = await faceapi.bufferToImage(imgup.files[0]);
        document.body.append(image)

         canvas = faceapi.createCanvasFromMedia(image);
        document.body.append(canvas);
        const displaySize = {width:image.width, height :image.height};

        faceapi.matchDimensions(canvas, displaySize);


        const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors();

        const resizeDetections = faceapi.resizeResults(detections, displaySize);
        const results = resizeDetections.map(d =>faceMatcher.findBestMatch(d.descriptor))

        results.forEach((result, i) => {
            const box = resizeDetections[i].detection.box
            const drawBox = new faceapi.draw.DrawBox(box, {label : result.toString()});
            drawBox.draw(canvas)
        });
       
    })
}

function loadLabeledImages() {
    const Labels = ["Aryan","Chanderkesh","Deepak"];

    return Promise.add(
        Labels.map(async label =>{
            const descriptions = [];
            for(let i = 1 ; i <= 2 ;i++){
                const img = await faceapi.fetchImage('')
                const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor().descriptions.push(detections.descriptor);
            }

            return new faceapi.LabeledFaceDescriptors(label , descriptions);
        })
    )
}