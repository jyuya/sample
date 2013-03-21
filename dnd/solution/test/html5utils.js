var people = {
  rem : { 
    name : "Remy Sharp",
    blog : "http://remysharp.com"
  },
  brucel : {
    name : "Bruce Lawson",
    blog : "http://brucelawson.co.uk"
  },
  "Rich_Clark" : {
    name : "Rich Clark",
    blog : "http://richclarkdesign.com/"
  },
  akamike : {
    name : "Mike Robinson",
    blog : "http://akamike.net/"
  },
  leads : {
    name : "Tom Leadbetter",
    blog : "http://www.tomleadbetter.co.uk/"
  },
  jackosborne : {
    name : "Jack Osborne",
    blog : "http://jackosborne.co.uk/"
  }
};

function cancel(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }
  return false;
}

var dragIcon = document.createElement('img');
dragIcon.src = 'http://twitter.com/api/users/profile_image/twitter?size=mini';

var dragItems = document.querySelectorAll('[draggable=true]');

for (var i = 0; i < dragItems.length; i++) {
  addEvent(dragItems[i], 'dragstart', function (event) {
    // store the ID of the element, and collect it on the drop later on
    event.dataTransfer.setData('Text', this.id);
    event.dataTransfer.setDragImage(dragIcon, -10, -10);
    return false;
  });
}

var drop = document.querySelector('#drop');

// Tells the browser that we *can* drop on this target
addEvent(drop, 'dragover', cancel);
addEvent(drop, 'dragenter', cancel);

addEvent(drop, 'drop', function (event) {
  if (event.preventDefault) event.preventDefault(); // stops the browser from redirecting off to the text.

  var person = people[event.dataTransfer.getData('Text')];

  this.innerHTML += '<p><a href="' + person.blog + '">' + person.name + '</a></p>';
  return false;
});