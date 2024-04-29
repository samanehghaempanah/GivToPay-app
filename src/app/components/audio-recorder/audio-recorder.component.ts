import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AudioRecordingService } from 'src/app/services/audio-recording.service';

@Component({
    selector: 'app-audio-recorder',
    templateUrl: './audio-recorder.component.html',
    styleUrls: ['./audio-recorder.component.scss'],
})
export class AudioRecorderComponent implements OnInit {

    @Output() onStop = new EventEmitter();
    @Output() onCancel = new EventEmitter();

    @ViewChild(HTMLAudioElement) audioPlayer: HTMLAudioElement | any;

    Recording = false;
    recordedTime: any;
    blobUrl: any;
    teste: any;

    constructor(
        private audioRecordingService: AudioRecordingService,
        private sanitizer: DomSanitizer
    ) {
        this.audioRecordingService.recordingFailed()
            .subscribe(() => (this.Recording = false));

        this.audioRecordingService.getRecordedTime()
            .subscribe(time => (this.recordedTime = time));

        this.audioRecordingService.getRecordedBlob()
            .subscribe(data => { this.teste = data; this.blobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data.blob)); });
    }

    ngOnInit(): void { }

    ngOnDestroy(): void { this.abortRecording(); }

    // ngAfterViewInit() { this.startRecording(); }

    startRecording() {
        if (!this.Recording) {
            this.Recording = true;
            this.audioRecordingService.startRecording();
        }
    }

    abortRecording() {
        if (this.Recording) {
            this.Recording = false;
            this.audioRecordingService.abortRecording();
        }
    }

    stopRecording() {

        if (this.Recording) {
            this.audioRecordingService.stopRecording();
            this.Recording = false;
        }

        if (this.teste) {
            this.blobToBase64(this.teste.blob).then((res) => { this.onStop.emit(res); });
        }
    }

    cancelRecording() {
        this.blobUrl = null;
        this.onCancel.emit();
    }

    download(): void {
        const url = window.URL.createObjectURL(this.teste.blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = this.teste.title;
        link.click();
    }

    blobToBase64(blob: any) {
        return new Promise((resolve, _) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    }

    // loadPlayer(): void {        

    //     var audioPlayer: any = document.querySelector('.green-audio-player');
    //     var playPause: any = audioPlayer.querySelector('#playPause');
    //     var playpauseBtn: any = audioPlayer.querySelector('.play-pause-btn');
    //     var loading: any = audioPlayer.querySelector('.loading');
    //     var progress: any = audioPlayer.querySelector('.progress');
    //     var sliders: any = audioPlayer.querySelectorAll('.slider');
    //     var volumeProgress: any = document.querySelector('.slider .progress');
    //     var player: any = audioPlayer.querySelector('audio');
    //     var currentTime: any = audioPlayer.querySelector('.current-time');
    //     var totalTime: any = audioPlayer.querySelector('.total-time');
    //     var speaker: any = audioPlayer.querySelector('#speaker');

    //     var draggableClasses = ['pin'];
    //     var currentlyDragged = null;

    //     window.addEventListener('mousedown', function (event: any) {
    //         if (!isDraggable(event.target)) return false;

    //         currentlyDragged = event.target;
    //         let handleMethod = currentlyDragged!.dataset.method;

    //         this.addEventListener('mousemove', (window[handleMethod] as any), false);

    //         window.addEventListener('mouseup', () => {
    //             currentlyDragged = false;
    //             window.removeEventListener('mousemove', (window[handleMethod] as any), false);
    //         }, false);
    //         return;
    //     });

    //     playpauseBtn.addEventListener('click', togglePlay);
    //     player.addEventListener('timeupdate', updateProgress);
    //     player.addEventListener('volumechange', updateVolume);
    //     player.addEventListener('loadedmetadata', () => {
    //         totalTime.textContent = formatTime(player.duration);
    //     });
    //     player.addEventListener('canplay', makePlay);
    //     player.addEventListener('ended', function () {
    //         playPause.attributes.d.value = "M18 12L0 24V0";
    //         player.currentTime = 0;
    //     });

    //     sliders.forEach((slider: any) => {
    //         let pin = slider.querySelector('.pin');
    //         slider.addEventListener('click', window[pin.dataset.method]);
    //     });


    //     function isDraggable(el: any) {
    //         let canDrag = false;
    //         let classes = Array.from(el.classList);
    //         draggableClasses.forEach(draggable => {
    //             if (classes.indexOf(draggable) !== -1)
    //                 canDrag = true;
    //         })
    //         return canDrag;
    //     }

    //     function updateProgress() {
    //         var current = player.currentTime;
    //         var percent = (current / player.duration) * 100;
    //         progress.style.width = percent + '%';

    //         currentTime.textContent = formatTime(current);
    //     }

    //     function updateVolume() {
    //         volumeProgress.style.height = player.volume * 100 + '%';
    //         if (player.volume >= 0.5) {
    //             speaker.attributes.d.value = 'M14.667 0v2.747c3.853 1.146 6.666 4.72 6.666 8.946 0 4.227-2.813 7.787-6.666 8.934v2.76C20 22.173 24 17.4 24 11.693 24 5.987 20 1.213 14.667 0zM18 11.693c0-2.36-1.333-4.386-3.333-5.373v10.707c2-.947 3.333-2.987 3.333-5.334zm-18-4v8h5.333L12 22.36V1.027L5.333 7.693H0z';
    //         } else if (player.volume < 0.5 && player.volume > 0.05) {
    //             speaker.attributes.d.value = 'M0 7.667v8h5.333L12 22.333V1L5.333 7.667M17.333 11.373C17.333 9.013 16 6.987 14 6v10.707c2-.947 3.333-2.987 3.333-5.334z';
    //         } else if (player.volume <= 0.05) {
    //             speaker.attributes.d.value = 'M0 7.667v8h5.333L12 22.333V1L5.333 7.667';
    //         }
    //     }

    //     function formatTime(time: any) {
    //         var min = Math.floor(time / 60);
    //         var sec = Math.floor(time % 60);
    //         return min + ':' + ((sec < 10) ? ('0' + sec) : sec);
    //     }

    //     function togglePlay() {
    //         if (player.paused) {
    //             playPause.attributes.d.value = "M0 0h6v24H0zM12 0h6v24h-6z";
    //             player.play();
    //         } else {
    //             playPause.attributes.d.value = "M18 12L0 24V0";
    //             player.pause();
    //         }
    //     }

    //     function makePlay() {
    //         playpauseBtn.style.display = 'block';
    //         loading.style.display = 'none';
    //     }
    // }
}