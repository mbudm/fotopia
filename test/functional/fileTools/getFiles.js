const test = require('tape');
const path = require('path');
const getFiles = require('../../../src/fileTools/getFiles');

const mockBasePath = path.join(__dirname,'../../','mock');
const mockImages = [
    'large_colour_face.jpg',           
    'large_group.jpg',
    'large_nopeople_pretty.JPG',
    'large_person_obscure.JPG',
    'low_contrast_no_people.JPG',
    'small_bw_face.jpeg'
];

const config = {
    extensions:['jpg'],
    cwd: mockBasePath
}

test('getFiles test', function (t) {
    t.plan(4);
    
    t.equal(typeof getFiles, 'function');
    
    const fileList = getFiles(config)
        .then(fileList => {
            t.deepEqual(fileList.data, mockImages);
            t.equal(fileList.data[0].path, path.join(mockBasePath, mockImages[0]));
            t.deepEqual(fileList.extensions, {jpg:3, JPG:3});
        });
});