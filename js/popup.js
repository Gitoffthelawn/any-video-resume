document.addEventListener('DOMContentLoaded', async () => {
    Storage.listAll((data) => {
        //console.log(data)
        document.querySelector('#count_videos').innerHTML = Object.keys(data).length
    })
    
    delete_button = document.querySelector('.delete-history')

    if (delete_button !== null) {
        delete_button.addEventListener("click", () => {
            document.querySelector('#count_videos').innerHTML = 0
            Storage.cleanAll()
        })
    }
});