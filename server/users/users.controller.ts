import { Router, Request, Response } from 'express';
import { UsersService } from './users.service.js';
import { CreateUserDto, UpdateUserDto } from '../../src/shared/user.types.js';

export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Genera el router de Express para el módulo de usuarios
   */
  getRouter(): Router {
    const router = Router();
    
    router.get('/', (req, res) => this.findAll(req, res));
    router.get('/:id', (req, res) => this.findOne(req, res));
    router.post('/', (req, res) => this.create(req, res));
    router.put('/:id', (req, res) => this.update(req, res));
    router.delete('/:id', (req, res) => this.delete(req, res));
    
    return router;
  }

  // GET /api/users
  private findAll(req: Request, res: Response): void {
    try {
      const users = this.usersService.findAll();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
  }

  // GET /api/users/:id
  private findOne(req: Request, res: Response): void {
    try {
      const user = this.usersService.findOne(req.params.id);
      if (!user) {
        res.status(404).json({ message: `Usuario con ID ${req.params.id} no encontrado` });
        return;
      }
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
  }

  // POST /api/users
  private create(req: Request, res: Response): void {
    try {
      const { name, email, age } = req.body as CreateUserDto;

      // Validación como NestJS ValidationPipe
      const errors: string[] = [];
      if (!name || typeof name !== 'string' || name.trim() === '') {
        errors.push('El campo "name" es obligatorio y debe ser un texto no vacío.');
      }
      if (!email || typeof email !== 'string' || !email.includes('@')) {
        errors.push('El campo "email" es obligatorio y debe ser un correo electrónico válido.');
      }
      if (age === undefined || isNaN(Number(age)) || Number(age) < 0) {
        errors.push('El campo "age" es obligatorio y debe ser un número mayor o igual a 0.');
      }

      if (errors.length > 0) {
        res.status(400).json({
          statusCode: 400,
          message: 'Error de validación (Bad Request)',
          errors
        });
        return;
      }

      const newUser = this.usersService.create({ name, email, age: Number(age) });
      res.status(201).json(newUser);
    } catch (error: any) {
      res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
  }

  // PUT /api/users/:id
  private update(req: Request, res: Response): void {
    try {
      const id = req.params.id;
      const userExists = this.usersService.findOne(id);
      if (!userExists) {
        res.status(404).json({ message: `Usuario con ID ${id} no encontrado` });
        return;
      }

      const dto = req.body as UpdateUserDto;
      
      const errors: string[] = [];
      if (dto.name !== undefined && (typeof dto.name !== 'string' || dto.name.trim() === '')) {
        errors.push('El campo "name" debe ser un texto no vacío.');
      }
      if (dto.email !== undefined && (typeof dto.email !== 'string' || !dto.email.includes('@'))) {
        errors.push('El campo "email" debe ser un correo electrónico válido.');
      }
      if (dto.age !== undefined && (isNaN(Number(dto.age)) || Number(dto.age) < 0)) {
        errors.push('El campo "age" debe ser un número válido mayor o igual a 0.');
      }

      if (errors.length > 0) {
        res.status(400).json({
          statusCode: 400,
          message: 'Error de validación (Bad Request)',
          errors
        });
        return;
      }

      const updatedUser = this.usersService.update(id, dto);
      res.json(updatedUser);
    } catch (error: any) {
      res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
  }

  // DELETE /api/users/:id
  private delete(req: Request, res: Response): void {
    try {
      const success = this.usersService.delete(req.params.id);
      if (!success) {
        res.status(404).json({ message: `Usuario con ID ${req.params.id} no encontrado` });
        return;
      }
      res.status(200).json({ message: 'Usuario eliminado exitosamente', success: true });
    } catch (error: any) {
      res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
  }
}
