import { Router } from 'express';
import { SubjectController } from './subject.controller';

const router = Router();
const subjectController = new SubjectController();

router.get('/', subjectController.getSubjects.bind(subjectController));
router.get('/:subjectId', subjectController.getSubjectById.bind(subjectController));
router.get('/:subjectId/with-languages', subjectController.getSubjectWithLanguages.bind(subjectController));

export default router;