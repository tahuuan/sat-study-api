import { Neo4jConnection } from '../../../config/database/neo4j/db.config'
import { Customer, CustomerNode } from '../../neo4j/models/customer.model'

export class CustomerRepository {
  async create(customer: Customer): Promise<Customer> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const session = Neo4jConnection.getInstance().getDriver().session()

    try {
      const result = await session.run(
        `
        CREATE (c:Customer $props)
        RETURN c
        `,
        { props: customer.toNode() }
      )

      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      return new Customer(result.records[0].get('c').properties as CustomerNode)
    }
    finally {
      await session.close()
    }
  }

  async findById(id: string): Promise<Customer | null> {
    const session = Neo4jConnection.getInstance().getDriver().session()

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
}
