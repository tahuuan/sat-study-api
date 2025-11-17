import neo4j, { Driver } from 'neo4j-driver'

export class Neo4jConnection {
  private static instance: Neo4jConnection
  private readonly driver: Driver

  private constructor() {
    const URI = process.env.NEO4J_URI ?? 'neo4j://localhost:7687'
    const USER = process.env.NEO4J_USER ?? 'neo4j'
    const PASSWORD = process.env.NEO4J_PASSWORD ?? 'Admin@123'

    this.driver = neo4j.driver(
      URI,
      neo4j.auth.basic(USER, PASSWORD),
      {
        maxConnectionPoolSize: 50,
        logging: {
          level: 'info',
          logger: (level, message) => { console.log(`${level}: ${message}`) }
        }
      }
    )
  }

  public static getInstance(): Neo4jConnection {
    if (!Neo4jConnection.instance) {
      Neo4jConnection.instance = new Neo4jConnection()
    }

    return Neo4jConnection.instance
  }

  public getDriver(): Driver {
    return this.driver
  }

  public async verifyConnectivity(): Promise<void> {
    try {
      await this.driver.verifyConnectivity()
      console.log('Neo4j connection established successfully')
    }
    catch (error) {
      console.error('Neo4j connection failed:', error)

      throw error
    }
  }

  public async close(): Promise<void> {
    await this.driver.close()
  }
}
