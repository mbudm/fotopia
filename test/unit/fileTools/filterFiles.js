const test = require('tape');
const path = require('path');
const filterFiles = require('../../../src/fileTools/filterFiles');

const fileList = [
    {
         "path": "/Users/steve/dev/fotopia/test/mock/large_colour_face_parsing_error.jpg",
         "height": 683,
         "width": 1024,
         "type": "jpg",
         "size": 326447,
         "birthtime": "2012-01-23T01:12:42.000Z"
    },
    {
         "path": "/Users/steve/dev/fotopia/test/mock/large_group copy.jpg",
         "width": 4343,
         "height": 2895,
         "type": "jpg",
         "size": 1305287,
         "birthtime": "2016-04-16T08:46:05.000Z"
    },
    {
         "path": "/Users/steve/dev/fotopia/test/mock/large_group.jpg",
         "width": 4343,
         "height": 2895,
         "type": "jpg",
         "size": 1305287,
         "birthtime": "2016-04-16T08:46:05.000Z"
    },
    {
         "path": "/Users/steve/dev/fotopia/test/mock/large_nopeople_pretty.JPG",
         "height": 2736,
         "width": 3648,
         "type": "jpg",
         "size": 4178840,
         "birthtime": "2012-06-28T00:55:11.000Z"
    },
    {
         "path": "/Users/steve/dev/fotopia/test/mock/large_person_obscure.JPG",
         "height": 3648,
         "width": 2736,
         "type": "jpg",
         "size": 1612180,
         "birthtime": "2012-06-26T11:08:56.000Z"
    },
    {
         "path": "/Users/steve/dev/fotopia/test/mock/low_contrast_no_people.JPG",
         "height": 600,
         "width": 800,
         "type": "jpg",
         "size": 44381,
         "birthtime": "2007-03-08T10:59:44.000Z"
    },
    {
         "path": "/Users/steve/dev/fotopia/test/mock/small_bw_face.jpeg",
         "width": 480,
         "height": 368,
         "type": "jpg",
         "size": 40426,
         "birthtime": "2012-01-23T01:19:35.000Z"
    }
];

test('filterfiles - duplicate only', (t) => {
    t.plan(3);
    const result = filterFiles({
        criteria: {
            fileSize: 10, //bytes ~10k
            pixels: (240 * 480)
        }
    }, fileList)

    t.equal(result.accepted.length, 6);
    t.equal(result.rejected.length, 1);

    t.equal(result.rejected[0].reason, 'duplicate');
});

test('filterfiles - filesize', (t) => {
    t.plan(3);
    const result = filterFiles({
        criteria: {
            fileSize: 42000,
            pixels: (240 * 320)
        }
    }, fileList.filter(item => item.path.indexOf('copy') === -1) ); // remove dup

    t.equal(result.accepted.length, 5);
    t.equal(result.rejected.length, 1);

    t.equal(result.rejected[0].reason, 'filesize');
});

test('filterfiles - pixels', (t) => {
    t.plan(3);
    const result = filterFiles({
        criteria: {
            fileSize: 100, //bytes ~1k
            pixels: (640 * 480)
        }
    }, fileList.filter(item => item.path.indexOf('copy') === -1)) //remove dup

    t.equal(result.accepted.length, 5);
    t.equal(result.rejected.length, 1);

    t.equal(result.rejected[0].reason, 'pixels');
});

test('filterfiles - multiple', (t) => {
    t.plan(5);
    const result = filterFiles({
        criteria: {
            fileSize: 45000, //bytes ~100k
            pixels: (640 * 480)
        }
    }, fileList)

    t.equal(result.accepted.length, 4);
    t.equal(result.rejected.length, 3);

    t.equal(result.rejected[0].reason, 'duplicate');
    t.equal(result.rejected[1].reason, 'filesize');
    t.equal(result.rejected[2].reason, 'filesize');
});