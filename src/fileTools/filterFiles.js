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
        if(similarBirthTime(lookup[item.size],item) || similarFileName(lookup[item.size],item)){
            return true
        }else{
            return false;
        }
    }else{
        lookup[item.size] = item;
        return false
    }
}

function similarBirthTime(a,b){
   return a.birthtime === b.birthtime;
}

function similarFileName(a, b){
    return (getFilename(a.path) === getFilename(b.path));
}

function getFilename(path){
    const filename = path.split('/').pop();
    return filename.length > 0 ? filename : path;
  }

module.exports = filterFiles
