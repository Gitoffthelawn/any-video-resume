(function() {
    "use strict";

    //Storage.cleanAll()
    Storage.listAll()

    window.addEventListener('load',async _ => {
        console.log("Listen for videos...")
        let video = document.querySelector('video')
        if (!video) {
            let i = 1;
            while(i < 10 || !video) { // try it 10 times again...
                video = await checkforVideo(i*500) // wait every time n*500ms
                i++
                if (video) break
            }
            if (!video) return
        }
        trackVideo()
        //video.addEventListener('durationchange', trackVideo)
        video.addEventListener('loadedmetadata', trackVideo)
    })

    /**
     * 
     * @param {*} time 
     * @returns 
     */
    let checkforVideo = (time) => new Promise(res => {
        setTimeout(_ => {
            let video = document.querySelector('video')
            res(video)
        }, time);
    })

    /**
     * 
     * @returns 
     */
    let trackVideo = () => {
        let video = document.querySelector('video')
        if (!video) return
        VideoObject.init(video, 0)

        video.addEventListener('timeupdate', () => {
            VideoObject.updateTime(video)
        })
    }

})();