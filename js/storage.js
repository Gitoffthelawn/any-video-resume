const CACHE_DURATION = 365 * 24 * 3600 * 1000 // 365 days
const MIN_VIDEO_LENGTH_SECONDS = 60 // min 1 minute
const MAX_VIDEO_LENGTH_SECONDS = 86400 // max 24h

const browserAPI = (typeof browser !== 'undefined') ? browser : chrome

class Storage
{
    static value(key, callback, retrying)
    {
        browserAPI.storage.local.get([key], (storageData) => {
            if (!browserAPI.runtime.lastError)
                return callback(storageData);
            if (retrying)
                throw chrome.runtime.lastError.message;
        })
    }

    static save(data, callback, retrying)
    {
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
