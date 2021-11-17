const CACHE_DURATION = 365 * 24 * 3600 * 1000 // 365 days
const MIN_VIDEO_LENGTH_SECONDS = 30 // min 10 seconds
const MAX_VIDEO_LENGTH_SECONDS = 86400 // max 24h

const browserAPI = (typeof browser !== 'undefined') ? browser : chrome

class Storage
{
    static value(data, callback, retrying)
    {
        browserAPI.storage.local.get(data, (storageData) => {
            if (!browserAPI.runtime.lastError)
                return callback(storageData);
            if (retrying)
                throw chrome.runtime.lastError.message;
        })
    }

    static save(data, callback, retrying)
    {
        Object.keys(data).forEach(k => data[k].savedOn = Date.now());
        browserAPI.storage.local.set(data, () => {
            if (!browserAPI.runtime.lastError)
                return callback();
            if (retrying)
                throw chrome.runtime.lastError.message;
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
            browserAPI.storage.local.remove(keys);
        });
    }

    static listAll()
    {
        return new Promise((resolve, reject) => {
            browserAPI.storage.local.get(null, (all) => {
                let keys = Object.keys(all).filter(k => k.startsWith('video-resumer'))
                browserAPI.storage.local.get(keys, (data) => {
                    resolve(data);
                })
            })
        })
    }
}
