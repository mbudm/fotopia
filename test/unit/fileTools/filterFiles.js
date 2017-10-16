const test = require('tape');
const path = require('path');
const filterFiles = require('../../../src/fileTools/filterFiles');

const fileList = {
    data: [
        {
            "path": "/Users/steve/dev/fotopia/test/mock/large_colour_face_parsing_error.jpg",
            "error": {
                 "code": "PARSING_ERROR",
                 "source": "File: /Users/steve/dev/fotopia/test/mock/large_colour_face.jpg"
            },
            "size": 326447
       },
       {
            "path": "/Users/steve/dev/fotopia/test/mock/large_group.jpg",
            "width": 4343,
            "height": 2895,
            "type": "jpg",
            "exifData": {
                 "image": {
                      "ImageWidth": 5184,
                      "ImageHeight": 3456,
                      "BitsPerSample": [
                           8,
                           8,
                           8
                      ],
                      "PhotometricInterpretation": 2,
                      "ImageDescription": "Gaza, Palestine 2016",
                      "Make": "Canon",
                      "Model": "Canon EOS-1D X",
                      "Orientation": 1,
                      "SamplesPerPixel": 3,
                      "XResolution": 3677.0733,
                      "YResolution": 3677.0733,
                      "ResolutionUnit": 2,
                      "Software": "Adobe Photoshop CC 2015 (Macintosh)",
                      "ModifyDate": "2016:04:16 11:37:04",
                      "Artist": "Darrian Traynor",
                      "WhitePoint": [
                           0.313,
                           0.329
                      ],
                      "PrimaryChromaticities": [
                           0.64,
                           0.33,
                           0.21,
                           0.71,
                           0.15,
                           0.06
                      ],
                      "YCbCrCoefficients": [
                           0.299,
                           0.587,
                           0.114
                      ],
                      "YCbCrPositioning": 2,
                      "Copyright": "Â© darrian traynor",
                      "ExifOffset": 432,
                      "GPSInfo": 1356
                 },
                 "thumbnail": {
                      "Compression": 6,
                      "XResolution": 72,
                      "YResolution": 72,
                      "ResolutionUnit": 2,
                      "ThumbnailOffset": 1470,
                      "ThumbnailLength": 6195
                 },
                 "exif": {
                      "ExposureTime": 0.004,
                      "FNumber": 10,
                      "ExposureProgram": 1,
                      "ISO": 1000,
                      "SensitivityType": 2,
                      "RecommendedExposureIndex": 1000,
                      "ExifVersion": {
                           "type": "Buffer",
                           "data": [
                                48,
                                50,
                                51,
                                48
                           ]
                      },
                      "DateTimeOriginal": "2016:04:11 11:19:55",
                      "CreateDate": "2016:04:11 11:19:55",
                      "ComponentsConfiguration": {
                           "type": "Buffer",
                           "data": [
                                1,
                                2,
                                3,
                                0
                           ]
                      },
                      "ShutterSpeedValue": 8,
                      "ApertureValue": 6.625,
                      "ExposureCompensation": 0,
                      "MaxApertureValue": 4,
                      "MeteringMode": 5,
                      "Flash": 9,
                      "FocalLength": 20,
                      "SubSecTimeOriginal": "62",
                      "FlashpixVersion": {
                           "type": "Buffer",
                           "data": [
                                48,
                                49,
                                48,
                                48
                           ]
                      },
                      "ColorSpace": 1,
                      "ExifImageWidth": 4343,
                      "ExifImageHeight": 2895,
                      "FocalPlaneXResolution": 3545.827633378933,
                      "FocalPlaneYResolution": 3526.530612244898,
                      "FocalPlaneResolutionUnit": 2,
                      "CustomRendered": 0,
                      "ExposureMode": 1,
                      "WhiteBalance": 0,
                      "SceneCaptureType": 0,
                      "OwnerName": "",
                      "SerialNumber": "235010000074",
                      "LensInfo": [
                           16,
                           35,
                           0,
                           0
                      ],
                      "LensModel": "EF16-35mm f/4L IS USM",
                      "LensSerialNumber": "3620003200",
                      "Gamma": 2.2
                 },
                 "gps": {
                      "GPSVersionID": [
                           2,
                           3,
                           0,
                           0
                      ]
                 },
                 "interoperability": {},
                 "makernote": {}
            },
            "size": 1305287
       },
       {
            "path": "/Users/steve/dev/fotopia/test/mock/large_nopeople_pretty.JPG",
            "height": 2736,
            "width": 3648,
            "type": "jpg",
            "size": 4178840
       },
       {
            "path": "/Users/steve/dev/fotopia/test/mock/large_person_obscure.JPG",
            "height": 3648,
            "width": 2736,
            "type": "jpg",
            "size": 1612180
       },
       {
            "path": "/Users/steve/dev/fotopia/test/mock/low_contrast_no_people.JPG",
            "height": 600,
            "width": 800,
            "type": "jpg",
            "size": 44381
       },
       {
            "path": "/Users/steve/dev/fotopia/test/mock/small_bw_face.jpeg",
            "height": 490,
            "width": 640,
            "type": "jpg",
            "size": 68290
       }
    ], 
    extensions: { jpg: 2, JPG: 3 }
}