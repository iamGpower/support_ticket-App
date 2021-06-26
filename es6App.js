class Ticket {
	constructor(
		email,
		fullName,
		phone,
		unit,
		piority,
		topic,
		assignee = 'Support Level 1',
	) {
		this.email = email;
		this.fullName = fullName;
		this.phone = phone;
		this.unit = unit;
		this.piority = piority;
		this.topic = topic;
		this.assignee = assignee;
	}
}

class UI {
	createTicket(ticket) {
		// create UI row element
		const tableList = document.getElementById('ticket-queue');
		const row = document.createElement('tr');
		row.innerHTML = `
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
	static getTickets() {}

	static deleteTicket() {}

	static displayTickets() {}

	static addTicket() {}
}

// Create ticket
document.getElementById('ticket-form').addEventListener('submit', function (e) {
	const email = document.getElementById('email').value;
	const fullName = document.getElementById('full-name').value;
	const phone = document.getElementById('phone').value;
	const unit = document.getElementById('unit').value;
	const piority = document.getElementById('piority').value;
	const topic = document.getElementById('topic').value;
	e.preventDefault();

	// Instantiate new ticket
	const ticket = new Ticket(email, fullName, phone, unit, piority, topic);

	// Instantiate UI element
	const ui = new UI();

	// Validation
	if (
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
});

// Delete ticket
document.getElementById('ticket-table').addEventListener('click', function (e) {
	const ui = new UI();
	ui.deleteTicket(e);
	ui.notify('Ticket item successfully deleted', 'info');
});
