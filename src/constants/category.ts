import { colors } from '../theme/palette';

export type Category = {
  id: number;
  name: string;
  color: string;
  isSystem: boolean;
};
export type CreateCategoryInput = { name: string; color: string };

export type UpdateCategoryInput = { name?: string; color?: string };

export const categoryColors: string[] = [
  '#E89A64',
  '#5BAF98',
  '#65A7D8',
  '#A88CD8',
  '#DCA8B5',
  '#F2C46F',
  '#6DAFC0',
  '#7B96D2',
  '#9BAF74',
  '#D78D79',
  '#9D9FA8',
  '#D4A76C',
];

export const normalizeCategoryName = (name: string) =>
  name.replace(/^[\s\u3000]+|[\s\u3000]+$/g, '');
