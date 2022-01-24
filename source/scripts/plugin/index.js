// When dev mode is plugin
/**
 * OPTIONS WITH DEFAULT VALUES
 * @searchTimeout: 750
 * @keyboardEvents: true
 * @ajaxItems: false
 * @dynamicAjax: false
 * // PUBLIC METHODS
 * @destroy()
 * // CALLBACK FUNCTIONS
 * @onInit()
 * */

export { imSearch };

class imSearch {
	constructor(element, options) {
		this.options = options;
		this.select = element;
		this.searchTimeout = options.searchTimeout || 750;
		this.openState = false;
		this.value = null;
		this.keyboardEvents = (options.keyboardEvents == false) ? false : true;
		this.ajaxItems = options.ajaxItems || false;
		this.dynamicAjax = options.dynamicAjax || false;
		if (this.ajaxItems || this.dynamicAjax) {
			this.responePath = this.select.getAttribute('data-response-path');
			this.responseMessage = null;
		}

		this.input = this.select.querySelector('[data-input]');
		this.listContainer = this.select.querySelector('[data-list-container]');
		this.listItems = [];
		this.btnsOpen = this.select.querySelectorAll('[data-open=true]');

		this.init();
	}

	init() {

		this.focusItem = null;
	
		this.select.querySelectorAll('[data-list-item]').forEach(listItem => {
			this.listItems.push(listItem);
		});


		let searchTimer = null;

		if (this.ajaxItems) {

			this._fetch();


			// this.loadItems();
			// this.ajaxItems = false; // false after set items

		}


		// ADDED EVENTS LISTENERS

		this._inputListenerOnInput = (e) => {
			clearTimeout(searchTimer);

			this.open();

			searchTimer = setTimeout(() => {

				this.value = this.input.value;
				if( this.dynamicAjax ) {
					this._fetch();
					this.loadItems();
				} else {
					this.search();
				}


			}, this.searchTimeout);			

		}

		this._inputListenerOnFocus = (e) => {
			if( this.ajaxItems ) {
				this.loadItems();
				this.ajaxItems = false; // false after set items			
			}

			this.open();
		};

		this._inputListenerOnBlur = (e) => {
			this.close();
		}

		this._listItemListenerOnClick = (e) => {
			e.preventDefault();
			this.selectItem(e.target);
		}

		this._btnsOpenListenerOnClick = (e) => {
			e.preventDefault();
			if (this.openState) {
				this.close();
			} else {
				this.open();
			}
		}

		this.input.addEventListener('input', this._inputListenerOnInput);

		this.input.addEventListener('focus', this._inputListenerOnFocus);

		this.select.addEventListener('blur', this._inputListenerOnBlur);

		this.listItems.forEach( listItem => {
			listItem.addEventListener('click', this._listItemListenerOnClick);
		});	

		this.btnsOpen.forEach(btn => {
			btn.addEventListener('click', this._btnsOpenListenerOnClick);
		});

		document.addEventListener('click', e => {
			const target = e.target;
			if (!this.select.contains(target)) {
				this.close();
			}
		});		

		// KEYBOARD LISTENERS

		document.addEventListener('keydown', (e) => {
			if (!this.openState || !this.keyboardEvents) return;

			if (e.defaultPrevented) {
				return; // Do nothing if event already handled
			}

			switch (e.key) {
				case "ArrowDown":
					e.preventDefault();
					this.focusNext();
					break;
				case "ArrowUp":
					e.preventDefault();
					this.focusPrev();
					break;
				case "Enter":
					e.preventDefault();
					this.Enter();
					break;
			}

		});

		// END KEYBOARD LISTENERS

		// END EVENT LISTENERS

		if( typeof this.options.onInit === 'function'){
			this.options.onInit();
		}

	}

	// FETCH DATA

	_fetch() {

		this.formData = new FormData();
		this.dataset = this.select.dataset;
		this.dataset.value = this.value;

		if (this.dataset) {
			for (const field of Object.keys(this.dataset)) {
				if (field) {
					this.formData.append(field, this.dataset[field]);
				}
			}
		}
	}

	// END FETCH DATA	

	destroy() {
		// whenever need to develope
		this.input.removeEventListener('input', this._inputListenerOnInput);
		this.input.removeEventListener('focus', this._inputListenerOnFocus);
		this.select.removeEventListener('blur', this._inputListenerOnBlur);
		this.listItems.forEach(listItem => {
			listItem.removeEventListener('click', this._listItemListenerOnClick );
		});
		this.btnsOpen.forEach(btn => {
			btn.removeEventListener('click', this._btnsOpenListenerOnClick);
		});
	}	

	focusNext() {
		this.focusItem.classList.remove('focus');
		if (this.focusItem.nextElementSibling) {
			this.focusItem = this.focusItem.nextElementSibling;
		} else {
			this.focusItem = this.listItems[0];
		}

		this.focusItem.classList.add('focus');
	}

	focusPrev() {
		this.focusItem.classList.remove('focus');
		if (this.focusItem.previousElementSibling) {
			this.focusItem = this.focusItem.previousElementSibling;
		} else {
			this.focusItem = this.listItems[this.listItems.length - 1];
		}
		this.focusItem.classList.add('focus');
	}

	Enter() {
		this.focusItem.click();
	}


	loadItems() {

		// FOR LOCAL DEBUG

		fetch(
			this.responePath, {
				method: 'GET'
			}

			// fetch(
			// 	this.responePath,
			// 	{
			// 		method: 'POST',
			// 		body: this.formData,
			// 		headers: headers
			// 	}
		).then(
			response => response.json()
		).then(
			response => {
				if (response.result) {

					if (response.message) {

						this.responseMessage = response.message;

						this._generateItems();
						this.focus();
					}

				} else {
					console.log(response.message);
				}
			}
		).catch((error) => {
			return console.error(error);
		});
	}

	_generateItems() {
		if (this.responseMessage != null) {
			// console.log( this.responseMessage );
			let resultItemsHTML = '';
			this.listContainer.innerHTML = '';
			this.responseMessage.forEach((resultItem, index) => {
				resultItemsHTML += `<a class="b-im-complete__result-item" data-list-item="true">
					<span data-item-value="true" id="${resultItem.id}">${resultItem.value}</span></a>`;
			});
			this.listContainer.insertAdjacentHTML('afterbegin', resultItemsHTML);

			this.destroy();
			this.init();
		}
	}

	search() {

		let setFocusItem = false;

		this.listItems.forEach(listItem => {

			let itemValue = listItem.querySelector('[data-item-value=true]').innerText.toLowerCase();

			if (itemValue.includes(this.value.toLowerCase())) {
				listItem.style.display = '';

				if( !setFocusItem ) {
					this.focus();
					setFocusItem = true;
				}

			} else {
				listItem.style.display = 'none';
			}
		});

		this.focus();

	}

	open() {

		if (!this.openState) {
			this.select.classList.add('opened');
			this.openState = true;

			this.focus();
		}

	}

	close() {

		if (this.openState) {
			this.select.classList.remove('opened');
			this.openState = false;
		}

	}

	selectItem(item) {
		this.value = item.querySelector('[data-item-value]').innerText;
		this.input.value = this.value;
		this.close();
	}

	focus() {

		if( this.select.querySelector('.focus') ) this.select.querySelector('.focus').classList.remove('focus');
		if( this.select.querySelector('[data-list-item]') ) {

			let findFocus = false;

			this.select.querySelectorAll('[data-list-item]').forEach( item => {

				if( item.style.display != 'none' && !findFocus ) {
					item.classList.add('focus');
					findFocus = true; 
				 }

			});

			if( findFocus ) this.focusItem = this.select.querySelector('.focus');

		};
	}
}