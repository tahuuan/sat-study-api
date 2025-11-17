import express from 'express'
import { useContainer, useExpressServer } from 'routing-controllers'
import { container } from 'tsyringe'

export class App {
  public app: express.Application

  constructor() {
    this.app = express()
    this.initializeMiddlewares()
  }

  private initializeMiddlewares() {
    this.app.use(express.json())
    this.app.use((req, res, next) => {
      console.log(`${req.method} ${req.url}`)
      next()
    })
  }

  public setControllers(controllers: (new (...args: unknown[]) => any)[]) {
    // Create adapter for tsyringe container
    const tsyringeAdapter = {
      get: <T>(someClass: new (...args: unknown[]) => T): T => {
        return container.resolve(someClass)
      },
    }

    useContainer(tsyringeAdapter)

    useExpressServer(this.app, {
      controllers,
      defaultErrorHandler: false,
      validation: true,
    })
  }

  public setServices(services: (new (...args: unknown[]) => any)[]) {
    services.forEach(service => {
      container.resolve(service)
    })
  }
}
