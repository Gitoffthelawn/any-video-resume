document.addEventListener('DOMContentLoaded', async () => {
    count_video_dom = document.querySelector('#count_videos')
    video_list_dom = document.querySelector('#video_history')
    delete_button = document.querySelector('.delete-history')
    no_videos_html = `<li class="empty">Empty history</li>`
    
    Storage.listAll().then((data) => {
        if (count_video_dom) count_video_dom.innerHTML = Object.keys(data).length
        videos = Object.keys(data).map((k) => data[k]).sort((a, b) => b.savedOn - a.savedOn).slice(0,5)

        if (videos.length > 0) {
            video_list_dom.innerHTML = ''
            videos.forEach((video) => {
                percent = Math.floor(video.currentTime / video.duration * 100)
                video_list_dom.innerHTML += (`
                                            <li>
                                                <span class="progress" style="width:${percent}%"></span>
                                                <span class="label">
                                                    <a href="${video.url}" target="_blank">${video.title}</a>
                                                </span>
                                            </li>`
                                            )
            })
        }

    })

    if (delete_button !== null) {
        delete_button.addEventListener("click", () => {
            count_video_dom = 0
            video_list_dom.innerHTML = no_videos_html
            Storage.cleanAll()
        })
    }
});