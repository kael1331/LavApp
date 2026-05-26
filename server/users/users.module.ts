import { Router } from 'express';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';

/**
 * UsersModule emula la modularidad y Dependency Injection de NestJS.
 * Se encarga de instanciar el servicio, inyectarlo en el controlador,
 * y exponer el router unificado para ser consumido en la aplicación de Express.
 */
export class UsersModule {
  private readonly usersService: UsersService;
  private readonly usersController: UsersController;

  constructor() {
    // Instanciamos el servicio (Provider)
    this.usersService = new UsersService();
    
    // Inyectamos el servicio en el controlador (Controller)
    this.usersController = new UsersController(this.usersService);
  }

  /**
   * Obtiene la instancia del servicio si se necesita desde otros módulos
   */
  getService(): UsersService {
    return this.usersService;
  }

  /**
   * Obtiene el Router configurado de este módulo listo para montar en Express
   */
  getRouter(): Router {
    return this.usersController.getRouter();
  }
}
