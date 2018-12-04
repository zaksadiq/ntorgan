function addListener(element, eventName, handler) {
	if (element.addEventListener) {
	  element.addEventListener(eventName, handler, false);
	}
	else if (element.attachEvent) {
	  element.attachEvent('on' + eventName, handler);
	}
	else {
	  element['on' + eventName] = handler;
	}
  }
  
function removeListener(element, eventName, handler) {
	if (element.addEventListener) {
		element.removeEventListener(eventName, handler, false);
	}
	else if (element.detachEvent) {
		element.detachEvent('on' + eventName, handler);
	}
	else {
		element['on' + eventName] = null;
	}
}

function makeIndent(indentLength) {
	return " 📁	".repeat(indentLength); //change to span.indent
}

function expandFolder(bookmarkItem) {
	folderName = bookmarkItem.title;
	folderView = 0;
	boxAddBookmarkViewClass();
	printBookmarkItems(bookmarkItem, 1, 1);
	drawLogo(folderName.toUpperCase());
}

function boxPrint(bookmarkItem, str, isFolder) {
	spanClass = isFolder ? "folder" : "bookmark";
	var box = document.querySelector(".box");
	var item;
	if (isFolder) {
		item = document.createElement("span");
	} else {
		item = document.createElement("a");
		item.setAttribute('href', bookmarkItem.url);
	}
	item.classList = `flex-item ${spanClass} ${bookmarkItem.id}`;
	// item.innerHTML = `<span class='flex-item ${spanClass}'> ${str} </span>`;
	item.textContent = str;
	box.appendChild(item);
	addListener(item, 'click', function() { expandFolder(bookmarkItem); });
}

function clearBox() {
	var box = document.querySelector(".box");
	// box.innerHTML = '';
	while (box.firstChild) {
		box.removeChild(box.firstChild);
	}
}

function drawBackButton() {
	var box = document.querySelector(".box");
	var btn = document.createElement("span");
	btn.setAttribute('class', 'button back');
	box.prepend(btn);
}

function boxAddBookmarkViewClass() {
	var box = document.querySelector(".box");
	box.classList += ' bookmarkview';
}
function printBookmarkItems(bookmarkItem, indent, printChildren = 0) {
	if (bookmarkItem.title == ntfolderTitle || printChildren) {
		clearBox();
		if (bookmarkItem.children) {
			for (child of bookmarkItem.children) {
				printBookmarkItems(child, indent);
			}
		}
	} else {
		if (bookmarkItem.url) {
			//is bookmark
			// drawBackButton();
			boxPrint(bookmarkItem, bookmarkItem.title, 0);
		} else {
			//is folder
			boxPrint(bookmarkItem, makeIndent(indent) + bookmarkItem.title, 1);
			indent++;
		}
	}
	indent--;
}

function printBookmarks(bookmarkItems) {
	printBookmarkItems(bookmarkItems[0], 0);
}

function onSearchFulfilled(bookmarkItems) {
	var gettingSubTree;
	for (item of bookmarkItems) {
		gettingSubTree = browser.bookmarks.getSubTree(item.id);
		gettingSubTree.then(printBookmarks, onRejected);
	}
}

function onRejected(error) {
	console.log(`an error ${error}`);
}

function drawLogo(str) {
	document.querySelector(".logo").textContent = str;
}

var ntfolderTitle = "ntorgan";
var folderView = 1; var folderName = 0;
var searching = browser.bookmarks.search({title:ntfolderTitle});
searching.then(onSearchFulfilled, onRejected);