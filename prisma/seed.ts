import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
	// Get current date and find the current week's Wednesday
	const today = new Date();
	const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
	const daysUntilWednesday = (3 - currentDay + 7) % 7; // 3 = Wednesday
	const wednesday = new Date(today);
	wednesday.setDate(today.getDate() + daysUntilWednesday);
	
	// Set time to beginning of day for date comparison
	const wednesdayDate = new Date(wednesday);
	wednesdayDate.setHours(0, 0, 0, 0);
	
	// Create work event times (8 AM - 5 PM)
	const workStart = new Date(wednesday);
	workStart.setHours(8, 0, 0, 0);
	
	const workEnd = new Date(wednesday);
	workEnd.setHours(17, 0, 0, 0);
	
	// Create lunch break times (12 PM - 1 PM)
	const lunchStart = new Date(wednesday);
	lunchStart.setHours(12, 0, 0, 0);
	
	const lunchEnd = new Date(wednesday);
	lunchEnd.setHours(13, 0, 0, 0);

	// Create a company
	const company = await prisma.company.create({
		data: {
			name: 'Test Company',
			login: 'testcompany'
		}
	});

	// console.log('Created company with id:', company.id)

	// Create an employee for the company
	const employee = await prisma.employee.create({
		data: {
			firstName: 'Test',
			lastName: 'Employee',
			companyId: company.id,
			maxHours: 8
		}
	});

	// console.log('Created employee with id:', employee.id)

	// Create a job for the company and assign the employee to it
	const job = await prisma.job.create({
		data: {
			title: 'Make coffee',
			companyId: company.id,
			employeeIds: [employee.id],
			hours: 30
		}
	});

	// console.log('Created job with id:', job.id)

	// Create a calendar event for the job
	await prisma.event.create({
		data: {
			title: 'Make Coffee - Test Employee',
			date: wednesdayDate,
			start: workStart,
			end: workEnd,
			color: '#b72205',
			jobId: job.id,
			companyId: company.id,
			employeeId: employee.id,
			signature: 'seed-event-1'
		}
	});

	// Create Lunch Break for the employee
	await prisma.event.create({
		data: {
			title: 'Lunch Break - Test Employee',
			date: wednesdayDate,
			start: lunchStart,
			end: lunchEnd,
			color: '#477e47',
			employeeId: employee.id,
			jobId: job.id,
			companyId: company.id,
			signature: 'seed-event-2'
		}
	});

	// console.log('Created events')
}

// Run the seed function
main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
