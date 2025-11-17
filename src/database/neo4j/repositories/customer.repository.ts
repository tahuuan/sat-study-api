import { neo4jConnection } from '../../../config/database/neo4j/db.config'
import { Customer, CustomerNode } from '../models/customer.model'

export class CustomerRepository {
  async create(customer: Customer): Promise<Customer> {
    const session = neo4jConnection.getDriver().session()

    try {
      const result = await session.run(
        `
        CREATE (c:Customer $props)
        RETURN c
        `,
        { props: customer.toNode() }
      )

      return new Customer(result.records[0].get('c').properties as CustomerNode)
    }
    finally {
      await session.close()
    }
  }

  async findById(id: string): Promise<Customer | null> {
    const session = neo4jConnection.getDriver().session()

    try {
      const result = await session.run(
        `
        MATCH (c:Customer {id: $id})
        WHERE c.deletedAt IS NULL
        RETURN c
        `,
        { id }
      )

      if (result.records.length === 0) return null

      return new Customer(result.records[0].get('c').properties as CustomerNode)
    }
    finally {
      await session.close()
    }
  }

  // Thêm các methods khác...
}
