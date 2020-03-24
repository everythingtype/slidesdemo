// Client ID and API key from the Developer Console
var CLIENT_ID = "615443419552-qpk518pf4gnlsi9h1qcge695isiaqbks.apps.googleusercontent.com";
var API_KEY = "AIzaSyAjrO4yQZLcYaTD7zPEdg0vqcezBrpYM04";

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest", "https://slides.googleapis.com/$discovery/rest?version=v1"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/presentations";

var authorizeButton = document.getElementById("authorize_button");
var signoutButton = document.getElementById("signout_button");

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load("client:auth2", initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client.init({apiKey: API_KEY, clientId: CLIENT_ID, discoveryDocs: DISCOVERY_DOCS, scope: SCOPES}).then(function() {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
  }, function(error) {
    appendPre(JSON.stringify(error, null, 2));
  });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = "none";
    signoutButton.style.display = "block";
    copyFile();
  } else {
    authorizeButton.style.display = "block";
    signoutButton.style.display = "none";
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
  var pre = document.getElementById("content");
  var textContent = document.createTextNode(message + "\n");
  pre.appendChild(textContent);
}

// Generate UUID

function uuidv4() {
  return "xxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x"
        ? r
        : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getIdFromUrl(url) {
  return url.match(/[-\w]{25,}/);
}

/**
 * Copy file.
 */
function copyFile() {
  var inputs = document.getElementById("createpresentation").elements;
  var originurl = inputs["originurl"]["value"];
  var originFileId = getIdFromUrl(originurl);
  var targetname = inputs["targetname"]["value"];

  var body = {
    name: targetname
  };

  var request = gapi.client.drive.files.copy({fileId: originFileId, resource: body});

  request.execute(function(resp) {
    var copyid = resp.id;
    console.log("Copy ID: " + copyid);
    myBatchUpdate(copyid);
  });
}

function createSlideMainPoint(predefinedLayout, textvalue) {
  console.log("creating main point");

  var pageId = uuidv4();
  var mpTextboxID = uuidv4();

  var body = [
    {
      createSlide: {
        objectId: pageId,
        slideLayoutReference: {
          predefinedLayout: predefinedLayout
        },
        placeholderIdMappings: {
          objectId: mpTextboxID,
          layoutPlaceholder: {
            type: "TITLE",
            index: 0
          }
        }
      }
    }, {
      insertText: {
        objectId: mpTextboxID,
        text: textvalue,
        insertionIndex: 0
      }
    }, {
      updateTextStyle: {
        objectId: mpTextboxID,
        textRange: {
          type: 'FIXED_RANGE',
          startIndex: 0,
          endIndex: 3
        },
        style: {
          foregroundColor: {
            opaqueColor: {
              rgbColor: {
                blue: 0.5,
                green: 0.3,
                red: 0.0
              }
            }
          }
        },
        fields: 'foregroundColor'
      }
    }
  ];

  return body;
}

function createSlideTitleSlide(predefinedLayout, textvalue, subtitle) {
  console.log("creating title slide");

  var pageId = uuidv4();
  var mpTextboxID = uuidv4();
  var mpSubtitleID = uuidv4();

  var body = [
    {
      createSlide: {
        objectId: pageId,
        slideLayoutReference: {
          predefinedLayout: predefinedLayout
        },
        placeholderIdMappings: [
          {
            layoutPlaceholder: {
              type: "TITLE",
              index: 0
            },
            objectId: mpTextboxID
          }, {
            layoutPlaceholder: {
              type: "SUBTITLE",
              index: 0
            },
            objectId: mpSubtitleID
          }
        ]
      }
    }, {
      insertText: {
        objectId: mpTextboxID,
        text: textvalue,
        insertionIndex: 0
      }
    }, {
      insertText: {
        objectId: mpSubtitleID,
        text: subtitle,
        insertionIndex: 0
      }
    }
  ];

  return body;
}

function createSlideSectionHeader(predefinedLayout, textvalue, subtitle) {
  console.log("creating section header");

  var pageId = uuidv4();
  var mpTextboxID = uuidv4();
  var mpSubtitleID = uuidv4();

  var body = [
    {
      createSlide: {
        objectId: pageId,
        slideLayoutReference: {
          predefinedLayout: predefinedLayout
        },
        placeholderIdMappings: [
          {
            layoutPlaceholder: {
              type: "TITLE",
              index: 0
            },
            objectId: mpTextboxID
          }, {
            layoutPlaceholder: {
              type: "SUBTITLE",
              index: 0
            },
            objectId: mpSubtitleID
          }
        ]
      }
    }, {
      insertText: {
        objectId: mpTextboxID,
        text: textvalue,
        insertionIndex: 0
      }
    }, {
      insertText: {
        objectId: mpSubtitleID,
        text: subtitle,
        insertionIndex: 0
      }
    }
  ];

  return body;
}

function createSlideSectionTitleDescription(predefinedLayout, textvalue, subtitle, image) {
  console.log("creating section header");

  var pageId = uuidv4();
  var mpTextboxID = uuidv4();
  var mpSubtitleID = uuidv4();
  var mpImageID = uuidv4();
  var width = {
    magnitude: 4572000,
    unit: 'EMU'
  };
  var emu4M = {
    magnitude: 5148072,
    unit: 'EMU'
  };

  var body = [
    {
      createSlide: {
        objectId: pageId,
        slideLayoutReference: {
          predefinedLayout: predefinedLayout
        },
        placeholderIdMappings: [
          {
            layoutPlaceholder: {
              type: "TITLE",
              index: 0
            },
            objectId: mpTextboxID
          }, {
            layoutPlaceholder: {
              type: "SUBTITLE",
              index: 0
            },
            objectId: mpSubtitleID
          }
        ]
      }
    }, {
      insertText: {
        objectId: mpTextboxID,
        text: textvalue,
        insertionIndex: 0
      }
    }, {
      insertText: {
        objectId: mpSubtitleID,
        text: subtitle,
        insertionIndex: 0
      }
    }, {
      createImage: {
        objectId: mpImageID,
        url: image,
        elementProperties: {
          pageObjectId: pageId,
          size: {
            height: emu4M,
            width: width
          },
          transform: {
            scaleX: 1,
            scaleY: 1,
            translateX: 4572000,
            translateY: 0,
            unit: 'EMU'
          }
        }
      }
    }
  ];

  return body;
}

function slideLoop(inputs, index) {
  console.log("doing loooops!");
  var selector = index + 1;
  var predefinedLayout = inputs["predefinedLayout-" + selector]["value"];

  switch (predefinedLayout) {
    case "PREDEFINED_LAYOUT_UNSPECIFIED":
      break;
    case "BLANK":
      break;
    case "CAPTION_ONLY":
      break;
    case "TITLE":
      //title
      var textvalue = inputs["textvalue-" + selector]["value"];
      var subtitle = inputs["subtitle-" + selector]["value"];
      return createSlideTitleSlide(predefinedLayout, textvalue, subtitle);
      break;
    case "TITLE_AND_BODY":
      break;
    case "TITLE_AND_TWO_COLUMNS":
      break;
    case "TITLE_ONLY":
      break;
    case "SECTION_HEADER":
      var textvalue = inputs["textvalue-" + selector]["value"];
      var subtitle = inputs["subtitle-" + selector]["value"];
      return createSlideSectionHeader(predefinedLayout, textvalue, subtitle);
      break;
    case "SECTION_TITLE_AND_DESCRIPTION":
      var textvalue = inputs["textvalue-" + selector]["value"];
      var subtitle = inputs["subtitle-" + selector]["value"];
      var image = inputs["image-" + selector]["value"];
      return createSlideSectionTitleDescription(predefinedLayout, textvalue, subtitle, image);
      break;
    case "ONE_COLUMN_TEXT":
      break;
    case "MAIN_POINT":
      var textvalue = inputs["textvalue-" + selector]["value"];
      return createSlideMainPoint(predefinedLayout, textvalue);

      break;
    case "BIG_NUMBER":
      break;
    default:
      console.log("Unrecognized layout: " + predefinedLayout);
  }
}

function myBatchUpdate(presentationId) {
  var inputs = document.getElementById("createpresentation").elements;

  var slidecount = document.querySelectorAll("#createpresentation .slide").length;
  console.log("slidecount: " + slidecount);

  if (slidecount > 0) {
    var body = [];

    for (let step = 0; step < slidecount; step++) {
      var slideLoops = slideLoop(inputs, step);
      body.push(slideLoops);
    }

    console.log(body);

    gapi.client.slides.presentations.batchUpdate({presentationId: presentationId, requests: body}).then(createSlideResponse => {
      console.log(`Created slide with ID: ${createSlideResponse.result.replies[0].createSlide.objectId}`);
    });
  } else {
    console.log("no slides");
  }
}

document.addEventListener("DOMContentLoaded", function() {
  console.log("ready");

  //	handleClientLoad();

  var submitbutton = document.getElementById("submitbutton");
  submitbutton.onclick = handleClientLoad;
});
