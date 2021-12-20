// When dev mode is plugin
/**
 * OPTIONS WITH DEFAULT VALUES
 * @searchTimeout: 750
 * @keyboardEvents: true
 *  
 * */

export {imSearch};

class imSearch {
	constructor(element, options) {
		this.el = element;
		this.searchTimeout = options.searchTimeout || 750;
		this.openState = false;
		this.value = null;
		this.keyboardEvents = (options.keyboardEvents == false ) ? false : true;

		console.log( this.keyboardEvents, options.keyboardEvents );

		this.init();
	}

	init() {

		this.input = this.el.querySelector('[data-input]');
		this.listContainer = this.el.querySelector('[data-list-container]');
		this.listItems = [];
		this.focusItem = null;
		this.el.querySelectorAll('[data-list-item]').forEach( listItem => {
			this.listItems.push(listItem);
		});

		let searchTimer = null;

		this.input.addEventListener('input', (e) => {

			clearTimeout(searchTimer);

			searchTimer = setTimeout( () => {

				this.value = this.input.value;
				this.search();

			}, this.searchTimeout);

		});

		// ADDED EVENTS LISTENERS

		this.input.addEventListener('focus', e => {
			this.open();
		});

		document.addEventListener('click', e => {
			const target = e.target;
			if( !this.el.contains(target) ) {
				this.close();
			}
			if( target.closest('[data-list-item=true]') ) {
				this.select(target.closest('[data-list-item=true]'));
			}
		});

		const $btnsOpen = this.el.querySelectorAll('[data-open=true]');
		if( $btnsOpen.length ) {
			$btnsOpen.forEach( btn => {
				btn.addEventListener('click', e => {

					if( this.openState ) {
						this.close();
					} else {
						this.open();
					}

				});
			});
		};

		// KEYBOARD LISTENERS


		document.addEventListener('keydown', (e) => {
			if( !this.openState || !this.keyboardEvents ) return;

			if (e.defaultPrevented) {
				return; // Do nothing if event already handled
			}

			switch(e.key) {
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
	}

	focusNext() {
		this.focusItem.classList.remove('focus');
		if( this.focusItem.nextElementSibling ) {
			this.focusItem = this.focusItem.nextElementSibling;
		} else {
			this.focusItem = this.listItems[0];	
		}
		this.focusItem.classList.add('focus');
	}

	focusPrev() {
		this.focusItem.classList.remove('focus');
		if( this.focusItem.previousElementSibling ) {
			this.focusItem = this.focusItem.previousElementSibling;
		} else {
			this.focusItem = this.listItems[this.listItems.length - 1];
		}
		this.focusItem.classList.add('focus');
	}

	Enter() {
		this.focusItem.click();
	}

	destroy() {
		// whenever need to develope
	}	

	search() {

		this.listItems.forEach( listItem => {

			let itemValue = listItem.querySelector('[data-item-value=true]').innerText.toLowerCase();

			if( itemValue.includes(this.value.toLowerCase()) ) {
				listItem.style.display = '';
			} else {
				listItem.style.display = 'none';
			}
		});

	}

	open() {

		if( !this.openState ) {
			this.el.classList.add('opened');
			this.openState = true;

			this.focus();
		}

	}

	close() {

		if( this.openState ) {
			this.el.classList.remove('opened');
			this.openState = false;
		}

	}

	select(item) {
		this.value = item.querySelector('[data-item-value]').innerText;
		this.input.value = this.value;
		this.close();
	}

	focus(item) {
		if( typeof item == "undefined" && !item ) {
			this.listItems.forEach( (listItem, index) => {
				if( index == 0 ) {
					listItem.classList.add('focus');
					this.focusItem = listItem;
					return;
				}
				listItem.classList.remove('focus');
			});
		}
	}

}

