function filterFiles(config, fileList){
    const filteredItems = {
        rejected: [],
        accepted: []
    };
    const lookup = {};
    fileList.forEach(item => {
        if(!isAcceptableFileSize(item, config)){
            filteredItems.rejected.push({
                reason: 'filesize',
                ...item
            });
        }else if(isAcceptablePixels(item, config)){
            filteredItems.rejected.push({
                reason: 'pixels',
                ...item
            });
        }else if(isDuplicate(item, lookup)){
            filteredItems.rejected.push({
                reason: 'duplicate',
                ...item
            });
        }else{
            //passes checks, keep it
            filteredItems.accepted.push(item);
        }
    })
    return filteredItems;
}

function isAcceptablePixels(item, config){
    const totalPixels = (item.width * item.height )
    return totalPixels < config.criteria.pixels;
}

function isAcceptableFileSize(item, config){
    return item.size > config.criteria.fileSize;
}
function isDuplicate(item, lookup){
    if(lookup[item.size]){
        return true
    }else{
        lookup[item.size] = true;
        return false
    }
}

module.exports = filterFiles
