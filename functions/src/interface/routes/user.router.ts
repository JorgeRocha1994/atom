import { Router } from 'express';
import { CreateUserUseCase, GetUserUseCase } from '../../application/use-cases';
import { FirestoreUserRepository } from '../../infrastructure/firestore/user.firestore.repository';
import { Firestore } from 'firebase-admin/firestore';
import { HttpStatus } from '../../shared/utils/enums';

export function userRouter(firestore: Firestore): Router {
  const router = Router();
  const authRepo = new FirestoreUserRepository(firestore);
  const createUser = new CreateUserUseCase(authRepo);
  const getUser = new GetUserUseCase(authRepo);

  router.get('/', async (req, res) => {
    try {
      const { email } = req.query as { email: string };

      if (!email?.trim()) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: 'Email is required' });
        return;
      }

      const response = await getUser.execute(email);
      res.status(response.status).json(response);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed to get user' });
    }
  });

  router.post('/', async (req, res) => {
    try {
      const { email } = req.body;

      if (!email?.trim()) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: 'Email is required' });
        return;
      }

      const response = await createUser.execute(email);
      res.status(response.status).json(response);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed to create user' });
    }
  });

  return router;
}
