// vitest.setup.ts — solo para el proyecto `componentes` (jsdom). Ver ADR-016.
//
// `cleanup()` desmonta lo montado entre tests. Sin él, dos tests que montan el
// mismo componente dejan dos árboles en el mismo `document` y las consultas de
// Testing Library encuentran duplicados — un falso fallo que cuesta una tarde.

import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(cleanup);
