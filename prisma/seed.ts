import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {

    // Create a company
    const company = await prisma.company.create({
        data: {
            name: 'Test Company',
            login: 'testcompany',
        }
    })

    console.log('Created company with id:', company.id)

    // Create an employee for the company
    const employee = await prisma.employee.create({
        data: {
            firstName: 'Test',
            lastName: 'Employee',
            companyId: company.id,
            maxHours: 8
        }
    })

    console.log('Created employee with id:', employee.id)

    // Create a job for the company and assign the employee to it
    const job = await prisma.job.create({
        data: {
            title: 'Make coffee',
            companyId: company.id,
            employeeIds: [employee.id],
            hours: 30
        }
    })

    console.log('Created job with id:', job.id)

    // Create a calander event for the job
    await prisma.event.create({
        data: {
            title: 'Make coffee',
            date: new Date(),
            color: 'red',
            jobId: job.id,
            companyId: company.id,
            employeeId: employee.id
        }
    })

    console.log('Created event')
}

// Run the seed function
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })