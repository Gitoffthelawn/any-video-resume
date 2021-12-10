(function() {
    "use strict";

    const MIN_VIDEO_LENGTH_SECONDS = 60 // min 1 minute
    const MAX_VIDEO_LENGTH_SECONDS = 86400 // max 24h

    /**
     * 
     * @returns 
     */
    let trackVideo = async _ => {
        let video = await checkforVideo(0)

        for (let i = 0; i < 10; i++) {
            if (video) break
            video = await checkforVideo(i*500) // wait time n*500ms
        }

        // get only first video on page
        video = Array.isArray(video) ? video[0] : video

        // Listen for async DOM changes Videos (like ads)
        video.addEventListener('loadedmetadata', trackVideo)

        // Skip if no video found or dismiss rules...
        if (video.src === undefined
            || isNaN(video.duration)
            || video.duration <= MIN_VIDEO_LENGTH_SECONDS
            || video.duration >= MAX_VIDEO_LENGTH_SECONDS) return

        // Start track Video
        VideoTracker.start(video)
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
    
    // Track url changes e.g. on YouTube
    let oldHref = document.location.href;
    window.onload = _ => {
        var bodyList = document.querySelector("body")
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(_ => {
                if (oldHref != document.location.href) {
                    oldHref = document.location.href;
                    trackVideo()
                }
            });
        });
        
        var config = {
            childList: true,
            subtree: true
        };
        
        observer.observe(bodyList, config);
    }
    
})();