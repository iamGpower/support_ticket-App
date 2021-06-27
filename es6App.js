class Ticket {
	constructor(
		id,
		fullName,
		phone,
		email,
		unit,
		topic,
		piority,
		assignee = 'Support Level 1',
	) {
		this.id = id;
		this.fullName = fullName;
		this.phone = phone;
		this.email = email;
		this.unit = unit;
		this.topic = topic;
		this.piority = piority;
		this.assignee = assignee;
	}
}

class UI {
	createTicket(ticket) {
		// create UI row element
		const tableList = document.getElementById('ticket-queue');
		const row = document.createElement('tr');
		row.innerHTML = `
    <td>${ticket.id.toUpperCase()}</td>
    <td>${ticket.fullName}</td>
    <td>${ticket.unit}</td>
    <td>${ticket.topic}</td>
    <td>${ticket.piority}</td>
    <td>${ticket.assignee}</td>
    <td><a class="delete">&times;</a></td>
    `;
		tableList.appendChild(row);
		return;
	}

	deleteTicket(event) {
		if (event.target.classList.contains('delete')) {
			event.target.parentElement.parentElement.remove();
		}
	}

	notify(message, className) {
		const alertDiv = document.createElement('div');
		alertDiv.className = `alert ${className}`;
		alertDiv.appendChild(document.createTextNode(message));
		const parentContainer = document.querySelector('.container');
		const formContainer = document.querySelector('#ticket-form');
		parentContainer.insertBefore(alertDiv, formContainer);

		setTimeout(function () {
			document.querySelector('.alert').remove();
		}, 4000);
	}

	clearForm() {
		const ticketForm = document.getElementById('ticket-form');
		for (let i = 0; i < ticketForm.length - 1; i++) {
			ticketForm.elements[i].value = '';
		}
	}
}

class DB {
	static getTickets() {
		let tickets;
		if (localStorage.getItem('tickets') === null) {
			tickets = [];
		} else {
			tickets = JSON.parse(localStorage.getItem('tickets'));
		}

		return tickets;
	}

	static deleteTicket(value) {
		const tickets = DB.getTickets();
		console.log(tickets);
		tickets.forEach(function (ticket, index) {
			if (ticket.id === value.toLowerCase()) {
				tickets.splice(index, 1);
			}
		});
		localStorage.setItem('tickets', JSON.stringify(tickets));
	}

	static displayTickets() {
		const tickets = DB.getTickets();
		tickets.forEach(function (book) {
			const ui = new UI();
			ui.createTicket(book);
		});
	}

	static addTicket(ticket) {
		const tickets = DB.getTickets();
		console.log(ticket);
		tickets.push(ticket);
		// console.log(tickets);
		localStorage.setItem('tickets', JSON.stringify(tickets));
	}
}

// Display tickets on page load
document.addEventListener('DOMContentLoaded', DB.displayTickets);

// Create ticket
document.getElementById('ticket-form').addEventListener('submit', function (e) {
	const id = random(6);
	const fullName = document.getElementById('full-name').value;
	const phone = document.getElementById('phone').value;
	const email = document.getElementById('email').value;
	const unit = document.getElementById('unit').value;
	const topic = document.getElementById('topic').value;
	const piority = document.getElementById('piority').value;
	e.preventDefault();

	// Instantiate new ticket
	const ticket = new Ticket(id, fullName, phone, email, unit, topic, piority);

	// Instantiate UI element
	const ui = new UI();

	// Validation
	if (
		ticket.id !== '' &&
		ticket.fullName !== '' &&
		ticket.phone !== '' &&
		ticket.unit !== '' &&
		ticket.topic !== '' &&
		ticket.piority !== ''
	) {
		ui.createTicket(ticket);

		// Adding ticket to local Storage
		DB.addTicket(ticket);

		ui.notify('Ticket successfully created', 'success');

		ui.clearForm();
	} else {
		ui.notify(
			'Please fill all ticket fields for a comprehensive request log',
			'error',
		);
	}

	function random(length = 8) {
		return Math.random().toString(16).substr(2, length);
	}
});

// Delete ticket
document.getElementById('ticket-table').addEventListener('click', function (e) {
	const ui = new UI();
	ui.deleteTicket(e);

	// Remove ticket from local storage
	DB.deleteTicket(
		e.target.parentElement.parentElement.firstChild.nextElementSibling
			.innerText,
	);

	ui.notify('Ticket item successfully deleted', 'info');
});
