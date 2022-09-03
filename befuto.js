let Photo = function() {
    // The width and height of the captured photo. We will set the
    // width to the value defined here, but the height will be
    // calculated based on the aspect ratio of the input stream.
  
    const width = 320; // We will scale the photo width to this
    let height = 0; // This will be computed based on the input stream
  
    // |streaming| indicates whether or not we're currently streaming
    // video from the camera. Obviously, we start at false.
  
    let streaming = false;
  
    // The various HTML elements we need to configure or control. These
    // will be set by the startup() function.
  
    let video = null;
    let canvas = null;
    let photo = null;
    let startbutton = null;
  
     showViewLiveResultButton=() => {
         if (window.self !== window.top) {
             // Ensure that if our document is in a frame, we get the user
             // to first open it in its own tab or window. Otherwise, it
             // won't be able to request permission for camera access.
             document.querySelector(".contentarea").remove();
             const button = document.createElement("button");
             button.textContent = "View live result of the example code above";
             document.body.append(button);
             button.addEventListener('click', () => window.open(location.href));
             return true;
         }
         return false;
     }
  
    startup = () => {
      if (showViewLiveResultButton()) { return; }
      video = document.getElementById('video');
      canvas = document.getElementById('canvas');
      photo = document.getElementById('photo');
      startbutton = document.getElementById('startbutton');
  
      navigator.mediaDevices.getUserMedia(
        { video: {
            facingMode: 'environment'
        }, audio: false })
        .then((stream) => {
          video.srcObject = stream;
          video.play();
        })
        .catch((err) => {
          console.error(`An error occurred: ${err}`);
        });
  
      video.addEventListener('canplay', (ev) => {
        if (!streaming) {
          height = video.videoHeight / (video.videoWidth/width);
  
          // Firefox currently has a bug where the height can't be read from
          // the video, so we will make assumptions if this happens.
  
          if (isNaN(height)) {
            height = width / (4/3);
          }
  
          video.setAttribute('width', width);
          video.setAttribute('height', height);
          canvas.setAttribute('width', width);
          canvas.setAttribute('height', height);
          streaming = true;
        }
      }, false);
  
      // startbutton.addEventListener('click', (ev) => {
      //   takepicture();
      //   ev.preventDefault();
      // }, false);
  
      clearphoto();
    }
  
    // Fill the photo with an indication that none has been
    // captured.
  
    clearphoto = () =>  {
      const context = canvas.getContext('2d');
      context.fillStyle = "#AAA";
      context.fillRect(0, 0, canvas.width, canvas.height);
  
      const data = canvas.toDataURL('image/png');
      photo.setAttribute('src', data);
    }
  
    // Capture a photo by fetching the current contents of the video
    // and drawing it into a canvas, then converting that to a PNG
    // format data URL. By drawing it on an offscreen canvas and then
    // drawing that to the screen, we can change its size and/or apply
    // other changes before drawing it.
  
    this.takepicture = () => {
      const context = canvas.getContext('2d');
      var data = null;
      if (width && height) {
        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);
  
        data = canvas.toDataURL('image/png');

        video.classList.add('flash')
        setTimeout(() => {
            video.classList.remove('flash');
        }, 500);
        //photo.setAttribute('src', data);
      } else {
        clearphoto();
      }
      return data;
    }
  
    // Set up our event listener to run the startup process
    // once loading is complete.
    window.addEventListener('load', startup, false);
    

  };

let photo = new Photo()


let versenyzok = [
    { nev: "Nyúl Béla" },
    { nev: "Csiga Csaba" },
    { nev: "Ravaszdi Róka" },
    { nev: "Papesz Gyurka" },
    { nev: "Lusta Lajhár" },
    { nev: "Okoska Kos" },
    { nev: "Tere Fere" },
    { nev: "Bölöm Bika" },
    { nev: "Okoska Kalaposka" },
    { nev: "Okoska Leveske" },

];
let kozeledik = []
let befutott = []

window.addEventListener('load', (e) => {
  refreshVersenyzok()
  const kereso = document.getElementById('kereso')
    
  kereso.addEventListener('keyup', (event) => {
      if(event.key === "Escape") {
        kereso.value = ''
      }
      refreshVersenyzok()
    })
  
  document.getElementById('kereso-torles').addEventListener('click', (event) => {
      kereso.value = ''
      kereso.dispatchEvent(new Event('keyup'))
    })
    
});


function refreshVersenyzok() {
    let versenyzokElement = document.getElementById('versenyzok');
    versenyzokElement.textContent = ''
    const filterText = document.getElementById('kereso').value
    const filtered = versenyzok.filter(
      (v) => v.nev.toLowerCase().indexOf(filterText.toLowerCase())>=0
      )
    for (const v of filtered) {
        let ve = document.getElementById('versenyzoSablon').content.cloneNode(true);
        ve.firstChild.childNodes[0].textContent = v.nev;
        ve.firstChild.childNodes[1].addEventListener('click', (event) => {
            let ve = event.target.parentNode
            kozeledik.push(v)
            versenyzok.splice(versenyzok.indexOf(v),1)
            refreshKozeledok();
            refreshVersenyzok();
        });
        versenyzokElement.appendChild(ve)
    }

}
function refreshKozeledok() {
    let kozeledikElement = document.getElementById('kozeledik')
    kozeledikElement.textContent=''
    for (const v of kozeledik) {
        let ve = document.getElementById('kozeledoSablon').content.cloneNode(true);
        ve.firstChild.childNodes[0].textContent = v.nev;
        ve.firstChild.childNodes[1].addEventListener('click', (event) => {
            event.preventDefault()
            kozeledik.splice(kozeledik.indexOf(v),1)
            v.photo = photo.takepicture()
            v.time = new Date()
            befutott.push(v)
            refreshBefutottak()
            refreshKozeledok()
        });
        kozeledikElement.appendChild(ve)
    }

}
function refreshBefutottak() {
    let befutottakElement = document.getElementById('befutottak');
    befutottakElement.innerHTML=''
    for (const v of befutott) {
        let ve = document.getElementById('befutottSablon').content.cloneNode(true);
        ve.firstChild.querySelector('.nev').textContent = v.nev;
        ve.firstChild.querySelector('.ido').textContent = v.time;
        ve.firstChild.querySelector('.foto').setAttribute('src',v.photo);
        befutottakElement.appendChild(ve)
    }

}

