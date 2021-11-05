const CACHE_DURATION = 365 * 24 * 3600 * 1000 // 7 days
const browserAPI = (typeof browser !== 'undefined') ? browser : chrome

class Storage
{
    static value(data, callback, retrying)
    {
        browserAPI.storage.local.get(data, (storageData) => {
            this.cleanup()
            if (!browserAPI.runtime.lastError)
                return callback(storageData);
            if (retrying)
                throw chrome.runtime.lastError.message;
            //cleanup(() => value(data, callback, true))
        })
    }

    static save(data, callback, retrying)
    {
        Object.keys(data).forEach(k => data[k].savedOn = Date.now());
        this.cleanup()
        browserAPI.storage.local.set(data, () => {
            if (!browserAPI.runtime.lastError)
                return callback();
            if (retrying)
                throw chrome.runtime.lastError.message;
            //cleanup(() => save(data, callback, true));
        });
    }
    
    static cleanup(callback)
    {
        var cutoff = Date.now() - CACHE_DURATION;
        browserAPI.storage.local.get(null, all => {
            let expiredKeys = Object.keys(all).filter(k => all[k].savedOn < cutoff);
            browserAPI.storage.local.remove(expiredKeys, callback);
        });
    }

    static cleanAll()
    {
        browserAPI.storage.local.get(null, all => {
            let keys = Object.keys(all).filter(k => k.startsWith('video-resumer'));
            browserAPI.storage.local.remove(keys, () => {
                //console.log("Alle Keys gelöscht...")
            });
        });
    }

    static listAll(callback)
    {
        browserAPI.storage.local.get(null, all => {
            let keys = Object.keys(all).filter(k => k.startsWith('video-resumer'))
            browserAPI.storage.local.get(keys, (data) => {
                return callback(data)
            })
        })
    }
}