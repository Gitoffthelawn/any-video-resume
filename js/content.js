(function() {
    "use strict";

    /**
     * 
     * @returns 
     */
    let trackVideo = async _ => {
        let video = await checkforVideo(0)

        for (var i = 0; i < 10; i++) {
            if (video) break
            video = await checkforVideo(i*500) // wait every time n*500ms
        }

        // Skip if no video found or dismiss rules...
        if (video == null || video.duration <= MIN_VIDEO_LENGTH_SECONDS
            || video.duration >= MAX_VIDEO_LENGTH_SECONDS
            || isNaN(video.duration)) {
                return
            }

        // get only first video on page
        video = Array.isArray(video) ? video[0] : video

        Video.init(video)
        video.addEventListener('timeupdate', _ => {
            Video.updateTime(video)
        })

        // change video DOM async with ajax...
        // listener for such updates -> trackVideo again...
        // Add after init load for first video...
        video.addEventListener('loadedmetadata', trackVideo)
    }
    
    /**
     * 
     * @param {*} time 
     * @returns 
     */
    let checkforVideo = (time) => new Promise(res => {
        setTimeout(_ => {
            let video = getVideo()
            res(video)
        }, time);
    })

    /**
     * 
     * @returns 
     */
    let getVideo = () => {
        return document.querySelector('video')
    }

    window.addEventListener('load', trackVideo)
    
})();