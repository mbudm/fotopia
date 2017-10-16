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

test('getFiles test, excluding jpeg', function (t) {

    t.plan(4);
    
    t.equal(typeof getFiles, 'function');
    
    const fileList = getFiles(config)
        .then(fileList => {
            t.equal(fileList.data.length, mockImages.length - 1);
            t.equal(fileList.data[0].path, path.join(mockBasePath, mockImages[0]));
            t.deepEqual(fileList.extensions, {jpg:2, JPG:3});
        });
});

test('getFiles test, including jpeg', function (t) {
    
    config.extensions.push('jpeg');
    t.plan(3);
    
    const fileList = getFiles(config)
        .then(fileList => {
            t.equal(fileList.data.length, mockImages.length);
            t.equal(fileList.data[0].path, path.join(mockBasePath, mockImages[0]));
            t.deepEqual(fileList.extensions, {jpg:2, JPG:3, jpeg:1});
        });
});